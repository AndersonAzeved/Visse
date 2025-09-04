// app/api/users/delete/route.js
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function DELETE(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Não autenticado" },
        { status: 401 }
      )
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Senha é obrigatória para deletar a conta" },
        { status: 400 }
      )
    }

    // Busca o usuário atual
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    // Verifica a senha
    if (currentUser.password) {
      const isPasswordValid = await bcrypt.compare(
        password,
        currentUser.password
      )

      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: "Senha incorreta" },
          { status: 400 }
        )
      }
    }

    // Deleta o usuário e suas sessões/contas relacionadas
    const result = await prisma.$transaction(async (tx) => {
      // Deleta sessões
      await tx.session.deleteMany({
        where: { userId: currentUser.id }
      })

      // Deleta contas
      await tx.account.deleteMany({
        where: { userId: currentUser.id }
      })

      // Deleta o usuário
      const deletedUser = await tx.user.delete({
        where: { id: currentUser.id },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      return deletedUser
    })

    return NextResponse.json({
      success: true,
      message: "Conta deletada com sucesso",
      data: {
        deletedUser: result
      }
    })

  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}