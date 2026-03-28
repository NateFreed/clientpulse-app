'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') await signUp(email, password);
      else await signIn(email, password);
      router.push('/dashboards');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-muted mb-1.5">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50"
          placeholder="you@agency.com" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-muted mb-1.5">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
          className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50"
          placeholder="••••••••" />
      </div>
      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      <button type="submit" disabled={loading}
        className="w-full py-2.5 px-4 bg-accent hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0">
        {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Start Free Trial'}
      </button>
    </form>
  );
}
