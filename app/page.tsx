'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { demoMetrics, dimensions, format, readMetrics, score, status, type Analysis } from '@/lib/analysis';
import { scenarios, type Dimension } from '@/lib/scenarios';

type View = 'upload' | 'diagnosis' | 'recommendations';
type Source = 'usage_data' | 'pulse_survey' | 'training_use_cases';
type Files = Record<Source, File[]>;
const emptyFiles = (): Files => ({ usage_data: [], pulse_survey: [], training_use_cases: [] });
const sources = {
  usage_data: { title: 'Usage Data', icon: '↗', description: 'Employees with Access · Monthly Active Users · Average Daily Active Users · Active Licensed Users', demo: 'usage_data.xlsx' },
  pulse_survey: { title: 'Pulse Survey', icon: '⌁', description: 'Relevance, trust, concerns, AI literacy', demo: 'pulse_survey.csv' },
  training_use_cases: { title: 'Training & Use Case Data', icon: '✦', description: 'Training participation and successful AI use cases', demo: 'training_and_use_cases.pdf' },
};
const sourceKeys = Object.keys(sources) as Source[];
const progressText = ['Data sources are being securely consolidated …', 'Usage, survey signals and document context are being compared …', 'The four adoption KPIs are being prioritized …', 'Your diagnosis and recommendations are ready.'];
const logText = ['Reviewing and aggregating data sources', 'Comparing adoption signals', 'Deriving priorities and diagnosis', 'Preparing relevant recommendations'];

function Steps({ view }: { view: View }) {
  const active = ['upload', 'diagnosis', 'recommendations'].indexOf(view);
  return <div className="steps" aria-label="Progress">{[active ? 'Data uploaded' : 'Upload data', 'Diagnosis', 'Recommendations'].map((label, i) => <div key={label} className={`step ${i < active ? 'done' : i === active ? 'current' : ''}`}><b>0{i + 1}</b>{label}</div>)}</div>;
}

function Detail({ dimension, analysis }: { dimension: Dimension; analysis: Analysis }) {
  const m = analysis.metrics;
  return <>{dimension === 'relevance' ? <>Usage rate: <strong>{format(m.usage)}</strong> · perceived relevance: <strong>{format(m.relevance, true)}</strong> · process integration: <strong>{m.process >= 60 ? 'integrated' : 'still surface level'}</strong>. </> : dimension === 'trust' ? <>Usage rate: <strong>{format(m.usage)}</strong> · trust: <strong>{format(m.trust, true)}</strong> · concerns: <strong>{format(m.anxiety, true)}</strong>. </> : dimension === 'skills' ? <>Usage rate: <strong>{format(m.usage)}</strong> · critical AI literacy: <strong>{format(m.literacy, true)}</strong>. </> : <>Official usage: <strong>{format(m.official)}</strong> · Shadow AI signal: <strong>{format(m.shadow, true)}</strong>. </>}{scenarios[dimension].diagnosis}</>;
}

export default function Page() {
  const [view, setView] = useState<View>('upload');
  const [files, setFiles] = useState<Files>(emptyFiles);
  const [demo, setDemo] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [open, setOpen] = useState<Dimension[]>([]);
  const [drag, setDrag] = useState<Source | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [stage, setStage] = useState<number | null>(null);
  const [created, setCreated] = useState(false);
  const [creating, setCreating] = useState(false);
  const inputs = useRef<Partial<Record<Source, HTMLInputElement | null>>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const operation = useRef(0);
  const count = demo ? 3 : sourceKeys.filter(key => files[key].length).length;
  useEffect(() => () => { operation.current++; timers.current.forEach(clearTimeout); if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  function notify(text: string) {
    setMessage(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setMessage(''), 3000);
  }
  function show(next: View) {
    if (next !== 'upload' && !analysis) { notify('Upload data and start the analysis first.'); return; }
    setView(next);
    history.replaceState(null, '', location.pathname + location.search + (next === 'diagnosis' ? '#diagnose' : next === 'recommendations' ? '#empfehlungen' : ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function resetResult() { operation.current++; setAnalysis(null); setCreated(false); setCreating(false); setOpen([]); setError(''); }
  function addFiles(key: Source, chosen: File[]) {
    resetResult(); setDemo(false); setFiles(current => ({ ...current, [key]: chosen }));
    if (chosen.length) notify(`${chosen.length} file${chosen.length === 1 ? '' : 's'} added.`);
  }
  function useDemo() { resetResult(); setFiles(emptyFiles()); setDemo(true); notify('Demo dataset loaded — ready for analysis.'); }
  function downloadDemo() {
    const csv = 'department,employees_with_access,monthly_active_users,average_daily_active_users,active_licensed_users,pulse_relevance,pulse_trust,pulse_anxiety,ai_literacy,training_participation,successful_ai_use_cases,usage_rate,official_license_usage,survey_relevance_score,process_redesign_flag,survey_trust_score,survey_anxiety_score,literacy_score,shadow_ai_score\nCustomer Service,120,14,8,108,1.1,4.2,1.0,4.3,88,12,12,90,1.1,Surface Level,4.2,1.0,4.3,1.0\n';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'ai-adoption-radar-demo-data.csv'; link.click();
    timers.current.push(setTimeout(() => URL.revokeObjectURL(url), 1000)); notify('Demo data downloaded as CSV.');
  }
  const pause = (ms: number) => new Promise<void>(resolve => timers.current.push(setTimeout(resolve, ms)));
  async function analyze() {
    if (!count || stage !== null) return;
    const run = ++operation.current;
    setStage(0); setError(''); setCreated(false); setOpen([]);
    try {
      await pause(680); if (run !== operation.current) return; setStage(1);
      const parsed = demo ? null : await readMetrics(Object.values(files).flat());
      await pause(900); if (run !== operation.current) return; setStage(2);
      const result = score(parsed ?? demoMetrics);
      await pause(870); if (run !== operation.current) return; setStage(3);
      await pause(520); if (run !== operation.current) return;
      setAnalysis(result); setStage(null); setView('diagnosis');
      history.replaceState(null, '', location.pathname + location.search + '#diagnose'); window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (cause) {
      if (run !== operation.current) return;
      setStage(null); setError(cause instanceof Error ? cause.message : 'The file could not be read. Please choose another file.');
    }
  }
  async function createPlan() {
    if (!analysis || creating) return;
    const run = operation.current;
    setCreating(true); setCreated(false); await pause(950);
    if (run !== operation.current) return;
    setCreating(false); setCreated(true);
    notify(analysis.priority === 'relevance' ? 'Workshop preview ready. Download files have not been supplied.' : 'The implementation draft has been prepared.');
  }
  function renderSourceCard(source: Source) {
    const item = sources[source];
    const selected = demo ? [{ name: item.demo }] : files[source];
    return <article className={`source ${selected.length ? 'has' : ''} ${drag === source ? 'drag' : ''} ${stage !== null ? 'work' : ''}`} data-source={source} onDragOver={event => { event.preventDefault(); setDrag(source); }} onDragLeave={() => setDrag(null)} onDrop={event => { event.preventDefault(); setDrag(null); addFiles(source, Array.from(event.dataTransfer.files)); }}>
      <div className="source-top"><div className="icon" aria-hidden="true">{item.icon}</div><div><div className="source-title"><h3>{item.title}</h3><span className="pill">optional</span></div><p>{item.description}</p></div></div>
      <div className="file-actions"><span className="types">CSV · XLSX · PDF · DOCX</span><button className="text-button" onClick={() => inputs.current[source]?.click()} aria-label={`Choose file for ${item.title}`}>Choose file</button></div>
      <div className="files">{selected.map((file, i) => <div className="file" key={`${file.name}-${i}`}><strong>✓</strong><span className="filename" title={file.name}>{file.name}</span><button className="remove" aria-label={`Remove ${file.name}`} onClick={() => { if (demo) { resetResult(); setDemo(false); notify('Demo files removed.'); } else addFiles(source, files[source].filter((_, index) => index !== i)); }}>×</button></div>)}</div>
      <input ref={element => { inputs.current[source] = element; }} className="file-input" type="file" aria-label={`${item.title} files`} accept=".csv,.xlsx,.xls,.pdf,.doc,.docx,text/csv,application/pdf" multiple onChange={event => addFiles(source, Array.from(event.target.files ?? []))} />
    </article>;
  }
  const primary = analysis ? scenarios[analysis.priority] : null;
  const isWorkshop = analysis?.priority === 'relevance';
  const m = analysis?.metrics;
  const evidence = analysis && m && primary ? isWorkshop ? [
    `Only ${Math.round(m.usage / 100 * 120)} of 120 licensed employees are recurring users.`,
    m.trainingCompleted !== undefined && m.trainingEligible !== undefined ? `${m.trainingCompleted} of ${m.trainingEligible} employees completed ${m.trainingName || 'AI Basics'} training (${Math.round(m.training)}%).` : `${Math.round(m.training)}% completed AI training.`,
    'Multiple employee statements indicate uncertainty about relevant day-to-day use cases.',
    'Employees generally report confidence in using AI and understanding the rules.',
  ] : [primary.diagnosis, `Current action priority: ${analysis.scores[analysis.priority]} / 100.`, 'The recommendation focuses on the primary blocker before widening the intervention.', 'Validate the hypothesis with a short team conversation.'] : [];

  return <>
    <header className="topbar"><div className="brand"><span className="radar" aria-hidden="true" /><span>AI Adoption Radar</span></div><nav className="nav" aria-label="Product navigation">{(['upload', 'diagnosis', 'recommendations'] as View[]).map((name, i) => <button key={name} className={view === name ? 'active' : ''} onClick={() => show(name)}>{['Data', 'Diagnosis', 'Recommendations'][i]}</button>)}</nav><span className="privacy">✓ Aggregated data only</span></header>
    <main inert={stage !== null}>
      {view === 'upload' && <section className="view active" aria-labelledby="uploadTitle"><p className="eyebrow">AI Adoption Radar · Step 1</p><h1 id="uploadTitle">Understand where AI adoption is stalling.</h1><p className="intro">Upload as much company data as possible. The Radar reveals the central adoption levers, with clear recommendations on which measures are worth investing in to increase AI adoption.</p><Steps view={view} />
        <div className="upload-layout"><section className="card upload-panel" aria-labelledby="sourceTitle"><div className="heading"><div><h2 id="sourceTitle">Which data would you like to analyze?</h2><p className="copy">Upload one file for each available data point. The more data you provide, the more meaningful the signal picture becomes.</p></div><span className="count">{count} of 3 data points</span></div>
          <div className="sources"><section className="data-group usage-group" aria-labelledby="usageGroupTitle"><div className="data-group-head"><h3 id="usageGroupTitle">IT Usage Data</h3><span>System export for access and usage</span></div><div className="source-grid">{renderSourceCard('usage_data')}</div></section><section className="data-group feedback-group" aria-labelledby="feedbackGroupTitle"><div className="data-group-head"><h3 id="feedbackGroupTitle">Feedback, Training &amp; Use Case Data</h3><span>Signals on experience and capability</span></div><div className="source-grid">{renderSourceCard('pulse_survey')}{renderSourceCard('training_use_cases')}</div></section></div>
          {error && <p className="alert show" role="alert">{error}</p>}
          <div className="upload-footer"><div className="demo-actions"><button className="text-button" onClick={useDemo}>✦ Use demo dataset</button><button className="text-button" onClick={downloadDemo}>↓ Download demo data</button></div><button className="button primary" disabled={!count} onClick={analyze}>Analyze <span className="arrow">→</span></button></div>
        </section><aside className="card brief" aria-label="Analysis scope"><div className="brief-top"><p className="eyebrow">What the Radar examines</p><h2>Four signals. One actionable next decision.</h2><p>The analysis prioritizes actions at team and department level — not individuals.</p></div><div className="brief-list">{[['Relevance', 'Is AI integrated into work or just an add-on?'], ['Trust & Concerns', 'Are psychological barriers limiting usage?'], ['Skills', 'Is AI being used critically and competently?'], ['Governance', 'Is Shadow AI emerging because safe paths are missing?']].map(([title, text], i) => <div className="brief-row" key={title}><span className="brief-no">0{i + 1}</span><div><strong>{title}</strong><span>{text}</span></div></div>)}</div><div className="privacy-note"><span aria-hidden="true">⌑</span><span><strong>Privacy by design.</strong> In this MVP, files are processed locally in the browser and only aggregated team signals are shown.</span></div></aside></div>
      </section>}

      {view === 'diagnosis' && analysis && primary && <section className="view active" aria-labelledby="diagnosisTitle"><Steps view={view} /><div className="diagnosis-head"><div><p className="eyebrow">Step 2 · Diagnosis</p><h1 id="diagnosisTitle">Where is the biggest need for action?</h1></div><p className="meta"><strong>Analysis profile</strong><br />{count} data point{count === 1 ? '' : 's'} · {demo ? 'Synthetic demo profile' : analysis.metrics.found ? `${analysis.metrics.found} structured data fields detected; demo values fill missing fields` : 'Demo reference profile; no supported CSV metrics detected'}</p></div>
        <section className="priority" aria-live="polite"><div><p className="eyebrow">AI Adoption Health <strong>{analysis.scores[analysis.priority] >= 65 ? 'Low' : 'Moderate'}</strong></p><h2>Primary blocker: {primary.title}.</h2><p>{primary.desc}</p></div><div className="priority-score"><span className="priority-score-label">Action Priority</span><strong><span>{analysis.scores[analysis.priority]}</span><small>/100</small></strong></div></section>
        <section className="card evidence-panel" aria-labelledby="evidenceTitle"><div className="evidence-head"><div><p className="eyebrow">Evidence</p><h2 id="evidenceTitle">Primary blocker: {primary.title}</h2></div><span className="evidence-badge">Signal check</span></div><ul className="evidence-list">{evidence.map(item => <li key={item}>{item}</li>)}</ul><div className="interpretation"><strong>Interpretation</strong><p>{isWorkshop ? 'The main barrier does not appear to be basic AI skills or governance. Employees understand how to use the tool but struggle to connect it to concrete tasks in their daily work.' : 'The highlighted pattern is a transparent decision-support hypothesis. Validate it with the team before starting a larger intervention.'}</p></div></section>
        <div className="section-row"><div><h2>Your adoption signal picture</h2><p>The scores indicate action priority, not adoption health. The higher the score, the more urgent the need for intervention.</p></div><span className="legend"><span className="dot" />highest action priority highlighted</span></div>
        <div className="kpis">{dimensions.map(key => <article key={key} className={`kpi ${analysis.priority === key ? 'priority-kpi' : ''}`} data-kpi={key} style={{ '--score': `${analysis.scores[key]}%` } as CSSProperties}><div className="kpi-head"><div className="kpi-tag"><span className="kpi-index">{scenarios[key].index}</span><span>KPI</span></div><span className="kpi-status">{status(analysis.scores[key])}</span></div><h3>{scenarios[key].short}</h3><p className="kpi-desc">{scenarios[key].desc}</p><div className="score-row"><div className="score"><span className="score-label">Action Priority</span><strong className="score-number">{analysis.scores[key]}<small>/100</small></strong></div><div className="track"><div className="fill" /></div></div><button className="info-toggle" aria-expanded={open.includes(key)} aria-controls={`info-${key}`} onClick={() => setOpen(current => current.includes(key) ? current.filter(k => k !== key) : [...current, key])}>{open.includes(key) ? 'Less info' : 'More info'} <span className="chevron">›</span></button><div className={`info ${open.includes(key) ? 'open' : ''}`} id={`info-${key}`} aria-hidden={!open.includes(key)}><div className="info-inner"><div className="info-copy"><Detail dimension={key} analysis={analysis} /></div></div></div></article>)}</div>
        <section className="next"><div><h3>From diagnosis to the right intervention</h3><p>You can now see the “why”. Next, we translate it into concrete, actionable levers.</p></div><button className="button primary" onClick={() => show('recommendations')}>View recommendations <span className="arrow">→</span></button></section>
      </section>}

      {view === 'recommendations' && analysis && primary && <section className="view active" aria-labelledby="recommendationsTitle"><Steps view={view} /><div className="rec-head"><p className="eyebrow">Step 3 · Recommendations</p><h1 id="recommendationsTitle">Move the right lever first.</h1><p className="intro">These measures are tailored to the prioritized adoption pattern and can serve as a shared starting point for the business, HR and IT.</p><span className="chosen"><span className="dot" />Primary blocker: {primary.title} · Action Priority: {analysis.scores[analysis.priority]}/100</span></div>
        <div className="rec-summary"><section className="card recap"><p className="recap-label">Starting point</p><h2>{primary.diagnosis.split('.')[0]}.</h2><p>{primary.diagnosis}</p><p className="data-source">{demo ? 'Based on the demo dataset from Usage Data, Pulse Survey and Training & Use Case Data.' : `Based on ${count} uploaded data point${count === 1 ? '' : 's'}. CSV metrics are read locally; missing values use the demo profile. Unstructured documents are not parsed.`}</p></section><section className="card callout"><p className="eyebrow">Recommended direction</p><h2>{primary.actionTitle}</h2><p>{primary.action}</p></section></div>
        <div className="section-row"><div><h2>Recommended levers</h2><p>Three small, connected steps are more effective than a one-off standard workshop.</p></div></div><div className="levers">{primary.levers.map(([title, text, time], i) => <article className="lever" key={title}><span className="lever-no">0{i + 1}</span><h3>{title}</h3><p>{text}</p><span className="time">{time}</span></article>)}</div>
        <section className="implementation"><div><h2>{isWorkshop ? 'Create Workshop' : 'Would you like to put these measures into action?'}</h2><p>{isWorkshop ? 'Let AI create a role-specific AI Use Case Discovery Workshop for the Customer Service team.' : 'We will create a tailored implementation draft with owners, initial dates and success signals — ready for joint review.'}</p></div><div className="actions"><button className="button secondary" onClick={() => notify('No problem — the recommendations remain available for a later decision.')}>Decide later</button><button className="button primary" disabled={creating} onClick={createPlan}>{creating ? <><span className="mini-spinner" />{isWorkshop ? 'Preparing workshop preview' : 'Creating plan'}</> : <>{created ? isWorkshop ? 'Workshop preview ready' : 'Plan preview ready' : isWorkshop ? 'Create Workshop' : 'Create plan'} <span className="arrow">{created ? '✓' : '→'}</span></>}</button></div>
          {created && <div className="result show" role="status">{isWorkshop ? <><strong>Workshop preview ready.</strong> A role-specific AI Use Case Discovery Workshop for Customer Service includes agenda, participant prompts and a pilot brief. This prototype does not call an AI service.<div className="result-actions"><button className="button secondary artifact-download" disabled>Download PPTX</button><button className="button secondary artifact-download" disabled>Download PDF</button></div><p className="artifact-note">The referenced workshop files have not been supplied yet.</p></> : <><strong>Implementation preview ready.</strong> Review the three recommended starting measures with the team. No plan has been saved or sent.</>}</div>}
        </section>
      </section>}
    </main>
    {stage !== null && <div className="overlay show" role="dialog" aria-modal="true" aria-labelledby="analysisTitle"><div className="modal"><div className="spinner" aria-hidden="true" /><p className="eyebrow">Analysis in progress</p><h2 id="analysisTitle">Your Adoption Radar is being created</h2><p className="modal-desc" aria-live="polite">{progressText[stage]}</p><div className="progress"><div className="bar" style={{ width: `${[8, 32, 68, 100][stage]}%` }} /></div><div className="logs">{logText.map((text, i) => <div key={text} className={`log ${i < stage ? 'done' : i === stage ? 'active' : ''}`}><span className="log-state">✓</span><span>{text}</span></div>)}</div></div></div>}
    <div className={`toast ${message ? 'show' : ''}`} role="status" aria-live="polite">{message}</div>
  </>;
}
