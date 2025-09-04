// app/api/users/search/route.js
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    console.log("Search query:", query)

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ users: [] })
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              //mode: 'insensitive'
            }
          },
          {
            email: {
              contains: query,
              //mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true
      },
      take: 20 // Limita a 20 resultados
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}