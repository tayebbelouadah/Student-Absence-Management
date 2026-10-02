import React, { useState, useEffect } from 'react';
import {
  AbsenceRecord,
  StudentLevel,
  DepartmentType,
  AbsenceReasonType,
  AbsenceStatus,
  StaffMember,
  UniversityConfig,
} from '../types';
import {
  X,
  FilePlus,
  Save,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building,
  User,
  GraduationCap,
  FileText,
} from 'lucide-react';
import {
  calculateDaysBetween,
  checkIsWithin72Hours,
  generateNextSerialNumber,
} from '../utils/storage';

interface AbsenceEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: AbsenceRecord) => void;
  existingRecord?: AbsenceRecord | null;
  allRecords: AbsenceRecord[];
  activeStaff: StaffMember | undefined;
  issuingAuthorities: string[];
  config: UniversityConfig;
}

export const AbsenceEntryModal: React.FC<AbsenceEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingRecord,
  allRecords,
  activeStaff,
  issuingAuthorities,
  config,
}) => {
  const [serialNumber, setSerialNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [bacYear, setBacYear] = useState<number>(new Date().getFullYear() - 2);
  const [level, setLevel] = useState<StudentLevel>('ليسانس سنة أولى (L1)');
  const [department, setDepartment] = useState<DepartmentType>('قسم الحقوق');
  const [specialty, setSpecialty] = useState('جذع مشترك حقوق');
  const [academicYear, setAcademicYear] = useState(config.academicYear);
  const [semester, setSemester] = useState('S1');
  const [group, setGroup] = useState('فوج 01');
  const [subject, setSubject] = useState('المدخل للعلوم القانونية');
  const [sessionType, setSessionType] = useState<'محاضرة' | 'أعمال موجهة (TD)' | 'أعمال تطبيقية (TP)'>('أعمال موجهة (TD)');
  
  const todayStr = new Date().toISOString().slice(0, 10);
  const [absenceDateStart, setAbsenceDateStart] = useState(todayStr);
  const [absenceDateEnd, setAbsenceDateEnd] = useState(todayStr);
  const [durationDays, setDurationDays] = useState<number>(1);
  
  const [absenceReason, setAbsenceReason] = useState<AbsenceReasonType>('شهادة طبية (مرض)');
  const [issuedBy, setIssuedBy] = useState(issuingAuthorities[0] || 'المركز الصحي الجامعي - قطب المسيلة المركزي');
  const [customIssuedBy, setCustomIssuedBy] = useState('');
  const [isCustomAuthority, setIsCustomAuthority] = useState(false);

  const [submissionDate, setSubmissionDate] = useState(todayStr);
  const [isWithin72Hours, setIsWithin72Hours] = useState(true);
  const [status, setStatus] = useState<AbsenceStatus>('مقبول');
  const [isJustified, setIsJustified] = useState(true);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Specialties presets per department
  const lawSpecialties = [
    'جذع مشترك حقوق',
    'قانون عام',
    'قانون خاص',
    'قانون الأعمال',
    'قانون دولي عام',
    'علوم قانونية وإدارية',
  ];
  const poliSpecialties = [
    'جذع مشترك علوم سياسية',
    'تنظيمات سياسية وإدارية',
    'علاقات دولية',
    'دراسات إقليمية وأمنية',
    'سياسات عامة وحكامة',
  ];

  // Initialize form state
  useEffect(() => {
    if (existingRecord) {
      setSerialNumber(existingRecord.serialNumber);
      setLastName(existingRecord.lastName);
      setFirstName(existingRecord.firstName);
      setStudentId(existingRecord.studentId);
      setBacYear(existingRecord.bacYear);
      setLevel(existingRecord.level);
      setDepartment(existingRecord.department);
      setSpecialty(existingRecord.specialty);
      setAcademicYear(existingRecord.academicYear);
      setSemester(existingRecord.semester);
      setGroup(existingRecord.group);
      setSubject(existingRecord.subject);
      setSessionType(existingRecord.sessionType);
      setAbsenceDateStart(existingRecord.absenceDateStart);
      setAbsenceDateEnd(existingRecord.absenceDateEnd);
      setDurationDays(existingRecord.durationDays);
      setAbsenceReason(existingRecord.absenceReason);

      if (issuingAuthorities.includes(existingRecord.issuedBy)) {
        setIssuedBy(existingRecord.issuedBy);
        setIsCustomAuthority(false);
      } else {
        setIssuedBy('أخرى');
        setCustomIssuedBy(existingRecord.issuedBy);
        setIsCustomAuthority(true);
      }

      setSubmissionDate(existingRecord.submissionDate);
      setIsWithin72Hours(existingRecord.isWithin72Hours);
      setStatus(existingRecord.status);
      setIsJustified(existingRecord.isJustified);
      setNotes(existingRecord.notes || '');
    } else {
      // Auto-generate sequential serial number
      const nextNum = generateNextSerialNumber(allRecords);
      setSerialNumber(nextNum);
      setLastName('');
      setFirstName('');
      setStudentId('');
      setBacYear(new Date().getFullYear() - 2);
      setLevel('ليسانس سنة أولى (L1)');
      setDepartment('قسم الحقوق');
      setSpecialty('جذع مشترك حقوق');
      setAcademicYear(config.academicYear);
      setSemester('S1');
      setGroup('فوج 01');
      setSubject('المدخل للعلوم القانونية');
      setSessionType('أعمال موجهة (TD)');
      setAbsenceDateStart(todayStr);
      setAbsenceDateEnd(todayStr);
      setDurationDays(1);
      setAbsenceReason('شهادة طبية (مرض)');
      setIssuedBy(issuingAuthorities[0] || 'المركز الصحي الجامعي - قطب المسيلة المركزي');
      setIsCustomAuthority(false);
      setCustomIssuedBy('');
      setSubmissionDate(todayStr);
      setIsWithin72Hours(true);
      setStatus('مقبول');
      setIsJustified(true);
      setNotes('');
      setErrorMessage('');
    }
  }, [existingRecord, isOpen, allRecords, config.academicYear, issuingAuthorities]);

  // Recalculate duration & 72-hour delay whenever dates change
  useEffect(() => {
    const days = calculateDaysBetween(absenceDateStart, absenceDateEnd);
    setDurationDays(days);

    const within = checkIsWithin72Hours(absenceDateEnd, submissionDate);
    setIsWithin72Hours(within);

    // If delay exceeded and we are creating a new record or hasn't manually overridden
    if (!within && !existingRecord) {
      setStatus('تجاوز الأجل القانوني (72ساعة)');
      setIsJustified(false);
      if (!notes) {
        setNotes('تم إيداع التبرير بعد انقضاء مهلة 72 ساعة المنصوص عليها في القرار الوزاري رقم 711.');
      }
    } else if (within && status === 'تجاوز الأجل القانوني (72ساعة)') {
      setStatus('مقبول');
      setIsJustified(true);
    }
  }, [absenceDateStart, absenceDateEnd, submissionDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName.trim() || !firstName.trim() || !studentId.trim()) {
      setErrorMessage('يرجى إدخال اسم ولقب الطالب ورقم التسجيل بدقة.');
      return;
    }
    if (!serialNumber.trim()) {
      setErrorMessage('يرجى التأكد من وجود الرقم التسلسلي لإنجاز العملية.');
      return;
    }

    const finalIssuedBy = isCustomAuthority ? (customIssuedBy.trim() || 'جهة غير محددة') : issuedBy;

    const recordToSave: AbsenceRecord = {
      id: existingRecord ? existingRecord.id : `rec-${Date.now()}`,
      serialNumber: serialNumber.trim(),
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      studentId: studentId.trim(),
      bacYear: Number(bacYear),
      level,
      department,
      specialty,
      academicYear,
      semester,
      group,
      subject: subject.trim(),
      sessionType,
      absenceDateStart,
      absenceDateEnd,
      durationDays: Number(durationDays),
      absenceReason,
      issuedBy: finalIssuedBy,
      submissionDate,
      isWithin72Hours,
      status,
      isJustified: status === 'مقبول',
      notes: notes.trim(),
      clerkName: activeStaff?.fullName || 'موظف مصلحة التدريس',
      clerkId: activeStaff?.id || 'staff-admin',
      createdAt: existingRecord ? existingRecord.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(recordToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 lg:p-6 overflow-y-auto no-print">
      <div className="bg-white rounded-xl shadow-2xl border border-blue-900/40 w-full max-w-4xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Windows Header */}
        <div className="bg-[#0b2447] text-white px-5 py-3 flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
              <FilePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                {existingRecord ? 'تعديل وتدقيق ملف غياب طالب' : 'استمارة إنجاز وإدخال بيانات غياب طالب'}
              </h2>
              <p className="text-[11px] text-blue-200">
                جامعة محمد بوضياف بالمسيلة · كلية الحقوق والعلوم السياسية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-rose-600 transition"
            title="إغلاق الاستمارة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 max-h-[80vh] overflow-y-auto space-y-5 text-xs text-slate-800">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3.5 py-2.5 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Official Serial Number & Processing Clerk */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="font-bold text-[#0c2e60]">
                الرقم التسلسلي لإنجاز المعاملة:
              </label>
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-32 bg-white border border-blue-400 font-mono font-bold text-center text-sm text-blue-900 px-2 py-1 rounded shadow-2xs focus:ring-2 focus:ring-blue-500"
                placeholder="2026/0001"
              />
              <span className="text-[10px] text-slate-500">(توليد تسلسلي آلي سنوي)</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-semibold">الموظف المسجل للإدخال:</span>
              <span className="font-bold text-blue-950 bg-white px-2.5 py-0.5 rounded border border-blue-200 shadow-2xs">
                {activeStaff?.fullName || 'موظف مصلحة التدريس'}
              </span>
            </div>
          </div>

          {/* Section 2: Student Identification (بيانات الطالب) */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-[#0c2e60] border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>أولاً: بيانات الهوية الجامعية للطالب</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Last Name */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  اللقب (Nom) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="مثال: قاسمي"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  الاسم (Prénom) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="مثال: أيمن"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Student Registration Number (Matricule) */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  رقم التسجيل (Matricule) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="مثال: 232335011420"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Baccalaureate Year */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  عام البكالوريا (Année BAC) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={2000}
                  max={2030}
                  value={bacYear}
                  onChange={(e) => setBacYear(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Academic Level & Department (المستوى والقسم) */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-[#0c2e60] border-b border-slate-200 pb-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>ثانياً: التوزيع البيداغوجي (المستوى، القسم، المقياس)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Level */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">المستوى</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as StudentLevel)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ليسانس سنة أولى (L1)">ليسانس سنة أولى (L1)</option>
                  <option value="ليسانس سنة ثانية (L2)">ليسانس سنة ثانية (L2)</option>
                  <option value="ليسانس سنة ثالثة (L3)">ليسانس سنة ثالثة (L3)</option>
                  <option value="ماستر سنة أولى (M1)">ماستر سنة أولى (M1)</option>
                  <option value="ماستر سنة ثانية (M2)">ماستر سنة ثانية (M2)</option>
                  <option value="دكتوراه الطور الثالث">دكتوراه الطور الثالث</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">القسم</label>
                <select
                  value={department}
                  onChange={(e) => {
                    const newDept = e.target.value as DepartmentType;
                    setDepartment(newDept);
                    setSpecialty(newDept === 'قسم الحقوق' ? lawSpecialties[0] : poliSpecialties[0]);
                  }}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="قسم الحقوق">قسم الحقوق</option>
                  <option value="قسم العلوم السياسية">قسم العلوم السياسية</option>
                </select>
              </div>

              {/* Specialty */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">التخصص</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                >
                  {(department === 'قسم الحقوق' ? lawSpecialties : poliSpecialties).map((sp) => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">السنة الدراسية</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
              {/* Semester */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">السداسي</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-2 focus:ring-blue-500"
                >
                  <option value="S1">السداسي الأول (S1)</option>
                  <option value="S2">السداسي الثاني (S2)</option>
                  <option value="S3">السداسي الثالث (S3)</option>
                  <option value="S4">السداسي الرابع (S4)</option>
                  <option value="S5">السداسي الخامس (S5)</option>
                  <option value="S6">السداسي السادس (S6)</option>
                </select>
              </div>

              {/* Group */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">الفوج / المجموعة</label>
                <input
                  type="text"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  placeholder="مثال: فوج 04"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">المقياس المعني</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="مثال: القانون المدني"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Session Type */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">نوع الحصة</label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="أعمال موجهة (TD)">أعمال موجهة (TD)</option>
                  <option value="محاضرة">محاضرة</option>
                  <option value="أعمال تطبيقية (TP)">أعمال تطبيقية (TP)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Absence Period, Reason, & Issuing Authority */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-[#0c2e60] border-b border-slate-200 pb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>ثالثاً: فترة الغياب والشهادة الطبية / المبرر والجهة المصدرة</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Start Date */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">تاريخ بداية الغياب</label>
                <input
                  type="date"
                  required
                  value={absenceDateStart}
                  onChange={(e) => setAbsenceDateStart(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">تاريخ نهاية الغياب</label>
                <input
                  type="date"
                  required
                  value={absenceDateEnd}
                  onChange={(e) => setAbsenceDateEnd(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Duration in Days */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">مدة الغياب (أيام)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-center text-blue-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-500 whitespace-nowrap">يوم/أيام</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Absence Reason */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  طبيعة المبرر / نوع الشهادة
                </label>
                <select
                  value={absenceReason}
                  onChange={(e) => setAbsenceReason(e.target.value as AbsenceReasonType)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="شهادة طبية (مرض)">شهادة طبية (مرض)</option>
                  <option value="شهادة وفاة أصلية (وفاة قريب)">شهادة وفاة أصلية (وفاة قريب)</option>
                  <option value="استدعاء رسمي / قضائي">استدعاء رسمي / قضائي</option>
                  <option value="مشاركة في تظاهرة علمية أو رياضية رسمية">مشاركة في تظاهرة علمية أو رياضية رسمية</option>
                  <option value="عطلة أمومة / حالة ولادة">عطلة أمومة / حالة ولادة</option>
                  <option value="حادث طارئ / قوة قاهرة">حادث طارئ / قوة قاهرة</option>
                  <option value="مبرر آخر">مبرر آخر</option>
                </select>
              </div>

              {/* Issued By (الشهادة الطبية أو شهادة الغياب صادرة عن) */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  الشهادة الطبية أو شهادة الغياب صادرة عن:
                </label>
                {!isCustomAuthority ? (
                  <div className="space-y-1">
                    <select
                      value={issuedBy}
                      onChange={(e) => {
                        if (e.target.value === 'أخرى') {
                          setIsCustomAuthority(true);
                        } else {
                          setIssuedBy(e.target.value);
                        }
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                    >
                      {issuingAuthorities.map((auth) => (
                        <option key={auth} value={auth}>{auth}</option>
                      ))}
                      <option value="أخرى">+ جهة أخرى غير مذكورة...</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      required
                      value={customIssuedBy}
                      onChange={(e) => setCustomIssuedBy(e.target.value)}
                      placeholder="اكتب اسم المستشفى أو العيادة أو الجهة المصدرة..."
                      className="w-full bg-white border border-blue-400 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomAuthority(false)}
                      className="text-[11px] text-blue-700 hover:underline whitespace-nowrap"
                    >
                      إلغاء
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Submission Date & 72 Hours Delay Verification */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-[#0c2e60]">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>رابعاً: تاريخ الإيداع والتحقق من الأجل القانوني (72 ساعة)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                (وفق القرار الوزاري رقم 711)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Submission Date */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  تاريخ إيداع التبرير لدى مصلحة التدريس
                </label>
                <input
                  type="date"
                  required
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 72h Verification Indicator */}
              <div className="flex flex-col justify-center">
                <label className="block font-medium text-slate-700 mb-1">احترام مهلة 72 ساعة</label>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-semibold ${
                    isWithin72Hours
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-rose-50 border-rose-300 text-rose-800'
                  }`}
                >
                  {isWithin72Hours ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>ضمن الأجل القانوني (محترم)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>تجاوز مهلة 72 ساعة المنصوص عليها</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Decision */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">قرار مصلحة التدريس</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AbsenceStatus)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold focus:ring-2 focus:ring-blue-500 text-slate-800"
                >
                  <option value="مقبول">مقبول (مبرر رسمياً)</option>
                  <option value="قيد الدراسة">قيد الدراسة والمطابقة</option>
                  <option value="مرفوض">مرفوض</option>
                  <option value="تجاوز الأجل القانوني (72ساعة)">تجاوز الأجل القانوني (72ساعة)</option>
                </select>
              </div>
            </div>

            {/* Notes & Justification Remarks */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                ملاحظات إدارية / قرار اللجنة البيداغوجية
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أية تفاصيل إضافية عن الشهادة أو سبب التأخر أو رقم الوصل..."
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium transition cursor-pointer active:scale-95"
            >
              إلغاء الأمر
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#1e40af] hover:bg-[#1d4ed8] text-white px-6 py-2 rounded font-bold shadow-md transition active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4 text-blue-200" />
              <span>{existingRecord ? 'حفظ التعديلات' : 'تسجيل وأرشفة غياب الطالب'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
