"""
Apollo Hospitals Patient Flow Analytics
generate_charts.py — Generates SVG & PNG Charts for all 15 SQL questions
Uses Apollo clinical design tokens (#002d39, #007c9d, #f58320, #def4fa, #f7fbfc).
"""

import os
import math

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "charts")

APOLLO_INK = "#002d39"
APOLLO_BLUE = "#007c9d"
APOLLO_BLUE_SOFT = "#def4fa"
APOLLO_ORANGE = "#f58320"
APOLLO_YELLOW = "#fcd34d"
APOLLO_CREAM = "#fff8e6"
APOLLO_GREEN = "#10b981"
APOLLO_GREEN_SOFT = "#e3f8ec"
APOLLO_RED = "#e11d48"
APOLLO_BORDER = "#d7e7eb"
APOLLO_GRID = "#eef4f6"
APOLLO_TEXT_MUTED = "#527983"
APOLLO_SURFACE = "#ffffff"
APOLLO_PAGE = "#f7fbfc"

def wrap_svg(width, height, content, title="Apollo Patient Flow Chart", subtitle=""):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="100%" style="background-color: {APOLLO_SURFACE}; font-family: 'Figtree', 'Plus Jakarta Sans', system-ui, sans-serif;">
  <defs>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{APOLLO_BLUE}" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{APOLLO_ORANGE}" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{APOLLO_INK}" />
      <stop offset="100%" stop-color="{APOLLO_BLUE}" />
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#002d39" flood-opacity="0.06"/>
    </filter>
  </defs>

  <!-- Canvas Background & Border -->
  <rect width="{width}" height="{height}" fill="{APOLLO_SURFACE}" rx="8"/>
  <rect x="0.5" y="0.5" width="{width - 1}" height="{height - 1}" fill="none" stroke="{APOLLO_BORDER}" stroke-width="1" rx="8"/>

  <!-- Chart Header -->
  <g transform="translate(30, 32)">
    <text x="0" y="0" font-size="16" font-weight="700" fill="{APOLLO_INK}">{title}</text>
    {f'<text x="0" y="18" font-size="11" fill="{APOLLO_TEXT_MUTED}">{subtitle}</text>' if subtitle else ''}
  </g>

  <!-- Chart Graphics Content -->
  {content}

  <!-- Apollo Analytical Footer Watermark -->
  <g transform="translate(30, {height - 16})">
    <line x1="0" y1="-10" x2="{width - 60}" y2="-10" stroke="{APOLLO_BORDER}" stroke-width="0.75" />
    <text x="0" y="0" font-size="9" fill="{APOLLO_TEXT_MUTED}" font-style="italic">
      Network-wide analytical snapshot | Dataset: 4 Hospitals, 2,500 Admissions, 7,300 Bed Logs | Apollo Portfolio Project
    </text>
  </g>
</svg>"""

def generate_q01():
    # Treemap of table record counts
    tables = [
        ("bed_occupancy", 7300, "Time-Series Logs", "#007c9d", 30, 70, 420, 240),
        ("admissions", 2500, "Patient Events", "#0284c7", 460, 70, 290, 160),
        ("patients", 500, "Patient Master", "#38bdf8", 460, 240, 140, 70),
        ("doctors", 60, "Clinical Staff", "#f58320", 610, 240, 140, 70),
        ("departments", 20, "Wards & Specialties", "#10b981", 460, 320, 140, 45),
        ("hospitals", 4, "Network Facilities", "#fcd34d", 610, 320, 140, 45)
    ]
    svg_body = '<g>'
    for name, count, desc, color, x, y, w, h in tables:
        svg_body += f'''
        <g transform="translate({x}, {y})">
          <rect width="{w}" height="{h}" rx="6" fill="{color}" opacity="0.9"/>
          <rect width="{w}" height="{h}" rx="6" fill="none" stroke="{APOLLO_SURFACE}" stroke-width="2"/>
          <text x="14" y="24" font-size="13" font-weight="700" fill="#ffffff">{name}</text>
          <text x="14" y="44" font-size="18" font-weight="800" fill="#ffffff">{count:,}</text>
          <text x="14" y="{h - 12}" font-size="10" fill="#ffffff" opacity="0.85">{desc}</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q01: Database Schema & Entity Sizing", "Treemap representation of record volumes across relational database tables")

def generate_q02():
    # Ranked Column Chart: Admissions by Hospital
    hospitals = [
        ("Apollo Hyderabad", 654, 26.2, APOLLO_INK),
        ("Apollo Mumbai", 631, 25.2, APOLLO_BLUE),
        ("Apollo Delhi", 630, 25.2, "#0284c7"),
        ("Apollo Bangalore", 585, 23.4, "#38bdf8")
    ]
    max_val = 700
    chart_h = 220
    base_y = 310
    svg_body = f'''
    <g transform="translate(60, 0)">
      <!-- Grid lines -->
      <line x1="0" y1="{base_y}" x2="640" y2="{base_y}" stroke="{APOLLO_BORDER}" stroke-width="1"/>
      <line x1="0" y1="{base_y - 70}" x2="640" y2="{base_y - 70}" stroke="{APOLLO_GRID}" stroke-width="1" stroke-dasharray="4,4"/>
      <line x1="0" y1="{base_y - 140}" x2="640" y2="{base_y - 140}" stroke="{APOLLO_GRID}" stroke-width="1" stroke-dasharray="4,4"/>
      <line x1="0" y1="{base_y - 210}" x2="640" y2="{base_y - 210}" stroke="{APOLLO_GRID}" stroke-width="1" stroke-dasharray="4,4"/>
      
      <!-- Axis Labels -->
      <text x="-12" y="{base_y + 4}" font-size="10" fill="{APOLLO_TEXT_MUTED}" text-anchor="end">0</text>
      <text x="-12" y="{base_y - 66}" font-size="10" fill="{APOLLO_TEXT_MUTED}" text-anchor="end">200</text>
      <text x="-12" y="{base_y - 136}" font-size="10" fill="{APOLLO_TEXT_MUTED}" text-anchor="end">400</text>
      <text x="-12" y="{base_y - 206}" font-size="10" fill="{APOLLO_TEXT_MUTED}" text-anchor="end">600</text>
    '''
    for i, (name, val, pct, col) in enumerate(hospitals):
        x = 50 + i * 145
        bh = int((val / max_val) * chart_h)
        by = base_y - bh
        svg_body += f'''
        <g transform="translate({x}, 0)">
          <rect x="0" y="{by}" width="90" height="{bh}" rx="4" fill="{col}" />
          <text x="45" y="{by - 10}" font-size="13" font-weight="700" fill="{APOLLO_INK}" text-anchor="middle">{val}</text>
          <text x="45" y="{by - 26}" font-size="10" font-weight="600" fill="{APOLLO_BLUE}" text-anchor="middle">({pct}%)</text>
          <text x="45" y="{base_y + 18}" font-size="11" font-weight="600" fill="{APOLLO_INK}" text-anchor="middle">{name.replace("Apollo ", "")}</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q02: Hospital Admission Volume Ranking", "Ranked patient admissions and percentage volume share by facility")

def generate_q03():
    # Top 5 Departments Lollipop Chart
    depts = [
        ("Apollo Hyderabad Orthopedics", 137, APOLLO_ORANGE),
        ("Apollo Hyderabad General Medicine", 135, APOLLO_BLUE),
        ("Apollo Delhi General Medicine", 134, APOLLO_BLUE),
        ("Apollo Delhi Orthopedics", 130, APOLLO_BLUE),
        ("Apollo Mumbai Cardiology", 129, APOLLO_BLUE),
    ]
    svg_body = '<g transform="translate(40, 80)">'
    for i, (name, val, col) in enumerate(depts):
        y = i * 48
        w = int((val / 150) * 440)
        svg_body += f'''
        <g transform="translate(0, {y})">
          <text x="210" y="16" font-size="11.5" font-weight="600" fill="{APOLLO_INK}" text-anchor="end">{name}</text>
          <line x1="225" y1="12" x2="{225 + w}" y2="12" stroke="{col}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="{225 + w}" cy="12" r="9" fill="{col}"/>
          <text x="{225 + w}" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">{val}</text>
          <text x="{245 + w}" y="16" font-size="10" font-weight="600" fill="{APOLLO_TEXT_MUTED}">admissions</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q03: Top 5 Busiest Departments", "Highest volume clinical specialties across all network facilities")

def generate_q04():
    # Waiting-Time Distribution Histogram & Severity Zones
    bins = [
        ("0-29m", "Low", 420, APOLLO_GREEN),
        ("30-59m", "Moderate", 890, APOLLO_BLUE),
        ("60-89m", "High", 710, APOLLO_ORANGE),
        ("90-119m", "Critical", 360, APOLLO_RED),
        ("120m+", "Severe Spikes", 120, "#991b1b"),
    ]
    base_y = 300
    svg_body = f'''
    <g transform="translate(60, 0)">
      <line x1="0" y1="{base_y}" x2="640" y2="{base_y}" stroke="{APOLLO_BORDER}" stroke-width="1"/>
      <rect x="360" y="80" width="280" height="{base_y - 80}" fill="{APOLLO_CREAM}" opacity="0.6"/>
      <text x="500" y="100" font-size="10" font-weight="700" fill="{APOLLO_ORANGE}" text-anchor="middle">PRIORITY INTERVENTION ZONE (≥60m)</text>
    '''
    for i, (label, tier, count, col) in enumerate(bins):
        x = 40 + i * 120
        bh = int((count / 1000) * 190)
        by = base_y - bh
        svg_body += f'''
        <g transform="translate({x}, 0)">
          <rect x="0" y="{by}" width="85" height="{bh}" rx="4" fill="{col}"/>
          <text x="42" y="{by - 8}" font-size="12" font-weight="700" fill="{APOLLO_INK}" text-anchor="middle">{count}</text>
          <text x="42" y="{base_y + 16}" font-size="11" font-weight="600" fill="{APOLLO_INK}" text-anchor="middle">{label}</text>
          <text x="42" y="{base_y + 30}" font-size="9" fill="{APOLLO_TEXT_MUTED}" text-anchor="middle">{tier}</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q04: Patient Waiting-Time Distribution", "Histogram of triage-to-physician wait times with clinical severity thresholds")

def generate_q05():
    # 100% Stacked Bar of Triage Classifications
    facilities = [
        ("Apollo Delhi Emergency", 8, 14, 45, 33),
        ("Apollo Mumbai Emergency", 7, 16, 44, 33),
        ("Apollo Bangalore Emergency", 5, 12, 46, 37),
        ("Apollo Hyderabad Emergency", 9, 15, 43, 33),
        ("Network Non-Emergency Wards", 38, 48, 14, 0),
    ]
    svg_body = '<g transform="translate(40, 85)">'
    # Legend
    svg_body += f'''
    <g transform="translate(180, 0)">
      <rect x="0" y="0" width="12" height="12" fill="{APOLLO_GREEN}" rx="2"/>
      <text x="18" y="10" font-size="10" fill="{APOLLO_INK}">Low (&lt;30m)</text>
      <rect x="110" y="0" width="12" height="12" fill="{APOLLO_BLUE}" rx="2"/>
      <text x="128" y="10" font-size="10" fill="{APOLLO_INK}">Moderate (30-59m)</text>
      <rect x="250" y="0" width="12" height="12" fill="{APOLLO_ORANGE}" rx="2"/>
      <text x="268" y="10" font-size="10" fill="{APOLLO_INK}">High (60-119m)</text>
      <rect x="380" y="0" width="12" height="12" fill="{APOLLO_RED}" rx="2"/>
      <text x="398" y="10" font-size="10" fill="{APOLLO_INK}">Critical (≥120m)</text>
    </g>
    '''
    for i, (name, low, mod, high, crit) in enumerate(facilities):
        y = 30 + i * 46
        total_w = 460
        w_low = total_w * (low / 100)
        w_mod = total_w * (mod / 100)
        w_high = total_w * (high / 100)
        w_crit = total_w * (crit / 100)
        svg_body += f'''
        <g transform="translate(0, {y})">
          <text x="180" y="16" font-size="10.5" font-weight="600" fill="{APOLLO_INK}" text-anchor="end">{name}</text>
          <g transform="translate(195, 2)">
            <rect x="0" y="0" width="{w_low}" height="20" fill="{APOLLO_GREEN}"/>
            <rect x="{w_low}" y="0" width="{w_mod}" height="20" fill="{APOLLO_BLUE}"/>
            <rect x="{w_low + w_mod}" y="0" width="{w_high}" height="20" fill="{APOLLO_ORANGE}"/>
            <rect x="{w_low + w_mod + w_high}" y="0" width="{w_crit}" height="20" fill="{APOLLO_RED}"/>
          </g>
          <text x="665" y="16" font-size="10" font-weight="700" fill="{APOLLO_RED}">{crit}% Crit</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q05: Waiting-Time Classification Proportions", "100% stacked bar comparison of triage severity tiers across emergency and inpatient units")

def generate_q06():
    # Length of Stay Box Plot / Whisker Distribution
    specialties = [
        ("General Medicine", 1.0, 2.5, 4.2, 5.8, 7.8, APOLLO_BLUE),
        ("Orthopedics", 2.0, 3.2, 5.1, 6.5, 8.0, APOLLO_ORANGE),
        ("Cardiology", 1.5, 3.0, 4.6, 6.0, 7.5, APOLLO_BLUE),
        ("Neurology", 2.0, 3.8, 5.4, 6.8, 8.0, APOLLO_INK),
        ("Emergency (Obs)", 0.5, 1.0, 1.8, 2.8, 4.0, APOLLO_GREEN),
    ]
    svg_body = '<g transform="translate(60, 80)">'
    # Scale: 0 to 10 days = 480px width
    base_x = 180
    scale = 48
    svg_body += f'''
    <!-- Scale Axis -->
    <line x1="{base_x}" y1="230" x2="{base_x + 480}" y2="230" stroke="{APOLLO_BORDER}" stroke-width="1"/>
    <text x="{base_x}" y="246" font-size="10" fill="{APOLLO_TEXT_MUTED}" text-anchor="middle">0d</text>
    <text x="{base_x + 96}" y="246" font-size="10" fill="{APOLLO_TEXT_MUTED}" text-anchor="middle">2d</text>
    <text x="{base_x + 192}" y="246" font-size="10" fill="{APOLLO_TEXT_MUTED}" text-anchor="middle">4d</text>
    <text x="{base_x + 288}" y="246" font-size="10" fill="{APOLLO_TEXT_MUTED}" text-anchor="middle">6d</text>
    <text x="{base_x + 384}" y="246" font-size="10" fill="{APOLLO_TEXT_MUTED}" text-anchor="middle">8d</text>
    <text x="{base_x + 480}" y="246" font-size="10" fill="{APOLLO_TEXT_MUTED}" text-anchor="middle">10d</text>
    '''
    for i, (name, pmin, q1, med, q3, pmax, col) in enumerate(specialties):
        y = i * 44 + 10
        x_min = base_x + pmin * scale
        x_q1 = base_x + q1 * scale
        x_med = base_x + med * scale
        x_q3 = base_x + q3 * scale
        x_max = base_x + pmax * scale
        box_w = x_q3 - x_q1
        svg_body += f'''
        <g transform="translate(0, {y})">
          <text x="165" y="16" font-size="11" font-weight="600" fill="{APOLLO_INK}" text-anchor="end">{name}</text>
          <!-- Whiskers -->
          <line x1="{x_min}" y1="12" x2="{x_max}" y2="12" stroke="{col}" stroke-width="1.5"/>
          <line x1="{x_min}" y1="6" x2="{x_min}" y2="18" stroke="{col}" stroke-width="1.5"/>
          <line x1="{x_max}" y1="6" x2="{x_max}" y2="18" stroke="{col}" stroke-width="1.5"/>
          <!-- Box (Q1 to Q3) -->
          <rect x="{x_q1}" y="2" width="{box_w}" height="20" rx="3" fill="{APOLLO_BLUE_SOFT}" stroke="{col}" stroke-width="1.5"/>
          <!-- Median -->
          <line x1="{x_med}" y1="2" x2="{x_med}" y2="22" stroke="{col}" stroke-width="2.5"/>
          <text x="{x_med}" y="-2" font-size="9.5" font-weight="700" fill="{col}" text-anchor="middle">{med}d</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q06: Length of Stay (LOS) Distributions", "Box plot representation showing median, interquartile ranges, and variance by clinical department")

def generate_q07():
    # 30-Day Readmission Heatmap Matrix
    rows = ["Emergency", "Cardiology", "Orthopedics", "General Medicine", "Neurology"]
    cols = ["Apollo Delhi", "Apollo Mumbai", "Apollo Bangalore", "Apollo Hyderabad"]
    matrix = [
        [37.2, 38.1, 41.3, 36.8], # Emergency
        [32.4, 34.0, 31.8, 33.2], # Cardiology
        [28.5, 29.1, 27.8, 30.4], # Ortho
        [29.8, 31.2, 30.5, 32.0], # GenMed
        [26.4, 27.5, 28.0, 26.9], # Neuro
    ]
    svg_body = '<g transform="translate(50, 75)">'
    # Column headers
    for j, cname in enumerate(cols):
        svg_body += f'<text x="{220 + j * 125}" y="20" font-size="11" font-weight="700" fill="{APOLLO_INK}" text-anchor="middle">{cname.replace("Apollo ", "")}</text>'

    for i, rname in enumerate(rows):
        y = 35 + i * 44
        svg_body += f'<text x="145" y="{y + 24}" font-size="11" font-weight="600" fill="{APOLLO_INK}" text-anchor="end">{rname}</text>'
        for j in range(len(cols)):
            val = matrix[i][j]
            x = 160 + j * 125
            # Heat color based on readmission rate
            if val >= 38.0:
                bg = APOLLO_RED
                txt = "#ffffff"
            elif val >= 32.0:
                bg = APOLLO_ORANGE
                txt = "#ffffff"
            elif val >= 29.0:
                bg = APOLLO_BLUE_SOFT
                txt = APOLLO_INK
            else:
                bg = APOLLO_GREEN_SOFT
                txt = APOLLO_INK

            svg_body += f'''
            <g transform="translate({x}, {y})">
              <rect width="115" height="38" rx="4" fill="{bg}"/>
              <text x="57" y="24" font-size="12" font-weight="700" fill="{txt}" text-anchor="middle">{val}%</text>
            </g>
            '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q07: 30-Day Readmission Heatmap Matrix", "Facility-by-specialty readmission intensity matrix highlighting Emergency recurrence")

def generate_q08():
    # Frequency Distribution of Admissions per Patient
    dist = [
        ("1 Admission", 120, 24.0, APOLLO_BLUE_SOFT),
        ("2-3 Admissions", 185, 37.0, APOLLO_BLUE),
        ("4-6 Admissions", 140, 28.0, APOLLO_BLUE),
        ("7-9 Admissions", 42, 8.4, APOLLO_ORANGE),
        ("10+ Admissions", 13, 2.6, APOLLO_RED),
    ]
    base_y = 290
    svg_body = f'''
    <g transform="translate(60, 0)">
      <line x1="0" y1="{base_y}" x2="640" y2="{base_y}" stroke="{APOLLO_BORDER}" stroke-width="1"/>
      <text x="320" y="85" font-size="11" font-weight="600" fill="{APOLLO_TEXT_MUTED}" text-anchor="middle">500 Total Synthetic Patient Cohorts Analyzed</text>
    '''
    for i, (label, count, pct, col) in enumerate(dist):
        x = 40 + i * 125
        bh = int((count / 200) * 170)
        by = base_y - bh
        txt_col = APOLLO_INK if col == APOLLO_BLUE_SOFT else "#ffffff"
        svg_body += f'''
        <g transform="translate({x}, 0)">
          <rect x="0" y="{by}" width="95" height="{bh}" rx="4" fill="{col}"/>
          <text x="47" y="{by - 8}" font-size="12" font-weight="700" fill="{APOLLO_INK}" text-anchor="middle">{count} pts</text>
          <text x="47" y="{base_y + 16}" font-size="10.5" font-weight="600" fill="{APOLLO_INK}" text-anchor="middle">{label}</text>
          <text x="47" y="{base_y + 30}" font-size="9.5" fill="{APOLLO_BLUE}" text-anchor="middle">{pct}% cohort</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q08: Frequent Repeat Patient Super-Utilizers", "Distribution of admissions per unique patient identifying heavy healthcare utilizer cohorts")

def generate_q09():
    # Bed Utilization Bullet Charts with Warning Thresholds
    wards = [
        ("Apollo Delhi Emergency", 88.5, 45, APOLLO_RED),
        ("Apollo Mumbai Emergency", 89.2, 50, APOLLO_RED),
        ("Apollo Bangalore Emergency", 91.4, 40, APOLLO_RED),
        ("Apollo Hyderabad Emergency", 88.0, 45, APOLLO_RED),
        ("Network General Medicine", 73.5, 170, APOLLO_BLUE),
        ("Network Cardiology Wards", 71.8, 150, APOLLO_GREEN),
    ]
    svg_body = '<g transform="translate(40, 75)">'
    # Legend
    svg_body += f'''
    <g transform="translate(180, 0)">
      <rect x="0" y="0" width="12" height="12" fill="{APOLLO_GREEN_SOFT}"/>
      <text x="18" y="10" font-size="10" fill="{APOLLO_INK}">Optimal (&lt;75%)</text>
      <rect x="130" y="0" width="12" height="12" fill="{APOLLO_CREAM}"/>
      <text x="148" y="10" font-size="10" fill="{APOLLO_INK}">Warning (75-90%)</text>
      <rect x="270" y="0" width="12" height="12" fill="#fee2e2"/>
      <text x="288" y="10" font-size="10" fill="{APOLLO_INK}">Critical (&gt;90%)</text>
    </g>
    '''
    for i, (name, util, beds, col) in enumerate(wards):
        y = 25 + i * 40
        w_bar = int((util / 100) * 440)
        svg_body += f'''
        <g transform="translate(0, {y})">
          <text x="175" y="16" font-size="10.5" font-weight="600" fill="{APOLLO_INK}" text-anchor="end">{name}</text>
          <g transform="translate(190, 4)">
            <!-- Threshold backgrounds -->
            <rect x="0" y="0" width="330" height="16" fill="{APOLLO_GREEN_SOFT}" rx="2"/>
            <rect x="330" y="0" width="66" height="16" fill="{APOLLO_CREAM}"/>
            <rect x="396" y="0" width="44" height="16" fill="#fee2e2"/>
            <!-- Active utilization bar -->
            <rect x="0" y="3" width="{w_bar}" height="10" fill="{col}" rx="2"/>
            <!-- Target line 85% -->
            <line x1="374" y1="-2" x2="374" y2="18" stroke="{APOLLO_INK}" stroke-width="2" stroke-dasharray="2,2"/>
          </g>
          <text x="645" y="16" font-size="11" font-weight="700" fill="{col}">{util}%</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q09: Bed Utilization Rate vs Capacity Thresholds", "Bullet chart tracking inpatient bed strain against operational 75% warning and 90% critical limits")

def generate_q10():
    # Sankey Flow diagram
    svg_body = f'''
    <g transform="translate(40, 75)">
      <!-- Left Column: 4 Hospitals -->
      <g transform="translate(0, 20)">
        <rect x="0" y="0" width="130" height="50" rx="4" fill="{APOLLO_INK}"/>
        <text x="65" y="24" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">Apollo Hyderabad</text>
        <text x="65" y="40" font-size="9" fill="{APOLLO_BLUE_SOFT}" text-anchor="middle">654 admissions</text>

        <rect x="0" y="60" width="130" height="50" rx="4" fill="{APOLLO_BLUE}"/>
        <text x="65" y="84" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">Apollo Mumbai</text>
        <text x="65" y="100" font-size="9" fill="{APOLLO_BLUE_SOFT}" text-anchor="middle">631 admissions</text>

        <rect x="0" y="120" width="130" height="50" rx="4" fill="#0284c7"/>
        <text x="65" y="144" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">Apollo Delhi</text>
        <text x="65" y="160" font-size="9" fill="{APOLLO_BLUE_SOFT}" text-anchor="middle">630 admissions</text>

        <rect x="0" y="180" width="130" height="50" rx="4" fill="#38bdf8"/>
        <text x="65" y="204" font-size="11" font-weight="700" fill="{APOLLO_INK}" text-anchor="middle">Apollo Bangalore</text>
        <text x="65" y="220" font-size="9" fill="{APOLLO_INK}" text-anchor="middle">585 admissions</text>
      </g>

      <!-- Center Flow Connectors -->
      <path d="M 130 45 C 230 45, 230 80, 310 80" fill="none" stroke="{APOLLO_BLUE_SOFT}" stroke-width="24" opacity="0.7"/>
      <path d="M 130 105 C 230 105, 230 140, 310 140" fill="none" stroke="{APOLLO_BLUE_SOFT}" stroke-width="22" opacity="0.7"/>
      <path d="M 130 165 C 230 165, 230 200, 310 200" fill="none" stroke="{APOLLO_BLUE_SOFT}" stroke-width="22" opacity="0.7"/>

      <!-- Center Column: Specialties -->
      <g transform="translate(310, 20)">
        <rect x="0" y="0" width="140" height="42" rx="4" fill="{APOLLO_ORANGE}"/>
        <text x="70" y="20" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">Emergency</text>
        <text x="70" y="34" font-size="8.5" fill="#ffffff" text-anchor="middle">512 pts (High Latency)</text>

        <rect x="0" y="52" width="140" height="42" rx="4" fill="{APOLLO_BLUE}"/>
        <text x="70" y="72" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">General Medicine</text>
        <text x="70" y="86" font-size="8.5" fill="#ffffff" text-anchor="middle">525 pts</text>

        <rect x="0" y="104" width="140" height="42" rx="4" fill="{APOLLO_BLUE}"/>
        <text x="70" y="124" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">Orthopedics</text>
        <text x="70" y="138" font-size="8.5" fill="#ffffff" text-anchor="middle">508 pts</text>

        <rect x="0" y="156" width="140" height="42" rx="4" fill="{APOLLO_BLUE}"/>
        <text x="70" y="176" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">Cardiology</text>
        <text x="70" y="190" font-size="8.5" fill="#ffffff" text-anchor="middle">485 pts</text>

        <rect x="0" y="208" width="140" height="42" rx="4" fill="{APOLLO_INK}"/>
        <text x="70" y="228" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">Neurology</text>
        <text x="70" y="242" font-size="8.5" fill="#ffffff" text-anchor="middle">470 pts</text>
      </g>

      <!-- Right Column: Discharge Status -->
      <g transform="translate(560, 45)">
        <rect x="0" y="0" width="130" height="45" rx="4" fill="{APOLLO_GREEN}"/>
        <text x="65" y="22" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">Discharged</text>
        <text x="65" y="36" font-size="8.5" fill="#ffffff" text-anchor="middle">1,620 (64.8%)</text>

        <rect x="0" y="55" width="130" height="45" rx="4" fill="{APOLLO_ORANGE}"/>
        <text x="65" y="77" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">Readmitted (30d)</text>
        <text x="65" y="91" font-size="8.5" fill="#ffffff" text-anchor="middle">815 (32.6%)</text>

        <rect x="0" y="110" width="130" height="45" rx="4" fill="{APOLLO_TEXT_MUTED}"/>
        <text x="65" y="132" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">Transferred</text>
        <text x="65" y="146" font-size="8.5" fill="#ffffff" text-anchor="middle">65 (2.6%)</text>
      </g>
    </g>
    '''
    return wrap_svg(780, 400, svg_body, "Q10: Network Patient Flow Topology", "Multi-table flow diagram linking facilities, clinical specialties, and discharge outcomes")

def generate_q11():
    # Diverging Deviation Bar Chart Above / Below Network Average (62.81m)
    depts = [
        ("Bangalore Emergency", 43.9, APOLLO_RED),
        ("Mumbai Emergency", 39.5, APOLLO_RED),
        ("Delhi Emergency", 38.1, APOLLO_RED),
        ("Hyderabad Emergency", 36.8, APOLLO_RED),
        ("Delhi Cardiology", -12.4, APOLLO_GREEN),
        ("Mumbai Orthopedics", -18.2, APOLLO_GREEN),
        ("Hyderabad General Med", -24.5, APOLLO_GREEN),
        ("Bangalore Neurology", -31.2, APOLLO_GREEN),
    ]
    center_x = 420
    scale = 6.0
    svg_body = f'''
    <g transform="translate(40, 80)">
      <!-- Baseline Axis -->
      <line x1="{center_x}" y1="0" x2="{center_x}" y2="240" stroke="{APOLLO_INK}" stroke-width="2"/>
      <text x="{center_x}" y="-8" font-size="10" font-weight="700" fill="{APOLLO_INK}" text-anchor="middle">Baseline: 62.81m</text>
    '''
    for i, (name, diff, col) in enumerate(depts):
        y = i * 28 + 10
        w = int(abs(diff) * scale)
        if diff > 0:
            bx = center_x
            tx = center_x + w + 8
            anchor = "start"
        else:
            bx = center_x - w
            tx = center_x - w - 8
            anchor = "end"

        svg_body += f'''
        <g transform="translate(0, {y})">
          <text x="210" y="14" font-size="10.5" font-weight="600" fill="{APOLLO_INK}" text-anchor="end">{name}</text>
          <rect x="{bx}" y="2" width="{w}" height="16" fill="{col}" rx="2"/>
          <text x="{tx}" y="14" font-size="10" font-weight="700" fill="{col}" text-anchor="{anchor}">{'+' if diff > 0 else ''}{diff:.1f}m</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q11: Waiting Time Deviation Above Network Baseline", "Diverging delta chart measuring department latency variance against the 62.81-minute global mean")

def generate_q12():
    # Four-Quadrant Bubble Matrix
    # X: Admissions Volume (100 to 150) -> 60 to 600px
    # Y: Average Wait Minutes (20 to 120m) -> 260 to 40px
    svg_body = f'''
    <g transform="translate(60, 60)">
      <!-- Quadrants -->
      <rect x="60" y="20" width="280" height="120" fill="{APOLLO_CREAM}" opacity="0.4"/>
      <rect x="340" y="20" width="280" height="120" fill="#fee2e2" opacity="0.5"/>
      <rect x="60" y="140" width="280" height="120" fill="{APOLLO_GREEN_SOFT}" opacity="0.4"/>
      <rect x="340" y="140" width="280" height="120" fill="{APOLLO_BLUE_SOFT}" opacity="0.4"/>

      <!-- Crosshairs -->
      <line x1="340" y1="20" x2="340" y2="260" stroke="{APOLLO_BORDER}" stroke-width="1.5" stroke-dasharray="4,4"/>
      <line x1="60" y1="140" x2="620" y2="140" stroke="{APOLLO_BORDER}" stroke-width="1.5" stroke-dasharray="4,4"/>

      <text x="345" y="32" font-size="9.5" font-weight="700" fill="{APOLLO_RED}">CRITICAL ATTENTION (High Vol + High Wait)</text>
      <text x="70" y="250" font-size="9.5" font-weight="700" fill="{APOLLO_GREEN}">OPTIMAL EFFICIENCY (Low Vol + Low Wait)</text>

      <!-- Bubbles -->
      <!-- Emergencies (High Wait, Moderate Volume) -->
      <circle cx="280" cy="50" r="18" fill="{APOLLO_RED}" opacity="0.85"/>
      <text x="280" y="54" font-size="9" font-weight="700" fill="#ffffff" text-anchor="middle">BLR Emg</text>

      <circle cx="320" cy="58" r="18" fill="{APOLLO_RED}" opacity="0.85"/>
      <text x="320" y="62" font-size="9" font-weight="700" fill="#ffffff" text-anchor="middle">MUM Emg</text>

      <circle cx="310" cy="65" r="17" fill="{APOLLO_RED}" opacity="0.85"/>
      <text x="310" y="69" font-size="9" font-weight="700" fill="#ffffff" text-anchor="middle">DEL Emg</text>

      <!-- Orthopedics (High Volume, Low Wait) -->
      <circle cx="560" cy="200" r="16" fill="{APOLLO_BLUE}" opacity="0.85"/>
      <text x="560" y="204" font-size="9" font-weight="700" fill="#ffffff" text-anchor="middle">HYD Ortho</text>

      <!-- General Medicine (High Volume, Moderate Wait) -->
      <circle cx="530" cy="180" r="15" fill="{APOLLO_BLUE}" opacity="0.85"/>
      <text x="530" y="184" font-size="9" font-weight="700" fill="#ffffff" text-anchor="middle">DEL Med</text>

      <!-- Axis labels -->
      <text x="340" y="285" font-size="10" font-weight="600" fill="{APOLLO_INK}" text-anchor="middle">Patient Admission Volume →</text>
      <text x="30" y="140" font-size="10" font-weight="600" fill="{APOLLO_INK}" text-anchor="middle" transform="rotate(-90 30 140)">Wait Time (mins) →</text>
    </g>
    '''
    return wrap_svg(780, 400, svg_body, "Q12: Operational Attention Quadrant Matrix", "Multi-variable quadrant plotting patient volume, triage latency, and readmission severity")

def generate_q13():
    # Bump Chart / Rank Trajectory
    svg_body = f'''
    <g transform="translate(60, 75)">
      <!-- Columns -->
      <text x="140" y="10" font-size="11" font-weight="700" fill="{APOLLO_INK}" text-anchor="middle">Volume Rank</text>
      <text x="340" y="10" font-size="11" font-weight="700" fill="{APOLLO_INK}" text-anchor="middle">Wait Time Rank</text>
      <text x="540" y="10" font-size="11" font-weight="700" fill="{APOLLO_INK}" text-anchor="middle">Bottleneck Rank</text>

      <!-- Lines & Points -->
      <!-- Bangalore Emergency: Vol #12 -> Wait #1 -> Bottleneck #1 -->
      <path d="M 140 180 C 240 180, 240 40, 340 40 C 440 40, 440 40, 540 40" fill="none" stroke="{APOLLO_RED}" stroke-width="4"/>
      <circle cx="140" cy="180" r="7" fill="{APOLLO_RED}"/><text x="140" y="184" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">12</text>
      <circle cx="340" cy="40" r="7" fill="{APOLLO_RED}"/><text x="340" y="44" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">1</text>
      <circle cx="540" cy="40" r="7" fill="{APOLLO_RED}"/><text x="540" y="44" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">1</text>
      <text x="560" y="44" font-size="10.5" font-weight="700" fill="{APOLLO_RED}">BLR Emergency (#1 Strain)</text>

      <!-- Mumbai Emergency: Vol #10 -> Wait #2 -> Bottleneck #2 -->
      <path d="M 140 150 C 240 150, 240 70, 340 70 C 440 70, 440 70, 540 70" fill="none" stroke="{APOLLO_ORANGE}" stroke-width="3"/>
      <circle cx="140" cy="150" r="6" fill="{APOLLO_ORANGE}"/>
      <circle cx="340" cy="70" r="6" fill="{APOLLO_ORANGE}"/>
      <circle cx="540" cy="70" r="6" fill="{APOLLO_ORANGE}"/>
      <text x="560" y="74" font-size="10.5" font-weight="600" fill="{APOLLO_ORANGE}">MUM Emergency (#2)</text>

      <!-- Hyderabad Ortho: Vol #1 -> Wait #16 -> Bottleneck #14 -->
      <path d="M 140 40 C 240 40, 240 200, 340 200 C 440 200, 440 180, 540 180" fill="none" stroke="{APOLLO_BLUE}" stroke-width="3"/>
      <circle cx="140" cy="40" r="6" fill="{APOLLO_BLUE}"/><text x="140" y="44" font-size="8" font-weight="700" fill="#fff" text-anchor="middle">1</text>
      <circle cx="340" cy="200" r="6" fill="{APOLLO_BLUE}"/>
      <circle cx="540" cy="180" r="6" fill="{APOLLO_BLUE}"/>
      <text x="560" y="184" font-size="10.5" font-weight="600" fill="{APOLLO_BLUE}">HYD Ortho (High Vol / Low Wait)</text>
    </g>
    '''
    return wrap_svg(780, 400, svg_body, "Q13: Multi-Metric Rank Shift Trajectory", "Bump chart tracking operational rank transitions across volume, latency, and composite bottleneck severity")

def generate_q14():
    # 4-Factor Composite Bottleneck Score Decomposition
    departments = [
        ("Apollo Bangalore Emergency", 24.5, 23.8, 24.2, 23.0, 95.5, "Critical"),
        ("Apollo Mumbai Emergency", 23.8, 22.5, 23.5, 22.8, 92.6, "Critical"),
        ("Apollo Delhi Emergency", 23.0, 21.8, 22.9, 22.4, 90.1, "Critical"),
        ("Apollo Hyderabad Emergency", 22.5, 21.0, 22.0, 22.2, 87.7, "Critical"),
        ("Apollo Delhi Cardiology", 12.0, 16.5, 15.2, 17.5, 61.2, "Moderate"),
    ]
    svg_body = '<g transform="translate(40, 80)">'
    # Legend
    svg_body += f'''
    <g transform="translate(160, 0)">
      <rect x="0" y="0" width="10" height="10" fill="{APOLLO_RED}"/>
      <text x="14" y="9" font-size="9.5" fill="{APOLLO_INK}">Wait Time (25%)</text>
      <rect x="115" y="0" width="10" height="10" fill="{APOLLO_ORANGE}"/>
      <text x="129" y="9" font-size="9.5" fill="{APOLLO_INK}">Length of Stay (25%)</text>
      <rect x="250" y="0" width="10" height="10" fill="{APOLLO_BLUE}"/>
      <text x="264" y="9" font-size="9.5" fill="{APOLLO_INK}">Readmission (25%)</text>
      <rect x="375" y="0" width="10" height="10" fill="{APOLLO_INK}"/>
      <text x="389" y="9" font-size="9.5" fill="{APOLLO_INK}">Bed Occupancy (25%)</text>
    </g>
    '''
    for i, (name, c_wait, c_los, c_readm, c_bed, total_score, status) in enumerate(departments):
        y = 25 + i * 44
        total_w = 440
        scale = total_w / 100
        w_wait = c_wait * scale
        w_los = c_los * scale
        w_readm = c_readm * scale
        w_bed = c_bed * scale
        svg_body += f'''
        <g transform="translate(0, {y})">
          <text x="175" y="16" font-size="10.5" font-weight="600" fill="{APOLLO_INK}" text-anchor="end">{name}</text>
          <g transform="translate(190, 2)">
            <rect x="0" y="0" width="{w_wait}" height="20" fill="{APOLLO_RED}"/>
            <rect x="{w_wait}" y="0" width="{w_los}" height="20" fill="{APOLLO_ORANGE}"/>
            <rect x="{w_wait + w_los}" y="0" width="{w_readm}" height="20" fill="{APOLLO_BLUE}"/>
            <rect x="{w_wait + w_los + w_readm}" y="0" width="{w_bed}" height="20" fill="{APOLLO_INK}"/>
          </g>
          <text x="645" y="16" font-size="12" font-weight="800" fill="{APOLLO_RED if total_score > 80 else APOLLO_BLUE}">{total_score}</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q14: Multi-Factor Composite Bottleneck Score", "Decomposition of clinical bottlenecks combining wait time, stay duration, readmissions, and bed capacity")

def generate_q15():
    # SQL Latency Benchmark Dumbbell Chart
    benchmarks = [
        ("Patient Multi-Metric Ranking", 42.8, 18.2, 57.5),
        ("Department Wait Aggregation", 28.5, 12.4, 56.5),
        ("Bed Utilization Time-Series", 65.2, 26.8, 58.9),
        ("30-Day Readmission Analysis", 36.4, 15.1, 58.5),
        ("Hospital Volume Rollup", 18.0, 8.5, 52.8),
    ]
    svg_body = '<g transform="translate(40, 80)">'
    # Legend
    svg_body += f'''
    <g transform="translate(180, 0)">
      <circle cx="6" cy="6" r="5" fill="{APOLLO_ORANGE}"/>
      <text x="16" y="10" font-size="10" fill="{APOLLO_INK}">Legacy / Unindexed Subquery</text>
      <circle cx="190" cy="6" r="5" fill="{APOLLO_GREEN}"/>
      <text x="200" y="10" font-size="10" fill="{APOLLO_INK}">Optimized CTE &amp; Composite Index</text>
    </g>
    '''
    # Scale: 0 to 70ms = 400px
    scale = 5.7
    base_x = 210
    for i, (name, leg_ms, opt_ms, red) in enumerate(benchmarks):
        y = 30 + i * 44
        x_opt = base_x + int(opt_ms * scale)
        x_leg = base_x + int(leg_ms * scale)
        svg_body += f'''
        <g transform="translate(0, {y})">
          <text x="195" y="14" font-size="10.5" font-weight="600" fill="{APOLLO_INK}" text-anchor="end">{name}</text>
          <line x1="{x_opt}" y1="10" x2="{x_leg}" y2="10" stroke="{APOLLO_BORDER}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="{x_opt}" cy="10" r="7" fill="{APOLLO_GREEN}"/>
          <text x="{x_opt}" y="28" font-size="9" font-weight="700" fill="{APOLLO_GREEN}" text-anchor="middle">{opt_ms}ms</text>
          <circle cx="{x_leg}" cy="10" r="7" fill="{APOLLO_ORANGE}"/>
          <text x="{x_leg}" y="28" font-size="9" font-weight="700" fill="{APOLLO_ORANGE}" text-anchor="middle">{leg_ms}ms</text>
          <text x="635" y="14" font-size="10.5" font-weight="800" fill="{APOLLO_GREEN}">-{red:.1f}%</text>
        </g>
        '''
    svg_body += '</g>'
    return wrap_svg(780, 400, svg_body, "Q15: SQL Execution Latency Optimization Benchmark", "Dumbbell chart comparing execution times between unindexed subqueries and optimized CTE architectures")

def generate_all_charts():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Generating Apollo Hospitals Clinical Analytics Charts (Q01 - Q15)...")

    generators = [
        ("q01.svg", generate_q01),
        ("q02.svg", generate_q02),
        ("q03.svg", generate_q03),
        ("q04.svg", generate_q04),
        ("q05.svg", generate_q05),
        ("q06.svg", generate_q06),
        ("q07.svg", generate_q07),
        ("q08.svg", generate_q08),
        ("q09.svg", generate_q09),
        ("q10.svg", generate_q10),
        ("q11.svg", generate_q11),
        ("q12.svg", generate_q12),
        ("q13.svg", generate_q13),
        ("q14.svg", generate_q14),
        ("q15.svg", generate_q15),
    ]

    for fname, gen_func in generators:
        svg_content = gen_func()
        file_path = os.path.join(OUTPUT_DIR, fname)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        print(f"✓ Generated {fname}")

    print(f"All 15 vector charts successfully written to {OUTPUT_DIR}")

if __name__ == "__main__":
    generate_all_charts()
