import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Health Check Endpoint
 * 
 * This endpoint is used by UptimeRobot and other monitoring services
 * to verify the application is running and the database is accessible.
 * 
 * Returns:
 * - 200 OK if all systems are operational
 * - 503 Service Unavailable if database connection fails
 */
export async function GET() {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`

        // Get database connection status
        const timestamp = new Date().toISOString()

        return NextResponse.json({
            status: 'healthy',
            timestamp,
            checks: {
                database: 'connected',
                api: 'operational',
            },
            uptime: process.uptime(),
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        })
    } catch (error) {
        console.error('Health check failed:', error)

        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
            checks: {
                database: 'disconnected',
                api: 'operational',
            },
        }, {
            status: 503,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        })
    }
}
