/**
 * Enum và định nghĩa các Role trong hệ thống DUT AI
 */
export enum UserRole {
  ADMIN = 'admin',
  LEADER = 'leader',
  TEAMMATE = 'teammate',
  SUB_ADMIN = 'Sub-Admin',
  TRAINER = 'Trainer',
  MENTOR = 'MENTOR',
  HR = 'HR',
  PROJECT_DEVELOPER = 'Project Developer',
  EDUCATOR = 'Educator',
  WEB_DUT_AI = 'web dut ai',
  DUT_AI_QUIZ = 'DUT AI Quiz',
  HE_THONG_CHECKIN = 'He thong checkin',
}

/**
 * Thông tin mô tả chi tiết của từng Role
 */
export const USER_ROLE_DETAILS: Record<
  UserRole,
  { id: number; name: string; description: string; badgeColor?: string }
> = {
  [UserRole.ADMIN]: {
    id: 1,
    name: 'admin',
    description: 'Chủ nhiệm - Toàn quyền hệ thống',
    badgeColor: 'bg-red-500/10 text-red-600 border-red-500/20',
  },
  [UserRole.LEADER]: {
    id: 2,
    name: 'leader',
    description: 'Trưởng nhóm - Quản lý thành viên',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  [UserRole.TEAMMATE]: {
    id: 3,
    name: 'teammate',
    description: 'Thành viên',
    badgeColor: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  },
  [UserRole.HE_THONG_CHECKIN]: {
    id: 4,
    name: 'He thong checkin',
    description: 'User hệ thống checkin',
  },
  [UserRole.WEB_DUT_AI]: {
    id: 5,
    name: 'web dut ai',
    description: 'Hệ thống website dut ai',
  },
  [UserRole.DUT_AI_QUIZ]: {
    id: 6,
    name: 'DUT AI Quiz',
    description: 'Hệ thống Quiz',
  },
  [UserRole.SUB_ADMIN]: {
    id: 7,
    name: 'Sub-Admin',
    description: 'Phó chủ nhiệm / Quản trị viên phụ',
    badgeColor: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  },
  [UserRole.MENTOR]: {
    id: 8,
    name: 'MENTOR',
    description: 'Cố vấn chuyên môn',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  [UserRole.TRAINER]: {
    id: 9,
    name: 'Trainer',
    description: 'Trực tiếp hướng dẫn ở các buổi sinh hoạt',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  [UserRole.HR]: {
    id: 10,
    name: 'HR',
    description: 'Quản lý nhân sự CLB',
    badgeColor: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  },
  [UserRole.EDUCATOR]: {
    id: 11,
    name: 'Educator',
    description: 'Ban đào tạo & học thuật',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  },
  [UserRole.PROJECT_DEVELOPER]: {
    id: 12,
    name: 'Project Developer',
    description: 'Nhà phát triển dự án AI',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  },
}

/**
 * Kiểm tra xem user có ít nhất một trong các roles yêu cầu hay không
 */
export function hasRequiredRole(userRoles: string[] = [], requiredRoles: (UserRole | string)[]): boolean {
  if (!userRoles || userRoles.length === 0) return false
  // Admin luôn có toàn quyền
  if (userRoles.includes(UserRole.ADMIN)) return true

  return requiredRoles.some((role) => userRoles.includes(role))
}
