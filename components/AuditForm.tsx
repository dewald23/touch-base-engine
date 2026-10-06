'use client';

import { useState } from 'react';

export default function AuditForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ analysis: string; whatsappLink: string } | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    location: 'Hermanus Central & Westcliff',
    industry: 'Hospitality & Guest Suites',
    currentTech: 'WordPress / WooCommerce (Template with plugins)',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setResult({ analysis: data.analysis, whatsappLink: data.whatsappLink });
      } else {
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800">
      <h3 className="text-2xl font-bold mb-2">Instant Overberg Digital Audit</h3>
      <p className="text-slate-400 mb-6 text-sm">
        Uncover mobile speed leaks and local Google 3-Pack rank gaps in under 60 seconds.
      </p>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Business / Trading Name *
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g., Walker Bay Suites"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Overberg Location
              </label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                <option>Hermanus Central & Westcliff</option>
                <option>Onrus River & Sandbaai</option>
                <option>Voëlklip & Grotto Beach</option>
                <option>Stanford & Hemel-en-Aarde</option>
                <option>Gansbaai & De Kelders</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Industry Category
              </label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option>Hospitality & Guest Suites</option>
                <option>Restaurant, Winery & Events</option>
                <option>Home Services, Solar & Trades</option>
                <option>Legal, Financial & Medical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              WhatsApp Contact Number *
            </label>
            <input
              type="tel"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g., +27 82 000 0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 transition font-semibold p-3 rounded-lg text-white shadow-lg flex items-center justify-center space-x-2"
          >
            {loading ? 'Analyzing Edge Performance...' : 'Calculate My Diagnostic Results'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-slate-800 rounded-lg border border-emerald-500/30">
            <h4 className="text-emerald-400 font-semibold mb-2">Diagnostic Intelligence Summary:</h4>
            <p className="text-slate-200 text-sm leading-relaxed">{result.analysis}</p>
          </div>

          <a
            href={result.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full bg-emerald-600 hover:bg-emerald-500 transition font-semibold p-4 rounded-lg text-white shadow-lg"
          >
            Send Audit Results to Touch Base (WhatsApp)
          </a>

          <button
            onClick={() => setResult(null)}
            className="w-full bg-transparent hover:bg-slate-800 text-slate-400 text-sm py-2 transition rounded-lg"
          >
            Run Another Audit
          </button>
        </div>
      )}
    </div>
  );
}
