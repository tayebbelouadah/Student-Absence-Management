export type StudentLevel = 
  | 'ليسانس سنة أولى (L1)'
  | 'ليسانس سنة ثانية (L2)'
  | 'ليسانس سنة ثالثة (L3)'
  | 'ماستر سنة أولى (M1)'
  | 'ماستر سنة ثانية (M2)'
  | 'دكتوراه الطور الثالث';

export type DepartmentType = 'قسم الحقوق' | 'قسم العلوم السياسية';

export type AbsenceStatus = 'مقبول' | 'مرفوض' | 'قيد الدراسة' | 'تجاوز الأجل القانوني (72ساعة)';

export type AbsenceReasonType = 
  | 'شهادة طبية (مرض)'
  | 'شهادة وفاة أصلية (وفاة قريب)'
  | 'استدعاء رسمي / قضائي'
  | 'مشاركة في تظاهرة علمية أو رياضية رسمية'
  | 'عطلة أمومة / حالة ولادة'
  | 'حادث طارئ / قوة قاهرة'
  | 'مبرر آخر';

export interface AbsenceRecord {
  id: string;
  serialNumber: string; // الرقم التسلسلي لإنجاز وإدخال بيانات الطالب (e.g. 2026/0001)
  lastName: string; // اللقب
  firstName: string; // الاسم
  studentId: string; // رقم التسجيل (Matricule)
  bacYear: number; // عام البكالوريا
  level: StudentLevel; // المستوى
  department: DepartmentType; // القسم
  specialty: string; // التخصص (قانون عام، قانون خاص، تنظيمات سياسية...)
  academicYear: string; // السنة الدراسية (مثال: 2025/2026)
  semester: string; // السداسي (S1, S2, S3, S4, S5, S6)
  group: string; // الفوج / المجموعة
  subject: string; // المقياس / المادة
  sessionType: 'محاضرة' | 'أعمال موجهة (TD)' | 'أعمال تطبيقية (TP)'; // نوع الحصة
  absenceDateStart: string; // تاريخ بداية الغياب (YYYY-MM-DD)
  absenceDateEnd: string; // تاريخ نهاية الغياب (YYYY-MM-DD)
  durationDays: number; // مدة الغياب (أيام)
  absenceReason: AbsenceReasonType; // طبيعة المبرر
  issuedBy: string; // الشهادة الطبية أو شهادة الغياب صادرة عن
  submissionDate: string; // تاريخ إيداع التبرير لدى الإدارة
  isWithin72Hours: boolean; // هل تم الإيداع خلال الأجل القانوني (72 ساعة)
  status: AbsenceStatus; // حالة الملف
  isJustified: boolean; // هل يعتبر مبرراً رسمياً
  notes: string; // ملاحظات الإدارة أو قرار اللجنة
  clerkName: string; // اسم الموظف المكلف الذي أدرج البيانات
  clerkId: string; // معرف الموظف
  createdAt: string; // وقت الإنشاء
  updatedAt: string; // وقت التعديل
}

export interface StaffMember {
  id: string;
  fullName: string; // الاسم واللقب
  jobTitle: string; // الرتبة / الوظيفة (مثال: متصرف رئيسي، ملحق إدارة، رئيس مصلحة التدريس)
  service: string; // المصلحة (مصلحة التدريس ومتابعة الغيابات)
  department: DepartmentType | 'إدارة الكلية المشتركة';
  phoneNumber?: string;
  email?: string;
  isActive: boolean; // هل هو الموظف المسجل حالياً في الوردية
  totalEntriesCount: number; // عدد السجلات المنجزة
  joinedDate: string;
}

export interface UniversityConfig {
  universityName: string; // جامعة محمد بوضياف بالمسيلة
  facultyName: string; // كلية الحقوق والعلوم السياسية
  viceDeanship: string; // نيابة العمادة المكلفة بالدراسات والمسائل المرتبطة بالطلبة
  serviceName: string; // مصلحة التدريس والتعليم والشهادات - مكتب متابعة غيابات الطلبة
  academicYear: string; // 2025/2026
  designerTitle: string; // أ.د/ بلواضح الطيب
  universityLogoUrl: string; // شعار الجامعة
  facultyLogoUrl: string; // شعار الكلية
}

export type ActiveDesktopTab = 'dashboard' | 'records' | 'new-entry' | 'staff' | 'authorities' | 'reports' | 'settings';
