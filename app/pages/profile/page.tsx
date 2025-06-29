'use client';

import MobileLayout from '../layout';

export default function ProfilePage() {
  return (
    <MobileLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">个人资料</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              张
            </div>
            <div>
              <h2 className="text-xl font-semibold">张三</h2>
              <p className="text-gray-600">等级: 黄金</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">1250</p>
              <p className="text-sm text-gray-600">积分</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">28</p>
              <p className="text-sm text-gray-600">胜利</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">66.7%</p>
              <p className="text-sm text-gray-600">胜率</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h3 className="text-lg font-semibold mb-4">个人信息</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">用户名</span>
              <span className="font-medium">zhangsan123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">注册时间</span>
              <span className="font-medium">2024-01-15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">最后登录</span>
              <span className="font-medium">今天 14:30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">在线时长</span>
              <span className="font-medium">2小时30分钟</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h3 className="text-lg font-semibold mb-4">成就徽章</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-xs text-gray-600">连胜王</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-xs text-gray-600">速度之星</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🛡️</span>
              </div>
              <p className="text-xs text-gray-600">防守专家</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">❓</span>
              </div>
              <p className="text-xs text-gray-600">待解锁</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">设置</h3>
          <div className="space-y-4">
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span>通知设置</span>
                <span className="text-gray-400">&gt;</span>
              </div>
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span>隐私设置</span>
                <span className="text-gray-400">&gt;</span>
              </div>
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span>关于我们</span>
                <span className="text-gray-400">&gt;</span>
              </div>
            </button>
            <button className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-red-600">退出登录</span>
                <span className="text-gray-400">&gt;</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 