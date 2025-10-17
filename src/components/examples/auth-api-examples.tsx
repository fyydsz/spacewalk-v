// Example: How to use auth and API in your components

import { useAuth } from '@/context/auth-context';
import { useApi } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ExampleComponent() {
  // Get auth context
  const { user, isAuthenticated, mode, login, logout } = useAuth();
  
  // Get API hook
  const api = useApi();

  // Example: Check username
  const handleCheckUsername = async () => {
    try {
      const result = await api.checkUsername('testuser');
      console.log('Username available:', result.available);
      console.log('Message:', result.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Example: Create character
  const handleCreateCharacter = async () => {
    try {
      const result = await api.createCharacter({
        username: 'myusername',
        name: 'My Character Name',
        age: 25,
        gender: 'Laki-laki'
      });
      
      if (result.success && result.data) {
        console.log('Character created:', result.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Example Component</CardTitle>
        <p className="text-sm text-muted-foreground">
          Current mode: <strong>{mode}</strong>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Authentication Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">Authentication:</h3>
          {isAuthenticated ? (
            <div className="space-y-1">
              <p className="text-sm">✅ Logged in as: {user?.username}</p>
              <p className="text-sm">Discord ID: {user?.discordId}</p>
              {user?.character ? (
                <p className="text-sm">
                  Character: {user.character.charName} (@{user.character.charUsername})
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">No character yet</p>
              )}
              <Button onClick={logout} size="sm" variant="outline">
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Not logged in</p>
              <Button onClick={login} size="sm">
                Login
              </Button>
            </div>
          )}
        </div>

        {/* API Examples */}
        <div className="space-y-2">
          <h3 className="font-semibold">API Examples:</h3>
          <div className="space-y-2">
            <Button 
              onClick={handleCheckUsername} 
              size="sm" 
              variant="secondary"
              className="w-full"
            >
              Check Username Availability
            </Button>
            
            <Button 
              onClick={handleCreateCharacter} 
              size="sm" 
              variant="secondary"
              className="w-full"
              disabled={!isAuthenticated}
            >
              Create Character
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {mode === 'development' 
              ? '🎭 Using mock API responses' 
              : '🚀 Using real API'}
          </p>
        </div>

        {/* Mode Info */}
        <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Development Mode:</strong> Mock data, no real auth needed</p>
          <p>🚀 <strong>Production Mode:</strong> Real Discord OAuth, real API</p>
          <p className="pt-2">
            Switch modes: <code className="text-xs bg-secondary px-1 py-0.5 rounded">
              npm run dev:mock
            </code> or <code className="text-xs bg-secondary px-1 py-0.5 rounded">
              npm run dev:prod
            </code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// More Examples:
// ============================================

// Example 1: Protected Component (only for authenticated users)
export function ProtectedComponent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login first</div>;
  }

  return <div>Welcome, {user?.username}!</div>;
}

// Example 2: Character Required Component
export function CharacterRequiredComponent() {
  const { user } = useAuth();

  if (!user?.character) {
    return <div>Please create a character first</div>;
  }

  return (
    <div>
      <h2>Character: {user.character.charName}</h2>
      <p>Username: @{user.character.charUsername}</p>
      <p>Age: {user.character.charAge}</p>
      <p>Gender: {user.character.charGender}</p>
    </div>
  );
}

// Example 3: Using API with Loading State
import { useState as useStateReact } from 'react';

export function ApiLoadingExample() {
  const [loading, setLoading] = useStateReact(false);
  const [result, setResult] = useStateReact<any>(null);
  const api = useApi();

  const checkCharacter = async () => {
    setLoading(true);
    try {
      const data = await api.checkCharacter();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={checkCharacter} disabled={loading}>
        {loading ? 'Loading...' : 'Check Character'}
      </Button>
      {result && (
        <div>
          {result.hasCharacter 
            ? `Has character: ${result.character?.charUsername}`
            : 'No character'}
        </div>
      )}
    </div>
  );
}

// Example 4: Mode-Specific Behavior
export function ModeSpecificComponent() {
  const { mode } = useAuth();

  if (mode === 'development') {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
        🎭 Development Mode - Using mock data
      </div>
    );
  }

  return (
    <div className="bg-green-100 dark:bg-green-900 p-4 rounded">
      🚀 Production Mode - Using real authentication
    </div>
  );
}

// Example 5: Custom Hook for Character Actions
import { useState } from 'react';

export function useCharacterActions() {
  const { user, updateCharacter } = useAuth();
  const api = useApi();
  const [loading, setLoading] = useState(false);

  const createCharacter = async (data: {
    username: string;
    name: string;
    age: number;
    gender: "Laki-laki" | "Perempuan";
  }) => {
    setLoading(true);
    try {
      const result = await api.createCharacter(data);
      if (result.success && result.data) {
        updateCharacter(result.data);
        return { success: true, character: result.data };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: 'Failed to create character' };
    } finally {
      setLoading(false);
    }
  };

  return {
    createCharacter,
    loading,
    hasCharacter: !!user?.character,
    character: user?.character,
  };
}

// Usage:
export function CreateCharacterForm() {
  const { createCharacter, loading } = useCharacterActions();

  const handleSubmit = async () => {
    const result = await createCharacter({
      username: 'myusername',
      name: 'My Character',
      age: 25,
      gender: 'Laki-laki',
    });

    if (result.success) {
      console.log('Character created!');
    }
  };

  return (
    <Button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Creating...' : 'Create Character'}
    </Button>
  );
}
