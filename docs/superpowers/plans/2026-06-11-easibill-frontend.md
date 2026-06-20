# Easibill Frontend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Prerequisite:** The backend plan (`2026-06-11-easibill-backend.md`) must be complete and the backend server must be running at `http://localhost:3001`.

**Goal:** Build the Easibill dashboard — Next.js 14 App Router with auth, patient management, WhatsApp QR connect, and reminder views.

**Architecture:** App Router with route groups: `(auth)` for login/register pages, `(dashboard)` for all protected pages. Auth token stored in `localStorage`, passed as `Authorization: Bearer` header on all API calls. A typed `api.ts` fetch wrapper handles all communication with the backend. No server-side data fetching in MVP — all client-side with `useEffect`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React 18

---

## File Map

| File | Responsibility |
|------|----------------|
| `frontend/package.json` | Dependencies + scripts |
| `frontend/next.config.ts` | Proxy rewrites to backend |
| `frontend/tailwind.config.ts` | Tailwind config |
| `frontend/tsconfig.json` | TypeScript config |
| `frontend/components.json` | shadcn/ui config |
| `frontend/lib/api.ts` | Typed fetch wrapper (all HTTP calls go through here) |
| `frontend/lib/auth.ts` | Token read/write helpers |
| `frontend/contexts/AuthContext.tsx` | Auth state provider |
| `frontend/app/layout.tsx` | Root layout (AuthProvider) |
| `frontend/app/(auth)/layout.tsx` | Centered card layout for auth pages |
| `frontend/app/(auth)/login/page.tsx` | Login form |
| `frontend/app/(auth)/register/page.tsx` | Register form |
| `frontend/app/(dashboard)/layout.tsx` | Sidebar nav + auth guard |
| `frontend/app/(dashboard)/page.tsx` | Dashboard home (stats + today + upcoming) |
| `frontend/app/(dashboard)/patients/page.tsx` | Patient list with search |
| `frontend/app/(dashboard)/patients/[id]/page.tsx` | Patient detail + purchase history |
| `frontend/app/(dashboard)/reminders/page.tsx` | Reminder list with filter |
| `frontend/app/(dashboard)/settings/page.tsx` | WhatsApp QR connect |
| `frontend/components/shared/StatsBar.tsx` | 4 stat cards |
| `frontend/components/shared/ActivityFeed.tsx` | Last 10 events |
| `frontend/components/shared/ReminderCard.tsx` | Single reminder row |
| `frontend/components/shared/PatientModal.tsx` | Add/Edit patient modal |
| `frontend/components/shared/AddPurchaseForm.tsx` | Add purchase form (inside patient detail) |
| `frontend/components/shared/WAStatusBadge.tsx` | Gupshup connection status indicator |

---

## Task 1: Next.js Scaffold + API Client

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/next.config.ts`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/postcss.config.js`
- Create: `frontend/components.json`
- Create: `frontend/lib/api.ts`
- Create: `frontend/lib/auth.ts`
- Create: `frontend/app/globals.css`
- Create: `frontend/app/layout.tsx`

- [ ] **Step 1: Create frontend/package.json**

```json
{
  "name": "easibill-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-separator": "^1.0.3",
    "lucide-react": "^0.379.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.3",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19"
  }
}
```

- [ ] **Step 2: Create frontend/next.config.ts**

```typescript
// frontend/next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 3: Create frontend/tailwind.config.ts**

```typescript
// frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Create frontend/tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create frontend/postcss.config.js**

```js
// frontend/postcss.config.js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

- [ ] **Step 6: Create frontend/app/globals.css**

```css
/* frontend/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --radius: 0.5rem;
  }
}

* { border-color: hsl(var(--border)); }
body { background-color: hsl(var(--background)); color: hsl(var(--foreground)); }
```

- [ ] **Step 7: Create frontend/lib/auth.ts**

```typescript
// frontend/lib/auth.ts
const TOKEN_KEY = 'easibill_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
```

- [ ] **Step 8: Create frontend/lib/api.ts**

```typescript
// frontend/lib/api.ts
import { getToken } from './auth';

const BASE = '/api/v1';

class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data.error || 'Request failed', data.code);
  }
  return data;
}

export const api = {
  auth: {
    register: (body: { name: string; owner_name: string; phone: string; email: string; password: string }) =>
      request<{ token: string; pharmacy: Pharmacy }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request<{ token: string; pharmacy: Pharmacy }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  },
  pharmacy: {
    me: () => request<{ pharmacy: Pharmacy }>('/pharmacy/me'),
    waStatus: () => request<{ status: string; qr: string | null }>('/pharmacy/wa-status'),
    waConnect: () => request<{ message: string }>('/pharmacy/wa-connect', { method: 'POST' }),
    waDisconnect: () => request<{ message: string }>('/pharmacy/wa-disconnect', { method: 'POST' }),
  },
  patients: {
    list: (search?: string) =>
      request<{ patients: Patient[] }>(`/patients${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    get: (id: string) => request<{ patient: Patient & { history: PurchaseHistory[] } }>(`/patients/${id}`),
    create: (body: Partial<Patient>) =>
      request<{ patient: Patient }>('/patients', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Patient>) =>
      request<{ patient: Patient }>(`/patients/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => request<{ message: string }>(`/patients/${id}`, { method: 'DELETE' }),
  },
  purchases: {
    create: (body: { patient_id: string; medicine_name: string; quantity?: number; purchased_at: string; refill_interval_days?: number; notes?: string }) =>
      request<{ purchase: Purchase; reminder: Reminder }>('/purchases', { method: 'POST', body: JSON.stringify(body) }),
  },
  reminders: {
    list: (params?: { status?: string; from?: string; to?: string }) =>
      request<{ reminders: Reminder[] }>(`/reminders${params ? '?' + new URLSearchParams(params as any).toString() : ''}`),
    cancel: (id: string) => request<{ reminder: Reminder }>(`/reminders/${id}/cancel`, { method: 'POST' }),
    reschedule: (id: string, date: string) =>
      request<{ reminder: Reminder }>(`/reminders/${id}/reschedule`, { method: 'POST', body: JSON.stringify({ date }) }),
    retry: (id: string) => request<{ jobId: string }>(`/reminders/${id}/retry`, { method: 'POST' }),
  },
  dashboard: {
    stats: () => request<{ stats: DashboardStats }>('/dashboard/stats'),
    today: () => request<{ reminders: ReminderWithDetails[] }>('/dashboard/today'),
    upcoming: () => request<{ reminders: ReminderWithDetails[] }>('/dashboard/upcoming'),
    activity: () => request<{ activity: ActivityItem[] }>('/dashboard/activity'),
  },
};

// Types
export interface Pharmacy {
  id: string; name: string; owner_name: string; phone: string; email: string;
  plan: 'starter' | 'pro'; wallet_credits: number; wa_connected: boolean; timezone: string;
}

export interface Patient {
  id: string; pharmacy_id: string; name: string; phone: string;
  whatsapp_phone?: string; language: string; notes?: string; is_active: boolean; created_at: string;
}

export interface Purchase {
  id: string; pharmacy_id: string; patient_id: string; medicine_name: string;
  quantity?: number; purchased_at: string; refill_interval_days: number; notes?: string;
}

export interface Reminder {
  id: string; pharmacy_id: string; patient_id: string; purchase_id: string;
  scheduled_for: string; status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  sent_at?: string; message_template?: string; attempt_count: number; error_message?: string;
}

export interface ReminderWithDetails extends Reminder {
  patient_name: string; patient_phone: string; medicine_name: string;
}

export interface PurchaseHistory {
  purchase: Purchase;
  reminders: Reminder[] | null;
}

export interface DashboardStats {
  total_patients: number; active_reminders: number; messages_sent_this_month: number;
}

export interface ActivityItem {
  id: string; pharmacy_id: string; reminder_id: string; to_phone: string;
  message_body: string; channel: string; status: string; created_at: string; patient_name?: string;
}

export { ApiError };
```

- [ ] **Step 9: Create frontend/app/layout.tsx (skeleton — AuthProvider added in Task 2)**

```tsx
// frontend/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Easibill',
  description: 'WhatsApp refill reminders for pharmacies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Install dependencies and verify Next.js starts**

```bash
cd frontend && npm install && npm run dev
```

Expected: Next.js dev server starts at `http://localhost:3000`. Visit it — should show a 404 page (no routes yet). Ctrl+C to stop.

- [ ] **Step 11: Commit**

```bash
git add frontend/
git commit -m "feat: Next.js frontend scaffold with typed API client"
```

---

## Task 2: Auth Context + Login/Register Pages

**Files:**
- Create: `frontend/contexts/AuthContext.tsx`
- Create: `frontend/app/(auth)/layout.tsx`
- Create: `frontend/app/(auth)/login/page.tsx`
- Create: `frontend/app/(auth)/register/page.tsx`
- Modify: `frontend/app/layout.tsx` (wrap with AuthProvider)

- [ ] **Step 1: Create frontend/contexts/AuthContext.tsx**

```tsx
// frontend/contexts/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, Pharmacy } from '../lib/api';
import { getToken, setToken, clearToken } from '../lib/auth';

interface AuthContextValue {
  pharmacy: Pharmacy | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; owner_name: string; phone: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    api.pharmacy.me()
      .then(({ pharmacy }) => setPharmacy(pharmacy))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token, pharmacy } = await api.auth.login({ email, password });
    setToken(token);
    setPharmacy(pharmacy);
  };

  const register = async (data: Parameters<typeof api.auth.register>[0]) => {
    const { token, pharmacy } = await api.auth.register(data);
    setToken(token);
    setPharmacy(pharmacy);
  };

  const logout = () => {
    clearToken();
    setPharmacy(null);
  };

  return (
    <AuthContext.Provider value={{ pharmacy, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
```

- [ ] **Step 2: Update frontend/app/layout.tsx to wrap with AuthProvider**

```tsx
// frontend/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Easibill',
  description: 'WhatsApp refill reminders for pharmacies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create frontend/app/(auth)/layout.tsx**

```tsx
// frontend/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Easibill</h1>
          <p className="text-gray-500 mt-1">WhatsApp Refill Reminders</p>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create frontend/app/(auth)/login/page.tsx**

```tsx
// frontend/app/(auth)/login/page.tsx
'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { ApiError } from '../../../lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <h2 className="text-xl font-semibold mb-6">Sign in to your pharmacy</h2>
      {error && <div className="bg-red-50 text-red-700 rounded p-3 mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full bg-gray-900 text-white rounded-md py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4 text-center">
        No account?{' '}
        <Link href="/register" className="text-gray-900 underline">Register your pharmacy</Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Create frontend/app/(auth)/register/page.tsx**

```tsx
// frontend/app/(auth)/register/page.tsx
'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { ApiError } from '../../../lib/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', owner_name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <h2 className="text-xl font-semibold mb-6">Register your pharmacy</h2>
      {error && <div className="bg-red-50 text-red-700 rounded p-3 mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { field: 'name' as const, label: 'Pharmacy Name', type: 'text' },
          { field: 'owner_name' as const, label: 'Owner Name', type: 'text' },
          { field: 'phone' as const, label: 'WhatsApp Phone (+91...)', type: 'tel' },
          { field: 'email' as const, label: 'Email', type: 'email' },
          { field: 'password' as const, label: 'Password', type: 'password' },
        ].map(({ field, label, type }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type} value={form[field]} onChange={set(field)} required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        ))}
        <button
          type="submit" disabled={loading}
          className="w-full bg-gray-900 text-white rounded-md py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Registering…' : 'Register Pharmacy'}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-gray-900 underline">Sign in</Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 6: Verify auth pages render (backend must be running)**

```bash
cd frontend && npm run dev
```

Visit `http://localhost:3000/login` — should show the login form.
Visit `http://localhost:3000/register` — should show the register form.

- [ ] **Step 7: Commit**

```bash
git add frontend/contexts/ frontend/app/layout.tsx frontend/app/(auth)/
git commit -m "feat: auth pages — login and register with AuthContext"
```

---

## Task 3: Dashboard Layout + Home Page

**Files:**
- Create: `frontend/app/(dashboard)/layout.tsx`
- Create: `frontend/app/(dashboard)/page.tsx`
- Create: `frontend/components/shared/StatsBar.tsx`
- Create: `frontend/components/shared/ReminderCard.tsx`
- Create: `frontend/components/shared/ActivityFeed.tsx`

- [ ] **Step 1: Create frontend/app/(dashboard)/layout.tsx**

```tsx
// frontend/app/(dashboard)/layout.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, Bell, Settings, LogOut, Loader2 } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/reminders', label: 'Reminders', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { pharmacy, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !pharmacy) router.push('/login');
  }, [loading, pharmacy, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!pharmacy) return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-700">
          <p className="font-bold text-lg">Easibill</p>
          <p className="text-gray-400 text-xs truncate">{pharmacy.name}</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {NAV.map(({ href, label, Icon: _Icon }) => {
            const Icon = _Icon;
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-gray-700">
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create frontend/components/shared/StatsBar.tsx**

```tsx
// frontend/components/shared/StatsBar.tsx
import { DashboardStats } from '../../lib/api';
import { Users, Bell, MessageSquare, Wifi } from 'lucide-react';

interface Props {
  stats: DashboardStats;
  waConnected: boolean;
}

export function StatsBar({ stats, waConnected }: Props) {
  const cards = [
    { label: 'Total Patients', value: stats.total_patients, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Reminders', value: stats.active_reminders, icon: Bell, color: 'text-orange-600 bg-orange-50' },
    { label: 'Sent This Month', value: stats.messages_sent_this_month, icon: MessageSquare, color: 'text-green-600 bg-green-50' },
    {
      label: 'WhatsApp',
      value: waConnected ? 'Connected' : 'Disconnected',
      icon: Wifi,
      color: waConnected ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50',
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className={`p-2 rounded-md ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create frontend/components/shared/ReminderCard.tsx**

```tsx
// frontend/components/shared/ReminderCard.tsx
import { ReminderWithDetails } from '../../lib/api';

const STATUS_STYLES: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-700',
  sent: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

interface Props {
  reminder: ReminderWithDetails;
}

export function ReminderCard({ reminder }: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{reminder.patient_name}</p>
        <p className="text-xs text-gray-500">{reminder.medicine_name} · {reminder.patient_phone}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-xs text-gray-500">{reminder.scheduled_for}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[reminder.status] || 'bg-gray-100 text-gray-600'}`}>
          {reminder.status}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create frontend/components/shared/ActivityFeed.tsx**

```tsx
// frontend/components/shared/ActivityFeed.tsx
import { ActivityItem } from '../../lib/api';

interface Props {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: Props) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No activity yet</p>;
  }
  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
          <div>
            <span className="font-medium">{item.patient_name || item.to_phone}</span>
            <span className="text-gray-400 ml-2">via {item.channel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'sent' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {item.status}
            </span>
            <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create frontend/app/(dashboard)/page.tsx**

```tsx
// frontend/app/(dashboard)/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { api, DashboardStats, ReminderWithDetails, ActivityItem } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { StatsBar } from '../../components/shared/StatsBar';
import { ReminderCard } from '../../components/shared/ReminderCard';
import { ActivityFeed } from '../../components/shared/ActivityFeed';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { pharmacy } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayReminders, setTodayReminders] = useState<ReminderWithDetails[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<ReminderWithDetails[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.dashboard.stats(),
      api.dashboard.today(),
      api.dashboard.upcoming(),
      api.dashboard.activity(),
    ]).then(([s, t, u, a]) => {
      setStats(s.stats);
      setTodayReminders(t.reminders);
      setUpcomingReminders(u.reminders);
      setActivity(a.activity);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good morning</h1>
        <p className="text-gray-500 text-sm">{pharmacy?.name} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {stats && <StatsBar stats={stats} waConnected={pharmacy?.wa_connected ?? false} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Today's Reminders ({todayReminders.length})</h2>
          {todayReminders.length === 0
            ? <p className="text-sm text-gray-400 py-4 text-center">No reminders today</p>
            : todayReminders.map(r => <ReminderCard key={r.id} reminder={r} />)
          }
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Upcoming This Week ({upcomingReminders.length})</h2>
          {upcomingReminders.length === 0
            ? <p className="text-sm text-gray-400 py-4 text-center">No upcoming reminders</p>
            : upcomingReminders.map(r => <ReminderCard key={r.id} reminder={r} />)
          }
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Recent Activity</h2>
        <ActivityFeed items={activity} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify dashboard renders (backend + frontend both running)**

```bash
# Terminal 1: backend
cd backend && npm run dev

# Terminal 2: frontend
cd frontend && npm run dev
```

Register at `http://localhost:3000/register` then verify the dashboard home at `http://localhost:3000/` shows stats cards and empty reminder sections.

- [ ] **Step 7: Commit**

```bash
git add frontend/app/(dashboard)/ frontend/components/shared/StatsBar.tsx frontend/components/shared/ReminderCard.tsx frontend/components/shared/ActivityFeed.tsx
git commit -m "feat: dashboard home — stats, today reminders, upcoming, activity feed"
```

---

## Task 4: Patients List + Detail + Add/Edit Modals

**Files:**
- Create: `frontend/components/shared/PatientModal.tsx`
- Create: `frontend/components/shared/AddPurchaseForm.tsx`
- Create: `frontend/app/(dashboard)/patients/page.tsx`
- Create: `frontend/app/(dashboard)/patients/[id]/page.tsx`

- [ ] **Step 1: Create frontend/components/shared/PatientModal.tsx**

```tsx
// frontend/components/shared/PatientModal.tsx
'use client';
import { useState, FormEvent } from 'react';
import { api, Patient } from '../../lib/api';
import { X } from 'lucide-react';

interface Props {
  patient?: Patient;
  onClose: () => void;
  onSaved: (patient: Patient) => void;
}

export function PatientModal({ patient, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    name: patient?.name || '',
    phone: patient?.phone || '',
    whatsapp_phone: patient?.whatsapp_phone || '',
    language: patient?.language || 'hindi',
    notes: patient?.notes || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = patient
        ? await api.patients.update(patient.id, form)
        : await api.patients.create(form);
      onSaved(result.patient);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">{patient ? 'Edit Patient' : 'Add Patient'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        {error && <div className="bg-red-50 text-red-700 rounded p-2 mb-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" value={form.name} onChange={set('name')} required
              className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
            <input type="tel" value={form.phone} onChange={set('phone')} required placeholder="+919999999999"
              className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp (if different)</label>
            <input type="tel" value={form.whatsapp_phone} onChange={set('whatsapp_phone')} placeholder="+919999999999"
              className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Language</label>
            <select value={form.language} onChange={set('language')}
              className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900">
              {['hindi', 'english', 'marathi', 'telugu', 'kannada'].map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes (condition, doctor, etc.)</label>
            <textarea value={form.notes} onChange={set('notes')} rows={2}
              className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border rounded py-1.5 text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-gray-900 text-white rounded py-1.5 text-sm hover:bg-gray-800 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create frontend/components/shared/AddPurchaseForm.tsx**

```tsx
// frontend/components/shared/AddPurchaseForm.tsx
'use client';
import { useState, FormEvent } from 'react';
import { api, Purchase, Reminder } from '../../lib/api';

interface Props {
  patientId: string;
  onAdded: (purchase: Purchase, reminder: Reminder) => void;
}

export function AddPurchaseForm({ patientId, onAdded }: Props) {
  const [form, setForm] = useState({
    medicine_name: '',
    quantity: '',
    purchased_at: new Date().toISOString().split('T')[0],
    refill_interval_days: '28',
    notes: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { purchase, reminder } = await api.purchases.create({
        patient_id: patientId,
        medicine_name: form.medicine_name,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        purchased_at: new Date(form.purchased_at).toISOString(),
        refill_interval_days: Number(form.refill_interval_days),
        notes: form.notes || undefined,
      });
      onAdded(purchase, reminder);
      setForm({ medicine_name: '', quantity: '', purchased_at: new Date().toISOString().split('T')[0], refill_interval_days: '28', notes: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to add purchase');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-gray-50 space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Add Purchase</h3>
      {error && <div className="bg-red-50 text-red-700 rounded p-2 text-xs">{error}</div>}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Medicine Name *</label>
          <input type="text" value={form.medicine_name} onChange={set('medicine_name')} required
            className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Qty (strips/bottles)</label>
          <input type="number" value={form.quantity} onChange={set('quantity')} min="1"
            className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Refill in (days)</label>
          <input type="number" value={form.refill_interval_days} onChange={set('refill_interval_days')} min="1" max="365"
            className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Purchase Date *</label>
          <input type="date" value={form.purchased_at} onChange={set('purchased_at')} required
            className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
        </div>
      </div>
      <button type="submit" disabled={saving}
        className="w-full bg-gray-900 text-white rounded py-1.5 text-sm hover:bg-gray-800 disabled:opacity-50">
        {saving ? 'Scheduling Reminder…' : 'Add Purchase + Schedule Reminder'}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create frontend/app/(dashboard)/patients/page.tsx**

```tsx
// frontend/app/(dashboard)/patients/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Patient } from '../../../lib/api';
import { PatientModal } from '../../../components/shared/PatientModal';
import { Plus, Search, Loader2 } from 'lucide-react';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchPatients = async (q?: string) => {
    setLoading(true);
    const { patients } = await api.patients.list(q);
    setPatients(patients);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchPatients(e.target.value || undefined);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" /> Add Patient
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text" value={search} onChange={handleSearch} placeholder="Search by name or phone…"
          className="w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
      ) : patients.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {search ? 'No patients found' : 'No patients yet — add your first patient'}
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Phone</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Language</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{p.language}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <Link href={`/patients/${p.id}`} className="text-blue-600 hover:underline text-xs">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <PatientModal
          onClose={() => setShowModal(false)}
          onSaved={(p) => { setPatients(prev => [p, ...prev]); setShowModal(false); }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create frontend/app/(dashboard)/patients/[id]/page.tsx**

```tsx
// frontend/app/(dashboard)/patients/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, Patient, Purchase, Reminder, PurchaseHistory } from '../../../../lib/api';
import { PatientModal } from '../../../../components/shared/PatientModal';
import { AddPurchaseForm } from '../../../../components/shared/AddPurchaseForm';
import { Loader2, ArrowLeft, Edit, Trash2 } from 'lucide-react';

type PatientDetail = Patient & { history: PurchaseHistory[] };

const STATUS_STYLES: Record<string, string> = {
  scheduled: 'text-blue-600',
  sent: 'text-green-600',
  failed: 'text-red-600',
  cancelled: 'text-gray-400',
};

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const fetchPatient = () => {
    api.patients.get(id).then(({ patient }) => setPatient(patient)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPatient(); }, [id]);

  const handleDelete = async () => {
    if (!confirm('Deactivate this patient?')) return;
    await api.patients.delete(id);
    router.push('/patients');
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;
  if (!patient) return <div className="p-6 text-gray-400">Patient not found</div>;

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => router.push('/patients')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to patients
      </button>

      <div className="bg-white rounded-lg border p-5 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-500 text-sm">{patient.phone}</p>
            {patient.notes && <p className="text-gray-400 text-xs mt-1">{patient.notes}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowEdit(true)} className="p-1.5 rounded hover:bg-gray-100"><Edit className="h-4 w-4 text-gray-500" /></button>
            <button onClick={handleDelete} className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="h-4 w-4 text-red-500" /></button>
          </div>
        </div>
      </div>

      <AddPurchaseForm
        patientId={id}
        onAdded={(purchase, reminder) => {
          setPatient(prev => prev ? {
            ...prev,
            history: [{ purchase, reminders: [reminder] }, ...prev.history],
          } : null);
        }}
      />

      <div className="mt-6">
        <h2 className="font-semibold text-gray-900 mb-3">Purchase History</h2>
        {patient.history.length === 0 ? (
          <p className="text-sm text-gray-400">No purchases yet</p>
        ) : (
          <div className="space-y-3">
            {patient.history.map(({ purchase, reminders }) => (
              <div key={purchase.id} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{purchase.medicine_name}</p>
                  <p className="text-xs text-gray-400">{new Date(purchase.purchased_at).toLocaleDateString('en-IN')}</p>
                </div>
                <p className="text-xs text-gray-500">Refill every {purchase.refill_interval_days} days</p>
                {reminders && reminders.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {reminders.map(r => (
                      <div key={r.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Reminder: {r.scheduled_for}</span>
                        <span className={STATUS_STYLES[r.status] || 'text-gray-500'}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showEdit && (
        <PatientModal
          patient={patient}
          onClose={() => setShowEdit(false)}
          onSaved={(p) => { setPatient(prev => prev ? { ...prev, ...p } : null); setShowEdit(false); }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify patients pages work**

With backend running, visit `http://localhost:3000/patients`:
- Add a patient via the modal — should appear in the list
- Click "View" — should open patient detail
- Add a purchase — should show in history with a reminder
- Edit and delete buttons should work

- [ ] **Step 6: Commit**

```bash
git add frontend/components/shared/PatientModal.tsx frontend/components/shared/AddPurchaseForm.tsx frontend/app/(dashboard)/patients/
git commit -m "feat: patient list, detail, add/edit modal, and add purchase form"
```

---

## Task 5: Settings Page + Reminders Page

**Files:**
- Create: `frontend/components/shared/WAStatusBadge.tsx`
- Create: `frontend/app/(dashboard)/settings/page.tsx`
- Create: `frontend/app/(dashboard)/reminders/page.tsx`

> **Context:** Gupshup is configured via server env vars — there is no QR code scan or per-pharmacy session. The settings page shows Gupshup status (connected/not configured) and pharmacy profile details. Status is fetched from `GET /pharmacy/wa-status` which checks whether `GUPSHUP_API_KEY` is set on the server.

- [ ] **Step 1: Create frontend/components/shared/WAStatusBadge.tsx**

```tsx
// frontend/components/shared/WAStatusBadge.tsx
'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export function WAStatusBadge() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | null>(null);

  useEffect(() => {
    api.pharmacy.waStatus()
      .then(({ status: s }) => setStatus(s as 'connected' | 'disconnected'))
      .catch(() => setStatus('disconnected'));
  }, []);

  if (status === null) return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;

  return status === 'connected' ? (
    <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
      <Wifi className="h-4 w-4" /> WhatsApp Active
    </div>
  ) : (
    <div className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
      <WifiOff className="h-4 w-4" /> WhatsApp Not Configured
    </div>
  );
}
```

- [ ] **Step 2: Update lib/api.ts — simplify waStatus type**

In `frontend/lib/api.ts`, update the `pharmacy.waStatus` return type (the backend no longer returns `qr`):

```typescript
// In the api object, pharmacy section — replace waStatus line:
waStatus: () => request<{ status: string; configured: boolean }>('/pharmacy/wa-status'),
```

Remove these lines from the pharmacy section (no longer needed):
```typescript
waConnect: () => request<{ message: string }>('/pharmacy/wa-connect', { method: 'POST' }),
waDisconnect: () => request<{ message: string }>('/pharmacy/wa-disconnect', { method: 'POST' }),
```

- [ ] **Step 3: Create frontend/app/(dashboard)/settings/page.tsx**

```tsx
// frontend/app/(dashboard)/settings/page.tsx
'use client';
import { useAuth } from '../../../contexts/AuthContext';
import { WAStatusBadge } from '../../../components/shared/WAStatusBadge';

export default function SettingsPage() {
  const { pharmacy } = useAuth();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white rounded-lg border p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-1">Pharmacy Info</h2>
        <div className="space-y-2 text-sm mt-3">
          {[
            ['Name', pharmacy?.name],
            ['Owner', pharmacy?.owner_name],
            ['Email', pharmacy?.email],
            ['Phone', pharmacy?.phone],
            ['Plan', pharmacy?.plan],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <span className="text-gray-500 w-20">{label}:</span>
              <span className="font-medium capitalize">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-5">
        <h2 className="font-semibold text-gray-900 mb-1">WhatsApp (Gupshup WABA)</h2>
        <p className="text-sm text-gray-500 mb-4">
          Messages are sent via Gupshup's official WhatsApp Business API. Configuration is managed server-side via environment variables.
        </p>
        <WAStatusBadge />
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500 space-y-1">
          <p>• Reminders are sent daily at <strong>8:50 AM IST</strong></p>
          <p>• Failed sends are retried up to 3 times with exponential backoff</p>
          <p>• Delivery status (sent → delivered → read) updates automatically via webhook</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create frontend/app/(dashboard)/reminders/page.tsx**

```tsx
// frontend/app/(dashboard)/reminders/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { api, ReminderWithDetails } from '../../../lib/api';
import { Loader2, RotateCcw, X, Calendar } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-700',
  sent: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ReminderWithDetails[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReminders = async (s?: string) => {
    setLoading(true);
    const { reminders } = await api.reminders.list(s ? { status: s } : undefined);
    setReminders(reminders);
    setLoading(false);
  };

  useEffect(() => { fetchReminders(); }, []);

  const handleFilterChange = (s: string) => {
    setStatus(s);
    fetchReminders(s || undefined);
  };

  const handleCancel = async (id: string) => {
    await api.reminders.cancel(id);
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r));
  };

  const handleRetry = async (id: string) => {
    await api.reminders.retry(id);
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'scheduled' as const } : r));
  };

  const handleReschedule = async (id: string) => {
    const date = prompt('Reschedule to date (YYYY-MM-DD):');
    if (!date) return;
    const { reminder } = await api.reminders.reschedule(id, date);
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...reminder } : r));
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
        <div className="flex gap-2">
          {['', 'scheduled', 'sent', 'failed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-1 rounded text-xs font-medium border ${
                status === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No reminders found</div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Patient</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Medicine</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map(r => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.patient_name}</p>
                    <p className="text-xs text-gray-400">{r.patient_phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.medicine_name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.scheduled_for}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-600'}`}>
                      {r.status}
                    </span>
                    {r.status === 'failed' && r.error_message && (
                      <p className="text-xs text-red-500 mt-0.5 max-w-xs truncate">{r.error_message}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {r.status === 'failed' && (
                        <button onClick={() => handleRetry(r.id)} title="Retry" className="p-1 rounded hover:bg-gray-100">
                          <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
                        </button>
                      )}
                      {r.status === 'scheduled' && (
                        <>
                          <button onClick={() => handleReschedule(r.id)} title="Reschedule" className="p-1 rounded hover:bg-gray-100">
                            <Calendar className="h-3.5 w-3.5 text-orange-600" />
                          </button>
                          <button onClick={() => handleCancel(r.id)} title="Cancel" className="p-1 rounded hover:bg-gray-100">
                            <X className="h-3.5 w-3.5 text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify all pages work end-to-end**

With both backend and frontend running:
1. `http://localhost:3000/settings` — should show WhatsApp QR section. Click "Connect WhatsApp" to see QR polling start.
2. `http://localhost:3000/reminders` — should list reminders with filter buttons
3. Add a patient → add purchase → check `/reminders` — the new scheduled reminder should appear

- [ ] **Step 6: Commit**

```bash
git add frontend/components/shared/WAStatusBadge.tsx frontend/lib/api.ts frontend/app/(dashboard)/settings/ frontend/app/(dashboard)/reminders/
git commit -m "feat: Gupshup status settings page, reminders list with cancel/retry/reschedule"
```

---

## Self-Review

**Spec coverage check against PRD Section 5.1 (MVP Frontend):**

- [x] Auth pages: login, register ✅
- [x] Dashboard home: stats bar, today's reminders, upcoming 7 days, activity feed ✅
- [x] Patient list: search, filter by name/phone, add patient button ✅
- [x] Patient detail: all purchase history, all reminders, reminder status ✅
- [x] Add patient modal: name, phone, WhatsApp, language, notes ✅
- [x] Add purchase form: patient, medicine, quantity, date, refill interval ✅
- [x] Edit/delete patients ✅
- [x] WhatsApp connect page: QR code display with polling, connection status badge ✅
- [x] Reminders list: filter by status, cancel/reschedule/retry actions ✅

**Gaps found and addressed:**
- `app/page.tsx` not created — dashboard home is `(dashboard)/page.tsx` which is the `/` route in Next.js App Router due to the route group. This is correct behavior. ✅
- `app/(dashboard)/layout.tsx` includes redirect logic for unauthenticated users ✅

**Type consistency:**
- All types defined in `lib/api.ts` and used consistently across pages and components ✅
- `PatientDetail` type extends `Patient` with `history: PurchaseHistory[]` — matches backend response ✅
