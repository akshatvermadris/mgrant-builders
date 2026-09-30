/* ─────────────────────────────────────────────────────────────
   SESSIONS — the single source of truth for the whole site.
   The sidebar, the home page and the All Sessions page are all
   built from this list.

   To add a new session:
     1. Copy sessions/_template.html → sessions/session-N.html and fill it in
     2. Add (or update) its entry below with status: 'done'
     3. Set `latest` on the newest session (and remove it from the old one)
   ───────────────────────────────────────────────────────────── */
window.MGB_SITE = {
  name: 'mGrant Builders',
  sub: 'Dhwani RIS · Product & Engineering',
  where: 'Office room + Teams',
  when: 'Wed / Thu, same time',
  who: 'Analysts · PMs · Developers'
};

window.MGB_SESSIONS = [
  {
    num: 1,
    slug: 'session-1.html',
    short: 'Tech Fundamentals',
    title: 'Tech Fundamentals: the Terminal, Vibe Coding & the Three Layers',
    date: 'Wed, 30 Sep 2026',
    status: 'done',          // 'done' | 'upcoming'
    latest: true,
    summary: 'The terminal as our medium, vibe coding vs AI-assisted engineering, and the data / code / infra method for deducing where a bug lives.',
    tags: ['Terminal', 'Vibe coding', 'Data · Code · Infra', 'Deduction']
  },
  {
    num: 2,
    slug: 'session-2.html',
    short: 'Data, Code & Infra',
    title: 'Deep dive: Data, Code & Infra',
    date: 'TBA',
    status: 'upcoming',
    summary: 'Each layer in depth: parent/child data, how each layer is tackled, and more fundamental truths.',
    tags: ['Planned']
  }
];

/* Topics announced but not yet scheduled (shown on the All Sessions page). */
window.MGB_PLANNED = ['Design', 'Testing', 'Documentation', 'Marketing & Business Development', 'Debates & workshops'];
