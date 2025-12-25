export interface InvitationRecord {
  id: string
  inviterId: string // 邀请者ID
  inviteeId: string // 被邀请者ID
  inviteeName: string // 被邀请者姓名
  inviteeEmail?: string // 被邀请者邮箱（可选，支持手机号用户）
  inviteePhone?: string // 被邀请者手机号（新增）
  invitationCode: string // 邀请码
  status: 'pending' | 'completed' // 邀请状态
  createdAt: Date
  completedAt?: Date
  rewardCredits: number // 奖励积分
}

export interface InvitationStats {
  successfulInvitations: number // 成功邀请数
  totalCreditsEarned: number // 总获得积分
  invitationCode: string // 用户的邀请码
}

export interface CreateInvitationRequest {
  inviterId: string
  invitationCode: string
}

export interface ProcessInvitationRequest {
  invitationCode: string
  newUserId: string
  newUserName: string
  newUserEmail?: string // 改为可选，支持手机号用户
  newUserPhone?: string // 新增，支持手机号用户
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedInvitations {
  invitations: InvitationRecord[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface InvitationResponse {
  success: boolean
  data?: InvitationRecord | InvitationStats | InvitationRecord[] | PaginatedInvitations
  error?: string
}