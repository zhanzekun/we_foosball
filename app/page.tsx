'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from 'antd-mobile'
import supabase from '@/lib/supabase/client'
import Image from 'next/image'

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session) {
      checkUserRegistration()
    }
  }, [session, status])

  const checkUserRegistration = async () => {
    if (!session?.user?.email) return

    console.log('checkUserRegistration', session)

    setIsCheckingRegistration(true)

    try {
      // 检查用户是否已注册
      const { data, error } = await supabase
        .from('user')
        .select('user_custom_id')
        .eq('user_custom_id', session.user.email)
        .maybeSingle()

      if (error) {
        alert(error.message || '检查用户状态失败')
        throw new Error(error.message || '检查用户状态失败')
      }

      const isRegistered = !!data

      if (isRegistered) {
        // 用户已注册，跳转到主页
        router.replace('/home')
      } else {
        // 用户未注册，跳转到注册页面
        router.replace('/signup')
      }
    } catch (error) {
      console.error('检查用户注册状态失败:', error)
      // 出错时默认跳转到注册页面
      router.replace('/signup')
    } finally {
      setIsCheckingRegistration(false)
    }
  }

  const handleGoogleLogin = () => {
    signIn('google')
  }

  const handleGithubLogin = () => {
    signIn('github')
  }

  if (status === 'loading' || isCheckingRegistration) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{isCheckingRegistration ? '检查用户信息...' : '加载中...'}</p>
      </div>
    )
  }

  if (status === 'authenticated') {
    return null // 正在跳转中
  }

  return (
    <div className="welcome-root">
      <div className="welcome-main">
        <img
          src="/big_logo.svg"
          alt="WeFoosball Logo"
          className="welcome-big-logo"
        />
        <div className="welcome-logo-block">
          <img src="/logo.svg" alt="logo" className="welcome-logo-icon" />
          <div className="welcome-title">WeFoosball</div>
        </div>
        <div className="welcome-subtitle">WXG 桌上足球协会</div>
        <div className="welcome-version">构建号: {process.env.NEXT_PUBLIC_BUILD_ID}</div>
      </div>
      <div className="welcome-login-bottom">
        <div className="welcome-login-row">
          <button className="login-btn google" onClick={handleGoogleLogin}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" style={{ marginRight: 8 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google
          </button>
          <button className="login-btn github" onClick={handleGithubLogin}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.652 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.38.202 2.398.1 2.652.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.421-.012 2.751 0 .267.18.577.688.48C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" fill="#fff" /><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.652 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.38.202 2.398.1 2.652.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.421-.012 2.751 0 .267.18.577.688.48C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" fill="#24292e" /></svg>
            Github
          </button>
        </div>
      </div>
      <style jsx>{`
        .welcome-root {
          min-height: 100vh;
          background: #f7fcff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }
        .welcome-main {
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 40px;
        }
        .welcome-big-logo {
          width: 90vw;
          max-width: 380px;
          margin-bottom: 32px;
          display: block;
        }
        .welcome-logo-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 8px;
        }
        .welcome-logo-icon {
          width: 56px;
          height: 56px;
          margin-bottom: 8px;
        }
        .welcome-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #223;
          letter-spacing: 0.01em;
        }
        .welcome-subtitle {
          color: #6b7a90;
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
        .welcome-login-bottom {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 32px 16px 24px 16px;
        }
        .welcome-login-row {
          display: flex;
          flex-direction: row;
          gap: 16px;
          max-width: 420px;
          margin: 0 auto 12px auto;
        }
        .login-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          background: #fff;
          cursor: pointer;
          transition: box-shadow 0.18s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 4px 16px rgba(66,133,244,0.10), 0 1.5px 4px rgba(0,0,0,0.04);
          will-change: box-shadow, transform;
        }
        .login-btn.google {
          border-color: #4285f4;
          color: #4285f4;
          background: #fff;
        }
        .login-btn.github {
          border-color: #4285f4;
          color: #4285f4;
          background: #fff;
        }
        .login-btn:active {
          box-shadow: 0 8px 24px rgba(66,133,244,0.16), 0 2px 8px rgba(0,0,0,0.06);
          transform: translateY(1px) scale(0.98);
        }
        .welcome-policy {
          text-align: center;
          color: #8a99b3;
          font-size: 13px;
          margin-top: 8px;
        }
        .policy-link {
          color: #4285f4;
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .welcome-main {
            margin-top: 16vw;
          }
          .welcome-big-logo {
            max-width: 96vw;
          }
          .welcome-login-row {
            max-width: 98vw;
          }
        }
      `}</style>
    </div>
  )
}
