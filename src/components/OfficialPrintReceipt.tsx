import React from 'react';
import { AbsenceRecord, UniversityConfig, StaffMember } from '../types';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface OfficialPrintReceiptProps {
  record: AbsenceRecord | null;
  config: UniversityConfig;
  activeStaff: StaffMember | undefined;
  onClose: () => void;
}

export const OfficialPrintReceipt: React.FC<OfficialPrintReceiptProps> = ({
  record,
  config,
  activeStaff,
  onClose,
}) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = new Date().toLocaleDateString('ar-DZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 lg:p-6 overflow-y-auto">
      {/* Floating Action Controls (Hidden during print) */}
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden my-auto">
        <div className="bg-[#0b2447] text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-300" />
            <span className="font-bold text-xs">معاينة وصل استلام تبرير غياب رسمي للطباعة</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>إرسال إلى الطابعة (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-rose-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable A4 University Sheet */}
        <div className="p-8 bg-white text-slate-900 font-sans print-shadow-none" id="printable-university-sheet">
          {/* Ministerial Header */}
          <div className="text-center border-b-2 border-blue-950 pb-4 mb-5">
            <h4 className="text-sm font-bold text-slate-800">
              الجمهورية الجزائرية الديمقراطية الشعبية
            </h4>
            <h5 className="text-xs font-semibold text-slate-600 mt-0.5">
              وزارة التعليم العالي والبحث العلمي
            </h5>

            <div className="flex items-center justify-between mt-3 px-2">
              {/* University Emblem */}
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src={config.universityLogoUrl}
                  alt="جامعة المسيلة"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Central Title */}
              <div className="text-center">
                <h2 className="text-base font-extrabold text-[#0c2e60]">
                  {config.universityName}
                </h2>
                <h3 className="text-sm font-bold text-blue-900 mt-0.5">
                  {config.facultyName}
                </h3>
                <p className="text-[11px] text-slate-600 mt-1">
                  {config.viceDeanship}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  السنة الجامعية: {record.academicYear}
                </p>
              </div>

              {/* Faculty of Law Emblem */}
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src={config.facultyLogoUrl}
                  alt="كلية الحقوق"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Document Title Badge */}
          <div className="text-center mb-6">
            <div className="inline-block border-2 border-blue-900 bg-blue-50/50 px-6 py-2 rounded-md">
              <h1 className="text-base font-extrabold text-[#0c2e60]">
                وصل استلام وإيداع تبرير غياب طالب
              </h1>
              <p className="text-[11px] font-mono font-bold text-blue-950 mt-0.5">
                الرقم التسلسلي الإداري: {record.serialNumber}
              </p>
            </div>
          </div>

          {/* Student Identity Information Box */}
          <div className="border border-slate-300 rounded-md p-4 mb-4 bg-slate-50/30 text-xs">
            <h4 className="font-bold text-[#0c2e60] mb-2.5 pb-1 border-b border-slate-200">
              1. هوية الطالب وبيانات التسجيل البيداغوجي:
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <span className="text-slate-600">اللقب والاسم:</span>{' '}
                <strong className="text-sm text-slate-950">{record.lastName} {record.firstName}</strong>
              </div>
              <div>
                <span className="text-slate-600">رقم التسجيل (Matricule):</span>{' '}
                <strong className="font-mono text-blue-900 font-bold">{record.studentId}</strong>
              </div>
              <div>
                <span className="text-slate-600">عام البكالوريا:</span>{' '}
                <strong className="font-mono">{record.bacYear}</strong>
              </div>
              <div>
                <span className="text-slate-600">الطور والمستوى:</span>{' '}
                <strong className="text-slate-900">{record.level}</strong>
              </div>
              <div>
                <span className="text-slate-600">القسم:</span>{' '}
                <strong className="text-blue-900">{record.department}</strong>
              </div>
              <div>
                <span className="text-slate-600">التخصص:</span>{' '}
                <span>{record.specialty}</span>
              </div>
              <div>
                <span className="text-slate-600">الفوج / المجموعة:</span>{' '}
                <strong className="font-mono">{record.group}</strong> ({record.semester})
              </div>
              <div>
                <span className="text-slate-600">المقياس المعني بالغياب:</span>{' '}
                <strong className="text-slate-900">{record.subject}</strong> ({record.sessionType})
              </div>
            </div>
          </div>

          {/* Absence Details & Justification Box */}
          <div className="border border-slate-300 rounded-md p-4 mb-4 bg-slate-50/30 text-xs">
            <h4 className="font-bold text-[#0c2e60] mb-2.5 pb-1 border-b border-slate-200">
              2. بيانات الغياب وتفاصيل الشهادة المودعة:
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <span className="text-slate-600">تاريخ بداية الغياب:</span>{' '}
                <strong className="font-mono">{record.absenceDateStart}</strong>
              </div>
              <div>
                <span className="text-slate-600">تاريخ نهاية الغياب:</span>{' '}
                <strong className="font-mono">{record.absenceDateEnd}</strong>
              </div>
              <div>
                <span className="text-slate-600">المدة الإجمالية:</span>{' '}
                <strong className="font-mono">{record.durationDays} يوم / أيام</strong>
              </div>
              <div>
                <span className="text-slate-600">طبيعة ومبرر الغياب:</span>{' '}
                <strong className="text-slate-900">{record.absenceReason}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-600">الشهادة الطبية أو شهادة الغياب صادرة عن:</span>{' '}
                <strong className="text-[#0c2e60] text-sm">{record.issuedBy}</strong>
              </div>
            </div>
          </div>

          {/* Administrative Decision & 72 Hours Delay Compliance */}
          <div className="border border-slate-300 rounded-md p-4 mb-6 bg-slate-50/30 text-xs">
            <h4 className="font-bold text-[#0c2e60] mb-2.5 pb-1 border-b border-slate-200">
              3. الإيداع والقرار الإداري (احترام أجل 72 ساعة وفق القرار الوزاري 711):
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <span className="text-slate-600">تاريخ إيداع التبرير بالمصلحة:</span>{' '}
                <strong className="font-mono">{record.submissionDate}</strong>
              </div>
              <div>
                <span className="text-slate-600">احترام مهلة 72 ساعة القانونية:</span>{' '}
                <strong className={record.isWithin72Hours ? 'text-emerald-800' : 'text-rose-800'}>
                  {record.isWithin72Hours ? 'نعم - أودع في الآجال النظامية' : 'لا - تجاوز مهلة 72 ساعة'}
                </strong>
              </div>
              <div>
                <span className="text-slate-600">حالة قرار مصلحة التدريس:</span>{' '}
                <strong className="text-blue-900 font-bold">{record.status}</strong>
              </div>
              <div>
                <span className="text-slate-600">الموظف المستقبل والمحرر:</span>{' '}
                <strong className="text-slate-900">{record.clerkName}</strong>
              </div>
              {record.notes && (
                <div className="col-span-2 pt-1 border-t border-slate-200 text-slate-700">
                  <span className="text-slate-500">ملاحظات وقرار اللجنة:</span> {record.notes}
                </div>
              )}
            </div>
          </div>

          {/* Official Signatures & University Stamp Box */}
          <div className="grid grid-cols-3 gap-4 text-xs pt-4 border-t border-slate-300 text-center">
            {/* Student Signature */}
            <div className="border border-slate-300 rounded p-3 h-28 flex flex-col justify-between">
              <span className="font-bold text-slate-700">توقيع الطالب المعني:</span>
              <div className="text-[10px] text-slate-400">بصمة أو إمضاء الطالب</div>
            </div>

            {/* Clerk Signature */}
            <div className="border border-slate-300 rounded p-3 h-28 flex flex-col justify-between">
              <span className="font-bold text-slate-700">الموظف المكلف بالاستلام:</span>
              <div className="font-semibold text-slate-800 text-[11px]">{record.clerkName}</div>
              <div className="text-[10px] text-slate-400">التوقيع والتاريخ: {record.submissionDate}</div>
            </div>

            {/* Faculty & Service Stamp */}
            <div className="border-2 border-dashed border-blue-900 rounded p-3 h-28 flex flex-col justify-between bg-blue-50/20">
              <span className="font-bold text-blue-950">خاتم مصلحة التدريس والغيابات:</span>
              <div className="text-[10px] text-blue-900 font-serif">كلية الحقوق والعلوم السياسية</div>
              <div className="text-[10px] text-slate-400">تأشيرة الإدارة</div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
            <span>تاريخ إصدار هذا الوصل: {currentDateFormatted}</span>
            <span className="font-bold text-slate-700">{config.designerTitle}</span>
            <span>وثيقة إدارية صادرة عن نظام متابعة غيابات الطلبة بالمسيلة</span>
          </div>
        </div>
      </div>
    </div>
  );
};
