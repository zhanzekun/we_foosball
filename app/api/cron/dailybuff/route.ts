import { BUFF_CONFIGS } from '../../../const/buff'
// import supabase from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // 随机取2个buff
  const getRandomBuff = () => BUFF_CONFIGS[Math.floor(Math.random() * BUFF_CONFIGS.length)]
  const buffAM = getRandomBuff()
  const buffPM = getRandomBuff()

  const supabase = await createClient()
  
  // 获取今天的日期
  const today = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }).split(' ')[0]
  
  // 查询是否已经有今天的buff记录
  const { data: existingBuffs, error: queryError } = await supabase
    .from('buff_history')
    .select('period')
    .eq('date', today)
  
  if (queryError) {
    return new Response(JSON.stringify({ success: false, error: queryError }), { status: 500 })
  }
  
  // 如果已经有今天的记录，直接返回
  if (existingBuffs && existingBuffs.length > 0) {
    return new Response(JSON.stringify({ 
      success: true, 
      message: '今日buff已存在',
      existing: existingBuffs 
    }), { status: 200 })
  }


  const { error: errorAM } = await supabase.from('buff_history').insert([
    {
      buff_id: buffAM.id,
      buff_index: buffAM.index,
      period: 'am',
      buff_name: buffAM.name,
      buff_description: buffAM.description,
      date: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }).split(' ')[0],
    }
  ])
  const { error: errorPM } = await supabase.from('buff_history').insert([
    {
      buff_id: buffPM.id,
      buff_index: buffPM.index,
      period: 'pm',
      buff_name: buffPM.name,
      buff_description: buffPM.description,
      date: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }).split(' ')[0],
    }
  ])

  if (errorAM || errorPM) {
    return new Response(JSON.stringify({ success: false, errorAM, errorPM }), { status: 500 })
  }
  return new Response(JSON.stringify({ success: true, am: buffAM, pm: buffPM }), { status: 200 })
}