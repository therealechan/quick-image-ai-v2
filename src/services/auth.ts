export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  credits?: number
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
    credits: 277
  },
  {
    id: '2',
    email: 'test@example.com',
    name: '测试用户',
    createdAt: new Date('2024-01-15'),
    credits: 150
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
      credits: 50 // New users get 50 credits
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

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

export const authService = new AuthService()