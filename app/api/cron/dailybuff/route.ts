import { BUFF_CONFIGS } from '../../../const/buff'
// import supabase from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // 排除已废弃的buff
  const activeBuff = BUFF_CONFIGS.filter(buff => !buff.deprecated)
  const supabase = await createClient()

  // 获取今天日期和7天前日期
  const today = new Date()
  const todayStr = today.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }).split(' ')[0]
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)
  const sevenDaysAgoStr = sevenDaysAgo.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }).split(' ')[0]

  // 查询过去7天所有buff出现次数
  const { data: buffHistory, error: countError } = await supabase
    .from('buff_history')
    .select('buff_id')
    .gte('date', sevenDaysAgoStr)
    .lte('date', todayStr)

  if (countError) {
    return new Response(JSON.stringify({ success: false, error: countError }), { status: 500 })
  }

  // 统计所有可选buff的出现次数，没有出现过的记为0
  const countMap = (buffHistory || []).reduce((acc: Record<string, number>, item: { buff_id: string }) => {
    if (item.buff_id) {
      acc[item.buff_id] = (acc[item.buff_id] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const buffWithCount = activeBuff.map(buff => ({
    ...buff,
    count: countMap[buff.id] || 0
  }))

  // 按出现次数升序排序，取前2个
  const sortedBuffs = buffWithCount.sort((a, b) => a.count - b.count)
  const [buffAM, buffPM] = sortedBuffs.slice(0, 2)

  console.log('buffhistory', buffWithCount)

  // 查询是否已经有今天的buff记录
  const { data: existingBuffs, error: queryError } = await supabase
    .from('buff_history')
    .select('period')
    .eq('date', todayStr)

  if (queryError) {
    return new Response(JSON.stringify({ success: false, error: queryError }), { status: 500 })
  }

  if (existingBuffs && existingBuffs.length > 0) {
    return new Response(JSON.stringify({ 
      success: true, 
      message: '今日buff已存在',
      existing: existingBuffs 
    }), { status: 200 })
  }

  // 插入今日buff
  const { error: errorAM } = await supabase.from('buff_history').insert([
    {
      buff_id: buffAM.id,
      buff_index: buffAM.index,
      period: 'am',
      buff_name: buffAM.name,
      buff_description: buffAM.description,
      date: todayStr,
    }
  ])
  const { error: errorPM } = await supabase.from('buff_history').insert([
    {
      buff_id: buffPM.id,
      buff_index: buffPM.index,
      period: 'pm',
      buff_name: buffPM.name,
      buff_description: buffPM.description,
      date: todayStr,
    }
  ])

  if (errorAM || errorPM) {
    return new Response(JSON.stringify({ success: false, errorAM, errorPM }), { status: 500 })
  }
  return new Response(JSON.stringify({ success: true, am: buffAM, pm: buffPM }), { status: 200 })
}