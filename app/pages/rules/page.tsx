'use client'

import { WinnerIcon } from "@/app/components/WinnerIcon";

export default function RulesPage() {
    return <div style={{ padding: '16px 0' }}>
        <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>📝 得分规则</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '4px' }}>每个玩家输入自己的进球数, 支持小数，如 0.5、1.5 等。</li>
                <li style={{ marginBottom: '4px' }}>得分会根据Buff规则进行调整，比如当天buff如果是狗招得分为1.5分，则填写1.5分。</li>
            </ul>
        </div>

        <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🏆 获胜规则</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '8px' }}>点击红队或蓝队区域选择获胜队伍, 获胜队伍旁会显示奖杯图标。</li>
                <div className={`team-header winner`}>
                    <div className="winner-icon-placeholder">
                        {WinnerIcon(true)}
                    </div>
                    <h4>
                        红队
                    </h4>
                </div>
                <li style={{ marginBottom: '8px' }}>获胜队伍与得分总和无关，而是与得分&当场Buff有关。</li>
                <li>必须选择获胜队伍才能结算比赛。</li>
            </ul>
        </div>

        <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🎯 特殊情况</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '12px' }}><strong>乌龙球</strong>：玩家打进自己球门，不记录得分（比如实际比赛结果红队vs蓝队为2:3，其中红队有一球是打进自家球门的，则得分记录为2:2, 皇冠选择蓝队）。</li>
                <li style={{ marginBottom: '4px' }}><strong>意外得分</strong>：非正常进球，计入相应玩家得分。</li>
            </ul>
        </div>

        <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🔄 匹配规则</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '4px' }}>同队伍中会优先匹配一前锋一后卫，若玩家为全能则都可以担任任意位置。</li>
                <li style={{ marginBottom: '4px' }}>系统会自动平衡队伍配置，确保比赛公平性。</li>
            </ul>
        </div>

        <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>⚽ 示例说明</h4>
            <div style={{ color: '#666', lineHeight: '1.6' }}>
                <p style={{ margin: '4px 0' }}><strong>红队：</strong></p>
                <p style={{ margin: '4px 0' }}>• A1 得分：2.5</p>
                <p style={{ margin: '4px 0' }}>• A2 得分：0.5</p>
                <p style={{ margin: '8px 0' }}><strong>蓝队：</strong></p>
                <p style={{ margin: '4px 0' }}>• B1 得分：2</p>
                <p style={{ margin: '4px 0' }}>• B2 得分：0</p>
                <p style={{ margin: '8px 0' }}><strong>结果：</strong>点击红队或蓝队选择获胜方</p>
            </div>
        </div>


        <style jsx>{`
        .team-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 auto 8px auto;
          justify-content: center;
          padding: 8px 16px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
          border: 1px solid transparent;
          width: 120px;
        }
        
        .team-header.winner {
          background-color: rgba(255, 215, 0, 0.15);
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .team-header h4 {
          margin: 0;
          display: flex;
          align-items: center;
        }
    `}</style>
    </div>

}