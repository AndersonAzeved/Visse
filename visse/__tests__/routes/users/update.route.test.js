// visse/__tests__/routes/users/update.route.test.js
import { PUT } from "../../../app/api/users/update/route";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// ====================================================================
// MOCK DO PRISMA CLIENT
// Garante que o mock 'prisma' seja carregado de forma preguiçosa.
// ====================================================================
jest.mock("@prisma/client", () => {
  const mockPrisma = require("../../../__mocks__/prisma");
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});
const prisma = require("../../../__mocks__/prisma"); 
// ====================================================================


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


describe("PUT /api/users/update", () => {
  // Dados base simulados para o usuário atual
  const currentUser = {
    id: "user123",
    name: "Usuario Antigo",
    email: "usuario.atual@email.com",
    password: "hashed_old_password",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // MOCK PADRÃO: Sessão autenticada (usado na maioria dos testes)
    mockGetServerSession.mockResolvedValue({
      user: { email: currentUser.email },
    });
    
    // MOCK PADRÃO: Atualização com sucesso
    prisma.user.update.mockImplementation((params) =>
      Promise.resolve({ ...params.data, id: "user123" })
    );
    
    // MOCK PADRÃO: Senha correta
    bcrypt.compare.mockResolvedValue(true);
  });


  // ===============================================
  // CAMINHOS DE FALHA
  // ===============================================

  it("TDD-FAIL: deve retornar 401 se o usuário não estiver autenticado", async () => {
    mockGetServerSession.mockResolvedValueOnce(null);
    const mockRequest = { json: async () => ({ name: "N/A", email: "N/A" }) };

    const response = await PUT(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe("Não autenticado");
  });

  it("TDD-FAIL: deve retornar 400 se faltarem 'name' ou 'email'", async () => {
    // Mocks: Apenas a busca pelo usuário atual
    prisma.user.findUnique.mockResolvedValue(currentUser); 
    
    const mockRequest = {
      json: async () => ({
        name: null,
        email: "novo@email.com",
      }),
    };

    const response = await PUT(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Nome e email são obrigatórios");
  });

  it("TDD-FAIL: deve retornar 400 se o novo email já estiver em uso por outro usuário", async () => {
    const mockRequest = {
      json: async () => ({
        name: "Novo Nome",
        email: "email.duplicado@email.com", 
      }),
    };
    
    // Mocks Sequenciais: 1. Usuário atual (OK). 2. Novo e-mail (DUPLICADO).
    prisma.user.findUnique
      .mockResolvedValueOnce(currentUser) 
      .mockResolvedValueOnce({ id: "otherUser456", email: "email.duplicado@email.com" });

    const response = await PUT(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Este email já está em uso");
  });

  it("TDD-FAIL: deve retornar 400 se 'newPassword' for fornecida sem 'currentPassword'", async () => {
    // Mocks: Apenas a busca pelo usuário atual
    prisma.user.findUnique.mockResolvedValue(currentUser); 

    const mockRequest = {
      json: async () => ({
        name: "Novo Nome",
        email: currentUser.email,
        newPassword: "novaSenhaSegura",
      }),
    };

    const response = await PUT(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Senha atual é obrigatória para alterar a senha");
  });

  it("TDD-FAIL: deve retornar 400 se 'newPassword' for menor que 6 caracteres", async () => {
    // Mocks: Apenas a busca pelo usuário atual
    prisma.user.findUnique.mockResolvedValue(currentUser); 

    const mockRequest = {
      json: async () => ({
        name: "Novo Nome",
        email: currentUser.email,
        currentPassword: "senha_certa",
        newPassword: "123", 
      }),
    };

    const response = await PUT(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Nova senha deve ter pelo menos 6 caracteres");
  });

  it("TDD-FAIL: deve retornar 400 se a 'currentPassword' estiver incorreta", async () => {
    // Mocks: Apenas a busca pelo usuário atual
    prisma.user.findUnique.mockResolvedValue(currentUser); 
    // Simula que a comparação de senhas FALHA
    bcrypt.compare.mockResolvedValue(false);

    const mockRequest = {
      json: async () => ({
        name: "Novo Nome",
        email: currentUser.email,
        currentPassword: "senha_errada",
        newPassword: "novaSenhaSegura",
      }),
    };

    const response = await PUT(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Senha atual incorreta");
  });

  // ===============================================
  // CAMINHOS DE SUCESSO
  // ===============================================

  it("TDD-SUCCESS: deve atualizar nome e email com sucesso (sem alterar senha)", async () => {
    const updatedUserData = {
      id: "user123",
      name: "Novo Nome Teste",
      email: "novo.email@email.com",
    };
    prisma.user.update.mockResolvedValueOnce(updatedUserData);
    
    const mockRequest = {
      json: async () => ({
        name: "Novo Nome Teste",
        email: "novo.email@email.com",
      }),
    };
    
    // Mocks Sequenciais (CORRIGIDO):
    // 1. Busca o usuário atual (OK)
    // 2. Busca o novo e-mail (OK, e-mail livre: null)
    prisma.user.findUnique
      .mockResolvedValueOnce(currentUser) 
      .mockResolvedValueOnce(null);       

    const response = await PUT(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.email).toBe("novo.email@email.com");
  });
  
  it("TDD-SUCCESS: deve atualizar dados e alterar a senha com sucesso", async () => {
    // Mocks: Apenas a busca pelo usuário atual
    prisma.user.findUnique.mockResolvedValue(currentUser); 
    
    const mockRequest = {
      json: async () => ({
        name: "Novo Nome Senha",
        email: currentUser.email,
        currentPassword: "123456",
        newPassword: "novaSenha789",
      }),
    };
    
    const response = await PUT(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);

    expect(bcrypt.hash).toHaveBeenCalledWith("novaSenha789", 12);
  });
  
  // ===============================================
  // TESTE DE COBERTURA: COBRIR O CATCH (Linha 118)
  // ===============================================
  it("TDD-COV: deve retornar 500 se ocorrer um erro interno do servidor (catch block)", async () => {
    // Mocks: Sessão OK. Mas a busca do usuário falha com exceção
    mockGetServerSession.mockResolvedValue({ user: { email: "usuario.atual@email.com" } });
    prisma.user.findUnique.mockRejectedValue(new Error("Erro de conexão com o banco"));
    
    const mockRequest = {
      json: async () => ({ name: "Novo Nome", email: currentUser.email }),
    };

    const response = await PUT(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Erro interno do servidor");
  });

});