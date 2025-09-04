import prisma from "../../__mocks__/prisma";

async function deleteUser(id) {
  return await prisma.user.delete({ where: { id } });
}

describe("deleteUser", () => {
  it("deve deletar usuário", async () => {
    prisma.user.delete.mockResolvedValue({ id: 1 });

    const result = await deleteUser(1);

    expect(result).toHaveProperty("id", 1);
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
