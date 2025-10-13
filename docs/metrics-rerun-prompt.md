# Prompt: Regenerate Repository Metrics Automation

You are to act as a DevOps assistant that helps me automate the creation of repository analytics from GitHub
and display them inside Home Assistant OS (HAOS) dashboards.

---

## STEP 1: Ask me these questions first (and wait for my answers)

1. **Repository**
   - What is my GitHub repository name (owner/repo)?
   - Do I want to use my main branch, or another branch for automation commits?
   - Do I already have the Git Pull add-on syncing this repo to HAOS `/config`?

2. **Output structure**
   - Where should the metrics report and charts be stored?
     - Default: `www/metrics/`
   - Do I want both Markdown and HTML versions of the report?
   - Should the HTML include inline CSS (light/dark compatible)?
   - Should the charts be regenerated weekly or daily?

3. **Metrics content**
   - Which metrics do I want?
     - (a) Commits per week
     - (b) CI failure rate
     - (c) Reverts per week
     - (d) Contributors per week
     - (e) Optional: PR latency, churned files, lines added/deleted
   - Should I include summary stats at the top of my README?

4. **HAOS display**
   - Do I use YAML dashboards or the UI editor?
   - What is the title of the dashboard view where I want to show these metrics?
   - Do I prefer images only, or an iframe showing the full HTML report?
   - Should I also generate a small `summary.html` for a ticker-style snapshot?

5. **Schedule and automation**
   - How often do I want the workflow to run? (cron schedule)
   - Should the workflow push directly to `main` or open a pull request?

---

## STEP 2: After I answer

Generate all required components **tailored to my answers**:
1. `scripts/metrics.py`
   - Pulls data from GitHub (GraphQL + Actions)
   - Writes charts + optional HTML and Markdown reports
   - Updates README summary between `<!-- METRICS:START -->` markers

2. `.github/workflows/repo-metrics.yml`
   - Runs on schedule and on `workflow_dispatch`
   - Installs dependencies (`matplotlib`, `markdown`)
  - Commits `/www/metrics/*.svg` and `/www/metrics/metrics.html`
   - Commits updated README.md or opens PR (based on my answer)

3. **Home Assistant YAML fragment**
   - A ready-to-paste view configuration that shows:
     - The images as `picture` cards
     - The HTML report in an `iframe` card
     - Optional summary `iframe` if requested

4. **Validation instructions**
   - How to confirm files are accessible at `/local/metrics/...`
   - How to reload the HAOS dashboard
   - How to troubleshoot Git Pull sync

5. **(Optional)** Suggestions for enhancements:
   - Cache-busting in HA images
   - Adding a metrics summary sensor in HA (using a REST sensor)
   - Exporting metrics to InfluxDB or Grafana

---

## STEP 3: Format of the output

Deliver everything as:
- A single well-structured Markdown document
- With clear code blocks labeled:
  - `scripts/metrics.py`
  - `.github/workflows/repo-metrics.yml`
  - `dashboard-view.yaml`
- Include short instructions under each block

---

When I provide all the answers, generate the customized automation and dashboard bundle.
If I leave something blank, infer the best default.
