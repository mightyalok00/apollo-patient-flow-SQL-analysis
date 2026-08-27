export interface Hospital {
  hospital_id: number;
  hospital_name: string;
  city: string;
}

export interface Department {
  department_id: number;
  hospital_id: number;
  department_name: string;
  total_beds: number;
  hospital_name?: string;
}

export interface Doctor {
  doctor_id: number;
  doctor_name: string;
  specialty: string;
  department_id: number;
  department_name?: string;
  hospital_id?: number;
  hospital_name?: string;
}

export interface Patient {
  patient_id: number;
  patient_name: string;
  date_of_birth: string;
  gender: string;
  city: string;
  insurance_type: string;
}

export interface Admission {
  admission_id: number;
  patient_id: number;
  hospital_id: number;
  department_id: number;
  doctor_id: number;
  admission_date: string;
  discharge_date: string | null;
  admission_type: string;
  disease: string;
  wait_time_minutes: number;
  discharge_status: string;
  readmission_flag: number;
}

export interface BedOccupancy {
  occupancy_id: number;
  hospital_id: number;
  department_id: number;
  occupancy_date: string;
  available_beds: number;
  occupied_beds: number;
}

export interface SqlQueryQuestion {
  id: string;
  questionNumber: number;
  subQuestion?: string;
  title: string;
  section: string;
  description: string;
  businessContext: string;
  sqlQuery: string;
  optimizedQuery?: string;
  explanation: string;
  keyFinding?: string;
  sqlConcepts: string[];
}

export interface QueryExecutionResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  query: string;
  error?: string;
}

export interface DepartmentBottleneck {
  hospital_name: string;
  department_name: string;
  total_admissions: number;
  avg_wait_minutes: number;
  avg_los_days: number;
  readmission_rate_pct: number;
  bed_utilization_pct: number;
  bottleneck_score: number;
  rank: number;
  status: 'Critical' | 'High Risk' | 'Moderate' | 'Normal';
}

export interface BusinessFinding {
  id: number;
  title: string;
  finding: string;
  evidence: string;
  businessImpact: string;
  category: 'Volume' | 'Emergency' | 'Wait Time' | 'Bottleneck' | 'Capacity' | 'Stay' | 'Readmissions' | 'Demand' | 'Doctors';
  badgeColor: string;
}
