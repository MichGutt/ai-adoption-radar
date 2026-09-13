'use client';

import { useState } from 'react';

const dimensions = [
  { name: 'Relevance', score: 38, text: 'Employees struggle to connect AI to the work they do every day. This is the strongest barrier in this demo.' },
  { name: 'Trust', score: 65, text: 'Confidence in AI outputs is developing. Clear review practices could help employees use AI more consistently.' },
  { name: 'Skills', score: 72, text: 'Basic AI skills are relatively established. The bigger gap is applying them to specific roles and tasks.' },
  { name: 'Governance', score: 73, text: 'Guidelines and approved tools are in place. Making those guidelines easier to apply remains an opportunity.' },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Radar({ selected }: { selected: number }) {
  const points = [[210, 132.5], [295.8, 180], [210, 270], [113.6, 180]];
  return <svg viewBox="0 0 420 350" role="img" aria-labelledby="radar-title radar-description" className="radar-chart">
    <title id="radar-title">Adoption readiness by dimension</title>
    <desc id="radar-description">Synthetic scores out of 100: Relevance 38, Trust 65, Skills 72, Governance 73. Higher is stronger. Relevance is the weakest dimension.</desc>
    {[1, .75, .5, .25].map(scale => <polygon key={scale} points={`210,${180 - 125 * scale} ${210 + 132 * scale},180 210,${180 + 125 * scale} ${210 - 132 * scale},180`} fill={scale === 1 ? '#fafbf9' : 'none'} stroke="#dfe5df" />)}
    <path d="M210 55v250M78 180h264" stroke="#e2e7e2" />
    <text x="218" y="91" className="axis-value">75</text><text x="218" y="123" className="axis-value">50</text><text x="218" y="154" className="axis-value">25</text>
    <polygon points={points.map(p => p.join(',')).join(' ')} fill="#2b785e" fillOpacity=".13" stroke="#2b785e" strokeWidth="2" />
    {points.map(([cx, cy], i) => <g key={i}>{selected === i && <circle cx={cx} cy={cy} r="10" fill="#2b785e" fillOpacity=".14" />}<circle cx={cx} cy={cy} r={selected === i ? 5 : 3.5} fill="#2b785e" stroke="white" strokeWidth="2" /></g>)}
    <text x="210" y="29" textAnchor="middle" className="radar-label">Relevance <tspan fill="#246b56">38</tspan></text>
    <text x="353" y="176" className="radar-label">Trust</text><text x="353" y="195" className="radar-number">65</text>
    <text x="210" y="334" textAnchor="middle" className="radar-label">Skills <tspan fill="#246b56">72</tspan></text>
    <text x="64" y="176" textAnchor="end" className="radar-label">Governance</text><text x="64" y="195" textAnchor="end" className="radar-number">73</text>
  </svg>;
}

export default function Dashboard() {
  const [selected, setSelected] = useState(0);
  const [workshop, setWorkshop] = useState(false);
  return <>
    <header className="header"><div className="header-inner flex items-center justify-between gap-4">
      <a href="#main" className="brand flex items-center gap-3"><img src="/icon.svg" width="34" height="34" alt="" />AI Adoption Radar<span className="prototype-label">PROTOTYPE</span></a>
      <div className="flex items-center gap-3"><label htmlFor="department" className="department-label">Business area</label><select id="department" defaultValue="marketing"><option value="marketing">Marketing</option></select><span className="avatar" aria-label="Demo workspace">M</span></div>
    </div></header>

    <main id="main" className="page">
      <div className="intro flex flex-wrap items-end justify-between gap-5">
        <div><div className="eyebrow">MARKETING / ADOPTION OVERVIEW</div><h1>From AI investment to everyday impact.</h1><p>Understand what’s holding adoption back. Know where to act next.</p></div>
        <div className="period"><span className="demo-dot" />Synthetic demo<span className="period-divider" />Q3 2026</div>
      </div>

      <section className="overview" aria-label="Adoption diagnosis">
        <div className="health">
          <div className="section-heading"><span className="step">01</span><h2>AI Adoption Health Index</h2></div>
          <p className="section-caption">How is adoption progressing?</p>
          <div className="score">62<span>/100</span></div>
          <div className="health-state"><span />Moderate adoption</div>
          <div className="trend">↘ 8 pts <span>vs. last quarter</span></div>
          <div className="sparkline"><svg viewBox="0 0 330 82" role="img" aria-label="Demo trend: Q4 2025 54, Q1 2026 66, Q2 2026 70, Q3 2026 62"><path d="M9 68H321M9 35H321" stroke="#e6eae5" strokeDasharray="3 5"/><path d="M12 64 114 32 216 21 318 43" stroke="#6d8778" strokeWidth="2" fill="none"/>{[[12,64],[114,32],[216,21],[318,43]].map(([cx,cy], i)=><circle key={i} cx={cx} cy={cy} r="4" fill={i === 3 ? '#246b56' : '#fff'} stroke="#6d8778" strokeWidth="2"/>)}</svg><div className="flex justify-between"><span>Q4 ’25</span><span>Q1 ’26</span><span>Q2 ’26</span><span>Q3 ’26</span></div></div>
          <p className="health-note">Access is in place. Everyday use is still catching up.</p>
        </div>

        <div className="radar-panel">
          <div className="flex flex-wrap items-center justify-between gap-2"><div className="section-heading"><span className="step">02</span><h2>Adoption Radar</h2></div><span className="small-note">Higher score = stronger readiness</span></div>
          <p className="section-caption">What is likely holding adoption back?</p>
          <div className="radar-content"><Radar selected={selected} /><div className="dimension-details">
            <div className="dimension-list" aria-label="Explore dimensions">{dimensions.map((dimension, i) => <button key={dimension.name} onClick={() => setSelected(i)} aria-pressed={selected === i} className={`dimension ${selected === i ? 'selected' : ''}`}><span>{dimension.name}{i === 0 && <span className="priority-dot" />}</span><span>{dimension.score}<span className="dimension-max"> / 100</span></span></button>)}</div>
            <div className="dimension-explanation" aria-live="polite"><strong>{selected === 0 ? 'Primary friction point' : dimensions[selected].name + ' insight'}</strong><p>{dimensions[selected].text}</p></div>
          </div></div>
        </div>
      </section>

      <section className="intervention" aria-label="Evidence and recommended action">
        <div className="evidence-panel"><div className="section-heading"><span className="step">03</span><h2>Top Adoption Barrier</h2><span className="tag">Relevance</span></div>
          <h3>AI is available. Its everyday value isn’t clear.</h3><p className="barrier-summary">The signals suggest a gap between access to AI and relevant, role-specific use cases.</p>
          <div className="evidence-label">SUPPORTING EVIDENCE <span>3 signals</span></div>
          <div className="evidence-row"><span className="evidence-icon">↗</span><div><div className="source">Usage Data</div><p>Low repeat usage despite high license availability</p><span className="evidence-detail">86% have access · only 32% use AI weekly</span></div></div>
          <div className="evidence-row"><span className="evidence-icon">≋</span><div><div className="source">Employee Feedback</div><p><strong>58%</strong> report difficulty identifying relevant use cases</p><span className="evidence-detail">Synthetic pulse survey · 120 responses</span></div></div>
          <div className="evidence-row"><span className="evidence-icon">“</span><div><div className="source">Employee Feedback</div><p className="quote">“I’m not sure where AI actually helps in my daily work.”</p><span className="evidence-detail">Recurring theme in synthetic open-text feedback</span></div></div>
          <div className="context"><span className="source">Organizational Context</span><p>Approved tools and general guidance are available; a role-specific use case playbook is not yet in place.</p></div>
        </div>

        <div className="recommendation-panel"><div className="section-heading"><span className="step">04</span><h2>Recommended next step</h2></div><div className="recommendation-body"><div className="eyebrow">TURN INSIGHT INTO ACTION</div><h3>Run a role-specific<br className="desktop-break" /> AI Use Case Workshop</h3><p>Help the Marketing team connect AI to real tasks. Translate day-to-day friction into practical use cases worth trying.</p>
          <div className="why"><span className="check">✓</span><div><strong>Why this fits</strong><p>Relevance is the weakest dimension. Start with meaningful applications of AI before investing in more general training.</p></div></div>
          <div className="workshop-meta"><span>60–90 min</span><span>Marketing team</span><span>Facilitated session</span></div>
          <button className="create-button flex items-center justify-between" onClick={() => setWorkshop(!workshop)} aria-expanded={workshop} aria-controls="workshop-preview">{workshop ? 'Close workshop preview' : 'Create workshop'}<Arrow /></button>
          {!workshop && <p className="action-note">Preview the next step · no workshop is saved</p>}
          {workshop && <div id="workshop-preview" className="workshop-preview" role="status"><strong>Workshop preview</strong><p>A starting agenda for your Marketing team:</p><ol><li>Identify repetitive tasks — 15 min</li><li>Map relevant AI use cases — 30 min</li><li>Prioritize one experiment per role — 15 min</li></ol><span>Demo only. Nothing has been created or sent.</span></div>}
        </div></div>
      </section>
      <footer className="flex flex-wrap justify-between gap-3"><span><span className="demo-dot" />All scores and evidence are synthetic. No employee or company data.</span><span>AI.WOMEN Hackathon 2026 <span className="footer-divider">/</span> Early prototype</span></footer>
    </main>
  </>;
}
