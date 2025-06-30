'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, Selector } from 'antd-mobile'
import supabase from '@/lib/supabase/client'
import { positionOptions } from '@/const'
import { backgroundColor } from '@/const/style'

interface SignupForm {
  nickname: string
  position: string
}

export default function SignupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<number>(1)

  // 如果用户未登录，重定向到登录页
  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.replace('/')
    }
  }, [session, status, router])

  // 如果还在加载，显示加载状态
  if (status === 'loading') {
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
            background: ${backgroundColor};
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

  // 如果未登录，不渲染内容
  if (!session) {
    return null
  }

  const handleSubmit = async (values: SignupForm) => {
    if (!selectedPosition) {
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('user')
        .insert([
          {
            user_custom_id: session.user?.email,
            nickname: values.nickname,
            position: selectedPosition,
          }
        ])
        .select()

      if (error) {
        throw new Error(error.message || '注册失败')
      }

      // 模拟 API 响应格式以保持兼容性
      const response = {
        ok: true,
        json: async () => ({ success: true, data })
      }

      if (!response.ok) {
        throw new Error('注册失败')
      }

      const result = await response.json()

      if (result.success) {
        // 跳转到主页
        setTimeout(() => {
          router.replace('/home')
        }, 1000)
      } else {
        throw new Error('注册失败')
      }
    } catch (error) {
      console.error('注册错误:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="welcome-section">
          <h1>欢迎加入 WeFoosball!</h1>
          <p>请设置您的游戏昵称</p>
        </div>

        <div className="user-info">
          <div className="avatar">
            {session.user?.image && (
              <img src={session.user.image} alt="头像" />
            )}
          </div>
          <div className="user-details">
            <p className="user-name">{session.user?.name}</p>
            <p className="user-email">{session.user?.email}</p>
          </div>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="signup-form"
        >
          <Form.Item
            name="nickname"
            label="游戏昵称"
            rules={[
              { required: true, message: '请输入昵称' },
              { min: 2, message: '昵称至少2个字符' },
              { max: 20, message: '昵称最多20个字符' },
              {
                pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/,
                message: '昵称只能包含字母、数字、中文、下划线和连字符'
              }
            ]}
          >
            <Input
              placeholder="请输入您的游戏昵称"
              maxLength={20}
            />
          </Form.Item>

          <Form.Item
            name="position"
            label="场上位置"
            rules={[
              { required: true, message: '请选择您的场上位置' }
            ]}
          >
            <Selector
              options={positionOptions}
              columns={3}
              defaultValue={[]}
              onChange={(arr) => setSelectedPosition(arr[0] || 3)}
              style={{
                '--border-radius': '8px',
                '--checked-color': '#1677ff',
                '--checked-text-color': '#fff',
              }}
            />
          </Form.Item>
        </Form>

        <div className="submit-button-container">
          <Button
            block
            type="submit"
            color="primary"
            size="large"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={() => {
              form.validateFields().then(handleSubmit)
            }}
          >
            {isSubmitting ? '注册中...' : '完成注册'}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .signup-container {
          padding: 20px;
          padding-top: calc(20px + env(safe-area-inset-top));
          padding-bottom: calc(50px + env(safe-area-inset-bottom));
          box-sizing: border-box;
          background: #f7fcff;
          justify-content: center;
          display: flex;
          flex: 1;
          height: 100%;
        }

        .signup-content {
          background: white;
          padding: 40px 30px;
          padding-bottom: calc(40px + 48px + 20px); /* 为底部按钮预留空间 */
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          max-height: calc(100vh - 40px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .welcome-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .welcome-section h1 {
          font-size: 1.8rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }

        .welcome-section p {
          color: #666;
          font-size: 14px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background-color: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .avatar img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
          font-size: 16px;
        }

        .user-email {
          color: #666;
          margin: 0;
          font-size: 14px;
        }

        .signup-form {
          flex: 1;
        }

        .submit-button-container {
          position: absolute;
          bottom: 48px;
          left: 30px;
          right: 30px;
          background: white;
          padding-top: 20px;
        }
      `}</style>
    </div>
  )
} 