import { PrismaClient, SubscriptionPlan } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPlanLimits() {
    console.log('🌱 Seeding plan limits...');

    // FREE Plan - Entry level for trying the platform
    await prisma.planLimits.upsert({
        where: { plan: 'FREE' },
        update: {},
        create: {
            plan: SubscriptionPlan.FREE,

            // Monthly limits
            diagramUploadsPerMonth: 5,
            aiAnalysesPerMonth: 3,
            procedureViewsPerMonth: null, // Unlimited
            pdfExportsPerMonth: null, // No exports on free
            dxfExportsPerMonth: null,
            apiCallsPerMonth: null, // No API access

            // Storage limits
            maxStorageGB: 1, // 1 GB total
            maxFileSize: 10, // 10 MB per file

            // Feature flags
            teamCollaboration: false,
            apiAccess: false,
            prioritySupport: false,
            customAITraining: false,
            whiteLabeling: false,

            // Team limits
            maxTeamMembers: 1, // Solo only
        },
    });

    console.log('✅ FREE plan seeded');

    // PROFESSIONAL Plan - For serious technicians and small teams
    await prisma.planLimits.upsert({
        where: { plan: 'PROFESSIONAL' },
        update: {},
        create: {
            plan: SubscriptionPlan.PROFESSIONAL,

            // Monthly limits
            diagramUploadsPerMonth: null, // Unlimited
            aiAnalysesPerMonth: 100,
            procedureViewsPerMonth: null, // Unlimited
            pdfExportsPerMonth: null, // Unlimited
            dxfExportsPerMonth: 50,
            apiCallsPerMonth: null, // No API on Pro

            // Storage limits
            maxStorageGB: 50, // 50 GB
            maxFileSize: 100, // 100 MB per file

            // Feature flags
            teamCollaboration: true,
            apiAccess: false,
            prioritySupport: true,
            customAITraining: false,
            whiteLabeling: false,

            // Team limits
            maxTeamMembers: 5,
        },
    });

    console.log('✅ PROFESSIONAL plan seeded');

    // ENTERPRISE Plan - Unlimited everything for large organizations
    await prisma.planLimits.upsert({
        where: { plan: 'ENTERPRISE' },
        update: {},
        create: {
            plan: SubscriptionPlan.ENTERPRISE,

            // Monthly limits (all unlimited)
            diagramUploadsPerMonth: null,
            aiAnalysesPerMonth: null,
            procedureViewsPerMonth: null,
            pdfExportsPerMonth: null,
            dxfExportsPerMonth: null,
            apiCallsPerMonth: 10000, // Generous API limit

            // Storage limits
            maxStorageGB: null, // Unlimited
            maxFileSize: 500, // 500 MB per file

            // Feature flags (all enabled)
            teamCollaboration: true,
            apiAccess: true,
            prioritySupport: true,
            customAITraining: true,
            whiteLabeling: true,

            // Team limits
            maxTeamMembers: null, // Unlimited
        },
    });

    console.log('✅ ENTERPRISE plan seeded');

    console.log('\n🎉 Plan limits seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('FREE: 5 uploads, 3 AI analyses, 1 user');
    console.log('PROFESSIONAL: Unlimited uploads, 100 AI analyses, 5 users');
    console.log('ENTERPRISE: Unlimited everything, API access, unlimited users');
}

async function main() {
    try {
        await seedPlanLimits();
    } catch (error) {
        console.error('Error seeding plan limits:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
