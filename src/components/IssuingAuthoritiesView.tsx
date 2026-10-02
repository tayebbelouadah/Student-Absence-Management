import React, { useState } from 'react';
import { Building2, Plus, Trash2, Check, ShieldCheck, MapPin } from 'lucide-react';
import { AbsenceRecord } from '../types';

interface IssuingAuthoritiesViewProps {
  authorities: string[];
  onUpdateAuthorities: (list: string[]) => void;
  records: AbsenceRecord[];
}

export const IssuingAuthoritiesView: React.FC<IssuingAuthoritiesViewProps> = ({
  authorities,
  onUpdateAuthorities,
  records,
}) => {
  const [newAuthority, setNewAuthority] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthority.trim()) return;
    if (authorities.includes(newAuthority.trim())) {
      alert('هذه الجهة مسجلة مسبقاً في الدليل.');
      return;
    }
    onUpdateAuthorities([...authorities, newAuthority.trim()]);
    setNewAuthority('');
    setShowAddForm(false);
  };

  const handleDelete = (name: string) => {
    if (confirm(`هل أنت متأكد من إزالة "${name}" من قائمة الجهات المصدرة المعتمدة؟`)) {
      onUpdateAuthorities(authorities.filter((a) => a !== name));
    }
  };

  const getRecordCountByAuthority = (name: string) => {
    return records.filter((r) => r.issuedBy === name).length;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <Building2 className="w-4 h-4" />
            <span>دليل الهياكل والجهات الطبية والإدارية المصدرة للتبريرات</span>
          </div>
          <h2 className="text-xl font-bold text-[#0c2e60]">
            دليل الجهات المصدرة للشهادات الطبية وشواهد الغياب
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            قائمة الهياكل الصحية العمومية والجامعية والخاصة المعتمدة لدى كلية الحقوق والعلوم السياسية بجامعة المسيلة لإصدار شهادات التبرير المقبولة.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#1e40af] hover:bg-[#1d4ed8] text-white px-4 py-2.5 rounded-lg font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-blue-200" />
          <span>إضافة جهة أو هيكل صحي جديد</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            required
            value={newAuthority}
            onChange={(e) => setNewAuthority(e.target.value)}
            placeholder="اكتب اسم الهيكل الصحي أو الجهة الرسمية (مثال: مستشفى مقرة، عيادة خاصة...)"
            className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="bg-[#1e40af] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded font-bold text-xs shadow-xs"
            >
              حفظ الإضافة
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 text-xs"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Grid of Authorities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {authorities.map((auth, index) => {
          const count = getRecordCountByAuthority(auth);
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{auth}</h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>هيكل معتمد رسمياً</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(auth)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                  title="حذف من القائمة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span>شهادات واردة مسجلة بالنظام:</span>
                <strong className="font-mono text-blue-900 font-bold bg-slate-100 px-2 py-0.5 rounded">
                  {count} شهادة
                </strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
