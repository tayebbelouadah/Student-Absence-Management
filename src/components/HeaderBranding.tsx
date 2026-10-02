import React, { useRef, useState } from 'react';
import { UniversityConfig, StaffMember } from '../types';
import { Camera, RefreshCw, Award, Building, UserCheck } from 'lucide-react';

interface HeaderBrandingProps {
  config: UniversityConfig;
  onUpdateConfig: (config: UniversityConfig) => void;
  activeStaff: StaffMember | undefined;
  onOpenStaffModal: () => void;
}

export const HeaderBranding: React.FC<HeaderBrandingProps> = ({
  config,
  onUpdateConfig,
  activeStaff,
  onOpenStaffModal,
}) => {
  const [showLogoModal, setShowLogoModal] = useState(false);
  const univFileInputRef = useRef<HTMLInputElement>(null);
  const facultyFileInputRef = useRef<HTMLInputElement>(null);

  const handleUniversityLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateConfig({
          ...config,
          universityLogoUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFacultyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateConfig({
          ...config,
          facultyLogoUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogos = () => {
    onUpdateConfig({
      ...config,
      universityLogoUrl: '/src/assets/images/university_seal_1790968905594.jpg',
      facultyLogoUrl: '/src/assets/images/faculty_law_seal_1790968918888.jpg',
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm relative no-print select-none">
      {/* Top Ministerial Bar */}
      <div className="bg-[#0b2447] text-white py-1 px-4 text-xs flex justify-between items-center border-b border-blue-900/60 font-sans tracking-wide">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-blue-200">الجمهورية الجزائرية الديمقراطية الشعبية</span>
          <span className="text-blue-400">·</span>
          <span className="text-slate-200">وزارة التعليم العالي والبحث العلمي</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-blue-200">السنة الجامعية: <strong className="text-white font-mono">{config.academicYear}</strong></span>
          <span className="text-blue-400">·</span>
          <button
            onClick={onOpenStaffModal}
            className="flex items-center gap-1.5 bg-blue-800/80 hover:bg-blue-700 text-blue-100 hover:text-white px-2 py-0.5 rounded transition cursor-pointer active:scale-95"
            title="انقر لتغيير الموظف المسجل حالياً"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>الموظف النشط: <strong className="text-white underline">{activeStaff?.fullName || 'غير محدد'}</strong></span>
          </button>
        </div>
      </div>

      {/* Main Official Header Canvas */}
      <div className="px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Right side: University Seal & Name */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer" onClick={() => setShowLogoModal(true)} title="تغيير أو تخصيص شعار الجامعة">
            <img
              src={config.universityLogoUrl}
              alt="شعار جامعة المسيلة"
              referrerPolicy="no-referrer"
              className="w-16 h-16 object-contain rounded-full border-2 border-blue-900/20 bg-slate-50 p-0.5 shadow-sm group-hover:ring-2 group-hover:ring-blue-500 transition-all duration-150"
            />
            <div className="absolute inset-0 bg-blue-900/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px]">
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#0c2e60] tracking-tight">
              {config.universityName}
            </h1>
            <h2 className="text-base font-semibold text-[#1e40af] flex items-center gap-1.5">
              <span>{config.facultyName}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {config.serviceName}
            </p>
          </div>
        </div>

        {/* Center: System Title & Attribution to Prof. Belouadah Tayeb */}
        <div className="text-center px-4 py-1.5 bg-gradient-to-b from-blue-50/70 to-slate-50 border border-blue-100/80 rounded-xl shadow-xs max-w-xl">
          <div className="inline-block px-2.5 py-0.5 bg-[#1e40af] text-white text-[11px] font-bold rounded-md tracking-wider mb-1">
            نظام إدارة ومتابعة غيابات الطلبة
          </div>
          <div className="text-[12px] font-semibold text-slate-700 tracking-tight">
            Student Absence Management & Tracking System
          </div>
          {/* Creator Attribution with high distinction */}
          <div className="mt-1 flex items-center justify-center gap-1 text-[11.5px] font-bold text-[#0c2e60] bg-white/90 py-0.5 px-3 rounded-md border border-blue-200/60 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{config.designerTitle}</span>
          </div>
        </div>

        {/* Left side: Faculty of Law Seal & Quick Controls */}
        <div className="flex items-center gap-3.5">
          <div className="text-left hidden lg:block">
            <div className="text-xs font-semibold text-slate-700">مصلحة متابعة الغيابات</div>
            <div className="text-[11px] text-slate-500">الأرشفة والتوثيق الإلكتروني</div>
            <button
              onClick={() => setShowLogoModal(true)}
              className="text-[11px] text-blue-600 hover:text-blue-800 underline mt-0.5 inline-block cursor-pointer active:scale-95"
            >
              تخصيص الشعارات
            </button>
          </div>

          <div className="relative group cursor-pointer" onClick={() => setShowLogoModal(true)} title="تغيير أو تخصيص شعار كلية الحقوق والعلوم السياسية">
            <img
              src={config.facultyLogoUrl}
              alt="شعار كلية الحقوق والعلوم السياسية"
              referrerPolicy="no-referrer"
              className="w-16 h-16 object-contain rounded-full border-2 border-blue-900/20 bg-slate-50 p-0.5 shadow-sm group-hover:ring-2 group-hover:ring-blue-500 transition-all duration-150"
            />
            <div className="absolute inset-0 bg-blue-900/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px]">
              <Camera className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Customizing University & Faculty Logos */}
      {showLogoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-300 p-6 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-[#0c2e60] flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>إدارة وتخصيص شعار الجامعة وشعار الكلية</span>
              </h3>
              <button
                onClick={() => setShowLogoModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              يمكنك رفع شعارات مخصصة من جهاز الكمبيوتر لجامعة محمد بوضياف بالمسيلة ولكلية الحقوق والعلوم السياسية، أو إعادة تعيينها إلى الشعارات الرسمية الافتراضية.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* University Logo Box */}
              <div className="border border-slate-200 rounded-lg p-3 text-center bg-slate-50 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-700 mb-2">شعار الجامعة</span>
                <img
                  src={config.universityLogoUrl}
                  alt="جامعة المسيلة"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-contain rounded-full bg-white border border-slate-300 p-1 mb-3"
                />
                <input
                  type="file"
                  ref={univFileInputRef}
                  onChange={handleUniversityLogoChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => univFileInputRef.current?.click()}
                  className="w-full text-xs font-medium py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition active:scale-95 cursor-pointer"
                >
                  رفع شعار الجامعة
                </button>
              </div>

              {/* Faculty Logo Box */}
              <div className="border border-slate-200 rounded-lg p-3 text-center bg-slate-50 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-700 mb-2">شعار كلية الحقوق</span>
                <img
                  src={config.facultyLogoUrl}
                  alt="كلية الحقوق والعلوم السياسية"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-contain rounded-full bg-white border border-slate-300 p-1 mb-3"
                />
                <input
                  type="file"
                  ref={facultyFileInputRef}
                  onChange={handleFacultyLogoChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => facultyFileInputRef.current?.click()}
                  className="w-full text-xs font-medium py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition active:scale-95 cursor-pointer"
                >
                  رفع شعار الكلية
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <button
                onClick={handleResetLogos}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded transition cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>استعادة الشعارات الافتراضية</span>
              </button>

              <button
                onClick={() => setShowLogoModal(false)}
                className="text-xs font-semibold px-4 py-1.5 bg-[#0c2e60] text-white hover:bg-[#1a3e75] rounded transition cursor-pointer active:scale-95"
              >
                حفظ وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
