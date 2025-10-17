# Dark Mode Toggle - Dokumentasi

## File yang Dibuat

1. **`src/components/theme-provider.tsx`** - Provider untuk mengelola theme (dark/light/system)
2. **`src/components/mode-toggle.tsx`** - Komponen tombol toggle dark mode

## Cara Penggunaan

### 1. ThemeProvider sudah diintegrasikan di `App.tsx`

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

### 2. Menggunakan ModeToggle di komponen apapun

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

### 3. Menggunakan useTheme hook

Jika Anda ingin membuat custom toggle atau mengakses theme:

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

## Opsi Theme

- **`dark`** - Mode gelap
- **`light`** - Mode terang
- **`system`** - Mengikuti preferensi sistem operasi

## Penyimpanan

Theme akan disimpan di `localStorage` dengan key `vite-ui-theme` (bisa diubah melalui prop `storageKey`).

## Contoh Implementasi

Tombol dark mode sudah ditambahkan di:
- **Dashboard Main Sidebar** (`src/components/layout/dashboard/main/app-sidebar.tsx`)
- **Dashboard Docs Sidebar** (`src/components/layout/dashboard/docs/app-sidebar.tsx`)

Anda bisa menambahkannya di komponen lain dengan cara yang sama.

## Customisasi

### Mengubah default theme:

```tsx
<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
```

### Mengubah tampilan tombol:

Edit `src/components/mode-toggle.tsx` sesuai kebutuhan. Anda bisa:
- Mengganti icon
- Mengubah variant button
- Menambahkan animasi custom
- Mengubah layout dropdown menu
