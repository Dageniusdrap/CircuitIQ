import { PrismaClient, VehicleType, ProcessingStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding CircuitIQ database...')
    console.log('='.repeat(60))

    // Create Demo User (Free Plan) - Easy to remember credentials
    const demoPassword = await bcrypt.hash('Demo123!', 12)
    const demo = await prisma.user.upsert({
        where: { email: 'demo@circuitiq.com' },
        update: {},
        create: {
            email: 'demo@circuitiq.com',
            name: 'Demo User',
            password: demoPassword,
            role: 'TECHNICIAN',
            plan: 'FREE',
            emailVerified: new Date(),
        },
    })
    console.log('✅ Created demo user: demo@circuitiq.com')

    // Create Test User (Pro Plan)
    const testPassword = await bcrypt.hash('TestUser123!', 12)
    const test = await prisma.user.upsert({
        where: { email: 'test@circuitiq.com' },
        update: {},
        create: {
            email: 'test@circuitiq.com',
            name: 'Test Engineer',
            password: testPassword,
            role: 'ENGINEER',
            plan: 'PROFESSIONAL',
            emailVerified: new Date(),
        },
    })
    console.log('✅ Created test user: test@circuitiq.com')

    // Create Admin User (Enterprise Plan)
    const adminPassword = await bcrypt.hash('Admin123!', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@circuitiq.com' },
        update: {},
        create: {
            email: 'admin@circuitiq.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
            plan: 'ENTERPRISE',
            emailVerified: new Date(),
        },
    })
    console.log('✅ Created admin user: admin@circuitiq.com')

    // Keep the old wirediag users for backward compatibility
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await prisma.user.upsert({
        where: { email: 'admin@wirediag.com' },
        update: {},
        create: {
            email: 'admin@wirediag.com',
            name: 'Legacy Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    const techPassword = await bcrypt.hash('tech123', 10)
    await prisma.user.upsert({
        where: { email: 'tech@wirediag.com' },
        update: {},
        create: {
            email: 'tech@wirediag.com',
            name: 'John Technician',
            password: techPassword,
            role: 'TECHNICIAN',
        },
    })

    console.log('\n📊 Creating sample diagrams...')

    // Create a sample diagram - Boeing 737 Landing Gear
    const diagram = await prisma.diagram.upsert({
        where: { id: 'demo-737-landing-gear' },
        update: {},
        create: {
            id: 'demo-737-landing-gear',
            title: "Boeing 737 Landing Gear System",
            description: "Complete landing gear electrical system including position indicators, door actuators, and warning circuits. ATA Chapter 32.",
            vehicleType: "AIRCRAFT",
            manufacturer: "Boeing",
            model: "737-800",
            year: 2018,
            system: "Landing Gear",
            systemCode: "32-31-00",
            status: "COMPLETED",
            fileUrl: "https://placehold.co/1920x1080.png?text=Boeing+737+Landing+Gear+Diagram",
            fileKey: "demo-737-lg",
            fileType: "png",
            fileSize: 1024000,
            uploadedById: admin.id,
            confidence: 98.5,
        },
    })
    console.log('  ✈️ Created:', diagram.title)

    // Create components for the diagram
    const components = await Promise.all([
        prisma.component.upsert({
            where: { id: 'comp-lg-relay-r5' },
            update: {},
            create: {
                id: 'comp-lg-relay-r5',
                diagramId: diagram.id,
                name: "Landing Gear Control Relay R5",
                type: "relay",
                partNumber: "R5-737-LG",
                function: "Controls power to main gear actuators. Energizes on gear selection and opens on up-lock confirmation.",
                location: "E3 Equipment Bay, Panel P6",
                locationCode: "E3-P6",
                xPosition: 10,
                yPosition: 20,
                extractedByAI: true,
                confidence: 96.5,
            },
        }),
        prisma.component.upsert({
            where: { id: 'comp-lg-actuator-left' },
            update: {},
            create: {
                id: 'comp-lg-actuator-left',
                diagramId: diagram.id,
                name: "Main Gear Actuator Left",
                type: "actuator",
                partNumber: "ACT-LG-L-01",
                function: "Extends/Retracts left main gear assembly. Hydraulic actuator with electrical position feedback.",
                location: "Left Wheel Well",
                locationCode: "LWW-1",
                xPosition: 40,
                yPosition: 50,
                extractedByAI: true,
                confidence: 94.2,
            },
        }),
        prisma.component.upsert({
            where: { id: 'comp-lg-power-bus' },
            update: {},
            create: {
                id: 'comp-lg-power-bus',
                diagramId: diagram.id,
                name: "28V DC Bus 1",
                type: "power_source",
                function: "Main DC power distribution bus. Supplies all landing gear control circuits.",
                location: "P6 Panel",
                locationCode: "P6-BUS1",
                xPosition: 5,
                yPosition: 5,
                extractedByAI: true,
                confidence: 99.1,
            },
        }),
    ])

    // Create connections
    const r5 = components.find(c => c.name.includes("R5"))
    const actuator = components.find(c => c.name.includes("Actuator"))
    const power = components.find(c => c.name.includes("Bus"))

    if (r5 && actuator && power) {
        await prisma.componentConnection.upsert({
            where: { id: 'conn-power-r5' },
            update: {},
            create: {
                id: 'conn-power-r5',
                fromId: power.id,
                toId: r5.id,
                wireColor: "Red",
                wireGauge: "12AWG",
                signalType: "power",
                voltage: "28V DC",
                expectedVoltage: 28,
            },
        })
        await prisma.componentConnection.upsert({
            where: { id: 'conn-r5-actuator' },
            update: {},
            create: {
                id: 'conn-r5-actuator',
                fromId: r5.id,
                toId: actuator.id,
                wireColor: "White",
                wireGauge: "14AWG",
                signalType: "signal",
                voltage: "28V DC",
                expectedVoltage: 28,
            },
        })
    }

    // Create Automotive Diagram: Ford F-150
    const autoDiagram = await prisma.diagram.upsert({
        where: { id: 'demo-f150-headlight' },
        update: {},
        create: {
            id: 'demo-f150-headlight',
            title: "2020 Ford F-150 Headlight System",
            description: "Complete headlight wiring including BCM control, LED drivers, and auto headlight sensors.",
            vehicleType: "AUTOMOTIVE",
            manufacturer: "Ford",
            model: "F-150",
            year: 2020,
            system: "Exterior Lighting",
            systemCode: "26",
            status: "COMPLETED",
            fileUrl: "https://placehold.co/1920x1080.png?text=Ford+F-150+Headlight+Wiring",
            fileKey: "demo-f150-hl",
            fileType: "png",
            fileSize: 2048000,
            uploadedById: test.id,
            confidence: 99.1,
        },
    })
    console.log('  🚗 Created:', autoDiagram.title)

    // Create Marine Diagram: Sea Ray
    const marineDiagram = await prisma.diagram.upsert({
        where: { id: 'demo-searay-bilge' },
        update: {},
        create: {
            id: 'demo-searay-bilge',
            title: "Sea Ray 320 Bilge Pump System",
            description: "Automatic and manual bilge pump control with float switch and panel indicators.",
            vehicleType: "MARINE",
            manufacturer: "Sea Ray",
            model: "Sundancer 320",
            year: 2019,
            system: "Bilge & Pumps",
            status: "COMPLETED",
            fileUrl: "https://placehold.co/1920x1080.png?text=Sea+Ray+Bilge+Wiring",
            fileKey: "demo-searay-bp",
            fileType: "png",
            fileSize: 1560000,
            uploadedById: demo.id,
            confidence: 96.4,
        },
    })
    console.log('  ⛵ Created:', marineDiagram.title)

    // Create Electric Vehicle Diagram: Tesla Model 3
    const evDiagram = await prisma.diagram.upsert({
        where: { id: 'demo-tesla-bms' },
        update: {},
        create: {
            id: 'demo-tesla-bms',
            title: "Tesla Model 3 Battery Management System",
            description: "High voltage battery management including cell monitoring, thermal control, and charging circuits.",
            vehicleType: "ELECTRIC_VEHICLE",
            manufacturer: "Tesla",
            model: "Model 3",
            year: 2023,
            system: "Battery Management",
            systemCode: "BMS-01",
            status: "COMPLETED",
            fileUrl: "https://placehold.co/1920x1080.png?text=Tesla+Model+3+BMS",
            fileKey: "demo-tesla-bms",
            fileType: "png",
            fileSize: 1850000,
            uploadedById: test.id,
            confidence: 92.3,
        },
    })
    console.log('  ⚡ Created:', evDiagram.title)

    // Create sample analysis
    console.log('\n🔬 Creating sample analysis...')
    await prisma.analysis.upsert({
        where: { id: 'analysis-demo-1' },
        update: {},
        create: {
            id: 'analysis-demo-1',
            diagramId: diagram.id,
            userId: demo.id,
            symptom: "Landing gear indicator lights are intermittent - all three gear show random flickering during gear cycle",
            additionalContext: "Issue started after heavy rain operation. All three lights affected simultaneously.",
            aiResponse: {
                summary: "High probability of ground circuit issue based on symptom pattern",
                confidence: 89,
            },
            suggestedTests: [
                { name: "Ground resistance check", priority: 1 },
                { name: "Connector inspection P6-A", priority: 2 },
                { name: "Relay coil voltage measurement", priority: 3 },
            ],
            probableCauses: [
                { cause: "Corroded ground at P6-A pin 32", confidence: 85 },
                { cause: "Intermittent relay R5", confidence: 45 },
                { cause: "Faulty indication logic board", confidence: 25 },
            ],
            chatHistory: [
                { role: "user", content: "Gear lights are flickering" },
                { role: "assistant", content: "I'll help diagnose this. When does the flickering occur?" },
                { role: "user", content: "During gear extension and retraction" },
            ],
            completedAt: new Date(),
            successful: true,
            resolution: "Found and cleaned corroded ground terminal at P6-A pin 32",
            rootCause: "Moisture ingress causing ground circuit corrosion",
            helpful: true,
            accuracy: 5,
        },
    })
    console.log('  🔍 Created sample analysis for landing gear issue')

    // Create confirmed fix
    console.log('\n💡 Creating confirmed fixes...')
    await prisma.confirmedFix.upsert({
        where: { id: 'fix-lg-ground' },
        update: {},
        create: {
            id: 'fix-lg-ground',
            symptom: "Landing gear indicator lights intermittent - all three gear show random flickering",
            vehicleMake: "Boeing",
            vehicleModel: "737-800",
            componentName: "Landing Gear Control Unit Ground",
            fixDescription: "Replace corroded ground wire at connector P6-A pin 32. Common issue due to moisture ingress.",
            steps: [
                "Disconnect power from LG Control Unit",
                "Access connector P6-A behind panel in E3 bay",
                "Inspect pin 32 for corrosion (green oxidation)",
                "Clean connector with DeoxIT or replace terminal",
                "Apply dielectric grease before reconnection",
                "Perform operational test per AMM 32-31-00",
            ],
            difficulty: "Medium",
            averageCost: 150.0,
            averageTime: 90,
            timesSolved: 47,
            votes: 23,
        },
    })

    await prisma.confirmedFix.upsert({
        where: { id: 'fix-f150-headlight' },
        update: {},
        create: {
            id: 'fix-f150-headlight',
            symptom: "Headlights flicker or stay dim on Ford F-150",
            vehicleMake: "Ford",
            vehicleModel: "F-150",
            componentName: "BCM Headlight Driver",
            fixDescription: "Check BCM ground connections and reprogram BCM if needed. TSB 20-2334 applies.",
            steps: [
                "Check battery voltage (should be 12.4-12.8V)",
                "Inspect BCM ground G201 under dash",
                "Use Ford IDS to check for BCM DTCs",
                "Perform BCM recalibration if no hardware faults",
                "Replace BCM if calibration fails",
            ],
            difficulty: "Hard",
            averageCost: 350.0,
            averageTime: 120,
            timesSolved: 89,
            votes: 56,
        },
    })
    console.log('  ✅ Created 2 confirmed fixes')

    // Create subscriptions for test users
    console.log('\n📦 Creating subscriptions...')
    await prisma.subscription.upsert({
        where: { userId: test.id },
        update: {},
        create: {
            userId: test.id,
            plan: 'PROFESSIONAL',
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            diagramsUsed: 4,
            analysesUsed: 12,
            aiQueriesUsed: 45,
        },
    })
    await prisma.subscription.upsert({
        where: { userId: admin.id },
        update: {},
        create: {
            userId: admin.id,
            plan: 'ENTERPRISE',
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            diagramsUsed: 25,
            analysesUsed: 87,
            aiQueriesUsed: 234,
        },
    })
    console.log('  ✅ Created subscriptions')

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 Database seeding completed successfully!')
    console.log('='.repeat(60))
    console.log('\n📋 TEST CREDENTIALS:')
    console.log('-'.repeat(60))
    console.log('Demo (Free):        demo@circuitiq.com / Demo123!')
    console.log('Test (Pro):         test@circuitiq.com / TestUser123!')
    console.log('Admin (Enterprise): admin@circuitiq.com / Admin123!')
    console.log('-'.repeat(60))
    console.log('\n📊 SAMPLE DATA:')
    console.log('   • 5 test users (3 new, 2 legacy)')
    console.log('   • 4 sample diagrams (aircraft, automotive, marine, EV)')
    console.log('   • 3 components with connections')
    console.log('   • 1 sample analysis with chat history')
    console.log('   • 2 confirmed fixes')
    console.log('   • 2 subscriptions (Pro and Enterprise)')
    console.log('\n')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
