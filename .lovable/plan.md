## Text-only copy swap on `src/pages/Index.tsx`

No visual/layout changes. Just replace strings in-place, matching the pasted brief line-for-line.

### 1. Findings list (`FINDINGS`, lines 391–400)
Replace title + body for the four rows:
- **01 Filing prioritization** → "RegCo knows which filings matter most. It ranks every open return by deadline and risk, so your team always works on the right thing first instead of guessing."
- **02 Over-reporting** → "Most platforms flag too much and overwhelm your team with noise. RegCo filters out low-risk activity automatically, so the alerts your officers see are the ones that actually need a human decision, not routine transactions that simply crossed a number."
- **03 Precision** → "RegCo's Screening Core leads on precision. It matches how a senior examiner actually reviews a case, with the fewest false holds and the fastest turnaround of any module in the platform."
- **04 The gap** → "No automated system fully replaces a senior compliance officer yet, and RegCo doesn't pretend otherwise. Where it still falls short: judging unusual cases, weighing context across departments, writing clean documentation, and adjusting thresholds as they spot the details that matter in a live case. RegCo is built around that complexity, so the platform shows whether its outputs actually help your team get work done, not just whether it can catch obvious problems."

### 2. Section 2 intro (line 455)
→ "RegCo gives compliance teams the strongest overall readiness score, and it stays accurate across every part of the platform, from filing to screening to case review."

### 3. Figure 1 intro paragraph (line 480)
→ "spot the details that matter in a live case. RegCo is built around that complexity, so the platform shows whether its outputs actually help your team get work done, not just whether it can catch obvious problems."

Update FIG. 1 caption (line 256) → "Each cell shows how often examiners agreed a case needed attention at that stage. Higher means more examiners flagged the same pattern."

Update heatmap column headers (line 207): `T1..T4` → `S1..S4`. Add scenario titles (line 233–235): `SCENARIO 1/2/3` → `TYPE 1 → STRUCTURING`, `TYPE 2 → SHELL ACCOUNTS`, `TYPE 3 → FAKE IDENTITY`.

### 4. Section 6 (lines 490–494)
- Heading → "6. Stage-level Findings"
- Sub → "6.1 Overall score"
- Body → "RegCo scores 50.5% overall across every case type and review stage, ahead of rule-only detection at 47.3%, machine-learning-only detection at 45.1%, and fully manual review at 44.4%. The gap between methods is small, which shows this kind of work is genuinely hard no matter how it's automated — but RegCo still comes out ahead, and the result holds steady across every case type tested."

### 5. Ranked bars (`OVERALL`, lines 266–269)
Replace names → `RegCo`, `Rule-Based Detection`, `Machine Learning Only`, `Manual Review`. Update FIG. 3 caption (line 302) → "Every case type and stage counts equally, so late-stage cases don't skew the score."

### 6. Section 6.3 (lines 508–511)
- Heading → "6.3 Score by stage"
- Add eyebrow line → "Every method struggles most at the very first step: intake."
- Body → the 9-line paragraph about Intake (RegCo 30.3%, rule-based 22.6%, ML 21.9%, manual 17.9%…).

Insert a "6.2 Score by side" heading + one-line fragment "Every method, including RegCo, still struggles with escalation decisions that need" between the ranked bars and 6.3, per brief.

### 7. Grouped bars (`DIMS`, lines 311–317 + legend line 330)
- Legend names → `RegCo`, `Rule-Based Detection`, `Machine Learning Only`, `Manual Review`.
- X-axis labels → `Detection`, `Documentation`, `Audit Trail`, `Filing`, `Case Resolution`.
- FIG. 6 caption (line 382) → "Weighted accuracy for each part of the compliance workflow, pooled across every test case."
- Add cut-off fragment above chart → "default toward clearing transactions."

### 8. Remove section 6.4 "Filing readiness by jurisdiction" (lines 521–535)
Not in the new brief — delete both sections (heading + duplicate ranked bars) so the flow matches the pasted structure.

### 9. Program CTA section (lines 538–557) → RegCo Research Program
- Breadcrumb "‹ RegCo Compliance" above headline.
- Headline (2 lines) → "Introducing the RegCo / Compliance Research Program"
- Body → "We're starting the RegCo Compliance Research Program to support new work on fraud detection and automated compliance. Two researchers will share $50,000 in funding and $25,000 in compute credits to pursue their own focused projects."
- Add subheading "Why we're starting this program" + the two paragraphs ("Every regulated transaction depends…" and the 10-line "AI has made the fastest progress…").
- Add "Who we're looking for" section with intro fragment + 5-line paragraph.
- Add "How to apply" subheading + 2-line body.
- Date cards → "Applications close / July 17, 2026" and "Researchers announced / July 31, 2026".
- CTA button label → "Apply here" (keep cream pill, still routes to `/book-demo`).
- Footer line → "Questions? research@regco.ng"

### Out of scope
- No layout, spacing, color, chart-shape, or component changes.
- Nav already matches ("Home / Product / About us / Who we serve / Log in") — no change.
- Ledger eyebrow ("ledger · v1.0") stays.
- No database or edge-function touches.

Single file edited: `src/pages/Index.tsx`.