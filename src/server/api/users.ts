import prisma from '../database/client';

export async function getUserPlan(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    return user?.plan || 'free';
  } catch (error) {
    console.error('Error fetching user plan:', error);
    return 'free';
  }
}

export async function createUser(userId: string, email: string) {
  try {
    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser) {
      return existingUser;
    }

    // Cria novo usuário se não existir
    return await prisma.user.create({
      data: {
        id: userId,
        email,
        plan: 'free',
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserPlan(userId: string, plan: 'free' | 'pro') {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });
  } catch (error) {
    console.error('Error updating user plan:', error);
    throw error;
  }
}