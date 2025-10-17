# 📖 Spacewalk-v Development Guide

> **Complete guide untuk development mode dan production mode system**

---

## 📑 Table of Contents
1. [Quick Start](#-quick-start)
2. [Mode Switching System](#-mode-switching-system)
3. [Implementation Details](#-implementation-details)
4. [Usage Examples](#-usage-examples)
5. [API Reference](#-api-reference)
6. [Troubleshooting](#-troubleshooting)
7. [Fixes Applied](#-fixes-applied)

---

## 🚀 Quick Start

### Development Mode (Recommended for Design)
```bash
npm run dev        # or npm run dev:mock
```
- ✅ **No backend required**
- ✅ Uses mock data
- ✅ No Discord authentication needed
- ✅ Dev Mode Indicator appears
- ✅ Instant access to dashboard

**Server:** http://localhost:5173/

### Production Mode (For Testing Real Auth)
```bash
npm run dev:prod
```
- ✅ Real Discord OAuth
- ✅ Real API backend
- ✅ Production-ready behavior

---

## 🎭 Mode Switching System

### Overview
Spacewalk-v mendukung **2 mode** untuk memudahkan development:

| Mode | Command | Backend | Auth | Data | Dashboard Access |
|------|---------|---------|------|------|------------------|
| **Development** | `npm run dev` | Not required | Mock | Mock | Instant |
| **Production** | `npm run dev:prod` | Required | Real Discord OAuth | Real API | Auth required |

### Environment Variables

**`.env` (Default):**
```env
VITE_APP_MODE=development
VITE_API_BASE_URL=http://localhost:3000
```

**`.env.development`:**
```env
VITE_APP_MODE=development
VITE_API_BASE_URL=http://localhost:3000
```

**`.env.production`:**
```env
VITE_APP_MODE=production
VITE_API_BASE_URL=https://api.spacewalk.my.id
```

### Available Scripts

```bash
npm run dev          # Development mode (default)
npm run dev:mock     # Development mode (explicit)
npm run dev:prod     # Production mode
npm run build        # Build for development
npm run build:prod   # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

---

## 💡 Implementation Details

### File Structure
```
src/
├── context/
│   └── auth-context.tsx         # Auth provider dengan mode switching
├── hooks/
│   └── use-api.ts               # API hook dengan mock/real switching
├── lib/
│   └── mockData.ts              # Mock data untuk development
├── types/
│   └── auth.types.ts            # TypeScript types
└── components/
    ├── dev-mode-indicator.tsx   # Dev mode indicator panel
    └── examples/
        └── auth-api-examples.tsx # Usage examples
```

### Key Components

#### 1. Auth Context (`src/context/auth-context.tsx`)
Auth provider yang automatically switch antara mock dan real auth based on mode.

**Features:**
- Automatic mode detection
- Mock authentication untuk development
- Real Discord OAuth untuk production
- User state management
- `useAuth()` hook untuk easy access

#### 2. API Hook (`src/hooks/use-api.ts`)
API service yang automatically route ke mock atau real API.

**Methods:**
- `checkUsername(username)` - Check username availability
- `checkCharacter()` - Check if user has character
- `createCharacter(data)` - Create new character

#### 3. Mock Data (`src/lib/mockData.ts`)
Mock users dan API responses untuk development.

**Available Mock Users:**
- `withoutCharacter` - New user tanpa character (default)
- `withCharacter` - User dengan character (Level 25)
- `anotherUser` - Another user dengan character (Level 30)

#### 4. Dev Mode Indicator (`src/components/dev-mode-indicator.tsx`)
Visual panel di pojok kanan bawah (hanya muncul di dev mode).

**Features:**
- Display current mode dan user state
- Mock Login/Logout buttons
- Switch between mock users
- Quick actions untuk testing

---

## 📝 Usage Examples

### 1. Basic Auth Check
```typescript
import { useAuth } from '@/context/auth-context';

function MyComponent() {
  const { user, isAuthenticated, mode } = useAuth();
  
  // Check current mode
  console.log('Current mode:', mode); // 'development' or 'production'
  
  // Check authentication
  if (isAuthenticated) {
    console.log('User:', user?.username);
    console.log('Character:', user?.character?.charUsername);
  }
}
```

### 2. API Calls (Auto Mode Switching)
```typescript
import { useApi } from '@/hooks/use-api';

function MyComponent() {
  const api = useApi();
  
  // Check username - auto switches based on mode
  const checkUsername = async (username: string) => {
    const result = await api.checkUsername(username);
    console.log('Available:', result.available);
    // Dev mode: returns mock data
    // Prod mode: calls real API
  };
  
  // Create character
  const createCharacter = async () => {
    const result = await api.createCharacter({
      username: 'myusername',
      nickname: 'My Character',
      class: 'Warrior',
    });
    
    if (result.success) {
      console.log('Character created:', result.data);
    }
  };
}
```

### 3. Protected Component
```typescript
import { useAuth } from '@/context/auth-context';

function ProtectedComponent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login first</div>;
  }

  return <div>Welcome, {user?.username}!</div>;
}
```

### 4. Character Required Component
```typescript
import { useAuth } from '@/context/auth-context';

function CharacterComponent() {
  const { user } = useAuth();

  if (!user?.character) {
    return <div>Please create a character first</div>;
  }

  return (
    <div>
      <h2>Character: {user.character.charUsername}</h2>
      <p>Level: {user.character.charLevel}</p>
      <p>Gold: {user.character.charGold}</p>
    </div>
  );
}
```

### 5. Mode-Specific Behavior
```typescript
import { useAuth } from '@/context/auth-context';

function ModeComponent() {
  const { mode, login, logout } = useAuth();

  if (mode === 'development') {
    return (
      <div className="bg-yellow-100 p-4">
        🎭 Development Mode - Using mock data
        <button onClick={login}>Mock Login</button>
      </div>
    );
  }

  return (
    <div className="bg-green-100 p-4">
      🚀 Production Mode - Real authentication
      <button onClick={login}>Discord Login</button>
    </div>
  );
}
```

### 6. Custom Hook untuk Character Actions
```typescript
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useApi } from '@/hooks/use-api';

export function useCharacterActions() {
  const { user, updateCharacter } = useAuth();
  const api = useApi();
  const [loading, setLoading] = useState(false);

  const createCharacter = async (data: {
    username: string;
    nickname: string;
    class: string;
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
function CreateCharacterForm() {
  const { createCharacter, loading } = useCharacterActions();

  const handleSubmit = async () => {
    const result = await createCharacter({
      username: 'myusername',
      nickname: 'My Character',
      class: 'Warrior',
    });

    if (result.success) {
      console.log('Character created!');
    }
  };

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Creating...' : 'Create Character'}
    </button>
  );
}
```

---

## 🔑 API Reference

### useAuth Hook

```typescript
const {
  user,              // Current user (User | null)
  isAuthenticated,   // Boolean - is user authenticated
  isLoading,         // Boolean - is auth check in progress
  mode,              // 'development' | 'production'
  login,             // () => void - Login function
  logout,            // () => void - Logout function
  refreshUser,       // () => Promise<void> - Refresh user data
  updateCharacter,   // (character: Character) => void - Update character
} = useAuth();
```

### useApi Hook

```typescript
const api = useApi();

// Check username availability
const result = await api.checkUsername('username');
// Returns: { available: boolean, message?: string }

// Check if user has character
const result = await api.checkCharacter();
// Returns: { hasCharacter: boolean, character?: Character }

// Create character
const result = await api.createCharacter({
  username: 'username',
  nickname: 'Character Name',
  class: 'Warrior'
});
// Returns: { success: boolean, data?: Character, message?: string }
```

### Mock Data Functions

```typescript
import { setMockUser, mockUsers } from '@/lib/mockData';

// Switch mock user
setMockUser('withoutCharacter');  // New user
setMockUser('withCharacter');     // User with character
setMockUser('anotherUser');       // Another user
```

---

## 🎨 Dev Mode Indicator

### Location
Pojok kanan bawah (hanya muncul di development mode)

### Features
- **Current Mode Display** - Shows 'Development Mode' with MOCK badge
- **User Status** - Shows logged in/out status and current user info
- **Quick Actions:**
  - Mock Login/Logout
  - Switch to User Without Character
  - Switch to User With Character

### Usage
Di development mode, Dev Mode Indicator automatically appears. Gunakan untuk:
1. Test different user states instantly
2. Mock login/logout tanpa reload
3. See current auth state
4. Quick debugging

---

## 🐛 Troubleshooting

### Issue: Dev Mode Indicator Not Showing
**Solution:**
- Make sure running `npm run dev` or `npm run dev:mock`
- Check browser console: `import.meta.env.VITE_APP_MODE` should be `'development'`
- Clear cache and hard refresh (Ctrl+Shift+R)

### Issue: Still Redirecting to Discord OAuth
**Solution:**
- Verify `.env` has `VITE_APP_MODE=development`
- Check console logs for mode: should show "🎭 Development Mode"
- Restart dev server: `npm run dev`

### Issue: API Calls Not Working
**Solution:**
- Make sure using `useApi()` hook
- Check console for error messages
- Verify mode with `useAuth().mode`
- In dev mode, all API calls use mock data

### Issue: Mock User Not Updating
**Solution:**
- Use Dev Mode Indicator to switch users
- Or edit `src/context/auth-context.tsx` line ~30 to change default mock user
- Mock data resets on page refresh

### Issue: Build Errors
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🔧 Fixes Applied

### Problem 1: Dashboard Direct Access Redirecting
**File:** `src/components/layout/dashboard/nav-user.tsx`

**Before:**
```typescript
// Hardcoded API call and redirect
axios.get("https://api.spacewalk.my.id/auth/me")
  .catch(() => {
    window.location.href = "https://api.spacewalk.my.id/auth/discord";
  });
```

**After:**
```typescript
// Uses Auth Context with mode detection
const { user, isAuthenticated, mode } = useAuth();

useEffect(() => {
  if (!isLoading && !isAuthenticated && mode === 'production') {
    login(); // Only redirects in production mode
  }
}, [isLoading, isAuthenticated, mode]);
```

**Result:** ✅ Direct access to `/dashboard` works in dev mode

---

### Problem 2: Navbar Dashboard Button Redirecting
**File:** `src/components/navbar/NavBar.tsx`

**Before:**
```typescript
// Hardcoded API check and redirect
const handleLogin = async () => {
  const res = await axios.get('https://api.spacewalk.my.id/auth/me');
  if (!res.data.success) {
    window.location.href = "https://api.spacewalk.my.id/auth/discord";
  }
};
```

**After:**
```typescript
// Smart navigation with mode detection
const { isAuthenticated, login, mode } = useAuth();

const handleDashboardClick = () => {
  if (mode === 'development') {
    navigate('/dashboard'); // No redirect in dev mode
  } else {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      login(); // Redirect to OAuth in prod mode
    }
  }
};
```

**Result:** ✅ Navbar dashboard button works in dev mode

---

## 🎯 Testing Checklist

### Development Mode Tests
```bash
npm run dev
```

- [ ] Server starts at http://localhost:5173/
- [ ] Go to homepage
- [ ] Click "Dashboard" button in navbar → Should navigate to dashboard (no redirect)
- [ ] Dev Mode Indicator appears (bottom-right, yellow panel)
- [ ] See mock user in sidebar (e.g., "New User")
- [ ] Click "Mock Login" in Dev Mode Indicator → User should appear
- [ ] Click "Switch to User Without Character" → Character should be null
- [ ] Click "Switch to User With Character" → Character should appear
- [ ] Direct access: http://localhost:5173/dashboard → Should load without redirect
- [ ] Check console for logs with `[development mode]` prefix

### Production Mode Tests
```bash
npm run dev:prod
```

- [ ] Server starts
- [ ] Go to homepage
- [ ] Click "Dashboard" button → Should redirect to Discord OAuth (if not logged in)
- [ ] Dev Mode Indicator should NOT appear
- [ ] After login → should navigate to dashboard
- [ ] Check console for logs with `[production mode]` prefix

---

## 🎊 Summary

### What's Implemented
1. ✅ **Dual-mode system** (development & production)
2. ✅ **Auth Context** with automatic mode switching
3. ✅ **API Hook** with mock/real API routing
4. ✅ **Mock Data System** dengan multiple user states
5. ✅ **Dev Mode Indicator** untuk quick testing
6. ✅ **Type-safe** dengan full TypeScript support
7. ✅ **All redirects fixed** - no more unwanted OAuth redirects

### Files Created
- `src/types/auth.types.ts` - Type definitions
- `src/lib/mockData.ts` - Mock data
- `src/context/auth-context.tsx` - Auth context
- `src/hooks/use-api.ts` - API hook
- `src/components/dev-mode-indicator.tsx` - Dev indicator
- `src/components/examples/auth-api-examples.tsx` - Examples
- `.env.development` - Dev config
- `.env.production` - Prod config

### Files Modified
- `src/App.tsx` - Added AuthProvider & DevModeIndicator
- `src/components/navbar/NavBar.tsx` - Uses Auth Context
- `src/components/layout/dashboard/nav-user.tsx` - Uses Auth Context
- `src/components/pages/dashboard/components/user-register.tsx` - Uses new hooks
- `package.json` - Added mode scripts
- `vite.config.ts` - Env var support

---

## 🚀 Getting Started Now

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access Dashboard
- **Via Navbar:** Click "Dashboard" button (top-right)
- **Direct URL:** http://localhost:5173/dashboard

### 3. Use Dev Mode Indicator
- **Location:** Bottom-right corner (yellow panel)
- **Actions:** Mock Login, Switch Users, View State

### 4. Start Designing!
- ✅ No authentication needed
- ✅ Instant access to all pages
- ✅ Test different user states
- ✅ Mock data ready to use

---

## 📞 Need Help?

### Quick Reference

| What | Where |
|------|-------|
| Change default mock user | `src/context/auth-context.tsx` line ~30 |
| Add new mock user | `src/lib/mockData.ts` |
| Add new API endpoint | `src/hooks/use-api.ts` |
| Add new types | `src/types/auth.types.ts` |
| Change environment | `.env`, `.env.development`, `.env.production` |

### Common Patterns

```typescript
// Check mode
const { mode } = useAuth();

// Check auth
const { isAuthenticated } = useAuth();

// Get user
const { user } = useAuth();

// Login/Logout
const { login, logout } = useAuth();

// API calls
const api = useApi();
await api.checkUsername('test');
```

---

## ✨ Best Practices

1. **Always use `useAuth()` hook** untuk auth checks
2. **Always use `useApi()` hook** untuk API calls
3. **Test in dev mode first** before prod testing
4. **Use Dev Mode Indicator** untuk quick user switching
5. **Check console logs** untuk debugging (mode prefixes)
6. **Clear cache** jika behavior unexpected

---

**Happy Coding! 🎉🚀**

> Last Updated: After fixing all redirect issues
> Mode: Development & Production Ready ✅
