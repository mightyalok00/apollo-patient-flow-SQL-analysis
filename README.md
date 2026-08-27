# Apollo Hospitals Patient Flow SQL Analysis

## Project Overview

This project analyzes hospital patient flow using MySQL. It evaluates admissions, waiting times, length of stay, readmissions, department performance, bed utilization and operational bottlenecks across four synthetic Apollo hospital locations.

> **Data disclaimer:** This is a synthetic educational dataset. It does not contain real Apollo Hospitals patient or operational data.

## Problem Statement

Hospitals must coordinate patient demand, clinical staffing, bed capacity and discharge activity. Long waiting times, repeated admissions and extended stays can create operational pressure even when sufficient beds are available. This project uses SQL to identify where those pressures occur and which hospitals and departments require the greatest attention.

## Database Description

- **Database:** `apollo_patient_flow`
- **Platform:** MySQL 8.0+
- **Hospitals:** 4
- **Departments:** 20
- **Patients:** 500
- **Doctors:** 60
- **Admissions:** 2,500
- **Bed-occupancy records:** 7,300

## Schema and Relationships

| Table | Primary key | Purpose |
|---|---|---|
| `hospitals` | `hospital_id` | Stores hospital names and locations. |
| `departments` | `department_id` | Stores departments and bed capacity for each hospital. |
| `patients` | `patient_id` | Stores patient demographic and insurance attributes. |
| `doctors` | `doctor_id` | Stores doctors, specialties and department assignments. |
| `admissions` | `admission_id` | Central transaction table containing hospital admissions and outcomes. |
| `bed_occupancy` | `occupancy_id` | Stores hospital- and department-level bed observations by date. |

Important relationships:

- One hospital has many departments.
- One hospital has many admissions and bed-occupancy records.
- One department has many doctors, admissions and bed-occupancy records.
- One patient can have multiple admissions.
- One doctor can handle multiple admissions.
- `admissions` connects patients, doctors, departments and hospitals through foreign keys.
- `bed_occupancy` connects to hospitals and departments and is matched to admission dates for the combined analytical view.

## Project Questions

The analysis answers 15 questions:

1. Database exploration and relationship verification
2. Hospital admission analysis
3. Department admission performance
4. Patient waiting-time analysis
5. Waiting-time bottleneck classification
6. Length-of-stay analysis
7. Readmission-rate analysis
8. Repeated patient-admission analysis
9. Bed-utilization analysis
10. Hospital and department analysis using joins
11. Departments above the overall waiting-time average
12. Department performance using a CTE
13. Department ranking using window functions
14. Top five patient-flow bottlenecks
15. Query-plan analysis and optimization

## SQL Concepts Used

The project demonstrates:

- `SELECT`, `WHERE`, `ORDER BY` and `LIMIT`
- `COUNT`, `SUM`, `AVG`, `MIN` and `MAX`
- `GROUP BY` and `HAVING`
- Conditional logic using `CASE`
- `INNER JOIN` and `LEFT JOIN`
- Scalar and derived-table subqueries
- Common table expressions using `WITH`
- `ROW_NUMBER()`, `RANK()` and `DENSE_RANK()`
- Window partitions using `PARTITION BY`
- `DATE()` and `TIMESTAMPDIFF()`
- Percentages with division-by-zero protection using `NULLIF`
- Missing-value handling using `COALESCE`
- Views using `CREATE OR REPLACE VIEW`
- Query-plan inspection using `EXPLAIN`
- Composite indexes and `ANALYZE TABLE`
- Pre-aggregation to prevent many-to-many row multiplication

## How to Run the Project

1. Open MySQL Workbench and connect to MySQL 8.0 or later.
2. Run `Apollo_Hospitals_Patient_Flow_SQL_Lab.sql` to create the database, tables, keys, constraints and synthetic records.
3. Refresh the **SCHEMAS** panel and confirm that `apollo_patient_flow` exists.
4. Open `Apollo_Patient_Flow_Analysis_Clean.sql`.
5. Execute the supporting view once.
6. Run each numbered question separately with **Ctrl + Enter**.
7. Review the Result Grid before continuing to the next question.
8. For Question 15, compare the execution plans before and after optimization.

Do not execute the entire analysis file repeatedly because MySQL Workbench may reach its maximum number of Result tabs.

## Business Insights

### 1. Apollo Hyderabad handled the highest admission volume

- **Finding:** Apollo Hyderabad recorded the most admissions.
- **Evidence:** It handled 654 admissions, compared with 631 at Apollo Mumbai, 630 at Apollo Delhi and 585 at Apollo Bangalore.
- **Business impact:** Staffing and supporting resources should account for the comparatively greater workload at Apollo Hyderabad.

### 2. Emergency departments are the main waiting-time bottleneck

- **Finding:** Emergency departments had much longer waiting times than other departments.
- **Evidence:** Average Emergency waiting times ranged from 99.63 to 106.71 minutes, compared with an overall average of 62.81 minutes.
- **Business impact:** Emergency triage, staffing by shift, diagnostics and patient-transfer processes should be reviewed.

### 3. Apollo Bangalore Emergency had the highest average wait

- **Finding:** Apollo Bangalore Emergency recorded the longest average waiting time.
- **Evidence:** Its average was 106.71 minutes, approximately 43.90 minutes above the overall average.
- **Business impact:** Targeted workflow improvements could reduce congestion and patient dissatisfaction.

### 4. Apollo Delhi Emergency had the greatest combined bottleneck

- **Finding:** Apollo Delhi Emergency ranked first in the combined patient-flow analysis.
- **Evidence:** Its bottleneck score was 92.11, supported by a 103.78-minute average wait, 4.80-day average stay, 37.72% readmission rate and 47.09% bed utilization.
- **Business impact:** Improvement should address the complete patient journey rather than one isolated measure.

### 5. No department had Critical overall bed utilization

- **Finding:** No department exceeded the project-defined 90% Critical-utilization threshold.
- **Evidence:** The Critical-utilization query returned zero departments; the highest observed aggregate utilization was approximately 47.32%.
- **Business impact:** Aggregate capacity appears sufficient, but daily peaks should still be monitored because averages can hide short-term pressure.

### 6. Apollo Delhi Emergency had the longest average stay

- **Finding:** Apollo Delhi Emergency recorded the longest average length of stay.
- **Evidence:** Its patients stayed an average of 4.80 days across 114 discharged admissions.
- **Business impact:** Discharge planning, diagnostic delays, consultations and care transitions should be investigated.

### 7. Readmission rates require attention

- **Finding:** Several departments recorded comparatively high readmission rates.
- **Evidence:** Apollo Delhi Orthopedics recorded 40.77%, Apollo Delhi Emergency 37.72% and Apollo Hyderabad Emergency 37.40%.
- **Business impact:** Follow-up care, discharge readiness and recurring-condition management should be examined. These synthetic rates are not clinical benchmarks.

### 8. Demand is concentrated in specific departments

- **Finding:** Several departments handled noticeably greater patient volumes.
- **Evidence:** Apollo Hyderabad Orthopedics handled 137 admissions, Apollo Hyderabad General Medicine 135 and Apollo Delhi General Medicine 134.
- **Business impact:** Department-level staffing and appointment capacity should follow observed demand rather than being distributed equally.

### 9. Repeated admissions are common

- **Finding:** Most patients were admitted more than once in the synthetic dataset.
- **Evidence:** The analysis identified 482 of 500 patients with multiple admissions, and the dataset averages five admissions per patient.
- **Business impact:** Patient-level monitoring can help identify recurring care requirements and potential opportunities to prevent avoidable returns.

### 10. Doctor workload requires ongoing monitoring

- **Finding:** The dataset represents a meaningful average workload per doctor.
- **Evidence:** Sixty doctors collectively handled 2,500 admissions, equivalent to approximately 41.67 admissions per doctor on average.
- **Business impact:** Individual workloads should be compared with this baseline to detect imbalance and improve case allocation.

## Query Optimization

Question 15 optimizes a department-level operational report.

### Original performance issue

The original version used correlated subqueries to calculate admission counts, waiting times and bed utilization. These subqueries could repeatedly access `admissions` and `bed_occupancy` for every department.

### Improvements

- Admission and bed data are aggregated once in separate CTEs.
- Only the small department summaries are joined.
- Composite indexes support grouping and joining on `(hospital_id, department_id)`.
- `ANALYZE TABLE` refreshes optimizer statistics.
- `EXPLAIN` compares access paths before and after optimization.

### Observed result

During testing, the unoptimized query took approximately 0.032 seconds and the optimized query approximately 0.016 seconds. This was an observed improvement of about 50% on the educational dataset. Execution times may differ by system, cache state and MySQL configuration.

## Limitations

- The dataset is synthetic and must not be interpreted as actual Apollo Hospitals performance.
- Attention and Critical-utilization thresholds are project-defined analytical rules, not official clinical standards.
- Aggregate utilization may hide date- or shift-level capacity peaks.
- Execution times from a small educational dataset should not be generalized to production systems.
- The analysis identifies associations and operational signals; it does not establish clinical causation.

## Conclusion

The analysis shows that Emergency departments are the clearest patient-flow concern. Apollo Delhi Emergency has the highest combined bottleneck score, while Apollo Bangalore Emergency has the longest average wait. Bed utilization is not Critical at the aggregate level, so the strongest improvement opportunities relate to Emergency workflow, discharge processes, readmission reduction and demand-based staffing. The project demonstrates an end-to-end SQL workflow covering schema exploration, analytical querying, window functions, CTEs, indexing and query optimization.

## Project Files

```text
Apollo_Hospitals_Patient_Flow_SQL_Lab.sql
Apollo_Patient_Flow_Analysis_Clean.sql
README.md
ER_Diagram.png
```
