import { CENTRAL_METRICS, MODELED_FINANCIAL_PROJECTIONS, INDEPENDENT_DISCLAIMER } from './metricsEngine';

export interface BusinessInsightItem {
  id: number;
  title: string;
  finding: string;
  evidence: string;
  businessImpact: string;
  actionableRecommendation: string;
  scope: string;
  sourceQueryNumber: number;
  sourceQueryTitle: string;
  metricValue: string;
  severity: 'Critical' | 'High Risk' | 'Moderate' | 'Positive';
  category: 'Capacity & Volume' | 'Bottlenecks & Triage' | 'Clinical Quality & LOS' | 'SQL Optimization';
}

export const ALL_BUSINESS_INSIGHTS: BusinessInsightItem[] = [
  {
    id: 1,
    title: 'Apollo Hyderabad Handled the Highest Admission Volume',
    finding: 'Apollo Hyderabad recorded the highest patient admission volume across the four-hospital network.',
    evidence: `Apollo Hyderabad handled 654 admissions (26.2% of network total), compared with 631 at Apollo Mumbai (25.2%), 630 at Apollo Delhi (25.2%), and 585 at Apollo Bangalore (23.4%). Total network volume: 2,500 admissions.`,
    businessImpact: 'Staffing, nursing ratios, and diagnostic support resources must account for the comparatively higher workload volume at Apollo Hyderabad.',
    actionableRecommendation: 'Reallocate floating clinical staff and expand outpatient intake scheduling during peak weekday admission windows in Hyderabad.',
    scope: 'Network-wide (4 Hospitals, N=2,500 admissions)',
    sourceQueryNumber: 2,
    sourceQueryTitle: 'Q2: Total Admissions per Hospital',
    metricValue: '654 Admissions (26.2%)',
    severity: 'Positive',
    category: 'Capacity & Volume'
  },
  {
    id: 2,
    title: 'Emergency Departments Are the Primary Network Bottleneck',
    finding: 'Emergency departments exhibited drastically longer triage wait times than all other clinical departments.',
    evidence: `Average Emergency waiting times ranged from 99.63 to 106.71 minutes (overall ER average: 102.89 minutes), compared with the network-wide overall average of 62.81 minutes across all 20 departments (N=486 ER episodes vs 2,500 total).`,
    businessImpact: 'Prolonged emergency wait times increase patient walkout risk, elevate clinical deterioration probability, and degrade patient satisfaction scores.',
    actionableRecommendation: 'Deploy Rapid Assessment Triage (RAT) nurses and point-of-care lab diagnostics to fast-track low-acuity patients during peak arrival hours.',
    scope: 'Emergency Departments (Delhi, Mumbai, Bangalore, Hyderabad; N=486)',
    sourceQueryNumber: 4,
    sourceQueryTitle: 'Q4: Waiting Time Statistics by Department',
    metricValue: '102.89 min Avg Wait',
    severity: 'Critical',
    category: 'Bottlenecks & Triage'
  },
  {
    id: 3,
    title: 'Apollo Bangalore Emergency Recorded the Longest Average Wait',
    finding: 'Apollo Bangalore Emergency unit had the highest average waiting time across all 20 individual hospital departments.',
    evidence: `Apollo Bangalore Emergency recorded an average wait time of 106.71 minutes (range: 85 to 148 minutes across 121 admissions), which is +43.90 minutes above the network overall average (62.81 min).`,
    businessImpact: 'Severe triage queue latency in Bangalore indicates intake intake friction and potential delays in physician initial examination.',
    actionableRecommendation: 'Audit Bangalore triage intake protocols and adjust shift scheduling to increase emergency physician coverage during 18:00–23:00 surges.',
    scope: 'Apollo Bangalore Emergency Ward (N=121 admissions)',
    sourceQueryNumber: 4,
    sourceQueryTitle: 'Q4: Waiting Time Statistics by Department',
    metricValue: '106.71 min Avg Wait',
    severity: 'Critical',
    category: 'Bottlenecks & Triage'
  },
  {
    id: 4,
    title: 'Apollo Delhi Emergency Ranked #1 in Multi-Criteria Strain Index',
    finding: 'Apollo Delhi Emergency department exhibited the most acute composite operational bottleneck in the network.',
    evidence: `Ranked #1 in Q14 Composite Bottleneck Score at 92.11 / 100, driven by a 103.78 minute average wait, 4.80-day length of stay, 37.72% 30-day readmission rate, and 47.09% bed utilization.`,
    businessImpact: 'Combined triage latency and prolonged inpatient length of stay create high bed turnover resistance and elevated readmission overhead.',
    actionableRecommendation: 'Implement proactive morning discharge huddles (by 10:00 AM) and comprehensive post-discharge transitional care coordination.',
    scope: 'Apollo Delhi Emergency Ward (N=114 admissions)',
    sourceQueryNumber: 14,
    sourceQueryTitle: 'Q14: Department Bottleneck Ranking',
    metricValue: '92.11 / 100 Strain Score',
    severity: 'Critical',
    category: 'Bottlenecks & Triage'
  },
  {
    id: 5,
    title: 'Orthopedics is the Highest Volume Inpatient Specialty',
    finding: 'Orthopedics accounted for the largest volume of patient admissions across the four hospital facilities.',
    evidence: `Orthopedics handled 536 admissions (21.4% of network volume), followed closely by General Medicine with 532 admissions (21.3%), Cardiology with 489 (19.6%), Emergency with 486 (19.4%), and Neurology with 457 (18.3%).`,
    businessImpact: 'Orthopedic operating theater scheduling and surgical ward bed turnover represent critical revenue and operational drivers.',
    actionableRecommendation: 'Standardize pre-operative elective intake protocols and enhance physical therapy step-down care to accelerate recovery.',
    scope: 'Network-wide Specialty Aggregates (N=2,500 admissions)',
    sourceQueryNumber: 3,
    sourceQueryTitle: 'Q3: Top Departments by Admission Volume',
    metricValue: '536 Admissions (21.4%)',
    severity: 'Moderate',
    category: 'Capacity & Volume'
  },
  {
    id: 6,
    title: '30-Day Readmission Risk Concentrated in Orthopedics & Emergency',
    finding: 'Unplanned 30-day readmission rates peaked in Apollo Delhi Orthopedics and acute Emergency departments.',
    evidence: `Apollo Delhi Orthopedics recorded the highest 30-day readmission rate at 40.77% (53 of 130 patients), followed by Apollo Delhi Emergency at 37.72% and Apollo Hyderabad Emergency at 37.40%. Network-wide average readmission rate: 33.76% (844 of 2,500).`,
    businessImpact: 'High readmission rates elevate episodic costs, create uncompensated bed consumption, and indicate opportunities for discharge protocol enhancements.',
    actionableRecommendation: 'Establish mandatory 48-hour post-discharge telephone follow-ups and medication reconciliation for high-risk surgical patients.',
    scope: 'Network-wide Readmissions (N=844 readmitted / 2,500 total)',
    sourceQueryNumber: 7,
    sourceQueryTitle: 'Q7: Readmission Rates by Department',
    metricValue: '40.77% Peak Readmission',
    severity: 'High Risk',
    category: 'Clinical Quality & LOS'
  },
  {
    id: 7,
    title: 'Network Bed Capacity is Proportionately Sized (680 Beds Total)',
    finding: 'Aggregate bed utilization is stable across the network (~45.1%), but requires shift-level surge management in emergency wards.',
    evidence: `The network comprises 680 total beds (Mumbai: 200 beds; Delhi, Bangalore, Hyderabad: 175 beds each). Daily occupancy records reflect an average utilization of ~45.10% with localized emergency surges during seasonal influxes.`,
    businessImpact: 'Ample overall physical capacity exists, but bed turnover bottlenecks in specific wards can artificially restrict emergency department intake.',
    actionableRecommendation: 'Implement a centralized cross-department bed management dashboard with automated discharge notifications.',
    scope: 'All 20 Department Wards (680 Total Physical Beds)',
    sourceQueryNumber: 9,
    sourceQueryTitle: 'Q9: Bed Utilization & Capacity',
    metricValue: '680 Physical Beds (~45.1% Util)',
    severity: 'Moderate',
    category: 'Capacity & Volume'
  },
  {
    id: 8,
    title: 'Consultant Medical Staffing is Equitably Distributed',
    finding: 'Physician specialist allocation is uniformly balanced across all four hospital facilities and specialties.',
    evidence: `Each hospital maintains exactly 15 credentialed doctor specialists (3 per clinical department, totaling 60 physicians across the network), ensuring baseline specialty coverage.`,
    businessImpact: 'Workload imbalances occur not from doctor headcount disparities, but from variations in admission volume (Hyderabad at 654 vs Bangalore at 585).',
    actionableRecommendation: 'Align resident medical officer and nursing shift allocations with actual hourly patient arrival curves rather than fixed headcount.',
    scope: 'Network Medical Staff (60 Credentialed Doctors across 4 Facilities)',
    sourceQueryNumber: 1,
    sourceQueryTitle: 'Q1: Relational Record Counts',
    metricValue: '60 Doctors (15 per Hospital)',
    severity: 'Positive',
    category: 'Capacity & Volume'
  },
  {
    id: 9,
    title: 'Evening Arrival Peaks Account for Severe Triage Wait Times',
    finding: 'Patient arrivals between 18:00 and 23:00 experience disproportionate triage delays.',
    evidence: `68% of all severe triage wait events (> 75 minutes) occurred during evening and late-night intake shifts, primarily impacting emergency departments where daily volume peaks coincided with shift handover windows.`,
    businessImpact: 'Triage bottlenecks during evening hours cascade into overnight boarding in emergency hallways, delaying next-day surgical intakes.',
    actionableRecommendation: 'Stagger nursing and emergency physician shifts to overlap by 90 minutes during the 17:30–23:30 surge window.',
    scope: 'Temporal Admission Cohorts (N=486 Emergency Admissions)',
    sourceQueryNumber: 8,
    sourceQueryTitle: 'Q8: Admission Volume by Time and Shift',
    metricValue: '68% of >75m Waits in Evening',
    severity: 'High Risk',
    category: 'Bottlenecks & Triage'
  },
  {
    id: 10,
    title: 'Query 15 CTE Refactoring Delivers ~50% Latency Reduction',
    finding: 'Refactoring correlated subqueries into pre-aggregated Common Table Expressions (CTEs) improved query execution speed by ~50%.',
    evidence: `Original Query 15 execution time: 0.032 seconds (using correlated subqueries with multiple table scans). Optimized Query 15 execution time: 0.016 seconds (using CTEs with composite index scans on hospital_id and department_id). Performance gain: ~50.0% latency reduction.`,
    businessImpact: 'Faster analytical query execution enables real-time executive dashboard responsiveness and reduces database server CPU load.',
    actionableRecommendation: 'Standardize CTE patterns and composite indexing across all production clinical reporting pipelines.',
    scope: 'SQL Query Engine Benchmark (MySQL 8.0 execution plan)',
    sourceQueryNumber: 15,
    sourceQueryTitle: 'Q15: Department Efficiency Optimization',
    metricValue: '~50% Execution Speedup (0.016s)',
    severity: 'Positive',
    category: 'SQL Optimization'
  }
];

export const QUERY_15_OPTIMIZATION_METRICS = {
  originalQueryTimeMs: 32.0,
  optimizedQueryTimeMs: 16.0,
  percentImprovement: '50.0%',
  originalScanType: 'Multiple dependent full table scans on admissions (2,500 rows) per department',
  optimizedScanType: 'Single pass CTE pre-aggregation with composite index lookup (hospital_id, department_id)',
  sqlTechniques: [
    'Replaced correlated subqueries with modular Common Table Expressions (CTEs)',
    'Eliminated redundant aggregations by computing department metrics once in the CTE stage',
    'Leveraged composite indexing on foreign keys (hospital_id, department_id) for instant joins',
    'Used window functions (ROW_NUMBER, DENSE_RANK) to perform ranking in a single pass'
  ]
};

export const ANALYTICAL_LIMITATIONS = [
  'Synthetic Dataset: All records, patient names, timestamps, and clinical attributes are synthetically generated for demonstration purposes.',
  'Cross-Sectional Scope: Data models a fixed period of 2,500 admissions across 4 regional facilities; seasonal trends over multi-year periods are modeled.',
  'Bed Census Granularity: Daily bed occupancy observations are aggregated at the ward level; individual room turnover minutes are not modeled.',
  'Modeled Financial Estimates: Cost reduction projections (₹14.8 Cr / yr) are illustrative scenario models based on standard industry benchmark formulas, not historical financial audits.'
];
