# Apollo Hospitals Patient Flow Analytics — Offline Python Pipeline

This directory contains the Python analytics pipeline matching the 15 SQL queries in the Apollo Hospitals Patient Flow project.

## Workflow Overview
```
Business Question ➔ SQL Query ➔ Equivalent Pandas Analysis ➔ Seaborn/Matplotlib Chart ➔ Validated Finding ➔ Operational Action
```

## Setup & Execution
To run the analysis and generate charts locally:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run data validation checks between SQL logic and Pandas
python validate_results.py

# 3. Generate high-resolution SVG & PNG charts into public/charts/
python generate_charts.py

# 4. Generate the complete executive analytical PDF report
python generate_report.py
```

## Structure
- `load_data.py`: Loads the raw hospital datasets (Hospitals, Departments, Doctors, Patients, Admissions, Bed Occupancy) into structured Pandas DataFrames.
- `chart_theme.py`: Configures the Apollo clinical design system palette (`#002d39`, `#007c9d`, `#def4fa`, `#f58320`, `#10b981`) for Seaborn and Matplotlib figures.
- `query_analyses.py`: Contains analytical functions for all 15 questions reproducing SQL aggregations, window functions, and composite bottleneck scoring in Pandas.
- `validate_results.py`: Cross-validates all 15 queries against Pandas transformations (row counts, sums, averages, rankings) and exports `public/analysis/validation-results.json`.
- `generate_charts.py`: Generates publication-ready SVG and PNG charts for all 15 questions into `public/charts/`.
- `generate_report.py`: Compiles the comprehensive executive PDF report into `public/reports/apollo-patient-flow-analysis.pdf`.
