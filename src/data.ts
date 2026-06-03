export type UserRole = 'governorate_supervisor' | 'unit_director' | 'evaluation_committee' | 'sector_manager' | 'neighborhood_coordinator' | 'volunteer';
export type VolunteerStatus = 'active' | 'inactive' | 'pending';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type AttendanceStatus = 'present' | 'absent' | 'excused';
export type ParticipationLevel = 'مشارك بفاعلية' | 'مشارك بانتظام' | 'مشارك أحياناً' | 'يحتاج زيادة المشاركة';
export type CommitmentLevel = 'ملتزم جداً' | 'ملتزم' | 'يحتاج تحسين الالتزام';
export type TeammateStatus = 'متعاون جداً' | 'متعاون' | 'يحتاج تطوير مهارات العمل الجماعي';
export type CommunicationSkill = 'ممتازة' | 'جيدة' | 'تحتاج تطوير';
export type LeadershipPotential = 'مرشح للقيادة' | 'يظهر إمكانيات جيدة' | 'يحتاج مزيداً من الخبرة';
export type Recommendation = 'مرشح للتكريم' | 'مرشح لمنصب منسق حي' | 'مرشح لمنصب رئيس قطاع' | 'مرشح لقيادة فعالية' | 'يحتاج متابعة' | 'يحتاج تدريب إضافي' | 'لا توصية';

export interface AttendanceRecord {
  id: string;
  volunteerId: string;
  eventId: string;
  timestamp: string;
  scannedBy: string;
  scannedByName: string;
  status: AttendanceStatus;
}

export interface Sector {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  description: string;
  neighborhoods: string[];
  volunteersCount: number;
  eventsCount: number;
}

export interface Neighborhood {
  id: string;
  name: string;
  sectorId: string;
  coordinatorId: string;
  coordinatorName: string;
  area: string;
  volunteersCount: number;
  population: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  sectorId?: string;
  neighborhoodId?: string;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar: string;
}

export interface Volunteer {
  id: string;
  name: string;
  nationalId: string;
  phone: string;
  email: string;
  address: string;
  sectorId: string;
  neighborhoodId: string;
  joinDate: string;
  status: VolunteerStatus;
  skills: string[];
  hoursTotal: number;
  eventsAttended: number;
  avatar: string;
  age: number;
  education: string;
  occupation: string;
  qrCode: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  sectorId: string;
  neighborhoodId: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  status: EventStatus;
  category: string;
  coordinatorId: string;
  coordinatorName: string;
  imageUrl: string;
}

export interface Registration {
  id: string;
  volunteerId: string;
  eventId: string;
  registrationDate: string;
  attendance: AttendanceStatus | null;
}

export interface FollowUpProfile {
  id: string;
  volunteerId: string;
  participationLevel: ParticipationLevel;
  commitmentLevel: CommitmentLevel;
  teamwork: TeammateStatus;
  communicationSkills: CommunicationSkill;
  leadershipPotential: LeadershipPotential;
  strengths: string;
  areasForImprovement: string;
  eventNotes: string;
  followUpCommitteeNotes: string;
  recommendations: Recommendation[];
  lastUpdated: string;
  updatedBy: string;
  updatedByName: string;
}

export const EVENT_CATEGORIES = [
  'توعية مجتمعية', 'تدريب ورش عمل', 'رعاية صحية', 'دعم نفسي', 'أنشطة شبابية', 'زيارات ميدانية'
];

export const sectors: Sector[] = [
  {
    id: 's1',
    name: 'القطاع الشرقي',
    managerId: 'u1',
    managerName: 'محمد أحمد الشرقاوي',
    description: 'يشمل أحياء شرق الإسكندرية',
    neighborhoods: ['n1', 'n2'],
    volunteersCount: 8,
    eventsCount: 12,
  },
  {
    id: 's2',
    name: 'القطاع الغربي',
    managerId: 'u2',
    managerName: 'فاطمة سعيد الغربي',
    description: 'يشمل أحياء غرب الإسكندرية',
    neighborhoods: ['n3', 'n4'],
    volunteersCount: 7,
    eventsCount: 10,
  },
  {
    id: 's3',
    name: 'القطاع الأوسط',
    managerId: 'u3',
    managerName: 'علي حسن الوسيط',
    description: 'يشمل أحياء وسط الإسكندرية',
    neighborhoods: ['n5', 'n6'],
    volunteersCount: 9,
    eventsCount: 14,
  },
  {
    id: 's4',
    name: 'قطاع برج العرب',
    managerId: 'u4',
    managerName: 'سارة محمود برج العرب',
    description: 'يشمل برج العرب والمناطق المحيطة',
    neighborhoods: ['n7', 'n8'],
    volunteersCount: 6,
    eventsCount: 8,
  },
];

export const neighborhoods: Neighborhood[] = [
  {
    id: 'n1',
    name: 'حي باب شرق',
    sectorId: 's1',
    coordinatorId: 'u5',
    coordinatorName: 'نور محمد السيد',
    area: 'وسط',
    volunteersCount: 4,
    population: 85000,
  },
  {
    id: 'n2',
    name: 'حي الدخيلة',
    sectorId: 's1',
    coordinatorId: 'u6',
    coordinatorName: 'يوسف علي أحمد',
    area: 'جنوب',
    volunteersCount: 4,
    population: 92000,
  },
  {
    id: 'n3',
    name: 'حي العجمي',
    sectorId: 's2',
    coordinatorId: 'u7',
    coordinatorName: 'ليلى حسن محمود',
    area: 'غرب',
    volunteersCount: 3,
    population: 76000,
  },
  {
    id: 'n4',
    name: 'حي برج العرب',
    sectorId: 's2',
    coordinatorId: 'u8',
    coordinatorName: 'عمر فتحي عبدالعزيز',
    area: 'غرب جنوب',
    volunteersCount: 4,
    population: 68000,
  },
  {
    id: 'n5',
    name: 'حي المنتزه',
    sectorId: 's3',
    coordinatorId: 'u9',
    coordinatorName: 'مريم أحمد فايد',
    area: 'شمال',
    volunteersCount: 5,
    population: 95000,
  },
  {
    id: 'n6',
    name: 'حي سموحة',
    sectorId: 's3',
    coordinatorId: 'u10',
    coordinatorName: 'خالد محمود نجيب',
    area: 'شمال وسط',
    volunteersCount: 4,
    population: 88000,
  },
  {
    id: 'n7',
    name: 'حي المينا',
    sectorId: 's4',
    coordinatorId: 'u11',
    coordinatorName: 'أمينة علي محمد',
    area: 'جنوب غرب',
    volunteersCount: 3,
    population: 72000,
  },
  {
    id: 'n8',
    name: 'حي الجمرك',
    sectorId: 's4',
    coordinatorId: 'u12',
    coordinatorName: 'حسن سعيد إبراهيم',
    area: 'جنوب',
    volunteersCount: 3,
    population: 79000,
  },
];

export const users: User[] = [
  {
    id: 'u_gov',
    name: 'د. محمود أحمد الإمام',
    role: 'governorate_supervisor',
    email: 'gov.supervisor@example.com',
    phone: '01001111111',
    joinDate: '2021-01-15',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'u_dir',
    name: 'أ. فاطمة سالم الدين',
    role: 'unit_director',
    email: 'unit.director@example.com',
    phone: '01002222222',
    joinDate: '2021-02-20',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'u_eval',
    name: 'لجنة التقييم والمتابعة',
    role: 'evaluation_committee',
    email: 'eval.committee@example.com',
    phone: '01003333333',
    joinDate: '2021-03-10',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  { id: 'u1', name: 'محمد أحمد الشرقاوي', role: 'sector_manager', email: 'manager1@example.com', phone: '01101111111', sectorId: 's1', joinDate: '2022-01-15', status: 'active', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u2', name: 'فاطمة سعيد الغربي', role: 'sector_manager', email: 'manager2@example.com', phone: '01101111112', sectorId: 's2', joinDate: '2022-02-20', status: 'active', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u3', name: 'علي حسن الوسيط', role: 'sector_manager', email: 'manager3@example.com', phone: '01101111113', sectorId: 's3', joinDate: '2022-03-15', status: 'active', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u4', name: 'سارة محمود برج العرب', role: 'sector_manager', email: 'manager4@example.com', phone: '01101111114', sectorId: 's4', joinDate: '2022-04-10', status: 'active', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u5', name: 'نور محمد السيد', role: 'neighborhood_coordinator', email: 'coord1@example.com', phone: '01101111115', sectorId: 's1', neighborhoodId: 'n1', joinDate: '2022-05-01', status: 'active', avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u6', name: 'يوسف علي أحمد', role: 'neighborhood_coordinator', email: 'coord2@example.com', phone: '01101111116', sectorId: 's1', neighborhoodId: 'n2', joinDate: '2022-05-15', status: 'active', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u7', name: 'ليلى حسن محمود', role: 'neighborhood_coordinator', email: 'coord3@example.com', phone: '01101111117', sectorId: 's2', neighborhoodId: 'n3', joinDate: '2022-06-01', status: 'active', avatar: 'https://images.pexels.com/photos/220452/pexels-photo-220452.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u8', name: 'عمر فتحي عبدالعزيز', role: 'neighborhood_coordinator', email: 'coord4@example.com', phone: '01101111118', sectorId: 's2', neighborhoodId: 'n4', joinDate: '2022-06-15', status: 'active', avatar: 'https://images.pexels.com/photos/91228/pexels-photo-91228.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u9', name: 'مريم أحمد فايد', role: 'neighborhood_coordinator', email: 'coord5@example.com', phone: '01101111119', sectorId: 's3', neighborhoodId: 'n5', joinDate: '2022-07-01', status: 'active', avatar: 'https://images.pexels.com/photos/1181691/pexels-photo-1181691.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u10', name: 'خالد محمود نجيب', role: 'neighborhood_coordinator', email: 'coord6@example.com', phone: '01101111120', sectorId: 's3', neighborhoodId: 'n6', joinDate: '2022-07-15', status: 'active', avatar: 'https://images.pexels.com/photos/220454/pexels-photo-220454.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u11', name: 'أمينة علي محمد', role: 'neighborhood_coordinator', email: 'coord7@example.com', phone: '01101111121', sectorId: 's4', neighborhoodId: 'n7', joinDate: '2022-08-01', status: 'active', avatar: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'u12', name: 'حسن سعيد إبراهيم', role: 'neighborhood_coordinator', email: 'coord8@example.com', phone: '01101111122', sectorId: 's4', neighborhoodId: 'n8', joinDate: '2022-08-15', status: 'active', avatar: 'https://images.pexels.com/photos/614811/pexels-photo-614811.jpeg?auto=compress&cs=tinysrgb&w=150' },
];

export const volunteers: Volunteer[] = [
  { id: 'v1', name: 'أحمد محمود السيد', nationalId: '29801150123456', phone: '01001234567', email: 'v1@example.com', address: 'شارع الكورنيش، باب شرق', sectorId: 's1', neighborhoodId: 'n1', joinDate: '2023-03-15', status: 'active', skills: ['التوعية', 'التدريب', 'الإسعافات'], hoursTotal: 120, eventsAttended: 18, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150', age: 28, education: 'بكالوريوس تجارة', occupation: 'موظف حكومي', qrCode: 'VOLUNTEER_V1_QR' },
  { id: 'v2', name: 'فاطمة علي حسن', nationalId: '30005200234567', phone: '01112345678', email: 'v2@example.com', address: 'شارع النصر، باب شرق', sectorId: 's1', neighborhoodId: 'n1', joinDate: '2023-06-20', status: 'active', skills: ['الدعم النفسي', 'التدريس', 'الفنون'], hoursTotal: 95, eventsAttended: 14, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', age: 26, education: 'بكالوريوس طب نفسي', occupation: 'طبيبة متدربة', qrCode: 'VOLUNTEER_V2_QR' },
  { id: 'v3', name: 'محمد عبدالله النحاس', nationalId: '29512150345678', phone: '01223456789', email: 'v3@example.com', address: 'شارع السرايا، باب شرق', sectorId: 's1', neighborhoodId: 'n1', joinDate: '2022-11-10', status: 'active', skills: ['الرياضة', 'التوعية الشبابية', 'القيادة'], hoursTotal: 210, eventsAttended: 32, avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150', age: 31, education: 'ليسانس تربية رياضية', occupation: 'مدرب رياضي', qrCode: 'VOLUNTEER_V3_QR' },
  { id: 'v4', name: 'سارة خالد إبراهيم', nationalId: '30103250456789', phone: '01334567890', email: 'v4@example.com', address: 'شارع المعمورة، باب شرق', sectorId: 's1', neighborhoodId: 'n1', joinDate: '2024-01-05', status: 'pending', skills: ['التصوير', 'التسويق', 'الإعلام'], hoursTotal: 15, eventsAttended: 3, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', age: 23, education: 'بكالوريوس إعلام', occupation: 'طالبة دراسات عليا', qrCode: 'VOLUNTEER_V4_QR' },
  { id: 'v5', name: 'يوسف حسام الدين', nationalId: '29706180567890', phone: '01445678901', email: 'v5@example.com', address: 'شارع فوزي معاذ، الدخيلة', sectorId: 's1', neighborhoodId: 'n2', joinDate: '2023-09-01', status: 'active', skills: ['الطب', 'الإسعافات الأولية', 'الرعاية'], hoursTotal: 140, eventsAttended: 22, avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150', age: 29, education: 'بكالوريوس طب', occupation: 'طبيب', qrCode: 'VOLUNTEER_V5_QR' },
  { id: 'v6', name: 'نور محمد الشيخ', nationalId: '30209100678901', phone: '01556789012', email: 'v6@example.com', address: 'شارع الميناء، الدخيلة', sectorId: 's1', neighborhoodId: 'n2', joinDate: '2023-04-18', status: 'inactive', skills: ['التوعية', 'العمل الاجتماعي'], hoursTotal: 45, eventsAttended: 7, avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150', age: 24, education: 'بكالوريوس خدمة اجتماعية', occupation: 'أخصائية اجتماعية', qrCode: 'VOLUNTEER_V6_QR' },
  { id: 'v7', name: 'عمر فتحي عبدالعزيز', nationalId: '29904250789012', phone: '01667890123', email: 'v7@example.com', address: 'شارع السلام، الدخيلة', sectorId: 's1', neighborhoodId: 'n2', joinDate: '2022-07-22', status: 'active', skills: ['المحاسبة', 'الإدارة', 'التخطيط'], hoursTotal: 185, eventsAttended: 28, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', age: 27, education: 'ماجستير إدارة أعمال', occupation: 'محاسب قانوني', qrCode: 'VOLUNTEER_V7_QR' },
  { id: 'v8', name: 'مريم حسن العمري', nationalId: '30108050890123', phone: '01778901234', email: 'v8@example.com', address: 'شارع النزهة، الدخيلة', sectorId: 's1', neighborhoodId: 'n2', joinDate: '2024-02-14', status: 'active', skills: ['التمريض', 'الدعم النفسي', 'التوعية'], hoursTotal: 30, eventsAttended: 5, avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150', age: 25, education: 'بكالوريوس تمريض', occupation: 'ممرضة', qrCode: 'VOLUNTEER_V8_QR' },
  { id: 'v9', name: 'خالد محمود إبراهيم', nationalId: '29602150901234', phone: '01889012345', email: 'v9@example.com', address: 'شارع الشهيد محمود، العجمي', sectorId: 's2', neighborhoodId: 'n3', joinDate: '2023-01-10', status: 'active', skills: ['التوعية المجتمعية', 'الإدارة'], hoursTotal: 160, eventsAttended: 24, avatar: 'https://images.pexels.com/photos/1681011/pexels-photo-1681011.jpeg?auto=compress&cs=tinysrgb&w=150', age: 32, education: 'بكالوريوس إدارة', occupation: 'مدير مشروع', qrCode: 'VOLUNTEER_V9_QR' },
  { id: 'v10', name: 'ليلى علي أحمد', nationalId: '30301201012345', phone: '01990123456', email: 'v10@example.com', address: 'شارع الجمهورية، العجمي', sectorId: 's2', neighborhoodId: 'n3', joinDate: '2023-05-22', status: 'active', skills: ['التدريب', 'التعليم'], hoursTotal: 110, eventsAttended: 16, avatar: 'https://images.pexels.com/photos/1239292/pexels-photo-1239292.jpeg?auto=compress&cs=tinysrgb&w=150', age: 30, education: 'ليسانس تربية', occupation: 'معلمة', qrCode: 'VOLUNTEER_V10_QR' },
  { id: 'v11', name: 'علي محمد سالم', nationalId: '29405230123456', phone: '01100234567', email: 'v11@example.com', address: 'شارع حريمة، العجمي', sectorId: 's2', neighborhoodId: 'n3', joinDate: '2024-01-30', status: 'pending', skills: ['الرياضة', 'الشباب'], hoursTotal: 20, eventsAttended: 2, avatar: 'https://images.pexels.com/photos/91229/pexels-photo-91229.jpeg?auto=compress&cs=tinysrgb&w=150', age: 26, education: 'بكالوريوس رياضة', occupation: 'مدرب', qrCode: 'VOLUNTEER_V11_QR' },
  { id: 'v12', name: 'فاطمة محمود الحسيني', nationalId: '30404190234567', phone: '01211345678', email: 'v12@example.com', address: 'شارع الوحدة، برج العرب', sectorId: 's2', neighborhoodId: 'n4', joinDate: '2023-04-05', status: 'active', skills: ['الدعم النفسي', 'الاستشارة'], hoursTotal: 125, eventsAttended: 19, avatar: 'https://images.pexels.com/photos/1170982/pexels-photo-1170982.jpeg?auto=compress&cs=tinysrgb&w=150', age: 28, education: 'ماجستير نفسي', occupation: 'استشاري نفسي', qrCode: 'VOLUNTEER_V12_QR' },
  { id: 'v13', name: 'محمود سعيد إسماعيل', nationalId: '29708040345678', phone: '01312345678', email: 'v13@example.com', address: 'شارع التحرير، برج العرب', sectorId: 's2', neighborhoodId: 'n4', joinDate: '2023-07-18', status: 'active', skills: ['التنظيم', 'الإدارة', 'التخطيط'], hoursTotal: 95, eventsAttended: 14, avatar: 'https://images.pexels.com/photos/1681012/pexels-photo-1681012.jpeg?auto=compress&cs=tinysrgb&w=150', age: 35, education: 'بكالوريوس إدارة', occupation: 'مدير إداري', qrCode: 'VOLUNTEER_V13_QR' },
  { id: 'v14', name: 'نادية حسن فايد', nationalId: '30005060456789', phone: '01413456789', email: 'v14@example.com', address: 'شارع عبدالسلام عارف، برج العرب', sectorId: 's2', neighborhoodId: 'n4', joinDate: '2023-08-09', status: 'active', skills: ['التوعية الصحية', 'التثقيف'], hoursTotal: 70, eventsAttended: 10, avatar: 'https://images.pexels.com/photos/1239293/pexels-photo-1239293.jpeg?auto=compress&cs=tinysrgb&w=150', age: 29, education: 'بكالوريوس تمريض', occupation: 'تمريضة', qrCode: 'VOLUNTEER_V14_QR' },
  { id: 'v15', name: 'حسام الدين محمد', nationalId: '29601230567890', phone: '01514567890', email: 'v15@example.com', address: 'شارع الملك فاروق، برج العرب', sectorId: 's2', neighborhoodId: 'n4', joinDate: '2024-03-12', status: 'pending', skills: ['التكنولوجيا', 'الإعلام الرقمي'], hoursTotal: 10, eventsAttended: 1, avatar: 'https://images.pexels.com/photos/220455/pexels-photo-220455.jpeg?auto=compress&cs=tinysrgb&w=150', age: 24, education: 'بكالوريوس حاسوب', occupation: 'مبرمج', qrCode: 'VOLUNTEER_V15_QR' },
  { id: 'v16', name: 'أمينة علي محمد', nationalId: '30202150678901', phone: '01615678901', email: 'v16@example.com', address: 'شارع الكورنيش الشرقي، المنتزه', sectorId: 's3', neighborhoodId: 'n5', joinDate: '2023-02-14', status: 'active', skills: ['الفنون', 'الثقافة', 'التوعية'], hoursTotal: 135, eventsAttended: 20, avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150', age: 27, education: 'بكالوريوس فنون', occupation: 'فنانة', qrCode: 'VOLUNTEER_V16_QR' },
  { id: 'v17', name: 'خليل إبراهيم حسن', nationalId: '29804070789012', phone: '01716789012', email: 'v17@example.com', address: 'شارع الساحل، المنتزه', sectorId: 's3', neighborhoodId: 'n5', joinDate: '2023-03-28', status: 'active', skills: ['الرياضة', 'اللياقة', 'التنظيم'], hoursTotal: 150, eventsAttended: 23, avatar: 'https://images.pexels.com/photos/614812/pexels-photo-614812.jpeg?auto=compress&cs=tinysrgb&w=150', age: 34, education: 'بكالوريوس تربية رياضية', occupation: 'مدرب رياضي', qrCode: 'VOLUNTEER_V17_QR' },
  { id: 'v18', name: 'هند محمود علي', nationalId: '30103080890123', phone: '01817890123', email: 'v18@example.com', address: 'شارع قصر النيل، المنتزه', sectorId: 's3', neighborhoodId: 'n5', joinDate: '2023-06-05', status: 'active', skills: ['التوعية الاجتماعية', 'الدعم'], hoursTotal: 85, eventsAttended: 13, avatar: 'https://images.pexels.com/photos/1239294/pexels-photo-1239294.jpeg?auto=compress&cs=tinysrgb&w=150', age: 31, education: 'بكالوريوس عمل اجتماعي', occupation: 'أخصائية اجتماعية', qrCode: 'VOLUNTEER_V18_QR' },
  { id: 'v19', name: 'محمود علي السيد', nationalId: '29705200901234', phone: '01918901234', email: 'v19@example.com', address: 'شارع الجمهورية، المنتزه', sectorId: 's3', neighborhoodId: 'n5', joinDate: '2023-09-11', status: 'active', skills: ['الإدارة', 'التنظيم'], hoursTotal: 100, eventsAttended: 15, avatar: 'https://images.pexels.com/photos/91230/pexels-photo-91230.jpeg?auto=compress&cs=tinysrgb&w=150', age: 38, education: 'ماجستير إدارة', occupation: 'مدير تنفيذي', qrCode: 'VOLUNTEER_V19_QR' },
  { id: 'v20', name: 'شيماء محمد أحمد', nationalId: '30206150012345', phone: '02019012345', email: 'v20@example.com', address: 'شارع البطل محمود، المنتزه', sectorId: 's3', neighborhoodId: 'n5', joinDate: '2024-02-20', status: 'pending', skills: ['الإعلام', 'التسويق'], hoursTotal: 25, eventsAttended: 4, avatar: 'https://images.pexels.com/photos/1170981/pexels-photo-1170981.jpeg?auto=compress&cs=tinysrgb&w=150', age: 25, education: 'بكالوريوس إعلام', occupation: 'إعلامية', qrCode: 'VOLUNTEER_V20_QR' },
  { id: 'v21', name: 'سليم محمد فتحي', nationalId: '29503210123456', phone: '02110123456', email: 'v21@example.com', address: 'شارع النصر، سموحة', sectorId: 's3', neighborhoodId: 'n6', joinDate: '2023-01-25', status: 'active', skills: ['التعليم', 'التدريب', 'الإرشاد'], hoursTotal: 170, eventsAttended: 26, avatar: 'https://images.pexels.com/photos/1681013/pexels-photo-1681013.jpeg?auto=compress&cs=tinysrgb&w=150', age: 36, education: 'ليسانس تربية', occupation: 'مدرس', qrCode: 'VOLUNTEER_V21_QR' },
  { id: 'v22', name: 'عفاف حسن محمود', nationalId: '30404070234567', phone: '02210234567', email: 'v22@example.com', address: 'شارع عمارة، سموحة', sectorId: 's3', neighborhoodId: 'n6', joinDate: '2023-04-30', status: 'active', skills: ['الرعاية الاجتماعية', 'الدعم النفسي'], hoursTotal: 92, eventsAttended: 14, avatar: 'https://images.pexels.com/photos/1239295/pexels-photo-1239295.jpeg?auto=compress&cs=tinysrgb&w=150', age: 33, education: 'بكالوريوس عمل اجتماعي', occupation: 'عاملة اجتماعية', qrCode: 'VOLUNTEER_V22_QR' },
  { id: 'v23', name: 'سامي صلاح إبراهيم', nationalId: '29606050345678', phone: '02310345678', email: 'v23@example.com', address: 'شارع الزهور، سموحة', sectorId: 's3', neighborhoodId: 'n6', joinDate: '2023-07-14', status: 'active', skills: ['البحث العلمي', 'التقييم'], hoursTotal: 110, eventsAttended: 17, avatar: 'https://images.pexels.com/photos/220456/pexels-photo-220456.jpeg?auto=compress&cs=tinysrgb&w=150', age: 29, education: 'ماجستير علم نفس', occupation: 'باحث', qrCode: 'VOLUNTEER_V23_QR' },
  { id: 'v24', name: 'رهام علي سعيد', nationalId: '30101130456789', phone: '02410456789', email: 'v24@example.com', address: 'شارع الجمهورية، سموحة', sectorId: 's3', neighborhoodId: 'n6', joinDate: '2024-01-10', status: 'pending', skills: ['الإدارة', 'التنظيم'], hoursTotal: 15, eventsAttended: 2, avatar: 'https://images.pexels.com/photos/1181692/pexels-photo-1181692.jpeg?auto=compress&cs=tinysrgb&w=150', age: 26, education: 'بكالوريوس إدارة', occupation: 'موظفة', qrCode: 'VOLUNTEER_V24_QR' },
  { id: 'v25', name: 'إبراهيم حسن محمود', nationalId: '29508220567890', phone: '02510567890', email: 'v25@example.com', address: 'شارع الميناء، المينا', sectorId: 's4', neighborhoodId: 'n7', joinDate: '2023-02-18', status: 'active', skills: ['التوعية', 'الإدارة', 'الإشراف'], hoursTotal: 155, eventsAttended: 23, avatar: 'https://images.pexels.com/photos/614813/pexels-photo-614813.jpeg?auto=compress&cs=tinysrgb&w=150', age: 40, education: 'بكالوريوس إدارة', occupation: 'مدير مشروع', qrCode: 'VOLUNTEER_V25_QR' },
  { id: 'v26', name: 'نجاة محمد أحمد', nationalId: '30303050678901', phone: '02610678901', email: 'v26@example.com', address: 'شارع البحر، المينا', sectorId: 's4', neighborhoodId: 'n7', joinDate: '2023-05-25', status: 'active', skills: ['الصحة', 'التوعية الصحية'], hoursTotal: 75, eventsAttended: 11, avatar: 'https://images.pexels.com/photos/1239296/pexels-photo-1239296.jpeg?auto=compress&cs=tinysrgb&w=150', age: 28, education: 'بكالوريوس صحة عامة', occupation: 'مثقفة صحية', qrCode: 'VOLUNTEER_V26_QR' },
  { id: 'v27', name: 'طاهر علي محمد', nationalId: '29709160789012', phone: '02710789012', email: 'v27@example.com', address: 'شارع الحريس، المينا', sectorId: 's4', neighborhoodId: 'n7', joinDate: '2024-03-05', status: 'pending', skills: ['الإعلام', 'التوثيق'], hoursTotal: 12, eventsAttended: 1, avatar: 'https://images.pexels.com/photos/1681014/pexels-photo-1681014.jpeg?auto=compress&cs=tinysrgb&w=150', age: 22, education: 'بكالوريوس إعلام', occupation: 'طالب', qrCode: 'VOLUNTEER_V27_QR' },
  { id: 'v28', name: 'جمال فتحي سليم', nationalId: '29403100890123', phone: '02810890123', email: 'v28@example.com', address: 'شارع السلام، الجمرك', sectorId: 's4', neighborhoodId: 'n8', joinDate: '2023-01-30', status: 'active', skills: ['التنظيم', 'الفعاليات', 'الإدارة'], hoursTotal: 180, eventsAttended: 27, avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=150', age: 41, education: 'ماجستير إدارة', occupation: 'مدير فعاليات', qrCode: 'VOLUNTEER_V28_QR' },
  { id: 'v29', name: 'نعمة محمود إسماعيل', nationalId: '30107070901234', phone: '02910901234', email: 'v29@example.com', address: 'شارع عبدالسلام عارف، الجمرك', sectorId: 's4', neighborhoodId: 'n8', joinDate: '2023-06-12', status: 'active', skills: ['التدريب', 'التعليم', 'التوعية'], hoursTotal: 105, eventsAttended: 16, avatar: 'https://images.pexels.com/photos/1181693/pexels-photo-1181693.jpeg?auto=compress&cs=tinysrgb&w=150', age: 32, education: 'ليسانس تربية', occupation: 'معلمة', qrCode: 'VOLUNTEER_V29_QR' },
  { id: 'v30', name: 'وليد سعيد عبدالله', nationalId: '29604250012345', phone: '03010012345', email: 'v30@example.com', address: 'شارع الأمل، الجمرك', sectorId: 's4', neighborhoodId: 'n8', joinDate: '2024-02-28', status: 'pending', skills: ['الرياضة', 'الشباب'], hoursTotal: 18, eventsAttended: 3, avatar: 'https://images.pexels.com/photos/91231/pexels-photo-91231.jpeg?auto=compress&cs=tinysrgb&w=150', age: 23, education: 'بكالوريوس تربية رياضية', occupation: 'مدرب شباب', qrCode: 'VOLUNTEER_V30_QR' },
];

export const events: Event[] = [
  {
    id: 'e1',
    title: 'حملة توعية بمخاطر المخدرات في المدارس',
    description: 'حملة توعية شاملة تستهدف طلاب المرحلة الثانوية',
    date: '2026-06-15',
    time: '10:00',
    location: 'مدرسة الإسكندرية الثانوية بنين',
    sectorId: 's1',
    neighborhoodId: 'n1',
    volunteersNeeded: 10,
    volunteersRegistered: 7,
    status: 'upcoming',
    category: 'توعية مجتمعية',
    coordinatorId: 'v3',
    coordinatorName: 'محمد عبدالله النحاس',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'e2',
    title: 'ورشة عمل: مهارات الرفض والضغط الأقران',
    description: 'ورشة عمل تفاعلية لتعليم الشباب مهارات رفض المخدرات',
    date: '2026-06-20',
    time: '14:00',
    location: 'مركز شباب المنتزه',
    sectorId: 's3',
    neighborhoodId: 'n5',
    volunteersNeeded: 8,
    volunteersRegistered: 8,
    status: 'upcoming',
    category: 'تدريب ورش عمل',
    coordinatorId: 'v1',
    coordinatorName: 'أحمد محمود السيد',
    imageUrl: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'e3',
    title: 'جلسة دعم نفسي لأسر المتعافين',
    description: 'جلسة دعم نفسي وإرشاد لأسر المتعافين من الإدمان',
    date: '2026-05-25',
    time: '11:00',
    location: 'مستشفى الأمل، العجمي',
    sectorId: 's2',
    neighborhoodId: 'n3',
    volunteersNeeded: 5,
    volunteersRegistered: 5,
    status: 'completed',
    category: 'دعم نفسي',
    coordinatorId: 'v2',
    coordinatorName: 'فاطمة علي حسن',
    imageUrl: 'https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'e4',
    title: 'فعالية رياضية: كرة القدم ضد الإدمان',
    description: 'بطولة كرة قدم للشباب للتأكيد على دور الرياضة في مكافحة الإدمان',
    date: '2026-05-30',
    time: '16:00',
    location: 'ملعب كلية التربية الرياضية',
    sectorId: 's1',
    neighborhoodId: 'n2',
    volunteersNeeded: 15,
    volunteersRegistered: 12,
    status: 'completed',
    category: 'أنشطة شبابية',
    coordinatorId: 'v3',
    coordinatorName: 'محمد عبدالله النحاس',
    imageUrl: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export const registrations: Registration[] = [
  { id: 'r1', volunteerId: 'v1', eventId: 'e1', registrationDate: '2026-05-20', attendance: null },
  { id: 'r2', volunteerId: 'v2', eventId: 'e1', registrationDate: '2026-05-21', attendance: null },
  { id: 'r3', volunteerId: 'v3', eventId: 'e1', registrationDate: '2026-05-19', attendance: null },
  { id: 'r4', volunteerId: 'v5', eventId: 'e1', registrationDate: '2026-05-22', attendance: null },
  { id: 'r5', volunteerId: 'v1', eventId: 'e2', registrationDate: '2026-05-18', attendance: null },
  { id: 'r6', volunteerId: 'v16', eventId: 'e2', registrationDate: '2026-05-17', attendance: null },
  { id: 'r7', volunteerId: 'v21', eventId: 'e2', registrationDate: '2026-05-16', attendance: null },
  { id: 'r8', volunteerId: 'v1', eventId: 'e3', registrationDate: '2026-05-01', attendance: 'present' },
  { id: 'r9', volunteerId: 'v2', eventId: 'e3', registrationDate: '2026-05-01', attendance: 'present' },
  { id: 'r10', volunteerId: 'v9', eventId: 'e3', registrationDate: '2026-05-02', attendance: 'present' },
  { id: 'r11', volunteerId: 'v3', eventId: 'e4', registrationDate: '2026-05-10', attendance: 'present' },
  { id: 'r12', volunteerId: 'v7', eventId: 'e4', registrationDate: '2026-05-11', attendance: 'present' },
  { id: 'r13', volunteerId: 'v1', eventId: 'e4', registrationDate: '2026-05-10', attendance: 'absent' },
];

export const followUpProfiles: FollowUpProfile[] = [
  {
    id: 'fup1',
    volunteerId: 'v1',
    participationLevel: 'مشارك بفاعلية',
    commitmentLevel: 'ملتزم جداً',
    teamwork: 'متعاون جداً',
    communicationSkills: 'ممتازة',
    leadershipPotential: 'مرشح للقيادة',
    strengths: 'قيادي طبيعي، يتمتع بمهارات تنظيمية عالية، متفهم للآخرين',
    areasForImprovement: 'يمكن تطوير مهارات الإدارة المالية',
    eventNotes: 'أداء ممتاز في حملة التوعية، تفاعل جيد مع الحضور',
    followUpCommitteeNotes: 'مرشح مميز للمناصب القيادية. يوصى بتدريب متقدم في الإدارة.',
    recommendations: ['مرشح لمنصب رئيس قطاع', 'مرشح لقيادة فعالية'],
    lastUpdated: '2026-05-26',
    updatedBy: 'u_eval',
    updatedByName: 'لجنة التقييم والمتابعة',
  },
  {
    id: 'fup2',
    volunteerId: 'v2',
    participationLevel: 'مشارك بانتظام',
    commitmentLevel: 'ملتزم جداً',
    teamwork: 'متعاون جداً',
    communicationSkills: 'ممتازة',
    leadershipPotential: 'يظهر إمكانيات جيدة',
    strengths: 'حنونة وداعمة، لديها مهارات استماع جيدة، تتمتع بالصبر',
    areasForImprovement: 'تطوير الثقة بالنفس في المواقف العامة',
    eventNotes: 'تجاوزت التوقعات في الدعم النفسي، علاقات إنسانية رائعة',
    followUpCommitteeNotes: 'متطوعة متميزة في الدعم النفسي. بحاجة لدعم لتطوير الثقة بالنفس.',
    recommendations: ['مرشح للتكريم', 'مرشح لمنصب منسق حي'],
    lastUpdated: '2026-05-26',
    updatedBy: 'u_eval',
    updatedByName: 'لجنة التقييم والمتابعة',
  },
  {
    id: 'fup3',
    volunteerId: 'v3',
    participationLevel: 'مشارك بفاعلية',
    commitmentLevel: 'ملتزم جداً',
    teamwork: 'متعاون جداً',
    communicationSkills: 'جيدة',
    leadershipPotential: 'مرشح للقيادة',
    strengths: 'منظم ممتاز، حماسي للرياضة والشباب، لديه رؤية واضحة',
    areasForImprovement: 'تطوير مهارات التواصل العلني والكتابة',
    eventNotes: 'تنظيم احترافي للبطولة الرياضية، قيادة فعالة للفريق',
    followUpCommitteeNotes: 'متطوع قائد بطبيعته. يوصى بتطويره كمدرب وقائد فعاليات.',
    recommendations: ['مرشح للتكريم', 'مرشح لقيادة فعالية'],
    lastUpdated: '2026-05-31',
    updatedBy: 'u_eval',
    updatedByName: 'لجنة التقييم والمتابعة',
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: 'att1', volunteerId: 'v1', eventId: 'e3', timestamp: '2026-05-25 11:05', scannedBy: 'u5', scannedByName: 'نور محمد السيد', status: 'present' },
  { id: 'att2', volunteerId: 'v2', eventId: 'e3', timestamp: '2026-05-25 11:08', scannedBy: 'u5', scannedByName: 'نور محمد السيد', status: 'present' },
  { id: 'att3', volunteerId: 'v9', eventId: 'e3', timestamp: '2026-05-25 11:12', scannedBy: 'u5', scannedByName: 'نور محمد السيد', status: 'present' },
  { id: 'att4', volunteerId: 'v3', eventId: 'e4', timestamp: '2026-05-30 16:15', scannedBy: 'u6', scannedByName: 'يوسف علي أحمد', status: 'present' },
  { id: 'att5', volunteerId: 'v7', eventId: 'e4', timestamp: '2026-05-30 16:18', scannedBy: 'u6', scannedByName: 'يوسف علي أحمد', status: 'present' },
  { id: 'att6', volunteerId: 'v1', eventId: 'e4', timestamp: '2026-05-30 16:45', scannedBy: 'u6', scannedByName: 'يوسف علي أحمد', status: 'absent' },
];
