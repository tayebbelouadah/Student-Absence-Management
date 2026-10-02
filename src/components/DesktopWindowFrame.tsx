import React, { useState, useEffect } from 'react';
import {
  Minus,
  Square,
  X,
  LayoutDashboard,
  FilePlus,
  FileSpreadsheet,
  Users,
  Building2,
  FileText,
  Download,
  Info,
  Clock,
  ShieldCheck,
  Maximize2,
  Database,
  Search,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import { ActiveDesktopTab, StaffMember, AbsenceRecord } from '../types';

interface DesktopWindowFrameProps {
  children: React.ReactNode;
  activeTab: ActiveDesktopTab;
  onTabChange: (tab: ActiveDesktopTab) => void;
  onOpenNewEntry: () => void;
  onOpenAbout: () => void;
  onExportCSV: () => void;
  onBackupJSON: () => void;
  records: AbsenceRecord[];
  activeStaff: StaffMember | undefined;
  onOpenStaffModal: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const DesktopWindowFrame: React.FC<DesktopWindowFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  onOpenNewEntry,
  onOpenAbout,
  onExportCSV,
  onBackupJSON,
  records,
  activeStaff,
  onOpenStaffModal,
  searchTerm,
  onSearchChange,
}) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeMenuDropdown, setActiveMenuDropdown] = useState<string | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ar-DZ', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const dateStr = now.toLocaleDateString('ar-DZ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setCurrentTime(`${dateStr} | ${timeStr}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.desktop-menu-container')) {
        setActiveMenuDropdown(null);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const totalRecords = records.length;
  const approvedRecords = records.filter((r) => r.status === 'مقبول').length;
  const rejectedRecords = records.filter(
    (r) => r.status === 'مرفوض' || r.status === 'تجاوز الأجل القانوني (72ساعة)'
  ).length;
  const pendingRecords = records.filter((r) => r.status === 'قيد الدراسة').length;

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#0b2447] text-slate-800 transition-all duration-150 select-none ${
        isMaximized ? 'p-0 h-screen' : 'p-3 max-w-[1560px] mx-auto h-[96vh]'
      }`}
    >
      {/* Windows Application Window Wrapper */}
      <div
        className={`flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden border border-blue-900/40 shadow-2xl ${
          isMaximized ? 'rounded-none' : 'rounded-lg'
        }`}
        style={{ zoom: `${zoomLevel}%` }}
      >
        {/* ================= Windows Title Bar ================= */}
        <div className="bg-[#0b2447] text-white flex items-center justify-between px-3 py-1.5 border-b border-blue-950 no-print select-none">
          {/* Left / Title info in Arabic */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white shadow-2xs font-bold text-xs">
              <Layers className="w-3.5 h-3.5 text-blue-100" />
            </div>
            <span className="text-xs font-semibold tracking-wide">
              نظام إدارة ومتابعة غيابات الطلبة - كلية الحقوق والعلوم السياسية (جامعة محمد بوضياف بالمسيلة)
            </span>
            <span className="text-[10px] bg-blue-900/90 text-blue-200 px-1.5 py-0.5 rounded border border-blue-700/50">
              الإصدار المكتبي الإداري 2026
            </span>
          </div>

          {/* Right: Windows Native Control Buttons (Minimize, Maximize, Close) */}
          <div className="flex items-center gap-0.5 no-print">
            <button
              onClick={() => alert('تم تصغير التطبيق إلى شريط المهام.')}
              className="p-1.5 hover:bg-blue-800/80 rounded text-slate-300 hover:text-white transition active:scale-95"
              title="تصغير"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 hover:bg-blue-800/80 rounded text-slate-300 hover:text-white transition active:scale-95"
              title={isMaximized ? 'استعادة لأسفل' : 'تكبير'}
            >
              {isMaximized ? <Square className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
            <button
              onClick={() => {
                if (confirm('هل تريد إغلاق تطبيق متابعة الغيابات؟ تم حفظ كافة السجلات تلقائياً.')) {
                  window.location.reload();
                }
              }}
              className="p-1.5 hover:bg-rose-600 rounded text-slate-300 hover:text-white transition active:scale-95"
              title="إغلاق البرنامج"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ================= Windows Menu Bar (ملف / تحرير / عرض / ...) ================= */}
        <div className="bg-[#f0f4f9] border-b border-slate-200 text-xs px-2 py-0.5 flex items-center gap-1 desktop-menu-container no-print select-none">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() =>
                setActiveMenuDropdown(activeMenuDropdown === 'file' ? null : 'file')
              }
              className={`px-2.5 py-1 rounded hover:bg-blue-100 font-medium transition cursor-pointer ${
                activeMenuDropdown === 'file' ? 'bg-blue-100 text-blue-900' : 'text-slate-700'
              }`}
            >
              ملف
            </button>
            {activeMenuDropdown === 'file' && (
              <div className="absolute right-0 top-full mt-0.5 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    onOpenNewEntry();
                    setActiveMenuDropdown(null);
                  }}
                  className="w-full text-right px-4 py-1.5 hover:bg-blue-50 text-slate-700 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FilePlus className="w-3.5 h-3.5 text-blue-600" />
                    <span>إدخال غياب طالب جديد...</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+N</span>
                </button>
                <button
                  onClick={() => {
                    onExportCSV();
                    setActiveMenuDropdown(null);
                  }}
                  className="w-full text-right px-4 py-1.5 hover:bg-blue-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تصدير إلى جدول Excel (CSV)</span>
                </button>
                <button
                  onClick={() => {
                    onBackupJSON();
                    setActiveMenuDropdown(null);
                  }}
                  className="w-full text-right px-4 py-1.5 hover:bg-blue-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-indigo-600" />
                  <span>أخذ نسخة احتياطية من قاعدة البيانات</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    window.print();
                    setActiveMenuDropdown(null);
                  }}
                  className="w-full text-right px-4 py-1.5 hover:bg-blue-50 text-slate-700 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>طباعة التقرير الحالي</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+P</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() =>
                setActiveMenuDropdown(activeMenuDropdown === 'edit' ? null : 'edit')
              }
              className={`px-2.5 py-1 rounded hover:bg-blue-100 font-medium transition cursor-pointer ${
                activeMenuDropdown === 'edit' ? 'bg-blue-100 text-blue-900' : 'text-slate-700'
              }`}
            >
              تحرير
            </button>
            {activeMenuDropdown === 'edit' && (
              <div className="absolute right-0 top-full mt-0.5 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    onTabChange('records');
                    setActiveMenuDropdown(null);
                  }}
                  className="w-full text-right px-4 py-1.5 hover:bg-blue-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  <span>بحث وتصفية السجلات</span>
                </button>
                <button
                  onClick={() => {
                    onOpenStaffModal();
                    setActiveMenuDropdown(null);
                  }}
                  className="w-full text-right px-4 py-1.5 hover:bg-blue-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>تبديل الموظف المكلف</span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() =>
                setActiveMenuDropdown(activeMenuDropdown === 'view' ? null : 'view')
              }
              className={`px-2.5 py-1 rounded hover:bg-blue-100 font-medium transition cursor-pointer ${
                activeMenuDropdown === 'view' ? 'bg-blue-100 text-blue-900' : 'text-slate-700'
              }`}
            >
              عرض
            </button>
            {activeMenuDropdown === 'view' && (
              <div className="absolute right-0 top-full mt-0.5 w-52 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    onTabChange('dashboard');
                    setActiveMenuDropdown(null);
                  }}
                  className="w-full text-right px-4 py-1.5 hover:bg-blue-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
                  <span>لوحة القيادة الرئيسية</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('records');
                    setActiveMenuDropdown(null);
                  }}
                  className="w-full text-right px-4 py-1.5 hover:bg-blue-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>سجل الغيابات العام</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('staff');
                    setActiveMenuDropdown(null);
                  }}
                  className="w-full text-right px-4 py-1.5 hover:bg-blue-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>لوحة الموظفين</span>
                </button>
              </div>
            )}
          </div>

          {/* Authorities Directory */}
          <button
            onClick={() => onTabChange('authorities')}
            className={`px-2.5 py-1 rounded hover:bg-blue-100 font-medium transition cursor-pointer ${
              activeTab === 'authorities' ? 'bg-blue-100 text-blue-900' : 'text-slate-700'
            }`}
          >
            دليل الجهات المصدرة للشهادات
          </button>

          {/* Help Menu */}
          <button
            onClick={onOpenAbout}
            className="px-2.5 py-1 rounded hover:bg-blue-100 font-medium text-slate-700 transition cursor-pointer flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>حول التطبيق ومصممه</span>
          </button>
        </div>

        {/* ================= Windows Desktop Ribbon / Quick Action Toolbar ================= */}
        <div className="bg-gradient-to-b from-[#ffffff] to-[#f4f7fb] border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-3 shadow-2xs no-print select-none">
          {/* Quick Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {/* Primary Action Button: New Student Absence */}
            <button
              onClick={onOpenNewEntry}
              className="flex items-center gap-2 bg-[#1e40af] hover:bg-[#1d4ed8] text-white px-3.5 py-2 rounded-lg font-bold text-xs shadow-sm transition-all duration-150 active:scale-95 cursor-pointer hover:shadow"
            >
              <FilePlus className="w-4 h-4 text-blue-200" />
              <span>إدخال غياب طالب (F2)</span>
            </button>

            <div className="h-6 w-px bg-slate-300 mx-1" />

            {/* Dashboard Button */}
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-95 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-100/90 text-[#0c2e60] shadow-xs border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>لوحة القيادة الرئيسية</span>
            </button>

            {/* Records Archive Button */}
            <button
              onClick={() => onTabChange('records')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-95 ${
                activeTab === 'records'
                  ? 'bg-blue-100/90 text-[#0c2e60] shadow-xs border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>سجل وأرشيف الغيابات ({records.length})</span>
            </button>

            {/* Staff Panel Button */}
            <button
              onClick={() => onTabChange('staff')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-95 ${
                activeTab === 'staff'
                  ? 'bg-blue-100/90 text-[#0c2e60] shadow-xs border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>لوحة الموظفين</span>
            </button>

            {/* Issuing Authorities */}
            <button
              onClick={() => onTabChange('authorities')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-95 ${
                activeTab === 'authorities'
                  ? 'bg-blue-100/90 text-[#0c2e60] shadow-xs border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>الجهات المصدرة للشهادات</span>
            </button>
          </div>

          {/* Quick Search & Export Tools */}
          <div className="flex items-center gap-2">
            {/* Quick Live Search Bar */}
            <div className="relative w-56">
              <input
                type="text"
                placeholder="بحث برقم التسجيل، اللقب، الاسم..."
                value={searchTerm}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeTab !== 'records' && e.target.value) {
                    onTabChange('records');
                  }
                }}
                className="w-full bg-white border border-slate-300 rounded-lg pr-8 pl-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>

            {/* Export CSV Button */}
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 shadow-2xs cursor-pointer"
              title="تصدير السجلات إلى Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تصدير Excel</span>
            </button>

            {/* Print Official Summary */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 shadow-2xs cursor-pointer"
              title="طباعة التقرير"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">طباعة</span>
            </button>
          </div>
        </div>

        {/* ================= Main Scrollable Canvas ================= */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 lg:p-6">
          {children}
        </div>

        {/* ================= Windows Bottom Status Bar ================= */}
        <footer className="bg-[#e9edf4] border-t border-slate-300 text-slate-700 px-4 py-1 text-xs flex flex-wrap items-center justify-between gap-3 select-none no-print">
          {/* Right side in RTL: Quick Stats and Active User */}
          <div className="flex items-center gap-4 text-[11.5px]">
            <div className="flex items-center gap-1 text-slate-800">
              <Database className="w-3.5 h-3.5 text-blue-700" />
              <span>إجمالي ملفات الغياب: <strong className="font-mono text-blue-900">{totalRecords}</strong></span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-medium">مقبول: <strong className="font-mono">{approvedRecords}</strong></span>
              <span>·</span>
              <span className="text-amber-700 font-medium">قيد الدراسة: <strong className="font-mono">{pendingRecords}</strong></span>
              <span>·</span>
              <span className="text-rose-700 font-medium">مرفوض/تجاوز 72س: <strong className="font-mono">{rejectedRecords}</strong></span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>الموظف المكلف: <span className="font-semibold text-slate-900">{activeStaff?.fullName || 'غير محدد'}</span></span>
            </div>
          </div>

          {/* Left side in RTL: Date, Time & Zoom */}
          <div className="flex items-center gap-4 text-[11.5px]">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono">{currentTime}</span>
            </div>

            <span className="text-slate-300">|</span>

            {/* Desktop Zoom Controller */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(80, prev - 5))}
                className="w-5 h-5 rounded hover:bg-slate-300 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                title="تصغير العرض"
              >
                -
              </button>
              <span className="font-mono text-[11px] text-slate-700 px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(125, prev + 5))}
                className="w-5 h-5 rounded hover:bg-slate-300 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                title="تكبير العرض"
              >
                +
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
