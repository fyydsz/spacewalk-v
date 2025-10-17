import { User, Character } from '@/types/auth.types';

// Mock Characters
export const mockCharacters: Character[] = [
  {
    charId: 'char_001',
    charUsername: 'spacewalker',
    charNickname: 'Space Walker',
    charLevel: 25,
    charExp: 12500,
    charGold: 50000,
    charClass: 'Explorer',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    charId: 'char_002',
    charUsername: 'nova_knight',
    charNickname: 'Nova Knight',
    charLevel: 30,
    charExp: 18000,
    charGold: 75000,
    charClass: 'Warrior',
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    charId: 'char_003',
    charUsername: 'star_mage',
    charNickname: 'Star Mage',
    charLevel: 28,
    charExp: 15000,
    charGold: 65000,
    charClass: 'Mage',
    createdAt: new Date('2024-03-10').toISOString(),
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

  createCharacter: async (data: { username: string; nickname: string; class: string }) => {
    await mockApiDelay();
    const newCharacter: Character = {
      charId: `char_${Date.now()}`,
      charUsername: data.username,
      charNickname: data.nickname,
      charLevel: 1,
      charExp: 0,
      charGold: 1000,
      charClass: data.class,
      createdAt: new Date().toISOString(),
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
