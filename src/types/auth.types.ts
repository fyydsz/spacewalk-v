// User types for authentication and profile
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name?: string | null;
  email?: string;
}

export interface Character {
  discordId: string;
  charUsername: string;
  charName: string;
  charBirthday: string; // Format: ISO date string (YYYY-MM-DD)
  charGender: "Laki-laki" | "Perempuan";
  charCreatedAt?: string;
  charUpdatedAt?: string;
}

export interface User {
  discordId: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  globalName?: string | null;
  email?: string;
  character?: Character | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mode: 'development' | 'production';
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateCharacter: (character: Character) => void;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CheckUsernameResponse {
  available: boolean;
  message?: string;
}

export interface CheckCharacterResponse {
  hasCharacter: boolean;
  character?: Character;
}
