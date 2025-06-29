'use client';

import MobileLayout from '../layout';

export default function RankingPage() {
  return (
    <MobileLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">排行榜</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🥇</span>
                <div>
                  <p className="font-semibold">张三</p>
                  <p className="text-sm text-gray-600">胜率: 85%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">1250</p>
                <p className="text-sm text-gray-600">积分</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🥈</span>
                <div>
                  <p className="font-semibold">李四</p>
                  <p className="text-sm text-gray-600">胜率: 78%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">1180</p>
                <p className="text-sm text-gray-600">积分</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🥉</span>
                <div>
                  <p className="font-semibold">王五</p>
                  <p className="text-sm text-gray-600">胜率: 72%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">1120</p>
                <p className="text-sm text-gray-600">积分</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 