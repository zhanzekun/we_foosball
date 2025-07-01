import fs from 'fs'
import path from 'path'

function getNextVersion(current) {
  if (!/^\d+\.\d+\.\d+$/.test(current)) return '0.1.0'
  const [major, minor, patch] = current.split('.').map(Number)
  return `${major}.${minor}.${patch + 1}`
}

function generateBuildId() {
  // 获取 .env 文件路径
  const envPath = path.join(process.cwd(), '.env')

  try {
    // 读取现有的 .env 文件内容
    let envContent = ''
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }

    // 检查是否已存在 NEXT_PUBLIC_BUILD_ID
    const buildIdRegex = /^NEXT_PUBLIC_BUILD_ID=(.*)$/m
    let newVersion = '0.1.0'
    if (buildIdRegex.test(envContent)) {
      // 如果存在，递增 patch 位
      const match = envContent.match(buildIdRegex)
      if (match && match[1]) {
        newVersion = getNextVersion(match[1].trim())
      }
      envContent = envContent.replace(buildIdRegex, `NEXT_PUBLIC_BUILD_ID=${newVersion}`)
    } else {
      // 如果不存在，添加到文件末尾
      envContent += `\nNEXT_PUBLIC_BUILD_ID=${newVersion}`
    }

    // 写入 .env 文件
    fs.writeFileSync(envPath, envContent)

    console.log(`✅ 已生成新的构建版本号: ${newVersion}`)
    return newVersion
  } catch (error) {
    console.error('❌ 写入 .env 文件失败:', error)
    throw error
  }
}

// 执行生成
generateBuildId()
