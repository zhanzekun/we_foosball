'use client'

import React from 'react'
import { Avatar, Button } from 'antd-mobile'
import useUserStore from '@/store/user'
import { useSession } from 'next-auth/react'

interface UserInfoDisplayProps {
  showEmail?: boolean
  showAvatar?: boolean
  compact?: boolean
}

export default function UserInfoDisplay({ 
  showEmail = true, 
  showAvatar = true, 
  compact = false 
}: UserInfoDisplayProps) {
  const { userInfo, isLoading } = useUserStore()
  const { data: session } = useSession()

  if (isLoading) {
    return (
      <div className="user-info-loading">
        <div className="loading-dot"></div>
        <span>加载中...</span>
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className="user-info-empty">
        <span>未登录</span>
      </div>
    )
  }

  return (
    <div className={`user-info-display ${compact ? 'compact' : ''}`}>
      {showAvatar && (
        <Avatar 
          src={userInfo.image || ''} 
          style={{ 
            '--size': compact ? '24px' : '32px',
            marginRight: compact ? '8px' : '12px'
          }}
        />
      )}
      <div className="user-info-content">
        <div className="user-name">
          {userInfo.nickname || '未设置昵称'}
        </div>
        {showEmail && userInfo.email && (
          <div className="user-email">
            {userInfo.email}
          </div>
        )}
      </div>
    </div>
  )
} 