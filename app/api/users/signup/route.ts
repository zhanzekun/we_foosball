import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

interface SignupRequest {
  email: string
  name: string
  nickname: string
  image?: string
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

    const body: SignupRequest = await request.json()
    const { email, name, nickname, image } = body

    // 验证请求数据
    if (!email || !name || !nickname) {
      return NextResponse.json(
        { success: false, message: '缺少必要信息' },
        { status: 400 }
      )
    }

    // 验证昵称格式
    if (nickname.length < 2 || nickname.length > 20) {
      return NextResponse.json(
        { success: false, message: '昵称长度必须在2-20个字符之间' },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/.test(nickname)) {
      return NextResponse.json(
        { success: false, message: '昵称只能包含字母、数字、中文、下划线和连字符' },
        { status: 400 }
      )
    }

    // 检查用户是否已经注册
    // 这里应该查询数据库，现在用模拟数据
    const existingUser = await checkUserExists(email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '用户已注册' },
        { status: 409 }
      )
    }

    // 检查昵称是否已被使用
    const existingNickname = await checkNicknameExists(nickname)
    if (existingNickname) {
      return NextResponse.json(
        { success: false, message: '昵称已被使用' },
        { status: 409 }
      )
    }

    // 保存用户信息到数据库
    const user = await saveUser({
      email,
      name,
      nickname,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: '注册成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        image: user.image,
      },
    })
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}

// 模拟数据库操作
async function checkUserExists(email: string): Promise<boolean> {
  // 这里应该查询数据库
  // 现在返回 false 表示用户不存在
  return false
}

async function checkNicknameExists(nickname: string): Promise<boolean> {
  // 这里应该查询数据库
  // 现在返回 false 表示昵称可用
  return false
}

async function saveUser(userData: any) {
  // 这里应该保存到数据库
  // 现在返回模拟数据
  return {
    id: Date.now(),
    ...userData,
  }
} 