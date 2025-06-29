import { BUFF_CONFIGS } from '../../../const/buff'
// import supabase from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // 随机取2个buff
  const getRandomBuff = () => BUFF_CONFIGS[Math.floor(Math.random() * BUFF_CONFIGS.length)]
  const buffAM = getRandomBuff()
  const buffPM = getRandomBuff()


  const supabase = await createClient()

  const { error: errorAM } = await supabase.from('buff_history').insert([
    {
      buff_id: buffAM.id,
      buff_index: buffAM.index,
      period: 'am',
      buff_name: buffAM.name,
      buff_description: buffAM.description,
      date: new Date().toISOString(),
    }
  ])
  const { error: errorPM } = await supabase.from('buff_history').insert([
    {
      buff_id: buffPM.id,
      buff_index: buffPM.index,
      period: 'pm',
      buff_name: buffPM.name,
      buff_description: buffPM.description,
      date: new Date().toISOString(),
    }
  ])

  if (errorAM || errorPM) {
    return new Response(JSON.stringify({ success: false, errorAM, errorPM }), { status: 500 })
  }
  return new Response(JSON.stringify({ success: true, am: buffAM, pm: buffPM }), { status: 200 })
}