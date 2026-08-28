"""
Apollo Hospitals Patient Flow Analytics
load_data.py — Dataset Loader & Schema Constructor
"""

import os
import json
import pandas as pd
import numpy as np

def get_hospitals_df():
    data = [
        {"hospital_id": 1, "hospital_name": "Apollo Delhi", "city": "Delhi"},
        {"hospital_id": 2, "hospital_name": "Apollo Mumbai", "city": "Mumbai"},
        {"hospital_id": 3, "hospital_name": "Apollo Bangalore", "city": "Bangalore"},
        {"hospital_id": 4, "hospital_name": "Apollo Hyderabad", "city": "Hyderabad"},
    ]
    return pd.DataFrame(data)

def get_departments_df():
    data = [
        {"department_id": 1, "hospital_id": 1, "department_name": "Emergency", "total_beds": 45, "hospital_name": "Apollo Delhi"},
        {"department_id": 2, "hospital_id": 1, "department_name": "Cardiology", "total_beds": 35, "hospital_name": "Apollo Delhi"},
        {"department_id": 3, "hospital_id": 1, "department_name": "Orthopedics", "total_beds": 30, "hospital_name": "Apollo Delhi"},
        {"department_id": 4, "hospital_id": 1, "department_name": "General Medicine", "total_beds": 40, "hospital_name": "Apollo Delhi"},
        {"department_id": 5, "hospital_id": 1, "department_name": "Neurology", "total_beds": 25, "hospital_name": "Apollo Delhi"},
        {"department_id": 6, "hospital_id": 2, "department_name": "Emergency", "total_beds": 50, "hospital_name": "Apollo Mumbai"},
        {"department_id": 7, "hospital_id": 2, "department_name": "Cardiology", "total_beds": 40, "hospital_name": "Apollo Mumbai"},
        {"department_id": 8, "hospital_id": 2, "department_name": "Orthopedics", "total_beds": 35, "hospital_name": "Apollo Mumbai"},
        {"department_id": 9, "hospital_id": 2, "department_name": "General Medicine", "total_beds": 45, "hospital_name": "Apollo Mumbai"},
        {"department_id": 10, "hospital_id": 2, "department_name": "Neurology", "total_beds": 30, "hospital_name": "Apollo Mumbai"},
        {"department_id": 11, "hospital_id": 3, "department_name": "Emergency", "total_beds": 40, "hospital_name": "Apollo Bangalore"},
        {"department_id": 12, "hospital_id": 3, "department_name": "Cardiology", "total_beds": 35, "hospital_name": "Apollo Bangalore"},
        {"department_id": 13, "hospital_id": 3, "department_name": "Orthopedics", "total_beds": 30, "hospital_name": "Apollo Bangalore"},
        {"department_id": 14, "hospital_id": 3, "department_name": "General Medicine", "total_beds": 45, "hospital_name": "Apollo Bangalore"},
        {"department_id": 15, "hospital_id": 3, "department_name": "Neurology", "total_beds": 25, "hospital_name": "Apollo Bangalore"},
        {"department_id": 16, "hospital_id": 4, "department_name": "Emergency", "total_beds": 45, "hospital_name": "Apollo Hyderabad"},
        {"department_id": 17, "hospital_id": 4, "department_name": "Cardiology", "total_beds": 35, "hospital_name": "Apollo Hyderabad"},
        {"department_id": 18, "hospital_id": 4, "department_name": "Orthopedics", "total_beds": 30, "hospital_name": "Apollo Hyderabad"},
        {"department_id": 19, "hospital_id": 4, "department_name": "General Medicine", "total_beds": 40, "hospital_name": "Apollo Hyderabad"},
        {"department_id": 20, "hospital_id": 4, "department_name": "Neurology", "total_beds": 25, "hospital_name": "Apollo Hyderabad"},
    ]
    return pd.DataFrame(data)

def get_doctors_df():
    departments = get_departments_df()
    doctors = []
    doc_id = 1
    names = [
        "Dr. Aarav Sharma", "Dr. Priya Patel", "Dr. Vikram Sethi",
        "Dr. Ananya Roy", "Dr. Rajesh Verma", "Dr. Sunita Rao",
        "Dr. Rohan Mehra", "Dr. Kavita Joshi", "Dr. Amit Singhania",
        "Dr. Meera Iyer", "Dr. Suresh Nair", "Dr. Neha Kapoor",
        "Dr. Alok Nath", "Dr. Deepa Sen", "Dr. Karan Varma"
    ]
    for _, dept in departments.iterrows():
        for d_idx in range(3):
            name = names[(doc_id - 1) % len(names)]
            doctors.append({
                "doctor_id": doc_id,
                "doctor_name": f"{name}_{doc_id}",
                "specialty": f"{dept['department_name']} Specialist",
                "department_id": dept["department_id"],
                "hospital_id": dept["hospital_id"],
                "hospital_name": dept["hospital_name"],
            })
            doc_id += 1
    return pd.DataFrame(doctors)

def get_patients_df():
    cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad']
    insurances = ['Private', 'Government', 'Self-Pay', 'Corporate']
    genders = ['Male', 'Female']
    patients = []
    for i in range(1, 501):
        birth_year = 1940 + (i * 17) % 65
        birth_month = 1 + (i * 7) % 12
        birth_day = 1 + (i * 13) % 28
        patients.append({
            "patient_id": i,
            "patient_name": f"Patient_{i:04d}",
            "date_of_birth": f"{birth_year}-{birth_month:02d}-{birth_day:02d}",
            "gender": genders[i % 2],
            "city": cities[(i * 3) % len(cities)],
            "insurance_type": insurances[(i * 5) % len(insurances)]
        })
    return pd.DataFrame(patients)

def get_admissions_df():
    """
    Loads/generates the 2,500 admissions matching synthetic distribution:
    - Hyderabad: 654
    - Mumbai: 631
    - Delhi: 630
    - Bangalore: 585
    """
    diseases = [
        'Acute Myocardial Infarction', 'Severe Trauma / Fracture', 'Hypertension & Arrhythmia',
        'Pneumonia & Respiratory Distress', 'Stroke & Cerebrovascular Accident',
        'Knee / Hip Osteoarthritis', 'Acute Appendicitis', 'Sepsis & Infection',
        'Type 2 Diabetes Complication', 'Migraine & Neurological Deficit'
    ]
    admission_types = ['Emergency', 'Elective', 'Urgent', 'Referral']
    discharge_statuses = ['Discharged', 'Transferred', 'Outpatient Follow-up', 'Recovered']
    
    admissions = []
    for i in range(1, 2501):
        if i <= 654:
            hospital_id = 4 # Hyderabad
        elif i <= 654 + 631:
            hospital_id = 2 # Mumbai
        elif i <= 654 + 631 + 630:
            hospital_id = 1 # Delhi
        else:
            hospital_id = 3 # Bangalore

        dept_offset = (i % 5)
        department_id = (hospital_id - 1) * 5 + (dept_offset + 1)
        doctor_id = (department_id - 1) * 3 + (i % 3) + 1
        patient_id = (i % 500) + 1
        is_emergency = (department_id % 5 == 1)

        # Baseline wait times (Emergency: 90-120m, Non-emergency: 20-55m)
        if is_emergency:
            wait_time = 75 + (i * 13) % 65
            readmission_rate_chance = 0.37
        else:
            wait_time = 15 + (i * 7) % 50
            readmission_rate_chance = 0.31

        readmission_flag = 1 if ((i * 31) % 100) < (readmission_rate_chance * 100) else 0

        # Stay days
        stay_days = 1 + (i * 11) % 8

        # Date 2024
        day_of_year = 1 + (i % 365)
        adm_date = pd.Timestamp('2024-01-01') + pd.Timedelta(days=day_of_year - 1)
        dis_date = adm_date + pd.Timedelta(days=stay_days)

        admissions.append({
            "admission_id": i,
            "patient_id": patient_id,
            "hospital_id": hospital_id,
            "department_id": department_id,
            "doctor_id": doctor_id,
            "admission_date": adm_date.strftime('%Y-%m-%d'),
            "discharge_date": dis_date.strftime('%Y-%m-%d'),
            "admission_type": "Emergency" if is_emergency else admission_types[(i * 3) % len(admission_types)],
            "disease": diseases[i % len(diseases)],
            "wait_time_minutes": wait_time,
            "discharge_status": discharge_statuses[i % len(discharge_statuses)],
            "readmission_flag": readmission_flag,
            "length_of_stay_days": stay_days,
        })
    return pd.DataFrame(admissions)

def get_bed_occupancy_df():
    departments = get_departments_df()
    records = []
    rec_id = 1
    for _, dept in departments.iterrows():
        total_beds = dept["total_beds"]
        is_emergency = (dept["department_id"] % 5 == 1)
        base_occupancy = 0.88 if is_emergency else 0.72

        for day in range(365):
            cur_date = pd.Timestamp('2024-01-01') + pd.Timedelta(days=day)
            daily_var = ((rec_id * 7) % 15) - 7
            occupied = int(total_beds * base_occupancy) + (1 if daily_var > 0 else -1)
            occupied = max(5, min(total_beds, occupied))
            available = total_beds - occupied

            records.append({
                "occupancy_id": rec_id,
                "hospital_id": dept["hospital_id"],
                "department_id": dept["department_id"],
                "occupancy_date": cur_date.strftime('%Y-%m-%d'),
                "available_beds": available,
                "occupied_beds": occupied,
                "total_beds": total_beds,
            })
            rec_id += 1
    return pd.DataFrame(records)

def load_all_datasets():
    print("Loading Apollo Hospitals Patient Flow datasets...")
    hospitals = get_hospitals_df()
    departments = get_departments_df()
    doctors = get_doctors_df()
    patients = get_patients_df()
    admissions = get_admissions_df()
    occupancy = get_bed_occupancy_df()
    
    print(f"✓ Loaded {len(hospitals)} hospitals")
    print(f"✓ Loaded {len(departments)} departments")
    print(f"✓ Loaded {len(doctors)} doctors")
    print(f"✓ Loaded {len(patients)} patients")
    print(f"✓ Loaded {len(admissions)} admissions")
    print(f"✓ Loaded {len(occupancy)} bed occupancy logs")

    return {
        "hospitals": hospitals,
        "departments": departments,
        "doctors": doctors,
        "patients": patients,
        "admissions": admissions,
        "bed_occupancy": occupancy
    }

if __name__ == "__main__":
    load_all_datasets()
