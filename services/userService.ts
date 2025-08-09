import { User, UserRole } from '../types';
import { ALL_USERS as SEED_USERS } from '../constants';

const USERS_STORAGE_KEY = 'levelnet-all-users';

// Function to initialize or reset users in localStorage
const seedUsers = (): User[] => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
  return SEED_USERS;
};

// Get all users
export const getUsers = (): User[] => {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      return JSON.parse(storedUsers);
    } else {
      return seedUsers();
    }
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    return seedUsers(); // Fallback to seeding
  }
};

// Add a new user
export const addUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    return new Promise((resolve, reject) => {
        try {
            if (!userData.email || !userData.name || !userData.password) {
                return reject(new Error('Nama, email, dan password wajib diisi.'));
            }
            const users = getUsers();
            const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
            if (emailExists) {
                return reject(new Error('Email sudah digunakan oleh pengguna lain.'));
            }

            const newUser: User = {
                id: `${userData.role.toLowerCase()}-${new Date().getTime()}`,
                ...userData
            };
            
            const updatedUsers = [...users, newUser];
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
            
            const { password, ...userToReturn } = newUser;
            resolve(userToReturn as User);

        } catch (error) {
            reject(error);
        }
    });
};


// Update a user
export const updateUser = async (updatedUser: User): Promise<User> => {
    return new Promise((resolve, reject) => {
        try {
            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === updatedUser.id);

            if (userIndex === -1) {
                return reject(new Error('User not found'));
            }

            // Create a new object for the updated user
            const existingUser = users[userIndex];
            const newUserState = {
                ...existingUser,
                email: updatedUser.email,
                // Only update password if a new one is provided and is not an empty string
                ...(updatedUser.password ? { password: updatedUser.password } : {}),
            };
            
            users[userIndex] = newUserState;
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
            
            // Return user without password for safety in UI
            const { password, ...userToReturn } = newUserState;
            resolve(userToReturn as User);

        } catch (error) {
            reject(error);
        }
    });
};

// Get only sales users (for filters)
export const getSalesUsers = (): User[] => {
    const users = getUsers();
    return users.filter(user => user.role === UserRole.SALES);
};