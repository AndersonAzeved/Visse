import prisma from "../../__mocks__/prisma";

describe("prisma mock", () => {
  it("deve ter métodos de usuário definidos", () => {
    expect(typeof prisma.user.create).toBe("function");
    expect(typeof prisma.user.findMany).toBe("function");
    expect(typeof prisma.user.update).toBe("function");
    expect(typeof prisma.user.delete).toBe("function");
  });
});
