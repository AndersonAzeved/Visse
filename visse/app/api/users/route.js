import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

export async function POST(req) {
  const data = await req.json();
  const user = await prisma.user.create({ data });
  return Response.json(user, { status: 201 });
}

export async function PUT(req) {
  const data = await req.json();
  const { id, name, email } = data;

  const updated = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email },
  });

  return Response.json(updated);
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  await prisma.user.delete({
    where: { id: Number(userId) },
  });

  return Response.json({ message: "Usuário removido" });
}
