import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import sharp from 'sharp'
import { decorItems } from '../src/data/decorItems'
import { SudalAccessoryLayer, SudalOutfitLayer } from '../src/components/PetDecorLayers'

const rootDir = path.resolve(process.cwd(), 'src/assets/sudal-decor')
const outfitDir = path.join(rootDir, 'outfits')
const accessoryDir = path.join(rootDir, 'accessories')

async function renderSvgToPng(svgMarkup: string, outputPath: string) {
  await sharp(Buffer.from(svgMarkup))
    .png()
    .toFile(outputPath)
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

function buildSvg(node: React.ReactNode) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 260 340',
        width: 520,
        height: 680,
      },
      node,
    ),
  )
}

async function main() {
  await ensureDir(outfitDir)
  await ensureDir(accessoryDir)

  const outfitItems = decorItems.filter((item) => item.type === 'outfit')
  const accessoryItems = decorItems.filter((item) => item.type === 'accessory')

  for (const item of outfitItems) {
    const svgMarkup = buildSvg(React.createElement(SudalOutfitLayer, { name: item.name }))
    await renderSvgToPng(svgMarkup, path.join(outfitDir, `${item.id}.png`))
  }

  for (const item of accessoryItems) {
    const svgMarkup = buildSvg(React.createElement(SudalAccessoryLayer, { name: item.name }))
    await renderSvgToPng(svgMarkup, path.join(accessoryDir, `${item.id}.png`))
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
