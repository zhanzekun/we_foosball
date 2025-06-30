import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: '未授权访问' }, { status: 401 })
    }

    const { nickname } = await request.json()

    if (!nickname || nickname.trim().length === 0) {
      return NextResponse.json({ success: false, message: '昵称不能为空' }, { status: 400 })
    }

    if (nickname.length > 20) {
      return NextResponse.json({ success: false, message: '昵称长度不能超过20个字符' }, { status: 400 })
    }

    const supabase = await createClient()

    // 更新用户信息
    const { error } = await supabase
      .from('user')
      .update({ nickname: nickname.trim() })
      .eq('user_custom_id', session.user.email)

    if (error) {
      console.error('更新用户信息失败:', error)
      return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: '更新成功',
      data: { nickname: nickname.trim() }
    })

  } catch (error) {
    console.error('更新用户信息异常:', error)
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
} 