const prisma = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(), // Essencial para find user
  },
  // === ADICIONADO PARA COBERTURA DA ROTA DELETE ===
  session: {
    deleteMany: jest.fn(),
  },
  account: {
    deleteMany: jest.fn(),
  },
  // ===============================================
  // Simula o $transaction, passando o mock 'prisma' para o callback (tx)
  $transaction: jest.fn((callback) => callback(prisma)), 
};

module.exports = prisma;