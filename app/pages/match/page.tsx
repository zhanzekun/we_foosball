'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, Button, Checkbox } from 'antd-mobile'
import supabase from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
// 只用于类型提示
type BuffCard = { name: string; description: string };

interface Player {
  user_custom_id: string
  nickname: string
}

interface MatchResult {
  team1: Player[]
  team2: Player[]
}

export default function Match() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set())
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [show2v2, setShow2v2] = useState(false)
  const [combo2v2, setCombo2v2] = useState<Player[] | null>(null)
  const [isBuffFlipped, setIsBuffFlipped] = useState(false)
  const [buff, setBuff] = useState<BuffCard | null>(null)
  const buffCardRef = useRef<HTMLDivElement>(null)

  // 获取玩家列表
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('user')
          .select('user_custom_id, nickname')
        if (error) throw error
        setPlayers(data || [])
      } catch (error) {
        // 获取玩家列表失败
      }
    }

    fetchPlayers()
  }, [])

  // 处理玩家选择
  const handlePlayerSelect = (user_custom_id: string, checked: boolean) => {
    const newSelected = new Set(selectedPlayers)
    if (checked) {
      newSelected.add(user_custom_id)
    } else {
      newSelected.delete(user_custom_id)
    }
    setSelectedPlayers(newSelected)
  }

  // 随机匹配逻辑
  const performMatch = (selectedPlayerIds: string[]): MatchResult => {
    const selectedPlayerList = players.filter(player => selectedPlayerIds.includes(player.user_custom_id))
    
    // 随机打乱数组
    const shuffled = [...selectedPlayerList].sort(() => Math.random() - 0.5)
    
    // 分成两队，每队4人
    const team1 = shuffled.slice(0, 4)
    const team2 = shuffled.slice(4, 8)
    
    return { team1, team2 }
  }

  // 开始匹配
  const handleStartMatch = () => {
    if (selectedPlayers.size < 4) {
      // 请至少选择4名玩家进行匹配
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const selectedArr = Array.from(selectedPlayers)
      if (selectedArr.length > 4) {
        // 随机选4人做2v2
        const shuffled = [...selectedArr].sort(() => Math.random() - 0.5)
        const twoVtwoIds = shuffled.slice(0, 4)
        const twoVtwoPlayers = players.filter(p => twoVtwoIds.includes(p.user_custom_id))
        setCombo2v2(twoVtwoPlayers)
        setShow2v2(true)
        setMatchResult(null)
        setIsLoading(false)
        // 已随机出2v2组合！
        return
      }
      // 正常4人直接2v2
      if (selectedArr.length === 4) {
        const twoVtwoPlayers = players.filter(p => selectedArr.includes(p.user_custom_id))
        setCombo2v2(twoVtwoPlayers)
        setShow2v2(true)
        setMatchResult(null)
        setIsLoading(false)
        // 已随机出2v2组合！
        return
      }
      // 8人正常4v4
      const result = performMatch(selectedArr)
      setMatchResult(result)
      setCombo2v2(null)
      setShow2v2(false)
      setIsLoading(false)
      // 匹配完成！
    }, 1000)
  }

  const selectedCount = selectedPlayers.size
  const canStartMatch = selectedCount >= 4

  const handleBuffClick = async () => {
    if (isBuffFlipped) return;
    // 获取当前日期
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const today = `${yyyy}-${mm}-${dd}`;
    // 判断上午/下午
    const hour = now.getHours();
    const period = hour < 14 ? 'am' : 'pm';
    // 查询 supabase
    const { data, error } = await supabase
      .from('buff_history')
      .select('buff_name, buff_description')
      .eq('date', today)
      .eq('period', period)
      .maybeSingle();
    if (data) {
      setBuff({ name: data.buff_name, description: data.buff_description });
    } else {
      setBuff({ name: '暂无Buff', description: '今日Buff尚未生成' });
    }
    setIsBuffFlipped(true);
  }

  return (
    <div className="match-container">
      <Card title="选择玩家进行匹配">
        <div className="player-grid">
          {players.map(player => {
            const checked = selectedPlayers.has(player.user_custom_id);
            return (
              <div
                key={player.user_custom_id}
                className={`player-item${checked ? ' checked' : ''}`}
                onClick={() => handlePlayerSelect(player.user_custom_id, !checked)}
                tabIndex={0}
                role="button"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handlePlayerSelect(player.user_custom_id, !checked)
                  }
                }}
              >
                <Checkbox
                  checked={checked}
                  onChange={(checked) => handlePlayerSelect(player.user_custom_id, checked)}
                  onClick={e => e.stopPropagation()}
                />
                <span className="player-name">{player.nickname}</span>
              </div>
            )
          })}
        </div>
        
        <div className="match-info">
          <p>已选择: {selectedCount} 人</p>
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

      {/* 2v2 组合展示 */}
      <AnimatePresence>
        {show2v2 && combo2v2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            key="2v2"
          >
            <Card title="2v2 随机组合" style={{ marginTop: 16 }}>
              <div className="match-result">
                <div className="team vertical-team">
                  <h4>红队</h4>
                  <div className="team-list">
                    {combo2v2.slice(0, 2).map(player => (
                      <div key={player.user_custom_id} className="team-player ellipsis">{player.nickname}</div>
                    ))}
                  </div>
                </div>
                <div className="vs-divider">VS</div>
                <div className="team vertical-team">
                  <h4>蓝队</h4>
                  <div className="team-list">
                    {combo2v2.slice(2, 4).map(player => (
                      <div key={player.user_custom_id} className="team-player ellipsis">{player.nickname}</div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {matchResult && (
        <Card title="匹配结果" style={{ marginTop: 16 }}>
          <div className="match-result">
            <div className="team vertical-team">
              <h4>红队</h4>
              <div className="team-list">
                {matchResult.team1.map(player => (
                  <div key={player.user_custom_id} className="team-player ellipsis">{player.nickname}</div>
                ))}
              </div>
            </div>
            <div className="vs-divider">VS</div>
            <div className="team vertical-team">
              <h4>蓝队</h4>
              <div className="team-list">
                {matchResult.team2.map(player => (
                  <div key={player.user_custom_id} className="team-player ellipsis">{player.nickname}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Buff 卡片 */}
      <div className="buff-card-container">
        <div
          className={`buff-card${isBuffFlipped ? ' flipped' : ''}`}
          onClick={handleBuffClick}
          ref={buffCardRef}
          style={isBuffFlipped ? { pointerEvents: 'none', cursor: 'default' } : {}}
        >
          <div className="buff-card-face buff-card-front">
            <span>点击抽取 Buff</span>
          </div>
          <div className="buff-card-face buff-card-back">
            <div className="buff-name">{buff ? buff.name : ''}</div>
            <div className="buff-desc">{buff ? buff.description : ''}</div>
          </div>
        </div>
      </div>

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
          cursor: pointer;
          transition: box-shadow 0.18s, border-color 0.18s;
          outline: none;
        }
        
        .player-item:active, .player-item:focus {
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          border-color: #b2f7ef;
        }
        
        .player-item.checked {
          border-color: #0ea47a;
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
          align-items: stretch;
          justify-content: center;
        }
        
        .vertical-team {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        
        .team-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        
        .team-player {
          padding: 8px 12px;
          background-color: #f8f9fa;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
          color: #333;
          max-width: 90px;
          min-width: 60px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0 auto;
        }
        
        .ellipsis {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .vs-divider {
          font-weight: bold;
          font-size: 20px;
          color: #e74c3c;
          margin: 0 12px;
          letter-spacing: 2px;
          user-select: none;
          align-self: center;
          display: flex;
          align-items: center;
          height: auto;
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
        
        .buff-card-container {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }
        .buff-card {
          width: calc(100vw - 24px);
          max-width: 480px;
          height: 140px;
          perspective: 600px;
          cursor: pointer;
          position: relative;
          margin: 0 12px;
        }
        .buff-card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          font-size: 20px;
          font-weight: 500;
          background: linear-gradient(135deg, #e0ffe7 0%, #b2f7ef 100%);
          color: #0ea47a;
          transition: transform 0.6s cubic-bezier(0.4,0.2,0.2,1), box-shadow 0.2s;
        }
        .buff-card-front {
          z-index: 2;
          transform: rotateY(0deg);
        }
        .buff-card-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, #fffbe0 0%, #ffe0e0 100%);
          color: #e67e22;
        }
        .buff-card.flipped {
          transform: rotateY(180deg);
        }
        .buff-name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .buff-desc {
          font-size: 14px;
          color: #e67e22;
          text-align: center;
        }
        .buff-card:active {
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        }
        .buff-card {
          transition: transform 0.6s cubic-bezier(0.4,0.2,0.2,1), box-shadow 0.2s;
          transform-style: preserve-3d;
        }
        .buff-card-face {
          transition: none;
        }
      `}</style>
    </div>
  )
}