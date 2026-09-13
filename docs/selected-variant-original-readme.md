# AI Adoption Radar

> **MVP update — 12 September 2026:** interactive departmental data entry included

## MVP Vision & Problem Statement

Companies invest heavily in AI licences and track classic IT KPIs such as daily or monthly active users (DAU/MAU). But high usage does not automatically mean successful adoption when working with probabilistic AI.

Without professional change management, official AI usage can stagnate at around 15% after implementation. At the same time, employees may use shadow AI much more often than leadership realises. High usage without critical competence can lead to blind trust (over-reliance) at the *jagged technological frontier* and reduce work quality.

**AI Adoption Radar** transforms isolated organisational signals—usage data and pulse surveys—into a clear diagnosis. It shows not only *what* is happening, but also *why*, and recommends the next data-driven intervention.

> **Core logic:** Measure → Diagnose → Act → Learn

## Use the MVP

Open `index.html` in a browser. The MVP starts with six example measurements across five departments. It supports the complete first MVP flow:

1. **Upload:** Load aggregated departmental data from a CSV or JSON file.
2. **Validate:** Check required fields, numeric ranges, allowed process values and a minimum `headcount` of 10. Missing values make the row invalid; they are never converted to `0`.
3. **Analyze:** Select a department, compare its signals and view exploratory Pearson correlations across the latest measurements of all departments.
4. **Diagnose:** Inspect all matching pathways—several can be active at once.
5. **Recommend:** Receive a clearly labelled adoption hypothesis and a suggested next intervention.

The implementation is a static, client-side application. File parsing, validation and calculations run locally in the browser; the uploaded data is not sent to a server.

### CSV / JSON schema

Required fields:

```text
department, headcount, usage_rate, official_license_usage,
survey_relevance_score, process_redesign_flag, survey_trust_score,
survey_anxiety_score, literacy_score, shadow_ai_score
```

`measured_at` is optional. It can be used for several measurements per department; the application displays the latest valid one and a simple usage-rate comparison when a history is available.

`process_redesign_flag` accepts `Surface Level` or `Reimagination`. Rates must be within 0–100 and survey values within 1–5.

### Methodological guardrails

- The app is decision support, not employee monitoring; it intentionally excludes groups with fewer than 10 people.
- The rule thresholds are MVP hypotheses, not scientifically validated cut-offs.
- Correlations are exploratory and explicitly do **not** demonstrate causality.
- A primary pathway is a prioritised intervention hypothesis. Multiple active pathways are retained and shown rather than treated as a single root cause.

## Data Inputs — Signal Layer

The system works at departmental level only and is designed for groups of more than 10 people. It combines two kinds of aggregated signals.

### 1. Quantitative metrics — IT admin console

| Metric | Description |
| --- | --- |
| `usage_rate` | DAU/MAU: percentage of active users |
| `official_license_usage` | Active logins to the paid corporate AI software |

### 2. Qualitative metrics — pulse survey (1–5 scale)

| Metric | Description |
| --- | --- |
| `survey_relevance_score` | Perceived relevance for daily work routines |
| `process_redesign_flag` | Whether AI is a surface-level add-on or workflows are reimagined |
| `survey_trust_score` | AI trust regarding fairness and functionality |
| `survey_anxiety_score` | Structural mistrust and concerns such as anxiety about job loss |
| `literacy_score` | Critical AI literacy: ability to analytically and ethically question outputs |
| `shadow_ai_score` | Extent of unauthorised job crafting and shadow AI use |

## Diagnostic Engine — Four Pathways

The rule engine translates input signals into a diagnosis and an immediate recommended action.

### 1. Surface-Level Syndrome — lack of relevance

**Trigger**

```text
usage_rate < 30%
AND survey_relevance_score < 3.0
AND process_redesign_flag = "Surface Level"
```

**Diagnosis:** AI is used as a superficial add-on rather than to redesign core processes.

**Action:** Stop generic training rollouts. Define specific use cases with team champions and redesign a high-frequency workflow. The aim is to move adoption beyond the 15% baseline toward sustained use.

### 2. Structural Mistrust & Anxiety Blockade

**Trigger**

```text
usage_rate <= baseline
AND survey_trust_score < 3.0
AND survey_anxiety_score >= 3.0
```

**Diagnosis:** Providing the software alone does not increase performance: AI trust is missing and anxieties block adoption.

**Action:** Invest in trust-enabling activities. Make task boundaries and verification practices explicit, and give employees a safe forum for job-related concerns. Formal training that reduces anxiety can make AI use more productive for 48% of employees.

### 3. Danger of Over-Reliance — blind trust

**Trigger**

```text
usage_rate > 60%
AND literacy_score < 3.0
```

**Diagnosis:** The team uses AI heavily without questioning its probabilistic outputs analytically or ethically, creating a risk of poorer work quality.

**Action:** Shift enablement from simple click instructions to critical AI literacy: verification, uncertainty awareness, bias checks, source validation, and ethical questioning.

### 4. Pronounced Shadow IT

**Trigger**

```text
official_license_usage < 20%
AND shadow_ai_score >= 3.0
```

**Diagnosis:** Employees are proactively reshaping their roles through job crafting and use shadow AI more often than management realises.

**Action:** Build hierarchy-free **Communities of Practice (CoPs)**. They help transfer isolated workarounds into a psychologically safe, shared and legally compliant practice.

## Privacy by Design

The MVP deliberately shows no individual-level information. It processes only aggregated departmental signals for teams larger than 10 people.

## Outlook — API Integration

In the next phase, the MVP can connect to APIs from existing ITSM tools and survey platforms. These continuous, aggregated data streams will feed the rule engine in a privacy-compliant way.
