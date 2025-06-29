'use client'

import React, { useState, useEffect } from 'react'
import type { FC } from 'react'
import { NavBar, TabBar } from 'antd-mobile'
import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import Match from '../pages/match/page'
import ProtectedRoute from '../components/ProtectedRoute'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase/client'
import UserPage from '../pages/user'

enum TabType {
  MATCH = 'match',
  TODO = 'todo',
  MESSAGE = 'message',
  ME = 'me'
}

const Bottom: FC<{ activeKey: TabType; onTabChange: (key: TabType) => void }> = ({ 
  activeKey, 
  onTabChange 
}) => {
  const tabs = [
    {
      key: TabType.MATCH,
      title: '匹配',
      icon: <AppOutline />,
    },
    {
      key: TabType.TODO,
      title: '待办',
      icon: <UnorderedListOutline />,
    },
    {
      key: TabType.MESSAGE,
      title: '消息',
      icon: <MessageOutline />,
    },
    {
      key: TabType.ME,
      title: '我的',
      icon: <UserOutline />,
    },
  ]

  return (
    <TabBar activeKey={activeKey} onChange={value => onTabChange(value as TabType)}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}

function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.MATCH)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [checkingUser, setCheckingUser] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/') // 跳转到登录页
      return
    }
    const checkUserExists = async () => {
      if (!session?.user?.email) return
      
      // 查询 user 表，使用 email 作为唯一标识
      const { data, error } = await supabase
        .from('user')
        .select('user_custom_id')
        .eq('user_custom_id', session.user.email)
        .maybeSingle()

      console.log('supabase data', data)
      if (!data) {
        // 未注册，跳转到注册页
        router.push('/signup')
      } else {
        setCheckingUser(false)
      }
    }
    checkUserExists()
  }, [session, status, router])

  if (status === 'loading' || checkingUser) {
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

  const handleTabChange = (key: TabType) => {
    setActiveTab(key)
  }

  const renderContent = () => {
    switch (activeTab) {
      case TabType.MATCH:
        return <Match />
      case TabType.TODO:
        return <Todo />
      case TabType.MESSAGE:
        return <Message />
      case TabType.ME:
        return <UserPage />
      default:
        return <Match />
    }
  }

  return (
    <div className="app">
      <div className="body">
        {renderContent()}
      </div>
      <div className="bottom">
        <Bottom activeKey={activeTab} onTabChange={handleTabChange} />
      </div>
      
      <style jsx>{`
        .app {
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .bottom {
          flex: 0 0 auto;
          border-top: solid 1px var(--adm-color-border);
          background-color: #fff;
          z-index: 1000;
        }
      `}</style>
    </div>
  )
}

function Todo() {
  return <div>待办</div>
}

function Message() {
  return <div>消息</div>
}

function PersonalCenter() {
  return <div>我的</div>
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  )
}