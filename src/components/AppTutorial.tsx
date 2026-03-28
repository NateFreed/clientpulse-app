'use client';

import Tutorial from './Tutorial';

const STEPS = [
  {
    title: 'Add Your First Client',
    description: 'Create a client profile with their name and email. Each client gets their own dashboard automatically.',
  },
  {
    title: 'Build a Dashboard',
    description: 'Add widgets like stats, charts, and tables to build a custom reporting dashboard. Drag to rearrange.',
  },
  {
    title: 'Generate AI Insights',
    description: 'Hit the AI Summary button to auto-generate executive summaries from your data. One click, instant report.',
  },
  {
    title: 'Share with Clients',
    description: 'Export dashboards as PDFs or copy a portal link so clients can view their reports anytime.',
  },
];

export default function AppTutorial() {
  return (
    <Tutorial
      appName="ClientPulse"
      steps={STEPS}
      accentColor="bg-accent"
    />
  );
}
