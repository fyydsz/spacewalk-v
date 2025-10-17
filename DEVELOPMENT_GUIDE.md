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

## 🎨 Dark Mode Toggle

### Overview
Spacewalk-v includes a dark mode toggle system powered by a theme provider.

### Files Created
1. **`src/components/theme-provider.tsx`** - Provider untuk mengelola theme (dark/light/system)
2. **`src/components/mode-toggle.tsx`** - Komponen tombol toggle dark mode

### Setup & Integration

#### 1. ThemeProvider Integration
ThemeProvider sudah diintegrasikan di `App.tsx`:

```tsx
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* Your app content */}
    </ThemeProvider>
  )
}
```

#### 2. Using ModeToggle Component
Add the toggle to any component:

```tsx
import { ModeToggle } from "@/components/mode-toggle"

function YourComponent() {
  return (
    <div>
      <ModeToggle />
    </div>
  )
}
```

#### 3. Using useTheme Hook
For custom theme controls:

```tsx
import { useTheme } from "@/components/theme-provider"

function CustomComponent() {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  )
}
```

### Theme Options
- **`dark`** - Mode gelap
- **`light`** - Mode terang  
- **`system`** - Mengikuti preferensi sistem operasi

### Storage
Theme disimpan di `localStorage` dengan key `vite-ui-theme` (configurable via `storageKey` prop).

### Current Implementation
Dark mode toggle sudah ditambahkan di:
- **Dashboard Main Sidebar** (`src/components/layout/dashboard/main/app-sidebar.tsx`)
- **Dashboard Docs Sidebar** (`src/components/layout/dashboard/docs/app-sidebar.tsx`)

### Customization

#### Change Default Theme:
```tsx
<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
```

#### Customize Toggle Button:
Edit `src/components/mode-toggle.tsx` untuk:
- Mengganti icon
- Mengubah variant button
- Menambahkan animasi custom
- Mengubah layout dropdown menu

---

## 🔒 Security Guidelines

### ⚠️ Critical - Files with Sensitive Data

#### ❌ `.env` - DO NOT PUSH
Contains sensitive information:
- `JWT_SECRET` - Authentication secret
- `CLIENT_ID` - Discord OAuth Client ID
- `CLIENT_SECRET` - Discord OAuth Client Secret
- `TAKO_WEBHOOK` - Webhook secret

**Status:** Already in `.gitignore` ✅

### ✅ Safe Files - OK to Push

#### `.env.development`
```env
VITE_APP_MODE=development
VITE_API_BASE_URL=http://localhost:3000
```
- No secrets
- Public information only
- Safe to commit ✅

#### `.env.production`
```env
VITE_APP_MODE=production
VITE_API_BASE_URL=https://api.spacewalk.my.id
```
- No secrets
- Public API URL
- Safe to commit ✅

### � Security Checklist

#### Before Pushing to GitHub:
- [x] `.env` is in `.gitignore` ✅
- [ ] Verify `.env` is NOT staged for commit
- [ ] `.env.development` is safe (no secrets) ✅
- [ ] `.env.production` is safe (no secrets) ✅
- [ ] No other files contain sensitive data

#### Recommended Actions:

1. **Check git status:**
   ```bash
   git status
   ```

2. **Verify .env is ignored:**
   ```bash
   git check-ignore .env
   # Should output: .env
   ```

3. **If .env is staged, unstage it:**
   ```bash
   git reset .env
   ```

4. **Add to .gitignore if not already:**
   ```bash
   echo ".env" >> .gitignore
   ```

### 🛡️ Additional Security Recommendations

#### 1. Create `.env.example` (Template)
Create a template without secrets:

```env
# App Mode Configuration
VITE_APP_MODE=development
VITE_API_BASE_URL=http://localhost:3000

# Backend Configuration (FILL THESE IN!)
PORT=
TAKO_WEBHOOK=

JWT_SECRET=
CLIENT_ID=
CLIENT_SECRET=

REDIRECT_URI=
DISCORD_ME=
DISCORD_AVATAR=
DISCORD_LOGOUT=
```

#### 2. Update .gitignore
Ensure these are ignored:

```gitignore
# Environment files
.env
.env.local
.env.*.local

# But allow templates
!.env.example
!.env.development
!.env.production
```

#### 3. Never Commit These:
- ❌ `.env` (contains secrets)
- ❌ `.env.local` (local overrides)
- ❌ Any file with passwords, API keys, secrets
- ❌ Database credentials
- ❌ Private keys

#### 4. Safe to Commit:
- ✅ `.env.example` (template without secrets)
- ✅ `.env.development` (if no secrets)
- ✅ `.env.production` (if no secrets)
- ✅ `.gitignore`

### 🔍 How to Check for Secrets

Before committing:

```bash
# Check what files will be committed
git diff --staged

# Check if .env is tracked
git ls-files | grep .env

# If .env is tracked, remove it from git:
git rm --cached .env
```

### 🚨 If You Already Pushed Secrets

#### Immediate Actions:

1. **Rotate all secrets immediately:**
   - Generate new JWT_SECRET
   - Regenerate Discord CLIENT_SECRET
   - Change TAKO_WEBHOOK
   - Update all credentials

2. **Remove from git history:**
   ```bash
   # Use git-filter-repo or BFG Repo Cleaner
   # Contact developer for help if needed
   ```

3. **Update services:**
   - Update Discord OAuth app settings
   - Update webhook endpoints
   - Notify team members

### ✅ Current Security Status

**Safe to push:** ✅
- `.env` is properly ignored
- `.env.development` contains no secrets
- `.env.production` contains no secrets
- `.gitignore` is configured correctly

**Just verify:**
```bash
git status
# Make sure .env is NOT in the list
```

If `.env` shows up, run:
```bash
git reset .env
# or
git rm --cached .env
```

---

## 📝 Recent Updates & Changelog

### NavUser Update - Using Discord JWT Data (Latest)

#### Changes Made
Updated `nav-user.tsx` to fetch user display data from Discord JWT (via API) instead of using Auth Context's mock user data.

#### Behavior

**Development Mode (`npm run dev`):**
- **User Data:** Uses simple mock data
- **Display:** Shows "MockUser" with default avatar
- **Purpose:** Allows UI development without real backend

**Production Mode (`npm run dev:prod`):**
- **User Data:** Fetches from Discord API (`/auth/me`)
- **Display:** Shows real Discord username, email, avatar
- **Auth:** Redirects to Discord OAuth if not authenticated

#### How It Works

**Data Flow:**
```typescript
// Development Mode
useEffect → mode === 'development' → Set mock data → Display

// Production Mode
useEffect → mode === 'production' → Fetch Discord API → Display real data
                                   ↓
                               If error → Redirect to login
```

**Code Structure:**
```typescript
const fetchUserData = async () => {
  if (mode === 'development') {
    // Use simple mock data for UI testing
    setUserData({
      username: 'MockUser',
      avatar: 'default_avatar_url',
      email: 'mockuser@discord.com',
      id: '123456789',
    });
  } else {
    // Fetch real Discord data from JWT
    const response = await axios.get('/auth/me');
    setUserData({
      username: response.data.user.username,
      avatar: discord_avatar_url,
      email: response.data.user.email,
      id: response.data.user.id,
    });
  }
};
```

#### Benefits

**Why This Approach:**

1. **Real User Data in Production**
   - ✅ Shows actual Discord username
   - ✅ Shows actual Discord avatar
   - ✅ Shows actual Discord email
   - ✅ Uses JWT authentication

2. **Simple Mock in Development**
   - ✅ No complex mock user management
   - ✅ Just enough to show UI works
   - ✅ Focus on design, not auth flow

3. **Separation of Concerns**
   - ✅ Auth Context: Mode detection & authentication state
   - ✅ NavUser: Display user info from Discord JWT
   - ✅ Clean and focused responsibilities

#### Development Mode Mock Data
```typescript
{
  username: 'MockUser',
  avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
  email: 'mockuser@discord.com',
  id: '123456789'
}
```

**Purpose:** Just enough data to render the UI properly for design work.

#### Production Mode Real Data
```typescript
{
  username: response.data.user.username,    // Real Discord username
  avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
  email: response.data.user.email,          // Real Discord email
  id: response.data.user.id                 // Real Discord ID
}
```

**Source:** Discord OAuth JWT from `/auth/me` endpoint

#### Integration with Auth Context

**What Auth Context Provides:**
- ✅ `mode` - Current mode (development/production)
- ✅ `login()` - Redirect to Discord OAuth (if needed)
- ✅ `logout()` - Handle logout logic

**What NavUser Handles:**
- ✅ Fetch user data from Discord API
- ✅ Display user info (username, email, avatar)
- ✅ Handle loading states
- ✅ Handle logout UI action

#### Comparison

| Aspect | Auth Context User | NavUser Discord Data |
|--------|------------------|---------------------|
| **Purpose** | Authentication state | Display user info |
| **Dev Mode** | Complex mock with character data | Simple mock for UI |
| **Prod Mode** | Could have real data | Fetches real Discord data |
| **Usage** | Character system, game logic | Navbar display only |

#### Use Cases

**Auth Context (with mock users):**
```typescript
// For features that need user/character data
const { user } = useAuth();

if (user?.character) {
  // Show character info
  // Character level, gold, etc.
}
```

**NavUser (with Discord JWT):**
```typescript
// For displaying user in navbar
const [userData, setUserData] = useState();

// Fetch from Discord API
const response = await axios.get('/auth/me');
setUserData(response.data.user);

// Display: username, email, avatar
```

#### Configuration

**Environment Variables Used:**
- `VITE_APP_MODE` - Determines which data source to use
  - `development` → Mock data
  - `production` → Discord API

**API Endpoint (Production):**
```
GET https://api.spacewalk.my.id/auth/me
Credentials: include (for JWT cookies)
```

#### Testing

**Development Mode:**
```bash
npm run dev
```
1. Go to `/dashboard`
2. Check navbar (top or sidebar)
3. Should show "MockUser" with default avatar
4. No Discord API calls made

**Production Mode:**
```bash
npm run dev:prod
```
1. Go to `/dashboard`
2. Should fetch from Discord API
3. If authenticated → Shows real user data
4. If not authenticated → Redirects to Discord OAuth

### Documentation Cleanup (Previous)

The project documentation has been consolidated for clarity:

**Removed Files:**
- ❌ `DOCS_INDEX.md` - No longer needed
- ❌ `DEV_MODE_GUIDE.md` - Merged into DEVELOPMENT_GUIDE.md
- ❌ `QUICK_REFERENCE.md` - Merged into DEVELOPMENT_GUIDE.md
- ❌ `IMPLEMENTATION_SUMMARY.md` - Merged into DEVELOPMENT_GUIDE.md
- ❌ `FIX_REDIRECT_ISSUE.md` - Merged into DEVELOPMENT_GUIDE.md
- ❌ `FIX_NAVBAR_DASHBOARD_BUTTON.md` - Merged into DEVELOPMENT_GUIDE.md
- ❌ `COMPLETE_FIX_SUMMARY.md` - Merged into DEVELOPMENT_GUIDE.md
- ❌ `SETUP_COMPLETE.md` - Merged into DEVELOPMENT_GUIDE.md

**Current Structure:**
- ✅ `README.md` - Project overview & quick start
- ✅ `DEVELOPMENT_GUIDE.md` - Complete development documentation (this file)

---

## 📞 Support & Contact

### Where to Find What

| Need | File | Section |
|------|------|---------|
| Project overview | README.md | Top |
| Quick start | README.md | Quick Start |
| Complete guide | DEVELOPMENT_GUIDE.md | All |
| Usage examples | DEVELOPMENT_GUIDE.md | Usage Examples |
| API reference | DEVELOPMENT_GUIDE.md | API Reference |
| Troubleshooting | DEVELOPMENT_GUIDE.md | Troubleshooting |
| Mode switching | DEVELOPMENT_GUIDE.md | Mode Switching System |
| Dark mode setup | DEVELOPMENT_GUIDE.md | Dark Mode Toggle |
| Security | DEVELOPMENT_GUIDE.md | Security Guidelines |
| Recent updates | DEVELOPMENT_GUIDE.md | Recent Updates & Changelog |

### Quick Commands Reference

```bash
# Development mode (mock data)
npm run dev

# Production mode (real auth)
npm run dev:prod

# Build for production
npm run build:prod

# Check git security
git status
git check-ignore .env
```

---

**Happy Coding! 🎉🚀**

> **Last Updated:** October 17, 2025
> **Version:** 2.0 - Complete consolidated documentation
> **Status:** ✅ All features documented, security guidelines included
