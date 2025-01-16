import prisma from './client';

export async function initializeDatabase() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('Connected to database');

    // Test connection by running a simple query
    await prisma.$queryRaw`SELECT 1`;
    
    console.log('Database connection verified successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}