import { User, Character } from '@/types/auth.types';

// Mock Characters
export const mockCharacters: Character[] = [
  {
    discordId: '123456789012345678',
    charUsername: 'spacewalker',
    charName: 'Space Walker',
    charBirthday: '1999-05-15',
    charGender: 'Laki-laki',
    charCreatedAt: new Date('2024-01-15').toISOString(),
    charUpdatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    discordId: '111222333444555666',
    charUsername: 'nova_knight',
    charName: 'Nova Knight',
    charBirthday: '1996-08-20',
    charGender: 'Perempuan',
    charCreatedAt: new Date('2024-02-20').toISOString(),
    charUpdatedAt: new Date('2024-02-20').toISOString(),
  },
  {
    discordId: '999888777666555444',
    charUsername: 'star_mage',
    charName: 'Star Mage',
    charBirthday: '2002-03-10',
    charGender: 'Perempuan',
    charCreatedAt: new Date('2024-03-10').toISOString(),
    charUpdatedAt: new Date('2024-03-10').toISOString(),
  },
];

// Mock Users with different states
export const mockUsers: Record<string, Omit<User, 'character'>> = {
  // User with character (will be assigned a random character)
  withCharacter: {
    discordId: '123456789012345678', // This will be updated dynamically
    username: 'testuser',
    discriminator: '1234',
    avatar: 'a1b2c3d4e5f6',
    globalName: 'Test User',
    email: 'testuser@example.com',
  },
  
  // User without character (new user)
  withoutCharacter: {
    discordId: '987654321098765432',
    username: 'newuser',
    discriminator: '5678',
    avatar: 'f6e5d4c3b2a1',
    globalName: 'New User',
    email: 'newuser@example.com',
  },
};

// Function to get a random character, excluding the one provided
const getRandomCharacter = (exclude?: Character | null): Character => {
  const availableCharacters = mockCharacters.filter(
    (char) => char.charUsername !== exclude?.charUsername
  );
  if (availableCharacters.length === 0) return mockCharacters[0]; // Fallback
  const randomIndex = Math.floor(Math.random() * availableCharacters.length);
  return availableCharacters[randomIndex];
};

// Default mock user (can be switched)
export let currentMockUser: User = { ...mockUsers.withoutCharacter, character: null };

// Function to switch mock user for testing
export const setMockUser = (userKey: keyof typeof mockUsers) => {
  const userTemplate = JSON.parse(JSON.stringify(mockUsers[userKey]));
  
  if (userKey === 'withCharacter') {
    // Assign a random character that is different from the current one
    const newChar = getRandomCharacter(currentMockUser.character);
    currentMockUser = {
      ...userTemplate,
      character: newChar,
      discordId: newChar.discordId, // Sync discordId with character's owner
    };
  } else {
    currentMockUser = {
      ...userTemplate,
      character: null,
    };
  }
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

  createCharacter: async (data: { username: string; name: string; birthday: string; gender: "Laki-laki" | "Perempuan" }) => {
    await mockApiDelay();
    const newCharacter: Character = {
      discordId: currentMockUser.discordId,
      charUsername: data.username,
      charName: data.name,
      charBirthday: data.birthday,
      charGender: data.gender,
      charCreatedAt: new Date().toISOString(),
      charUpdatedAt: new Date().toISOString(),
    };
    
    // Update current mock user
    currentMockUser.character = newCharacter;
    
    return {
      success: true,
      data: newCharacter,
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
