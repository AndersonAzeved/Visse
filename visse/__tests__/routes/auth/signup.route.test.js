import { POST } from "../../../app/api/auth/signup/route";
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

// Mock do bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn(async (password) => `hashed_${password}`),
  compare: jest.fn(),
}));


describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TDD: Teste de Falha (Validação de Campos Obrigatórios)
  it("deve retornar 400 se faltarem nome, email ou senha", async () => {
    const mockRequest = {
      json: async () => ({
        name: "Teste",
        email: "teste@email.com",
        password: "", 
      }),
    };
    
    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Nome, email e senha são obrigatórios");
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  // TDD: Teste de Falha (Validação de Senha Curta)
  it("deve retornar 400 se a senha for muito curta (< 6 caracteres)", async () => {
    const mockRequest = {
      json: async () => ({
        name: "João Curto",
        email: "joao.curto@email.com",
        password: "123", 
      }),
    };
    
    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Senha deve ter pelo menos 6 caracteres");
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
  
  // TDD: Teste de Sucesso (Caminho Feliz Básico)
  it("deve retornar 201 e criar o usuário com sucesso", async () => {
    const createdUser = {
      id: "cuid123",
      name: "Maria Silva",
      email: "maria@email.com",
      createdAt: new Date().toISOString(),
    };
    
    // Simula que o usuário NÃO existe e a criação é um sucesso
    prisma.user.findUnique.mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValueOnce(createdUser);

    const mockRequest = {
      json: async () => ({
        name: "Maria Silva",
        email: "maria@email.com",
        password: "senhaSegura123",
      }),
    };
    
    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });

  // TDD: Teste de Falha (Usuário já existe)
  it("deve retornar 400 se o usuário já existe", async () => {
    // Simula que o usuário JÁ existe
    prisma.user.findUnique.mockResolvedValueOnce({
      id: "existing1",
      email: "existente@email.com"
    });

    const mockRequest = {
        json: async () => ({
            name: "Usuário",
            email: "existente@email.com",
            password: "senhaSegura123",
        }),
    };

    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Usuário já existe com este email");
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  // TDD-COV: Deve cobrir o bloco catch
  it("deve retornar 500 se ocorrer um erro interno do servidor (catch block)", async () => {
    // Arrange: Força uma exceção no Prisma
    prisma.user.findUnique.mockRejectedValue(new Error("Erro de conexão"));
    
    const mockRequestError = {
      json: async () => ({
        name: "Maria Silva",
        email: "maria@email.com",
        password: "senhaSegura123",
      }),
    };

    const response = await POST(mockRequestError);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Erro interno do servidor");
  });
});