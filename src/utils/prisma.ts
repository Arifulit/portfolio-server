// import { PrismaClient } from '@prisma/client';
// import dotenv from 'dotenv';

// dotenv.config();

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// // Initialize Prisma Client
// const prisma = global.prisma || new PrismaClient({
//   log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
// });

// // In development, store the Prisma Client in the global object to prevent
// // creating multiple instances during hot-reloading
// if (process.env.NODE_ENV !== 'production') {
//   global.prisma = prisma;
// }

// export default prisma;

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;