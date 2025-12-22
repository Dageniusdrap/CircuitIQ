"use server"

import { prisma } from "@/lib/db"

export async function getConfirmedFixes(symptom: string, vehicleModel: string) {
    if (!symptom) return []

    // In a real app, this would use fuzzy search or vector embeddings
    const fixes = await prisma.confirmedFix.findMany({
        where: {
            OR: [
                { symptom: { contains: symptom, mode: 'insensitive' } },
                { vehicleModel: { contains: vehicleModel, mode: 'insensitive' } }
            ]
        },
        orderBy: { votes: 'desc' },
        take: 5
    })

    return fixes
}
