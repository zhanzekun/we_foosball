'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Checkbox, Toast } from 'antd-mobile'

// 模拟接口数据
const mockPlayers = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
  { id: 5, name: '钱七' },
  { id: 6, name: '孙八' },
  { id: 7, name: '周九' },
  { id: 8, name: '吴十' },
  { id: 9, name: '郑十一' },
  { id: 10, name: '王十二' },
]

interface Player {
  id: number
  name: string
}

interface MatchResult {
  team1: Player[]
  team2: Player[]
}

export default function Match() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(new Set())
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 获取玩家列表
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // 这里应该是真实的 API 调用
        // const response = await fetch('/api/players')
        // const data = await response.json()
        
        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        setPlayers(mockPlayers)
      } catch (error) {
        Toast.show({
          content: '获取玩家列表失败',
          position: 'center',
        })
      }
    }

    fetchPlayers()
  }, [])

  // 处理玩家选择
  const handlePlayerSelect = (playerId: number, checked: boolean) => {
    const newSelected = new Set(selectedPlayers)
    if (checked) {
      newSelected.add(playerId)
    } else {
      newSelected.delete(playerId)
    }
    setSelectedPlayers(newSelected)
  }

  // 随机匹配逻辑
  const performMatch = (selectedPlayerIds: number[]): MatchResult => {
    const selectedPlayerList = players.filter(player => selectedPlayerIds.includes(player.id))
    
    // 随机打乱数组
    const shuffled = [...selectedPlayerList].sort(() => Math.random() - 0.5)
    
    // 分成两队，每队4人
    const team1 = shuffled.slice(0, 4)
    const team2 = shuffled.slice(4, 8)
    
    return { team1, team2 }
  }

  // 开始匹配
  const handleStartMatch = () => {
    if (selectedPlayers.size < 8) {
      Toast.show({
        content: '请至少选择8名玩家进行匹配',
        position: 'center',
      })
      return
    }

    setIsLoading(true)
    
    // 模拟匹配过程
    setTimeout(() => {
      const result = performMatch(Array.from(selectedPlayers))
      setMatchResult(result)
      setIsLoading(false)
      
      Toast.show({
        content: '匹配完成！',
        position: 'center',
      })
    }, 1000)
  }

  const selectedCount = selectedPlayers.size
  const canStartMatch = selectedCount >= 8

  return (
    <div className="match-container">
      <Card title="选择玩家进行匹配">
        <div className="player-grid">
          {players.map(player => (
            <div key={player.id} className="player-item">
              <Checkbox
                checked={selectedPlayers.has(player.id)}
                onChange={(checked) => handlePlayerSelect(player.id, checked)}
              />
              <span className="player-name">{player.name}</span>
            </div>
          ))}
        </div>
        
        <div className="match-info">
          <p>已选择: {selectedCount} 人</p>
          <p>需要: 8 人 (4v4)</p>
        </div>
        
        <Button
          block
          color="primary"
          size="large"
          loading={isLoading}
          disabled={!canStartMatch}
          onClick={handleStartMatch}
        >
          {isLoading ? '匹配中...' : '开始匹配'}
        </Button>
      </Card>

      {matchResult && (
        <Card title="匹配结果" style={{ marginTop: 16 }}>
          <div className="match-result">
            <div className="team">
              <h4>红队</h4>
              <div className="team-grid">
                {matchResult.team1.map(player => (
                  <div key={player.id} className="team-player">{player.name}</div>
                ))}
              </div>
            </div>
            
            <div className="team">
              <h4>蓝队</h4>
              <div className="team-grid">
                {matchResult.team2.map(player => (
                  <div key={player.id} className="team-player">{player.name}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <style jsx>{`
        .match-container {
          padding: 12px;
          width: 100%;
          box-sizing: border-box;
        }
        
        .player-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .player-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .player-name {
          font-size: 14px;
          color: #333;
        }
        
        .match-info {
          margin-bottom: 16px;
          padding: 12px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .match-info p {
          margin: 4px 0;
          font-size: 14px;
          color: #666;
        }
        
        .match-result {
          display: flex;
          gap: 16px;
        }
        
        .team {
          flex: 1;
        }
        
        .team h4 {
          margin: 0 0 8px 0;
          text-align: center;
          color: #333;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        
        .team-player {
          padding: 8px;
          background-color: #f8f9fa;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
          color: #333;
        }
      `}</style>
    </div>
  )
}