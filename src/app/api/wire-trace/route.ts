import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { extractComponents, traceWirePath, analyzeComponent } from '@/lib/ai/wire-tracing';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { action, diagramId, startComponent, endComponent, componentId } = body;

        // Get diagram
        const diagram = await prisma.diagram.findUnique({
            where: { id: diagramId },
        });

        if (!diagram || diagram.uploadedById !== session.user.id) {
            return NextResponse.json(
                { error: 'Diagram not found' },
                { status: 404 }
            );
        }

        const imageUrl = diagram.analysisImageUrl || diagram.fileUrl;

        switch (action) {
            case 'extract_components': {
                const components = await extractComponents(imageUrl);

                return NextResponse.json({
                    success: true,
                    components,
                    count: components.length,
                });
            }

            case 'trace_path': {
                if (!startComponent || !endComponent) {
                    return NextResponse.json(
                        { error: 'Start and end components required' },
                        { status: 400 }
                    );
                }

                // First get all components
                const components = await extractComponents(imageUrl);

                // Then trace path
                const path = await traceWirePath(
                    imageUrl,
                    startComponent,
                    endComponent,
                    components
                );

                if (!path) {
                    return NextResponse.json({
                        success: false,
                        error: 'Could not trace path between components',
                    });
                }

                return NextResponse.json({
                    success: true,
                    path,
                });
            }

            case 'analyze_component': {
                if (!componentId) {
                    return NextResponse.json(
                        { error: 'Component ID required' },
                        { status: 400 }
                    );
                }

                const analysis = await analyzeComponent(imageUrl, componentId);

                return NextResponse.json({
                    success: true,
                    analysis,
                });
            }

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Wire tracing API error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
