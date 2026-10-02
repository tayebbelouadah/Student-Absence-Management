import React, { useState, useMemo } from 'react';
import { AbsenceRecord, StudentLevel, DepartmentType, AbsenceStatus } from '../types';
import {
  Search,
  Filter,
  Download,
  Printer,
  Edit3,
  Trash2,
  FilePlus,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Building,
  GraduationCap,
} from 'lucide-react';

interface AbsenceRecordsViewProps {
  records: AbsenceRecord[];
  onOpenNewEntry: () => void;
  onEditRecord: (record: AbsenceRecord) => void;
  onDeleteRecord: (recordId: string) => void;
  onSelectRecordForPrint: (record: AbsenceRecord) => void;
  onExportCSV: () => void;
  initialSearch?: string;
}

export const AbsenceRecordsView: React.FC<AbsenceRecordsViewProps> = ({
  records,
  onOpenNewEntry,
  onEditRecord,
  onDeleteRecord,
  onSelectRecordForPrint,
  onExportCSV,
  initialSearch = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filter72h, setFilter72h] = useState<string>('all');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<AbsenceRecord | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Search matches
      const query = searchTerm.toLowerCase().trim();
      if (query) {
        const matchesSerial = rec.serialNumber.toLowerCase().includes(query);
        const matchesName = `${rec.lastName} ${rec.firstName}`.toLowerCase().includes(query);
        const matchesId = rec.studentId.toLowerCase().includes(query);
        const matchesSubject = rec.subject.toLowerCase().includes(query);
        const matchesAuthority = rec.issuedBy.toLowerCase().includes(query);
        const matchesClerk = rec.clerkName.toLowerCase().includes(query);

        if (!matchesSerial && !matchesName && !matchesId && !matchesSubject && !matchesAuthority && !matchesClerk) {
          return false;
        }
      }

      // Department filter
      if (filterDepartment !== 'all' && rec.department !== filterDepartment) {
        return false;
      }

      // Level filter
      if (filterLevel !== 'all' && rec.level !== filterLevel) {
        return false;
      }

      // Status filter
      if (filterStatus !== 'all' && rec.status !== filterStatus) {
        return false;
      }

      // 72h filter
      if (filter72h === 'compliant' && !rec.isWithin72Hours) {
        return false;
      }
      if (filter72h === 'exceeded' && rec.isWithin72Hours) {
        return false;
      }

      return true;
    });
  }, [records, searchTerm, filterDepartment, filterLevel, filterStatus, filter72h]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterDepartment('all');
    setFilterLevel('all');
    setFilterStatus('all');
    setFilter72h('all');
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0c2e60] flex items-center gap-2">
              <span>سجل وأرشيف غيابات الطلبة</span>
              <span className="text-xs bg-blue-100 text-blue-900 font-mono font-semibold px-2 py-0.5 rounded-full">
                {filteredRecords.length} من {records.length}
              </span>
            </h2>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={onOpenNewEntry}
              className="flex items-center gap-1.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>إدخال غياب طالب جديد</span>
            </button>
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير Excel</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="بحث بالرقم، اللقب، الاسم، التسجيل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 pr-8 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">كل الأقسام البيداغوجية</option>
              <option value="قسم الحقوق">قسم الحقوق</option>
              <option value="قسم العلوم السياسية">قسم العلوم السياسية</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">كل المستويات والأطوار</option>
              <option value="ليسانس سنة أولى (L1)">ليسانس سنة أولى (L1)</option>
              <option value="ليسانس سنة ثانية (L2)">ليسانس سنة ثانية (L2)</option>
              <option value="ليسانس سنة ثالثة (L3)">ليسانس سنة ثالثة (L3)</option>
              <option value="ماستر سنة أولى (M1)">ماستر سنة أولى (M1)</option>
              <option value="ماستر سنة ثانية (M2)">ماستر سنة ثانية (M2)</option>
              <option value="دكتوراه الطور الثالث">دكتوراه الطور الثالث</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">كل قرارات التبرير</option>
              <option value="مقبول">مقبول (مبرر)</option>
              <option value="قيد الدراسة">قيد الدراسة</option>
              <option value="مرفوض">مرفوض</option>
              <option value="تجاوز الأجل القانوني (72ساعة)">تجاوز الأجل القانوني (72س)</option>
            </select>
          </div>

          {/* 72h Filter & Reset */}
          <div className="flex items-center gap-1.5">
            <select
              value={filter72h}
              onChange={(e) => setFilter72h(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">أجل 72 ساعة (الكل)</option>
              <option value="compliant">محترم في الآجال</option>
              <option value="exceeded">متجاوز لـ 72 ساعة</option>
            </select>
            <button
              onClick={handleResetFilters}
              className="p-1.5 border border-slate-300 rounded hover:bg-slate-100 text-slate-600 transition"
              title="إعادة تعيين المرشحات"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Records Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 text-sm font-semibold">لم يتم العثور على سجلات تطابق شروط البحث</p>
            <p className="text-slate-400 text-xs mt-1">جرّب تغيير كلمات البحث أو إعادة تعيين المرشحات.</p>
            <button
              onClick={handleResetFilters}
              className="mt-3 text-xs text-blue-700 hover:underline font-semibold"
            >
              إلغاء جميع المرشحات
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#f0f4f9] text-[#0c2e60] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">الرقم التسلسلي</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">اللقب والاسم</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">رقم التسجيل</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">عام البكالوريا</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">المستوى والتخصص</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">المقياس والفوج</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">تاريخ الغياب</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">المدة</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">الشهادة صادرة عن</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">أجل 72س</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">القرار</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-blue-50/50 transition">
                    {/* Serial Number */}
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {rec.serialNumber}
                    </td>

                    {/* Student Full Name */}
                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {rec.lastName} {rec.firstName}
                    </td>

                    {/* Student Matricule */}
                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {rec.studentId}
                    </td>

                    {/* Baccalaureate Year */}
                    <td className="py-2.5 px-3 font-mono text-slate-600 text-center whitespace-nowrap">
                      {rec.bacYear}
                    </td>

                    {/* Level & Specialty */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      <div className="font-medium">{rec.level}</div>
                      <div className="text-[10.5px] text-slate-500">{rec.department} · {rec.specialty}</div>
                    </td>

                    {/* Subject & Group */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      <div className="font-medium max-w-[130px] truncate" title={rec.subject}>{rec.subject}</div>
                      <div className="text-[10.5px] text-slate-500">{rec.semester} · {rec.group} ({rec.sessionType})</div>
                    </td>

                    {/* Dates */}
                    <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                      <div>من: {rec.absenceDateStart}</div>
                      <div>إلى: {rec.absenceDateEnd}</div>
                    </td>

                    {/* Duration in Days */}
                    <td className="py-2.5 px-3 font-mono font-bold text-center text-slate-800 whitespace-nowrap">
                      {rec.durationDays} يوم
                    </td>

                    {/* Issued by */}
                    <td className="py-2.5 px-3 text-slate-600 max-w-[180px] truncate" title={rec.issuedBy}>
                      <div className="truncate font-medium">{rec.issuedBy}</div>
                      <div className="text-[10px] text-slate-400">{rec.absenceReason}</div>
                    </td>

                    {/* 72h Rule */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {rec.isWithin72Hours ? (
                        <span className="inline-flex items-center gap-0.5 text-emerald-700 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>محترم</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-rose-700 text-[11px] font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>تجاوز</span>
                        </span>
                      )}
                    </td>

                    {/* Decision Status */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {rec.status === 'مقبول' && (
                        <span className="px-2 py-0.5 text-[10.5px] font-bold text-emerald-800 bg-emerald-100 rounded">
                          مقبول
                        </span>
                      )}
                      {rec.status === 'قيد الدراسة' && (
                        <span className="px-2 py-0.5 text-[10.5px] font-bold text-amber-800 bg-amber-100 rounded">
                          قيد الدراسة
                        </span>
                      )}
                      {rec.status === 'مرفوض' && (
                        <span className="px-2 py-0.5 text-[10.5px] font-bold text-rose-800 bg-rose-100 rounded">
                          مرفوض
                        </span>
                      )}
                      {rec.status === 'تجاوز الأجل القانوني (72ساعة)' && (
                        <span className="px-2 py-0.5 text-[10.5px] font-bold text-rose-800 bg-rose-100 rounded">
                          تجاوز 72س
                        </span>
                      )}
                    </td>

                    {/* Actions Toolbar */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {/* Print Official Receipt */}
                        <button
                          onClick={() => onSelectRecordForPrint(rec)}
                          className="p-1 rounded text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition"
                          title="طباعة وصل استلام رسمي للطالب"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* View Detail Modal */}
                        <button
                          onClick={() => setSelectedRecordForDetail(rec)}
                          className="p-1 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                          title="معاينة كامل تفاصيل الملف"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Record */}
                        <button
                          onClick={() => onEditRecord(rec)}
                          className="p-1 rounded text-amber-600 hover:bg-amber-100 hover:text-amber-800 transition"
                          title="تعديل بيانات الغياب"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Record */}
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف سجل غياب الطالب "${rec.lastName} ${rec.firstName}" (رقم: ${rec.serialNumber})؟`)) {
                              onDeleteRecord(rec.id);
                            }
                          }}
                          className="p-1 rounded text-rose-600 hover:bg-rose-100 hover:text-rose-800 transition"
                          title="حذف السجل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Quick Details Dialog */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-lg w-full p-5 text-xs text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <div>
                <span className="text-slate-400 text-[11px]">تفاصيل بطاقة الغياب رقم:</span>
                <h3 className="text-base font-bold text-[#0c2e60] font-mono">
                  {selectedRecordForDetail.serialNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-100 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">الطالب:</span>
                  <strong className="text-slate-900 text-sm">
                    {selectedRecordForDetail.lastName} {selectedRecordForDetail.firstName}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">رقم التسجيل (Matricule):</span>
                  <strong className="font-mono text-blue-900">
                    {selectedRecordForDetail.studentId}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">عام البكالوريا:</span>
                  <strong className="font-mono">{selectedRecordForDetail.bacYear}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">السنة الجامعية:</span>
                  <strong className="font-mono">{selectedRecordForDetail.academicYear}</strong>
                </div>
              </div>

              <div className="border border-slate-200 p-3 rounded-lg grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">المستوى:</span>
                  <strong>{selectedRecordForDetail.level}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">القسم:</span>
                  <strong className="text-blue-800">{selectedRecordForDetail.department}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">التخصص:</span>
                  <span>{selectedRecordForDetail.specialty}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">الفوج والسداسي:</span>
                  <span>{selectedRecordForDetail.group} ({selectedRecordForDetail.semester})</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">المقياس المعني:</span>
                  <strong className="text-slate-900">{selectedRecordForDetail.subject}</strong> ({selectedRecordForDetail.sessionType})
                </div>
              </div>

              <div className="border border-slate-200 p-3 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block">فترة الغياب:</span>
                    <strong className="font-mono">من {selectedRecordForDetail.absenceDateStart} إلى {selectedRecordForDetail.absenceDateEnd}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">المدة:</span>
                    <strong className="font-mono">{selectedRecordForDetail.durationDays} يوم</strong>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block">طبيعة المبرر:</span>
                  <strong className="text-slate-800">{selectedRecordForDetail.absenceReason}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block">الشهادة الطبية أو شهادة الغياب صادرة عن:</span>
                  <strong className="text-[#0c2e60]">{selectedRecordForDetail.issuedBy}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block">تاريخ الإيداع:</span>
                    <span className="font-mono">{selectedRecordForDetail.submissionDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">احترام أجل 72 ساعة:</span>
                    <span className={selectedRecordForDetail.isWithin72Hours ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                      {selectedRecordForDetail.isWithin72Hours ? 'نعم (محترم)' : 'لا (تجاوز الأجل)'}
                    </span>
                  </div>
                </div>

                {selectedRecordForDetail.notes && (
                  <div className="pt-1 text-slate-600 italic">
                    <span className="text-slate-500 not-italic block">الملاحظات والقرار:</span>
                    {selectedRecordForDetail.notes}
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between items-center bg-slate-50 p-2 rounded">
                <span>الموظف القائم بالإنجاز: <strong>{selectedRecordForDetail.clerkName}</strong></span>
                <span>تاريخ الإدخال: {selectedRecordForDetail.createdAt.slice(0, 10)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
              <button
                onClick={() => {
                  onSelectRecordForPrint(selectedRecordForDetail);
                  setSelectedRecordForDetail(null);
                }}
                className="flex items-center gap-1.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white px-3.5 py-1.5 rounded font-bold transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة وصل استلام رسمي للطالب</span>
              </button>

              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-100 transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
