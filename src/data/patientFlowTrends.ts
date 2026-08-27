export interface DailyPatientFlow {
  date: string;
  fullDate: string; // YYYY-MM-DD
  dayIndex: number;
  totalAdmissions: number;
  cumulativeAdmissions: number;
  movingAverage7d: number;
  emergency: number;
  elective: number;
  urgent: number;
  referral: number;
  delhi: number;
  mumbai: number;
  bangalore: number;
  hyderabad: number;
  avgWaitMinutes: number;
  growthRatePct: number;
  bedOccupancyPct: number;
}

export type DateRangePreset = '7d' | '30d' | '90d' | 'custom';

// Raw 90-day longitudinal patient flow entries leading up to Aug 30, 2026
const RAW_90_DAYS_DATA = [
  // June (Days 1 - 29: June 02 to June 30)
  { date: 'Jun 02', fullDate: '2026-06-02', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 2, mum: 1, blr: 1, hyd: 2, wait: 60.5, occ: 43.8 },
  { date: 'Jun 03', fullDate: '2026-06-03', total: 7, emg: 2, ele: 2, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.1, occ: 44.1 },
  { date: 'Jun 04', fullDate: '2026-06-04', total: 5, emg: 1, ele: 2, urg: 1, ref: 1, del: 1, mum: 1, blr: 1, hyd: 2, wait: 58.0, occ: 43.5 },
  { date: 'Jun 05', fullDate: '2026-06-05', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.2, occ: 44.6 },
  { date: 'Jun 06', fullDate: '2026-06-06', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 1, hyd: 2, wait: 59.8, occ: 44.0 },
  { date: 'Jun 07', fullDate: '2026-06-07', total: 7, emg: 2, ele: 2, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 61.9, occ: 44.3 },
  { date: 'Jun 08', fullDate: '2026-06-08', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 63.5, occ: 44.7 },
  { date: 'Jun 09', fullDate: '2026-06-09', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 1, hyd: 2, wait: 60.1, occ: 44.2 },
  { date: 'Jun 10', fullDate: '2026-06-10', total: 7, emg: 2, ele: 2, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.4, occ: 44.5 },
  { date: 'Jun 11', fullDate: '2026-06-11', total: 9, emg: 2, ele: 3, urg: 3, ref: 1, del: 3, mum: 2, blr: 2, hyd: 2, wait: 67.8, occ: 45.4 },
  { date: 'Jun 12', fullDate: '2026-06-12', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 61.2, occ: 44.8 },
  { date: 'Jun 13', fullDate: '2026-06-13', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 1, hyd: 2, wait: 59.0, occ: 44.3 },
  { date: 'Jun 14', fullDate: '2026-06-14', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 65.0, occ: 45.0 },
  { date: 'Jun 15', fullDate: '2026-06-15', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.0, occ: 44.6 },
  { date: 'Jun 16', fullDate: '2026-06-16', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.1, occ: 45.1 },
  { date: 'Jun 17', fullDate: '2026-06-17', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 1, hyd: 2, wait: 58.5, occ: 44.4 },
  { date: 'Jun 18', fullDate: '2026-06-18', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 3, wait: 66.8, occ: 45.5 },
  { date: 'Jun 19', fullDate: '2026-06-19', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 61.5, occ: 44.9 },
  { date: 'Jun 20', fullDate: '2026-06-20', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 63.9, occ: 45.2 },
  { date: 'Jun 21', fullDate: '2026-06-21', total: 10, emg: 3, ele: 3, urg: 3, ref: 1, del: 3, mum: 2, blr: 2, hyd: 3, wait: 71.0, occ: 46.2 },
  { date: 'Jun 22', fullDate: '2026-06-22', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 61.0, occ: 45.0 },
  { date: 'Jun 23', fullDate: '2026-06-23', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.5, occ: 45.4 },
  { date: 'Jun 24', fullDate: '2026-06-24', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 1, hyd: 2, wait: 59.2, occ: 44.7 },
  { date: 'Jun 25', fullDate: '2026-06-25', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 65.2, occ: 45.3 },
  { date: 'Jun 26', fullDate: '2026-06-26', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.3, occ: 44.8 },
  { date: 'Jun 27', fullDate: '2026-06-27', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 3, wait: 67.5, occ: 45.8 },
  { date: 'Jun 28', fullDate: '2026-06-28', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 61.8, occ: 45.1 },
  { date: 'Jun 29', fullDate: '2026-06-29', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.4, occ: 45.5 },
  { date: 'Jun 30', fullDate: '2026-06-30', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 63.8, occ: 45.3 },

  // July (Days 30 - 60: July 01 to July 31)
  { date: 'Jul 01', fullDate: '2026-07-01', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.1, occ: 44.9 },
  { date: 'Jul 02', fullDate: '2026-07-02', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.9, occ: 45.4 },
  { date: 'Jul 03', fullDate: '2026-07-03', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 1, hyd: 2, wait: 59.4, occ: 44.6 },
  { date: 'Jul 04', fullDate: '2026-07-04', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 65.0, occ: 45.2 },
  { date: 'Jul 05', fullDate: '2026-07-05', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 61.6, occ: 44.9 },
  { date: 'Jul 06', fullDate: '2026-07-06', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 3, blr: 2, hyd: 2, wait: 68.1, occ: 45.9 },
  { date: 'Jul 07', fullDate: '2026-07-07', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.5, occ: 45.1 },
  { date: 'Jul 08', fullDate: '2026-07-08', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.3, occ: 45.5 },
  { date: 'Jul 09', fullDate: '2026-07-09', total: 9, emg: 2, ele: 3, urg: 3, ref: 1, del: 3, mum: 2, blr: 2, hyd: 2, wait: 67.2, occ: 46.0 },
  { date: 'Jul 10', fullDate: '2026-07-10', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 61.9, occ: 45.2 },
  { date: 'Jul 11', fullDate: '2026-07-11', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 65.5, occ: 45.7 },
  { date: 'Jul 12', fullDate: '2026-07-12', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 1, hyd: 2, wait: 58.8, occ: 44.8 },
  { date: 'Jul 13', fullDate: '2026-07-13', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 3, wait: 68.0, occ: 46.1 },
  { date: 'Jul 14', fullDate: '2026-07-14', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.7, occ: 45.6 },
  { date: 'Jul 15', fullDate: '2026-07-15', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.4, occ: 45.2 },
  { date: 'Jul 16', fullDate: '2026-07-16', total: 10, emg: 3, ele: 3, urg: 3, ref: 1, del: 3, mum: 2, blr: 2, hyd: 3, wait: 71.5, occ: 46.8 },
  { date: 'Jul 17', fullDate: '2026-07-17', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 61.2, occ: 45.3 },
  { date: 'Jul 18', fullDate: '2026-07-18', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 65.1, occ: 45.8 },
  { date: 'Jul 19', fullDate: '2026-07-19', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 3, blr: 2, hyd: 2, wait: 67.6, occ: 46.2 },
  { date: 'Jul 20', fullDate: '2026-07-20', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.0, occ: 45.4 },
  { date: 'Jul 21', fullDate: '2026-07-21', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.8, occ: 45.9 },
  { date: 'Jul 22', fullDate: '2026-07-22', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 1, hyd: 2, wait: 59.1, occ: 44.9 },
  { date: 'Jul 23', fullDate: '2026-07-23', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 3, wait: 68.3, occ: 46.4 },
  { date: 'Jul 24', fullDate: '2026-07-24', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 65.0, occ: 45.8 },
  { date: 'Jul 25', fullDate: '2026-07-25', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 61.7, occ: 45.3 },
  { date: 'Jul 26', fullDate: '2026-07-26', total: 10, emg: 3, ele: 3, urg: 3, ref: 1, del: 3, mum: 3, blr: 2, hyd: 2, wait: 70.8, occ: 46.9 },
  { date: 'Jul 27', fullDate: '2026-07-27', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.2, occ: 45.9 },
  { date: 'Jul 28', fullDate: '2026-07-28', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.6, occ: 45.5 },
  { date: 'Jul 29', fullDate: '2026-07-29', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 3, wait: 67.9, occ: 46.5 },
  { date: 'Jul 30', fullDate: '2026-07-30', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.6, occ: 45.9 },
  { date: 'Jul 31', fullDate: '2026-07-31', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 65.2, occ: 46.0 },

  // August (Days 61 - 90: August 01 to August 30)
  { date: 'Aug 01', fullDate: '2026-08-01', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 2, mum: 1, blr: 1, hyd: 2, wait: 61.2, occ: 44.5 },
  { date: 'Aug 02', fullDate: '2026-08-02', total: 7, emg: 2, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 2, hyd: 2, wait: 63.8, occ: 44.8 },
  { date: 'Aug 03', fullDate: '2026-08-03', total: 5, emg: 1, ele: 2, urg: 1, ref: 1, del: 1, mum: 1, blr: 1, hyd: 2, wait: 58.4, occ: 44.2 },
  { date: 'Aug 04', fullDate: '2026-08-04', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 65.1, occ: 45.3 },
  { date: 'Aug 05', fullDate: '2026-08-05', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.0, occ: 45.1 },
  { date: 'Aug 06', fullDate: '2026-08-06', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 1, hyd: 2, wait: 59.5, occ: 44.9 },
  { date: 'Aug 07', fullDate: '2026-08-07', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 66.4, occ: 45.6 },
  { date: 'Aug 08', fullDate: '2026-08-08', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 1, blr: 2, hyd: 2, wait: 61.8, occ: 45.2 },
  { date: 'Aug 09', fullDate: '2026-08-09', total: 9, emg: 2, ele: 3, urg: 3, ref: 1, del: 3, mum: 2, blr: 2, hyd: 2, wait: 68.2, occ: 46.1 },
  { date: 'Aug 10', fullDate: '2026-08-10', total: 6, emg: 1, ele: 2, urg: 2, ref: 1, del: 1, mum: 2, blr: 1, hyd: 2, wait: 58.7, occ: 45.4 },
  { date: 'Aug 11', fullDate: '2026-08-11', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.9, occ: 45.8 },
  { date: 'Aug 12', fullDate: '2026-08-12', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 65.3, occ: 46.0 },
  { date: 'Aug 13', fullDate: '2026-08-13', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 62.4, occ: 45.7 },
  { date: 'Aug 14', fullDate: '2026-08-14', total: 9, emg: 2, ele: 3, urg: 3, ref: 1, del: 2, mum: 2, blr: 2, hyd: 3, wait: 67.5, occ: 46.4 },
  { date: 'Aug 15', fullDate: '2026-08-15', total: 5, emg: 2, ele: 1, urg: 1, ref: 1, del: 1, mum: 1, blr: 1, hyd: 2, wait: 63.0, occ: 45.1 },
  { date: 'Aug 16', fullDate: '2026-08-16', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.7, occ: 45.9 },
  { date: 'Aug 17', fullDate: '2026-08-17', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 61.5, occ: 45.6 },
  { date: 'Aug 18', fullDate: '2026-08-18', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 65.0, occ: 46.0 },
  { date: 'Aug 19', fullDate: '2026-08-19', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 3, wait: 68.0, occ: 46.5 },
  { date: 'Aug 20', fullDate: '2026-08-20', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.2, occ: 46.2 },
  { date: 'Aug 21', fullDate: '2026-08-21', total: 11, emg: 3, ele: 4, urg: 3, ref: 1, del: 3, mum: 3, blr: 2, hyd: 3, wait: 72.8, occ: 47.8 },
  { date: 'Aug 22', fullDate: '2026-08-22', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 63.9, occ: 46.6 },
  { date: 'Aug 23', fullDate: '2026-08-23', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 3, wait: 66.8, occ: 47.1 },
  { date: 'Aug 24', fullDate: '2026-08-24', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.0, occ: 46.7 },
  { date: 'Aug 25', fullDate: '2026-08-25', total: 7, emg: 1, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 1, hyd: 2, wait: 60.5, occ: 46.1 },
  { date: 'Aug 26', fullDate: '2026-08-26', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 3, wait: 67.2, occ: 47.0 },
  { date: 'Aug 27', fullDate: '2026-08-27', total: 10, emg: 3, ele: 3, urg: 3, ref: 1, del: 3, mum: 2, blr: 2, hyd: 3, wait: 70.4, occ: 47.5 },
  { date: 'Aug 28', fullDate: '2026-08-28', total: 8, emg: 2, ele: 3, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 2, wait: 64.5, occ: 46.8 },
  { date: 'Aug 29', fullDate: '2026-08-29', total: 9, emg: 2, ele: 4, urg: 2, ref: 1, del: 2, mum: 2, blr: 2, hyd: 3, wait: 67.1, occ: 47.2 },
  { date: 'Aug 30', fullDate: '2026-08-30', total: 10, emg: 2, ele: 4, urg: 3, ref: 1, del: 3, mum: 2, blr: 2, hyd: 3, wait: 69.2, occ: 47.6 }
];

// Generate computed 90-day array with 7-day moving averages and cumulative aggregates
export const PATIENT_FLOW_90_DAYS: DailyPatientFlow[] = (() => {
  let cumSum = 0;
  return RAW_90_DAYS_DATA.map((row, idx, arr) => {
    cumSum += row.total;
    // Calculate 7-day trailing average
    const startIdx = Math.max(0, idx - 6);
    const windowSlice = arr.slice(startIdx, idx + 1);
    const windowSum = windowSlice.reduce((sum, item) => sum + item.total, 0);
    const movingAvg = Number((windowSum / windowSlice.length).toFixed(1));

    // Daily growth compared to previous day
    const prev = idx > 0 ? arr[idx - 1].total : row.total;
    const growth = prev > 0 ? Number((((row.total - prev) / prev) * 100).toFixed(1)) : 0;

    return {
      date: row.date,
      fullDate: row.fullDate,
      dayIndex: idx + 1,
      totalAdmissions: row.total,
      cumulativeAdmissions: cumSum,
      movingAverage7d: movingAvg,
      emergency: row.emg,
      elective: row.ele,
      urgent: row.urg,
      referral: row.ref,
      delhi: row.del,
      mumbai: row.mum,
      bangalore: row.blr,
      hyderabad: row.hyd,
      avgWaitMinutes: row.wait,
      growthRatePct: growth,
      bedOccupancyPct: row.occ
    };
  });
})();

// Preset sub-slices
export const PATIENT_FLOW_7_DAYS = PATIENT_FLOW_90_DAYS.slice(-7);
export const PATIENT_FLOW_30_DAYS = PATIENT_FLOW_90_DAYS.slice(-30);

// Helper function to extract and calculate telemetry metrics for any date slice
export function computeRangeMetrics(dataSlice: DailyPatientFlow[]) {
  if (!dataSlice || dataSlice.length === 0) {
    return {
      totalAdmissions: 0,
      netGrowthRatePct: '0.0%',
      peakDayVolume: 0,
      peakDayDate: 'N/A',
      recentVelocity7d: '0.0/day',
      emergencySharePct: '0.0%',
      averageWaitTime: '0.0 min',
      bedOccupancy: '0.0%',
      daysCount: 0,
      startDate: 'N/A',
      endDate: 'N/A'
    };
  }

  const totalAdmissions = dataSlice.reduce((acc, curr) => acc + curr.totalAdmissions, 0);
  const totalEmergency = dataSlice.reduce((acc, curr) => acc + curr.emergency, 0);
  const avgWait = (dataSlice.reduce((acc, curr) => acc + curr.avgWaitMinutes, 0) / dataSlice.length).toFixed(1);
  const avgOcc = (dataSlice.reduce((acc, curr) => acc + curr.bedOccupancyPct, 0) / dataSlice.length).toFixed(1);
  
  let peak = dataSlice[0];
  dataSlice.forEach(d => {
    if (d.totalAdmissions > peak.totalAdmissions) {
      peak = d;
    }
  });

  const firstDay = dataSlice[0].totalAdmissions;
  const lastDay = dataSlice[dataSlice.length - 1].totalAdmissions;
  const netGrowth = firstDay > 0 ? (((lastDay - firstDay) / firstDay) * 100).toFixed(1) : '0.0';
  const lastVelocity = dataSlice[dataSlice.length - 1].movingAverage7d.toFixed(1);
  const emergencyPct = totalAdmissions > 0 ? ((totalEmergency / totalAdmissions) * 100).toFixed(1) : '0.0';

  return {
    totalAdmissions,
    netGrowthRatePct: `${Number(netGrowth) >= 0 ? '+' : ''}${netGrowth}%`,
    peakDayVolume: peak.totalAdmissions,
    peakDayDate: peak.date,
    recentVelocity7d: `${lastVelocity}/day`,
    emergencySharePct: `${emergencyPct}%`,
    averageWaitTime: `${avgWait} min`,
    bedOccupancy: `${avgOcc}%`,
    daysCount: dataSlice.length,
    startDate: dataSlice[0].date,
    endDate: dataSlice[dataSlice.length - 1].date
  };
}

export const FLOW_METRICS_SUMMARY = computeRangeMetrics(PATIENT_FLOW_30_DAYS);
