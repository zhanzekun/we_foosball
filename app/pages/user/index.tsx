'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, List, Avatar, Button, Toast } from 'antd-mobile'
import supabase from '@/lib/supabase/client'
import { signOut } from 'next-auth/react'

interface UserInfo {
  user_custom_id: string
  nickname: string
  created_at: string
}

export default function UserPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/')
      return
    }

    fetchUserInfo()
  }, [session, status, router])

  const fetchUserInfo = async () => {
    if (!session?.user?.email) return

    try {
      const { data, error } = await supabase
        .from('user')
        .select('user_custom_id, nickname, created_at')
        .eq('user_custom_id', session.user.email)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      setUserInfo(data)
    } catch (error) {
      console.error('获取用户信息失败:', error)
      Toast.show({
        content: '获取用户信息失败',
        position: 'center',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('退出登录失败:', error)
      Toast.show({
        content: '退出登录失败',
        position: 'center',
      })
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
        
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!session || !userInfo) {
    return null
  }

  return (
    <div className="user-page">
      <div className="user-header">
        <h1>个人中心</h1>
      </div>

      <div className="user-content">
        <Card>
          <List header="用户信息">
            <List.Item
              prefix={<Avatar src={session?.user?.image || ''} />}
              title={userInfo?.nickname || '未设置昵称'}
              description={session?.user?.email}
            />
          </List>
        </Card>

        <div className="user-actions">
          <Button
            block
            color="danger"
            size="large"
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </div>
      </div>

      <style jsx>{`
        .user-page {
          min-height: 100vh;
          background-color: #f7fcff;
          padding: 20px;
        }

        .user-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .user-header h1 {
          color: white;
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }

        .user-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .user-actions {
          margin-top: 30px;
          padding: 0 16px;
        }
      `}</style>
    </div>
  )
}
