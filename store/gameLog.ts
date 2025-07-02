import { create } from 'zustand'
import supabase from '@/lib/supabase/client'
import { GameLogRecord, GameLogResponse } from '@/app/api/game/log/route';

interface GameLogStore {
    gameLogs: GameLogRecord[];
    isGameLogsLoading: boolean;
    fetchGameLogs: (page?: number, pageSize?: number) => Promise<void>;
}

const useGameLogStore = create<GameLogStore>((set) => ({
    gameLogs: [],
    isGameLogsLoading: false,
    fetchGameLogs: async (page = 1, pageSize = 20) => {
        set({ isGameLogsLoading: true });
        try {
            const res = await fetch(`/api/game/log?page=${page}&pageSize=${pageSize}`);
            const result = await res.json() as GameLogResponse;
            console.log('fetchGameLogs', result);
            if (!result.success) throw new Error(result.error || '获取比赛记录失败');
            const records: GameLogRecord[] = result.data?.records || [];
            set({ gameLogs: records, isGameLogsLoading: false });
        } catch (e) {
            set({ isGameLogsLoading: false });
            throw e;
        }
    }
}))

export default useGameLogStore 