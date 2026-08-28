"""
Apollo Hospitals Patient Flow Analytics
chart_theme.py — Apollo Clinical Design Tokens & Matplotlib/Seaborn Theme Configurator
"""

import matplotlib as mpl
import matplotlib.pyplot as plt
import seaborn as sns

# Apollo Clinical Design Tokens
APOLLO_COLORS = {
    "ink": "#002d39",          # Deep teal for typography and primary outlines
    "blue": "#007c9d",         # Apollo primary brand blue
    "blue_soft": "#def4fa",    # Soft cyan tint for active highlights
    "orange": "#f58320",       # Apollo accent orange for bottlenecks/warnings
    "yellow": "#fcd34d",       # Amber warning
    "cream": "#fff8e6",        # Cream alert background
    "green": "#10b981",        # Healthy clinical target green
    "green_soft": "#e3f8ec",   # Soft green background tint
    "rose": "#e11d48",         # Critical severity red
    "surface": "#ffffff",      # Card surface
    "page": "#f7fbfc",         # Page background
    "border": "#d7e7eb",       # Cool-teal border
    "grid": "#eef4f6",         # Light neutral grid line
    "text_muted": "#527983",   # Muted teal label text
}

# Categorical palette for hospitals & departments
HOSPITAL_COLORS = {
    "Apollo Delhi": "#007c9d",
    "Apollo Mumbai": "#0284c7",
    "Apollo Bangalore": "#38bdf8",
    "Apollo Hyderabad": "#002d39",
}

SEVERITY_COLORS = {
    "Low": "#10b981",
    "Moderate": "#007c9d",
    "High": "#f58320",
    "Critical": "#e11d48"
}

def set_apollo_theme():
    """
    Applies the Apollo clinical aesthetic globally across Matplotlib and Seaborn.
    """
    mpl.use("Agg")  # Non-interactive headless backend
    
    # Configure rcParams
    plt.rcParams["figure.facecolor"] = APOLLO_COLORS["surface"]
    plt.rcParams["axes.facecolor"] = APOLLO_COLORS["surface"]
    plt.rcParams["axes.edgecolor"] = APOLLO_COLORS["border"]
    plt.rcParams["axes.linewidth"] = 1.0
    plt.rcParams["grid.color"] = APOLLO_COLORS["grid"]
    plt.rcParams["grid.linestyle"] = "--"
    plt.rcParams["grid.alpha"] = 0.8
    plt.rcParams["text.color"] = APOLLO_COLORS["ink"]
    plt.rcParams["axes.labelcolor"] = APOLLO_COLORS["ink"]
    plt.rcParams["xtick.color"] = APOLLO_COLORS["text_muted"]
    plt.rcParams["ytick.color"] = APOLLO_COLORS["text_muted"]
    plt.rcParams["font.sans-serif"] = ["Figtree", "Plus Jakarta Sans", "DejaVu Sans", "Arial", "sans-serif"]
    plt.rcParams["font.family"] = "sans-serif"
    plt.rcParams["font.size"] = 10
    plt.rcParams["axes.titlesize"] = 13
    plt.rcParams["axes.titleweight"] = "bold"
    plt.rcParams["axes.labelsize"] = 10
    plt.rcParams["axes.labelweight"] = "medium"
    plt.rcParams["figure.dpi"] = 150
    plt.rcParams["savefig.dpi"] = 300
    plt.rcParams["savefig.bbox"] = "tight"
    plt.rcParams["savefig.pad_inches"] = 0.2

    # Seaborn palette
    sns.set_theme(
        style="whitegrid",
        rc={
            "axes.facecolor": APOLLO_COLORS["surface"],
            "grid.color": APOLLO_COLORS["grid"],
            "grid.linestyle": "--",
        }
    )

def add_chart_footer(fig, question_num: int, scope: str = "Apollo Network (4 Facilities, 2,500 Admissions)", period: str = "Jan 2024 - Dec 2024"):
    """
    Appends the standard Apollo portfolio snapshot watermark and metadata footer.
    """
    footer_text = f"Question {question_num:02d} | Scope: {scope} | Period: {period}\nNetwork-wide analytical snapshot — generated from complete dataset | Portfolio Demo"
    fig.text(
        0.02, 0.01, footer_text,
        fontsize=7.5, color=APOLLO_COLORS["text_muted"],
        ha="left", va="bottom", style="italic"
    )
