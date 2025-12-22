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

    // Create Automotive Diagram: 2020 Ford F-150 Headlight System
    const autoDiagram = await prisma.diagram.create({
        data: {
            title: "2020 Ford F-150 Headlight System",
            vehicleType: "AUTOMOTIVE",
            manufacturer: "Ford",
            model: "F-150",
            year: 2020,
            system: "Exterior Lighting",
            systemCode: "26", // SAE J1939 equivalent for Lighting is roughly comparable
            status: "COMPLETED",
            fileUrl: "https://placehold.co/1920x1080.png?text=Ford+F-150+Headlight+Wiring+Map",
            fileKey: "demo-auto-key",
            fileType: "png",
            fileSize: 2048000,
            uploadedById: admin.id,
            confidence: 99.1,
            components: {
                create: [
                    {
                        name: "Body Control Module (BCM)",
                        type: "module",
                        partNumber: "JU5T-14B476-AA",
                        function: "Controls lighting logic",
                        location: "Passenger Kick Panel",
                        xPosition: 15,
                        yPosition: 15,
                    },
                    {
                        name: "Left Headlight Assembly",
                        type: "load",
                        partNumber: "L1Z-13008-F",
                        function: "Illumination",
                        location: "Front Left",
                        xPosition: 70,
                        yPosition: 30,
                    },
                    {
                        name: "Headlight Switch",
                        type: "switch",
                        partNumber: "FL3Z-11654-BA",
                        function: "Driver Input",
                        location: "Dashboard",
                        xPosition: 10,
                        yPosition: 50,
                    }
                ]
            }
        },
        include: { components: true }
    })
    console.log('Created automotive diagram:', autoDiagram.title)

    // Create connections for Automotive
    const bcm = autoDiagram.components.find(c => c.name.includes("BCM"))
    const headlight = autoDiagram.components.find(c => c.name.includes("Headlight Assembly"))
    const lightSwitch = autoDiagram.components.find(c => c.name.includes("Switch"))

    if (bcm && headlight && lightSwitch) {
        await prisma.componentConnection.createMany({
            data: [
                {
                    fromId: lightSwitch.id,
                    toId: bcm.id,
                    wireColor: "Yellow/Violet",
                    wireGauge: "18AWG",
                    signalType: "data",
                    voltage: "5V"
                },
                {
                    fromId: bcm.id,
                    toId: headlight.id,
                    wireColor: "Blue/White",
                    wireGauge: "16AWG",
                    signalType: "power",
                    voltage: "12V"
                }
            ]
        })
    }


    // Create Marine Diagram: Sea Ray 320 Sundancer Bilge System
    const marineDiagram = await prisma.diagram.create({
        data: {
            title: "Sea Ray 320 Bilge Pump System",
            vehicleType: "MARINE", // This needs to be consistent with your enum or check
            manufacturer: "Sea Ray",
            model: "Sundancer 320",
            year: 2019,
            system: "Bilge \u0026 Pumps",
            status: "COMPLETED",
            fileUrl: "https://placehold.co/1920x1080.png?text=Sea+Ray+Bilge+Wiring+Schematic",
            fileKey: "demo-marine-key",
            fileType: "png",
            fileSize: 1560000,
            uploadedById: admin.id,
            confidence: 96.4,
            components: {
                create: [
                    {
                        name: "Main DC Breaker Panel",
                        type: "panel",
                        function: "Distribution Protection",
                        location: "Cabin",
                        xPosition: 10,
                        yPosition: 10,
                    },
                    {
                        name: "Aft Bilge Pump",
                        type: "pump",
                        partNumber: "RULE-2000",
                        function: "Water Evacuation",
                        location: "Engine Room Bilge",
                        xPosition: 60,
                        yPosition: 80,
                    },
                    {
                        name: "Float Switch",
                        type: "switch",
                        partNumber: "RULE-35A",
                        function: "Auto Activation",
                        location: "Engine Room Bilge",
                        xPosition: 55,
                        yPosition: 85,
                    }
                ]
            }
        },
        include: { components: true }
    })
    console.log('Created marine diagram:', marineDiagram.title)

    // Create connections for Marine
    const panel = marineDiagram.components.find(c => c.name.includes("Panel"))
    const pump = marineDiagram.components.find(c => c.name.includes("Pump"))
    const float = marineDiagram.components.find(c => c.name.includes("Float"))

    if (panel && pump && float) {
        await prisma.componentConnection.createMany({
            data: [
                {
                    fromId: panel.id,
                    toId: float.id,
                    wireColor: "Brown",
                    wireGauge: "14AWG",
                    signalType: "power",
                    voltage: "12V"
                },
                {
                    fromId: float.id,
                    toId: pump.id,
                    wireColor: "Brown/Red",
                    wireGauge: "14AWG",
                    signalType: "power",
                    voltage: "12V"
                }
            ]
        })
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
