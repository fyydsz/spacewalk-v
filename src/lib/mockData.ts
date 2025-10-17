import { User, Character } from '@/types/auth.types';

// Mock Characters
export const mockCharacters: Character[] = [
  {
    discordId: '123456789012345678',
    charUsername: 'spacewalker',
    charName: 'Space Walker',
    charAge: 25,
    charGender: 'Laki-laki',
    charCreatedAt: new Date('2024-01-15').toISOString(),
    charUpdatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    discordId: '111222333444555666',
    charUsername: 'nova_knight',
    charName: 'Nova Knight',
    charAge: 28,
    charGender: 'Perempuan',
    charCreatedAt: new Date('2024-02-20').toISOString(),
    charUpdatedAt: new Date('2024-02-20').toISOString(),
  },
  {
    discordId: '999888777666555444',
    charUsername: 'star_mage',
    charName: 'Star Mage',
    charAge: 22,
    charGender: 'Perempuan',
    charCreatedAt: new Date('2024-03-10').toISOString(),
    charUpdatedAt: new Date('2024-03-10').toISOString(),
  },
];

// Mock Users with different states
export const mockUsers: Record<string, User> = {
  // User with character
  withCharacter: {
    discordId: '123456789012345678',
    username: 'testuser',
    discriminator: '1234',
    avatar: 'a1b2c3d4e5f6',
    globalName: 'Test User',
    email: 'testuser@example.com',
    character: mockCharacters[0],
  },
  
  // User without character (new user)
  withoutCharacter: {
    discordId: '987654321098765432',
    username: 'newuser',
    discriminator: '5678',
    avatar: 'f6e5d4c3b2a1',
    globalName: 'New User',
    email: 'newuser@example.com',
    character: null,
  },
  
  // Another user with character
  anotherUser: {
    discordId: '111222333444555666',
    username: 'galaxyexplorer',
    discriminator: '9999',
    avatar: 'xyz123abc456',
    globalName: 'Galaxy Explorer',
    email: 'galaxy@example.com',
    character: mockCharacters[1],
  },
};

// Default mock user (can be switched)
export let currentMockUser: User = mockUsers.withoutCharacter;

// Function to switch mock user for testing
export const setMockUser = (userKey: keyof typeof mockUsers) => {
  currentMockUser = mockUsers[userKey];
};

// Mock API delay simulation
export const mockApiDelay = (min = 300, max = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock API responses
export const mockApiResponses = {
  checkUsername: async (username: string) => {
    await mockApiDelay();
    // Simulate some taken usernames
    const takenUsernames = ['admin', 'test', 'spacewalk', 'nova', 'galaxy'];
    const available = !takenUsernames.includes(username.toLowerCase());
    return {
      available,
      message: available ? 'Username is available' : 'Username is already taken',
    };
  },

  checkCharacter: async (user: User) => {
    await mockApiDelay();
    return {
      hasCharacter: !!user.character,
      character: user.character || undefined,
    };
  },

  createCharacter: async (data: { username: string; name: string; age: number; gender: "Laki-laki" | "Perempuan" }) => {
    await mockApiDelay();
    const newCharacter: Character = {
      discordId: currentMockUser.discordId,
      charUsername: data.username,
      charName: data.name,
      charAge: data.age,
      charGender: data.gender,
      charCreatedAt: new Date().toISOString(),
      charUpdatedAt: new Date().toISOString(),
    };
    
    // Update current mock user
    currentMockUser.character = newCharacter;
    
    return {
      success: true,
      character: newCharacter,
      message: 'Character created successfully',
    };
  },
};

// Helper to get avatar URL
export const getMockAvatarUrl = (user: User): string => {
  if (!user.avatar) {
    // Default Discord avatar based on discriminator
    const defaultAvatarIndex = parseInt(user.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`;
};
