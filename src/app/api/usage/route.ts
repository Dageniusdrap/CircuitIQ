import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCurrentUsage } from '@/lib/usage-tracking';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const usage = await getCurrentUsage(session.user.id);

        return NextResponse.json(usage);
    } catch (error) {
        console.error('Usage API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch usage data' },
            { status: 500 }
        );
    }
}
