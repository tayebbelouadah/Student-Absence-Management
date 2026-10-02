import React, { useState } from 'react';
import { StaffMember, DepartmentType, AbsenceRecord } from '../types';
import {
  Users,
  UserCheck,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  Briefcase,
  Phone,
  Mail,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface StaffManagementViewProps {
  staffList: StaffMember[];
  onUpdateStaffList: (list: StaffMember[]) => void;
  records: AbsenceRecord[];
}

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({
  staffList,
  onUpdateStaffList,
  records,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('متصرف إداري - متابعة الغيابات');
  const [service, setService] = useState('مصلحة التدريس والتعليم والشهادات');
  const [department, setDepartment] = useState<DepartmentType | 'إدارة الكلية المشتركة'>('قسم الحقوق');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSetActive = (id: string) => {
    const updated = staffList.map((s) => ({
      ...s,
      isActive: s.id === id,
    }));
    onUpdateStaffList(updated);
  };

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFullName('');
    setJobTitle('متصرف إداري - متابعة الغيابات');
    setService('مصلحة التدريس ومتابعة الغيابات');
    setDepartment('قسم الحقوق');
    setPhoneNumber('');
    setEmail('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFullName(staff.fullName);
    setJobTitle(staff.jobTitle);
    setService(staff.service);
    setDepartment(staff.department);
    setPhoneNumber(staff.phoneNumber || '');
    setEmail(staff.email || '');
    setShowAddModal(true);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (staffList.length <= 1) {
      alert('يجب الإبقاء على موظف واحد على الأقل في النظام.');
      return;
    }
    if (confirm(`هل أنت متأكد من حذف حساب الموظف "${name}"؟`)) {
      const filtered = staffList.filter((s) => s.id !== id);
      // Ensure one is active
      if (!filtered.some((s) => s.isActive)) {
        filtered[0].isActive = true;
      }
      onUpdateStaffList(filtered);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (editingStaff) {
      const updated = staffList.map((s) =>
        s.id === editingStaff.id
          ? {
              ...s,
              fullName: fullName.trim(),
              jobTitle: jobTitle.trim(),
              service: service.trim(),
              department,
              phoneNumber: phoneNumber.trim(),
              email: email.trim(),
            }
          : s
      );
      onUpdateStaffList(updated);
    } else {
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        fullName: fullName.trim(),
        jobTitle: jobTitle.trim(),
        service: service.trim(),
        department,
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        isActive: false,
        totalEntriesCount: 0,
        joinedDate: new Date().toISOString().slice(0, 10),
      };
      onUpdateStaffList([...staffList, newStaff]);
    }

    setShowAddModal(false);
  };

  // Calculate actual entries count dynamically per staff member
  const getDynamicEntriesCount = (staffName: string) => {
    return records.filter((r) => r.clerkName === staffName).length;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <Users className="w-4 h-4" />
            <span>لوحة إدارة طاقم موظفي مصلحة التدريس والغيابات</span>
          </div>
          <h2 className="text-xl font-bold text-[#0c2e60]">
            طاقم مصلحة متابعة وأرشفة غيابات الطلبة
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            تتيح هذه اللوحة تحديد الموظف النشط المسؤول عن استقبال وتبرير غيابات الطلبة وإصدار وصولات الاستلام الرسمية، مع تتبع إحصائيات الإنجاز لكل موظف.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-[#1e40af] hover:bg-[#1d4ed8] text-white px-4 py-2.5 rounded-lg font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-blue-200" />
          <span>إضافة موظف جديد للطاقم</span>
        </button>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {staffList.map((staff) => {
          const processedCount = getDynamicEntriesCount(staff.fullName) || staff.totalEntriesCount;

          return (
            <div
              key={staff.id}
              className={`bg-white rounded-xl border p-5 transition-all shadow-2xs relative ${
                staff.isActive
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Active Badge */}
              {staff.isActive && (
                <div className="absolute top-4 left-4 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>الموظف النشط حالياً</span>
                </div>
              )}

              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                    staff.isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {staff.fullName.slice(0, 1)}
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{staff.fullName}</span>
                  </h3>
                  <div className="text-xs text-blue-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{staff.jobTitle}</span>
                  </div>
                  <div className="text-[11.5px] text-slate-500 mt-1">
                    {staff.service} · <span className="font-semibold text-slate-700">{staff.department}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                    {staff.phoneNumber && (
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{staff.phoneNumber}</span>
                      </span>
                    )}
                    {staff.email && (
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{staff.email}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-slate-700">
                      <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                      <span>الملفات المنجزة: <strong className="font-mono text-blue-900">{processedCount}</strong></span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <div>
                      {!staff.isActive ? (
                        <button
                          onClick={() => handleSetActive(staff.id)}
                          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>تعيين كموظف نشط للوردية</span>
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-semibold">
                          مسجل حالياً على كافة العمليات والوصولات
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(staff)}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded transition"
                        title="تعديل بيانات الموظف"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id, staff.fullName)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition"
                        title="حذف الموظف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-md w-full p-5 text-xs text-slate-800">
            <h3 className="text-sm font-bold text-[#0c2e60] mb-4 pb-2 border-b border-slate-200">
              {editingStaff ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد لمصلحة التدريس'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  الاسم الكامل واللقب <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: سعيداني عبد الحميد"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  الرتبة / الوظيفة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="مثال: متصرف رئيسي - رئيس مصلحة التدريس"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">المصلحة</label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">القسم / التبعية الإدارية</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="قسم الحقوق">قسم الحقوق</option>
                  <option value="قسم العلوم السياسية">قسم العلوم السياسية</option>
                  <option value="إدارة الكلية المشتركة">إدارة الكلية المشتركة</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">رقم الهاتف المهني</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0661..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@univ-msila.dz"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white rounded font-bold shadow-xs"
                >
                  {editingStaff ? 'تحديث البيانات' : 'إضافة الموظف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
