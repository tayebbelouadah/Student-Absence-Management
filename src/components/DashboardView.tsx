import React from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserX,
  FilePlus,
  Printer,
  ChevronLeft,
  Building,
  GraduationCap,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { AbsenceRecord, StaffMember, UniversityConfig } from '../types';

interface DashboardViewProps {
  records: AbsenceRecord[];
  onOpenNewEntry: () => void;
  onSelectRecordForPrint: (record: AbsenceRecord) => void;
  onNavigateToRecords: () => void;
  activeStaff: StaffMember | undefined;
  config: UniversityConfig;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onOpenNewEntry,
  onSelectRecordForPrint,
  onNavigateToRecords,
  activeStaff,
  config,
}) => {
  const total = records.length;
  const approved = records.filter((r) => r.status === 'مقبول').length;
  const rejected = records.filter((r) => r.status === 'مرفوض').length;
  const delayExceeded = records.filter((r) => r.status === 'تجاوز الأجل القانوني (72ساعة)').length;
  const pending = records.filter((r) => r.status === 'قيد الدراسة').length;

  // Department distribution
  const lawCount = records.filter((r) => r.department === 'قسم الحقوق').length;
  const poliCount = records.filter((r) => r.department === 'قسم العلوم السياسية').length;

  // Level breakdown
  const levels = [
    'ليسانس سنة أولى (L1)',
    'ليسانس سنة ثانية (L2)',
    'ليسانس سنة ثالثة (L3)',
    'ماستر سنة أولى (M1)',
    'ماستر سنة ثانية (M2)',
  ];

  // Group absences by student to check threshold for academic warnings/exclusions
  const studentAbsenceMap = new Map<
    string,
    {
      studentId: string;
      fullName: string;
      level: string;
      department: string;
      records: AbsenceRecord[];
    }
  >();

  records.forEach((r) => {
    const key = r.studentId;
    if (!studentAbsenceMap.has(key)) {
      studentAbsenceMap.set(key, {
        studentId: r.studentId,
        fullName: `${r.lastName} ${r.firstName}`,
        level: r.level,
        department: r.department,
        records: [],
      });
    }
    studentAbsenceMap.get(key)!.records.push(r);
  });

  const studentsWithWarnings = Array.from(studentAbsenceMap.values())
    .map((s) => {
      const unexcusedCount = s.records.filter(
        (r) => r.status === 'مرفوض' || r.status === 'تجاوز الأجل القانوني (72ساعة)'
      ).length;
      const totalAbsences = s.records.length;
      return {
        ...s,
        unexcusedCount,
        totalAbsences,
        isCritical: unexcusedCount >= 3 || totalAbsences >= 5,
        isWarning: unexcusedCount === 2 || totalAbsences >= 3,
      };
    })
    .filter((s) => s.totalAbsences >= 2)
    .sort((a, b) => b.totalAbsences - a.totalAbsences);

  const recentRecords = [...records].reverse().slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>نظام المتابعة الإدارية والأرشفة الرقمية نشط</span>
          </div>
          <h2 className="text-xl font-bold text-[#0c2e60]">
            لوحة قيادة متابعة الغيابات - {config.facultyName}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            مرحباً بك، <strong className="text-slate-700">{activeStaff?.fullName || 'الموظف المسؤول'}</strong>. تتيح لك لوحة القيادة حصر الغيابات المبررة وغير المبررة، تتبع احترام الآجال القانونية (72 ساعة)، وإصدار الوثائق الرسمية للطلبة وفق القرار الوزاري المنظم.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={onOpenNewEntry}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1e40af] hover:bg-[#1d4ed8] text-white px-4 py-2.5 rounded-lg font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
          >
            <FilePlus className="w-4 h-4 text-blue-200" />
            <span>تسجيل غياب طالب جديد</span>
          </button>
          <button
            onClick={onNavigateToRecords}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2.5 rounded-lg font-semibold text-xs border border-slate-300 transition active:scale-95 cursor-pointer"
          >
            <span>استعراض الأرشيف العام</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Records */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">إجمالي السجلات المسجلة</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#0c2e60]">{total}</span>
            <span className="text-[11px] text-slate-500">ملف مسجل</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span>قسم الحقوق: <strong className="font-mono text-slate-700">{lawCount}</strong></span>
            <span>·</span>
            <span>العلوم السياسية: <strong className="font-mono text-slate-700">{poliCount}</strong></span>
          </div>
        </div>

        {/* Approved Justified */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">التبريرات المقبولة نظامياً</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">{approved}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              ({total > 0 ? Math.round((approved / total) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            شهادات طبية ومبررات قانونية مؤشرة
          </div>
        </div>

        {/* 72h Delay Exceeded */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">تجاوز الأجل القانوني (72ساعة)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-700">{delayExceeded}</span>
            <span className="text-[11px] text-rose-600 font-semibold">مخالف للقرار 711</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            أودعت بعد انتهاء مهلة 3 أيام
          </div>
        </div>

        {/* Pending Study */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ملفات قيد الدراسة والمصادقة</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-700">{pending}</span>
            <span className="text-[11px] text-amber-600">بانتظار التأشير</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            تتطلب تأشيرة رئيس القسم أو اللجنة
          </div>
        </div>
      </div>

      {/* Grid: Academic Alerts (Potential Exclusion) & Departments Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exclusion & Warning Watchlist (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  لوحة متابعة تكرار الغيابات ومؤشرات الإقصاء البيداغوجي
                </h3>
                <p className="text-[11px] text-slate-500">
                  تنبيه آلي للطلبة الذين تجاوزوا الغيابين (وفق نص المادة 24 من القرار الوزاري رقم 711)
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500 font-mono">
              {studentsWithWarnings.length} طلبة مسجلين
            </span>
          </div>

          {studentsWithWarnings.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              لا توجد حالات تكرار غياب حرجة مسجلة حالياً في النظام.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/80">
                    <th className="py-2.5 px-3 font-semibold">رقم التسجيل</th>
                    <th className="py-2.5 px-3 font-semibold">اسم ولقب الطالب</th>
                    <th className="py-2.5 px-3 font-semibold">المستوى والقسم</th>
                    <th className="py-2.5 px-3 font-semibold text-center">إجمالي الغيابات</th>
                    <th className="py-2.5 px-3 font-semibold text-center">غير المبررة</th>
                    <th className="py-2.5 px-3 font-semibold text-center">الحالة الإدارية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsWithWarnings.map((st) => (
                    <tr key={st.studentId} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                        {st.studentId}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#0c2e60]">
                        {st.fullName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {st.level} - <span className="text-[11px] text-blue-700">{st.department}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                        {st.totalAbsences}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-700">
                        {st.unexcusedCount}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {st.isCritical ? (
                          <span className="inline-block px-2 py-0.5 text-[10.5px] font-bold text-rose-800 bg-rose-100 rounded-md border border-rose-300">
                            مُهدد بالإقصاء (إنذار 2)
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[10.5px] font-semibold text-amber-800 bg-amber-100 rounded-md border border-amber-300">
                            تنبيه بيداغوجي (إنذار 1)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Level Distribution Column */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-3">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">توزيع الغيابات حسب الطور والمستوى</h3>
                <p className="text-[11px] text-slate-500">ليسانس وماستر بالكلية</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {levels.map((lvl) => {
                const count = records.filter((r) => r.level === lvl).length;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={lvl} className="text-xs">
                    <div className="flex justify-between items-center mb-1 text-slate-700 font-medium">
                      <span>{lvl}</span>
                      <span className="font-mono text-slate-900">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(4, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Department Box */}
          <div className="mt-6 pt-4 border-t border-slate-200 bg-slate-50 p-3 rounded-lg text-xs">
            <span className="font-bold text-slate-800 block mb-2">إحصائية الأقسام البيداغوجية:</span>
            <div className="flex items-center justify-between text-slate-600 mb-1">
              <span>قسم الحقوق (قانون عام / خاص):</span>
              <strong className="font-mono text-blue-900">{lawCount} ملف</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>قسم العلوم السياسية والعلاقات الدولية:</span>
              <strong className="font-mono text-blue-900">{poliCount} ملف</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Records Table with Quick Receipt Print Action */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>أحدث إدخالات الغياب المسجلة بالنظام</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              السجلات مرتبة حسب الرقم التسلسلي وتاريخ الإيداع الأخير
            </p>
          </div>
          <button
            onClick={onNavigateToRecords}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline cursor-pointer"
          >
            عرض كافة السجلات ({records.length}) ←
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">الرقم التسلسلي</th>
                <th className="py-2.5 px-3 font-semibold">اسم ولقب الطالب</th>
                <th className="py-2.5 px-3 font-semibold">رقم التسجيل</th>
                <th className="py-2.5 px-3 font-semibold">المستوى / القسم</th>
                <th className="py-2.5 px-3 font-semibold">المقياس</th>
                <th className="py-2.5 px-3 font-semibold">الجهة المصدرة للشهادة</th>
                <th className="py-2.5 px-3 font-semibold text-center">أجل 72س</th>
                <th className="py-2.5 px-3 font-semibold text-center">الحالة</th>
                <th className="py-2.5 px-3 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-blue-50/40 transition">
                  <td className="py-2 px-3 font-mono font-bold text-[#0c2e60]">
                    {rec.serialNumber}
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-900">
                    {rec.lastName} {rec.firstName}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-600">
                    {rec.studentId}
                  </td>
                  <td className="py-2 px-3 text-slate-600">
                    <div>{rec.level}</div>
                    <div className="text-[10px] text-slate-400">{rec.department}</div>
                  </td>
                  <td className="py-2 px-3 text-slate-700 max-w-[140px] truncate" title={rec.subject}>
                    {rec.subject}
                  </td>
                  <td className="py-2 px-3 text-slate-600 max-w-[160px] truncate" title={rec.issuedBy}>
                    {rec.issuedBy}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {rec.isWithin72Hours ? (
                      <span className="text-emerald-700 text-[11px] font-semibold">محترم ✓</span>
                    ) : (
                      <span className="text-rose-700 text-[11px] font-bold">تجاوز ✕</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {rec.status === 'مقبول' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded">
                        مقبول
                      </span>
                    )}
                    {rec.status === 'قيد الدراسة' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold text-amber-800 bg-amber-100 rounded">
                        قيد الدراسة
                      </span>
                    )}
                    {(rec.status === 'مرفوض' || rec.status === 'تجاوز الأجل القانوني (72ساعة)') && (
                      <span className="px-2 py-0.5 text-[10px] font-bold text-rose-800 bg-rose-100 rounded">
                        {rec.status === 'تجاوز الأجل القانوني (72ساعة)' ? 'تجاوز 72س' : 'مرفوض'}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => onSelectRecordForPrint(rec)}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition cursor-pointer active:scale-95"
                      title="طباعة وصل إيداع تبرير غياب رسمي للطالب"
                    >
                      <Printer className="w-3 h-3" />
                      <span>وصل استلام</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
