import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

function generateBuildId() {
  // 生成随机 UUID
  const buildId = uuidv4()
  
  // 获取 .env 文件路径
  const envPath = path.join(process.cwd(), '.env')
  
  try {
    // 读取现有的 .env 文件内容
    let envContent = ''
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }
    
    // 检查是否已存在 NEXT_PUBLIC_BUILD_ID
    const buildIdRegex = /^NEXT_PUBLIC_BUILD_ID=.*$/m
    
    if (buildIdRegex.test(envContent)) {
      // 如果存在，替换现有的值
      envContent = envContent.replace(buildIdRegex, `NEXT_PUBLIC_BUILD_ID=${buildId}`)
    } else {
      // 如果不存在，添加到文件末尾
      envContent += `\nNEXT_PUBLIC_BUILD_ID=${buildId}`
    }
    
    // 写入 .env 文件
    fs.writeFileSync(envPath, envContent)
    
    console.log(`✅ 已生成新的构建ID: ${buildId}`)
    return buildId
  } catch (error) {
    console.error('❌ 写入 .env 文件失败:', error)
    throw error
  }
}

// 执行生成
generateBuildId()
