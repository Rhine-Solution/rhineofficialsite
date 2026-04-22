const fs = require('fs')
const path = require('path')

const BUDGET_KB = 500

function checkBundleSize() {
  const buildDir = path.join(__dirname, '../.next')
  const statsFile = path.join(buildDir, 'stats.json')

  if (!fs.existsSync(statsFile)) {
    console.log('⚠️  No build stats found. Run "next build" first.')
    process.exit(0)
  }

  const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'))
  
  let totalSize = 0
  const assets = []

  if (stats.assets) {
    stats.assets.forEach(asset => {
      if (asset.name.endsWith('.js') && !asset.name.includes('chunks/')) {
        const sizeKB = Math.round(asset.size / 1024)
        totalSize += sizeKB
        assets.push({ name: asset.name, size: sizeKB })
      }
    })
  }

  console.log(`\n📊 Bundle Size Report`)
  console.log(`Total JS: ${totalSize} KB`)
  console.log(`Budget: ${BUDGET_KB} KB`)
  console.log('')

  if (totalSize > BUDGET_KB) {
    console.log(`❌ FAIL: Bundle exceeds budget by ${totalSize - BUDGET_KB} KB`)
    process.exit(1)
  } else {
    console.log(`✅ PASS: Bundle is within budget (${BUDGET_KB - totalSize} KB under)`)
  }

  if (assets.length > 0) {
    console.log('\n📦 Individual bundles:')
    assets.slice(0, 10).forEach(a => {
      console.log(`  ${a.name}: ${a.size} KB`)
    })
  }
}

checkBundleSize()