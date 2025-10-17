# Spacewalk Website
The main source code of spacewalk website.

## 🚀 Quick Start

### Development Mode (Mock Data - Recommended for UI Development)
```bash
npm install
npm run dev:mock
```
No backend required! Use mock data for fast UI development and testing.

### Production Mode (Real Discord Auth)
```bash
npm install
npm run dev:prod
```
Requires backend API to be running. Uses real Discord OAuth.

## 📖 Documentation

📚 **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Complete development guide (All-in-one documentation)
- Quick Start
- Mode Switching System
- Implementation Details
- Usage Examples
- API Reference
- Troubleshooting
- Fixes Applied

## 🎯 Mode Switching

This project supports **2 modes**:

### 🎭 Development Mode (Mock Data)
- ✅ No backend required
- ✅ Mock user authentication
- ✅ Mock API responses
- ✅ Quick UI iterations
- ✅ Dev Mode Indicator for testing

**Start:** `npm run dev:mock`

### 🚀 Production Mode (Real Auth)
- ✅ Real Discord OAuth
- ✅ Real API backend
- ✅ Database operations
- ✅ Production-ready

**Start:** `npm run dev:prod`

## 📦 Available Scripts

```bash
npm run dev          # Development mode (default)
npm run dev:mock     # Development mode (explicit)
npm run dev:prod     # Production mode
npm run build        # Build for development
npm run build:prod   # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Radix UI** components
- **React Router** for routing
- **Context API** for state management
- **Mock Data System** for development

## 🎨 Features

- ✨ Dark/Light mode support
- 🎭 Development mode with mock data
- 🔐 Discord OAuth authentication
- 📱 Responsive design
- 🎯 Type-safe API calls
- 🧩 Modular component architecture

## 🔧 Environment Variables

Create `.env` files:

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

## 📂 Project Structure

```
src/
├── components/       # React components
├── context/         # React contexts (Auth, Theme)
├── hooks/           # Custom hooks (useApi, useMobile)
├── lib/             # Utilities and mock data
├── types/           # TypeScript type definitions
└── assets/          # Static assets
```

## 🎓 Usage Examples

See `src/components/examples/auth-api-examples.tsx` for complete usage examples.

### Basic Auth Usage:
```typescript
import { useAuth } from '@/context/auth-context';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return isAuthenticated ? (
    <div>Welcome, {user?.username}!</div>
  ) : (
    <button onClick={login}>Login</button>
  );
}
```

### API Calls:
```typescript
import { useApi } from '@/hooks/use-api';

function MyComponent() {
  const api = useApi();
  
  const checkUsername = async () => {
    const result = await api.checkUsername('test');
    console.log('Available:', result.available);
  };
}
```

## 🐛 Development Tools

### Dev Mode Indicator
When running in development mode, a panel appears in the bottom-right corner with:
- Current mode display
- User authentication status
- Quick actions to switch between mock users
- Mock login/logout buttons

### Console Logging
All mode-aware operations are logged with prefixes:
- `[development mode]` - Mock data operations
- `[production mode]` - Real API operations

## 🤝 Contributing

1. Use `npm run dev:mock` for UI development
2. Use `npm run dev:prod` to test with real backend
3. Follow TypeScript best practices
4. Add types to `src/types/` for new features
5. Update mock data in `src/lib/mockData.ts` if needed

## 📄 Lisensi
Proyek ini dilisensikan di bawah ketentuan **GNU General Public License v3.0**.<br/>
Lihat [LICENSE](LICENSE) untuk informasi lebih lanjut.

---
**Copyright (C) [2025] [Spacewalk]**

