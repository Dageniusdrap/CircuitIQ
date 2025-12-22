import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@wirediag.com' },
        update: {},
        create: {
            email: 'admin@wirediag.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    console.log('Created admin user:', admin.email)

    // Create sample technician
    const techPassword = await bcrypt.hash('tech123', 10)

    const tech = await prisma.user.upsert({
        where: { email: 'tech@wirediag.com' },
        update: {},
        create: {
            email: 'tech@wirediag.com',
            name: 'John Technician',
            password: techPassword,
            role: 'TECHNICIAN',
        },
    })

    console.log('Created technician user:', tech.email)

    // Create a sample diagram
    const diagram = await prisma.diagram.create({
        data: {
            title: "Boeing 737 landing Gear System",
            vehicleType: "AIRCRAFT",
            manufacturer: "Boeing",
            model: "737-800",
            year: 2018,
            system: "Landing Gear",
            status: "COMPLETED",
            fileUrl: "https://placehold.co/1920x1080.png?text=Boeing+737+Landing+Gear+Diagram",
            fileKey: "demo-key",
            fileType: "png",
            fileSize: 1024000,
            uploadedById: admin.id,
            confidence: 98.5,
            components: {
                create: [
                    {
                        name: "Landing Gear Control Relay R5",
                        type: "relay",
                        partNumber: "R5-737-LG",
                        function: "Controls power to main gear actuators",
                        location: "E3 Equipment Bay",
                        xPosition: 10,
                        yPosition: 20,
                    },
                    {
                        name: "Main Gear Actuator Left",
                        type: "actuator",
                        partNumber: "ACT-LG-L-01",
                        function: "Extends/Retracts left main gear",
                        location: "Left Wheel Well",
                        xPosition: 40,
                        yPosition: 50,
                    },
                    {
                        name: "28V DC Bus 1",
                        type: "power_source",
                        function: "Main power distribution",
                        xPosition: 5,
                        yPosition: 5,
                    }
                ]
            }
        },
        include: {
            components: true
        }
    })

    console.log('Created sample diagram:', diagram.title)

    // Create connections
    const r5 = diagram.components.find(c => c.name.includes("R5"))
    const actuator = diagram.components.find(c => c.name.includes("Actuator"))
    const power = diagram.components.find(c => c.name.includes("Power") || c.name.includes("Bus"))

    if (r5 && actuator && power) {
        await prisma.componentConnection.createMany({
            data: [
                {
                    fromId: power.id,
                    toId: r5.id,
                    wireColor: "Red",
                    wireGauge: "12AWG",
                    signalType: "power",
                    voltage: "28V DC"
                },
                {
                    fromId: r5.id,
                    toId: actuator.id,
                    wireColor: "White",
                    wireGauge: "14AWG",
                    signalType: "signal",
                    voltage: "28V DC"
                }
            ]
        })
        console.log('Created sample connections')
    }

    console.log('Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
