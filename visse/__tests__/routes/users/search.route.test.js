// visse/__tests__/routes/users/search.route.test.js
import { GET } from "../../../app/api/users/search/route";

// ====================================================================
// MOCK DO PRISMA CLIENT (Corrigido para evitar ReferenceError)
// Usamos require() dentro da factory para garantir o escopo correto.
// ====================================================================
jest.mock("@prisma/client", () => {
  const mockPrisma = require("../../../__mocks__/prisma");
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});
const prisma = require("../../../__mocks__/prisma"); 
// ====================================================================

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


describe("GET /api/users/search", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mocks padrão para sucesso na busca
    prisma.user.findMany.mockResolvedValue([
      { id: 'u1', name: 'Maria', email: 'maria@test.com' }
    ]);
  });


  // TDD-FAIL: Deve retornar uma mensagem amigável se a query for vazia (Linha 14)
  it("deve retornar 200 e mensagem se a query 'q' não for fornecida", async () => {
    // Arrange: Simula uma URL sem o parâmetro 'q'
    const mockRequestNoQuery = {
      url: "http://localhost:3000/api/users/search",
    };

    // Act
    const response = await GET(mockRequestNoQuery);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.message).toBe("Query de busca não fornecida");
    expect(prisma.user.findMany).not.toHaveBeenCalled(); 
  });
  
  // TDD-SUCCESS: Deve retornar usuários com base na query (Caminho Feliz)
  it("deve retornar 200 e a lista de usuários com base na query", async () => {
    // Arrange: Simula uma URL com o parâmetro 'q'
    const mockRequestWithQuery = {
      url: "http://localhost:3000/api/users/search?q=joao",
    };
    
    const mockUsers = [
        { id: 'u1', name: 'Joao Silva', email: 'joao@test.com', image: null, createdAt: new Date().toISOString() }
    ];
    prisma.user.findMany.mockResolvedValue(mockUsers);

    // Act
    const response = await GET(mockRequestWithQuery);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(mockUsers);
    expect(body.total).toBe(1);
    expect(body.query).toBe("joao");
    
    // Verifica se o Prisma foi chamado corretamente com o OR (name E email) e limites
    expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {
            OR: expect.arrayContaining([
                { name: { contains: "joao", mode: 'insensitive' } },
                { email: { contains: "joao", mode: 'insensitive' } },
            ])
        },
        take: 20,
    }));
  });
  
  // TDD-COV: Deve cobrir o bloco catch (Erro Interno)
  it("deve retornar 500 se ocorrer um erro interno do servidor (catch block)", async () => {
    // Arrange: Força uma exceção no Prisma
    prisma.user.findMany.mockRejectedValue(new Error("Erro de conexão"));
    
    const mockRequestError = {
      url: "http://localhost:3000/api/users/search?q=erro",
    };

    // Act
    const response = await GET(mockRequestError);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Erro interno do servidor");
  });
});