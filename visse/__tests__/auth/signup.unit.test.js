import prisma from "../../__mocks__/prisma";

// Função que simula cadastro
async function registerUser({ name, email, password }) {
  if (!email || !password) throw new Error("Campos obrigatórios");
  return await prisma.user.create({ data: { name, email, password } });
}

describe("registerUser", () => {
  it("deve criar usuário com sucesso", async () => {
    prisma.user.create.mockResolvedValue({
      id: 1,
      name: "Teste",
      email: "teste@email.com",
    });

    const result = await registerUser({
      name: "Teste",
      email: "teste@email.com",
      password: "123456",
    });

    expect(result).toHaveProperty("id", 1);
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });

  it("deve lançar erro se faltar email", async () => {
    await expect(
      registerUser({ name: "SemEmail", password: "123" })
    ).rejects.toThrow("Campos obrigatórios");
  });
});
