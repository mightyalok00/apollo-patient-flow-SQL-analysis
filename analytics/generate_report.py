"""
Apollo Hospitals Patient Flow Analytics
generate_report.py — Executive Analytical PDF Report Generator
Compiles the comprehensive executive report to public/reports/apollo-patient-flow-analysis.pdf
"""

import os
import zlib

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "reports")
os.makedirs(OUT_DIR, exist_ok=True)
PDF_PATH = os.path.join(OUT_DIR, "apollo-patient-flow-analysis.pdf")

def create_pdf():
    print("Compiling Apollo Hospitals Executive Patient Flow Analysis PDF...")
    
    # Minimal standard PDF stream generator
    lines = [
        "APOLLO HOSPITALS -- PATIENT FLOW PERFORMANCE & CAPACITY ANALYSIS",
        "Executive Clinical Operations & Database Analytics Report (Jan 2024 - Dec 2024)",
        "Scope: 4 Network Facilities | 20 Clinical Units | 500 Patients | 2,500 Inpatient Events",
        "--------------------------------------------------------------------------------",
        "",
        "1. EXECUTIVE SUMMARY & STRATEGIC PROBLEM STATEMENT",
        "Emergency departments across Apollo Hyderabad, Mumbai, Delhi, and Bangalore are experiencing",
        "significant patient flow friction. Average emergency wait times reach 108.4 minutes compared",
        "to a general specialty baseline of 34.6 minutes, representing a +213% latency increase.",
        "Emergency bed utilization sits at 91.2% (exceeding the 85% clinical safety threshold),",
        "while 30-day readmissions average 38.6%, creating a self-reinforcing bed bottleneck loop.",
        "",
        "2. KEY EMPIRICAL FINDINGS (15-QUERY SYNTHESIS)",
        " - Q1 Schema Integrity: 6 relational tables with 10,424 records fully cross-verified.",
        " - Q2 Volume Distribution: Hyderabad (654 admissions / 26.2%), Mumbai (631 / 25.2%),",
        "   Delhi (630 / 25.2%), Bangalore (585 / 23.4%).",
        " - Q3 Department Workload: Orthopedics (Hyd: 137) and General Medicine (Hyd: 135) lead volume.",
        " - Q4 Latency Profile: Emergency mean wait is 108.4m (min 75m, max 140m).",
        " - Q5 Severity Tiering: 38.0% of all Emergency admissions fall into the Critical (>=120m) tier.",
        " - Q6 Length of Stay: Neurology (5.2 days) and Orthopedics (4.8 days) consume highest bed days.",
        " - Q7 Quality Compliance: Network 30-day readmission rate is 32.4%, peaking in Emergency at 38.6%.",
        " - Q8 Patient Recurrence: Top 5% super-utilizers (>=8 visits) generate 16.4% of total bed demand.",
        " - Q9 Capacity Pressure: Emergency bed utilization is 91.2% (>90% Critical SLA trigger).",
        " - Q10 Multi-Stage Flow: High-volume inflows funnel disproportionately into constrained units.",
        " - Q11 Baseline Deviations: Emergency units exceed network mean (49.3m) by up to +59.1 minutes.",
        " - Q12 Risk Quadrant: Emergency and Acute Cardiology sit in High-Wait + High-Readmission zone.",
        " - Q13 Rank Shift Trajectory: Emergency units consistently occupy Rank #1 across all 3 strain metrics.",
        " - Q14 Composite Bottleneck Scoring (0-100):",
        "     1. Apollo Hyderabad Emergency: 94.2 / 100 (Critical)",
        "     2. Apollo Mumbai Emergency:    92.8 / 100 (Critical)",
        "     3. Apollo Delhi Emergency:     91.5 / 100 (Critical)",
        "     4. Apollo Bangalore Emergency: 89.4 / 100 (High Risk)",
        " - Q15 SQL Performance Benchmark: Query latency reduced by 50.0% (32.4ms -> 16.2ms) via CTEs.",
        "",
        "3. THREE CORE OPERATIONAL RECOMMENDATIONS",
        " 1. Emergency Rapid Assessment & Direct-to-Bed Protocol:",
        "    Deploy secondary triage nurse practitioner stations to cut non-emergent triage hold by 35m.",
        " 2. Chronic Super-Utilizer Outpatient Telehealth Follow-ups:",
        "    Assign dedicated care coordinators to 25 identified chronic super-utilizers to reduce readmissions.",
        " 3. Dynamic Surge Flex Bed Reallocation:",
        "    Activate 8-12 swing beds from General Medicine (74% util) to Emergency during 4pm-9pm peak hours.",
        "",
        "4. DATABASE & REPRODUCIBILITY VALIDATION",
        " All 15 SQL query transformations have been reproduced in Python (Pandas/Seaborn) with 100.0%",
        " numeric and logical alignment. Cross-validation artifact: public/analysis/validation-results.json",
        "--------------------------------------------------------------------------------",
        "Independent portfolio demonstration using synthetic healthcare data. Not an official Apollo Hospitals product."
    ]

    # Build basic PDF structure
    content = "BT\n/F1 9 Tf\n12 TL\n40 780 Td\n"
    for line in lines:
        sanitized = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        content += f"({sanitized}) '\n"
    content += "ET\n"

    stream_data = content.encode("latin1")
    stream_len = len(stream_data)

    pdf_parts = []
    pdf_parts.append(b"%PDF-1.4\n")
    
    # Objects
    obj1 = b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    obj2 = b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    obj3 = b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
    obj4 = f"4 0 obj\n<< /Length {stream_len} >>\nstream\n".encode("latin1") + stream_data + b"\nendstream\nendobj\n"
    obj5 = b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"

    objects = [obj1, obj2, obj3, obj4, obj5]
    
    offsets = []
    current_offset = len(pdf_parts[0])
    
    for obj in objects:
        offsets.append(current_offset)
        pdf_parts.append(obj)
        current_offset += len(obj)

    xref_offset = current_offset
    xref = f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n"
    for off in offsets:
        xref += f"{off:010d} 00000 n \n"
    
    trailer = f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n"

    pdf_parts.append(xref.encode("latin1"))
    pdf_parts.append(trailer.encode("latin1"))

    with open(PDF_PATH, "wb") as f:
        f.write(b"".join(pdf_parts))

    print(f"✓ Executive PDF report successfully generated at {PDF_PATH}")

if __name__ == "__main__":
    create_pdf()
