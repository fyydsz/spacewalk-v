// API Service with mock/real mode switching
import { useAuth } from '@/context/auth-context';
import { 
  CheckUsernameResponse, 
  CheckCharacterResponse, 
  ApiResponse, 
  Character 
} from '@/types/auth.types';
import { mockApiResponses } from '@/lib/mockData';

export const useApi = () => {
  const { mode, user } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const checkUsername = async (username: string): Promise<CheckUsernameResponse> => {
    if (mode === 'development') {
      // Use mock API
      return await mockApiResponses.checkUsername(username);
    } else {
      // Use real API
      const response = await fetch(
        `${apiBaseUrl}/char/check-username?charUsername=${encodeURIComponent(username)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to check username');
      }
      
      return await response.json();
    }
  };

  const checkCharacter = async (): Promise<CheckCharacterResponse> => {
    if (mode === 'development') {
      // Use mock API
      if (!user) {
        return { hasCharacter: false };
      }
      return await mockApiResponses.checkCharacter(user);
    } else {
      // Use real API
      const response = await fetch(`${apiBaseUrl}/char/check-character`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to check character');
      }

      return await response.json();
    }
  };

  const createCharacter = async (data: {
    username: string;
    name: string;
    age: number;
    gender: "Laki-laki" | "Perempuan";
  }): Promise<ApiResponse<Character>> => {
    if (mode === 'development') {
      // Use mock API
      return await mockApiResponses.createCharacter(data);
    } else {
      // Use real API
      // Map frontend field names to backend field names
      const requestBody = {
        charUsername: data.username,
        charName: data.name,
        charAge: data.age,
        charGender: data.gender,
      };

      const response = await fetch(`${apiBaseUrl}/char/create-character`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create character');
      }

      return await response.json();
    }
  };

  return {
    checkUsername,
    checkCharacter,
    createCharacter,
  };
};
