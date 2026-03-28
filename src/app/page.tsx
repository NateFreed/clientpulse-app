import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">Client</span>
          <span className="text-foreground">Pulse</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground transition-colors">Sign In</Link>
          <Link href="/auth/signup" className="px-5 py-2 bg-accent hover:bg-accent-light rounded-xl text-sm font-semibold text-white shadow-sm shadow-accent/20 transition-all hover:-translate-y-0.5">Start Free Trial</Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden py-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent/5 blur-[140px] pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted">10x cheaper than DashThis. AI-powered insights.</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">Client</span>
            <span className="text-foreground">Pulse</span>
          </h1>
          <p className="text-xl text-muted mb-3">Stop building reports in Google Slides.</p>
          <p className="text-lg text-muted/60 mb-10">AI-powered client dashboards with white-label branding. From <span className="text-foreground font-semibold">$29/mo</span>.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/auth/signup" className="px-8 py-3.5 bg-accent hover:bg-accent-light rounded-xl font-semibold text-lg text-white shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5">Start Free Trial</Link>
            <Link href="/auth/login" className="px-8 py-3.5 border border-border hover:border-border-light rounded-xl font-semibold text-lg text-muted hover:text-foreground transition-all hover:-translate-y-0.5">Sign In</Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted mb-12">Everything agencies need</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Dashboards', desc: 'Drag-and-drop widgets for any data', icon: '📊' },
              { title: 'AI Insights', desc: 'Auto-generated executive summaries', icon: '🤖' },
              { title: 'White-Label', desc: 'Your branding, your domain', icon: '🏷' },
              { title: 'PDF Export', desc: 'One-click professional reports', icon: '📄' },
            ].map((f) => (
              <div key={f.title} className="glow-card p-6 text-center">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted mb-4">Pricing</h2>
          <p className="text-center text-sm text-muted/60 mb-12">DashThis: $249/mo. AgencyAnalytics: $300/mo. <span className="text-accent font-semibold">ClientPulse: $29/mo.</span></p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glow-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Free</h3>
              <p className="text-3xl font-bold text-foreground mb-4">$0<span className="text-sm text-muted font-normal">/mo</span></p>
              <ul className="space-y-2 text-sm text-muted mb-6"><li>2 client dashboards</li><li>Basic widgets</li><li>ClientPulse branding</li></ul>
              <Link href="/auth/signup" className="block w-full py-2.5 border border-border rounded-xl text-sm font-semibold text-center text-muted hover:text-foreground transition-all">Get Started</Link>
            </div>
            <div className="glow-card p-6 ring-2 ring-accent/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent rounded-full text-xs font-semibold text-white">Most Popular</div>
              <h3 className="text-lg font-bold text-foreground mb-1">Pro</h3>
              <p className="text-3xl font-bold text-foreground mb-4">$29<span className="text-sm text-muted font-normal">/mo</span></p>
              <ul className="space-y-2 text-sm text-muted mb-6"><li>15 clients</li><li>White-label</li><li>AI summaries</li><li>PDF export</li></ul>
              <Link href="/auth/signup" className="block w-full py-2.5 bg-accent hover:bg-accent-light rounded-xl text-sm font-semibold text-center text-white shadow-sm shadow-accent/20 transition-all hover:-translate-y-0.5">Start Free Trial</Link>
            </div>
            <div className="glow-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Agency</h3>
              <p className="text-3xl font-bold text-foreground mb-4">$79<span className="text-sm text-muted font-normal">/mo</span></p>
              <ul className="space-y-2 text-sm text-muted mb-6"><li>Unlimited clients</li><li>Custom domain</li><li>Team access</li><li>Priority support</li></ul>
              <Link href="/auth/signup" className="block w-full py-2.5 border border-border rounded-xl text-sm font-semibold text-center text-muted hover:text-foreground transition-all">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4 text-center">
        <span className="text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">Client</span>
          <span className="text-foreground">Pulse</span>
        </span>
        <p className="text-sm text-muted mt-2">AI-powered client reports for agencies.</p>
      </footer>
    </main>
  );
}
