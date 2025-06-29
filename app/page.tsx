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

    setIsCheckingRegistration(true)

    try {
      // 检查用户是否已注册
      const { data, error } = await supabase
        .from('user')
        .select('user_custom_id')
        .eq('user_custom_id', session.user.email)
        .maybeSingle()

      if (error) {
        throw new Error(error.message || '检查用户状态失败')
      }

      const isRegistered = !!data

      if (isRegistered) {
        // 用户已注册，跳转到主页
        router.push('/home')
      } else {
        // 用户未注册，跳转到注册页面
        router.push('/signup')
      }
    } catch (error) {
      console.error('检查用户注册状态失败:', error)
      // 出错时默认跳转到注册页面
      router.push('/signup')
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
        <div className="welcome-subtitle">Play Foosball. Anytime. Anywhere.</div>
      </div>
      <div className="welcome-login-bottom">
        <div className="welcome-login-row">
          <button className="login-btn google" onClick={handleGoogleLogin}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}><g><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.711-2.633c-1.711-1.57-3.922-2.523-6.68-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.031 9.547-9.719 0-.652-.07-1.148-.156-1.523z" fill="#4285F4" /><path d="M3.152 7.345l3.281 2.406c.891-1.781 2.578-2.906 4.617-2.906 1.102 0 2.148.383 2.953 1.016l2.953-2.883c-1.602-1.477-3.672-2.375-5.906-2.375-3.672 0-6.773 2.477-7.891 5.812z" fill="#34A853" /><path d="M12 22c2.672 0 4.922-.883 6.563-2.406l-3.047-2.492c-.828.578-1.891.922-3.516.922-2.828 0-5.227-1.906-6.086-4.453l-3.242 2.5c1.672 3.406 5.25 5.929 9.328 5.929z" fill="#4CAF50" /><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.711-2.633c-1.711-1.57-3.922-2.523-6.68-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.031 9.547-9.719 0-.652-.07-1.148-.156-1.523z" fill="#4285F4" fillOpacity=".1" /></g></svg>
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
