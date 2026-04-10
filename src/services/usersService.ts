import { prisma} from "../lib/prisma"; // single shared client
import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

// Create a new user
export const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User> => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, firstName, lastName },
  });

  return user;
};

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

// Find user by ID
export const findUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

// Update user
export const updateUser = async (
  id: number,
  data: { firstName?: string; lastName?: string; password?: string }
): Promise<User> => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return prisma.user.update({ where: { id }, data });
};

// Delete user
export const deleteUser = async (id: number): Promise<User> => {
  return prisma.user.delete({ where: { id } });
};