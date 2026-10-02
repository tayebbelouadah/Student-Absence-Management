import React from 'react';
import { Award, Building, BookOpen, Layers, ShieldCheck, Mail, X, Check } from 'lucide-react';
import { UniversityConfig } from '../types';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: UniversityConfig;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border border-blue-900/40 max-w-xl w-full overflow-hidden text-slate-800 text-xs">
        {/* Header */}
        <div className="bg-[#0b2447] text-white px-5 py-3.5 flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4 text-blue-100" />
            </div>
            <div>
              <h3 className="font-bold text-sm">حول المنظومة الإدارية لمتابعة الغيابات</h3>
              <p className="text-[11px] text-blue-200">الإصدار المكتبي الإداري المخصص لموظفي الكلية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-rose-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Creator Attribution Spotlight */}
          <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mb-2 shadow-xs">
              <Award className="w-6 h-6 text-[#1e40af]" />
            </div>
            <div className="text-[13px] font-extrabold text-[#0c2e60]">
              {config.designerTitle}
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              أستاذ دكتور - المشرف على رقمنة وتطوير المنظومة الإدارية والبيداغوجية
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-blue-700 font-mono mt-2">
              <Mail className="w-3.5 h-3.5" />
              <span>tbelouadah@gmail.com</span>
            </div>
          </div>

          {/* Academic Affiliation */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#0c2e60]">
              <Building className="w-4 h-4 text-blue-600" />
              <span>الهيئة الجامعية الحاضنة:</span>
            </div>
            <p className="text-slate-700 font-semibold pr-6">
              {config.universityName} · {config.facultyName}
            </p>
            <p className="text-slate-500 pr-6 text-[11px]">
              {config.serviceName}
            </p>
          </div>

          {/* Legal Grounds / Ministerial Decree */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#0c2e60]">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>السند القانوني والتنظيمي (النظام البيداغوجي LMD):</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11.5px] pr-6">
              يعتمد التطبيق على أحكام <strong>القرار الوزاري رقم 711 المؤرخ في 03 نوفمبر 2011</strong> المحدد للقواعد المشتركة للتنظيم والتسيير البيداغوجي للدراسات الجامعية:
            </p>
            <ul className="pr-10 space-y-1 text-slate-600 list-disc text-[11px]">
              <li>وجوب إيداع تبرير الغياب لدى مصلحة التدريس خلال مدة أقصاها <strong>72 ساعة (3 أيام)</strong> من تاريخ الغياب.</li>
              <li>حصر الغيابات غير المبررة (3 غيابات تؤدي إلى الإقصاء من المقياس في السداسي).</li>
              <li>توثيق وأرشفة الشواهد الطبية والوثائق الرسمية ببيانات الجهة المصدرة والرقم التسلسلي السنوي الموحد.</li>
            </ul>
          </div>

          {/* System Capabilities & Shortcuts */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#0c2e60]">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>خصائص التطبيق المكتبي:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pr-6 text-slate-700">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>دعم اللغة العربية بالكامل واتجاه RTL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>توليد تلقائي للرقم التسلسلي للإنجاز</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>طباعة وصولات استلام رسمية للطالب</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>تصدير فوري إلى جداول Excel (CSV)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>لوحة خاصة بإدارة الموظفين والورديات</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>تخزين وأرشفة محلية آمنة دون انقطاع</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 flex items-center justify-between border-t border-slate-200">
          <span className="text-[11px] text-slate-500 font-mono">الإصدار 1.0.0 (Desktop Edition 2026)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0c2e60] hover:bg-[#1a3e75] text-white rounded font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
