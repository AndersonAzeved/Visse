import prisma from "../../__mocks__/prisma";

async function searchUsers(query) {
  return await prisma.user.findMany({ where: { name: { contains: query } } });
}

describe("searchUsers", () => {
  it("deve buscar usuários pelo nome", async () => {
    prisma.user.findMany.mockResolvedValue([
      { id: 1, name: "Maria", email: "maria@email.com" },
    ]);

    const result = await searchUsers("Maria");

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("name", "Maria");
  });
});
