import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-400/5 blur-[100px] pointer-events-none" />
      <div className="text-center relative z-10">
        <Link href="/" className="inline-block text-2xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">Client</span>
          <span className="text-foreground">Pulse</span>
        </Link>
        <h1 className="text-2xl font-bold mb-2 text-foreground">Start your free trial</h1>
        <p className="text-muted mb-8">Create beautiful client dashboards in minutes</p>
        <AuthForm mode="signup" />
        <p className="mt-6 text-sm text-muted">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent-light hover:text-accent font-medium">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
