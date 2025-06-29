'use client';

import MobileLayout from '../layout';

export default function DataPage() {
  return (
    <MobileLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">数据统计</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">42</p>
              <p className="text-sm text-gray-600">总比赛</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">28</p>
              <p className="text-sm text-gray-600">胜利</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">14</p>
              <p className="text-sm text-gray-600">失败</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">66.7%</p>
              <p className="text-sm text-gray-600">胜率</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">最近表现</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">本周</span>
              <div className="flex space-x-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">上周</span>
              <div className="flex space-x-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">技能分析</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">进攻</span>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">防守</span>
                <span className="text-sm text-gray-600">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '72%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">反应</span>
                <span className="text-sm text-gray-600">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 