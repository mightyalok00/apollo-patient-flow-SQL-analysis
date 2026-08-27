import { QueryExecutionResult } from '../types';
import { HOSPITALS, DEPARTMENTS, DOCTORS, DEPARTMENT_BOTTLENECKS } from './hospitalData';
import { SAMPLE_PATIENTS, SAMPLE_ADMISSIONS, SAMPLE_BED_OCCUPANCY } from './sampleDataset';

export function executePredefinedQuery(questionNumber: number): QueryExecutionResult {
  const startTime = performance.now();

  switch (questionNumber) {
    case 1: {
      const rows = [
        { table_name: 'hospitals', total_records: HOSPITALS.length },
        { table_name: 'departments', total_records: DEPARTMENTS.length },
        { table_name: 'patients', total_records: SAMPLE_PATIENTS.length },
        { table_name: 'doctors', total_records: DOCTORS.length },
        { table_name: 'admissions', total_records: SAMPLE_ADMISSIONS.length },
        { table_name: 'bed_occupancy', total_records: SAMPLE_BED_OCCUPANCY.length },
      ];
      return {
        columns: ['table_name', 'total_records'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 1.2).toFixed(2),
        query: 'SELECT table_name, total_records FROM information_schema.tables...',
      };
    }

    case 2: {
      const rows = [
        { hospital_id: 4, hospital_name: 'Apollo Hyderabad', city: 'Hyderabad', total_admissions: 654 },
        { hospital_id: 2, hospital_name: 'Apollo Mumbai', city: 'Mumbai', total_admissions: 631 },
        { hospital_id: 1, hospital_name: 'Apollo Delhi', city: 'Delhi', total_admissions: 630 },
        { hospital_id: 3, hospital_name: 'Apollo Bangalore', city: 'Bangalore', total_admissions: 585 },
      ];
      return {
        columns: ['hospital_id', 'hospital_name', 'city', 'total_admissions'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 2.1).toFixed(2),
        query: 'SELECT h.hospital_id, h.hospital_name, h.city, COUNT(a.admission_id)...',
      };
    }

    case 3: {
      const rows = [
        { department_id: 18, department_name: 'Orthopedics', hospital_name: 'Apollo Hyderabad', total_admissions: 137 },
        { department_id: 19, department_name: 'General Medicine', hospital_name: 'Apollo Hyderabad', total_admissions: 135 },
        { department_id: 4, department_name: 'General Medicine', hospital_name: 'Apollo Delhi', total_admissions: 134 },
        { department_id: 3, department_name: 'Orthopedics', hospital_name: 'Apollo Delhi', total_admissions: 130 },
        { department_id: 7, department_name: 'Cardiology', hospital_name: 'Apollo Mumbai', total_admissions: 129 },
      ];
      return {
        columns: ['department_id', 'department_name', 'hospital_name', 'total_admissions'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 3.4).toFixed(2),
        query: 'SELECT d.department_id, d.department_name, h.hospital_name, COUNT(a.admission_id)... LIMIT 5;',
      };
    }

    case 4: {
      const rows = [
        { department_id: 11, department_name: 'Emergency', hospital_name: 'Apollo Bangalore', total_admissions: 121, minimum_wait_minutes: 85, average_wait_minutes: 106.71, maximum_wait_minutes: 148 },
        { department_id: 1, department_name: 'Emergency', hospital_name: 'Apollo Delhi', total_admissions: 114, minimum_wait_minutes: 82, average_wait_minutes: 103.78, maximum_wait_minutes: 142 },
        { department_id: 16, department_name: 'Emergency', hospital_name: 'Apollo Hyderabad', total_admissions: 123, minimum_wait_minutes: 80, average_wait_minutes: 101.45, maximum_wait_minutes: 139 },
        { department_id: 6, department_name: 'Emergency', hospital_name: 'Apollo Mumbai', total_admissions: 128, minimum_wait_minutes: 78, average_wait_minutes: 99.63, maximum_wait_minutes: 135 },
        { department_id: 19, department_name: 'General Medicine', hospital_name: 'Apollo Hyderabad', total_admissions: 135, minimum_wait_minutes: 18, average_wait_minutes: 54.10, maximum_wait_minutes: 88 },
        { department_id: 3, department_name: 'Orthopedics', hospital_name: 'Apollo Delhi', total_admissions: 130, minimum_wait_minutes: 15, average_wait_minutes: 53.40, maximum_wait_minutes: 85 },
        { department_id: 18, department_name: 'Orthopedics', hospital_name: 'Apollo Hyderabad', total_admissions: 137, minimum_wait_minutes: 16, average_wait_minutes: 52.80, maximum_wait_minutes: 84 },
        { department_id: 4, department_name: 'General Medicine', hospital_name: 'Apollo Delhi', total_admissions: 134, minimum_wait_minutes: 15, average_wait_minutes: 51.90, maximum_wait_minutes: 82 },
        { department_id: 7, department_name: 'Cardiology', hospital_name: 'Apollo Mumbai', total_admissions: 129, minimum_wait_minutes: 12, average_wait_minutes: 48.70, maximum_wait_minutes: 78 },
        { department_id: 15, department_name: 'Neurology', hospital_name: 'Apollo Bangalore', total_admissions: 110, minimum_wait_minutes: 10, average_wait_minutes: 45.20, maximum_wait_minutes: 75 },
      ];
      return {
        columns: ['department_id', 'department_name', 'hospital_name', 'total_admissions', 'minimum_wait_minutes', 'average_wait_minutes', 'maximum_wait_minutes'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 4.1).toFixed(2),
        query: 'SELECT d.department_id, d.department_name, h.hospital_name, MIN, AVG, MAX...',
      };
    }

    case 5: {
      const rows = [
        { hospital_name: 'Apollo Bangalore', department_name: 'Emergency', low_cases: 0, moderate_cases: 2, high_cases: 88, critical_cases: 31 },
        { hospital_name: 'Apollo Delhi', department_name: 'Emergency', low_cases: 0, moderate_cases: 3, high_cases: 83, critical_cases: 28 },
        { hospital_name: 'Apollo Hyderabad', department_name: 'Emergency', low_cases: 0, moderate_cases: 4, high_cases: 94, critical_cases: 25 },
        { hospital_name: 'Apollo Mumbai', department_name: 'Emergency', low_cases: 0, moderate_cases: 5, high_cases: 101, critical_cases: 22 },
        { hospital_name: 'Apollo Hyderabad', department_name: 'General Medicine', low_cases: 18, moderate_cases: 84, high_cases: 33, critical_cases: 0 },
        { hospital_name: 'Apollo Delhi', department_name: 'Orthopedics', low_cases: 21, moderate_cases: 79, high_cases: 30, critical_cases: 0 },
        { hospital_name: 'Apollo Mumbai', department_name: 'Cardiology', low_cases: 29, moderate_cases: 82, high_cases: 18, critical_cases: 0 },
        { hospital_name: 'Apollo Bangalore', department_name: 'Neurology', low_cases: 33, moderate_cases: 65, high_cases: 12, critical_cases: 0 },
      ];
      return {
        columns: ['hospital_name', 'department_name', 'low_cases', 'moderate_cases', 'high_cases', 'critical_cases'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 3.8).toFixed(2),
        query: 'WITH classified_admissions AS (...) SELECT hospital_name, department_name, SUM(CASE WHEN ...)...',
      };
    }

    case 6: {
      const rows = [
        { department_id: 1, department_name: 'Emergency', hospital_name: 'Apollo Delhi', discharged_admissions: 114, average_length_of_stay_days: 4.80, minimum_stay_days: 1.20, maximum_stay_days: 8.50 },
        { department_id: 3, department_name: 'Orthopedics', hospital_name: 'Apollo Delhi', discharged_admissions: 130, average_length_of_stay_days: 4.65, minimum_stay_days: 1.80, maximum_stay_days: 9.10 },
        { department_id: 16, department_name: 'Emergency', hospital_name: 'Apollo Hyderabad', discharged_admissions: 123, average_length_of_stay_days: 4.62, minimum_stay_days: 1.10, maximum_stay_days: 8.20 },
        { department_id: 11, department_name: 'Emergency', hospital_name: 'Apollo Bangalore', discharged_admissions: 121, average_length_of_stay_days: 4.58, minimum_stay_days: 1.00, maximum_stay_days: 8.00 },
        { department_id: 6, department_name: 'Emergency', hospital_name: 'Apollo Mumbai', discharged_admissions: 128, average_length_of_stay_days: 4.51, minimum_stay_days: 1.15, maximum_stay_days: 7.90 },
        { department_id: 18, department_name: 'Orthopedics', hospital_name: 'Apollo Hyderabad', discharged_admissions: 137, average_length_of_stay_days: 4.48, minimum_stay_days: 1.50, maximum_stay_days: 8.80 },
        { department_id: 4, department_name: 'General Medicine', hospital_name: 'Apollo Delhi', discharged_admissions: 134, average_length_of_stay_days: 4.42, minimum_stay_days: 1.40, maximum_stay_days: 8.10 },
        { department_id: 19, department_name: 'General Medicine', hospital_name: 'Apollo Hyderabad', discharged_admissions: 135, average_length_of_stay_days: 4.35, minimum_stay_days: 1.30, maximum_stay_days: 7.80 },
        { department_id: 7, department_name: 'Cardiology', hospital_name: 'Apollo Mumbai', discharged_admissions: 129, average_length_of_stay_days: 4.25, minimum_stay_days: 1.20, maximum_stay_days: 7.50 },
        { department_id: 15, department_name: 'Neurology', hospital_name: 'Apollo Bangalore', discharged_admissions: 110, average_length_of_stay_days: 4.10, minimum_stay_days: 1.10, maximum_stay_days: 7.20 },
      ];
      return {
        columns: ['department_id', 'department_name', 'hospital_name', 'discharged_admissions', 'average_length_of_stay_days', 'minimum_stay_days', 'maximum_stay_days'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 4.5).toFixed(2),
        query: 'SELECT d.department_id, d.department_name, h.hospital_name, ROUND(AVG(TIMESTAMPDIFF(...)))',
      };
    }

    case 7: {
      const rows = [
        { department_id: 3, department_name: 'Orthopedics', hospital_name: 'Apollo Delhi', total_admissions: 130, total_readmissions: 53, readmission_rate_percent: 40.77 },
        { department_id: 1, department_name: 'Emergency', hospital_name: 'Apollo Delhi', total_admissions: 114, total_readmissions: 43, readmission_rate_percent: 37.72 },
        { department_id: 16, department_name: 'Emergency', hospital_name: 'Apollo Hyderabad', total_admissions: 123, total_readmissions: 46, readmission_rate_percent: 37.40 },
        { department_id: 18, department_name: 'Orthopedics', hospital_name: 'Apollo Hyderabad', total_admissions: 137, total_readmissions: 50, readmission_rate_percent: 36.50 },
        { department_id: 6, department_name: 'Emergency', hospital_name: 'Apollo Mumbai', total_admissions: 128, total_readmissions: 45, readmission_rate_percent: 35.16 },
        { department_id: 11, department_name: 'Emergency', hospital_name: 'Apollo Bangalore', total_admissions: 121, total_readmissions: 42, readmission_rate_percent: 34.71 },
        { department_id: 19, department_name: 'General Medicine', hospital_name: 'Apollo Hyderabad', total_admissions: 135, total_readmissions: 46, readmission_rate_percent: 34.07 },
        { department_id: 4, department_name: 'General Medicine', hospital_name: 'Apollo Delhi', total_admissions: 134, total_readmissions: 45, readmission_rate_percent: 33.58 },
      ];
      return {
        columns: ['department_id', 'department_name', 'hospital_name', 'total_admissions', 'total_readmissions', 'readmission_rate_percent'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 3.9).toFixed(2),
        query: 'SELECT d.department_id, d.department_name, h.hospital_name, COUNT, SUM, ROUND(100.0 * ...)',
      };
    }

    case 8: {
      const rows = [
        { patient_id: 42, patient_name: 'Patient_0042', gender: 'Female', patient_city: 'Bangalore', total_admissions: 11, hospitals_visited: 3, first_admission_date: '2024-01-14 09:30:00', latest_admission_date: '2024-11-28 14:15:00', admission_rank: 1 },
        { patient_id: 118, patient_name: 'Patient_0118', gender: 'Male', patient_city: 'Hyderabad', total_admissions: 11, hospitals_visited: 2, first_admission_date: '2024-01-22 11:00:00', latest_admission_date: '2024-12-04 16:45:00', admission_rank: 1 },
        { patient_id: 87, patient_name: 'Patient_0087', gender: 'Female', patient_city: 'Bangalore', total_admissions: 10, hospitals_visited: 3, first_admission_date: '2024-02-05 08:20:00', latest_admission_date: '2024-11-19 10:30:00', admission_rank: 2 },
        { patient_id: 204, patient_name: 'Patient_0204', gender: 'Male', patient_city: 'Delhi', total_admissions: 10, hospitals_visited: 2, first_admission_date: '2024-01-08 13:40:00', latest_admission_date: '2024-10-30 18:20:00', admission_rank: 2 },
        { patient_id: 312, patient_name: 'Patient_0312', gender: 'Female', patient_city: 'Mumbai', total_admissions: 9, hospitals_visited: 2, first_admission_date: '2024-02-17 15:10:00', latest_admission_date: '2024-12-11 09:00:00', admission_rank: 3 },
        { patient_id: 5, patient_name: 'Patient_0005', gender: 'Female', patient_city: 'Hyderabad', total_admissions: 9, hospitals_visited: 1, first_admission_date: '2024-03-01 10:00:00', latest_admission_date: '2024-11-22 12:40:00', admission_rank: 3 },
      ];
      return {
        columns: ['patient_id', 'patient_name', 'gender', 'patient_city', 'total_admissions', 'hospitals_visited', 'first_admission_date', 'latest_admission_date', 'admission_rank'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 4.9).toFixed(2),
        query: 'WITH patient_admission_summary AS (...) SELECT ... DENSE_RANK() OVER (ORDER BY total_admissions DESC)...',
      };
    }

    case 9: {
      const rows = [
        { department_id: 16, department_name: 'Emergency', hospital_name: 'Apollo Hyderabad', occupancy_records: 365, total_occupied_bed_observations: 7772, total_available_bed_observations: 8653, bed_utilization_percent: 47.32, utilization_status: 'Normal' },
        { department_id: 1, department_name: 'Emergency', hospital_name: 'Apollo Delhi', occupancy_records: 365, total_occupied_bed_observations: 7734, total_available_bed_observations: 8691, bed_utilization_percent: 47.09, utilization_status: 'Normal' },
        { department_id: 11, department_name: 'Emergency', hospital_name: 'Apollo Bangalore', occupancy_records: 365, total_occupied_bed_observations: 6840, total_available_bed_observations: 7760, bed_utilization_percent: 46.85, utilization_status: 'Normal' },
        { department_id: 6, department_name: 'Emergency', hospital_name: 'Apollo Mumbai', occupancy_records: 365, total_occupied_bed_observations: 8380, total_available_bed_observations: 9870, bed_utilization_percent: 45.92, utilization_status: 'Normal' },
        { department_id: 19, department_name: 'General Medicine', hospital_name: 'Apollo Hyderabad', occupancy_records: 365, total_occupied_bed_observations: 6555, total_available_bed_observations: 8045, bed_utilization_percent: 44.90, utilization_status: 'Normal' },
        { department_id: 3, department_name: 'Orthopedics', hospital_name: 'Apollo Delhi', occupancy_records: 365, total_occupied_bed_observations: 4838, total_available_bed_observations: 6112, bed_utilization_percent: 44.18, utilization_status: 'Normal' },
        { department_id: 18, department_name: 'Orthopedics', hospital_name: 'Apollo Hyderabad', occupancy_records: 365, total_occupied_bed_observations: 4796, total_available_bed_observations: 6154, bed_utilization_percent: 43.80, utilization_status: 'Normal' },
      ];
      return {
        columns: ['department_id', 'department_name', 'hospital_name', 'occupancy_records', 'total_occupied_bed_observations', 'total_available_bed_observations', 'bed_utilization_percent', 'utilization_status'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 5.2).toFixed(2),
        query: 'SELECT d.department_id, d.department_name, h.hospital_name, SUM(occupied), SUM(available)...',
      };
    }

    case 10: {
      const rows = [
        { hospital_name: 'Apollo Hyderabad', department_name: 'Orthopedics', total_beds: 30, total_admissions: 137, average_wait_minutes: 52.80, average_bed_utilization_percent: 43.80 },
        { hospital_name: 'Apollo Hyderabad', department_name: 'General Medicine', total_beds: 40, total_admissions: 135, average_wait_minutes: 54.10, average_bed_utilization_percent: 44.90 },
        { hospital_name: 'Apollo Hyderabad', department_name: 'Emergency', total_beds: 45, total_admissions: 123, average_wait_minutes: 101.45, average_bed_utilization_percent: 47.32 },
        { hospital_name: 'Apollo Delhi', department_name: 'General Medicine', total_beds: 40, total_admissions: 134, average_wait_minutes: 51.90, average_bed_utilization_percent: 43.70 },
        { hospital_name: 'Apollo Delhi', department_name: 'Orthopedics', total_beds: 30, total_admissions: 130, average_wait_minutes: 53.40, average_bed_utilization_percent: 44.18 },
        { hospital_name: 'Apollo Delhi', department_name: 'Emergency', total_beds: 45, total_admissions: 114, average_wait_minutes: 103.78, average_bed_utilization_percent: 47.09 },
        { hospital_name: 'Apollo Mumbai', department_name: 'Cardiology', total_beds: 40, total_admissions: 129, average_wait_minutes: 48.70, average_bed_utilization_percent: 42.10 },
        { hospital_name: 'Apollo Mumbai', department_name: 'Emergency', total_beds: 50, total_admissions: 128, average_wait_minutes: 99.63, average_bed_utilization_percent: 45.92 },
      ];
      return {
        columns: ['hospital_name', 'department_name', 'total_beds', 'total_admissions', 'average_wait_minutes', 'average_bed_utilization_percent'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 4.8).toFixed(2),
        query: 'SELECT h.hospital_name, d.department_name, d.total_beds, COALESCE(am.total_admissions, 0)...',
      };
    }

    case 11: {
      const rows = [
        { hospital_name: 'Apollo Bangalore', department_name: 'Emergency', total_admissions: 121, department_average_wait: 106.71, overall_average_wait: 62.81 },
        { hospital_name: 'Apollo Delhi', department_name: 'Emergency', total_admissions: 114, department_average_wait: 103.78, overall_average_wait: 62.81 },
        { hospital_name: 'Apollo Hyderabad', department_name: 'Emergency', total_admissions: 123, department_average_wait: 101.45, overall_average_wait: 62.81 },
        { hospital_name: 'Apollo Mumbai', department_name: 'Emergency', total_admissions: 128, department_average_wait: 99.63, overall_average_wait: 62.81 },
      ];
      return {
        columns: ['hospital_name', 'department_name', 'total_admissions', 'department_average_wait', 'overall_average_wait'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 3.7).toFixed(2),
        query: 'SELECT h.hospital_name, d.department_name, AVG(wait) HAVING AVG(wait) > (SELECT AVG(wait)...)',
      };
    }

    case 12: {
      const rows = [
        { hospital_name: 'Apollo Delhi', department_name: 'Emergency', total_admissions: 114, average_wait_minutes: 103.78, average_length_of_stay_days: 4.80, readmission_rate_percent: 37.72, attention_status: 'High Attention' },
        { hospital_name: 'Apollo Bangalore', department_name: 'Emergency', total_admissions: 121, average_wait_minutes: 106.71, average_length_of_stay_days: 4.58, readmission_rate_percent: 34.71, attention_status: 'High Attention' },
        { hospital_name: 'Apollo Hyderabad', department_name: 'Emergency', total_admissions: 123, average_wait_minutes: 101.45, average_length_of_stay_days: 4.62, readmission_rate_percent: 37.40, attention_status: 'High Attention' },
        { hospital_name: 'Apollo Mumbai', department_name: 'Emergency', total_admissions: 128, average_wait_minutes: 99.63, average_length_of_stay_days: 4.51, readmission_rate_percent: 35.16, attention_status: 'High Attention' },
        { hospital_name: 'Apollo Delhi', department_name: 'Orthopedics', total_admissions: 130, average_wait_minutes: 53.40, average_length_of_stay_days: 4.65, readmission_rate_percent: 40.77, attention_status: 'Moderate Attention' },
        { hospital_name: 'Apollo Hyderabad', department_name: 'Orthopedics', total_admissions: 137, average_wait_minutes: 52.80, average_length_of_stay_days: 4.48, readmission_rate_percent: 36.50, attention_status: 'Moderate Attention' },
        { hospital_name: 'Apollo Hyderabad', department_name: 'General Medicine', total_admissions: 135, average_wait_minutes: 54.10, average_length_of_stay_days: 4.35, readmission_rate_percent: 34.07, attention_status: 'Moderate Attention' },
        { hospital_name: 'Apollo Delhi', department_name: 'General Medicine', total_admissions: 134, average_wait_minutes: 51.90, average_length_of_stay_days: 4.42, readmission_rate_percent: 33.58, attention_status: 'Moderate Attention' },
      ];
      return {
        columns: ['hospital_name', 'department_name', 'total_admissions', 'average_wait_minutes', 'average_length_of_stay_days', 'readmission_rate_percent', 'attention_status'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 4.6).toFixed(2),
        query: 'WITH department_performance AS (...) SELECT ..., CASE WHEN ... THEN High Attention...',
      };
    }

    case 13: {
      const rows = [
        { hospital_name: 'Apollo Bangalore', department_id: 11, department_name: 'Emergency', total_admissions: 121, average_wait_minutes: 106.71, waiting_row_number: 1, readmission_rate_percent: 34.71, readmission_rank: 6, bed_utilization_percent: 46.85, bed_utilization_rank: 3, waiting_rank_within_hospital: 1 },
        { hospital_name: 'Apollo Delhi', department_id: 1, department_name: 'Emergency', total_admissions: 114, average_wait_minutes: 103.78, waiting_row_number: 2, readmission_rate_percent: 37.72, readmission_rank: 2, bed_utilization_percent: 47.09, bed_utilization_rank: 2, waiting_rank_within_hospital: 1 },
        { hospital_name: 'Apollo Hyderabad', department_id: 16, department_name: 'Emergency', total_admissions: 123, average_wait_minutes: 101.45, waiting_row_number: 3, readmission_rate_percent: 37.40, readmission_rank: 3, bed_utilization_percent: 47.32, bed_utilization_rank: 1, waiting_rank_within_hospital: 1 },
        { hospital_name: 'Apollo Mumbai', department_id: 6, department_name: 'Emergency', total_admissions: 128, average_wait_minutes: 99.63, waiting_row_number: 4, readmission_rate_percent: 35.16, readmission_rank: 5, bed_utilization_percent: 45.92, bed_utilization_rank: 4, waiting_rank_within_hospital: 1 },
        { hospital_name: 'Apollo Hyderabad', department_id: 19, department_name: 'General Medicine', total_admissions: 135, average_wait_minutes: 54.10, waiting_row_number: 5, readmission_rate_percent: 34.07, readmission_rank: 7, bed_utilization_percent: 44.90, bed_utilization_rank: 5, waiting_rank_within_hospital: 2 },
        { hospital_name: 'Apollo Delhi', department_id: 3, department_name: 'Orthopedics', total_admissions: 130, average_wait_minutes: 53.40, waiting_row_number: 6, readmission_rate_percent: 40.77, readmission_rank: 1, bed_utilization_percent: 44.18, bed_utilization_rank: 6, waiting_rank_within_hospital: 2 },
      ];
      return {
        columns: ['hospital_name', 'department_id', 'department_name', 'total_admissions', 'average_wait_minutes', 'waiting_row_number', 'readmission_rate_percent', 'readmission_rank', 'bed_utilization_percent', 'bed_utilization_rank', 'waiting_rank_within_hospital'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 5.6).toFixed(2),
        query: 'SELECT ROW_NUMBER(), RANK(), DENSE_RANK(), PARTITION BY...',
      };
    }

    case 14: {
      const rows = DEPARTMENT_BOTTLENECKS.slice(0, 5).map(b => ({
        hospital_name: b.hospital_name,
        department_id: b.department_name === 'Emergency' ? 1 : 3,
        department_name: b.department_name,
        total_admissions: b.total_admissions,
        average_wait_minutes: b.avg_wait_minutes,
        average_length_of_stay_days: b.avg_los_days,
        readmission_rate_percent: b.readmission_rate_pct,
        bed_utilization_percent: b.bed_utilization_pct,
        bottleneck_score: b.bottleneck_score,
        bottleneck_rank: b.rank,
      }));
      return {
        columns: ['hospital_name', 'department_id', 'department_name', 'total_admissions', 'average_wait_minutes', 'average_length_of_stay_days', 'readmission_rate_percent', 'bed_utilization_percent', 'bottleneck_score', 'bottleneck_rank'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 5.1).toFixed(2),
        query: 'WITH admission_metrics AS (...) SELECT ... PERCENT_RANK() OVER (...) ORDER BY bottleneck_score DESC LIMIT 5;',
      };
    }

    case 15: {
      const rows = [
        { step: '1. Original Correlated Subquery', execution_time_sec: 0.032, subquery_lookups: '60 repeated index/table lookups', cpu_cost: 'High (Cartesian iteration)' },
        { step: '2. Composite Index Created', index_name: 'idx_admissions_hospital_department', target_table: 'admissions (hospital_id, department_id)', status: 'Active' },
        { step: '3. Composite Index Created', index_name: 'idx_beds_hospital_department', target_table: 'bed_occupancy (hospital_id, department_id)', status: 'Active' },
        { step: '4. Optimizer Statistics Updated', command: 'ANALYZE TABLE admissions, bed_occupancy;', row_estimates: '2,500 admissions, 7,300 beds', status: 'Refreshed' },
        { step: '5. Single-Pass CTEs + Hash Join', execution_time_sec: 0.016, performance_gain: '50% faster query execution', memory_footprint: 'Minimal (20-row summary join)' },
      ];
      return {
        columns: ['step', 'execution_time_sec', 'performance_gain', 'subquery_lookups', 'status'],
        rows,
        rowCount: rows.length,
        executionTimeMs: +(performance.now() - startTime + 2.8).toFixed(2),
        query: 'EXPLAIN WITH admission_metrics AS (...) SELECT ...',
      };
    }

    default:
      return executePredefinedQuery(1);
  }
}

export function executeCustomQuery(queryText: string): QueryExecutionResult {
  const startTime = performance.now();
  const trimmed = queryText.trim();
  const lower = trimmed.toLowerCase();

  // Match table queries
  if (lower.includes('from patients')) {
    let list = [...SAMPLE_PATIENTS];
    if (lower.includes('where gender = \'female\'') || lower.includes("gender = 'female'")) {
      list = list.filter(p => p.gender === 'Female');
    } else if (lower.includes('where gender = \'male\'') || lower.includes("gender = 'male'")) {
      list = list.filter(p => p.gender === 'Male');
    }
    if (lower.includes('limit')) {
      const match = lower.match(/limit\s+(\d+)/);
      const limitNum = match ? parseInt(match[1]) : 50;
      list = list.slice(0, limitNum);
    } else {
      list = list.slice(0, 50);
    }
    return {
      columns: ['patient_id', 'patient_name', 'date_of_birth', 'gender', 'city', 'insurance_type'],
      rows: list,
      rowCount: list.length,
      executionTimeMs: +(performance.now() - startTime + 2.4).toFixed(2),
      query: trimmed,
    };
  }

  if (lower.includes('from hospitals')) {
    return {
      columns: ['hospital_id', 'hospital_name', 'city'],
      rows: HOSPITALS,
      rowCount: HOSPITALS.length,
      executionTimeMs: +(performance.now() - startTime + 1.1).toFixed(2),
      query: trimmed,
    };
  }

  if (lower.includes('from departments')) {
    return {
      columns: ['department_id', 'hospital_id', 'department_name', 'total_beds', 'hospital_name'],
      rows: DEPARTMENTS,
      rowCount: DEPARTMENTS.length,
      executionTimeMs: +(performance.now() - startTime + 1.4).toFixed(2),
      query: trimmed,
    };
  }

  if (lower.includes('from doctors')) {
    return {
      columns: ['doctor_id', 'doctor_name', 'specialty', 'department_id', 'department_name', 'hospital_name'],
      rows: DOCTORS,
      rowCount: DOCTORS.length,
      executionTimeMs: +(performance.now() - startTime + 1.8).toFixed(2),
      query: trimmed,
    };
  }

  if (lower.includes('from admissions')) {
    let list = [...SAMPLE_ADMISSIONS];
    if (lower.includes('where hospital_id = 1')) list = list.filter(a => a.hospital_id === 1);
    else if (lower.includes('where hospital_id = 2')) list = list.filter(a => a.hospital_id === 2);
    else if (lower.includes('where hospital_id = 3')) list = list.filter(a => a.hospital_id === 3);
    else if (lower.includes('where hospital_id = 4')) list = list.filter(a => a.hospital_id === 4);

    if (lower.includes('where readmission_flag = 1')) list = list.filter(a => a.readmission_flag === 1);
    if (lower.includes('order by wait_time_minutes desc')) list.sort((a, b) => b.wait_time_minutes - a.wait_time_minutes);

    const limitMatch = lower.match(/limit\s+(\d+)/);
    const limitVal = limitMatch ? parseInt(limitMatch[1]) : 50;
    const sliced = list.slice(0, limitVal);

    return {
      columns: ['admission_id', 'patient_id', 'hospital_id', 'department_id', 'doctor_id', 'admission_date', 'discharge_date', 'admission_type', 'disease', 'wait_time_minutes', 'discharge_status', 'readmission_flag'],
      rows: sliced,
      rowCount: sliced.length,
      executionTimeMs: +(performance.now() - startTime + 3.2).toFixed(2),
      query: trimmed,
    };
  }

  // Fallback to predefined query 1 or generic response
  return executePredefinedQuery(1);
}
