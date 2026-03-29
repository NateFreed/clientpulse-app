'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';

const PLANS = [
  {
    id: 'clientpulse_pro',
    name: 'Pro',
    price: '$29',
    period: '/mo',
    features: ['15 clients', 'White-label dashboards', 'AI report summaries', 'PDF export', 'Advanced analytics'],
    popular: true,
  },
  {
    id: 'clientpulse_agency',
    name: 'Agency',
    price: '$79',
    period: '/mo',
    features: ['Unlimited clients', 'Everything in Pro', 'Custom domain', 'Team access (5 members)', 'API access', 'Priority support'],
    popular: false,
  },
];

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(planId: string) {
    setLoading(planId);
    try {
      const user = await getUser();
      if (!user?.email) { window.location.href = '/auth/login'; return; }
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', { body: { plan_id: planId, user_email: user.email } });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch { alert('Unable to start checkout.'); } finally { setLoading(null); }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Upgrade ClientPulse</h1>
        <p className="text-muted">White-label dashboards with AI insights for your clients.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`glow-card p-6 relative ${plan.popular ? 'border-accent/50' : ''}`}>
            {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">Most Popular</span>}
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <div className="mb-4"><span className="text-3xl font-bold">{plan.price}</span><span className="text-muted">{plan.period}</span></div>
            <ul className="space-y-2 mb-6">{plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><span className="text-accent">✓</span><span className="text-muted">{f}</span></li>)}</ul>
            <button onClick={() => handleSubscribe(plan.id)} disabled={loading !== null}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${plan.popular ? 'bg-accent hover:bg-accent-light text-white shadow-lg shadow-accent/25' : 'border border-border text-muted hover:text-foreground'} disabled:opacity-50`}>
              {loading === plan.id ? 'Loading...' : `Subscribe to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-muted mt-8">Secure payment via Stripe. Cancel anytime.</p>
    </div>
  );
}
