# 📝 NavUser Update - Using Discord JWT Data

## Changes Made

Updated `nav-user.tsx` to fetch user display data from Discord JWT (via API) instead of using Auth Context's mock user data.

---

## 🎯 Behavior

### Development Mode (`npm run dev`):
- **User Data:** Uses simple mock data
- **Display:** Shows "MockUser" with default avatar
- **Purpose:** Allows UI development without real backend

### Production Mode (`npm run dev:prod`):
- **User Data:** Fetches from Discord API (`/auth/me`)
- **Display:** Shows real Discord username, email, avatar
- **Auth:** Redirects to Discord OAuth if not authenticated

---

## 🔄 How It Works

### Data Flow:

```typescript
// Development Mode
useEffect → mode === 'development' → Set mock data → Display

// Production Mode
useEffect → mode === 'production' → Fetch Discord API → Display real data
                                   ↓
                               If error → Redirect to login
```

### Code Structure:

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

---

## ✅ Benefits

### Why This Approach:

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

---

## 🎨 Development Mode Mock Data

```typescript
{
  username: 'MockUser',
  avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
  email: 'mockuser@discord.com',
  id: '123456789'
}
```

**Purpose:** Just enough data to render the UI properly for design work.

---

## 🚀 Production Mode Real Data

```typescript
{
  username: response.data.user.username,    // Real Discord username
  avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
  email: response.data.user.email,          // Real Discord email
  id: response.data.user.id                 // Real Discord ID
}
```

**Source:** Discord OAuth JWT from `/auth/me` endpoint

---

## 🔄 Integration with Auth Context

### What Auth Context Provides:
- ✅ `mode` - Current mode (development/production)
- ✅ `login()` - Redirect to Discord OAuth (if needed)
- ✅ `logout()` - Handle logout logic

### What NavUser Handles:
- ✅ Fetch user data from Discord API
- ✅ Display user info (username, email, avatar)
- ✅ Handle loading states
- ✅ Handle logout UI action

---

## 📊 Comparison

| Aspect | Auth Context User | NavUser Discord Data |
|--------|------------------|---------------------|
| **Purpose** | Authentication state | Display user info |
| **Dev Mode** | Complex mock with character data | Simple mock for UI |
| **Prod Mode** | Could have real data | Fetches real Discord data |
| **Usage** | Character system, game logic | Navbar display only |

---

## 🎯 Use Cases

### Auth Context (with mock users):
```typescript
// For features that need user/character data
const { user } = useAuth();

if (user?.character) {
  // Show character info
  // Character level, gold, etc.
}
```

### NavUser (with Discord JWT):
```typescript
// For displaying user in navbar
const [userData, setUserData] = useState();

// Fetch from Discord API
const response = await axios.get('/auth/me');
setUserData(response.data.user);

// Display: username, email, avatar
```

---

## 🔧 Configuration

### Environment Variables Used:
- `VITE_APP_MODE` - Determines which data source to use
  - `development` → Mock data
  - `production` → Discord API

### API Endpoint (Production):
```
GET https://api.spacewalk.my.id/auth/me
Credentials: include (for JWT cookies)
```

---

## ✅ Testing

### Development Mode:
```bash
npm run dev
```
1. Go to `/dashboard`
2. Check navbar (top or sidebar)
3. Should show "MockUser" with default avatar
4. No Discord API calls made

### Production Mode:
```bash
npm run dev:prod
```
1. Go to `/dashboard`
2. Should fetch from Discord API
3. If authenticated → Shows real user data
4. If not authenticated → Redirects to Discord OAuth

---

## 🎊 Summary

**NavUser now:**
- ✅ Fetches real Discord data in production (via JWT)
- ✅ Uses simple mock in development (for UI testing)
- ✅ Works with Auth Context for mode detection
- ✅ Maintains separation of concerns

**Auth Context still:**
- ✅ Provides mode detection
- ✅ Handles authentication flow
- ✅ Provides mock users for character system
- ✅ Used by other components for game logic

**Best of both worlds!** 🎉
