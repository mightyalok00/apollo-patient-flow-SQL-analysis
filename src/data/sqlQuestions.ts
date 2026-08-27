import { SqlQueryQuestion } from '../types';

export const SQL_QUESTIONS: SqlQueryQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    title: 'Database Exploration & Schema Verification',
    section: 'Schema & Architecture',
    description: 'Explore tables, column data types, primary keys, foreign key constraints, and record counts across the apollo_patient_flow database.',
    businessContext: 'Before starting operational patient flow analysis, data engineers verify table schemas, verify foreign key integrity, and confirm total record counts across all 6 core hospital tables.',
    sqlQuery: `-- 1A. Display all tables
SHOW TABLES;

-- 1B. Verify the number of records in every table
SELECT 'hospitals' AS table_name, COUNT(*) AS total_records FROM hospitals
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'patients', COUNT(*) FROM patients
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'admissions', COUNT(*) FROM admissions
UNION ALL
SELECT 'bed_occupancy', COUNT(*) FROM bed_occupancy;`,
    explanation: 'Demonstrates catalog queries using SHOW TABLES, table descriptions, information_schema inspection, and UNION ALL row count aggregations verifying 4 hospitals, 20 departments, 500 patients, 60 doctors, 2,500 admissions, and 7,300 bed occupancy observations.',
    keyFinding: 'Schema is fully normalized with 6 relational tables and 2,500 patient admission events.',
    sqlConcepts: ['SHOW TABLES', 'DESCRIBE', 'information_schema', 'UNION ALL', 'COUNT(*)']
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'Hospital Admission Volume Analysis',
    section: 'Hospital Performance',
    description: 'Calculate admissions handled by each hospital and identify the hospital with the highest workload.',
    businessContext: 'Hospital administrators must allocate clinical staffing and capital budget proportional to patient volume across regions.',
    sqlQuery: `-- 2A. Admissions handled by every hospital
SELECT
    h.hospital_id,
    h.hospital_name,
    h.city,
    COUNT(a.admission_id) AS total_admissions
FROM hospitals AS h
LEFT JOIN admissions AS a
    ON a.hospital_id = h.hospital_id
GROUP BY
    h.hospital_id,
    h.hospital_name,
    h.city
ORDER BY total_admissions DESC;`,
    explanation: 'Uses LEFT JOIN between hospitals and admissions grouped by hospital attributes, ordered descending to rank patient load.',
    keyFinding: 'Apollo Hyderabad handled the highest volume (654 admissions), followed by Mumbai (631), Delhi (630), and Bangalore (585).',
    sqlConcepts: ['LEFT JOIN', 'GROUP BY', 'COUNT', 'ORDER BY DESC']
  },
  {
    id: 'q3',
    questionNumber: 3,
    title: 'Department Performance & Top 5 Volume',
    section: 'Department Performance',
    description: 'Calculate total admissions for each department across all locations and identify the top 5 busiest departments.',
    businessContext: 'Helps identify clinical specialties facing high service demand to optimize consultant coverage and shift schedules.',
    sqlQuery: `-- 3A & 3B. Top 5 departments by patient volume
SELECT
    d.department_id,
    d.department_name,
    h.hospital_name,
    COUNT(a.admission_id) AS total_admissions
FROM departments AS d
JOIN hospitals AS h
    ON h.hospital_id = d.hospital_id
LEFT JOIN admissions AS a
    ON a.department_id = d.department_id
   AND a.hospital_id = d.hospital_id
GROUP BY
    d.department_id,
    d.department_name,
    h.hospital_id,
    h.hospital_name
ORDER BY total_admissions DESC
LIMIT 5;`,
    explanation: 'Multi-table join across departments, hospitals, and admissions with composite group-by logic and a LIMIT clause to isolate top volume centers.',
    keyFinding: 'Top 5 departments by admissions: Apollo Hyderabad Orthopedics (137), Apollo Hyderabad General Medicine (135), Apollo Delhi General Medicine (134), Apollo Delhi Orthopedics (130), and Apollo Mumbai Cardiology (129).',
    sqlConcepts: ['JOIN', 'LEFT JOIN', 'GROUP BY', 'LIMIT']
  },
  {
    id: 'q4',
    questionNumber: 4,
    title: 'Patient Waiting-Time Analysis',
    section: 'Operational Latency',
    description: 'Calculate minimum, average, and maximum patient waiting times for each department, highlighting the highest wait times.',
    businessContext: 'Extended waiting times reduce patient satisfaction and can compromise emergency outcomes.',
    sqlQuery: `-- 4A. Waiting-time statistics for every department
SELECT
    d.department_id,
    d.department_name,
    h.hospital_name,
    COUNT(a.admission_id) AS total_admissions,
    MIN(a.wait_time_minutes) AS minimum_wait_minutes,
    ROUND(AVG(a.wait_time_minutes), 2) AS average_wait_minutes,
    MAX(a.wait_time_minutes) AS maximum_wait_minutes
FROM departments AS d
JOIN hospitals AS h
    ON h.hospital_id = d.hospital_id
LEFT JOIN admissions AS a
    ON a.department_id = d.department_id
   AND a.hospital_id = d.hospital_id
GROUP BY
    d.department_id,
    d.department_name,
    h.hospital_id,
    h.hospital_name
ORDER BY average_wait_minutes DESC;`,
    explanation: 'Uses aggregate functions MIN, AVG, and MAX with ROUND to calculate wait time distributions across departments.',
    keyFinding: 'All 4 Emergency departments have severe wait spikes (99.63 - 106.71 mins). Apollo Bangalore Emergency has the single highest average wait at 106.71 minutes.',
    sqlConcepts: ['MIN', 'MAX', 'AVG', 'ROUND', 'GROUP BY']
  },
  {
    id: 'q5',
    questionNumber: 5,
    title: 'Waiting-Time Bottleneck Classification',
    section: 'Triage & Bottlenecks',
    description: 'Classify patient admissions into triage wait-time tiers: Low (<30m), Moderate (30-59m), High (60-119m), and Critical (>=120m).',
    businessContext: 'Stratifies patient delays to alert clinical supervisors to critical bottlenecks in real-time triage.',
    sqlQuery: `-- 5B. Waiting-time category counts per department using CTE
WITH classified_admissions AS (
    SELECT
        hospital_id,
        department_id,
        CASE
            WHEN wait_time_minutes < 30 THEN 'Low'
            WHEN wait_time_minutes < 60 THEN 'Moderate'
            WHEN wait_time_minutes < 120 THEN 'High'
            ELSE 'Critical'
        END AS waiting_time_category
    FROM admissions
)
SELECT
    h.hospital_name,
    d.department_name,
    SUM(CASE WHEN ca.waiting_time_category = 'Low' THEN 1 ELSE 0 END) AS low_cases,
    SUM(CASE WHEN ca.waiting_time_category = 'Moderate' THEN 1 ELSE 0 END) AS moderate_cases,
    SUM(CASE WHEN ca.waiting_time_category = 'High' THEN 1 ELSE 0 END) AS high_cases,
    SUM(CASE WHEN ca.waiting_time_category = 'Critical' THEN 1 ELSE 0 END) AS critical_cases
FROM departments AS d
JOIN hospitals AS h ON h.hospital_id = d.hospital_id
LEFT JOIN classified_admissions AS ca
    ON ca.department_id = d.department_id
   AND ca.hospital_id = d.hospital_id
GROUP BY
    h.hospital_id, h.hospital_name, d.department_id, d.department_name
ORDER BY critical_cases DESC;`,
    explanation: 'Leverages Common Table Expressions (CTE) and conditional aggregation via CASE WHEN statements to create cross-tabulated category counts.',
    keyFinding: 'Emergency departments have the highest concentration of Critical (>=120 min) cases, while elective departments remain predominantly in Low/Moderate tiers.',
    sqlConcepts: ['WITH (CTE)', 'CASE WHEN', 'Conditional Aggregation', 'SUM']
  },
  {
    id: 'q6',
    questionNumber: 6,
    title: 'Length-of-Stay (LOS) Analysis',
    section: 'Bed & Care Management',
    description: 'Calculate the average length of stay in days from admission to discharge, excluding active admissions.',
    businessContext: 'Prolonged length of stay increases inpatient costs and limits available bed turnover for incoming patients.',
    sqlQuery: `-- 6A. Average length of stay for every department
SELECT
    d.department_id,
    d.department_name,
    h.hospital_name,
    COUNT(a.admission_id) AS discharged_admissions,
    ROUND(AVG(TIMESTAMPDIFF(HOUR, a.admission_date, a.discharge_date) / 24.0), 2) AS average_length_of_stay_days,
    ROUND(MIN(TIMESTAMPDIFF(HOUR, a.admission_date, a.discharge_date) / 24.0), 2) AS minimum_stay_days,
    ROUND(MAX(TIMESTAMPDIFF(HOUR, a.admission_date, a.discharge_date) / 24.0), 2) AS maximum_stay_days
FROM admissions AS a
JOIN hospitals AS h ON h.hospital_id = a.hospital_id
JOIN departments AS d ON d.department_id = a.department_id AND d.hospital_id = a.hospital_id
WHERE a.discharge_date IS NOT NULL
  AND a.discharge_date >= a.admission_date
GROUP BY
    d.department_id, d.department_name, h.hospital_id, h.hospital_name
ORDER BY average_length_of_stay_days DESC;`,
    explanation: 'Uses TIMESTAMPDIFF(HOUR, admission, discharge) converted to fractional days, filtering with WHERE to ensure non-null and valid chronological dates.',
    keyFinding: 'Apollo Delhi Emergency recorded the longest average stay at 4.80 days (across 114 discharged patients), indicating potential discharge transition delays.',
    sqlConcepts: ['TIMESTAMPDIFF', 'WHERE date checks', 'AVG', 'ROUND']
  },
  {
    id: 'q7',
    questionNumber: 7,
    title: 'Hospital & Department Readmission Rates',
    section: 'Care Quality',
    description: 'Calculate 30-day readmission percentage rates across hospitals and individual departments.',
    businessContext: 'High readmission rates often signal premature discharge, sub-optimal post-acute coordination, or chronic disease management challenges.',
    sqlQuery: `-- 7C. Compare readmission rates across departments
SELECT
    d.department_id,
    d.department_name,
    h.hospital_name,
    COUNT(a.admission_id) AS total_admissions,
    SUM(CASE WHEN a.readmission_flag = 1 THEN 1 ELSE 0 END) AS total_readmissions,
    ROUND(100.0 * SUM(CASE WHEN a.readmission_flag = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(a.admission_id), 0), 2) AS readmission_rate_percent
FROM departments AS d
JOIN hospitals AS h ON h.hospital_id = d.hospital_id
LEFT JOIN admissions AS a ON a.department_id = d.department_id AND a.hospital_id = d.hospital_id
GROUP BY
    d.department_id, d.department_name, h.hospital_id, h.hospital_name
ORDER BY readmission_rate_percent DESC;`,
    explanation: 'Uses division-by-zero protection with NULLIF and conditional SUM over readmission flags.',
    keyFinding: 'Apollo Delhi Orthopedics had the highest readmission rate (40.77%), followed by Apollo Delhi Emergency (37.72%) and Apollo Hyderabad Emergency (37.40%).',
    sqlConcepts: ['NULLIF', 'Percentage Calculation', 'Conditional SUM', 'CASE']
  },
  {
    id: 'q8',
    questionNumber: 8,
    title: 'Repeated Patient-Admission Analysis',
    section: 'Patient Demographics',
    description: 'Identify frequent patients with multiple hospital admissions, distinct facilities visited, and rank them using window functions.',
    businessContext: 'Helps case managers coordinate specialized outpatient programs for complex chronic patients.',
    sqlQuery: `-- 8A. Patient admission summary with DENSE_RANK
WITH patient_admission_summary AS (
    SELECT
        p.patient_id,
        p.patient_name,
        p.gender,
        p.city AS patient_city,
        COUNT(a.admission_id) AS total_admissions,
        COUNT(DISTINCT a.hospital_id) AS hospitals_visited,
        MIN(a.admission_date) AS first_admission_date,
        MAX(a.admission_date) AS latest_admission_date
    FROM patients AS p
    JOIN admissions AS a ON a.patient_id = p.patient_id
    GROUP BY p.patient_id, p.patient_name, p.gender, p.city
    HAVING COUNT(a.admission_id) > 1
)
SELECT
    patient_id,
    patient_name,
    gender,
    patient_city,
    total_admissions,
    hospitals_visited,
    first_admission_date,
    latest_admission_date,
    DENSE_RANK() OVER (ORDER BY total_admissions DESC) AS admission_rank
FROM patient_admission_summary
ORDER BY admission_rank, patient_id;`,
    explanation: 'Demonstrates CTE, HAVING clause filtering, COUNT(DISTINCT) for cross-hospital visits, and DENSE_RANK() window function.',
    keyFinding: '482 out of 500 patients (96.4%) have multiple admissions, averaging 5.0 admissions per patient across the dataset.',
    sqlConcepts: ['DENSE_RANK() OVER', 'COUNT(DISTINCT)', 'HAVING', 'CTE']
  },
  {
    id: 'q9',
    questionNumber: 9,
    title: 'Bed-Utilization & Capacity Analysis',
    section: 'Bed & Care Management',
    description: 'Calculate average bed utilization percentage for every department and flag any exceeding the 90% Critical threshold.',
    businessContext: 'Ensures hospital beds are efficiently occupied without reaching crisis thresholds that cause ambulance diversions.',
    sqlQuery: `-- 9A. Bed utilization for every department
SELECT
    d.department_id,
    d.department_name,
    h.hospital_name,
    COUNT(bo.occupancy_id) AS occupancy_records,
    SUM(bo.occupied_beds) AS total_occupied_bed_observations,
    SUM(bo.available_beds) AS total_available_bed_observations,
    ROUND(100.0 * SUM(bo.occupied_beds) / NULLIF(SUM(bo.occupied_beds) + SUM(bo.available_beds), 0), 2) AS bed_utilization_percent,
    CASE
        WHEN 100.0 * SUM(bo.occupied_beds) / NULLIF(SUM(bo.occupied_beds) + SUM(bo.available_beds), 0) > 90 THEN 'Critical'
        ELSE 'Normal'
    END AS utilization_status
FROM departments AS d
JOIN hospitals AS h ON h.hospital_id = d.hospital_id
LEFT JOIN bed_occupancy AS bo ON bo.department_id = d.department_id AND bo.hospital_id = d.hospital_id
GROUP BY
    d.department_id, d.department_name, h.hospital_id, h.hospital_name
ORDER BY bed_utilization_percent DESC;`,
    explanation: 'Aggregates 7,300 daily bed observations with mathematical ratio calculation and conditional CASE thresholding.',
    keyFinding: 'Aggregate bed utilization ranges between 41.5% and 47.32%. Zero departments breached the 90% Critical threshold at the aggregate level.',
    sqlConcepts: ['NULLIF', 'Bed Ratio Math', 'SUM', 'CASE status']
  },
  {
    id: 'q10',
    questionNumber: 10,
    title: 'Hospital & Department Analysis using Joins',
    section: 'Integrated Reporting',
    description: 'Combine admissions, total beds, waiting times, and bed utilization into a consolidated department executive report without row duplication.',
    businessContext: 'Hospital C-suite dashboard summarizing key operational levers across all 20 clinical departments.',
    sqlQuery: `-- 10. Department-level report with pre-aggregated subqueries
SELECT
    h.hospital_name,
    d.department_name,
    d.total_beds,
    COALESCE(am.total_admissions, 0) AS total_admissions,
    am.average_wait_minutes,
    bm.average_bed_utilization_percent
FROM departments AS d
JOIN hospitals AS h ON h.hospital_id = d.hospital_id
LEFT JOIN (
    SELECT hospital_id, department_id, COUNT(admission_id) AS total_admissions, ROUND(AVG(wait_time_minutes), 2) AS average_wait_minutes
    FROM admissions GROUP BY hospital_id, department_id
) AS am ON am.hospital_id = d.hospital_id AND am.department_id = d.department_id
LEFT JOIN (
    SELECT hospital_id, department_id,
        ROUND(100.0 * SUM(occupied_beds) / NULLIF(SUM(occupied_beds) + SUM(available_beds), 0), 2) AS average_bed_utilization_percent
    FROM bed_occupancy GROUP BY hospital_id, department_id
) AS bm ON bm.hospital_id = d.hospital_id AND bm.department_id = d.department_id
ORDER BY h.hospital_name, total_admissions DESC;`,
    explanation: 'Pre-aggregates separate fact tables (admissions and bed_occupancy) before joining to prevent Cartesian row multiplication (fan-out defect).',
    keyFinding: 'Correctly preserves exact department counts while joining diverse observation granularities.',
    sqlConcepts: ['Pre-aggregation', 'Derived Subqueries', 'COALESCE', 'Composite Keys']
  },
  {
    id: 'q11',
    questionNumber: 11,
    title: 'Departments Above Overall Waiting-Time Average',
    section: 'Operational Latency',
    description: 'Filter departments whose average waiting time exceeds the global system-wide average (62.81 minutes) using scalar subqueries.',
    businessContext: 'Focuses management interventions exclusively on underperforming clinical units.',
    sqlQuery: `-- 11. Scalar subquery comparison in HAVING clause
SELECT
    h.hospital_name,
    d.department_name,
    COUNT(a.admission_id) AS total_admissions,
    ROUND(AVG(a.wait_time_minutes), 2) AS department_average_wait,
    ROUND((SELECT AVG(all_a.wait_time_minutes) FROM admissions AS all_a), 2) AS overall_average_wait
FROM admissions AS a
JOIN departments AS d ON d.department_id = a.department_id AND d.hospital_id = a.hospital_id
JOIN hospitals AS h ON h.hospital_id = a.hospital_id
GROUP BY h.hospital_id, h.hospital_name, d.department_id, d.department_name
HAVING AVG(a.wait_time_minutes) > (SELECT AVG(all_a.wait_time_minutes) FROM admissions AS all_a)
ORDER BY department_average_wait DESC;`,
    explanation: 'Employs a scalar subquery within both the SELECT projection and the HAVING filter clause for dynamic benchmark evaluation.',
    keyFinding: 'All 4 Emergency departments significantly exceed the 62.81-minute global baseline by 37 to 44 minutes.',
    sqlConcepts: ['Scalar Subquery', 'HAVING clause', 'AVG Benchmark']
  },
  {
    id: 'q12',
    questionNumber: 12,
    title: 'Department Performance & Attention Categorization',
    section: 'Triage & Bottlenecks',
    description: 'Calculate multi-factor performance metrics and categorize departments into High Attention, Moderate Attention, or Normal tiers.',
    businessContext: 'Rule-based classification system for prioritizing executive reviews and clinical process re-engineering.',
    sqlQuery: `-- 12. Department Performance with CTE and Attention Rules
WITH department_performance AS (
    SELECT
        a.hospital_id,
        a.department_id,
        COUNT(a.admission_id) AS total_admissions,
        ROUND(AVG(a.wait_time_minutes), 2) AS average_wait_minutes,
        ROUND(AVG(CASE WHEN a.discharge_date IS NOT NULL AND a.discharge_date >= a.admission_date
            THEN TIMESTAMPDIFF(HOUR, a.admission_date, a.discharge_date) / 24.0 ELSE NULL END), 2) AS average_length_of_stay_days,
        ROUND(100.0 * SUM(CASE WHEN a.readmission_flag = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(a.admission_id), 0), 2) AS readmission_rate_percent
    FROM admissions AS a
    GROUP BY a.hospital_id, a.department_id
)
SELECT
    h.hospital_name,
    d.department_name,
    dp.total_admissions,
    dp.average_wait_minutes,
    dp.average_length_of_stay_days,
    dp.readmission_rate_percent,
    CASE
        WHEN dp.average_wait_minutes >= 90 AND dp.readmission_rate_percent >= 30 THEN 'High Attention'
        WHEN dp.average_wait_minutes >= 60 OR dp.readmission_rate_percent >= 25 THEN 'Moderate Attention'
        ELSE 'Normal'
    END AS attention_status
FROM department_performance AS dp
JOIN hospitals AS h ON h.hospital_id = dp.hospital_id
JOIN departments AS d ON d.department_id = dp.department_id AND d.hospital_id = dp.hospital_id
ORDER BY
    CASE
        WHEN dp.average_wait_minutes >= 90 AND dp.readmission_rate_percent >= 30 THEN 1
        WHEN dp.average_wait_minutes >= 60 OR dp.readmission_rate_percent >= 25 THEN 2
        ELSE 3
    END,
    dp.average_wait_minutes DESC;`,
    explanation: 'Uses CTE with complex conditional priority ordering in the outer SELECT to elevate high-risk wards to the top.',
    keyFinding: 'All 4 Emergency departments qualify as "High Attention" due to wait times >90 min combined with readmission rates >30%.',
    sqlConcepts: ['WITH CTE', 'Complex CASE Rules', 'Custom ORDER BY Priority']
  },
  {
    id: 'q13',
    questionNumber: 13,
    title: 'Department Ranking using Window Functions',
    section: 'Advanced Analytics',
    description: 'Demonstrates ROW_NUMBER(), RANK(), DENSE_RANK(), and PARTITION BY across wait times, readmission rates, and bed utilization.',
    businessContext: 'Provides multi-dimensional percentile and dense ranking within each hospital location and system-wide.',
    sqlQuery: `-- 13. Advanced Window Functions & Partitions
WITH admission_metrics AS (
    SELECT a.hospital_id, a.department_id, COUNT(a.admission_id) AS total_admissions,
        ROUND(AVG(a.wait_time_minutes), 2) AS average_wait_minutes,
        ROUND(100.0 * SUM(CASE WHEN a.readmission_flag = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(a.admission_id), 0), 2) AS readmission_rate_percent
    FROM admissions AS a GROUP BY a.hospital_id, a.department_id
),
bed_metrics AS (
    SELECT bo.hospital_id, bo.department_id,
        ROUND(100.0 * SUM(bo.occupied_beds) / NULLIF(SUM(bo.occupied_beds) + SUM(bo.available_beds), 0), 2) AS bed_utilization_percent
    FROM bed_occupancy AS bo GROUP BY bo.hospital_id, bo.department_id
),
department_metrics AS (
    SELECT h.hospital_id, h.hospital_name, d.department_id, d.department_name,
        am.total_admissions, am.average_wait_minutes, am.readmission_rate_percent, bm.bed_utilization_percent
    FROM departments AS d
    JOIN hospitals AS h ON h.hospital_id = d.hospital_id
    LEFT JOIN admission_metrics AS am ON am.hospital_id = d.hospital_id AND am.department_id = d.department_id
    LEFT JOIN bed_metrics AS bm ON bm.hospital_id = d.hospital_id AND bm.department_id = d.department_id
)
SELECT
    hospital_name, department_id, department_name, total_admissions, average_wait_minutes,
    ROW_NUMBER() OVER (ORDER BY average_wait_minutes DESC) AS waiting_row_number,
    readmission_rate_percent,
    RANK() OVER (ORDER BY readmission_rate_percent DESC) AS readmission_rank,
    bed_utilization_percent,
    DENSE_RANK() OVER (ORDER BY bed_utilization_percent DESC) AS bed_utilization_rank,
    DENSE_RANK() OVER (PARTITION BY hospital_id ORDER BY average_wait_minutes DESC) AS waiting_rank_within_hospital
FROM department_metrics
ORDER BY waiting_row_number, readmission_rank;`,
    explanation: 'Comprehensive implementation of SQL analytical window functions comparing unique row numbering, rank gaps, dense ties, and partitioned grouping.',
    keyFinding: 'Within every individual hospital partition, Emergency ranked #1 for longest wait time.',
    sqlConcepts: ['ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'PARTITION BY']
  },
  {
    id: 'q14',
    questionNumber: 14,
    title: 'Top 5 Patient-Flow Bottlenecks (Composite Score)',
    section: 'Advanced Analytics',
    description: 'Combines normalized waiting time, length of stay, readmission rate, and bed utilization into a composite 0-100 score using PERCENT_RANK().',
    businessContext: 'Synthesizes four distinct operational dimensions into a unified, actionable bottleneck index for executive leadership.',
    sqlQuery: `-- 14. Composite Bottleneck Scoring with PERCENT_RANK()
WITH admission_metrics AS (
    SELECT hospital_id, department_id, COUNT(admission_id) AS total_admissions,
        ROUND(AVG(wait_time_minutes), 2) AS average_wait_minutes,
        ROUND(AVG(CASE WHEN discharge_date IS NOT NULL AND discharge_date >= admission_date
            THEN TIMESTAMPDIFF(HOUR, admission_date, discharge_date) / 24.0 END), 2) AS average_length_of_stay_days,
        ROUND(100.0 * SUM(CASE WHEN readmission_flag = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(admission_id), 0), 2) AS readmission_rate_percent
    FROM admissions GROUP BY hospital_id, department_id
),
bed_metrics AS (
    SELECT hospital_id, department_id,
        ROUND(100.0 * SUM(occupied_beds) / NULLIF(SUM(occupied_beds) + SUM(available_beds), 0), 2) AS bed_utilization_percent
    FROM bed_occupancy GROUP BY hospital_id, department_id
),
combined_metrics AS (
    SELECT h.hospital_name, d.department_id, d.department_name,
        am.total_admissions, am.average_wait_minutes, am.average_length_of_stay_days,
        am.readmission_rate_percent, bm.bed_utilization_percent
    FROM departments AS d
    JOIN hospitals AS h ON h.hospital_id = d.hospital_id
    JOIN admission_metrics AS am ON am.hospital_id = d.hospital_id AND am.department_id = d.department_id
    JOIN bed_metrics AS bm ON bm.hospital_id = d.hospital_id AND bm.department_id = d.department_id
),
normalized_metrics AS (
    SELECT combined_metrics.*,
        PERCENT_RANK() OVER (ORDER BY average_wait_minutes) AS waiting_score,
        PERCENT_RANK() OVER (ORDER BY average_length_of_stay_days) AS stay_score,
        PERCENT_RANK() OVER (ORDER BY readmission_rate_percent) AS readmission_score,
        PERCENT_RANK() OVER (ORDER BY bed_utilization_percent) AS utilization_score
    FROM combined_metrics
),
bottleneck_results AS (
    SELECT normalized_metrics.*,
        ROUND(100.0 * (waiting_score + stay_score + readmission_score + utilization_score) / 4, 2) AS bottleneck_score
    FROM normalized_metrics
)
SELECT hospital_name, department_id, department_name, total_admissions, average_wait_minutes,
    average_length_of_stay_days, readmission_rate_percent, bed_utilization_percent, bottleneck_score,
    DENSE_RANK() OVER (ORDER BY bottleneck_score DESC) AS bottleneck_rank
FROM bottleneck_results
ORDER BY bottleneck_score DESC, average_wait_minutes DESC
LIMIT 5;`,
    explanation: 'Applies statistical normalization via PERCENT_RANK() over 4 disparate metric distributions before computing arithmetic composite weights.',
    keyFinding: 'Apollo Delhi Emergency ranked #1 overall with a bottleneck score of 92.11, followed by Apollo Bangalore Emergency (89.65) and Apollo Hyderabad Emergency (88.90).',
    sqlConcepts: ['PERCENT_RANK()', 'Statistical Normalization', 'Composite Index Scoring', 'CTEs']
  },
  {
    id: 'q15',
    questionNumber: 15,
    title: 'Query Optimization & EXPLAIN Plan Comparison',
    section: 'Performance Tuning',
    description: 'Demonstrates resolving correlated subquery performance bottlenecks by replacing repeated subqueries with single-pass CTEs and composite indexing.',
    businessContext: 'High-frequency analytical reporting queries must execute in milliseconds without overwhelming database CPU or I/O.',
    sqlQuery: `-- 15. Optimized Query using Single-Pass CTEs + Composite Indexes
WITH admission_metrics AS (
    SELECT a.hospital_id, a.department_id, COUNT(a.admission_id) AS total_admissions,
        ROUND(AVG(a.wait_time_minutes), 2) AS average_wait_minutes
    FROM admissions AS a
    GROUP BY a.hospital_id, a.department_id
),
bed_metrics AS (
    SELECT bo.hospital_id, bo.department_id,
        ROUND(100.0 * SUM(bo.occupied_beds) / NULLIF(SUM(bo.occupied_beds) + SUM(bo.available_beds), 0), 2) AS bed_utilization_percent
    FROM bed_occupancy AS bo
    GROUP BY bo.hospital_id, bo.department_id
)
SELECT
    h.hospital_name,
    d.department_name,
    d.total_beds,
    COALESCE(am.total_admissions, 0) AS total_admissions,
    am.average_wait_minutes,
    bm.bed_utilization_percent
FROM departments AS d
JOIN hospitals AS h ON h.hospital_id = d.hospital_id
LEFT JOIN admission_metrics AS am ON am.hospital_id = d.hospital_id AND am.department_id = d.department_id
LEFT JOIN bed_metrics AS bm ON bm.hospital_id = d.hospital_id AND bm.department_id = d.department_id
ORDER BY h.hospital_name, d.department_name;`,
    optimizedQuery: `EXPLAIN WITH admission_metrics AS (...) SELECT ...`,
    explanation: 'The unoptimized version triggered 3 correlated subqueries per row (60 subquery executions). The optimized version scans each table once with CTEs and indexes on (hospital_id, department_id), cutting execution time by ~50% (0.032s -> 0.016s).',
    keyFinding: '50% query execution time reduction through single-pass hash aggregation and composite indexing.',
    sqlConcepts: ['EXPLAIN', 'Query Plan Tuning', 'Composite Indexing', 'ANALYZE TABLE', 'Subquery Elimination']
  }
];
