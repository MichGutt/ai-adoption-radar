import type { Dimension } from './scenarios';

export type Metrics = {
  usage: number; relevance: number; process: number; trust: number;
  anxiety: number; literacy: number; official: number; shadow: number; training: number;
  trainingCompleted?: number; trainingEligible?: number; trainingName?: string;
  found?: number;
};
export const demoMetrics: Metrics = {
  usage: 12, relevance: 22, process: 0, trust: 84, anxiety: 20,
  literacy: 85, official: 90, shadow: 20, training: 88,
  trainingCompleted: 106, trainingEligible: 120, trainingName: 'AI Basics',
};
export const dimensions: Dimension[] = ['relevance', 'trust', 'skills', 'governance'];
const clamp = (n: number) => Math.max(0, Math.min(100, n));
type Row = Record<string, string>;
const mean = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
const numeric = (value?: string) => {
  if (!value?.trim()) return null;
  const n = Number(value.trim().replace('%', '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};
const value = (row: Row, keys: string[]) => keys.map(key => row[key]).find(v => v !== undefined);

// CSV parsing stays local. Quoted delimiters, escaped quotes and multiline fields are supported.
export function csvRows(text: string): Row[] {
  text = text.replace(/^\uFEFF/, '');
  const header = text.split(/\r?\n/)[0];
  const separator = header.split(';').length > header.split(',').length ? ';' : ',';
  const records: string[][] = [];
  let record: string[] = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && (c === separator || c === '\n' || c === '\r')) {
      record.push(field.trim()); field = '';
      if (c !== separator) {
        if (record.some(v => v)) records.push(record);
        record = [];
        if (c === '\r' && text[i + 1] === '\n') i++;
      }
    } else field += c;
  }
  if (quoted) throw new Error('The CSV contains an unclosed quoted field.');
  record.push(field.trim());
  if (record.some(v => v)) records.push(record);
  const keys = (records.shift() ?? []).map(v => v.toLowerCase().replace(/[\s-]+/g, '_').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss'));
  return records.map(values => Object.fromEntries(keys.map((key, i) => [key, values[i] ?? ''])));
}
function norm(rows: Row[], keys: string[], survey = false) {
  const n = mean(rows.map(row => numeric(value(row, keys))).filter((n): n is number => n !== null));
  return n === null ? null : clamp(survey ? n * 20 : n);
}
function ratio(rows: Row[], top: string[], bottom: string[]) {
  return mean(rows.map(row => {
    const a = numeric(value(row, top)), b = numeric(value(row, bottom));
    return a === null || b === null || b <= 0 ? null : clamp(a / b * 100);
  }).filter((n): n is number => n !== null));
}
function trainingMetric(rows: Row[]) {
  const course = ['course', 'course_name', 'course_title', 'training', 'training_name', 'training_title', 'training_module', 'module', 'program'];
  const completed = ['employees_completed','completed_employees','completed_count','completed_users','participants_completed','attendees_completed','trained_employees','completion_count','number_completed','number_of_completions','completed','completions'];
  const eligible = ['employees_with_access','employees_access','eligible_employees','total_employees','employee_count','employees_total','licensed_employees','enrolled','enrolled_employees','employees_enrolled','assigned','assigned_employees','total_assigned','population','population_size','total_users','employees','total'];
  const rates = ['training_participation','training_completion','training_completed','completion_rate','training_completion_rate','completion_percentage','completion_percent','percent_completed'];
  const label = (row: Row) => course.map(k => row[k]).filter(Boolean).join(' ');
  const sorted = [...rows.filter(r => /\bai[\s_-]*basics\b/i.test(label(r))), ...rows];
  for (const row of sorted) {
    const a = numeric(value(row, completed)), b = numeric(value(row, eligible)), rate = numeric(value(row, rates));
    if (a !== null && b !== null && b > 0) return { rate: clamp(a / b * 100), completed: Math.round(a), eligible: Math.round(b), name: label(row) || 'AI Basics' };
    if (rate !== null) return { rate: clamp(rate <= 1 ? rate * 100 : rate), name: label(row) || 'AI training' };
  }
  return null;
}
export async function readMetrics(files: File[]): Promise<Metrics | null> {
  const csv = files.filter(f => /\.csv$/i.test(f.name));
  const allRows = (await Promise.all(csv.map(async f => csvRows(await f.text())))).flat();
  if (!allRows.length) return null;
  const grouped = new Map<string, Row>();
  for (const row of allRows) {
    const key = row.department || row.abteilung || row.team || 'organization';
    grouped.set(key, { ...grouped.get(key), ...row });
  }
  const rows = [...grouped.values()], training = trainingMetric(allRows);
  const process = mean(rows.map(row => {
    const v = value(row, ['process_redesign_flag','process_redesign','prozessintegration','prozess_reife']);
    const n = numeric(v);
    if (n !== null) return n <= 5 ? n * 20 : n;
    if (/reimagination|redesign|integriert|high/i.test(v ?? '')) return 100;
    if (/surface|add.on|niedrig|low/i.test(v ?? '')) return 0;
    return null;
  }).filter((n): n is number => n !== null));
  const parsed = {
    usage: norm(rows, ['usage_rate','nutzungsrate','ki_nutzung','ai_usage','usage']) ?? ratio(rows, ['monthly_active_users','mau','average_daily_active_users','adau'], ['employees_with_access','employees_access','access']),
    relevance: norm(rows, ['survey_relevance_score','pulse_relevance','relevanz','relevance_score','relevance'], true),
    process,
    trust: norm(rows, ['survey_trust_score','pulse_trust','vertrauen','trust_score','trust'], true),
    anxiety: norm(rows, ['survey_anxiety_score','pulse_anxiety','aengste','angst','anxiety_score','anxiety'], true),
    literacy: norm(rows, ['literacy_score','ai_literacy','ki_literacy','skills_score','skills'], true),
    official: norm(rows, ['official_license_usage','offizielle_nutzung','official_usage','lizenznutzung']) ?? ratio(rows, ['active_licensed_users','licensed_active_users'], ['employees_with_access','employees_access','access']),
    shadow: norm(rows, ['shadow_ai_score','shadow_ai','shadowai','shadow_score'], true),
    training: training?.rate ?? norm(rows, ['training_participation','training_completion','training_completed']),
  };
  const found = Object.values(parsed).filter(n => n !== null).length;
  if (!found) return null;
  const result: Metrics = { ...demoMetrics, found };
  for (const key of Object.keys(parsed) as (keyof typeof parsed)[]) result[key] = parsed[key] ?? demoMetrics[key];
  if (training) {
    result.trainingCompleted = training.completed; result.trainingEligible = training.eligible; result.trainingName = training.name;
  }
  return result;
}
export function score(metrics: Metrics) {
  const m = metrics;
  const scores = {
    relevance: Math.round(clamp((100-m.usage)*.35+(100-m.relevance)*.4+(100-m.process)*.25)),
    trust: Math.round(clamp((100-m.usage)*.2+(100-m.trust)*.45+m.anxiety*.45)),
    skills: Math.round(clamp(m.usage*.5+(100-m.literacy)*.5)),
    governance: Math.round(clamp((100-m.official)*.4+m.shadow*.6)),
  };
  const priority = [...dimensions].sort((a,b) => scores[b]-scores[a])[0];
  return { metrics, scores, priority };
}
export type Analysis = ReturnType<typeof score>;
export const format = (n: number, survey = false) => survey ? `${(n / 20).toFixed(1)} / 5` : `${Math.round(n)} %`;
export const status = (n: number) => n >= 80 ? 'critical' : n >= 65 ? 'high' : n >= 45 ? 'monitor' : 'stable';
