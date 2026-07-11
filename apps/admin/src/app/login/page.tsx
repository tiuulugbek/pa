'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { adminApi, setToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.login(username.trim(), password);
      setToken(res.token);
      router.replace('/dashboard');
    } catch {
      setError('Login yoki parol notoʻgʻri');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-sm p-8" autoComplete="on">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-dark font-bold text-white">
            PA
          </span>
          <span className="text-lg font-bold text-text-dark">Admin Panel</span>
        </div>

        <label className="label" htmlFor="username">Login</label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          minLength={3}
          maxLength={64}
          className="input mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="label" htmlFor="password">Parol</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          maxLength={128}
          className="input mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          <LogIn className="h-4 w-4" />
          {loading ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}
