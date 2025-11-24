import bcrypt from "bcryptjs";

// Mock do Prisma Client
jest.mock("@prisma/client", () => {
  const mockPrisma = require("../../../__mocks__/prisma");
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});
const prisma = require("../../../__mocks__/prisma"); 


// Mocka o CredentialsProvider para interceptar a função authorize
let authorize;
jest.mock('next-auth/providers/credentials', () => ({
    __esModule: true,
    default: (options) => {
        authorize = options.authorize; 
        return {
            id: 'credentials',
            options,
            type: 'credentials'
        };
    },
}));

// Mocka NextAuth
const mockNextAuth = () => ({
    GET: jest.fn(), 
    POST: jest.fn(),
});
jest.mock('next-auth', () => mockNextAuth);

// Importa a rota
require('../../../app/api/auth/[...nextauth]/route');

// Mock do bcryptjs
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const mockUser = {
  id: "user456",
  email: "login@test.com",
  name: "Login User",
  password: "hashed_password_123",
};

describe.skip("NextAuth Authorize Callback Coverage", () => {
  
  beforeAll(() => {
     if (typeof authorize !== 'function') {
        throw new Error("A função authorize não foi capturada corretamente.");
     }
  });
    
  beforeEach(() => {
    jest.clearAllMocks();
    bcrypt.compare.mockResolvedValue(true); 
  });

  // TDD-FAIL: Teste para credenciais faltando
  it("deve falhar se email ou senha estiverem ausentes", async () => {
    const credentialsMissing = { email: "test@test.com", password: "" };
    
    // Aqui o erro é lançado ANTES do try/catch da API, então a mensagem é específica
    await expect(authorize(credentialsMissing)).rejects.toThrow(
      "Email e senha são obrigatórios"
    );
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  // TDD-FAIL: Teste para usuário não encontrado
  it("deve falhar se o usuário não for encontrado", async () => {
    prisma.user.findUnique.mockResolvedValue(null); 
    const credentials = { email: "notfound@test.com", password: "123456" };

    // CORREÇÃO: A API captura o erro e lança "Erro na autenticação"
    await expect(authorize(credentials)).rejects.toThrow(
      "Erro na autenticação"
    );
  });
  
  // TDD-FAIL: Teste para senha incorreta
  it("deve falhar se a senha for inválida", async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false); 

    const credentials = { email: "login@test.com", password: "wrong_password" };

    // CORREÇÃO: A API captura o erro e lança "Erro na autenticação"
    await expect(authorize(credentials)).rejects.toThrow(
      "Erro na autenticação"
    );
  });

  // TDD-SUCCESS: Teste para login bem-sucedido
  it("deve retornar o objeto de usuário em caso de sucesso", async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true); 

    const credentials = { email: "login@test.com", password: "123456" };
    
    const user = await authorize(credentials);
    
    expect(user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
    });
  });
});