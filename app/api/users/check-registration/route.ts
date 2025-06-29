import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

interface CheckRegistrationRequest {
  email: string
}

export async function POST(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: '未授权访问' },
        { status: 401 }
      )
    }

    const body: CheckRegistrationRequest = await request.json()
    const { email } = body

    // 验证请求数据
    if (!email) {
      return NextResponse.json(
        { success: false, message: '缺少邮箱信息' },
        { status: 400 }
      )
    }

    // 检查用户是否已注册
    const isRegistered = await checkUserExists(email)

    return NextResponse.json({
      success: true,
      isRegistered,
      message: isRegistered ? '用户已注册' : '用户未注册',
    })
  } catch (error) {
    console.error('检查用户注册状态错误:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}

// 模拟数据库操作
async function checkUserExists(email: string): Promise<boolean> {
  // 这里应该查询数据库
  // 现在返回 false 表示用户不存在（需要注册）
  return false
} 