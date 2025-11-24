import { DELETE } from "../../../app/api/users/delete/route";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Mock do Prisma Client
jest.mock("@prisma/client", () => {
  const mockPrisma = require("../../../__mocks__/prisma");
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});
const prisma = require("../../../__mocks__/prisma"); 


// Mock para simular getServerSession
const mockGetServerSession = jest.fn();
jest.mock("next-auth/next", () => ({
  getServerSession: () => mockGetServerSession(),
}));

// Mock do bcryptjs
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(async (password) => `hashed_${password}`),
}));

// MOCK ESTÁVEL DO NEXTRESPONSE
const mockResponse = (body, status) => ({
  status: status,
  json: () => Promise.resolve(body),
});
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, options) => {
      const status = options && options.status ? options.status : 200; 
      return mockResponse(body, status);
    })
  },
}));

describe("DELETE /api/users/delete", () => {
  const currentUser = {
    id: "user123",
    name: "Usuario Deletar",
    email: "deletar@email.com",
    password: "hashed_correct_password",
  };
  
  const mockRequest = {
    json: async () => ({
      password: "correct_password",
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // MOCK PADRÃO: Sessão autenticada
    mockGetServerSession.mockResolvedValue({
      user: { email: currentUser.email },
    });
    // MOCK PADRÃO: Busca o usuário atual
    prisma.user.findUnique.mockResolvedValue(currentUser);
    // MOCK PADRÃO: Senha correta
    bcrypt.compare.mockResolvedValue(true);
    // MOCK PADRÃO: Transação de delete com sucesso
    prisma.user.delete.mockResolvedValue({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
    });
    // Garante que a transação usa os mocks internos (tx)
    prisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
            session: { deleteMany: prisma.session.deleteMany },
            account: { deleteMany: prisma.account.deleteMany },
            user: { delete: prisma.user.delete },
        };
        return await callback(tx);
    });
    
    prisma.session.deleteMany.mockResolvedValue({});
    prisma.account.deleteMany.mockResolvedValue({});
  });


  // CAMINHOS DE FALHA (TESTES TDD)

  it("TDD-FAIL: deve retornar 401 se o usuário não estiver autenticado", async () => {
    mockGetServerSession.mockResolvedValueOnce(null);
    const mockRequestNoPassword = { json: async () => ({ password: "N/A" }) };

    const response = await DELETE(mockRequestNoPassword);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Não autenticado");
  });

  it("TDD-FAIL: deve retornar 400 se a senha for omitida", async () => {
    const mockRequestNoPassword = { json: async () => ({ password: null }) };

    const response = await DELETE(mockRequestNoPassword);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Senha é obrigatória para deletar a conta");
  });

  it("TDD-FAIL: deve retornar 404 se o usuário não for encontrado (após autenticação)", async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null); 

    const response = await DELETE(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("Usuário não encontrado");
  });

  it("TDD-FAIL: deve retornar 400 se a senha estiver incorreta", async () => {
    bcrypt.compare.mockResolvedValue(false);

    const response = await DELETE(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Senha incorreta");
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

 
  // CAMINHOS DE SUCESSO (TESTES TDD)

  it("TDD-SUCCESS: deve deletar o usuário e retornar 200", async () => {
    const response = await DELETE(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Conta deletada com sucesso");
    
    // Verifica se a transação e as exclusões foram chamadas (cobertura do $transaction)
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.session.deleteMany).toHaveBeenCalled();
    expect(prisma.account.deleteMany).toHaveBeenCalled();
    expect(prisma.user.delete).toHaveBeenCalled();
  });

  
  // TESTE DE COBERTURA
  it("TDD-COV: deve retornar 500 se ocorrer um erro interno do servidor", async () => {
    // Simula um erro na busca do usuário
    prisma.user.findUnique.mockRejectedValue(new Error("Erro de transação"));
    
    const response = await DELETE(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Erro interno do servidor");
  });

});