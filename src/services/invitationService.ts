import type {
  InvitationRecord,
  InvitationStats,
  ProcessInvitationRequest,
  InvitationResponse,
  PaginationParams,
  PaginatedInvitations
} from '../types/invitation'
import { authService } from './auth'

// Mock data storage
const MOCK_INVITATIONS: InvitationRecord[] = [
  {
    id: '1',
    inviterId: '1',
    inviteeId: '2',
    inviteeName: '测试用户',
    inviteeEmail: 'test@example.com',
    invitationCode: '1234',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    completedAt: new Date('2024-01-15'),
    rewardCredits: 1000
  },
  {
    id: '2',
    inviterId: '1',
    inviteeId: '3',
    inviteeName: '李明',
    inviteeEmail: 'liming@example.com',
    invitationCode: '1234',
    status: 'completed',
    createdAt: new Date('2024-01-20'),
    completedAt: new Date('2024-01-20'),
    rewardCredits: 1000
  },
  {
    id: '3',
    inviterId: '1',
    inviteeId: '4',
    inviteeName: '王小红',
    inviteeEmail: 'wangxiaohong@example.com',
    invitationCode: '1234',
    status: 'completed',
    createdAt: new Date('2024-02-01'),
    completedAt: new Date('2024-02-01'),
    rewardCredits: 1000
  },
  {
    id: '4',
    inviterId: '1',
    inviteeId: '5',
    inviteeName: '张三',
    inviteeEmail: 'zhangsan@example.com',
    invitationCode: '1234',
    status: 'completed',
    createdAt: new Date('2024-02-05'),
    completedAt: new Date('2024-02-05'),
    rewardCredits: 1000
  },
  {
    id: '5',
    inviterId: '1',
    inviteeId: '6',
    inviteeName: '刘小芳',
    inviteeEmail: 'liuxiaofang@example.com',
    invitationCode: '1234',
    status: 'completed',
    createdAt: new Date('2024-02-10'),
    completedAt: new Date('2024-02-10'),
    rewardCredits: 1000
  },
  {
    id: '6',
    inviterId: '1',
    inviteeId: '7',
    inviteeName: '陈文华',
    inviteeEmail: 'chenwenhua@example.com',
    invitationCode: '1234',
    status: 'completed',
    createdAt: new Date('2024-02-12'),
    completedAt: new Date('2024-02-12'),
    rewardCredits: 1000
  },
  {
    id: '7',
    inviterId: '1',
    inviteeId: '8',
    inviteeName: '赵敏',
    inviteeEmail: 'zhaomin@example.com',
    invitationCode: '1234',
    status: 'completed',
    createdAt: new Date('2024-02-15'),
    completedAt: new Date('2024-02-15'),
    rewardCredits: 1000
  }
]

// User invitation codes mapping
const USER_INVITATION_CODES: Record<string, string> = {
  '1': '1234', // demo user's invitation code
  '2': '5678'  // test user's invitation code
}

// Special invitation codes
const SPECIAL_INVITATION_CODES: Record<string, { creditsReward: number; description: string }> = {
  '1919': {
    creditsReward: 1000,
    description: '注册即送1000积分'
  }
}

const INVITATION_STORAGE_KEY = 'quickimage_invitations'
const INVITATION_CODES_KEY = 'quickimage_invitation_codes'

class InvitationService {
  private invitations: InvitationRecord[] = []
  private userCodes: Record<string, string> = {}

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    try {
      const storedInvitations = localStorage.getItem(INVITATION_STORAGE_KEY)
      const storedCodes = localStorage.getItem(INVITATION_CODES_KEY)
      
      if (storedInvitations) {
        this.invitations = JSON.parse(storedInvitations).map((inv: InvitationRecord) => ({
          ...inv,
          createdAt: new Date(inv.createdAt),
          completedAt: inv.completedAt ? new Date(inv.completedAt) : undefined
        }))
      } else {
        this.invitations = [...MOCK_INVITATIONS]
      }

      if (storedCodes) {
        this.userCodes = JSON.parse(storedCodes)
      } else {
        this.userCodes = { ...USER_INVITATION_CODES }
      }
    } catch (error) {
      console.error('Failed to load invitation data from storage:', error)
      this.invitations = [...MOCK_INVITATIONS]
      this.userCodes = { ...USER_INVITATION_CODES }
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(INVITATION_STORAGE_KEY, JSON.stringify(this.invitations))
      localStorage.setItem(INVITATION_CODES_KEY, JSON.stringify(this.userCodes))
    } catch (error) {
      console.error('Failed to save invitation data to storage:', error)
    }
  }

  private generateInvitationCode(userId: string): string {
    if (this.userCodes[userId]) {
      return this.userCodes[userId]
    }

    // Generate a unique 4-digit code
    let result = ''
    for (let i = 0; i < 4; i++) {
      result += Math.floor(Math.random() * 10).toString()
    }

    // Ensure uniqueness
    const existingCodes = Object.values(this.userCodes)
    if (existingCodes.includes(result)) {
      return this.generateInvitationCode(userId) // Recursive retry
    }

    this.userCodes[userId] = result
    this.saveToStorage()
    return result
  }

  async getUserInvitationCode(userId: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!this.userCodes[userId]) {
      this.generateInvitationCode(userId)
    }
    
    return this.userCodes[userId] || ''
  }

  async getInvitationStats(userId: string): Promise<InvitationResponse> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const userInvitations = this.invitations.filter(inv => inv.inviterId === userId)
    // 由于所有邀请记录都表示成功注册，直接使用总数
    const totalCreditsEarned = userInvitations.reduce((sum, inv) => sum + inv.rewardCredits, 0)

    const stats: InvitationStats = {
      successfulInvitations: userInvitations.length,
      totalCreditsEarned,
      invitationCode: await this.getUserInvitationCode(userId)
    }

    return {
      success: true,
      data: stats
    }
  }

  async getUserInvitations(userId: string): Promise<InvitationResponse> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const userInvitations = this.invitations
      .filter(inv => inv.inviterId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return {
      success: true,
      data: userInvitations
    }
  }

  async getUserInvitationsPaginated(userId: string, params: PaginationParams): Promise<InvitationResponse> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const userInvitations = this.invitations
      .filter(inv => inv.inviterId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const total = userInvitations.length
    const totalPages = Math.ceil(total / params.limit)
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const paginatedInvitations = userInvitations.slice(startIndex, endIndex)

    const result: PaginatedInvitations = {
      invitations: paginatedInvitations,
      total,
      page: params.page,
      limit: params.limit,
      totalPages
    }

    return {
      success: true,
      data: result
    }
  }

  async processInvitation(request: ProcessInvitationRequest): Promise<InvitationResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const { invitationCode, newUserId, newUserName, newUserEmail, newUserPhone } = request

    // Check if it's a special invitation code
    if (SPECIAL_INVITATION_CODES[invitationCode]) {
      const specialCode = SPECIAL_INVITATION_CODES[invitationCode]

      // Give credits directly to the new user
      try {
        await authService.addCredits(newUserId, specialCode.creditsReward)
      } catch (error) {
        console.error('Failed to add special credits to new user:', error)
      }

      // Create a special invitation record (no inviter)
      const newInvitation: InvitationRecord = {
        id: Date.now().toString(),
        inviterId: 'system', // Special system inviter
        inviteeId: newUserId,
        inviteeName: newUserName,
        inviteeEmail: newUserEmail,
        inviteePhone: newUserPhone,
        invitationCode,
        status: 'completed',
        createdAt: new Date(),
        completedAt: new Date(),
        rewardCredits: specialCode.creditsReward
      }

      this.invitations.push(newInvitation)
      this.saveToStorage()

      return {
        success: true,
        data: newInvitation
      }
    }

    // Find the inviter by invitation code for regular codes
    const inviterId = Object.keys(this.userCodes).find(
      userId => this.userCodes[userId] === invitationCode
    )

    if (!inviterId) {
      return {
        success: false,
        error: '无效的邀请码'
      }
    }

    // Check if this user was already invited by this code (by email or phone)
    const existingInvitation = this.invitations.find(
      inv =>
        (newUserEmail && inv.inviteeEmail === newUserEmail ||
         newUserPhone && inv.inviteePhone === newUserPhone) &&
        inv.invitationCode === invitationCode
    )

    if (existingInvitation) {
      return {
        success: false,
        error: '该账户已经使用过此邀请码'
      }
    }

    // Create new invitation record
    const newInvitation: InvitationRecord = {
      id: Date.now().toString(),
      inviterId,
      inviteeId: newUserId,
      inviteeName: newUserName,
      inviteeEmail: newUserEmail,
      inviteePhone: newUserPhone,
      invitationCode,
      status: 'completed',
      createdAt: new Date(),
      completedAt: new Date(),
      rewardCredits: 1000 // Fixed reward amount for regular invites
    }

    this.invitations.push(newInvitation)
    this.saveToStorage()

    // Award credits to the inviter
    try {
      await authService.addCredits(inviterId, newInvitation.rewardCredits)
    } catch (error) {
      console.error('Failed to add credits to inviter:', error)
    }

    return {
      success: true,
      data: newInvitation
    }
  }

  generateInvitationUrl(invitationCode: string): string {
    const baseUrl = window.location.origin
    return `${baseUrl}/signup?invitation=${invitationCode}`
  }

  async validateInvitationCode(code: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return Object.values(this.userCodes).includes(code) || SPECIAL_INVITATION_CODES[code] !== undefined
  }

  getSpecialInvitationInfo(code: string) {
    return SPECIAL_INVITATION_CODES[code]
  }
}

export const invitationService = new InvitationService()