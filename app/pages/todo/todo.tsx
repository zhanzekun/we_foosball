'use client'

import React from 'react'
import { Card } from 'antd-mobile'
import { LoopOutline } from 'antd-mobile-icons'

export default function TodoPage() {
  return (
    <div className="todo-container">
      <div className="construction-content">
        <div className="construction-icon">
          <LoopOutline style={{ fontSize: '64px', color: '#ffa500' }} />
        </div>
        <h2 className="construction-title">施工中</h2>
        <p className="construction-description">
          此功能正在开发中，敬请期待...
        </p>
        <div className="construction-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <span className="progress-text">开发进度: 25%</span>
        </div>
      </div>

      <style jsx>{`
        .todo-container {
          padding: 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .construction-content {
          text-align: center;
          background: white;
          padding: 40px 30px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
        }

        .construction-icon {
          margin-bottom: 24px;
          animation: bounce 2s infinite;
        }

        .construction-title {
          font-size: 1.8rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 16px;
        }

        .construction-description {
          color: #666;
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 32px;
        }

        .construction-progress {
          margin-top: 24px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .progress-fill {
          height: 100%;
          width: 25%;
          background: linear-gradient(90deg, #ffa500, #ff8c00);
          border-radius: 4px;
          animation: progress 2s ease-in-out infinite;
        }

        .progress-text {
          font-size: 14px;
          color: #888;
          font-weight: 500;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes progress {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}
