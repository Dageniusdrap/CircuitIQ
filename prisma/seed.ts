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
