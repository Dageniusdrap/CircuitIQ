import { prisma } from '@/lib/db';

export type UsageAction =
    | 'DIAGRAM_UPLOAD'
    | 'AI_ANALYSIS'
    | 'PROCEDURE_VIEW'
    | 'EXPORT_PDF'
    | 'EXPORT_DXF'
    | 'API_CALL';

interface TrackUsageParams {
    userId: string;
    action: UsageAction;
    resourceId?: string;
    metadata?: Record<string, any>;
}

/**
 * Track a user action for analytics and billing
 */
export async function trackUsage({
    userId,
    action,
    resourceId,
    metadata
}: TrackUsageParams) {
    try {
        // Get current billing period
        const now = new Date();
        const billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const billingPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Create usage record
        await prisma.usageRecord.create({
            data: {
                userId,
                action,
                resourceId,
                metadata: metadata || {},
                billingPeriodStart,
                billingPeriodEnd,
            },
        });

        // Update monthly summary
        await updateUsageSummary(userId, action, now);

        return { success: true };
    } catch (error) {
        console.error('Error tracking usage:', error);
        // Don't throw - usage tracking should not block operations
        return { success: false, error };
    }
}

/**
 * Update or create monthly usage summary
 */
async function updateUsageSummary(userId: string, action: UsageAction, date: Date) {
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();

    // Get user's plan limits
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
    });

    if (!user) return;

    const planLimits = await prisma.planLimits.findUnique({
        where: { plan: user.plan },
    });

    // Determine which field to increment
    const incrementField = getIncrementField(action);
    if (!incrementField) return;

    // Upsert usage summary
    await prisma.usageSummary.upsert({
        where: {
            userId_month_year: {
                userId,
                month,
                year,
            },
        },
        create: {
            userId,
            month,
            year,
            [incrementField]: 1,
            uploadLimit: planLimits?.diagramUploadsPerMonth,
            analysisLimit: planLimits?.aiAnalysesPerMonth,
        },
        update: {
            [incrementField]: {
                increment: 1,
            },
        },
    });
}

/**
 * Get the usage summary field name for an action
 */
function getIncrementField(action: UsageAction): string | null {
    const fieldMap: Record<UsageAction, string> = {
        DIAGRAM_UPLOAD: 'diagramUploads',
        AI_ANALYSIS: 'aiAnalyses',
        PROCEDURE_VIEW: 'procedureViews',
        EXPORT_PDF: 'pdfExports',
        EXPORT_DXF: 'dxfExports',
        API_CALL: 'apiCalls',
    };

    return fieldMap[action] || null;
}

/**
 * Get current usage for a user
 */
export async function getCurrentUsage(userId: string) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const summary = await prisma.usageSummary.findUnique({
        where: {
            userId_month_year: {
                userId,
                month,
                year,
            },
        },
    });

    // Get user's plan limits
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
    });

    const planLimits = user
        ? await prisma.planLimits.findUnique({
            where: { plan: user.plan },
        })
        : null;

    return {
        current: summary || {
            diagramUploads: 0,
            aiAnalyses: 0,
            procedureViews: 0,
            pdfExports: 0,
            dxfExports: 0,
            apiCalls: 0,
        },
        limits: planLimits
            ? {
                diagramUploads: planLimits.diagramUploadsPerMonth,
                aiAnalyses: planLimits.aiAnalysesPerMonth,
                procedureViews: planLimits.procedureViewsPerMonth,
                pdfExports: planLimits.pdfExportsPerMonth,
                dxfExports: planLimits.dxfExportsPerMonth,
                apiCalls: planLimits.apiCallsPerMonth,
            }
            : {
                diagramUploads: null,
                aiAnalyses: null,
                procedureViews: null,
                pdfExports: null,
                dxfExports: null,
                apiCalls: null,
            },
    };
}

/**
 * Check if user has exceeded their limit for an action
 */
export async function checkUsageLimit(userId: string, action: UsageAction): Promise<{
    allowed: boolean;
    current: number;
    limit: number | null;
    percentage: number;
}> {
    const usage = await getCurrentUsage(userId);

    const field = getIncrementField(action);
    if (!field) {
        return { allowed: true, current: 0, limit: null, percentage: 0 };
    }

    const currentValue = usage.current[field as keyof typeof usage.current] as number;
    const limitValue = usage.limits[field as keyof typeof usage.limits] as number | null;

    // No limit means unlimited
    if (limitValue === null) {
        return { allowed: true, current: currentValue, limit: null, percentage: 0 };
    }

    const percentage = (currentValue / limitValue) * 100;
    const allowed = currentValue < limitValue;

    return {
        allowed,
        current: currentValue,
        limit: limitValue,
        percentage: Math.round(percentage),
    };
}

/**
 * Get usage analytics for a date range
 */
export async function getUsageAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date
) {
    const records = await prisma.usageRecord.findMany({
        where: {
            userId,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    // Group by action type
    const byAction = records.reduce((acc, record) => {
        acc[record.action] = (acc[record.action] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Group by day
    const byDay = records.reduce((acc, record) => {
        const day = record.createdAt.toISOString().split('T')[0];
        if (!acc[day]) acc[day] = {};
        acc[day][record.action] = (acc[day][record.action] || 0) + 1;
        return acc;
    }, {} as Record<string, Record<string, number>>);

    return {
        total: records.length,
        byAction,
        byDay,
        records,
    };
}
