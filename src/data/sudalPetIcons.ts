import type { DecorItem } from '../types'

const ingredientIcons = import.meta.glob('../assets/sudal-icons/ingredients/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const decorIcons = import.meta.glob('../assets/sudal-icons/decor/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function pickIngredientIconKey(name: string) {
  if (name.includes('수박')) return 'watermelon'
  if (name.includes('콩국수') || name.includes('소면') || name.includes('파스타')) return 'noodle'
  if (name.includes('콩국물') || name.includes('우유') || name.includes('요거트')) return 'milk'
  if (name.includes('복숭아') || name.includes('자두')) return 'peach'
  if (name.includes('옥수수')) return 'corn'
  if (name.includes('토마토')) return 'tomato'
  if (name.includes('오이') || name.includes('애호박') || name.includes('주키니')) return 'cucumber'
  if (name.includes('가지')) return 'eggplant'
  if (name.includes('귤') || name.includes('한라봉')) return 'citrus'
  if (name.includes('배추') || name.includes('봄동') || name.includes('열무') || name.includes('시금치') || name.includes('아스파라거스')) return 'greens'
  if (name.includes('굴') || name.includes('바지락') || name.includes('꼬막')) return 'shell'
  if (name.includes('무')) return 'radish'
  if (name.includes('고구마')) return 'sweetPotato'
  if (name.includes('버섯')) return 'mushroom'
  if (name.includes('딸기')) return 'strawberry'
  if (name.includes('샐러드')) return 'salad'
  if (name.includes('치즈')) return 'cheese'
  if (name.includes('쌀') || name.includes('밥')) return 'rice'
  return 'bag'
}

function pickDecorIconKey(item: DecorItem) {
  if (item.unlockSeasonKey === 'spring' || item.name.includes('봄꽃')) return 'springBlossom'
  if (item.unlockSeasonKey === 'summer' || item.name.includes('조개')) return 'summerShell'
  if (item.unlockSeasonKey === 'autumn' || item.name.includes('단풍')) return 'autumnLeaf'
  if (item.unlockSeasonKey === 'winter' || item.name.includes('눈꽃')) return 'winterSnow'
  if (item.type === 'background') {
    if (item.name.includes('봄꽃') || item.name.includes('딸기')) return 'blossom'
    if (item.name.includes('바닷가') || item.name.includes('빗방울')) return 'wave'
    if (item.name.includes('낙엽') || item.name.includes('단풍')) return 'leaf'
    if (item.name.includes('눈꽃') || item.name.includes('눈사람')) return 'snowflake'
    if (item.name.includes('피크닉') || item.name.includes('캠핑')) return 'picnic'
    if (item.name.includes('창가')) return 'window'
    if (item.name.includes('야시장') || item.name.includes('밤')) return 'moon'
    if (item.name.includes('구름')) return 'cloud'
    return 'sunny'
  }

  if (item.type === 'outfit') return 'bag'
  return 'bag'
}

function resolveAsset(map: Record<string, string>, key: string) {
  return map[`../assets/sudal-icons/${key}`] ?? ''
}

export function getPetFeedIconImage(name: string) {
  const key = pickIngredientIconKey(name)
  return resolveAsset(ingredientIcons, `ingredients/${key}.png`)
}

export function getPetDecorIconImage(item: DecorItem) {
  const key = pickDecorIconKey(item)
  return resolveAsset(decorIcons, `decor/${key}.png`)
}

export function getPetShareIconImage() {
  return resolveAsset(ingredientIcons, 'ingredients/camera.png')
}

export function getPetClearDecorIconImage() {
  return resolveAsset(decorIcons, 'decor/clear.png')
}
