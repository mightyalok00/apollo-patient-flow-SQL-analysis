-- ============================================================
-- APOLLO HOSPITALS PATIENT FLOW SQL ANALYSIS
-- Database: apollo_patient_flow
-- Platform: MySQL 8.0+
--
-- This project uses a synthetic educational dataset.
-- It does not contain real Apollo Hospitals patient data.
--
-- Execution guidance:
-- Run one numbered question at a time in MySQL Workbench.
-- Place the cursor inside a statement and press Ctrl+Enter.
-- ============================================================

USE apollo_patient_flow;

-- ============================================================
-- SUPPORTING VIEW: CLEAN COMBINED PATIENT-FLOW DATA
--
-- Joins all six source tables without changing them.
-- Bed occupancy is aggregated by hospital, department and date
-- before it is joined, preventing duplicate admission rows.
-- ============================================================

CREATE OR REPLACE VIEW combined_patient_flow AS

WITH daily_bed_summary AS (
    SELECT
        hospital_id,
        department_id,
        occupancy_date,
        ROUND(AVG(available_beds), 0) AS available_beds,
        ROUND(AVG(occupied_beds), 0) AS occupied_beds
    FROM bed_occupancy
    GROUP BY
        hospital_id,
        department_id,
        occupancy_date
)

SELECT
    -- Admission information
    a.admission_id,
    a.admission_date,
    a.discharge_date,
    a.admission_type,
    a.disease,
    a.wait_time_minutes,
    a.discharge_status,

    CASE
        WHEN a.readmission_flag = 1 THEN 'Yes'
        ELSE 'No'
    END AS readmission,

    -- Patient information
    p.patient_id,
    p.patient_name,
    p.date_of_birth,
    p.gender,
    p.city AS patient_city,
    p.insurance_type,

    -- Hospital information
    h.hospital_id,
    h.hospital_name,
    h.city AS hospital_city,

    -- Department information
    d.department_id,
    d.department_name,
    d.total_beds,

    -- Doctor information
    doc.doctor_id,
    doc.doctor_name,
    doc.specialty,

    -- Bed-occupancy information
    dbs.occupancy_date,
    dbs.available_beds,
    dbs.occupied_beds,

    -- Bed-utilization calculation
    ROUND(
        100.0 * dbs.occupied_beds /
        NULLIF(dbs.occupied_beds + dbs.available_beds, 0),
        2
    ) AS bed_utilization_percent,

    -- Length-of-stay calculation
    CASE
        WHEN a.discharge_date IS NOT NULL
         AND a.discharge_date >= a.admission_date
        THEN ROUND(
            TIMESTAMPDIFF(
                HOUR,
                a.admission_date,
                a.discharge_date
            ) / 24.0,
            2
        )
        ELSE NULL
    END AS length_of_stay_days

FROM admissions AS a

INNER JOIN patients AS p
    ON p.patient_id = a.patient_id

INNER JOIN hospitals AS h
    ON h.hospital_id = a.hospital_id

INNER JOIN departments AS d
    ON d.department_id = a.department_id
    AND d.hospital_id = a.hospital_id

INNER JOIN doctors AS doc
    ON doc.doctor_id = a.doctor_id
    AND doc.department_id = a.department_id

LEFT JOIN daily_bed_summary AS dbs
    ON dbs.hospital_id = a.hospital_id
    AND dbs.department_id = a.department_id
    AND dbs.occupancy_date = DATE(a.admission_date);
    
-- ============================================================
-- QUESTION 1: DATABASE EXPLORATION
-- Explore tables, columns, primary keys, foreign keys and
-- relationships in the apollo_patient_flow database.
-- ============================================================

-- 1A. Display all tables
SHOW TABLES;


-- 1B. Display columns and keys for each table
DESCRIBE hospitals;
DESCRIBE departments;
DESCRIBE patients;
DESCRIBE doctors;
DESCRIBE admissions;
DESCRIBE bed_occupancy;


-- 1C. Display all columns with their data types and key details
SELECT
    table_name,
    ordinal_position,
    column_name,
    column_type,
    is_nullable,
    column_key
FROM information_schema.columns
WHERE table_schema = 'apollo_patient_flow'
ORDER BY table_name, ordinal_position;


-- 1D. Display primary keys
SELECT
    table_name,
    column_name AS primary_key_column
FROM information_schema.key_column_usage
WHERE table_schema = 'apollo_patient_flow'
  AND constraint_name = 'PRIMARY'
ORDER BY table_name, ordinal_position;


-- 1E. Display foreign keys and table relationships
SELECT
    table_name AS child_table,
    column_name AS foreign_key_column,
    referenced_table_name AS parent_table,
    referenced_column_name AS referenced_column
FROM information_schema.key_column_usage
WHERE table_schema = 'apollo_patient_flow'
  AND referenced_table_name IS NOT NULL
ORDER BY child_table, foreign_key_column;


-- 1F. Verify the number of records in every table
SELECT 'hospitals' AS table_name, COUNT(*) AS total_records
FROM hospitals

UNION ALL

SELECT 'departments', COUNT(*)
FROM departments

UNION ALL

SELECT 'patients', COUNT(*)
FROM patients

UNION ALL

SELECT 'doctors', COUNT(*)
FROM doctors

UNION ALL

SELECT 'admissions', COUNT(*)
FROM admissions

UNION ALL

SELECT 'bed_occupancy', COUNT(*)
FROM bed_occupancy;
-- ============================================================
-- QUESTION 2: HOSPITAL ADMISSION ANALYSIS
-- Calculate admissions handled by each hospital and identify
-- the hospital with the highest number of admissions.
-- ============================================================

-- 2A. Admissions handled by every hospital
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
ORDER BY total_admissions DESC;


-- 2B. Hospital with the highest number of admissions
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
ORDER BY total_admissions DESC
LIMIT 1;
-- ============================================================
-- QUESTION 3: DEPARTMENT PERFORMANCE
-- Calculate admissions for each department and identify the
-- Top 5 departments by patient volume.
-- ============================================================

-- 3A. Admissions handled by every department
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
ORDER BY total_admissions DESC;


-- 3B. Top 5 departments across all hospitals
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
LIMIT 5;



-- ============================================================
-- QUESTION 4: PATIENT WAITING TIME
-- Calculate the average, minimum and maximum waiting time for
-- each department, then identify the department with the
-- highest average waiting time.
-- ============================================================

-- 4A. Waiting-time statistics for every department
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
ORDER BY average_wait_minutes DESC;


-- 4B. Department with the highest average waiting time
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
JOIN admissions AS a
    ON a.department_id = d.department_id
   AND a.hospital_id = d.hospital_id
GROUP BY
    d.department_id,
    d.department_name,
    h.hospital_id,
    h.hospital_name
ORDER BY average_wait_minutes DESC
LIMIT 1;
-- ============================================================
-- QUESTION 5: WAITING-TIME BOTTLENECKS
--
-- Analytical waiting-time categories:
-- Low:      less than 30 minutes
-- Moderate: 30–59 minutes
-- High:     60–119 minutes
-- Critical: 120 minutes or longer
--
-- These are project-defined analytical thresholds.
-- ============================================================

-- 5A. Classify every admission using a CASE statement
SELECT
    a.admission_id,
    a.patient_id,
    h.hospital_name,
    d.department_name,
    a.wait_time_minutes,

    CASE
        WHEN a.wait_time_minutes < 30
            THEN 'Low'

        WHEN a.wait_time_minutes < 60
            THEN 'Moderate'

        WHEN a.wait_time_minutes < 120
            THEN 'High'

        ELSE 'Critical'
    END AS waiting_time_category

FROM admissions AS a
JOIN hospitals AS h
    ON h.hospital_id = a.hospital_id
JOIN departments AS d
    ON d.department_id = a.department_id
   AND d.hospital_id = a.hospital_id
ORDER BY
    a.wait_time_minutes DESC,
    a.admission_id;
    -- 5B. Waiting-time category counts for every department
WITH classified_admissions AS (
    SELECT
        hospital_id,
        department_id,

        CASE
            WHEN wait_time_minutes < 30
                THEN 'Low'
            WHEN wait_time_minutes < 60
                THEN 'Moderate'
            WHEN wait_time_minutes < 120
                THEN 'High'
            ELSE 'Critical'
        END AS waiting_time_category

    FROM admissions
)

SELECT
    h.hospital_name,
    d.department_name,

    SUM(
        CASE
            WHEN ca.waiting_time_category = 'Low' THEN 1
            ELSE 0
        END
    ) AS low_cases,

    SUM(
        CASE
            WHEN ca.waiting_time_category = 'Moderate' THEN 1
            ELSE 0
        END
    ) AS moderate_cases,

    SUM(
        CASE
            WHEN ca.waiting_time_category = 'High' THEN 1
            ELSE 0
        END
    ) AS high_cases,

    SUM(
        CASE
            WHEN ca.waiting_time_category = 'Critical' THEN 1
            ELSE 0
        END
    ) AS critical_cases

FROM departments AS d
JOIN hospitals AS h
    ON h.hospital_id = d.hospital_id
LEFT JOIN classified_admissions AS ca
    ON ca.department_id = d.department_id
   AND ca.hospital_id = d.hospital_id
GROUP BY
    h.hospital_id,
    h.hospital_name,
    d.department_id,
    d.department_name
ORDER BY critical_cases DESC;
-- 5C. Department with the highest number of Critical cases
SELECT
    h.hospital_name,
    d.department_name,
    COUNT(a.admission_id) AS critical_cases
FROM admissions AS a
JOIN hospitals AS h
    ON h.hospital_id = a.hospital_id
JOIN departments AS d
    ON d.department_id = a.department_id
   AND d.hospital_id = a.hospital_id
WHERE a.wait_time_minutes >= 120
GROUP BY
    h.hospital_id,
    h.hospital_name,
    d.department_id,
    d.department_name
ORDER BY critical_cases DESC
LIMIT 1;
-- ============================================================
-- QUESTION 6: LENGTH OF STAY
--
-- Length of stay is calculated from admission_date to
-- discharge_date. Admissions without a discharge date and
-- invalid negative stays are excluded.
-- ============================================================

-- 6A. Average length of stay for every department
SELECT
    d.department_id,
    d.department_name,
    h.hospital_name,
    COUNT(a.admission_id) AS discharged_admissions,

    ROUND(
        AVG(
            TIMESTAMPDIFF(
                HOUR,
                a.admission_date,
                a.discharge_date
            ) / 24.0
        ),
        2
    ) AS average_length_of_stay_days,

    ROUND(
        MIN(
            TIMESTAMPDIFF(
                HOUR,
                a.admission_date,
                a.discharge_date
            ) / 24.0
        ),
        2
    ) AS minimum_stay_days,

    ROUND(
        MAX(
            TIMESTAMPDIFF(
                HOUR,
                a.admission_date,
                a.discharge_date
            ) / 24.0
        ),
        2
    ) AS maximum_stay_days

FROM admissions AS a
JOIN hospitals AS h
    ON h.hospital_id = a.hospital_id
JOIN departments AS d
    ON d.department_id = a.department_id
   AND d.hospital_id = a.hospital_id
WHERE a.discharge_date IS NOT NULL
  AND a.discharge_date >= a.admission_date
GROUP BY
    d.department_id,
    d.department_name,
    h.hospital_id,
    h.hospital_name
ORDER BY average_length_of_stay_days DESC;

-- 6B. Department with the longest average length of stay
SELECT
    d.department_id,
    d.department_name,
    h.hospital_name,
    COUNT(a.admission_id) AS discharged_admissions,

    ROUND(
        AVG(
            TIMESTAMPDIFF(
                HOUR,
                a.admission_date,
                a.discharge_date
            ) / 24.0
        ),
        2
    ) AS average_length_of_stay_days

FROM admissions AS a
JOIN hospitals AS h
    ON h.hospital_id = a.hospital_id
JOIN departments AS d
    ON d.department_id = a.department_id
   AND d.hospital_id = a.hospital_id
WHERE a.discharge_date IS NOT NULL
  AND a.discharge_date >= a.admission_date
GROUP BY
    d.department_id,
    d.department_name,
    h.hospital_id,
    h.hospital_name
ORDER BY average_length_of_stay_days DESC
LIMIT 1;


-- ============================================================
-- QUESTION 7: READMISSION RATE
-- Calculate the overall readmission rate and compare the rate
-- across hospitals and departments.
--
-- Formula:
-- Readmission rate = readmissions / total admissions × 100
-- ============================================================

-- 7A. Overall readmission rate for the complete dataset
SELECT
    COUNT(admission_id) AS total_admissions,

    SUM(
        CASE
            WHEN readmission_flag = 1 THEN 1
            ELSE 0
        END
    ) AS total_readmissions,

    ROUND(
        100.0 *
        SUM(
            CASE
                WHEN readmission_flag = 1 THEN 1
                ELSE 0
            END
        ) /
        NULLIF(COUNT(admission_id), 0),
        2
    ) AS overall_readmission_rate_percent

FROM admissions;
-- 7B. Compare readmission rates across hospitals
SELECT
    h.hospital_id,
    h.hospital_name,
    COUNT(a.admission_id) AS total_admissions,

    SUM(
        CASE
            WHEN a.readmission_flag = 1 THEN 1
            ELSE 0
        END
    ) AS total_readmissions,

    ROUND(
        100.0 *
        SUM(
            CASE
                WHEN a.readmission_flag = 1 THEN 1
                ELSE 0
            END
        ) /
        NULLIF(COUNT(a.admission_id), 0),
        2
    ) AS readmission_rate_percent

FROM hospitals AS h
LEFT JOIN admissions AS a
    ON a.hospital_id = h.hospital_id
GROUP BY
    h.hospital_id,
    h.hospital_name
ORDER BY readmission_rate_percent DESC;
-- 7C. Compare readmission rates across departments
SELECT
    d.department_id,
    d.department_name,
    h.hospital_name,
    COUNT(a.admission_id) AS total_admissions,

    SUM(
        CASE
            WHEN a.readmission_flag = 1 THEN 1
            ELSE 0
        END
    ) AS total_readmissions,

    ROUND(
        100.0 *
        SUM(
            CASE
                WHEN a.readmission_flag = 1 THEN 1
                ELSE 0
            END
        ) /
        NULLIF(COUNT(a.admission_id), 0),
        2
    ) AS readmission_rate_percent

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
ORDER BY readmission_rate_percent DESC;
-- ============================================================
-- QUESTION 8: PATIENT READMISSION ANALYSIS
-- Identify patients admitted multiple times and rank them by
-- their total number of admissions.
--
-- HAVING excludes patients with only one admission.
-- DENSE_RANK gives the same rank to equal admission counts.
-- ============================================================

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
    JOIN admissions AS a
        ON a.patient_id = p.patient_id
    GROUP BY
        p.patient_id,
        p.patient_name,
        p.gender,
        p.city
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

    DENSE_RANK() OVER (
        ORDER BY total_admissions DESC
    ) AS admission_rank

FROM patient_admission_summary
ORDER BY
    admission_rank,
    patient_id;
    -- 8B. Patients with readmission-flagged records
SELECT
    p.patient_id,
    p.patient_name,
    COUNT(a.admission_id) AS total_admissions,

    SUM(
        CASE
            WHEN a.readmission_flag = 1 THEN 1
            ELSE 0
        END
    ) AS flagged_readmissions

FROM patients AS p
JOIN admissions AS a
    ON a.patient_id = p.patient_id
GROUP BY
    p.patient_id,
    p.patient_name
HAVING SUM(
    CASE
        WHEN a.readmission_flag = 1 THEN 1
        ELSE 0
    END
) > 0
ORDER BY
    flagged_readmissions DESC,
    total_admissions DESC;
    
    -- ============================================================
-- QUESTION 9: BED UTILIZATION
-- Calculate utilization for every department and identify
-- departments with utilization above 90%.
--
-- Formula:
-- Occupied beds / (occupied beds + available beds) × 100
-- ============================================================

-- 9A. Bed utilization for every department
SELECT
    d.department_id,
    d.department_name,
    h.hospital_name,
    COUNT(bo.occupancy_id) AS occupancy_records,

    SUM(bo.occupied_beds) AS total_occupied_bed_observations,
    SUM(bo.available_beds) AS total_available_bed_observations,

    ROUND(
        100.0 * SUM(bo.occupied_beds) /
        NULLIF(
            SUM(bo.occupied_beds) + SUM(bo.available_beds),
            0
        ),
        2
    ) AS bed_utilization_percent,

    CASE
        WHEN
            100.0 * SUM(bo.occupied_beds) /
            NULLIF(
                SUM(bo.occupied_beds) + SUM(bo.available_beds),
                0
            ) > 90
        THEN 'Critical'
        ELSE 'Normal'
    END AS utilization_status

FROM departments AS d
JOIN hospitals AS h
    ON h.hospital_id = d.hospital_id
LEFT JOIN bed_occupancy AS bo
    ON bo.department_id = d.department_id
   AND bo.hospital_id = d.hospital_id
GROUP BY
    d.department_id,
    d.department_name,
    h.hospital_id,
    h.hospital_name
ORDER BY bed_utilization_percent DESC;

-- 9B. Departments with Critical utilization above 90%
SELECT
    d.department_id,
    d.department_name,
    h.hospital_name,

    ROUND(
        100.0 * SUM(bo.occupied_beds) /
        NULLIF(
            SUM(bo.occupied_beds) + SUM(bo.available_beds),
            0
        ),
        2
    ) AS bed_utilization_percent,

    'Critical' AS utilization_status

FROM bed_occupancy AS bo
JOIN hospitals AS h
    ON h.hospital_id = bo.hospital_id
JOIN departments AS d
    ON d.department_id = bo.department_id
   AND d.hospital_id = bo.hospital_id
GROUP BY
    d.department_id,
    d.department_name,
    h.hospital_id,
    h.hospital_name
HAVING
    100.0 * SUM(bo.occupied_beds) /
    NULLIF(
        SUM(bo.occupied_beds) + SUM(bo.available_beds),
        0
    ) > 90
ORDER BY bed_utilization_percent DESC;





-- ============================================================
-- QUESTION 10: HOSPITAL AND DEPARTMENT ANALYSIS USING JOINS
--
-- Creates a department-level report containing:
-- hospital, department, total beds, admissions, average waiting
-- time and average bed utilization.
--
-- Admission and occupancy records are aggregated separately
-- because directly joining both fact tables would multiply rows.
-- ============================================================

SELECT
    h.hospital_name,
    d.department_name,
    d.total_beds,
    COALESCE(am.total_admissions, 0) AS total_admissions,
    am.average_wait_minutes,
    bm.average_bed_utilization_percent

FROM departments AS d

JOIN hospitals AS h
    ON h.hospital_id = d.hospital_id

LEFT JOIN (
    SELECT
        hospital_id,
        department_id,
        COUNT(admission_id) AS total_admissions,
        ROUND(AVG(wait_time_minutes), 2) AS average_wait_minutes
    FROM admissions
    GROUP BY
        hospital_id,
        department_id
) AS am
    ON am.hospital_id = d.hospital_id
   AND am.department_id = d.department_id

LEFT JOIN (
    SELECT
        hospital_id,
        department_id,

        ROUND(
            100.0 * SUM(occupied_beds) /
            NULLIF(
                SUM(occupied_beds) + SUM(available_beds),
                0
            ),
            2
        ) AS average_bed_utilization_percent

    FROM bed_occupancy
    GROUP BY
        hospital_id,
        department_id
) AS bm
    ON bm.hospital_id = d.hospital_id
   AND bm.department_id = d.department_id

ORDER BY
    h.hospital_name,
    total_admissions DESC;

-- ============================================================
-- QUESTION 11: DEPARTMENTS ABOVE THE OVERALL WAITING AVERAGE
--
-- Uses a scalar subquery and HAVING to return departments whose
-- average waiting time exceeds the database-wide average.
-- ============================================================
SELECT
    h.hospital_name,
    d.department_name,
    COUNT(a.admission_id) AS total_admissions,
    ROUND(AVG(a.wait_time_minutes), 2) AS department_average_wait,
    ROUND(
        (
            SELECT AVG(all_a.wait_time_minutes)
            FROM admissions AS all_a
        ),
        2
    ) AS overall_average_wait

FROM admissions AS a
JOIN departments AS d
    ON d.department_id = a.department_id
   AND d.hospital_id = a.hospital_id
JOIN hospitals AS h
    ON h.hospital_id = a.hospital_id

GROUP BY
    h.hospital_id,
    h.hospital_name,
    d.department_id,
    d.department_name

HAVING AVG(a.wait_time_minutes) > (
    SELECT AVG(all_a.wait_time_minutes)
    FROM admissions AS all_a
)

ORDER BY department_average_wait DESC;
-- ============================================================
-- QUESTION 12: DEPARTMENT PERFORMANCE USING A CTE
--
-- Calculates department-level:
-- 1. Admission volume
-- 2. Average waiting time
-- 3. Average length of stay
-- 4. Readmission rate
--
-- Project-defined attention criteria:
--
-- High Attention:
-- Average waiting time >= 90 minutes
-- AND readmission rate >= 30%
--
-- Moderate Attention:
-- Average waiting time >= 60 minutes
-- OR readmission rate >= 25%
--
-- Normal:
-- Neither of the above conditions is met.
--
-- These thresholds are analytical rules created specifically
-- for this synthetic educational project.
-- ============================================================

WITH department_performance AS (
    SELECT
        a.hospital_id,
        a.department_id,

        -- Total admissions handled by the department
        COUNT(a.admission_id) AS total_admissions,

        -- Average patient waiting time
        ROUND(
            AVG(a.wait_time_minutes),
            2
        ) AS average_wait_minutes,

        -- Average length of stay for discharged patients
        ROUND(
            AVG(
                CASE
                    WHEN a.discharge_date IS NOT NULL
                     AND a.discharge_date >= a.admission_date
                    THEN TIMESTAMPDIFF(
                        HOUR,
                        a.admission_date,
                        a.discharge_date
                    ) / 24.0
                    ELSE NULL
                END
            ),
            2
        ) AS average_length_of_stay_days,

        -- Percentage of admissions marked as readmissions
        ROUND(
            100.0 *
            SUM(
                CASE
                    WHEN a.readmission_flag = 1 THEN 1
                    ELSE 0
                END
            ) /
            NULLIF(COUNT(a.admission_id), 0),
            2
        ) AS readmission_rate_percent

    FROM admissions AS a

    GROUP BY
        a.hospital_id,
        a.department_id
)

SELECT
    h.hospital_name,
    d.department_name,
    dp.total_admissions,
    dp.average_wait_minutes,
    dp.average_length_of_stay_days,
    dp.readmission_rate_percent,

    -- Assign an operational-attention category
    CASE
        WHEN dp.average_wait_minutes >= 90
         AND dp.readmission_rate_percent >= 30
            THEN 'High Attention'

        WHEN dp.average_wait_minutes >= 60
          OR dp.readmission_rate_percent >= 25
            THEN 'Moderate Attention'

        ELSE 'Normal'
    END AS attention_status

FROM department_performance AS dp

JOIN hospitals AS h
    ON h.hospital_id = dp.hospital_id

JOIN departments AS d
    ON d.department_id = dp.department_id
   AND d.hospital_id = dp.hospital_id

ORDER BY
    -- Show High Attention departments first
    CASE
        WHEN dp.average_wait_minutes >= 90
         AND dp.readmission_rate_percent >= 30
            THEN 1

        WHEN dp.average_wait_minutes >= 60
          OR dp.readmission_rate_percent >= 25
            THEN 2

        ELSE 3
    END,

    dp.average_wait_minutes DESC,
    dp.readmission_rate_percent DESC;
    


-- ============================================================
-- QUESTION 13: DEPARTMENT RANKING USING WINDOW FUNCTIONS
--
-- This query demonstrates:
-- 1. ROW_NUMBER()
-- 2. RANK()
-- 3. DENSE_RANK()
-- 4. PARTITION BY
--
-- Departments are evaluated using:
-- 1. Average patient waiting time
-- 2. Readmission rate
-- 3. Bed-utilization percentage
--
-- Higher values receive better numerical priority:
-- Rank 1 represents the highest value and therefore the area
-- requiring the greatest operational attention.
-- ============================================================


-- ------------------------------------------------------------
-- CTE 1: Calculate admission-based department metrics
-- ------------------------------------------------------------

WITH admission_metrics AS (
    SELECT
        a.hospital_id,
        a.department_id,
        COUNT(a.admission_id) AS total_admissions,

        -- Average patient waiting time
        ROUND(
            AVG(a.wait_time_minutes),
            2
        ) AS average_wait_minutes,

        -- Department readmission rate
        ROUND(
            100.0 *
            SUM(
                CASE
                    WHEN a.readmission_flag = 1 THEN 1
                    ELSE 0
                END
            ) /
            NULLIF(COUNT(a.admission_id), 0),
            2
        ) AS readmission_rate_percent

    FROM admissions AS a

    GROUP BY
        a.hospital_id,
        a.department_id
),


-- ------------------------------------------------------------
-- CTE 2: Calculate department bed utilization
--
-- Formula:
-- occupied beds / (occupied beds + available beds) × 100
-- ------------------------------------------------------------

bed_metrics AS (
    SELECT
        bo.hospital_id,
        bo.department_id,

        ROUND(
            100.0 * SUM(bo.occupied_beds) /
            NULLIF(
                SUM(bo.occupied_beds) +
                SUM(bo.available_beds),
                0
            ),
            2
        ) AS bed_utilization_percent

    FROM bed_occupancy AS bo

    GROUP BY
        bo.hospital_id,
        bo.department_id
),


-- ------------------------------------------------------------
-- CTE 3: Combine admission, hospital, department and bed data
-- ------------------------------------------------------------

department_metrics AS (
    SELECT
        h.hospital_id,
        h.hospital_name,
        d.department_id,
        d.department_name,
        am.total_admissions,
        am.average_wait_minutes,
        am.readmission_rate_percent,
        bm.bed_utilization_percent

    FROM departments AS d

    JOIN hospitals AS h
        ON h.hospital_id = d.hospital_id

    LEFT JOIN admission_metrics AS am
        ON am.hospital_id = d.hospital_id
       AND am.department_id = d.department_id

    LEFT JOIN bed_metrics AS bm
        ON bm.hospital_id = d.hospital_id
       AND bm.department_id = d.department_id
)


-- ------------------------------------------------------------
-- Final result: Apply all required window functions
-- ------------------------------------------------------------

SELECT
    hospital_name,
    department_id,
    department_name,
    total_admissions,
    average_wait_minutes,

    -- ROW_NUMBER assigns a unique sequential number.
    -- Equal waiting times still receive different row numbers.
    ROW_NUMBER() OVER (
        ORDER BY average_wait_minutes DESC
    ) AS waiting_row_number,

    readmission_rate_percent,

    -- RANK gives equal values the same rank and may leave gaps.
    RANK() OVER (
        ORDER BY readmission_rate_percent DESC
    ) AS readmission_rank,

    bed_utilization_percent,

    -- DENSE_RANK gives equal values the same rank without gaps.
    DENSE_RANK() OVER (
        ORDER BY bed_utilization_percent DESC
    ) AS bed_utilization_rank,

    -- PARTITION BY restarts the waiting-time ranking
    -- separately for every hospital.
    DENSE_RANK() OVER (
        PARTITION BY hospital_id
        ORDER BY average_wait_minutes DESC
    ) AS waiting_rank_within_hospital

FROM department_metrics

ORDER BY
    waiting_row_number,
    readmission_rank,
    bed_utilization_rank;

-- ============================================================
-- QUESTION 14: PATIENT-FLOW BOTTLENECK ANALYSIS
--
-- Combines:
-- 1. Average waiting time
-- 2. Average length of stay
-- 3. Readmission rate
-- 4. Bed utilization
--
-- PERCENT_RANK normalizes each measure to a value between
-- 0 and 1, allowing metrics with different units to be combined.
--
-- Higher values indicate greater operational pressure.
-- The final score is reported on a 0–100 scale.
-- ============================================================

WITH admission_metrics AS (
    SELECT
        hospital_id,
        department_id,
        COUNT(admission_id) AS total_admissions,
        ROUND(AVG(wait_time_minutes), 2) AS average_wait_minutes,

        ROUND(
            AVG(
                CASE
                    WHEN discharge_date IS NOT NULL
                     AND discharge_date >= admission_date
                    THEN TIMESTAMPDIFF(
                        HOUR,
                        admission_date,
                        discharge_date
                    ) / 24.0
                END
            ),
            2
        ) AS average_length_of_stay_days,

        ROUND(
            100.0 *
            SUM(
                CASE
                    WHEN readmission_flag = 1 THEN 1
                    ELSE 0
                END
            ) /
            NULLIF(COUNT(admission_id), 0),
            2
        ) AS readmission_rate_percent

    FROM admissions
    GROUP BY
        hospital_id,
        department_id
),

bed_metrics AS (
    SELECT
        hospital_id,
        department_id,

        ROUND(
            100.0 * SUM(occupied_beds) /
            NULLIF(
                SUM(occupied_beds) + SUM(available_beds),
                0
            ),
            2
        ) AS bed_utilization_percent

    FROM bed_occupancy
    GROUP BY
        hospital_id,
        department_id
),

combined_metrics AS (
    SELECT
        h.hospital_name,
        d.department_id,
        d.department_name,
        am.total_admissions,
        am.average_wait_minutes,
        am.average_length_of_stay_days,
        am.readmission_rate_percent,
        bm.bed_utilization_percent

    FROM departments AS d
    JOIN hospitals AS h
        ON h.hospital_id = d.hospital_id
    JOIN admission_metrics AS am
        ON am.hospital_id = d.hospital_id
       AND am.department_id = d.department_id
    JOIN bed_metrics AS bm
        ON bm.hospital_id = d.hospital_id
       AND bm.department_id = d.department_id
),

normalized_metrics AS (
    SELECT
        combined_metrics.*,

        PERCENT_RANK() OVER (
            ORDER BY average_wait_minutes
        ) AS waiting_score,

        PERCENT_RANK() OVER (
            ORDER BY average_length_of_stay_days
        ) AS stay_score,

        PERCENT_RANK() OVER (
            ORDER BY readmission_rate_percent
        ) AS readmission_score,

        PERCENT_RANK() OVER (
            ORDER BY bed_utilization_percent
        ) AS utilization_score

    FROM combined_metrics
),

bottleneck_results AS (
    SELECT
        normalized_metrics.*,

        ROUND(
            100.0 * (
                waiting_score +
                stay_score +
                readmission_score +
                utilization_score
            ) / 4,
            2
        ) AS bottleneck_score

    FROM normalized_metrics
)

SELECT
    hospital_name,
    department_id,
    department_name,
    total_admissions,
    average_wait_minutes,
    average_length_of_stay_days,
    readmission_rate_percent,
    bed_utilization_percent,
    bottleneck_score,

    DENSE_RANK() OVER (
        ORDER BY bottleneck_score DESC
    ) AS bottleneck_rank

FROM bottleneck_results
ORDER BY
    bottleneck_score DESC,
    average_wait_minutes DESC
LIMIT 5;







-- ============================================================
-- QUESTION 15: QUERY OPTIMIZATION
--
-- Query selected:
-- Department-level hospital performance report.
--
-- Performance issue:
-- The original query uses correlated subqueries. These may
-- repeatedly access admissions and bed_occupancy for every
-- department.
--
-- Optimization:
-- 1. Add composite indexes.
-- 2. Aggregate each large table once using CTEs.
-- 3. Join the summarized results.
-- 4. Compare execution plans using EXPLAIN.
-- ============================================================


-- ============================================================
-- STEP 1: EXECUTION PLAN BEFORE OPTIMIZATION
-- ============================================================

EXPLAIN

SELECT
    h.hospital_name,
    d.department_name,
    d.total_beds,

    -- Repeated correlated subquery for admission count
    (
        SELECT COUNT(a.admission_id)
        FROM admissions AS a
        WHERE a.hospital_id = d.hospital_id
          AND a.department_id = d.department_id
    ) AS total_admissions,

    -- Repeated correlated subquery for waiting time
    (
        SELECT ROUND(
            AVG(a.wait_time_minutes),
            2
        )
        FROM admissions AS a
        WHERE a.hospital_id = d.hospital_id
          AND a.department_id = d.department_id
    ) AS average_wait_minutes,

    -- Repeated correlated subquery for bed utilization
    (
        SELECT ROUND(
            100.0 * SUM(bo.occupied_beds) /
            NULLIF(
                SUM(bo.occupied_beds) +
                SUM(bo.available_beds),
                0
            ),
            2
        )
        FROM bed_occupancy AS bo
        WHERE bo.hospital_id = d.hospital_id
          AND bo.department_id = d.department_id
    ) AS bed_utilization_percent

FROM departments AS d

JOIN hospitals AS h
    ON h.hospital_id = d.hospital_id

ORDER BY
    h.hospital_name,
    d.department_name;


-- ============================================================
-- STEP 2: DISPLAY EXISTING INDEXES
-- ============================================================

SHOW INDEX FROM admissions;
SHOW INDEX FROM bed_occupancy;


-- ============================================================
-- STEP 3: CREATE COMPOSITE INDEX ON ADMISSIONS
--
-- Dynamic SQL prevents a duplicate-index-name error when this
-- complete script is executed more than once.
-- ============================================================

SET @admissions_index_sql = (
    SELECT
        CASE
            WHEN COUNT(*) = 0 THEN
                'CREATE INDEX idx_admissions_hospital_department
                 ON admissions (hospital_id, department_id)'
            ELSE
                'SELECT ''Admissions index already exists''
                 AS index_status'
        END
    FROM information_schema.statistics
    WHERE table_schema = 'apollo_patient_flow'
      AND table_name = 'admissions'
      AND index_name = 'idx_admissions_hospital_department'
);

PREPARE admissions_index_statement
FROM @admissions_index_sql;

EXECUTE admissions_index_statement;

DEALLOCATE PREPARE admissions_index_statement;


-- ============================================================
-- STEP 4: CREATE COMPOSITE INDEX ON BED_OCCUPANCY
-- ============================================================

SET @beds_index_sql = (
    SELECT
        CASE
            WHEN COUNT(*) = 0 THEN
                'CREATE INDEX idx_beds_hospital_department
                 ON bed_occupancy (hospital_id, department_id)'
            ELSE
                'SELECT ''Bed-occupancy index already exists''
                 AS index_status'
        END
    FROM information_schema.statistics
    WHERE table_schema = 'apollo_patient_flow'
      AND table_name = 'bed_occupancy'
      AND index_name = 'idx_beds_hospital_department'
);

PREPARE beds_index_statement
FROM @beds_index_sql;

EXECUTE beds_index_statement;

DEALLOCATE PREPARE beds_index_statement;


-- ============================================================
-- STEP 5: UPDATE MYSQL OPTIMIZER STATISTICS
-- ============================================================

ANALYZE TABLE admissions;
ANALYZE TABLE bed_occupancy;


-- ============================================================
-- STEP 6: VERIFY THE INDEXES
-- ============================================================

SHOW INDEX FROM admissions
WHERE Key_name = 'idx_admissions_hospital_department';

SHOW INDEX FROM bed_occupancy
WHERE Key_name = 'idx_beds_hospital_department';


-- ============================================================
-- STEP 7: EXECUTION PLAN AFTER OPTIMIZATION
--
-- admissions and bed_occupancy are each aggregated once.
-- The small summarized results are then joined.
-- ============================================================

EXPLAIN

WITH admission_metrics AS (
    SELECT
        a.hospital_id,
        a.department_id,
        COUNT(a.admission_id) AS total_admissions,

        ROUND(
            AVG(a.wait_time_minutes),
            2
        ) AS average_wait_minutes

    FROM admissions AS a

    GROUP BY
        a.hospital_id,
        a.department_id
),

bed_metrics AS (
    SELECT
        bo.hospital_id,
        bo.department_id,

        ROUND(
            100.0 * SUM(bo.occupied_beds) /
            NULLIF(
                SUM(bo.occupied_beds) +
                SUM(bo.available_beds),
                0
            ),
            2
        ) AS bed_utilization_percent

    FROM bed_occupancy AS bo

    GROUP BY
        bo.hospital_id,
        bo.department_id
)

SELECT
    h.hospital_name,
    d.department_name,
    d.total_beds,
    COALESCE(am.total_admissions, 0) AS total_admissions,
    am.average_wait_minutes,
    bm.bed_utilization_percent

FROM departments AS d

JOIN hospitals AS h
    ON h.hospital_id = d.hospital_id

LEFT JOIN admission_metrics AS am
    ON am.hospital_id = d.hospital_id
   AND am.department_id = d.department_id

LEFT JOIN bed_metrics AS bm
    ON bm.hospital_id = d.hospital_id
   AND bm.department_id = d.department_id

ORDER BY
    h.hospital_name,
    d.department_name;


-- ============================================================
-- STEP 8: DISPLAY THE OPTIMIZED QUERY RESULT
--
-- This is the same optimized query without EXPLAIN, so the
-- actual department report appears in the Result Grid.
-- ============================================================

WITH admission_metrics AS (
    SELECT
        a.hospital_id,
        a.department_id,
        COUNT(a.admission_id) AS total_admissions,

        ROUND(
            AVG(a.wait_time_minutes),
            2
        ) AS average_wait_minutes

    FROM admissions AS a

    GROUP BY
        a.hospital_id,
        a.department_id
),

bed_metrics AS (
    SELECT
        bo.hospital_id,
        bo.department_id,

        ROUND(
            100.0 * SUM(bo.occupied_beds) /
            NULLIF(
                SUM(bo.occupied_beds) +
                SUM(bo.available_beds),
                0
            ),
            2
        ) AS bed_utilization_percent

    FROM bed_occupancy AS bo

    GROUP BY
        bo.hospital_id,
        bo.department_id
)

SELECT
    h.hospital_name,
    d.department_name,
    d.total_beds,
    COALESCE(am.total_admissions, 0) AS total_admissions,
    am.average_wait_minutes,
    bm.bed_utilization_percent

FROM departments AS d

JOIN hospitals AS h
    ON h.hospital_id = d.hospital_id

LEFT JOIN admission_metrics AS am
    ON am.hospital_id = d.hospital_id
   AND am.department_id = d.department_id

LEFT JOIN bed_metrics AS bm
    ON bm.hospital_id = d.hospital_id
   AND bm.department_id = d.department_id

ORDER BY
    h.hospital_name,
    d.department_name;
