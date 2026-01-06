import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST() {
    try {
        // Authenticate
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update all PENDING diagrams to COMPLETED
        const result = await prisma.diagram.updateMany({
            where: {
                uploadedById: session.user.id,
                status: 'PENDING',
            },
            data: {
                status: 'COMPLETED',
            },
        });

        return NextResponse.json({
            success: true,
            updated: result.count,
            message: `Updated ${result.count} diagrams to COMPLETED status`,
        });
    } catch (error) {
        console.error('Fix status error:', error);
        return NextResponse.json(
            { error: 'Failed to update status' },
            { status: 500 }
        );
    }
}
