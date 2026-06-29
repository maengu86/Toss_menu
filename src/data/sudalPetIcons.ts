import type { DecorItem } from '../types'

const ingredientIcons = import.meta.glob('../assets/sudal-icons/ingredients/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const summerIngredientIcons = import.meta.glob('../assets/sudal-icons/ingredients/summer-final/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const autumnIngredientIcons = import.meta.glob('../assets/sudal-icons/ingredients/autumn-final/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const winterIngredientIcons = import.meta.glob('../assets/sudal-icons/ingredients/winter-final/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const decorIcons = import.meta.glob('../assets/sudal-icons/decor/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const uiIcons = import.meta.glob('../assets/sudal-icons/ui/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const ingredientIconKeyById: Record<string, string> = {
  apple: 'apple',
  'bamboo-shoot': 'bambooShoot',
  burdock: 'burdock',
  cabbage: 'cabbage',
  chestnut: 'chestnut',
  clam: 'clam',
  cockle: 'cockle',
  cod: 'cod',
  corn: 'corn',
  cucumber: 'cucumber',
  dallae: 'dallae',
  dureup: 'dureup',
  eel: 'eel',
  eggplant: 'eggplant',
  fig: 'fig',
  'gizzard-shad': 'gizzardShad',
  grape: 'grape',
  hallabong: 'hallabong',
  jukkumi: 'jukkumi',
  'lotus-root': 'lotusRoot',
  mackerel: 'mackerel',
  mandarin: 'mandarin',
  melon: 'melon',
  minari: 'minari',
  mugwort: 'mugwort',
  mushroom: 'mushroom',
  naengi: 'naengi',
  oyster: 'oyster',
  peach: 'peach',
  pear: 'pear',
  pepper: 'pepper',
  'perilla-leaf': 'perillaLeaf',
  persimmon: 'persimmon',
  plum: 'plum',
  potato: 'potato',
  pumpkin: 'pumpkin',
  radish: 'radish',
  shrimp: 'shrimp',
  spinach: 'spinach',
  'spring-cabbage': 'springCabbage',
  strawberry: 'strawberry',
  'sweet-potato': 'sweetPotato',
  tomato: 'tomato',
  watermelon: 'watermelon',
  yellowtail: 'yellowtail',
  'young-radish': 'youngRadish',
  zucchini: 'zucchini',
}

function pickIngredientIconKey(name: string) {
  if (name.includes('타르트지')) return 'tartCrust'
  if (name.includes('그릭요거트')) return 'greekYogurt'
  if (name.includes('버터')) return 'butter'
  if (name.includes('젤라틴')) return 'gelatin'
  if (name.includes('베리')) return 'berry'
  if (name.includes('상추')) return 'lettuce'
  if (name.includes('무순')) return 'radishSprout'
  if (name.includes('생강')) return 'ginger'
  if (name.includes('새우젓')) return 'saltedShrimp'
  if (name.includes('멸치')) return 'anchovy'
  if (name.includes('마요네즈')) return 'mayonnaise'
  if (name.includes('올리고당')) return 'oligosaccharide'
  if (name.includes('데리야키소스')) return 'teriyakiSauce'
  if (name.includes('쌈장')) return 'ssamjang'
  if (name.includes('초고추장')) return 'choGochujang'
  if (name.includes('루꼴라')) return 'arugula'
  if (name.includes('막걸리')) return 'makgeolli'
  if (name.includes('크림치즈')) return 'creamCheese'
  if (name.includes('연유')) return 'condensedMilk'
  if (name.includes('미역')) return 'seaweed'
  if (name.includes('김')) return 'gim'
  if (name.includes('오징어')) return 'squid'
  if (name.includes('대추')) return 'jujube'
  if (name.includes('견과류')) return 'nuts'
  if (name.includes('탄산수')) return 'sparklingWater'
  if (name.includes('민트')) return 'mint'
  if (name.includes('얼음')) return 'ice'
  if (name.includes('설탕')) return 'sugar'
  if (name.includes('꿀')) return 'honey'
  if (name.includes('식초')) return 'vinegar'
  if (name.includes('소금')) return 'salt'
  if (name.includes('깨')) return 'sesame'
  if (name.includes('참기름')) return 'sesameOil'
  if (name.includes('고추장')) return 'gochujang'
  if (name.includes('고춧가루')) return 'chiliPowder'
  if (name.includes('대파') || name.includes('쪽파') || name.includes('부추')) return 'greenOnion'
  if (name.includes('양파')) return 'onion'
  if (name.includes('마늘')) return 'garlic'
  if (name.includes('당근')) return 'carrot'
  if (name.includes('바질')) return 'basil'
  if (name.includes('레몬')) return 'lemon'
  if (name.includes('요거트')) return 'yogurt'
  if (name.includes('리코타')) return 'ricotta'
  if (name.includes('모차렐라')) return 'mozzarella'
  if (name.includes('그래놀라')) return 'granola'
  if (name.includes('화이트와인')) return 'whiteWine'
  if (name.includes('육수')) return 'broth'
  if (name.includes('고기') || name.includes('돼지고기') || name.includes('소고기')) return 'meat'
  if (name.includes('콩국물') || name.includes('우유')) return 'milk'
  if (name.includes('칼국수면')) return 'kalguksuNoodle'
  if (name.includes('콩국수면')) return 'kongguksuNoodle'
  if (name.includes('소면')) return 'somyeon'
  if (name.includes('파스타면')) return 'pastaNoodle'
  if (name.includes('식빵') || name.includes('케이크 시트')) return 'bread'
  if (name.includes('생크림') || name.includes('크림')) return 'cream'
  if (name.includes('달걀')) return 'egg'
  if (name.includes('찹쌀가루')) return 'sweetRiceFlour'
  if (name.includes('콩가루')) return 'soybeanPowder'
  if (name.includes('밀가루') || name.includes('부침가루') || name.includes('튀김가루')) return 'flour'
  if (name.includes('식용유') || name.includes('올리브오일')) return 'cookingOil'
  if (name.includes('간장')) return 'soySauce'
  if (name.includes('달래')) return 'dallae'
  if (name.includes('냉이')) return 'naengi'
  if (name.includes('딸기')) return 'strawberry'
  if (name.includes('주꾸미') || name.includes('쭈꾸미')) return 'jukkumi'
  if (name.includes('봄동')) return 'springCabbage'
  if (name.includes('두릅')) return 'dureup'
  if (name.includes('미나리')) return 'minari'
  if (name.includes('쑥')) return 'mugwort'
  if (name.includes('죽순')) return 'bambooShoot'
  if (name.includes('바지락')) return 'clam'
  if (name.includes('수박')) return 'watermelon'
  if (name.includes('콩국') || name.includes('라면') || name.includes('파스타')) return 'noodle'
  if (name.includes('콩국물') || name.includes('우유') || name.includes('요거트')) return 'milk'
  if (name.includes('복숭아')) return 'peach'
  if (name.includes('초당옥수수') || name.includes('옥수수')) return 'corn'
  if (name.includes('토마토')) return 'tomato'
  if (name.includes('오이')) return 'cucumber'
  if (name.includes('가지')) return 'eggplant'
  if (name.includes('참외')) return 'melon'
  if (name.includes('꽈리고추') || name.includes('고추')) return 'pepper'
  if (name.includes('애호박') || name.includes('주키니')) return 'zucchini'
  if (name.includes('깻잎')) return 'perillaLeaf'
  if (name.includes('감자')) return 'potato'
  if (name.includes('열무')) return 'youngRadish'
  if (name.includes('자두')) return 'plum'
  if (name.includes('포도')) return 'grape'
  if (name.includes('장어')) return 'eel'
  if (name.includes('전어')) return 'gizzardShad'
  if (name.includes('고구마')) return 'sweetPotato'
  if (name.includes('버섯')) return 'mushroom'
  if (name.includes('배') && !name.includes('배추')) return 'pear'
  if (name.includes('밤')) return 'chestnut'
  if (name.includes('단호박') || name.includes('호박')) return 'pumpkin'
  if (name.includes('사과')) return 'apple'
  if (name.includes('새우') || name.includes('대하')) return 'shrimp'
  if (name.includes('감')) return 'persimmon'
  if (name.includes('무화과')) return 'fig'
  if (name.includes('고등어')) return 'mackerel'
  if (name.includes('굴')) return 'oyster'
  if (name.includes('무')) return 'radish'
  if (name.includes('배추')) return 'cabbage'
  if (name.includes('귤')) return 'mandarin'
  if (name.includes('대구')) return 'cod'
  if (name.includes('시금치')) return 'spinach'
  if (name.includes('꼬막')) return 'cockle'
  if (name.includes('연근')) return 'lotusRoot'
  if (name.includes('우엉')) return 'burdock'
  if (name.includes('한라봉')) return 'hallabong'
  if (name.includes('방어')) return 'yellowtail'
  if (name.includes('귤') || name.includes('한라봉')) return 'citrus'
  if (name.includes('배추') || name.includes('무') || name.includes('시금치')) return 'greens'
  if (name.includes('굴') || name.includes('꼬막')) return 'shell'
  if (name.includes('무')) return 'radish'
  if (name.includes('고구마')) return 'sweetPotato'
  if (name.includes('버섯')) return 'mushroom'
  if (name.includes('식빵') || name.includes('빵')) return 'bread'
  if (name.includes('생크림') || name.includes('크림')) return 'cream'
  if (name.includes('달걀') || name.includes('계란')) return 'egg'
  if (name.includes('두부')) return 'tofu'
  if (name.includes('된장')) return 'doenjang'
  if (name.includes('간장')) return 'soySauce'
  if (name.includes('부침가루') || name.includes('튀김가루') || name.includes('밀가루')) return 'flour'
  if (name.includes('식용유') || name.includes('올리브오일')) return 'cookingOil'
  if (name.includes('샐러드')) return 'salad'
  if (name.includes('치즈')) return 'cheese'
  if (name.includes('밥') || name.includes('쌀')) return 'rice'
  return 'bag'
}

function pickDecorIconKey(item: DecorItem) {
  if (item.unlockSeasonKey === 'spring') return 'springBlossom'
  if (item.unlockSeasonKey === 'summer') return 'summerShell'
  if (item.unlockSeasonKey === 'autumn') return 'autumnLeaf'
  if (item.unlockSeasonKey === 'winter') return 'winterSnow'
  if (item.type === 'background') {
    if (item.name.includes('봄') || item.name.includes('딸기')) return 'blossom'
    if (item.name.includes('바다') || item.name.includes('비')) return 'wave'
    if (item.name.includes('가을') || item.name.includes('단풍')) return 'leaf'
    if (item.name.includes('눈') || item.name.includes('겨울')) return 'snowflake'
    if (item.name.includes('피크닉') || item.name.includes('캠핑')) return 'picnic'
    if (item.name.includes('창가')) return 'window'
    if (item.name.includes('밤') || item.name.includes('별')) return 'moon'
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

  return summerIngredientIcons[`../assets/sudal-icons/ingredients/summer-final/${key}.png`]
    ?? autumnIngredientIcons[`../assets/sudal-icons/ingredients/autumn-final/${key}.png`]
    ?? winterIngredientIcons[`../assets/sudal-icons/ingredients/winter-final/${key}.png`]
    ?? resolveAsset(ingredientIcons, `ingredients/${key}.png`)
}

export function getPetFeedIconImageById(id: string) {
  const key = ingredientIconKeyById[id]
  if (!key) return ''

  return summerIngredientIcons[`../assets/sudal-icons/ingredients/summer-final/${key}.png`]
    ?? autumnIngredientIcons[`../assets/sudal-icons/ingredients/autumn-final/${key}.png`]
    ?? winterIngredientIcons[`../assets/sudal-icons/ingredients/winter-final/${key}.png`]
    ?? resolveAsset(ingredientIcons, `ingredients/${key}.png`)
}

export function getPetDecorIconImage(item: DecorItem) {
  const key = pickDecorIconKey(item)
  return resolveAsset(decorIcons, `decor/${key}.png`)
}

export function getPetUiIconImage(key: string) {
  return resolveAsset(uiIcons, `ui/${key}.png`)
}

export function getPetShareIconImage() {
  return getPetUiIconImage('camera') || resolveAsset(ingredientIcons, 'ingredients/camera.png')
}

export function getPetClearDecorIconImage() {
  return resolveAsset(decorIcons, 'decor/clear.png')
}
