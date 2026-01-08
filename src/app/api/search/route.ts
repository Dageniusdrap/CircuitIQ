import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';
        const type = searchParams.get('type') || 'all'; // all, diagrams, procedures
        const vehicleType = searchParams.get('vehicleType');
        const system = searchParams.get('system');

        if (!query || query.length < 2) {
            return NextResponse.json({
                diagrams: [],
                procedures: [],
                total: 0,
            });
        }

        const results: {
            diagrams: any[];
            procedures: any[];
            total: number;
        } = {
            diagrams: [],
            procedures: [],
            total: 0,
        };

        // Search diagrams
        if (type === 'all' || type === 'diagrams') {
            const diagramResults = await prisma.diagram.findMany({
                where: {
                    uploadedById: session.user.id,
                    OR: [
                        {
                            title: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            manufacturer: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            model: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            system: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    ],
                    ...(vehicleType && { vehicleType: vehicleType as any }),
                    ...(system && { system }),
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    vehicleType: true,
                    manufacturer: true,
                    model: true,
                    system: true,
                    fileUrl: true,
                    fileType: true,
                    createdAt: true,
                },
                take: 20,
                orderBy: {
                    createdAt: 'desc',
                },
            });

            results.diagrams = diagramResults;
        }

        // Search procedures (from static data)
        if (type === 'all' || type === 'procedures') {
            // Import procedure data dynamically
            const { searchProcedures } = await import('@/lib/data/procedures');
            const procedureResults = searchProcedures(query);

            // Apply filters
            let filteredProcedures = procedureResults;

            if (vehicleType) {
                const vehicleTypeMap: Record<string, string> = {
                    AIRCRAFT: 'aircraft',
                    AUTOMOTIVE: 'automotive',
                    MARINE: 'marine',
                    ELECTRIC_VEHICLE: 'electric',
                };
                const mappedType = vehicleTypeMap[vehicleType];
                if (mappedType) {
                    filteredProcedures = filteredProcedures.filter(
                        p => p.category === mappedType
                    );
                }
            }

            if (system) {
                filteredProcedures = filteredProcedures.filter(
                    p => p.system.toLowerCase().includes(system.toLowerCase())
                );
            }

            results.procedures = filteredProcedures.slice(0, 20);
        }

        results.total = results.diagrams.length + results.procedures.length;

        return NextResponse.json(results);
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        );
    }
}
