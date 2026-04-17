"use client";
import { useState } from 'react';
import { Sparkles, Upload, Globe, AlertCircle, Check } from 'lucide-react';

interface PersonalizedContent {
  headline: string;
  subheadline: string;
  cta: string;
}

interface ApiResponse {
  personalized?: PersonalizedContent;
  enhancedHtml?: string;
  adHook?: string;
  error?: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [img, setImg] = useState('');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runWorkflow = async () => {
    setLoading(true);
    setError('');
    setData(null);
    
    if (!url.trim() || !img.trim()) {
      setError('Please enter both landing page URL and ad image URL');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: img, landingPageUrl: url }),
      });
      const result = await res.json();
      
      if (!res.ok || result.error) {
        setError(result.error || 'Failed to generate personalized page');
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">Troopod AI Personalizer</h1>
          <p className="text-slate-500 mt-2">Align your landing page to any ad creative instantly.</p>
        </header>

        {/* Input Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border p-2 rounded-lg hover:border-indigo-400 transition">
            <Globe className="text-slate-400" size={20} />
            <input 
              className="w-full outline-none text-sm" 
              placeholder="Landing Page URL (e.g., https://example.com)" 
              value={url} 
              onChange={e => setUrl(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 border p-2 rounded-lg hover:border-indigo-400 transition">
            <Upload className="text-slate-400" size={20} />
            <input 
              className="w-full outline-none text-sm" 
              placeholder="Ad Image URL (e.g., https://example.com/ad.jpg)" 
              value={img} 
              onChange={e => setImg(e.target.value)}
            />
          </div>
          <button 
            onClick={runWorkflow}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-slate-400 transition"
          >
            {loading ? "AI is analyzing..." : <><Sparkles size={18} /> Generate Personalized Page</>}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {data && !data.error && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
            <Check className="text-green-500 shrink-0" size={20} />
            <p className="text-green-700 font-semibold">Successfully personalized! Here&apos;s your enhanced page:</p>
          </div>
        )}

        {/* Output Preview */}
        {data && data.personalized && (
          <div className="space-y-6">
            {/* Personalized Copy Preview */}
            <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-8 space-y-4">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">🎯 Personalized Copy</span>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">HEADLINE</p>
                  <h2 className="text-3xl font-black text-slate-900">{data.personalized.headline}</h2>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">SUBHEADLINE</p>
                  <p className="text-lg text-slate-600">{data.personalized.subheadline}</p>
                </div>
                <div>
                  <button className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition">
                    {data.personalized.cta}
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Landing Page Preview */}
            {data.enhancedHtml ? (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-6 py-3 border-b text-sm font-semibold text-slate-700">
                  📄 Enhanced Landing Page Preview
                </div>
                <iframe
                  srcDoc={data.enhancedHtml}
                  className="w-full border-0"
                  style={{ minHeight: "500px" }}
                />
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200">
                <p className="text-slate-600">Landing page preview unavailable. The personalized copy above can be applied to your existing page.</p>
              </div>
            )}

            {/* Ad Analysis */}
            {data.adHook && (
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold mb-2">🔍 AD ANALYSIS</p>
                <p className="text-sm text-blue-900">{data.adHook}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}