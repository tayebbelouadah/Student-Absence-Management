import { AbsenceRecord, StaffMember, UniversityConfig } from '../types';
import { DEFAULT_STAFF, DEFAULT_UNIVERSITY_CONFIG, INITIAL_ABSENCE_RECORDS, COMMON_ISSUING_AUTHORITIES } from '../data/initialData';

const RECORDS_KEY = 'msila_law_absence_records_v1';
const STAFF_KEY = 'msila_law_staff_v1';
const CONFIG_KEY = 'msila_law_config_v1';
const AUTHORITIES_KEY = 'msila_law_authorities_v1';

export function getStoredRecords(): AbsenceRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(INITIAL_ABSENCE_RECORDS));
      return INITIAL_ABSENCE_RECORDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading records from localStorage:', e);
    return INITIAL_ABSENCE_RECORDS;
  }
}

export function saveRecords(records: AbsenceRecord[]): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving records to localStorage:', e);
  }
}

export function getStoredStaff(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_KEY, JSON.stringify(DEFAULT_STAFF));
      return DEFAULT_STAFF;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading staff from localStorage:', e);
    return DEFAULT_STAFF;
  }
}

export function saveStaff(staff: StaffMember[]): void {
  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
  } catch (e) {
    console.error('Error saving staff to localStorage:', e);
  }
}

export function getStoredConfig(): UniversityConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_UNIVERSITY_CONFIG));
      return DEFAULT_UNIVERSITY_CONFIG;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading config from localStorage:', e);
    return DEFAULT_UNIVERSITY_CONFIG;
  }
}

export function saveConfig(config: UniversityConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving config to localStorage:', e);
  }
}

export function getStoredAuthorities(): string[] {
  try {
    const raw = localStorage.getItem(AUTHORITIES_KEY);
    if (!raw) {
      localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(COMMON_ISSUING_AUTHORITIES));
      return COMMON_ISSUING_AUTHORITIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading authorities from localStorage:', e);
    return COMMON_ISSUING_AUTHORITIES;
  }
}

export function saveAuthorities(authorities: string[]): void {
  try {
    localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  } catch (e) {
    console.error('Error saving authorities to localStorage:', e);
  }
}

/**
 * Generate next serial number in the official format: YYYY/NNNN (e.g. 2026/0007)
 */
export function generateNextSerialNumber(records: AbsenceRecord[]): string {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `${currentYear}/`;
  
  let maxSeq = 0;
  for (const rec of records) {
    if (rec.serialNumber && rec.serialNumber.startsWith(yearPrefix)) {
      const numPart = parseInt(rec.serialNumber.replace(yearPrefix, ''), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    } else if (rec.serialNumber && rec.serialNumber.includes('/')) {
      const parts = rec.serialNumber.split('/');
      const numPart = parseInt(parts[1], 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  }
  
  const nextSeq = maxSeq + 1;
  return `${currentYear}/${String(nextSeq).padStart(4, '0')}`;
}

/**
 * Check if the submission date is within 72 hours (3 calendar days) of the absence end date
 */
export function checkIsWithin72Hours(absenceEndDate: string, submissionDate: string): boolean {
  if (!absenceEndDate || !submissionDate) return true;
  try {
    const end = new Date(absenceEndDate);
    const sub = new Date(submissionDate);
    const diffTime = sub.getTime() - end.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // 72 hours = up to 3 days from end date
    return diffDays <= 3;
  } catch {
    return true;
  }
}

/**
 * Calculate duration in days between two dates
 */
export function calculateDaysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  } catch {
    return 1;
  }
}

/**
 * Export records to standard CSV with UTF-8 BOM for Arabic support in Excel
 */
export function exportRecordsToCSV(records: AbsenceRecord[]): void {
  const headers = [
    'الرقم التسلسلي',
    'اللقب',
    'الاسم',
    'رقم التسجيل',
    'عام البكالوريا',
    'المستوى',
    'القسم',
    'التخصص',
    'السنة الدراسية',
    'السداسي',
    'الفوج',
    'المقياس',
    'نوع الحصة',
    'تاريخ بداية الغياب',
    'تاريخ نهاية الغياب',
    'المدة (أيام)',
    'طبيعة المبرر',
    'الجهة المصدرة للشهادة',
    'تاريخ إيداع التبرير',
    'احترام أجل 72 ساعة',
    'حالة التبرير',
    'مبرر رسميا',
    'الموظف المكلف بالإنجاز',
    'ملاحظات',
  ];

  const rows = records.map((r) => [
    `"${r.serialNumber}"`,
    `"${r.lastName}"`,
    `"${r.firstName}"`,
    `"${r.studentId}"`,
    r.bacYear,
    `"${r.level}"`,
    `"${r.department}"`,
    `"${r.specialty}"`,
    `"${r.academicYear}"`,
    `"${r.semester}"`,
    `"${r.group}"`,
    `"${r.subject}"`,
    `"${r.sessionType}"`,
    `"${r.absenceDateStart}"`,
    `"${r.absenceDateEnd}"`,
    r.durationDays,
    `"${r.absenceReason}"`,
    `"${r.issuedBy}"`,
    `"${r.submissionDate}"`,
    r.isWithin72Hours ? '"نعم"' : '"لا"',
    `"${r.status}"`,
    r.isJustified ? '"نعم"' : '"لا"',
    `"${r.clerkName}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `غيابات_طلبة_كلية_الحقوق_المسيلة_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Backup all data to JSON
 */
export function exportBackupJSON(records: AbsenceRecord[], staff: StaffMember[], config: UniversityConfig): void {
  const data = {
    exportedAt: new Date().toISOString(),
    system: 'Student Absence Management & Tracking System - Univ of MSila',
    universityConfig: config,
    staff,
    records,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `نسخة_احتياطية_منظومة_غيابات_المسيلة_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
