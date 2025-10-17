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

      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`[Production] [${requestId}] Creating character with:`, requestBody);

      const response = await fetch(`${apiBaseUrl}/char/create-character`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`[Production] [${requestId}] Response status:`, response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[Production] [${requestId}] Error response:`, errorData);
        throw new Error(errorData.message || `Failed to create character (${response.status})`);
      }

      const result = await response.json();
      console.log(`[Production] [${requestId}] Raw response:`, result);
      
      // Backend returns "character" instead of "data", normalize it
      if (result.character && !result.data) {
        console.log(`[Production] [${requestId}] Normalizing response: character → data`);
        return {
          success: result.success,
          data: result.character,
          message: result.message,
        };
      }
      
      return result;
    }
  };

  return {
    checkUsername,
    checkCharacter,
    createCharacter,
  };
};
