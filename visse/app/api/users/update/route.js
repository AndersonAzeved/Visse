// app/api/users/update/route.js
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function PUT(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, email, currentPassword, newPassword } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { message: "Nome e email são obrigatórios" },
        { status: 400 }
      )
    }

    // Busca o usuário atual
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    // Verifica se o email já existe (se diferente do atual)
    if (email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { message: "Este email já está em uso" },
          { status: 400 }
        )
      }
    }

    // Prepara os dados para atualização
    const updateData = {
      name,
      email,
    }

    // Se quiser alterar a senha
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Senha atual é obrigatória para alterar a senha" },
          { status: 400 }
        )
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { message: "Nova senha deve ter pelo menos 6 caracteres" },
          { status: 400 }
        )
      }

      // Verifica a senha atual
      if (currentUser.password) {
        const isCurrentPasswordValid = await bcrypt.compare(
          currentPassword,
          currentUser.password
        )

        if (!isCurrentPasswordValid) {
          return NextResponse.json(
            { message: "Senha atual incorreta" },
            { status: 400 }
          )
        }
      }

      // Hash da nova senha
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    // Atualiza o usuário
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: "Perfil atualizado com sucesso",
      user: updatedUser
    })

  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}