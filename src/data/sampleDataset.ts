import { Patient, Admission, BedOccupancy } from '../types';
import { HOSPITALS, DEPARTMENTS, DOCTORS } from './hospitalData';

// Generates synthetic patients consistent with the 500 patient dataset
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];
const INSURANCE_TYPES = ['Private', 'Government', 'Self-Pay', 'Corporate'];
const GENDERS = ['Male', 'Female'];
const DISEASES = [
  'Acute Myocardial Infarction',
  'Severe Trauma / Fracture',
  'Hypertension & Arrhythmia',
  'Pneumonia & Respiratory Distress',
  'Stroke & Cerebrovascular Accident',
  'Knee / Hip Osteoarthritis',
  'Acute Appendicitis',
  'Sepsis & Infection',
  'Type 2 Diabetes Complication',
  'Migraine & Neurological Deficit'
];
const ADMISSION_TYPES = ['Emergency', 'Elective', 'Urgent', 'Referral'];
const DISCHARGE_STATUSES = ['Discharged', 'Transferred', 'Outpatient Follow-up', 'Recovered'];

export const SAMPLE_PATIENTS: Patient[] = Array.from({ length: 500 }, (_, i) => {
  const id = i + 1;
  const birthYear = 1940 + (id * 17) % 65;
  const birthMonth = String(1 + (id * 7) % 12).padStart(2, '0');
  const birthDay = String(1 + (id * 13) % 28).padStart(2, '0');
  return {
    patient_id: id,
    patient_name: `Patient_${String(id).padStart(4, '0')}`,
    date_of_birth: `${birthYear}-${birthMonth}-${birthDay}`,
    gender: GENDERS[id % 2],
    city: CITIES[(id * 3) % CITIES.length],
    insurance_type: INSURANCE_TYPES[(id * 5) % INSURANCE_TYPES.length],
  };
});

// Generate sample admissions representing the 2,500 admissions with exact statistical proportions
export const SAMPLE_ADMISSIONS: Admission[] = Array.from({ length: 2500 }, (_, i) => {
  const id = i + 1;
  
  // Hospital distribution:
  // Hyderabad: 654 (approx 26.16%)
  // Mumbai: 631 (approx 25.24%)
  // Delhi: 630 (approx 25.20%)
  // Bangalore: 585 (approx 23.40%)
  let hospital_id = 1;
  if (id <= 654) hospital_id = 4; // Hyderabad
  else if (id <= 654 + 631) hospital_id = 2; // Mumbai
  else if (id <= 654 + 631 + 630) hospital_id = 1; // Delhi
  else hospital_id = 3; // Bangalore

  // Department distribution within hospital
  // Department 1/6/11/16 is Emergency
  const deptOffset = (id % 5);
  const dept = DEPARTMENTS.find(d => d.hospital_id === hospital_id && (d.department_id % 5 === deptOffset || (deptOffset === 0 && d.department_id % 5 === 0))) || DEPARTMENTS[(hospital_id - 1) * 5];
  const department_id = dept.department_id;

  // Doctor in this department
  const deptDoctors = DOCTORS.filter(doc => doc.department_id === department_id);
  const doctor = deptDoctors[id % deptDoctors.length] || DOCTORS[0];

  // Wait time distribution:
  // Emergency average ~103 mins (80-140)
  // Others average ~50 mins (20-80)
  const isEmergency = dept.department_name === 'Emergency';
  let wait_time = isEmergency
    ? 85 + (id * 19) % 55
    : 20 + (id * 17) % 65;
  if (hospital_id === 3 && isEmergency) wait_time += 8; // Bangalore emergency highest
  if (hospital_id === 1 && isEmergency) wait_time += 5; // Delhi emergency high

  // Readmission flag
  // Higher in Orthopedics & Emergency (~37-40%)
  const isHighRiskDept = isEmergency || dept.department_name === 'Orthopedics';
  const readmission_flag = (id % 100) < (isHighRiskDept ? 38 : 31) ? 1 : 0;

  // Dates
  const day = 1 + (id % 28);
  const month = 1 + (id % 12);
  const year = 2024;
  const admDate = new Date(year, month - 1, day, 8 + (id % 14), (id * 11) % 60);
  
  // Length of stay (3-7 days)
  const losDays = isEmergency && hospital_id === 1 ? 4.8 + ((id % 7) - 3) * 0.4 : 4.2 + ((id % 6) - 2) * 0.4;
  const disDate = new Date(admDate.getTime() + losDays * 24 * 60 * 60 * 1000);

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

  return {
    admission_id: id,
    patient_id: 1 + (id * 13) % 500, // repeated visits across 500 patients
    hospital_id,
    department_id,
    doctor_id: doctor.doctor_id,
    admission_date: formatDate(admDate),
    discharge_date: formatDate(disDate),
    admission_type: isEmergency ? 'Emergency' : ADMISSION_TYPES[id % ADMISSION_TYPES.length],
    disease: DISEASES[id % DISEASES.length],
    wait_time_minutes: wait_time,
    discharge_status: DISCHARGE_STATUSES[id % DISCHARGE_STATUSES.length],
    readmission_flag,
  };
});

// Sample bed occupancy daily records
export const SAMPLE_BED_OCCUPANCY: BedOccupancy[] = Array.from({ length: 7300 }, (_, i) => {
  const id = i + 1;
  const dept = DEPARTMENTS[i % DEPARTMENTS.length];
  const day = 1 + (i % 365);
  const dateObj = new Date(2024, 0, day);
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;

  const totalBeds = dept.total_beds;
  const occupied = Math.round(totalBeds * (0.42 + (i % 11) * 0.01));
  const available = totalBeds - occupied;

  return {
    occupancy_id: id,
    hospital_id: dept.hospital_id,
    department_id: dept.department_id,
    occupancy_date: dateStr,
    available_beds: available,
    occupied_beds: occupied,
  };
});
