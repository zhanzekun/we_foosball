'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, List, Avatar, Button, Form, Input, Selector, Modal } from 'antd-mobile'
import supabase from '@/lib/supabase/client'
import { signOut } from 'next-auth/react'
import useUserStore from '@/store/user'
import { UserInfo } from '@/types'
import { POSITION_INDEX, positionOptions } from '@/const'
import { backgroundColor } from '@/const/style'

interface EditForm {
  nickname: string
  position: number
}

export default function UserPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { userInfo, isLoading, setUserInfo, setLoading, clearUserInfo } = useUserStore()
  const [showEditModal, setShowEditModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<POSITION_INDEX>(POSITION_INDEX.ALL_ROUNDER)
  const [editForm] = Form.useForm()

  useEffect(() => {
    console.log('fetchUserInfo in useEffect', session, status)
    if (status === 'loading') return

    if (!session) {
      router.replace('/')
      return
    }

    // 如果 store 中已有用户信息且邮箱匹配,且有position，直接使用
    if (userInfo && userInfo.user_custom_id === session.user?.email && userInfo.position) {
      console.log('userInfo  match cache')
      setLoading(false)
      return
    }

    fetchUserInfo()
  }, [session, status, router, userInfo, setUserInfo, setLoading])

  const fetchUserInfo = async () => {
    console.log('fetchUserInfo', session)
    if (!session?.user?.email) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user')
        .select('user_custom_id, nickname, position, created_at')
        .eq('user_custom_id', session.user.email)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // 合并 session 中的邮箱和头像信息
      const userInfoWithSession: UserInfo = {
        ...data,
        email: session.user.email,
        image: session.user.image || undefined
      }

      setUserInfo(userInfoWithSession)
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      await signOut()
      clearUserInfo() // 清除缓存的用户信息
      router.replace('/')
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  const handleEditProfile = () => {
    setShowEditModal(true)
  }

  const handleSubmitEdit = async (values: EditForm) => {
    if (!selectedPosition) {
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('user')
        .update({
          nickname: values.nickname,
          position: selectedPosition,
        })
        .eq('user_custom_id', session?.user?.email)
        .select()

      if (error) {
        throw new Error(error.message || '更新失败')
      }

      // 更新本地状态
      if (userInfo) {
        const updatedUserInfo: UserInfo = {
          ...userInfo,
          nickname: values.nickname,
          position: selectedPosition,
        }
        setUserInfo(updatedUserInfo)
      }

      setShowEditModal(false)
    } catch (error) {
      console.error('更新错误:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePositionChange = (arr: POSITION_INDEX[]) => {
    setSelectedPosition(arr[0] || POSITION_INDEX.ALL_ROUNDER)
  }

  const getPositionLabel = (position: POSITION_INDEX) => {
    const option = positionOptions.find(opt => opt.value === position)
    return option ? option.label : '未知'
  }

  if (status === 'loading' || isLoading) {
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
              prefix={<Avatar src={userInfo.image || ''} />}
              title={userInfo?.nickname || '未设置昵称'}
              description={userInfo?.email}
            />
            <List.Item
              title="场上位置"
              description={getPositionLabel(userInfo.position || 1)}
            />
          </List>
        </Card>

        <div className="user-actions">
          <Button
            block
            color="primary"
            size="large"
            onClick={handleEditProfile}
            style={{ marginBottom: 16 }}
          >
            修改个人信息
          </Button>
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

      {/* 修改个人信息弹窗 */}
      <Modal
        visible={showEditModal}
        title="修改个人信息"
        content={
          <div className="edit-form-container">
            <Form
              form={editForm}
              onFinish={handleSubmitEdit}
              layout="vertical"
              className="edit-form"
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
                  defaultValue={[POSITION_INDEX.ALL_ROUNDER]}
                  onChange={handlePositionChange}
                  style={{
                    '--border-radius': '8px',
                    '--checked-color': '#1677ff',
                    '--checked-text-color': '#fff',
                  }}
                />
              </Form.Item>
            </Form>
          </div>
        }
        closeOnAction
        onClose={() => setShowEditModal(false)}
        actions={[
          {
            key: 'confirm',
            text: isSubmitting ? '保存中...' : '保存',
            primary: true,
            onClick: () => {
              editForm.validateFields().then(handleSubmitEdit)
            }
          },
          {
            key: 'cancel',
            text: '取消',
            onClick: () => setShowEditModal(false)
          },
        ]}
      />

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
          color: #333;
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

        .edit-form-container {
          padding: 20px 0;
        }

        .edit-form {
          width: 100%;
        }
      `}</style>
    </div>
  )
}
