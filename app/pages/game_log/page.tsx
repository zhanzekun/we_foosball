'use client'

import React, { useEffect } from 'react'
import { useGameLogStore } from '@/store'
import { WinnerIcon } from '@/app/components/WinnerIcon'

export default function GameLogPage() {
  const { gameLogs, isGameLogsLoading, fetchGameLogs } = useGameLogStore()

  useEffect(() => {
    fetchGameLogs()
  }, [fetchGameLogs])

  // if (isGameLogsLoading) {
  //   return <div style={{ padding: 24 }}>加载中...</div>
  // }

  if (!gameLogs.length) {
    return <div style={{ padding: 24 }}>暂无比赛记录</div>
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>比赛记录</h2>
      {gameLogs.map((log) => {
        const teamRed = log.teamRed.map(p => p.nickname).join(' & ')
        const teamBlue = log.teamBlue.map(p => p.nickname).join(' & ')
        const teamRedScore = log.teamRed.reduce((sum, p) => sum + (p.score || 0), 0)
        const teamBlueScore = log.teamBlue.reduce((sum, p) => sum + (p.score || 0), 0)
        return (
          <div key={log.id} style={{ border: '1px solid #eee', borderRadius: 8, marginBottom: 20, padding: 16, background: '#fafbfc' }}>
            <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>{new Date(log.created_at).toLocaleString()}</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                {teamRed}
                {log.winner_team_index === 1 && <span style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}><WinnerIcon isShow={true} /></span>}
              </div>
              <div style={{ width: 80, textAlign: 'center', fontWeight: 700, fontSize: 18 }}>
                {teamRedScore} : {teamBlueScore}
              </div>
              <div style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                {log.winner_team_index === 2 && <span style={{ marginRight: 8, display: 'flex', alignItems: 'center' }}><WinnerIcon isShow={true} /></span>}
                {teamBlue}
              </div>
            </div>
            {log.buff && (
              <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
                <span style={{ fontWeight: 600 }}>Buff：</span>
                <span>{log.buff.buff_name} - {log.buff.buff_description}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
