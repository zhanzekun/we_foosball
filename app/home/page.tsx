'use client'

import React, { useState } from 'react'
import type { FC } from 'react'
import { SafeArea, TabBar } from 'antd-mobile'
import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import Match from '../pages/match/page'
import ProtectedRoute from '../components/ProtectedRoute'
import UserPage from '../pages/user'
import TodoPage from '../pages/todo/todo'

enum TabType {
  MATCH = 'match',
  DATA = 'data',
  RANK = 'rank',
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
      key: TabType.DATA,
      title: '数据',
      icon: <UnorderedListOutline />,
    },
    {
      key: TabType.RANK,
      title: '排行',
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

  const handleTabChange = (key: TabType) => {
    setActiveTab(key)
  }

  const renderContent = () => {
    switch (activeTab) {
      case TabType.MATCH:
        return <Match />
      case TabType.DATA:
        return <Todo />
      case TabType.RANK:
        return <Todo />
      case TabType.ME:
        return <UserPage />
      default:
        return <Match />
    }
  }

  return (
    <div className="app">
      <div>
        <SafeArea position='top' />
      </div>
      <div className="body">
        {renderContent()}
      </div>
      <div className="bottom">
        <Bottom activeKey={activeTab} onTabChange={handleTabChange} />
        <SafeArea position='bottom' />
      </div>

      <style jsx>{`
        .app {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 50px);
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
  return <TodoPage />
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