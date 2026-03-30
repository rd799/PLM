'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState<'vi'|'en'>('vi');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (data.user) {
        router.push('/dashboard');
      }
    } catch {
      setError(lang === 'vi' ? 'Email hoặc mật khẩu không đúng' : 'Invalid email or password');
    }
    setLoading(false);
  };

  const v = lang === 'vi';

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[400px] mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--tx)' }}>
            NS<span style={{ color: 'var(--acc)' }}>CA</span> PLM
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--t3)' }}>
            {v ? 'Hệ thống Ban hành & Quản lý Sản phẩm' : 'Product Publishing & Management System'}
          </p>
        </div>

        {/* Form */}
        <div className="rounded-xl p-6" style={{ background: 'var(--s1)', border: '1px solid var(--bd)' }}>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--t3)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={v ? 'Nhập email...' : 'Enter email...'}
                className="w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--t3)' }}>
                {v ? 'Mật khẩu' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg text-xs font-semibold" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white text-sm font-bold transition-all"
              style={{ background: 'var(--acc)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '...' : (v ? 'Đăng nhập' : 'Sign In')}
            </button>
          </form>

          <div className="flex items-center justify-between mt-4 text-xs" style={{ color: 'var(--t3)' }}>
            <button onClick={() => {}} className="hover:underline">
              {v ? 'Quên mật khẩu?' : 'Forgot password?'}
            </button>
            <button
              onClick={() => setLang(l => l === 'vi' ? 'en' : 'vi')}
              className="px-2.5 py-1 rounded-full font-bold transition-all"
              style={{ border: '1px solid var(--bd2)', color: 'var(--t2)' }}
            >
              {lang.toUpperCase()}
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--t4)' }}>
          © 2026 NSCA / Starduct — HVAC Manufacturing
        </p>
      </div>
    </div>
  );
}
