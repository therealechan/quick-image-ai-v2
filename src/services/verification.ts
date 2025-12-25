/**
 * 验证码服务 - Mock实现
 * 用于手机号码验证码的生成和验证
 */

export interface VerificationResult {
  success: boolean
  error?: string
}

class VerificationCodeService {
  private codes: Map<string, { code: string; expiry: number }> = new Map()
  private readonly MOCK_CODE = '123456' // Mock验证码
  private readonly CODE_EXPIRY = 5 * 60 * 1000 // 5分钟有效期

  /**
   * 发送验证码到指定手机号
   * @param phone 手机号码
   * @returns 发送结果
   */
  async sendVerificationCode(phone: string): Promise<VerificationResult> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 验证手机号格式
    if (!this.isValidPhone(phone)) {
      return { success: false, error: '手机号格式不正确' }
    }

    // 格式化手机号
    const normalizedPhone = this.formatPhone(phone)

    // 存储验证码和过期时间
    this.codes.set(normalizedPhone, {
      code: this.MOCK_CODE,
      expiry: Date.now() + this.CODE_EXPIRY
    })

    // 开发环境输出日志
    console.log(`[Mock] 发送验证码 ${this.MOCK_CODE} 到 ${normalizedPhone}`)

    return { success: true }
  }

  /**
   * 验证验证码
   * @param phone 手机号码
   * @param code 验证码
   * @returns 验证结果
   */
  async verifyCode(phone: string, code: string): Promise<VerificationResult> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    const normalizedPhone = this.formatPhone(phone)
    const stored = this.codes.get(normalizedPhone)

    if (!stored) {
      return { success: false, error: '请先获取验证码' }
    }

    // 检查是否过期
    if (Date.now() > stored.expiry) {
      this.codes.delete(normalizedPhone)
      return { success: false, error: '验证码已过期，请重新获取' }
    }

    // 验证码校验
    if (code !== stored.code) {
      return { success: false, error: '验证码错误' }
    }

    // 验证成功后清除验证码
    this.codes.delete(normalizedPhone)
    return { success: true }
  }

  /**
   * 验证手机号格式
   * @param phone 手机号码
   * @returns 是否有效
   */
  isValidPhone(phone: string): boolean {
    // 支持中国大陆手机号格式：
    // - +86开头 + 11位数字
    // - 86开头 + 11位数字
    // - 1开头 + 10位数字（共11位）
    const cleanPhone = phone.replace(/\s+/g, '') // 移除空格
    return /^(\+?86)?1[3-9]\d{9}$/.test(cleanPhone)
  }

  /**
   * 格式化手机号为统一格式
   * @param phone 手机号码
   * @returns 格式化后的手机号 (+86xxxxxxxxxx)
   */
  formatPhone(phone: string): string {
    // 移除空格
    let cleanPhone = phone.replace(/\s+/g, '')

    // 已经是+86格式
    if (cleanPhone.startsWith('+86')) {
      return cleanPhone
    }

    // 86开头，添加+
    if (cleanPhone.startsWith('86')) {
      return `+${cleanPhone}`
    }

    // 1开头的11位手机号，添加+86
    if (cleanPhone.startsWith('1') && cleanPhone.length === 11) {
      return `+86${cleanPhone}`
    }

    return cleanPhone
  }

  /**
   * 手机号脱敏显示
   * @param phone 手机号码
   * @returns 脱敏后的手机号 (+86 138****1234)
   */
  maskPhone(phone: string): string {
    const normalized = this.formatPhone(phone)

    // +86xxxxxxxxxx -> +86 xxx****xxxx
    if (normalized.startsWith('+86') && normalized.length === 14) {
      const prefix = normalized.substring(0, 6) // +86 + 前3位
      const suffix = normalized.substring(10) // 后4位
      return `${prefix}****${suffix}`
    }

    return phone
  }
}

export const verificationService = new VerificationCodeService()
