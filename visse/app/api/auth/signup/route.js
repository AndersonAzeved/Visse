// app/api/auth/signup/route.js
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validações
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: "Nome, email e senha são obrigatórios" 
        },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false,
          message: "Senha deve ter pelo menos 6 caracteres" 
        },
        { status: 400 }
      )
    }

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          message: "Usuário já existe com este email" 
        },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    return NextResponse.json(
      { 
        success: true,
        message: "Usuário criado com sucesso",
        data: user
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { 
        success: false,
        message: "Erro interno do servidor" 
      },
      { status: 500 }
    )
  }
}
