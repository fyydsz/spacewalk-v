import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setMockUser } from '@/lib/mockData';

export function DevModeIndicator() {
  const { mode, user, isAuthenticated, login, logout, refreshUser } = useAuth();

  if (mode !== 'development') {
    return null; // Don't show in production
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 border-2 border-yellow-500 shadow-lg z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            🎭 Development Mode
            <span className="text-xs px-2 py-1 bg-secondary rounded">MOCK</span>
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          You're viewing with mock data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current User Info */}
        <div className="text-xs space-y-1">
          <p><strong>Status:</strong> {isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
          {user && (
            <>
              <p><strong>User:</strong> {user.username}</p>
              <p><strong>Has Character:</strong> {user.character ? 'Yes' : 'No'}</p>
              {user.character && (
                <p><strong>Character:</strong> {user.character.charUsername}</p>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <div className="text-xs font-semibold">Quick Actions:</div>
          
          {!isAuthenticated ? (
            <Button onClick={login} size="sm" className="w-full">
              Mock Login
            </Button>
          ) : (
            <Button onClick={logout} size="sm" variant="outline" className="w-full">
              Mock Logout
            </Button>
          )}

          {isAuthenticated && (
            <>
              <Button 
                onClick={() => {
                  setMockUser('withoutCharacter');
                  refreshUser();
                }}
                size="sm" 
                variant="secondary"
                className="w-full text-xs"
              >
                Switch to User Without Character
              </Button>
              
              <Button 
                onClick={() => {
                  setMockUser('withCharacter');
                  refreshUser();
                }}
                size="sm" 
                variant="secondary"
                className="w-full text-xs"
              >
                Switch to User With Character
              </Button>
            </>
          )}
        </div>

        {/* Info */}
        <div className="text-[10px] text-muted-foreground border-t pt-2">
          💡 This panel only appears in development mode. Use it to test different user states.
        </div>
      </CardContent>
    </Card>
  );
}
