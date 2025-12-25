import { verificationService } from './verification'

export interface User {
  id: string
  email?: string              // 改为可选，支持纯手机号用户
  phone?: string              // 新增：手机号码（格式：+86xxxxxxxxxx）
  name?: string               // 改为可选，手机注册时自动生成
  createdAt: Date
  credits?: number
  emailVerified?: boolean
  phoneVerified?: boolean     // 新增：手机验证状态
  authMethod?: 'email' | 'phone' | 'both'  // 新增：认证方式标识
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  name: string
}

export interface PhoneLoginCredentials {
  phone: string
  verificationCode: string
}

export interface PhoneSignUpCredentials {
  phone: string
  verificationCode: string
  invitationCode?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export interface UpdateProfileData {
  name: string
  email: string
}

export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@quickimage.ai',
    name: '演示用户',
    createdAt: new Date('2024-01-01'),
    credits: 277,
    emailVerified: true,
    authMethod: 'email'
  },
  {
    id: '2',
    email: 'test@example.com',
    name: '测试用户',
    createdAt: new Date('2024-01-15'),
    credits: 150,
    emailVerified: false,
    authMethod: 'email'
  },
  {
    id: '3',
    phone: '+8613800138000',
    name: '手机用户',
    createdAt: new Date('2024-01-20'),
    credits: 100,
    phoneVerified: true,
    authMethod: 'phone'
  }
]

const MOCK_PASSWORDS: Record<string, string> = {
  'demo@quickimage.ai': 'password123',
  'test@example.com': 'test123'
}

const AUTH_STORAGE_KEY = 'quickimage_auth_user'

class AuthService {
  private currentUser: User | null = null

  constructor() {
    this.migrateUserData()
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        this.currentUser = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error)
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  private saveUserToStorage(user: User): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } catch (error) {
      console.error('Failed to save user to storage:', error)
    }
  }

  private clearUserFromStorage(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { email, password } = credentials
    
    if (!email || !password) {
      return { success: false, error: '请输入邮箱和密码' }
    }

    const expectedPassword = MOCK_PASSWORDS[email]
    if (!expectedPassword) {
      return { success: false, error: '用户不存在' }
    }

    if (password !== expectedPassword) {
      return { success: false, error: '密码错误' }
    }

    const user = MOCK_USERS.find(u => u.email === email)
    if (!user) {
      return { success: false, error: '用户数据错误' }
    }

    this.currentUser = user
    this.saveUserToStorage(user)
    
    return { success: true, user }
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1200))

    const { email, password, name } = credentials

    if (!email || !password || !name) {
      return { success: false, error: '请填写所有必填字段' }
    }

    if (!this.isValidEmail(email)) {
      return { success: false, error: '请输入有效的邮箱地址' }
    }

    if (password.length < 6) {
      return { success: false, error: '密码至少需要6位字符' }
    }

    if (MOCK_USERS.some(u => u.email === email)) {
      return { success: false, error: '该邮箱已被注册' }
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date(),
      credits: 50, // New users get 50 credits
      emailVerified: false // New users need to verify email
    }

    MOCK_USERS.push(newUser)
    MOCK_PASSWORDS[email] = password
    
    this.currentUser = newUser
    this.saveUserToStorage(newUser)

    return { success: true, user: newUser }
  }

  logout(): void {
    this.currentUser = null
    this.clearUserFromStorage()
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  async updateProfile(data: UpdateProfileData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!this.currentUser) {
      return { success: false, error: '用户未登录' }
    }

    const { name, email } = data

    if (!name || !email) {
      return { success: false, error: '请填写所有必填字段' }
    }

    if (!this.isValidEmail(email)) {
      return { success: false, error: '请输入有效的邮箱地址' }
    }

    // Check if email is already taken by another user
    const existingUser = MOCK_USERS.find(u => u.email === email && u.id !== this.currentUser!.id)
    if (existingUser) {
      return { success: false, error: '该邮箱已被其他用户使用' }
    }

    // Update user data
    const userIndex = MOCK_USERS.findIndex(u => u.id === this.currentUser!.id)
    if (userIndex !== -1 && MOCK_USERS[userIndex]) {
      const currentUserData = MOCK_USERS[userIndex]
      const updatedUser: User = {
        id: currentUserData.id,
        name,
        email,
        createdAt: currentUserData.createdAt,
        credits: currentUserData.credits
      }
      MOCK_USERS[userIndex] = updatedUser
      this.currentUser = updatedUser
      this.saveUserToStorage(updatedUser)
      
      return { success: true, user: updatedUser }
    }

    return { success: false, error: '用户数据更新失败' }
  }

  async updatePassword(data: UpdatePasswordData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (!this.currentUser) {
      return { success: false, error: '用户未登录' }
    }

    // 手机号用户无密码，不能修改密码
    if (!this.currentUser.email) {
      return { success: false, error: '手机号用户无密码，无需修改' }
    }

    const { currentPassword, newPassword } = data

    if (!currentPassword || !newPassword) {
      return { success: false, error: '请填写所有必填字段' }
    }

    if (newPassword.length < 6) {
      return { success: false, error: '新密码至少需要6位字符' }
    }

    // Check current password
    const expectedPassword = MOCK_PASSWORDS[this.currentUser.email]
    if (!expectedPassword || currentPassword !== expectedPassword) {
      return { success: false, error: '当前密码错误' }
    }

    // Update password
    MOCK_PASSWORDS[this.currentUser.email] = newPassword

    return { success: true, user: this.currentUser }
  }

  async addCredits(userId: string, credits: number): Promise<void> {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId)
    if (userIndex !== -1 && MOCK_USERS[userIndex]) {
      MOCK_USERS[userIndex].credits = (MOCK_USERS[userIndex].credits || 0) + credits
      
      // Update current user if it's the same user
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser.credits = MOCK_USERS[userIndex].credits
        this.saveUserToStorage(this.currentUser)
      }
    }
  }

  async sendVerificationEmail(userId: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (!this.currentUser || this.currentUser.id !== userId) {
      return { success: false, error: '用户未登录' }
    }

    if (this.currentUser.emailVerified) {
      return { success: false, error: '邮箱已经验证过了' }
    }

    // 模拟发送验证邮件
    console.log(`发送验证邮件到: ${this.currentUser.email}`)
    
    return { success: true, user: this.currentUser }
  }

  async verifyEmail(userId: string, verificationCode: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!this.currentUser || this.currentUser.id !== userId) {
      return { success: false, error: '用户未登录' }
    }

    if (this.currentUser.emailVerified) {
      return { success: false, error: '邮箱已经验证过了' }
    }

    // 模拟验证码验证（实际应用中应该验证真实的验证码）
    if (verificationCode !== '123456') {
      return { success: false, error: '验证码错误' }
    }

    // 更新用户验证状态
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId)
    if (userIndex !== -1 && MOCK_USERS[userIndex]) {
      MOCK_USERS[userIndex].emailVerified = true
      MOCK_USERS[userIndex].credits = (MOCK_USERS[userIndex].credits || 0) + 30 // 验证邮箱奖励30积分
      
      this.currentUser = MOCK_USERS[userIndex]
      this.saveUserToStorage(this.currentUser)
      
      return { success: true, user: this.currentUser }
    }

    return { success: false, error: '用户数据更新失败' }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * 数据迁移：为旧用户添加新字段
   */
  private migrateUserData(): void {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const user = JSON.parse(stored) as User

        // 添加缺失的字段
        let needsUpdate = false

        if (user.authMethod === undefined) {
          user.authMethod = user.email ? 'email' : 'phone'
          needsUpdate = true
        }

        if (user.emailVerified === undefined && user.email) {
          user.emailVerified = false
          needsUpdate = true
        }

        if (user.phoneVerified === undefined && user.phone) {
          user.phoneVerified = false
          needsUpdate = true
        }

        if (needsUpdate) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
        }
      }
    } catch (error) {
      console.error('数据迁移失败:', error)
    }
  }

  /**
   * 手机号登录
   */
  async loginWithPhone(credentials: PhoneLoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { phone, verificationCode } = credentials

    if (!phone || !verificationCode) {
      return { success: false, error: '请输入手机号和验证码' }
    }

    // 验证验证码
    const verifyResult = await verificationService.verifyCode(phone, verificationCode)
    if (!verifyResult.success) {
      return { success: false, error: verifyResult.error }
    }

    // 查找用户
    const normalizedPhone = verificationService.formatPhone(phone)
    const user = MOCK_USERS.find(u => u.phone === normalizedPhone)

    if (!user) {
      return { success: false, error: '该手机号未注册' }
    }

    this.currentUser = user
    this.saveUserToStorage(user)

    return { success: true, user }
  }

  /**
   * 手机号注册
   */
  async signUpWithPhone(credentials: PhoneSignUpCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1200))

    const { phone, verificationCode } = credentials

    if (!phone || !verificationCode) {
      return { success: false, error: '请输入手机号和验证码' }
    }

    // 验证验证码
    const verifyResult = await verificationService.verifyCode(phone, verificationCode)
    if (!verifyResult.success) {
      return { success: false, error: verifyResult.error }
    }

    const normalizedPhone = verificationService.formatPhone(phone)

    // 检查手机号是否已注册
    if (MOCK_USERS.some(u => u.phone === normalizedPhone)) {
      return { success: false, error: '该手机号已被注册' }
    }

    // 自动生成用户名（手机号后4位）
    const phoneSuffix = phone.slice(-4)
    const defaultName = `用户${phoneSuffix}`

    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      phone: normalizedPhone,
      name: defaultName,
      createdAt: new Date(),
      credits: 50,              // 新用户50积分
      phoneVerified: true,      // 注册时已验证
      authMethod: 'phone'
    }

    MOCK_USERS.push(newUser)
    this.currentUser = newUser
    this.saveUserToStorage(newUser)

    return { success: true, user: newUser }
  }

  /**
   * 绑定手机号
   */
  async bindPhone(userId: string, phone: string, verificationCode: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!this.currentUser || this.currentUser.id !== userId) {
      return { success: false, error: '用户未登录' }
    }

    // 验证验证码
    const verifyResult = await verificationService.verifyCode(phone, verificationCode)
    if (!verifyResult.success) {
      return { success: false, error: verifyResult.error }
    }

    const normalizedPhone = verificationService.formatPhone(phone)

    // 检查手机号是否被其他用户使用
    const existingUser = MOCK_USERS.find(u => u.phone === normalizedPhone && u.id !== userId)
    if (existingUser) {
      return { success: false, error: '该手机号已被其他用户绑定' }
    }

    // 更新用户信息
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId)
    if (userIndex !== -1 && MOCK_USERS[userIndex]) {
      MOCK_USERS[userIndex].phone = normalizedPhone
      MOCK_USERS[userIndex].phoneVerified = true
      MOCK_USERS[userIndex].authMethod = MOCK_USERS[userIndex].email ? 'both' : 'phone'

      this.currentUser = MOCK_USERS[userIndex]
      this.saveUserToStorage(this.currentUser)

      // 绑定手机号奖励20积分
      await this.addCredits(userId, 20)

      return { success: true, user: this.currentUser }
    }

    return { success: false, error: '绑定失败' }
  }
}

export const authService = new AuthService()