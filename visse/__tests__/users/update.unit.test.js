import prisma from "../../__mocks__/prisma";

async function updateUser(id, data) {
  return await prisma.user.update({ where: { id }, data });
}

describe("updateUser", () => {
  it("deve atualizar usuário", async () => {
    prisma.user.update.mockResolvedValue({
      id: 1,
      name: "Novo Nome",
      email: "novo@email.com",
    });

    const result = await updateUser(1, {
      name: "Novo Nome",
      email: "novo@email.com",
    });

    expect(result).toHaveProperty("email", "novo@email.com");
  });
});
