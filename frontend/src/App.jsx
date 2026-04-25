import { useState, useEffect, useTransition } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// const API = (import.meta.env.VITE_API_URL || '') + '/api/cases';
const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/cases`
  : 'http://localhost:3000/api/cases';

const CURRENT_USER = 'analyst_1';

async function apiFetch(url, options = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Request failed');
  return json.data;
}

const STATUSES = ['pending', 'in-review', 'escalated', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];
const RISK_LEVELS = ['low', 'medium', 'high'];
const CATEGORIES = ['spam', 'abuse', 'fraud', 'policy_violation', 'phishing', 'harassment', 'hate_speech', 'misinformation'];

const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-700',
  'in-review': 'bg-blue-100 text-blue-800',
  escalated: 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800',
};

const RISK_COLORS = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const PRIORITY_COLORS = {
  low: 'text-gray-500',
  medium: 'text-yellow-600',
  high: 'text-red-600 font-semibold',
};

function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function formatRelativeTime(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) === 1 ? '' : 's'} ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? '' : 's'} ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? '' : 's'} ago`;
}

function Badge({ label, colorClass }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
      {label}
    </span>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm action"
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <p className="text-sm text-gray-700">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function CaseItem({ caseItem, onEscalate, onDelete, onEdit }) {
  return (
    <li className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-gray-800 flex-1">{caseItem.title}</span>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(caseItem)}
            className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
            aria-label={`Edit case "${caseItem.title}"`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(caseItem._id)}
            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
            aria-label={`Delete case "${caseItem.title}"`}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Badge label={caseItem.status} colorClass={STATUS_COLORS[caseItem.status] || 'bg-gray-100 text-gray-700'} />
        <Badge label={`Risk: ${caseItem.riskLevel}`} colorClass={RISK_COLORS[caseItem.riskLevel] || 'bg-gray-100 text-gray-700'} />
        <span className={`text-xs ${PRIORITY_COLORS[caseItem.priority] || 'text-gray-500'}`}>
          Priority: {caseItem.priority}
        </span>
        <span className="text-xs text-gray-400 capitalize">{caseItem.category?.replace('_', ' ')}</span>
        {caseItem.assignedTo && (
          <span className="text-xs text-gray-500">→ {caseItem.assignedTo}</span>
        )}
      </div>

      {caseItem.notes && (
        <p className="text-xs text-gray-500 italic line-clamp-2">{caseItem.notes}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Updated {formatRelativeTime(caseItem.updatedAt)}</span>
        {caseItem.status !== 'escalated' && caseItem.status !== 'resolved' && (
          <button
            onClick={() => onEscalate(caseItem)}
            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Escalate
          </button>
        )}
      </div>
    </li>
  );
}

const EMPTY_FORM = { title: '', status: 'pending', priority: 'medium', riskLevel: 'medium', category: 'spam', assignedTo: '', notes: '' };

export default function App() {
  const [cases, setCases] = useState([]);
  const [filters, setFilters] = useState({ status: '', riskLevel: '', category: '', myCases: false });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editCase, setEditCase] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [refreshedAt] = useState(new Date());
  const [isPending, startTransition] = useTransition();

  function buildQuery(f) {
    const params = new URLSearchParams();
    if (f.status) params.set('status', f.status);
    if (f.riskLevel) params.set('riskLevel', f.riskLevel);
    if (f.category) params.set('category', f.category);
    const q = params.toString();
    return q ? `${API}?${q}` : API;
  }

  function applyClientFilters(data, f) {
    if (!f.myCases) return data;
    return data.filter(c => c.assignedTo === CURRENT_USER);
  }

  function loadCases(f = filters) {
    apiFetch(buildQuery(f))
      .then(data => setCases(applyClientFilters(data, f)))
      .catch(e => toast.error(e.message));
  }

  useEffect(() => { loadCases(); }, []);

  function handleFilterChange(key, val) {
    const next = { ...filters, [key]: val };
    setFilters(next);
    loadCases(next);
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    startTransition(async () => {
      try {
        const created = await apiFetch(API, { method: 'POST', body: JSON.stringify(form) });
        setCases(prev => applyClientFilters([created, ...prev], filters));
        setForm(EMPTY_FORM);
        toast.success('Case created');
      } catch (e) { toast.error(e.message); }
    });
  }

  function handleEscalate(c) {
    startTransition(async () => {
      try {
        const updated = await apiFetch(`${API}/${c._id}`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'escalated', priority: 'high' }),
        });
        setCases(prev => prev.map(x => x._id === updated._id ? updated : x));
        toast.success('Case escalated');
      } catch (e) { toast.error(e.message); }
    });
  }

  function handleDelete(id) {
    setConfirm({
      message: 'Delete this case? This cannot be undone.',
      onConfirm: () => {
        setConfirm(null);
        startTransition(async () => {
          try {
            await apiFetch(`${API}/${id}`, { method: 'DELETE' });
            setCases(prev => prev.filter(x => x._id !== id));
            toast.success('Case deleted');
          } catch (e) { toast.error(e.message); }
        });
      },
    });
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    if (!editCase.title.trim()) return;
    startTransition(async () => {
      try {
        const updated = await apiFetch(`${API}/${editCase._id}`, {
          method: 'PUT',
          body: JSON.stringify(editCase),
        });
        setCases(prev => prev.map(x => x._id === updated._id ? updated : x));
        setEditCase(null);
        toast.success('Case updated');
      } catch (e) { toast.error(e.message); }
    });
  }

  const total = cases.length;
  const highRisk = cases.filter(c => c.riskLevel === 'high').length;
  const pending = cases.filter(c => c.status === 'pending').length;
  const resolved = cases.filter(c => c.status === 'resolved').length;
  const createdToday = cases.filter(c => isToday(c.createdAt)).length;
  const resolvedToday = cases.filter(c => c.status === 'resolved' && isToday(c.updatedAt)).length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Disclaimer banner */}
        <div className="flex gap-2 items-start rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800" role="note">
          <span aria-hidden="true" className="mt-0.5 shrink-0">ℹ️</span>
          <p>This is a simulated Trust &amp; Safety case management system built for portfolio demonstration purposes only. All cases, users, and content are fictional.</p>
        </div>

        {/* Header */}
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-bold text-gray-900">Trust &amp; Safety Case Management Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 max-w-xl">
            Simulates real-world content moderation workflows including case triage, escalation, and risk prioritization.
          </p>
          <p className="mt-2 text-xs text-gray-400">Last refreshed {formatRelativeTime(refreshedAt)}</p>
        </div>

        {/* Dashboard summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Cases', value: total, color: 'text-gray-800' },
            { label: 'High Risk', value: highRisk, color: 'text-red-600' },
            { label: 'Awaiting Review', value: pending, color: 'text-yellow-600' },
            { label: 'Resolved', value: resolved, color: 'text-green-600' },
            { label: 'Created Today', value: createdToday, color: 'text-blue-600' },
            { label: 'Resolved Today', value: resolvedToday, color: 'text-emerald-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {[
            { key: 'status', options: STATUSES, label: 'Status' },
            { key: 'riskLevel', options: RISK_LEVELS, label: 'Risk' },
            { key: 'category', options: CATEGORIES, label: 'Category' },
          ].map(({ key, options, label }) => (
            <select
              key={key}
              value={filters[key]}
              onChange={e => handleFilterChange(key, e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Filter by ${label}`}
            >
              <option value="">All {label}s</option>
              {options.map(o => (
                <option key={o} value={o}>{o.replace('_', ' ')}</option>
              ))}
            </select>
          ))}
          <button
            onClick={() => handleFilterChange('myCases', !filters.myCases)}
            className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              filters.myCases
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            aria-pressed={filters.myCases}
          >
            My Cases
          </button>
        </div>

        {/* New case form */}
        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">New Case</h2>
          <input
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Case description…"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Case description"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { key: 'status', options: STATUSES },
              { key: 'priority', options: PRIORITIES },
              { key: 'riskLevel', options: RISK_LEVELS },
              { key: 'category', options: CATEGORIES },
            ].map(({ key, options }) => (
              <select
                key={key}
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={key}
              >
                {options.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
              </select>
            ))}
            <input
              value={form.assignedTo}
              onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}
              placeholder="Assign to…"
              className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Assign to"
            />
          </div>
          <textarea
            value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Notes (optional)…"
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            aria-label="Notes"
          />
          <button
            type="submit"
            disabled={isPending || !form.title.trim()}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Case
          </button>
        </form>

        {/* Case list */}
        {cases.length === 0 ? (
          <div className="text-center py-10 space-y-1">
            <p className="text-sm text-gray-500 font-medium">No cases match your current filters.</p>
            <p className="text-xs text-gray-400">Try adjusting risk level, status, or category.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {cases.map(c => (
              <CaseItem
                key={c._id}
                caseItem={c}
                onEscalate={handleEscalate}
                onDelete={handleDelete}
                onEdit={setEditCase}
              />
            ))}
          </ul>
        )}
      </div>

      <footer className="max-w-3xl mx-auto mt-8 pb-6 text-center text-xs text-gray-400">
        All data is synthetic and used for demonstration purposes only.
      </footer>

      {/* Edit modal */}
      {editCase && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit case"
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-40"
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Edit Case</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                value={editCase.title}
                onChange={e => setEditCase(p => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Case description"
                autoFocus
              />
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'status', options: STATUSES },
                  { key: 'priority', options: PRIORITIES },
                  { key: 'riskLevel', options: RISK_LEVELS },
                  { key: 'category', options: CATEGORIES },
                ].map(({ key, options }) => (
                  <select
                    key={key}
                    value={editCase[key]}
                    onChange={e => setEditCase(p => ({ ...p, [key]: e.target.value }))}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label={key}
                  >
                    {options.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                  </select>
                ))}
                <input
                  value={editCase.assignedTo || ''}
                  onChange={e => setEditCase(p => ({ ...p, assignedTo: e.target.value }))}
                  placeholder="Assign to…"
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Assign to"
                />
              </div>
              <textarea
                value={editCase.notes || ''}
                onChange={e => setEditCase(p => ({ ...p, notes: e.target.value }))}
                placeholder="Notes (optional)…"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                aria-label="Notes"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditCase(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !editCase.title.trim()}
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
