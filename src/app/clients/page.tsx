'use client';

import { useState, useEffect } from 'react';
import { getUser } from '@/lib/auth';
import { getAgency, getClients, createClient, deleteClient, getDashboards, createDashboard } from '@/lib/db';
import type { Agency, Client, Dashboard } from '@/lib/types';

export default function ClientsPage() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    async function load() {
      const user = await getUser();
      if (!user) return;
      const ag = await getAgency(user.id);
      if (!ag) return;
      setAgency(ag);

      const [cls, dbs] = await Promise.all([
        getClients(ag.id),
        getDashboards(ag.id),
      ]);
      setClients(cls);
      setDashboards(dbs);
      setLoading(false);
    }
    load();
  }, []);

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    if (!agency || !newName.trim() || !newEmail.trim()) return;
    const client = await createClient(agency.id, newName.trim(), newEmail.trim());
    // Auto-create a dashboard for the client
    const dashboard = await createDashboard(agency.id, client.id, `${client.name} Dashboard`);
    setClients(prev => [...prev, client]);
    setDashboards(prev => [dashboard, ...prev]);
    setNewName('');
    setNewEmail('');
    setShowAdd(false);
  }

  async function handleDeleteClient(clientId: string) {
    await deleteClient(clientId);
    setClients(prev => prev.filter(c => c.id !== clientId));
    setDashboards(prev => prev.filter(d => d.client_id !== clientId));
  }

  function getClientDashboard(clientId: string): Dashboard | undefined {
    return dashboards.find(d => d.client_id === clientId);
  }

  function copyPortalLink(dashboard: Dashboard) {
    const url = `${window.location.origin}/portal?token=${dashboard.share_token}`;
    navigator.clipboard.writeText(url);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-accent hover:bg-accent-light rounded-xl text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all"
        >
          {showAdd ? 'Cancel' : '+ Add Client'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddClient} className="glow-card p-4 mb-6 space-y-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Client name"
            required
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Client email"
            required
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
          <button type="submit" className="px-4 py-2 bg-accent hover:bg-accent-light rounded-xl text-sm font-semibold text-white transition-all">
            Add Client & Create Dashboard
          </button>
        </form>
      )}

      {clients.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted mb-2">No clients yet.</p>
          <p className="text-sm text-muted/60">Add your first client to create their reporting dashboard.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => {
            const dashboard = getClientDashboard(client.id);
            return (
              <div key={client.id} className="glow-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{client.name}</h3>
                    <p className="text-sm text-muted">{client.email}</p>
                  </div>
                  <div className="flex gap-2">
                    {dashboard && (
                      <>
                        <a
                          href={`/dashboard?id=${dashboard.id}`}
                          className="px-3 py-1.5 bg-surface-hover hover:bg-border rounded-lg text-xs text-muted hover:text-foreground transition-colors"
                        >
                          Edit Dashboard
                        </a>
                        <button
                          onClick={() => copyPortalLink(dashboard)}
                          className="px-3 py-1.5 bg-surface-hover hover:bg-border rounded-lg text-xs text-muted hover:text-foreground transition-colors"
                        >
                          Copy Portal Link
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="px-3 py-1.5 text-muted hover:text-red-400 text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
