import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Stethoscope, 
  Building2, 
  Bed, 
  Clock, 
  AlertTriangle,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_ADMISSIONS, SAMPLE_PATIENTS } from '../data/sampleDataset';
import { HOSPITALS, DEPARTMENTS, DOCTORS } from '../data/hospitalData';

export const PatientAdmissionsBrowser: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<'admissions' | 'patients' | 'doctors'>('admissions');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hospitalFilter, setHospitalFilter] = useState<number>(0);
  const [deptFilter, setDeptFilter] = useState<number>(0);
  const [readmissionOnly, setReadmissionOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 15;

  // Filter admissions
  const filteredAdmissions = SAMPLE_ADMISSIONS.filter(adm => {
    if (hospitalFilter !== 0 && adm.hospital_id !== hospitalFilter) return false;
    if (deptFilter !== 0 && adm.department_id !== deptFilter) return false;
    if (readmissionOnly && adm.readmission_flag !== 1) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchDisease = adm.disease.toLowerCase().includes(term);
      const matchType = adm.admission_type.toLowerCase().includes(term);
      const matchId = String(adm.admission_id).includes(term) || String(adm.patient_id).includes(term);
      if (!matchDisease && !matchType && !matchId) return false;
    }
    return true;
  });

  // Filter patients
  const filteredPatients = SAMPLE_PATIENTS.filter(p => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return p.patient_name.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term) ||
      p.insurance_type.toLowerCase().includes(term) ||
      String(p.patient_id).includes(term);
  });

  // Filter doctors
  const filteredDoctors = DOCTORS.filter(d => {
    if (hospitalFilter !== 0 && d.hospital_id !== hospitalFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return d.doctor_name.toLowerCase().includes(term) ||
      d.specialty.toLowerCase().includes(term) ||
      (d.department_name && d.department_name.toLowerCase().includes(term)) ||
      (d.hospital_name && d.hospital_name.toLowerCase().includes(term));
  });

  const getHospitalName = (id: number) => HOSPITALS.find(h => h.hospital_id === id)?.hospital_name || `Hospital ${id}`;
  const getDeptName = (id: number) => DEPARTMENTS.find(d => d.department_id === id)?.department_name || `Dept ${id}`;
  const getDoctorName = (id: number) => DOCTORS.find(d => d.doctor_id === id)?.doctor_name || `Dr. #${id}`;

  const currentList = activeDataset === 'admissions' 
    ? filteredAdmissions 
    : activeDataset === 'patients' 
    ? filteredPatients 
    : filteredDoctors;

  const totalPages = Math.ceil(currentList.length / rowsPerPage) || 1;
  const paginatedList = currentList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleExport = () => {
    let csv = '';
    if (activeDataset === 'admissions') {
      csv = 'admission_id,patient_id,hospital,department,doctor,admission_date,discharge_date,type,disease,wait_mins,readmission\n' +
        filteredAdmissions.map(a => 
          `${a.admission_id},${a.patient_id},"${getHospitalName(a.hospital_id)}","${getDeptName(a.department_id)}","${getDoctorName(a.doctor_id)}",${a.admission_date},${a.discharge_date},${a.admission_type},"${a.disease}",${a.wait_time_minutes},${a.readmission_flag}`
        ).join('\n');
    } else if (activeDataset === 'patients') {
      csv = 'patient_id,patient_name,dob,gender,city,insurance_type\n' +
        filteredPatients.map(p => `${p.patient_id},${p.patient_name},${p.date_of_birth},${p.gender},${p.city},${p.insurance_type}`).join('\n');
    } else {
      csv = 'doctor_id,name,specialty,department,hospital\n' +
        filteredDoctors.map(d => `${d.doctor_id},"${d.doctor_name}","${d.specialty}","${d.department_name}","${d.hospital_name}"`).join('\n');
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apollo_${activeDataset}_export.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sky-300 mb-2">
          <Users className="w-4 h-4" />
          <span>Synthetic Dataset Browser</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Clinical Records & Patient Data Explorer
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          Directly inspect, search, and export the underlying synthetic records: 2,500 admissions, 500 longitudinal patient demographics, and 60 medical specialists.
        </p>
      </div>

      {/* Dataset Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex space-x-1.5">
          <button
            onClick={() => { setActiveDataset('admissions'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeDataset === 'admissions'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bed className="w-4 h-4" />
            <span>Admissions (2,500)</span>
          </button>
          <button
            onClick={() => { setActiveDataset('patients'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeDataset === 'patients'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Patients (500)</span>
          </button>
          <button
            onClick={() => { setActiveDataset('doctors'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeDataset === 'doctors'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors (60)</span>
          </button>
        </div>

        <button
          onClick={handleExport}
          className="text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-2 rounded-xl border border-sky-200 flex items-center space-x-1.5 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export {activeDataset}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${activeDataset} by keyword, name, ID...`}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        {activeDataset === 'admissions' && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={hospitalFilter}
              onChange={(e) => { setHospitalFilter(Number(e.target.value)); setCurrentPage(1); }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
            >
              <option value={0}>All Hospitals</option>
              {HOSPITALS.map(h => <option key={h.hospital_id} value={h.hospital_id}>{h.hospital_name}</option>)}
            </select>

            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(Number(e.target.value)); setCurrentPage(1); }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
            >
              <option value={0}>All Departments</option>
              {DEPARTMENTS.slice(0, 5).map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
            </select>

            <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer font-medium select-none bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={readmissionOnly}
                onChange={(e) => { setReadmissionOnly(e.target.checked); setCurrentPage(1); }}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Readmissions Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {activeDataset === 'admissions' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-2.5">ID</th>
                  <th className="px-3.5 py-2.5">Patient</th>
                  <th className="px-3.5 py-2.5">Hospital</th>
                  <th className="px-3.5 py-2.5">Department</th>
                  <th className="px-3.5 py-2.5">Doctor</th>
                  <th className="px-3.5 py-2.5">Disease / Diagnosis</th>
                  <th className="px-3.5 py-2.5">Wait Time</th>
                  <th className="px-3.5 py-2.5">Type</th>
                  <th className="px-3.5 py-2.5">Readmission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(paginatedList as typeof SAMPLE_ADMISSIONS).map((adm) => (
                  <tr key={adm.admission_id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="px-3.5 py-2 font-mono font-bold text-slate-900">#{adm.admission_id}</td>
                    <td className="px-3.5 py-2 font-medium text-slate-800">Patient #{adm.patient_id}</td>
                    <td className="px-3.5 py-2 text-slate-700">{getHospitalName(adm.hospital_id)}</td>
                    <td className="px-3.5 py-2 font-medium text-slate-800">{getDeptName(adm.department_id)}</td>
                    <td className="px-3.5 py-2 text-slate-600">{getDoctorName(adm.doctor_id)}</td>
                    <td className="px-3.5 py-2 text-slate-800 font-medium truncate max-w-[180px]">{adm.disease}</td>
                    <td className="px-3.5 py-2 font-mono">
                      <span className={adm.wait_time_minutes > 90 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                        {adm.wait_time_minutes} min
                      </span>
                    </td>
                    <td className="px-3.5 py-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        adm.admission_type === 'Emergency' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {adm.admission_type}
                      </span>
                    </td>
                    <td className="px-3.5 py-2">
                      {adm.readmission_flag === 1 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                          Readmitted
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeDataset === 'patients' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Patient ID</th>
                  <th className="px-4 py-2.5">Patient Code</th>
                  <th className="px-4 py-2.5">Date of Birth</th>
                  <th className="px-4 py-2.5">Gender</th>
                  <th className="px-4 py-2.5">City</th>
                  <th className="px-4 py-2.5">Insurance Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(paginatedList as typeof SAMPLE_PATIENTS).map((p) => (
                  <tr key={p.patient_id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="px-4 py-2 font-mono font-bold text-slate-900">#{p.patient_id}</td>
                    <td className="px-4 py-2 font-medium text-slate-800">{p.patient_name}</td>
                    <td className="px-4 py-2 font-mono text-slate-600">{p.date_of_birth}</td>
                    <td className="px-4 py-2 text-slate-700">{p.gender}</td>
                    <td className="px-4 py-2 font-medium text-slate-800">{p.city}</td>
                    <td className="px-4 py-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                        {p.insurance_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeDataset === 'doctors' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Doctor ID</th>
                  <th className="px-4 py-2.5">Doctor Name</th>
                  <th className="px-4 py-2.5">Clinical Specialty</th>
                  <th className="px-4 py-2.5">Department</th>
                  <th className="px-4 py-2.5">Hospital Facility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(paginatedList as typeof DOCTORS).map((d) => (
                  <tr key={d.doctor_id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="px-4 py-2 font-mono font-bold text-slate-900">#{d.doctor_id}</td>
                    <td className="px-4 py-2 font-bold text-slate-900">{d.doctor_name}</td>
                    <td className="px-4 py-2 text-sky-800 font-medium">{d.specialty}</td>
                    <td className="px-4 py-2 text-slate-700">{d.department_name}</td>
                    <td className="px-4 py-2 text-slate-800 font-medium">{d.hospital_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3 border-t border-slate-200 text-xs text-slate-500 bg-slate-50">
          <span>
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, currentList.length)} of {currentList.length} records
          </span>
          <div className="flex items-center space-x-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 font-bold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
