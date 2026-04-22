"use client";
import { useState } from 'react';
import { Sparkles, Upload, Globe, AlertCircle, Check, Zap, TrendingUp } from 'lucide-react';

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
  const [imgFile, setImgFile] = useState<string>('');
  const [imgFileName, setImgFileName] = useState<string>('');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImgFile(result);
      setImgFileName(file.name);
      setImg('');
      setError('');
    };
    reader.onerror = () => setError('Failed to read image file');
    reader.readAsDataURL(file);
  };

  const clearUploadedImage = () => {
    setImgFile('');
    setImgFileName('');
  };

  const runWorkflow = async () => {
    setLoading(true);
    setError('');
    setData(null);

    const imageInput = imgFile || img.trim();

    if (!url.trim() || !imageInput) {
      setError('Please enter a landing page URL and provide an ad image (URL or upload)');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imageInput, landingPageUrl: url }),
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
    <main className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        {/* Header */}
        <header className="text-center space-y-3 pt-4">
          <div className="inline-block mb-2">
            <div className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              <Zap size={16} /> AI-Powered Personalization
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
            Troopod AI Personalizer
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Transform any landing page to match your ad creative. AI-generated copy that converts.
          </p>
        </header>

        {/* Input Card with Enhanced Design */}
        <div className="bg-linear-to-br from-slate-800 to-slate-700 p-8 rounded-3xl shadow-2xl border border-slate-600/50 backdrop-blur-sm space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Globe size={16} className="text-indigo-400" />
              Landing Page URL
            </label>
            <input 
              className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-base" 
              placeholder="https://example.com" 
              value={url} 
              onChange={e => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && runWorkflow()}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Upload size={16} className="text-purple-400" />
              Ad Image
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-base disabled:opacity-50"
              placeholder="https://images.unsplash.com/..."
              value={img}
              disabled={!!imgFile}
              onChange={e => setImg(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && runWorkflow()}
            />

            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-slate-600/50" />
              <span className="text-xs text-slate-400 uppercase tracking-wider">or upload</span>
              <div className="flex-1 h-px bg-slate-600/50" />
            </div>

            {!imgFile ? (
              <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-slate-700/30 border-2 border-dashed border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-purple-500 cursor-pointer transition">
                <Upload size={18} className="text-purple-400" />
                <span className="text-sm font-medium">Click to upload an image (max 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-purple-500/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgFile} alt="preview" className="w-14 h-14 rounded-lg object-cover border border-slate-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium truncate">{imgFileName}</p>
                  <p className="text-xs text-slate-400">Image ready</p>
                </div>
                <button
                  type="button"
                  onClick={clearUploadedImage}
                  className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-600/50 hover:bg-slate-600 rounded-lg transition"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={runWorkflow}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform ${
              loading 
                ? 'bg-slate-600 text-slate-300 cursor-not-allowed' 
                : 'bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-indigo-500/50 active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin">⚡</div>
                AI is analyzing your content...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Personalized Page
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-5 flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-red-200">Error</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {data && !data.error && (
          <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-2xl p-5 flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Check className="text-emerald-400 shrink-0 mt-0.5" size={20} />
            <p className="text-emerald-200 font-semibold">✨ Successfully personalized! Your enhanced page is ready below.</p>
          </div>
        )}

        {/* Output Preview */}
        {data && data.personalized && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Personalized Copy Preview */}
            <div className="bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-3xl p-10 space-y-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-indigo-400" size={20} />
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">🎯 AI-Generated Copy</span>
              </div>

              {/* Headline Section */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-indigo-300/80 uppercase tracking-wider">Headline</p>
                <h2 className="text-4xl md:text-5xl font-black bg-linear-to-r from-white to-indigo-100 bg-clip-text text-transparent leading-tight">
                  {data.personalized.headline}
                </h2>
              </div>

              {/* Subheadline Section */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-purple-300/80 uppercase tracking-wider">Subheadline</p>
                <p className="text-xl text-slate-200 leading-relaxed">
                  {data.personalized.subheadline}
                </p>
              </div>

              {/* CTA Button Preview */}
              <div className="pt-4">
                <button className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 active:scale-95">
                  {data.personalized.cta}
                </button>
              </div>
            </div>

            {/* Enhanced Landing Page Preview */}
            {data.enhancedHtml ? (
              <div className="bg-slate-800 rounded-3xl border border-slate-600/50 overflow-hidden shadow-2xl">
                <div className="bg-linear-to-r from-slate-700 to-slate-600 px-6 py-4 border-b border-slate-600 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <p className="text-sm font-bold text-slate-300 ml-4">📄 Enhanced Landing Page Preview</p>
                </div>
                <iframe
                  srcDoc={data.enhancedHtml}
                  className="w-full border-0"
                  style={{ minHeight: "600px" }}
                />
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-3xl p-8 text-center border border-slate-600/50 backdrop-blur-sm">
                <p className="text-slate-300 text-base">
                  💡 Landing page preview unavailable. Use the personalized copy above to update your existing page.
                </p>
              </div>
            )}

            {/* Ad Analysis Badge */}
            {data.adHook && (
              <div className="bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-5 border border-blue-400/30 backdrop-blur-sm">
                <p className="text-xs text-blue-300 font-semibold uppercase tracking-widest mb-2">🔍 Powered By</p>
                <p className="text-sm text-blue-100">{data.adHook}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-slate-400 text-sm pt-8 border-t border-slate-700/50">
          <p>Built with Groq AI • Lightning-fast personalization • No setup required</p>
        </footer>
      </div>
    </main>
  );
}