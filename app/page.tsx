'use client'

import { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from 'antd-mobile'

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/home')
    }
  }, [session, status, router])

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/home' })
  }

  const handleGithubLogin = () => {
    signIn('github', { callbackUrl: '/home' })
  }

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    )
  }

  if (status === 'authenticated') {
    return null // 正在跳转中
  }

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">WeFoosball!</h1>
        
        <div className="login-buttons">
          <Button
            block
            color="primary"
            size="large"
            onClick={handleGoogleLogin}
            className="login-button google-button"
          >
            使用 Google 登录
          </Button>
          
          <Button
            block
            color="default"
            size="large"
            onClick={handleGithubLogin}
            className="login-button github-button"
          >
            使用 GitHub 登录
          </Button>
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .welcome-content {
          background: white;
          padding: 40px 30px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        .welcome-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 40px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .login-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .login-button {
          height: 48px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
        }

        .google-button {
          background: #4285f4;
          border-color: #4285f4;
        }

        .github-button {
          background: #24292e;
          border-color: #24292e;
          color: white;
        }

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
