
import { User, UserRole } from '../types';

// Mock DB of users (Simulated)
const MOCK_ADMIN_EMAIL = 'admin@stridezero.com';

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Basic validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Determine Role based on email (RBAC Simulation)
  const role: UserRole = email.toLowerCase() === MOCK_ADMIN_EMAIL ? 'admin' : 'customer';
  
  // Generate Mock JWT (Simulated)
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_token_${Date.now()}.${role}`;

  const user: User = {
    id: `user_${Date.now()}`,
    name: email.split('@')[0], // Use part of email as name for demo
    email,
    role,
    token
  };

  // Store session
  localStorage.setItem('stride_user', JSON.stringify(user));
  return user;
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const role: UserRole = email.toLowerCase() === MOCK_ADMIN_EMAIL ? 'admin' : 'customer';
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_token_${Date.now()}.${role}`;

  const user: User = {
    id: `user_${Date.now()}`,
    name,
    email,
    role,
    token
  };

  localStorage.setItem('stride_user', JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem('stride_user');
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem('stride_user');
  return stored ? JSON.parse(stored) : null;
};
