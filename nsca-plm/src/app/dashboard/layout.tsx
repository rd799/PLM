'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { supabase } from '@/lib/supabase';
import { SECTION_LABELS, SectionKey } from '@/types';

// Sample tree data (will come from Supabase later)
const TREE = [
  { id: 'i1', name: '🌬️ Cửa gió & Miệng gió', name_en: '🌬️ Grilles & Diffusers', groups: [
    { id: 'g1', name: 'Grille & Register', products: [
      { id: 'p1', name: 'S-SG Steel Grille', status: 'published' as const },
      { id: 'p2', name: 'S-SR Register', status: 'published' as const },
      { id: 'p3', name: 'S-SG-R Round', status: 'draft' as const },
    ]},
    { id: 'g2', name: 'Diffuser', products: [
      { id: 'p4', name: 'SKD-S Square Diffuser', status: 'published' as const },
    ]},
  ]},
  { id: 'i2', name: '⚙️ Van gió & Fire Damper', name_en: '⚙️ Dampers & Fire Dampers', groups: [] },
  { id: 'i3', name: '🔇 Tiêu âm', name_en: '🔇 Silencers', groups: [] },
  { id: 'i4', name: '📊 VAV Box', name_en: '📊 VAV Box', groups: [] },
];

const MODULES: { key: string; icon: string; vi: string; en: string; vis: string[] }[] = [
  { key: 'dashboard', icon: '📊', vi: 'Dashboard', en: 'Dashboard', vis: ['rd','sx','public'] },
  { key: 'overview', icon: '📋', vi: 'Tổng quan', en: 'Overview', vis: ['rd','sx','public'] },
  { key: 'specs', icon: '📐', vi: 'Thông số KT', en: 'Tech Specs', vis: ['rd','sx','public'] },
  { key: 'drawings', icon: '📑', vi: 'Bản vẽ & TL', en: 'Drawings & Docs', vis: ['rd','sx'] },
  { key: 'process', icon: '🏭', vi: 'Quy trình SX', en: 'Process', vis: ['rd','sx'] },
  { key: 'bom', icon: '📦', vi: 'BOM Vật tư', en: 'BOM', vis: ['rd','sx'] },
  { key: 'wi', icon: '📝', vi: 'Hướng dẫn CN', en: 'Work Instructions', vis: ['rd','sx'] },
  { key: 'qc', icon: '✅', vi: 'Tiêu chuẩn CL', en: 'QC Standards', vis: ['rd','sx'] },
  { key: 'catalog', icon: '📄', vi: 'Catalog / PDF', en: 'Catalog / PDF', vis: ['rd','sx','public'] },
  { key: 'media', icon: '🖼', vi: 'Media', en: 'Media', vis: ['rd','sx','public'] },
  { key: 'hvac', icon: '🔬', vi: 'HVAC Calculator', en: 'HVAC Calculator', vis: ['rd','sx','public'] },
  { key: 'feedback', icon: '💬', vi: 'Góp ý', en: 'Feedback', vis: ['sx'] },
];

const LC_STEPS = [
  { key: 'concept', vi: 'Ý tưởng', en: 'Concept' },
  { key: 'design', vi: 'Thiết kế', en: 'Design' },
  { key: 'prototype', vi: 'Mẫu thử', en: 'Prototype' },
  { key: 'validation', vi: 'Đánh giá', en: 'Validation' },
  { key: 'pre_prod', vi: 'SX thử', en: 'Pre-Prod' },
  { key: 'production', vi: 'Sản xuất', en: 'Production' },
  { key: 'obsolete', vi: 'Ngưng SX', en: 'Obsolete' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { theme, lang, toggleTheme, toggleLang, T } = useApp();
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [activeMod, setActiveMod] = useState('dashboard');
  const [activeProd, setActiveProd] = useState('p1');
  const [treeOpen, setTreeOpen] = useState<Record<string, boolean>>({ i1: true, g1: true });
  const [currentStage] = useState(5); // 0-indexed: production = 5
  const v = lang === 'vi';

  // Simulated role for demo — will use Supabase auth later
  const [viewRole, setViewRole] = useState<'rd' | 'sx' | 'public'>('rd');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        // For demo, allow without auth
        setUser({ email: 'rd@nsca.vn', name: 'R&D Admin', role: 'tp_rd' });
      } else {
        setUser({ email: data.user.email || '', name: data.user.email?.split('@')[0] || '', role: 'tp_rd' });
      }
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const statusDot = (s: string) => {
    if (s === 'published') return 'bg-[var(--grn)]';
    if (s === 'pending') return 'bg-[var(--acc)]';
    if (s === 'draft') return 'bg-[var(--org)]';
    return 'bg-[var(--t4)]';
  };

  // Section health for currently selected product (demo)
  const sectionHealth: Record<SectionKey, { status: string; pct: number }> = {
    profile: { status: 'published', pct: 100 },
    specs: { status: 'published', pct: 100 },
    drawings: { status: 'published', pct: 100 },
    process: { status: 'published', pct: 100 },
    bom: { status: 'draft', pct: 0 },
    qc: { status: 'draft', pct: 0 },
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg)' }}>
      {/* TOPBAR */}
      <header className="h-12 flex items-center shrink-0 transition-colors" style={{ background: 'var(--s1)', borderBottom: '1px solid var(--bd)' }}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-full shrink-0" style={{ borderRight: '1px solid var(--bd)' }}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-sm font-black tracking-tight">NS<span style={{ color: 'var(--acc)' }}>CA</span> <span className="text-[9px] font-normal" style={{ color: 'var(--t3)' }}>PLM</span></span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-[340px] px-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md transition-colors" style={{ background: 'var(--s2)', border: '1px solid var(--bd)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--t3)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="flex-1 bg-transparent border-none p-0 text-xs focus:shadow-none" placeholder={v ? 'Tìm sản phẩm, vật tư, bản vẽ...' : 'Search products, materials...'} style={{ color: 'var(--tx)' }} />
            <kbd className="text-[8px] font-mono px-1 rounded" style={{ background: 'var(--s3)', border: '1px solid var(--bd2)', color: 'var(--t3)' }}>⌘K</kbd>
          </div>
        </div>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-1.5 px-3">
          <button onClick={toggleTheme} className="px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all" style={{ border: '1px solid var(--bd2)', color: 'var(--t2)' }}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <button onClick={toggleLang} className="px-2 py-0.5 rounded-full text-[10px] font-bold transition-all" style={{ border: '1px solid var(--bd2)', color: 'var(--t2)' }}>
            {lang.toUpperCase()}
          </button>
          <div className="w-px h-4 mx-1" style={{ background: 'var(--bd)' }} />
          {(['rd', 'sx', 'public'] as const).map(r => (
            <button key={r} onClick={() => setViewRole(r)}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all"
              style={{
                border: `1px solid ${viewRole === r ? 'var(--acc)' : 'var(--bd2)'}`,
                background: viewRole === r ? 'var(--acc-bg)' : 'transparent',
                color: viewRole === r ? 'var(--acc)' : 'var(--t2)',
              }}
            >
              {r === 'rd' ? '🔬 R&D' : r === 'sx' ? '🏭 SX' : '🌐 Public'}
            </button>
          ))}
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white ml-1.5" style={{ background: 'linear-gradient(135deg, var(--acc), #7c3aed)' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* LIFECYCLE BAR */}
      <div className="flex items-center gap-0 px-4 py-1 shrink-0 overflow-x-auto transition-colors" style={{ background: 'var(--s1)', borderBottom: '1px solid var(--bd)' }}>
        {LC_STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center">
            {i > 0 && <div className="w-3 h-px shrink-0" style={{ background: i <= currentStage ? 'var(--grn)' : 'var(--bd2)' }} />}
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap ${i === currentStage ? 'text-[var(--acc)]' : i < currentStage ? 'text-[var(--grn)]' : 'text-[var(--t4)]'}`}
              style={i === currentStage ? { background: 'var(--acc-bg)' } : {}}>
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black shrink-0"
                style={{
                  border: `1.5px solid ${i < currentStage ? 'var(--grn)' : i === currentStage ? 'var(--acc)' : 'var(--bd2)'}`,
                  background: i < currentStage ? 'var(--grn-bg)' : i === currentStage ? 'var(--acc)' : 'transparent',
                  color: i < currentStage ? 'var(--grn)' : i === currentStage ? '#fff' : 'var(--t4)',
                }}>
                {i < currentStage ? '✓' : i + 1}
              </div>
              <span>{v ? step.vi : step.en}</span>
            </div>
          </div>
        ))}
        <div className="flex-1" />
        <span className="text-[9px] shrink-0" style={{ color: 'var(--t3)' }}>Rev.C · 28/03/2026</span>
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT NAV */}
        <nav className="flex flex-col overflow-hidden shrink-0 transition-colors" style={{ width: 224, background: 'var(--s1)', borderRight: '1px solid var(--bd)' }}>
          {/* Product Tree */}
          <div className="flex items-center px-2.5 pt-2 pb-0.5">
            <span className="text-[7.5px] font-extrabold uppercase tracking-[.14em] flex-1 pl-1" style={{ color: 'var(--t4)' }}>{v ? 'Cây sản phẩm' : 'Product Tree'}</span>
            <span className="text-[9px] font-bold px-1.5 rounded cursor-pointer" style={{ color: 'var(--acc)' }}>+ SP</span>
          </div>
          <div className="overflow-y-auto px-1.5 py-1 border-b" style={{ borderColor: 'var(--bd)', maxHeight: '36%' }}>
            {TREE.map(ind => (
              <div key={ind.id} className="mb-0.5">
                <div className="flex items-center gap-1 px-1.5 py-1 rounded cursor-pointer text-[10.5px] font-bold transition-colors hover:bg-[var(--s2)]" style={{ color: 'var(--t2)' }}
                  onClick={() => setTreeOpen(prev => ({ ...prev, [ind.id]: !prev[ind.id] }))}>
                  <span className="text-[6px] w-2.5 text-center shrink-0 transition-transform" style={{ color: 'var(--t4)', transform: treeOpen[ind.id] ? 'rotate(90deg)' : '' }}>▶</span>
                  <span className="flex-1">{v ? ind.name : ind.name_en}</span>
                  <span className="text-[7px]" style={{ color: 'var(--t4)' }}>{ind.groups.reduce((a, g) => a + g.products.length, 0)}</span>
                </div>
                {treeOpen[ind.id] && ind.groups.map(grp => (
                  <div key={grp.id} className="pl-2.5">
                    <div className="flex items-center gap-1 px-1 py-0.5 rounded cursor-pointer text-[10px] font-semibold transition-colors hover:bg-[var(--s2)]" style={{ color: 'var(--t3)' }}
                      onClick={() => setTreeOpen(prev => ({ ...prev, [grp.id]: !prev[grp.id] }))}>
                      <span className="text-[5px] w-2 text-center" style={{ color: 'var(--t4)' }}>▶</span>
                      <span className="w-1 h-1 rounded-full" style={{ background: 'var(--t4)' }} />
                      <span>{grp.name}</span>
                    </div>
                    {(treeOpen[grp.id] !== false) && grp.products.map(prod => (
                      <div key={prod.id} className={`flex items-center gap-1 px-1.5 py-0.5 ml-3 rounded cursor-pointer text-[10.5px] mb-px transition-colors ${activeProd === prod.id ? 'font-bold' : ''}`}
                        style={{
                          background: activeProd === prod.id ? 'var(--acc-bg)' : 'transparent',
                          color: activeProd === prod.id ? 'var(--acc)' : 'var(--t2)',
                        }}
                        onClick={() => { setActiveProd(prod.id); setActiveMod('overview'); }}>
                        <div className={`w-1 h-1 rounded-full shrink-0 ${statusDot(prod.status)}`} />
                        <span className="truncate">{prod.name}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Module Menu */}
          <div className="px-2.5 pt-1.5 pb-0.5">
            <span className="text-[7.5px] font-extrabold uppercase tracking-[.14em] pl-1" style={{ color: 'var(--t4)' }}>Modules</span>
          </div>
          <div className="flex-1 overflow-y-auto px-1.5 pb-2">
            {MODULES.filter(m => m.vis.includes(viewRole)).map(mod => (
              <div key={mod.key}
                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-[11px] font-medium mb-px relative transition-colors ${activeMod === mod.key ? 'font-bold' : ''}`}
                style={{
                  background: activeMod === mod.key ? 'var(--acc-bg)' : 'transparent',
                  color: activeMod === mod.key ? 'var(--acc)' : 'var(--t2)',
                }}
                onClick={() => setActiveMod(mod.key)}>
                {activeMod === mod.key && <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r" style={{ background: 'var(--acc)' }} />}
                <span className="text-xs w-4 text-center shrink-0">{mod.icon}</span>
                <span>{v ? mod.vi : mod.en}</span>
                {/* R&D only badge */}
                {!mod.vis.includes('sx') && !mod.vis.includes('public') && viewRole === 'rd' && (
                  <span className="ml-auto text-[7px] font-bold px-1 py-px rounded-full" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>R&D</span>
                )}
              </div>
            ))}
          </div>

          {/* Health Score */}
          {viewRole === 'rd' && (
            <div className="px-3 py-2 shrink-0 transition-colors" style={{ borderTop: '1px solid var(--bd)' }}>
              <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--t4)' }}>{v ? 'Hồ sơ SP' : 'Doc Status'}</div>
              {(Object.keys(SECTION_LABELS) as SectionKey[]).map(sk => {
                const h = sectionHealth[sk];
                const label = SECTION_LABELS[sk];
                const isMissing = h.status === 'draft' && h.pct === 0;
                return (
                  <div key={sk} className="flex items-center gap-1.5 py-0.5 text-[10px]">
                    <span>{label.icon}</span>
                    <span className="flex-1 truncate" style={{ color: isMissing ? 'var(--org)' : 'var(--t2)', fontWeight: isMissing ? 700 : 400 }}>{v ? label.vi : label.en}</span>
                    {isMissing ? (
                      <span className="text-[8px] font-bold px-1.5 py-px rounded-full animate-pulse" style={{ background: 'var(--org-bg)', color: 'var(--org)' }}>⚠ {v ? 'Thiếu' : 'Missing'}</span>
                    ) : (
                      <span className="text-[8px] font-bold" style={{ color: 'var(--grn)' }}>✅</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {children || <DashboardHome v={v} viewRole={viewRole} />}
        </main>
      </div>

      {/* STATUS BAR */}
      <div className="flex items-center gap-2.5 px-4 py-1 shrink-0 text-[9.5px] transition-colors" style={{ background: 'var(--s1)', borderTop: '1px solid var(--bd)', color: 'var(--t3)' }}>
        <span>📌 <b style={{ color: 'var(--tx)' }}>S-SG Steel Grille</b></span>
        <span>·</span><span>S-SG-400</span>
        <span>·</span><span style={{ color: 'var(--grn)' }}>● Production</span>
        <span className="flex-1" />
        <span>Saved 2m ago</span>
      </div>
    </div>
  );
}

// Default dashboard content
function DashboardHome({ v, viewRole }: { v: boolean; viewRole: string }) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h1 className="text-lg font-extrabold tracking-tight mb-3">📊 Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label: v ? 'Tổng SP' : 'Products', val: '47', color: 'var(--acc)', sub: '+3' },
          { label: 'Production', val: '31', color: 'var(--grn)', sub: '66%' },
          { label: v ? 'Chờ duyệt' : 'Pending', val: '5', color: 'var(--org)', sub: '' },
          { label: 'QC Pass', val: '94%', color: 'var(--grn)', sub: '↑2%' },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-lg transition-colors" style={{ background: 'var(--s1)', border: '1px solid var(--bd)' }}>
            <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--t3)' }}>{s.label}</div>
            <div className="text-xl font-extrabold font-mono tracking-tight" style={{ color: s.color }}>{s.val}</div>
            {s.sub && <div className="text-[9px] mt-0.5" style={{ color: 'var(--t3)' }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Missing docs warning (R&D only) */}
      {viewRole === 'rd' && (
        <div className="rounded-lg mb-3 overflow-hidden transition-colors" style={{ background: 'var(--s1)', border: '1px solid var(--bd)' }}>
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold" style={{ borderBottom: '1px solid var(--bd)' }}>
            <span className="flex-1">{v ? '⚠️ Sản phẩm chưa hoàn chỉnh hồ sơ' : '⚠️ Incomplete Product Documentation'}</span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--org-bg)', color: 'var(--org)' }}>3 SP</span>
          </div>
          {[
            { name: 'S-VCD-400', missing: v ? 'BOM, QC Standards' : 'BOM, QC', pct: 40 },
            { name: 'S-FD-600', missing: v ? 'WI #04, #05' : 'WI #04, #05', pct: 75 },
            { name: 'S-LSD-1200', missing: v ? 'Bản vẽ SX, QC' : 'Prod Drawing, QC', pct: 55 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 text-[11px]" style={{ borderBottom: '1px solid var(--bd)' }}>
              <span style={{ color: 'var(--org)' }}>⚠</span>
              <span className="font-bold flex-1">{item.name}</span>
              <span className="text-[9px]" style={{ color: 'var(--t3)' }}>{v ? 'Thiếu' : 'Missing'}: {item.missing}</span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{
                background: item.pct >= 80 ? 'var(--grn-bg)' : item.pct >= 50 ? 'var(--org-bg)' : 'var(--red-bg)',
                color: item.pct >= 80 ? 'var(--grn)' : item.pct >= 50 ? 'var(--org)' : 'var(--red)',
              }}>{item.pct}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-lg overflow-hidden transition-colors" style={{ background: 'var(--s1)', border: '1px solid var(--bd)' }}>
        <div className="px-3 py-2 text-xs font-bold" style={{ borderBottom: '1px solid var(--bd)' }}>{v ? 'Hoạt động gần đây' : 'Recent Activity'}</div>
        {[
          { color: 'var(--grn)', text: 'S-FD Fire Damper → Released Rev.D', time: '2h' },
          { color: 'var(--org)', text: v ? 'ECR-042: Thay vật liệu nan' : 'ECR-042: Material change', time: '5h' },
          { color: 'var(--acc)', text: v ? 'BOM S-VAV cập nhật 3 mục' : 'BOM S-VAV updated 3 items', time: '1d' },
          { color: 'var(--vio)', text: 'QC #153 — Lot 2026-03-001', time: '1d', badge: 'Pass' },
        ].map((act, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 text-[11px]" style={{ borderBottom: '1px solid var(--bd)' }}>
            <span style={{ color: act.color }}>●</span>
            <span className="flex-1">{act.text}</span>
            {act.badge && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--grn-bg)', color: 'var(--grn)' }}>{act.badge}</span>}
            <span className="text-[9px]" style={{ color: 'var(--t3)' }}>{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
