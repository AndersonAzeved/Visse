// visse/__tests__/routes/auth/nextauth.authorize.test.js
import bcrypt from "bcryptjs";

// ====================================================================
// MOCK DO PRISMA CLIENT
// ====================================================================
jest.mock("@prisma/client", () => {
  const mockPrisma = require("../../../__mocks__/prisma");
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});
const prisma = require("../../../__mocks__/prisma"); 
// ====================================================================

// Variável para armazenar a função authorize que queremos testar
let authorize;

// Mocka o CredentialsProvider para interceptar a função authorize antes de ser passada para NextAuth
jest.mock('next-auth/providers/credentials', () => ({
    __esModule: true,
    default: (options) => {
        // Captura a função original authorize
        authorize = options.authorize; 
        return {
            id: 'credentials',
            options,
            type: 'credentials'
        };
    },
}));

// Mocka NextAuth para evitar a execução completa da biblioteca
const mockNextAuth = () => ({
    GET: jest.fn(), 
    POST: jest.fn(),
});
jest.mock('next-auth', () => mockNextAuth);

// Importa a rota para que o código top-level seja executado e a função authorize seja capturada.
// Esta importação deve vir DEPOIS dos mocks do CredentialsProvider e NextAuth.
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

describe("NextAuth Authorize Callback Coverage", () => {
  
  // Confirma que a função authorize foi capturada.
  if (typeof authorize !== 'function') {
      throw new Error("A função authorize não foi capturada corretamente. Verifique a ordem dos mocks.");
  }
    
  beforeEach(() => {
    jest.clearAllMocks();
    // Padrão de sucesso para o bcrypt
    bcrypt.compare.mockResolvedValue(true); 
  });

  // TDD-FAIL: Teste para credenciais faltando (Caminho de exceção)
  it("deve falhar se email ou senha estiverem ausentes", async () => {
    const credentialsMissing = { email: "test@test.com", password: "" };
    
    // A função ASYNC AGORA É TESTADA CORRETAMENTE
    await expect(authorize(credentialsMissing)).rejects.toThrow(
      "Email e senha são obrigatórios"
    );
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  // TDD-FAIL: Teste para usuário não encontrado (Caminho de exceção)
  it("deve falhar se o usuário não for encontrado", async () => {
    prisma.user.findUnique.mockResolvedValue(null); 
    const credentials = { email: "notfound@test.com", password: "123456" };

    await expect(authorize(credentials)).rejects.toThrow(
      "Credenciais inválidas"
    );
  });
  
  // TDD-FAIL: Teste para senha incorreta (Caminho de exceção)
  it("deve falhar se a senha for inválida", async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false); // Senha FALHA

    const credentials = { email: "login@test.com", password: "wrong_password" };

    await expect(authorize(credentials)).rejects.toThrow(
      "Credenciais inválidas"
    );
  });

  // TDD-SUCCESS: Teste para login bem-sucedido (Caminho feliz)
  it("deve retornar o objeto de usuário em caso de sucesso", async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true); // Senha SUCESSO

    const credentials = { email: "login@test.com", password: "123456" };
    
    const user = await authorize(credentials);
    
    expect(user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
    });
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
  });
});