import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const outDir = path.resolve(process.cwd(), 'src/assets/sudal-icons')

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

function badge(inner: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="512" height="512">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#9a6a44" flood-opacity="0.16"/>
      </filter>
    </defs>
    <circle cx="128" cy="128" r="110" fill="#fff6ea" stroke="#6f5a45" stroke-width="8" filter="url(#shadow)"/>
    ${inner}
  </svg>`
}

function foodBase(core: string) {
  return badge(`<g transform="translate(0 2)">${core}</g>`)
}

function decorBase(core: string) {
  return badge(`<g transform="translate(0 2)">${core}</g>`)
}

const ingredientIcons: Record<string, string> = {
  strawberry: foodBase(`
    <path d="M128 86c18 0 48 24 48 58 0 34-22 68-48 68s-48-34-48-68c0-34 30-58 48-58z" fill="#d95454" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M96 86c10-16 24-22 32-22s22 6 32 22c-21 7-43 7-64 0z" fill="#6e9a58" stroke="#6f5a45" stroke-width="6" stroke-linejoin="round"/>
    <circle cx="113" cy="122" r="4" fill="#fff3d8"/><circle cx="145" cy="122" r="4" fill="#fff3d8"/>
    <circle cx="102" cy="146" r="4" fill="#fff3d8"/><circle cx="128" cy="150" r="4" fill="#fff3d8"/><circle cx="154" cy="144" r="4" fill="#fff3d8"/>
    <path d="M110 186c8-14 28-14 36 0" fill="none" stroke="#6f5a45" stroke-width="6" stroke-linecap="round"/>
  `),
  watermelon: foodBase(`
    <path d="M74 162c20-49 88-84 108-84s88 35 108 84c-27 12-63 18-108 18s-81-6-108-18z" fill="#f5efe0" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M92 157c17-31 55-54 90-54s73 23 90 54c-22 8-52 12-90 12s-68-4-90-12z" fill="#67c86b" stroke="#6f5a45" stroke-width="6"/>
    <path d="M116 157c10-15 28-24 66-24 37 0 56 9 66 24-21 6-42 8-66 8s-45-2-66-8z" fill="#ef5c61"/>
    <circle cx="155" cy="145" r="3" fill="#6f5a45"/><circle cx="173" cy="141" r="3" fill="#6f5a45"/><circle cx="191" cy="145" r="3" fill="#6f5a45"/>
    <circle cx="141" cy="133" r="3" fill="#6f5a45"/><circle cx="165" cy="127" r="3" fill="#6f5a45"/><circle cx="189" cy="130" r="3" fill="#6f5a45"/>
  `),
  noodle: foodBase(`
    <path d="M78 152h100c0 34-17 60-50 60s-50-26-50-60z" fill="#fff6db" stroke="#6f5a45" stroke-width="7"/>
    <path d="M74 156c13-12 28-18 54-18s41 6 54 18" fill="none" stroke="#6f5a45" stroke-width="7" stroke-linecap="round"/>
    <path d="M92 104l-16-24M118 104l-10-26M146 104l7-24" stroke="#6f5a45" stroke-width="8" stroke-linecap="round"/>
    <path d="M96 144c10 12 55 12 68 0" fill="none" stroke="#d8b8a0" stroke-width="8" stroke-linecap="round"/>
    <path d="M104 165c11 12 37 12 48 0" fill="none" stroke="#d8b8a0" stroke-width="8" stroke-linecap="round"/>
  `),
  milk: foodBase(`
    <path d="M102 68h52l14 28v92c0 15-12 27-27 27h-26c-15 0-27-12-27-27V96z" fill="#fff6f2" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M114 68l14 20 14-20" fill="#f5c9ca" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M112 112h32" stroke="#c96f6c" stroke-width="8" stroke-linecap="round"/>
    <circle cx="128" cy="154" r="20" fill="#f4a2a2" stroke="#6f5a45" stroke-width="6"/>
    <path d="M120 154c5-6 11-6 16 0" fill="none" stroke="#fff7e3" stroke-width="5" stroke-linecap="round"/>
  `),
  peach: foodBase(`
    <path d="M128 80c32 0 56 25 56 56 0 38-23 70-56 70s-56-32-56-70c0-31 24-56 56-56z" fill="#f3a16b" stroke="#6f5a45" stroke-width="7"/>
    <path d="M128 80c-9 16-12 32-12 56 0 24 3 42 12 70" fill="none" stroke="#ea7f66" stroke-width="5"/>
    <path d="M129 79c8-16 21-22 36-22" fill="none" stroke="#6e9a58" stroke-width="7" stroke-linecap="round"/>
    <path d="M128 79c-7-12-18-19-30-20" fill="none" stroke="#6e9a58" stroke-width="7" stroke-linecap="round"/>
  `),
  corn: foodBase(`
    <path d="M96 90c20-10 44-10 64 0l14 72c-13 19-29 31-46 31s-33-12-46-31z" fill="#f5d557" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M112 94c-10 21-10 58 0 90M144 94c10 21 10 58 0 90" fill="none" stroke="#f0b941" stroke-width="6"/>
    <path d="M98 126c24 8 56 8 80 0" fill="none" stroke="#fff6d2" stroke-width="7" stroke-linecap="round"/>
    <path d="M78 160c14-14 24-17 34-16M178 160c-14-14-24-17-34-16" fill="none" stroke="#74a04f" stroke-width="10" stroke-linecap="round"/>
  `),
  tomato: foodBase(`
    <circle cx="128" cy="140" r="62" fill="#e85b58" stroke="#6f5a45" stroke-width="7"/>
    <path d="M128 82c-2 12-2 24 0 36" fill="none" stroke="#c74545" stroke-width="6" stroke-linecap="round"/>
    <path d="M98 88c8 6 16 10 30 12M158 88c-8 6-16 10-30 12" fill="none" stroke="#6e9a58" stroke-width="8" stroke-linecap="round"/>
    <circle cx="106" cy="124" r="6" fill="#ffd7cc" opacity=".7"/>
  `),
  cucumber: foodBase(`
    <path d="M82 140c0-27 20-56 46-56s46 29 46 56-20 56-46 56-46-29-46-56z" fill="#75c46d" stroke="#6f5a45" stroke-width="7"/>
    <path d="M110 92c-14 17-18 29-18 48s4 31 18 48" fill="none" stroke="#5ba657" stroke-width="6" stroke-linecap="round"/>
    <path d="M146 92c14 17 18 29 18 48s-4 31-18 48" fill="none" stroke="#5ba657" stroke-width="6" stroke-linecap="round"/>
    <circle cx="128" cy="140" r="18" fill="#8bd97f" stroke="#6f5a45" stroke-width="5"/>
  `),
  eggplant: foodBase(`
    <path d="M152 82c16 10 28 26 28 44 0 34-30 74-68 74s-68-30-68-64 24-58 58-58c18 0 30 2 50 4z" fill="#8b5bbd" stroke="#6f5a45" stroke-width="7"/>
    <path d="M110 84c4-16 18-28 38-28" fill="none" stroke="#6e9a58" stroke-width="8" stroke-linecap="round"/>
    <path d="M108 76c10 8 20 10 30 10 8 0 17-2 28-8" fill="none" stroke="#6e9a58" stroke-width="10" stroke-linecap="round"/>
  `),
  citrus: foodBase(`
    <circle cx="128" cy="140" r="64" fill="#ffb24f" stroke="#6f5a45" stroke-width="7"/>
    <circle cx="128" cy="140" r="40" fill="#fff4d6" stroke="#6f5a45" stroke-width="6"/>
    <path d="M128 100v80M88 140h80M100 112l56 56M156 112l-56 56" fill="none" stroke="#ffcf7b" stroke-width="6" stroke-linecap="round"/>
    <path d="M116 84c8-13 18-20 30-22" fill="none" stroke="#6e9a58" stroke-width="8" stroke-linecap="round"/>
  `),
  greens: foodBase(`
    <path d="M128 188c-28 0-44-18-44-46 0-29 18-56 44-56s44 27 44 56c0 28-16 46-44 46z" fill="#9ac96b" stroke="#6f5a45" stroke-width="7"/>
    <path d="M128 86c-2 24-2 44 0 102" fill="none" stroke="#6e9a58" stroke-width="7" stroke-linecap="round"/>
    <path d="M103 116c16 6 30 6 50 0M98 142c18 7 42 7 64 0M101 166c17 5 35 5 56 0" fill="none" stroke="#fff2cf" stroke-width="7" stroke-linecap="round"/>
  `),
  shell: foodBase(`
    <path d="M76 154c0-38 24-68 52-68s52 30 52 68c0 24-12 42-52 42s-52-18-52-42z" fill="#f0d6b4" stroke="#6f5a45" stroke-width="7"/>
    <path d="M128 88v108M104 94l11 100M152 94l-11 100M88 108l30 76M168 108l-30 76" fill="none" stroke="#d4b48e" stroke-width="6" stroke-linecap="round"/>
    <path d="M94 168c10 10 26 16 34 16 8 0 24-6 34-16" fill="none" stroke="#fff7e7" stroke-width="7" stroke-linecap="round"/>
  `),
  radish: foodBase(`
    <path d="M128 88c28 0 48 22 48 48 0 38-22 64-48 64s-48-26-48-64c0-26 20-48 48-48z" fill="#fff4f0" stroke="#6f5a45" stroke-width="7"/>
    <path d="M103 82c10 8 16 13 25 20 8-7 15-12 25-20" fill="none" stroke="#6e9a58" stroke-width="8" stroke-linecap="round"/>
    <path d="M118 93c-6-13-13-22-22-28M138 93c6-13 13-22 22-28" fill="none" stroke="#6e9a58" stroke-width="8" stroke-linecap="round"/>
    <circle cx="128" cy="148" r="18" fill="#ffdfe0" stroke="#6f5a45" stroke-width="5"/>
  `),
  sweetPotato: foodBase(`
    <path d="M82 150c12-28 48-56 86-56 28 0 44 13 44 34 0 37-22 72-62 72-36 0-78-18-68-50z" fill="#9c5d39" stroke="#6f5a45" stroke-width="7"/>
    <path d="M98 132c14 8 26 10 38 10s24-2 38-10" fill="none" stroke="#d9a46d" stroke-width="6" stroke-linecap="round"/>
    <path d="M104 108c8-10 13-18 16-28" fill="none" stroke="#6e9a58" stroke-width="7" stroke-linecap="round"/>
  `),
  mushroom: foodBase(`
    <path d="M82 134c0-30 20-54 46-54s46 24 46 54c0 0-12 14-46 14s-46-14-46-14z" fill="#d8a35b" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M104 148h48c0 32-8 56-24 56s-24-24-24-56z" fill="#f5e6ca" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <circle cx="108" cy="114" r="5" fill="#fff2d6"/><circle cx="128" cy="104" r="5" fill="#fff2d6"/><circle cx="148" cy="114" r="5" fill="#fff2d6"/>
  `),
  salad: foodBase(`
    <path d="M74 158c16-36 48-56 54-56s38 20 54 56c-12 18-31 28-54 28s-42-10-54-28z" fill="#fff5d8" stroke="#6f5a45" stroke-width="7"/>
    <path d="M88 152c13-22 25-32 40-32s27 10 40 32" fill="none" stroke="#74a04f" stroke-width="10" stroke-linecap="round"/>
    <path d="M106 118c-10 4-18 12-20 24M150 118c10 4 18 12 20 24" fill="none" stroke="#74a04f" stroke-width="10" stroke-linecap="round"/>
    <circle cx="128" cy="144" r="14" fill="#ef5f5b" stroke="#6f5a45" stroke-width="5"/>
  `),
  cheese: foodBase(`
    <path d="M86 180V120l74-34 10 104z" fill="#f5d56b" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <circle cx="118" cy="148" r="8" fill="#ffeaa0" stroke="#6f5a45" stroke-width="5"/>
    <circle cx="138" cy="132" r="6" fill="#ffeaa0" stroke="#6f5a45" stroke-width="5"/>
    <circle cx="152" cy="156" r="5" fill="#ffeaa0" stroke="#6f5a45" stroke-width="5"/>
  `),
  rice: foodBase(`
    <path d="M72 160c0-24 18-40 56-40s56 16 56 40c0 28-16 56-56 56s-56-28-56-56z" fill="#fff5eb" stroke="#6f5a45" stroke-width="7"/>
    <path d="M96 126c10 14 22 20 32 20s22-6 32-20" fill="none" stroke="#d9b58a" stroke-width="7" stroke-linecap="round"/>
    <path d="M92 148h72" stroke="#d9b58a" stroke-width="7" stroke-linecap="round"/>
    <path d="M108 96h40" stroke="#6f5a45" stroke-width="8" stroke-linecap="round"/>
  `),
  bag: foodBase(`
    <path d="M92 108c0-24 20-42 36-42s36 18 36 42" fill="none" stroke="#6f5a45" stroke-width="8" stroke-linecap="round"/>
    <path d="M74 112h108l-10 92H84z" fill="#eac38b" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M102 148c8 8 14 10 26 10 10 0 16-2 26-10" fill="none" stroke="#fff1df" stroke-width="7" stroke-linecap="round"/>
  `),
  camera: badge(`
    <rect x="58" y="92" width="140" height="96" rx="24" fill="#f8ede1" stroke="#6f5a45" stroke-width="7"/>
    <path d="M78 104h34l10-16h28c12 0 20 8 20 20" fill="none" stroke="#6f5a45" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="81" y="118" width="16" height="10" rx="5" fill="#e7c2a1" stroke="#6f5a45" stroke-width="4"/>
    <circle cx="128" cy="140" r="28" fill="#fff8f0" stroke="#6f5a45" stroke-width="7"/>
    <circle cx="128" cy="140" r="15" fill="#eea86a" stroke="#6f5a45" stroke-width="6"/>
    <circle cx="122" cy="134" r="4" fill="#fff5e9"/>
    <path d="M151 116c8 2 14 8 17 15" fill="none" stroke="#6f5a45" stroke-width="6" stroke-linecap="round"/>
  `),
}

const decorIcons: Record<string, string> = {
  sunny: decorBase(`
    <circle cx="128" cy="126" r="28" fill="#ffd26d" stroke="#6f5a45" stroke-width="7"/>
    <path d="M128 74v24M128 154v24M76 126h24M156 126h24M92 90l16 16M164 90l-16 16M92 162l16-16M164 162l-16-16" fill="none" stroke="#6f5a45" stroke-width="7" stroke-linecap="round"/>
  `),
  blossom: decorBase(`
    <circle cx="128" cy="128" r="18" fill="#f1b0b0" stroke="#6f5a45" stroke-width="6"/>
    <circle cx="128" cy="82" r="20" fill="#fff2ea" stroke="#6f5a45" stroke-width="6"/>
    <circle cx="166" cy="108" r="20" fill="#fff2ea" stroke="#6f5a45" stroke-width="6"/>
    <circle cx="152" cy="154" r="20" fill="#fff2ea" stroke="#6f5a45" stroke-width="6"/>
    <circle cx="104" cy="154" r="20" fill="#fff2ea" stroke="#6f5a45" stroke-width="6"/>
    <circle cx="90" cy="108" r="20" fill="#fff2ea" stroke="#6f5a45" stroke-width="6"/>
  `),
  wave: decorBase(`
    <path d="M66 150c18-18 34-18 52 0s34 18 52 0 34-18 52 0v32H66z" fill="#7bc8df" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M82 114c14 0 22 7 30 15 8-8 16-15 30-15s22 7 30 15c8-8 16-15 30-15" fill="none" stroke="#fff3de" stroke-width="8" stroke-linecap="round"/>
  `),
  leaf: decorBase(`
    <path d="M76 160c0-44 38-74 86-74 0 56-22 94-60 110-26 11-26-12-26-36z" fill="#d4955a" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M108 126c14 6 30 6 44 0M100 144c20 10 38 10 56 0M96 164c18 10 36 10 52 0" fill="none" stroke="#fff1dc" stroke-width="6" stroke-linecap="round"/>
    <path d="M140 82c-2 18-4 34-6 94" fill="none" stroke="#6f5a45" stroke-width="6" stroke-linecap="round"/>
  `),
  snowflake: decorBase(`
    <path d="M128 70v116M84 94l88 88M172 94l-88 88M72 128h112M86 72l84 112M170 72l-84 112" fill="none" stroke="#6f5a45" stroke-width="7" stroke-linecap="round"/>
    <circle cx="128" cy="128" r="20" fill="#cfe8ff" stroke="#6f5a45" stroke-width="6"/>
  `),
  picnic: decorBase(`
    <path d="M74 150h108l-16 38H90z" fill="#f4b26f" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M90 150l-10 38M120 150l-10 38M150 150l-10 38" stroke="#fff4e0" stroke-width="8" stroke-linecap="round"/>
    <path d="M96 112c20-18 44-18 64 0" fill="none" stroke="#6f5a45" stroke-width="7" stroke-linecap="round"/>
  `),
  window: decorBase(`
    <rect x="72" y="70" width="112" height="116" rx="16" fill="#fff8ea" stroke="#6f5a45" stroke-width="7"/>
    <path d="M128 70v116M72 128h112" fill="none" stroke="#6f5a45" stroke-width="7"/>
    <circle cx="152" cy="98" r="18" fill="#bfe7ff" stroke="#6f5a45" stroke-width="6"/>
    <path d="M88 144c20-20 40-28 64-28s44 8 64 28" fill="none" stroke="#93cb6a" stroke-width="8" stroke-linecap="round"/>
  `),
  moon: decorBase(`
    <path d="M158 72c-24 0-44 20-44 44s20 44 44 44c-14 18-34 28-56 28-35 0-64-29-64-64s29-64 64-64c22 0 42 10 56 12z" fill="#8f7abd" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <circle cx="102" cy="96" r="6" fill="#fff3d0"/>
    <circle cx="84" cy="140" r="5" fill="#fff3d0"/>
    <circle cx="170" cy="142" r="5" fill="#fff3d0"/>
  `),
  cloud: decorBase(`
    <path d="M82 150c-18 0-32-14-32-32s14-32 32-32c8-28 48-40 74-18 10-6 22-8 34-4 18 6 30 22 30 40 22 2 38 18 38 38 0 22-18 40-40 40H82c-18 0-32-14-32-32s14-32 32-32z" fill="#d7ebff" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
  `),
  springBlossom: decorBase(`
    <path d="M128 74c22 0 40 18 40 40s-18 40-40 40-40-18-40-40 18-40 40-40z" fill="#f7d4df" stroke="#6f5a45" stroke-width="7"/>
    <path d="M128 82c0 12-8 20-20 20M128 82c0 12 8 20 20 20M128 122c-12 0-20 8-20 20M128 122c12 0 20 8 20 20" fill="none" stroke="#6f5a45" stroke-width="6" stroke-linecap="round"/>
    <circle cx="128" cy="114" r="14" fill="#fff4ea" stroke="#6f5a45" stroke-width="6"/>
    <path d="M128 136v58" fill="none" stroke="#6e9a58" stroke-width="8" stroke-linecap="round"/>
  `),
  summerShell: decorBase(`
    <path d="M86 150c0-32 20-56 42-56s42 24 42 56c0 16-12 30-42 30s-42-14-42-30z" fill="#f4e1b8" stroke="#6f5a45" stroke-width="7"/>
    <path d="M128 98v82M112 104v74M96 114v60M144 104v74M160 114v60" fill="none" stroke="#d0a86c" stroke-width="6" stroke-linecap="round"/>
    <circle cx="128" cy="154" r="12" fill="#ffcf87" stroke="#6f5a45" stroke-width="6"/>
  `),
  autumnLeaf: decorBase(`
    <path d="M88 158c0-30 24-64 66-64 0 58-24 96-66 112-12-14-12-30 0-48z" fill="#e09b54" stroke="#6f5a45" stroke-width="7" stroke-linejoin="round"/>
    <path d="M120 108c18 6 36 6 54 0M108 128c16 8 32 8 48 0M100 148c14 8 28 8 42 0" fill="none" stroke="#fff1d8" stroke-width="6" stroke-linecap="round"/>
    <path d="M154 96c0 24-6 52-18 86" fill="none" stroke="#6e9a58" stroke-width="7" stroke-linecap="round"/>
  `),
  winterSnow: decorBase(`
    <circle cx="128" cy="128" r="44" fill="#d7ebff" stroke="#6f5a45" stroke-width="7"/>
    <path d="M128 78v100M78 128h100M92 92l72 72M164 92l-72 72" fill="none" stroke="#6f5a45" stroke-width="7" stroke-linecap="round"/>
    <circle cx="128" cy="128" r="12" fill="#fffef7" stroke="#6f5a45" stroke-width="6"/>
  `),
}

const assets = [
  { dir: 'ingredients', entries: ingredientIcons },
  { dir: 'decor', entries: decorIcons },
] as const

async function writeIcon(filePath: string, svg: string) {
  await sharp(Buffer.from(svg)).png().toFile(filePath)
}

async function main() {
  await ensureDir(outDir)
  for (const { dir, entries } of assets) {
    await ensureDir(path.join(outDir, dir))
    for (const [name, svg] of Object.entries(entries)) {
      await writeIcon(path.join(outDir, dir, `${name}.png`), svg)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
