const prisma = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(), 
  },
  $transaction: jest.fn((callback) => callback(prisma)), 
};

module.exports = prisma;