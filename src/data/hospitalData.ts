import { Hospital, Department, Doctor, BusinessFinding, DepartmentBottleneck } from '../types';

export const HOSPITALS: Hospital[] = [
  { hospital_id: 1, hospital_name: 'Apollo Delhi', city: 'Delhi' },
  { hospital_id: 2, hospital_name: 'Apollo Mumbai', city: 'Mumbai' },
  { hospital_id: 3, hospital_name: 'Apollo Bangalore', city: 'Bangalore' },
  { hospital_id: 4, hospital_name: 'Apollo Hyderabad', city: 'Hyderabad' },
];

export const DEPARTMENTS: Department[] = [
  { department_id: 1, hospital_id: 1, department_name: 'Emergency', total_beds: 45, hospital_name: 'Apollo Delhi' },
  { department_id: 2, hospital_id: 1, department_name: 'Cardiology', total_beds: 35, hospital_name: 'Apollo Delhi' },
  { department_id: 3, hospital_id: 1, department_name: 'Orthopedics', total_beds: 30, hospital_name: 'Apollo Delhi' },
  { department_id: 4, hospital_id: 1, department_name: 'General Medicine', total_beds: 40, hospital_name: 'Apollo Delhi' },
  { department_id: 5, hospital_id: 1, department_name: 'Neurology', total_beds: 25, hospital_name: 'Apollo Delhi' },
  { department_id: 6, hospital_id: 2, department_name: 'Emergency', total_beds: 50, hospital_name: 'Apollo Mumbai' },
  { department_id: 7, hospital_id: 2, department_name: 'Cardiology', total_beds: 40, hospital_name: 'Apollo Mumbai' },
  { department_id: 8, hospital_id: 2, department_name: 'Orthopedics', total_beds: 35, hospital_name: 'Apollo Mumbai' },
  { department_id: 9, hospital_id: 2, department_name: 'General Medicine', total_beds: 45, hospital_name: 'Apollo Mumbai' },
  { department_id: 10, hospital_id: 2, department_name: 'Neurology', total_beds: 30, hospital_name: 'Apollo Mumbai' },
  { department_id: 11, hospital_id: 3, department_name: 'Emergency', total_beds: 40, hospital_name: 'Apollo Bangalore' },
  { department_id: 12, hospital_id: 3, department_name: 'Cardiology', total_beds: 35, hospital_name: 'Apollo Bangalore' },
  { department_id: 13, hospital_id: 3, department_name: 'Orthopedics', total_beds: 30, hospital_name: 'Apollo Bangalore' },
  { department_id: 14, hospital_id: 3, department_name: 'General Medicine', total_beds: 45, hospital_name: 'Apollo Bangalore' },
  { department_id: 15, hospital_id: 3, department_name: 'Neurology', total_beds: 25, hospital_name: 'Apollo Bangalore' },
  { department_id: 16, hospital_id: 4, department_name: 'Emergency', total_beds: 45, hospital_name: 'Apollo Hyderabad' },
  { department_id: 17, hospital_id: 4, department_name: 'Cardiology', total_beds: 35, hospital_name: 'Apollo Hyderabad' },
  { department_id: 18, hospital_id: 4, department_name: 'Orthopedics', total_beds: 30, hospital_name: 'Apollo Hyderabad' },
  { department_id: 19, hospital_id: 4, department_name: 'General Medicine', total_beds: 40, hospital_name: 'Apollo Hyderabad' },
  { department_id: 20, hospital_id: 4, department_name: 'Neurology', total_beds: 25, hospital_name: 'Apollo Hyderabad' },
];

export const DOCTORS: Doctor[] = [
  { doctor_id: 1, doctor_name: 'Dr. Aarav Sharma', specialty: 'Emergency Medicine', department_id: 1, department_name: 'Emergency', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 2, doctor_name: 'Dr. Priya Patel', specialty: 'Emergency Medicine', department_id: 1, department_name: 'Emergency', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 3, doctor_name: 'Dr. Vikram Sethi', specialty: 'Emergency Medicine', department_id: 1, department_name: 'Emergency', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 4, doctor_name: 'Dr. Ananya Roy', specialty: 'Cardiology', department_id: 2, department_name: 'Cardiology', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 5, doctor_name: 'Dr. Rajesh Verma', specialty: 'Cardiology', department_id: 2, department_name: 'Cardiology', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 6, doctor_name: 'Dr. Sunita Rao', specialty: 'Cardiology', department_id: 2, department_name: 'Cardiology', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 7, doctor_name: 'Dr. Rohan Mehra', specialty: 'Orthopedics', department_id: 3, department_name: 'Orthopedics', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 8, doctor_name: 'Dr. Kavita Joshi', specialty: 'Orthopedics', department_id: 3, department_name: 'Orthopedics', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 9, doctor_name: 'Dr. Amit Singhania', specialty: 'Orthopedics', department_id: 3, department_name: 'Orthopedics', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 10, doctor_name: 'Dr. Meera Iyer', specialty: 'General Medicine', department_id: 4, department_name: 'General Medicine', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 11, doctor_name: 'Dr. Suresh Nair', specialty: 'General Medicine', department_id: 4, department_name: 'General Medicine', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 12, doctor_name: 'Dr. Neha Kapoor', specialty: 'General Medicine', department_id: 4, department_name: 'General Medicine', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 13, doctor_name: 'Dr. Alok Nath', specialty: 'Neurology', department_id: 5, department_name: 'Neurology', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 14, doctor_name: 'Dr. Deepa Sen', specialty: 'Neurology', department_id: 5, department_name: 'Neurology', hospital_id: 1, hospital_name: 'Apollo Delhi' },
  { doctor_id: 15, doctor_name: 'Dr. Karan Varma', specialty: 'Neurology', department_id: 5, department_name: 'Neurology', hospital_id: 1, hospital_name: 'Apollo Delhi' },

  { doctor_id: 16, doctor_name: 'Dr. Siddharth Rao', specialty: 'Emergency Medicine', department_id: 6, department_name: 'Emergency', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 17, doctor_name: 'Dr. Pooja Kulkarni', specialty: 'Emergency Medicine', department_id: 6, department_name: 'Emergency', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 18, doctor_name: 'Dr. Manish Deshmukh', specialty: 'Emergency Medicine', department_id: 6, department_name: 'Emergency', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 19, doctor_name: 'Dr. Sneha Bhatt', specialty: 'Cardiology', department_id: 7, department_name: 'Cardiology', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 20, doctor_name: 'Dr. Rahul Shinde', specialty: 'Cardiology', department_id: 7, department_name: 'Cardiology', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 21, doctor_name: 'Dr. Tanvi Shah', specialty: 'Cardiology', department_id: 7, department_name: 'Cardiology', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 22, doctor_name: 'Dr. Ajay Patil', specialty: 'Orthopedics', department_id: 8, department_name: 'Orthopedics', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 23, doctor_name: 'Dr. Gauri Sawant', specialty: 'Orthopedics', department_id: 8, department_name: 'Orthopedics', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 24, doctor_name: 'Dr. Nilesh Gaikwad', specialty: 'Orthopedics', department_id: 8, department_name: 'Orthopedics', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 25, doctor_name: 'Dr. Swati Joshi', specialty: 'General Medicine', department_id: 9, department_name: 'General Medicine', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 26, doctor_name: 'Dr. Pradeep Nene', specialty: 'General Medicine', department_id: 9, department_name: 'General Medicine', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 27, doctor_name: 'Dr. Divya More', specialty: 'General Medicine', department_id: 9, department_name: 'General Medicine', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 28, doctor_name: 'Dr. Harish Salve', specialty: 'Neurology', department_id: 10, department_name: 'Neurology', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 29, doctor_name: 'Dr. Ritu Chopra', specialty: 'Neurology', department_id: 10, department_name: 'Neurology', hospital_id: 2, hospital_name: 'Apollo Mumbai' },
  { doctor_id: 30, doctor_name: 'Dr. Chetan Bhagat', specialty: 'Neurology', department_id: 10, department_name: 'Neurology', hospital_id: 2, hospital_name: 'Apollo Mumbai' },

  { doctor_id: 31, doctor_name: 'Dr. Karthik Gowda', specialty: 'Emergency Medicine', department_id: 11, department_name: 'Emergency', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 32, doctor_name: 'Dr. Sahana Murthy', specialty: 'Emergency Medicine', department_id: 11, department_name: 'Emergency', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 33, doctor_name: 'Dr. Vinay Hegde', specialty: 'Emergency Medicine', department_id: 11, department_name: 'Emergency', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 34, doctor_name: 'Dr. Shweta Rao', specialty: 'Cardiology', department_id: 12, department_name: 'Cardiology', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 35, doctor_name: 'Dr. Arvind Swamy', specialty: 'Cardiology', department_id: 12, department_name: 'Cardiology', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 36, doctor_name: 'Dr. Lakshmi Narayanan', specialty: 'Cardiology', department_id: 12, department_name: 'Cardiology', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 37, doctor_name: 'Dr. Sandeep Reddy', specialty: 'Orthopedics', department_id: 13, department_name: 'Orthopedics', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 38, doctor_name: 'Dr. Bhavana Bhat', specialty: 'Orthopedics', department_id: 13, department_name: 'Orthopedics', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 39, doctor_name: 'Dr. Raghu Dixit', specialty: 'Orthopedics', department_id: 13, department_name: 'Orthopedics', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 40, doctor_name: 'Dr. Pallavi Shenoy', specialty: 'General Medicine', department_id: 14, department_name: 'General Medicine', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 41, doctor_name: 'Dr. Guru Prasad', specialty: 'General Medicine', department_id: 14, department_name: 'General Medicine', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 42, doctor_name: 'Dr. Namrata Prabhu', specialty: 'General Medicine', department_id: 14, department_name: 'General Medicine', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 43, doctor_name: 'Dr. Ashok Kumar', specialty: 'Neurology', department_id: 15, department_name: 'Neurology', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 44, doctor_name: 'Dr. Sumathi Rao', specialty: 'Neurology', department_id: 15, department_name: 'Neurology', hospital_id: 3, hospital_name: 'Apollo Bangalore' },
  { doctor_id: 45, doctor_name: 'Dr. Tejaswini Bai', specialty: 'Neurology', department_id: 15, department_name: 'Neurology', hospital_id: 3, hospital_name: 'Apollo Bangalore' },

  { doctor_id: 46, doctor_name: 'Dr. Venkat Raman', specialty: 'Emergency Medicine', department_id: 16, department_name: 'Emergency', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 47, doctor_name: 'Dr. Sirisha Reddy', specialty: 'Emergency Medicine', department_id: 16, department_name: 'Emergency', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 48, doctor_name: 'Dr. Madhav Rao', specialty: 'Emergency Medicine', department_id: 16, department_name: 'Emergency', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 49, doctor_name: 'Dr. Ramakrishna Raju', specialty: 'Cardiology', department_id: 17, department_name: 'Cardiology', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 50, doctor_name: 'Dr. Padmavati Devi', specialty: 'Cardiology', department_id: 17, department_name: 'Cardiology', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 51, doctor_name: 'Dr. Srinivasulu Naidu', specialty: 'Cardiology', department_id: 17, department_name: 'Cardiology', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 52, doctor_name: 'Dr. Chaitanya Varma', specialty: 'Orthopedics', department_id: 18, department_name: 'Orthopedics', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 53, doctor_name: 'Dr. Haritha Chowdary', specialty: 'Orthopedics', department_id: 18, department_name: 'Orthopedics', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 54, doctor_name: 'Dr. Murali Krishna', specialty: 'Orthopedics', department_id: 18, department_name: 'Orthopedics', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 55, doctor_name: 'Dr. Sravani Rao', specialty: 'General Medicine', department_id: 19, department_name: 'General Medicine', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 56, doctor_name: 'Dr. Bhaskar Babu', specialty: 'General Medicine', department_id: 19, department_name: 'General Medicine', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 57, doctor_name: 'Dr. Anusha Goud', specialty: 'General Medicine', department_id: 19, department_name: 'General Medicine', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 58, doctor_name: 'Dr. Satyanarayana Murthy', specialty: 'Neurology', department_id: 20, department_name: 'Neurology', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 59, doctor_name: 'Dr. Usha Rani', specialty: 'Neurology', department_id: 20, department_name: 'Neurology', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
  { doctor_id: 60, doctor_name: 'Dr. Kalyan Chakravarthy', specialty: 'Neurology', department_id: 20, department_name: 'Neurology', hospital_id: 4, hospital_name: 'Apollo Hyderabad' },
];

export const BOTTLENECK_WEIGHTS = {
  wait_time: { weight: 0.25, label: 'Triage Wait Time (25%)', description: 'Normalized percentile rank of emergency & department waiting minutes' },
  los: { weight: 0.25, label: 'Length of Stay (25%)', description: 'Normalized percentile rank of average inpatient duration in days' },
  readmission: { weight: 0.25, label: '30-Day Readmission Rate (25%)', description: 'Normalized percentile rank of 30-day post-discharge bouncebacks' },
  bed_utilization: { weight: 0.25, label: 'Bed Utilization Rate (25%)', description: 'Normalized percentile rank of active ward bed capacity pressure' }
};

export const DEPARTMENT_BOTTLENECKS: DepartmentBottleneck[] = [
  {
    rank: 1,
    hospital_name: 'Apollo Delhi',
    department_name: 'Emergency',
    total_admissions: 114,
    avg_wait_minutes: 103.78,
    avg_los_days: 4.80,
    readmission_rate_pct: 37.72,
    bed_utilization_pct: 47.09,
    bottleneck_score: 92.11,
    status: 'Critical',
    wait_contribution: 24.60,
    los_contribution: 24.20,
    readmission_contribution: 22.80,
    bed_util_contribution: 20.51
  },
  {
    rank: 2,
    hospital_name: 'Apollo Bangalore',
    department_name: 'Emergency',
    total_admissions: 121,
    avg_wait_minutes: 106.71,
    avg_los_days: 4.58,
    readmission_rate_pct: 34.71,
    bed_utilization_pct: 46.85,
    bottleneck_score: 89.65,
    status: 'Critical',
    wait_contribution: 25.00,
    los_contribution: 23.10,
    readmission_contribution: 21.20,
    bed_util_contribution: 20.35
  },
  {
    rank: 3,
    hospital_name: 'Apollo Hyderabad',
    department_name: 'Emergency',
    total_admissions: 123,
    avg_wait_minutes: 101.45,
    avg_los_days: 4.62,
    readmission_rate_pct: 37.40,
    bed_utilization_pct: 47.32,
    bottleneck_score: 88.90,
    status: 'Critical',
    wait_contribution: 24.10,
    los_contribution: 23.30,
    readmission_contribution: 22.70,
    bed_util_contribution: 18.80
  },
  {
    rank: 4,
    hospital_name: 'Apollo Mumbai',
    department_name: 'Emergency',
    total_admissions: 128,
    avg_wait_minutes: 99.63,
    avg_los_days: 4.51,
    readmission_rate_pct: 35.16,
    bed_utilization_pct: 45.92,
    bottleneck_score: 86.40,
    status: 'High Risk',
    wait_contribution: 23.70,
    los_contribution: 22.80,
    readmission_contribution: 21.40,
    bed_util_contribution: 18.50
  },
  {
    rank: 5,
    hospital_name: 'Apollo Delhi',
    department_name: 'Orthopedics',
    total_admissions: 130,
    avg_wait_minutes: 53.40,
    avg_los_days: 4.65,
    readmission_rate_pct: 40.77,
    bed_utilization_pct: 44.18,
    bottleneck_score: 64.20,
    status: 'High Risk',
    wait_contribution: 13.80,
    los_contribution: 23.50,
    readmission_contribution: 25.00,
    bed_util_contribution: 1.90
  },
  {
    rank: 6,
    hospital_name: 'Apollo Hyderabad',
    department_name: 'Orthopedics',
    total_admissions: 137,
    avg_wait_minutes: 52.80,
    avg_los_days: 4.48,
    readmission_rate_pct: 36.50,
    bed_utilization_pct: 43.80,
    bottleneck_score: 61.15,
    status: 'Moderate',
    wait_contribution: 13.50,
    los_contribution: 22.60,
    readmission_contribution: 22.20,
    bed_util_contribution: 2.85
  },
  {
    rank: 7,
    hospital_name: 'Apollo Hyderabad',
    department_name: 'General Medicine',
    total_admissions: 135,
    avg_wait_minutes: 54.10,
    avg_los_days: 4.35,
    readmission_rate_pct: 34.07,
    bed_utilization_pct: 44.90,
    bottleneck_score: 59.80,
    status: 'Moderate',
    wait_contribution: 14.10,
    los_contribution: 21.90,
    readmission_contribution: 20.60,
    bed_util_contribution: 3.20
  },
  {
    rank: 8,
    hospital_name: 'Apollo Delhi',
    department_name: 'General Medicine',
    total_admissions: 134,
    avg_wait_minutes: 51.90,
    avg_los_days: 4.42,
    readmission_rate_pct: 33.58,
    bed_utilization_pct: 43.70,
    bottleneck_score: 58.60,
    status: 'Moderate',
    wait_contribution: 13.20,
    los_contribution: 22.30,
    readmission_contribution: 20.30,
    bed_util_contribution: 2.80
  },
  {
    rank: 9,
    hospital_name: 'Apollo Mumbai',
    department_name: 'Cardiology',
    total_admissions: 129,
    avg_wait_minutes: 48.70,
    avg_los_days: 4.25,
    readmission_rate_pct: 31.78,
    bed_utilization_pct: 42.10,
    bottleneck_score: 53.40,
    status: 'Normal',
    wait_contribution: 12.30,
    los_contribution: 21.40,
    readmission_contribution: 18.90,
    bed_util_contribution: 0.80
  },
  {
    rank: 10,
    hospital_name: 'Apollo Bangalore',
    department_name: 'Neurology',
    total_admissions: 110,
    avg_wait_minutes: 45.20,
    avg_los_days: 4.10,
    readmission_rate_pct: 29.09,
    bed_utilization_pct: 41.50,
    bottleneck_score: 48.20,
    status: 'Normal',
    wait_contribution: 11.20,
    los_contribution: 20.50,
    readmission_contribution: 16.50,
    bed_util_contribution: 0.00
  }
];

export const BUSINESS_FINDINGS: BusinessFinding[] = [
  {
    id: 1,
    title: 'Apollo Hyderabad Handled Highest Volume',
    finding: 'Apollo Hyderabad recorded the most admissions across all 4 hospital networks.',
    evidence: 'Handled 654 admissions (26.2%), compared with 631 at Mumbai, 630 at Delhi and 585 at Bangalore.',
    businessImpact: 'Staffing and supporting clinical resources should account for the comparatively higher workload at Hyderabad.',
    category: 'Volume',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 2,
    title: 'Emergency Departments are Primary Bottlenecks',
    finding: 'Emergency departments have dramatically elevated wait times compared to non-emergency wards.',
    evidence: 'Average Emergency wait times ranged from 99.63 to 106.71 mins vs overall hospital average of 62.81 mins (+65%).',
    businessImpact: 'Emergency triage protocols, shift staffing, rapid diagnostic turnarounds and patient-transfer workflows require urgent review.',
    category: 'Emergency',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    id: 3,
    title: 'Apollo Bangalore Emergency: Longest Wait',
    finding: 'Apollo Bangalore Emergency recorded the single longest average patient waiting time.',
    evidence: 'Average wait of 106.71 minutes, approx 43.90 minutes above the global average benchmark.',
    businessImpact: 'Targeted operational workflow improvements could reduce acute congestion and patient dissatisfaction.',
    category: 'Wait Time',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 4,
    title: 'Apollo Delhi Emergency: Top Bottleneck Score',
    finding: 'Apollo Delhi Emergency ranked #1 overall in the combined multi-factor patient-flow bottleneck model.',
    evidence: 'Bottleneck score of 92.11, driven by 103.78-min wait, 4.80-day stay, 37.72% readmission rate, and 47.09% bed utilization.',
    businessImpact: 'Comprehensive interventions should address the complete patient journey rather than isolated measures.',
    category: 'Bottleneck',
    badgeColor: 'bg-red-50 text-red-700 border-red-200'
  },
  {
    id: 5,
    title: 'Zero Critical Bed Overcrowding (>90%)',
    finding: 'No department exceeded the project-defined 90% Critical-utilization threshold at the aggregate level.',
    evidence: 'Maximum observed aggregate bed utilization was ~47.32%. Aggregate capacity remains sufficient.',
    businessImpact: 'Focus should be on shift-level/daily peak surges rather than raw bed acquisition.',
    category: 'Capacity',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 6,
    title: 'Apollo Delhi Emergency: Longest Average Stay',
    finding: 'Apollo Delhi Emergency recorded the longest average length of stay across all departments.',
    evidence: 'Patients stayed an average of 4.80 days across 114 discharged admissions.',
    businessImpact: 'Discharge planning, diagnostic delays, physician consults, and care transitions should be audited.',
    category: 'Stay',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: 7,
    title: 'Readmission Rates Require Clinical Attention',
    finding: 'Several departments recorded comparatively high readmission rates (>35%).',
    evidence: 'Apollo Delhi Orthopedics (40.77%), Apollo Delhi Emergency (37.72%), and Apollo Hyderabad Emergency (37.40%).',
    businessImpact: 'Post-discharge follow-up care, discharge readiness checklist, and recurring-condition management need audit.',
    category: 'Readmissions',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  {
    id: 8,
    title: 'High Demand Concentration in Orthopedics & Medicine',
    finding: 'Orthopedics and General Medicine handled the highest non-emergency patient volumes.',
    evidence: 'Hyderabad Orthopedics (137), Hyderabad General Medicine (135), and Delhi General Medicine (134).',
    businessImpact: 'Specialist scheduling and consultation rooms should match empirical volume demand rather than equal splits.',
    category: 'Demand',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 9,
    title: 'Frequent Repeated Patient Admissions',
    finding: 'A vast majority of patients in the synthetic dataset had repeated hospital visits.',
    evidence: '482 of 500 patients had multiple admissions, with an average of 5.0 admissions per patient.',
    businessImpact: 'Longitudinal electronic health tracking can help identify chronic care patients and prevent avoidable returns.',
    category: 'Demand',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    id: 10,
    title: 'Doctor Caseload Workload Baseline',
    finding: 'Balanced average doctor workload with opportunities for optimization.',
    evidence: '60 doctors collectively handled 2,500 admissions, averaging 41.67 admissions per doctor.',
    businessImpact: 'Individual doctor workloads should be monitored against this 41.67 baseline to prevent burnout.',
    category: 'Doctors',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
  }
];

export const HOSPITAL_METRICS = [
  {
    hospital_name: 'Apollo Hyderabad',
    city: 'Hyderabad',
    admissions: 654,
    departments: 5,
    doctors: 15,
    avg_wait: 61.4,
    avg_los: 4.38,
    readmission_rate: 34.2,
    bed_utilization: 45.8,
    emergency_wait: 101.45,
  },
  {
    hospital_name: 'Apollo Mumbai',
    city: 'Mumbai',
    admissions: 631,
    departments: 5,
    doctors: 15,
    avg_wait: 60.8,
    avg_los: 4.32,
    readmission_rate: 33.8,
    bed_utilization: 44.6,
    emergency_wait: 99.63,
  },
  {
    hospital_name: 'Apollo Delhi',
    city: 'Delhi',
    admissions: 630,
    departments: 5,
    doctors: 15,
    avg_wait: 64.9,
    avg_los: 4.54,
    readmission_rate: 36.8,
    bed_utilization: 46.2,
    emergency_wait: 103.78,
  },
  {
    hospital_name: 'Apollo Bangalore',
    city: 'Bangalore',
    admissions: 585,
    departments: 5,
    doctors: 15,
    avg_wait: 64.1,
    avg_los: 4.41,
    readmission_rate: 33.5,
    bed_utilization: 45.1,
    emergency_wait: 106.71,
  }
];

export const DEPARTMENT_VOLUME_DATA = [
  { name: 'Orthopedics', admissions: 536, avgWait: 52.4, color: '#0ea5e9' },
  { name: 'General Medicine', admissions: 532, avgWait: 53.1, color: '#38bdf8' },
  { name: 'Cardiology', admissions: 489, avgWait: 49.8, color: '#0284c7' },
  { name: 'Emergency', admissions: 486, avgWait: 102.89, color: '#ef4444' },
  { name: 'Neurology', admissions: 457, avgWait: 46.2, color: '#64748b' },
];

export const WAIT_TIME_CLASSIFICATION = [
  { category: 'Normal Wait (< 45 min)', count: 968, percentage: 38.7, color: '#10b981', status: 'Optimal' },
  { category: 'Moderate Wait (45 - 75 min)', count: 1046, percentage: 41.8, color: '#f59e0b', status: 'Monitor' },
  { category: 'Severe Bottleneck (> 75 min)', count: 486, percentage: 19.5, color: '#ef4444', status: 'Urgent' }
];

export const BED_OCCUPANCY_TRENDS = [
  { month: 'Jan', ApolloDelhi: 45.2, ApolloMumbai: 43.8, ApolloBangalore: 44.1, ApolloHyderabad: 45.0 },
  { month: 'Feb', ApolloDelhi: 46.1, ApolloMumbai: 44.5, ApolloBangalore: 44.8, ApolloHyderabad: 45.6 },
  { month: 'Mar', ApolloDelhi: 47.3, ApolloMumbai: 45.2, ApolloBangalore: 45.9, ApolloHyderabad: 46.8 },
  { month: 'Apr', ApolloDelhi: 46.8, ApolloMumbai: 44.9, ApolloBangalore: 45.2, ApolloHyderabad: 46.1 },
  { month: 'May', ApolloDelhi: 48.0, ApolloMumbai: 45.8, ApolloBangalore: 46.3, ApolloHyderabad: 47.2 },
  { month: 'Jun', ApolloDelhi: 47.1, ApolloMumbai: 45.1, ApolloBangalore: 45.5, ApolloHyderabad: 46.5 },
  { month: 'Jul', ApolloDelhi: 46.4, ApolloMumbai: 44.2, ApolloBangalore: 44.7, ApolloHyderabad: 45.8 },
  { month: 'Aug', ApolloDelhi: 45.9, ApolloMumbai: 43.9, ApolloBangalore: 44.3, ApolloHyderabad: 45.3 },
  { month: 'Sep', ApolloDelhi: 46.7, ApolloMumbai: 44.7, ApolloBangalore: 45.0, ApolloHyderabad: 46.0 },
  { month: 'Oct', ApolloDelhi: 47.5, ApolloMumbai: 45.4, ApolloBangalore: 45.8, ApolloHyderabad: 46.9 },
  { month: 'Nov', ApolloDelhi: 46.9, ApolloMumbai: 44.8, ApolloBangalore: 45.1, ApolloHyderabad: 46.2 },
  { month: 'Dec', ApolloDelhi: 47.8, ApolloMumbai: 45.6, ApolloBangalore: 46.0, ApolloHyderabad: 47.1 },
];

export const DATABASE_TABLES = [
  {
    name: 'hospitals',
    rowCount: 4,
    description: 'Master list of Apollo hospital locations across India.',
    primaryKey: 'hospital_id',
    columns: [
      { name: 'hospital_id', type: 'INT', nullable: false, description: 'Surrogate primary key identifying the hospital facility.' },
      { name: 'hospital_name', type: 'VARCHAR(100)', nullable: false, description: 'Official name of the hospital (e.g., Apollo Delhi).' },
      { name: 'city', type: 'VARCHAR(50)', nullable: false, description: 'Metropolitan region where the hospital is located.' }
    ]
  },
  {
    name: 'departments',
    rowCount: 20,
    description: 'Clinical departments, ward locations, and allocated physical bed capacity.',
    primaryKey: 'department_id, hospital_id',
    columns: [
      { name: 'department_id', type: 'INT', nullable: false, description: 'Department code within the hospital facility.' },
      { name: 'hospital_id', type: 'INT', nullable: false, foreignKey: 'hospitals(hospital_id)', description: 'Foreign key to parent hospital facility.' },
      { name: 'department_name', type: 'VARCHAR(50)', nullable: false, description: 'Clinical specialty name (Emergency, Cardiology, Orthopedics, General Medicine, Neurology).' },
      { name: 'total_beds', type: 'INT', nullable: false, description: 'Allocated physical bed capacity for this ward.' }
    ]
  },
  {
    name: 'patients',
    rowCount: 500,
    description: 'Longitudinal demographic records of synthetic patients.',
    primaryKey: 'patient_id',
    columns: [
      { name: 'patient_id', type: 'INT', nullable: false, description: 'Surrogate primary key identifying each unique patient.' },
      { name: 'patient_name', type: 'VARCHAR(100)', nullable: false, description: 'Anonymized synthetic patient pseudonym.' },
      { name: 'date_of_birth', type: 'DATE', nullable: false, description: 'Patient birth date for cohort and age calculation.' },
      { name: 'gender', type: 'VARCHAR(10)', nullable: false, description: 'Patient gender classification.' },
      { name: 'city', type: 'VARCHAR(50)', nullable: false, description: 'Residential city of the patient.' },
      { name: 'insurance_type', type: 'VARCHAR(50)', nullable: false, description: 'Insurance coverage provider category.' }
    ]
  },
  {
    name: 'doctors',
    rowCount: 60,
    description: 'Credentialed consultant specialists and medical officers.',
    primaryKey: 'doctor_id',
    columns: [
      { name: 'doctor_id', type: 'INT', nullable: false, description: 'Surrogate primary key identifying the medical practitioner.' },
      { name: 'doctor_name', type: 'VARCHAR(100)', nullable: false, description: 'Doctor full name with title.' },
      { name: 'specialty', type: 'VARCHAR(100)', nullable: false, description: 'Certified clinical medical sub-specialty.' },
      { name: 'department_id', type: 'INT', nullable: false, foreignKey: 'departments(department_id)', description: 'Department assignment for the doctor.' },
      { name: 'hospital_id', type: 'INT', nullable: false, foreignKey: 'hospitals(hospital_id)', description: 'Hospital facility where doctor holds clinical privileges.' }
    ]
  },
  {
    name: 'admissions',
    rowCount: 2500,
    description: 'Core transactional fact table of all patient admission episodes, triage wait times, and discharge events.',
    primaryKey: 'admission_id',
    columns: [
      { name: 'admission_id', type: 'INT', nullable: false, description: 'Primary key identifying each admission encounter.' },
      { name: 'patient_id', type: 'INT', nullable: false, foreignKey: 'patients(patient_id)', description: 'Patient receiving medical care.' },
      { name: 'hospital_id', type: 'INT', nullable: false, foreignKey: 'hospitals(hospital_id)', description: 'Hospital facility admitting the patient.' },
      { name: 'department_id', type: 'INT', nullable: false, foreignKey: 'departments(department_id)', description: 'Admitting department.' },
      { name: 'doctor_id', type: 'INT', nullable: false, foreignKey: 'doctors(doctor_id)', description: 'Attending physician in charge of the episode.' },
      { name: 'admission_date', type: 'DATETIME', nullable: false, description: 'Timestamp when patient entered hospital ward.' },
      { name: 'discharge_date', type: 'DATETIME', nullable: true, description: 'Timestamp when patient was formally discharged.' },
      { name: 'admission_type', type: 'VARCHAR(50)', nullable: false, description: 'Classification: Emergency, Elective, Urgent, Referral.' },
      { name: 'disease', type: 'VARCHAR(100)', nullable: false, description: 'Primary diagnosis or presenting clinical condition.' },
      { name: 'wait_time_minutes', type: 'INT', nullable: false, description: 'Minutes elapsed between arrival/triage and doctor examination.' },
      { name: 'discharge_status', type: 'VARCHAR(50)', nullable: false, description: 'Status at discharge (Discharged, Transferred, Recovered).' },
      { name: 'readmission_flag', type: 'TINYINT', nullable: false, description: '1 if patient returned within 30 days, 0 otherwise.' }
    ]
  },
  {
    name: 'bed_occupancy',
    rowCount: 7300,
    description: 'Daily operational observation logs of ward bed capacity and utilization.',
    primaryKey: 'occupancy_id',
    columns: [
      { name: 'occupancy_id', type: 'INT', nullable: false, description: 'Surrogate primary key for daily observation entry.' },
      { name: 'hospital_id', type: 'INT', nullable: false, foreignKey: 'hospitals(hospital_id)', description: 'Hospital facility.' },
      { name: 'department_id', type: 'INT', nullable: false, foreignKey: 'departments(department_id)', description: 'Department ward.' },
      { name: 'occupancy_date', type: 'DATE', nullable: false, description: 'Date of bed occupancy tally.' },
      { name: 'available_beds', type: 'INT', nullable: false, description: 'Unoccupied beds available for new admissions.' },
      { name: 'occupied_beds', type: 'INT', nullable: false, description: 'Beds occupied by admitted patients.' }
    ]
  }
];

