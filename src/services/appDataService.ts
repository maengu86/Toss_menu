import { supabase } from '../lib/supabase'
import {
  decorItems as fallbackDecorItems,
  menus as fallbackMenus,
  seasonalIngredients as fallbackSeasonalIngredients,
  seasons as fallbackSeasons,
} from '../data'
import type { DecorItem, Ingredient, Menu, SeasonalIngredient, SeasonKey } from '../types'

type AppData = {
  decorItems: DecorItem[]
  menus: Menu[]
  seasonalIngredients: SeasonalIngredient[]
  seasons: { key: SeasonKey; label: string; accent: string }[]
}

type SeasonRow = {
  key: SeasonKey
  label: string
  accent: string
}

type SeasonalIngredientRow = {
  id: string
  name: string
  season: string
  season_key: SeasonKey
  emoji: string
}

type MenuIngredientRow = {
  name: string
  quantity: string
  price: number
  sort_order: number
}

type MenuSeasonalIngredientRow = {
  ingredient_id: string
}

type MenuRow = {
  id: string
  name: string
  season: string
  weather: string
  description: string | null
  exp: number
  color: string
  image: string | null
  image_fallback: string | null
  menu_ingredients: MenuIngredientRow[] | null
  menu_seasonal_ingredients: MenuSeasonalIngredientRow[] | null
}

type DecorItemRow = {
  id: string
  name: string
  type: DecorItem['type']
  badge: string | null
  unlock_level: number | null
  unlock_by_shopping: boolean | null
}

const hiddenSeasonalIngredientIds = new Set(['asparagus'])
const hiddenMenuIds = new Set([
  'strawberry-cake',
  'strawberry-tart',
  'strawberry-cake-tart',
  'jukkumi-ramen',
  'jukkumi-ramen-jjamppong',
  'jukkumi-jjamppong',
  'jukkumi-jjamppong-tang',
  'jukkumi-jjamppongtang',
  'jukkumi-spicy-seafood-soup',
])
const hiddenMenuNameWords = [
  '아스파라거스',
  '딸기케이크',
  '딸기타르트',
  '딸기타르느',
  '딸기케이스',
  '주꾸미라면',
  '쭈꾸미라면',
  '쭈구미라면',
  '주꾸미짬뽕',
  '쭈꾸미짬뽕',
  '쭈구미짬뽕',
  '주꾸미짬뽕탕',
  '쭈꾸미짬뽕탕',
  '쭈구미짬뽕탕',
]

export const fallbackAppData: AppData = {
  decorItems: fallbackDecorItems,
  menus: normalizeMenuCatalog(fallbackMenus),
  seasonalIngredients: filterVisibleSeasonalIngredients(fallbackSeasonalIngredients),
  seasons: fallbackSeasons,
}

const menuOrder = createOrderMap(fallbackMenus)
const seasonalIngredientOrder = createOrderMap(fallbackSeasonalIngredients)
const decorItemOrder = createOrderMap(fallbackDecorItems)

export async function loadAppData(): Promise<AppData> {
  if (!supabase) return fallbackAppData

  const [seasonsResult, seasonalIngredientsResult, menusResult] = await Promise.all([
    supabase.from('seasons').select('key, label, accent').order('sort_order'),
    supabase.from('seasonal_ingredients').select('id, name, season, season_key, emoji').order('id'),
    supabase
      .from('menus')
      .select(`
        id,
        name,
        season,
        weather,
        description,
        exp,
        color,
        image,
        image_fallback,
        menu_ingredients (
          name,
          quantity,
          price,
          sort_order
        ),
        menu_seasonal_ingredients (
          ingredient_id
        )
      `)
      .order('id'),
  ])
  let decorItemsResult: { data: unknown[] | null; error: { message: string } | null } = await supabase
    .from('decor_items')
    .select('id, name, type, badge, unlock_level, unlock_by_shopping')
    .order('id')

  if (decorItemsResult.error && decorItemsResult.error.message.includes('badge')) {
    decorItemsResult = await supabase.from('decor_items').select('id, name, type, unlock_level, unlock_by_shopping').order('id')
  }

  const errors = [
    seasonsResult.error,
    seasonalIngredientsResult.error,
    menusResult.error,
    decorItemsResult.error,
  ].filter(Boolean)

  if (errors.length > 0) {
    throw new Error(errors.map((error) => error?.message).join('\n'))
  }

  const remoteDecorItems = ((decorItemsResult.data ?? []) as DecorItemRow[])
    .map(mapDecorItem)
    .sort((a, b) => compareByKnownOrder(a.id, b.id, decorItemOrder))
  const decorItems = mergeDecorItems(remoteDecorItems)

  const remoteMenus = ((menusResult.data ?? []) as MenuRow[])
    .map(mapMenu)
    .sort((a, b) => compareByKnownOrder(a.id, b.id, menuOrder))
  const menus = normalizeMenuCatalog(mergeMenus(remoteMenus))

  const seasonalIngredients = filterVisibleSeasonalIngredients(((seasonalIngredientsResult.data ?? []) as SeasonalIngredientRow[])
    .map(mapSeasonalIngredient)
    .sort((a, b) => compareByKnownOrder(a.id, b.id, seasonalIngredientOrder)))

  return {
    decorItems: decorItems.length > 0 ? decorItems : fallbackDecorItems,
    menus: menus.length > 0 ? menus : fallbackAppData.menus,
    seasonalIngredients: seasonalIngredients.length > 0 ? seasonalIngredients : fallbackAppData.seasonalIngredients,
    seasons: seasonsResult.data && seasonsResult.data.length > 0 ? (seasonsResult.data as SeasonRow[]) : fallbackSeasons,
  }
}

function mapSeasonalIngredient(row: SeasonalIngredientRow): SeasonalIngredient {
  return {
    id: row.id,
    name: formatSeasonalIngredientName(row.name),
    season: row.season,
    seasonKey: row.season_key,
    emoji: row.emoji,
  }
}

function formatSeasonalIngredientName(name: string) {
  if (name === '초당옥수수') return '초당 옥수수'
  if (name === '꽈리고추') return '꽈리 고추'
  return name
}

function mapMenu(row: MenuRow): Menu {
  const name = normalizeMenuDisplayName(row.name, row.id)
  const ingredients = sanitizeMenuIngredients(name, [...(row.menu_ingredients ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map<Ingredient>((ingredient) => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
      price: ingredient.price,
    })))

  return {
    id: row.id,
    name,
    season: row.season,
    weather: row.weather,
    description: row.description ?? '',
    exp: ingredients.reduce((total, ingredient) => total + ingredient.price, 0),
    color: row.color,
    image: row.image ?? '',
    imageFallback: row.image_fallback ?? '🍽️',
    seasonalIngredientIds: (row.menu_seasonal_ingredients ?? []).map((ingredient) => ingredient.ingredient_id),
    ingredients,
  }
}

function sanitizeMenuIngredients(menuName: string, ingredients: Ingredient[]) {
  const menuKey = normalizeIngredientCompareText(menuName)
  const seen = new Set<string>()

  return ingredients.filter((ingredient) => {
    const ingredientKey = normalizeIngredientCompareText(ingredient.name)
    if (!ingredientKey || ingredientKey === menuKey) return false
    if (seen.has(ingredientKey)) return false
    seen.add(ingredientKey)
    return true
  })
}

function normalizeIngredientCompareText(value: string) {
  return value.replace(/[\s/·・,()[\]-]/g, '').toLowerCase()
}

function mergeMenus(remoteMenus: Menu[]) {
  const remoteById = new Map(remoteMenus.map((menu) => [menu.id, menu]))
  const fallbackIds = new Set(fallbackMenus.map((menu) => menu.id))
  const knownMenus = fallbackMenus.map((fallbackMenu) => {
    const remoteMenu = remoteById.get(fallbackMenu.id)
    if (!remoteMenu) return fallbackMenu

    const remoteIngredientsByName = new Map(remoteMenu.ingredients.map((ingredient) => [ingredient.name, ingredient]))
    const fallbackIngredientNames = new Set(fallbackMenu.ingredients.map((ingredient) => ingredient.name))
    const ingredients = [
      ...fallbackMenu.ingredients.map((fallbackIngredient) => {
        const remoteIngredient = remoteIngredientsByName.get(fallbackIngredient.name)
        return remoteIngredient
          ? {
            ...fallbackIngredient,
            ...remoteIngredient,
            price: remoteIngredient.price > 0 ? remoteIngredient.price : fallbackIngredient.price,
          }
          : fallbackIngredient
      }),
      ...remoteMenu.ingredients.filter((ingredient) => !fallbackIngredientNames.has(ingredient.name)),
    ]

    return {
      ...fallbackMenu,
      ...remoteMenu,
      ingredients,
      seasonalIngredientIds: remoteMenu.seasonalIngredientIds?.length
        ? remoteMenu.seasonalIngredientIds
        : fallbackMenu.seasonalIngredientIds,
      exp: ingredients.reduce((total, ingredient) => total + ingredient.price, 0),
    }
  })
  const remoteOnlyMenus = remoteMenus
    .filter((menu) => !fallbackIds.has(menu.id))
    .map((menu) => {
      const remoteIngredientExp = menu.ingredients.reduce((total, ingredient) => total + ingredient.price, 0)
      const ingredients = remoteIngredientExp > 0
        ? menu.ingredients
        : createMissingMenuIngredients(menu.name, menu.seasonalIngredientIds)

      return {
        ...menu,
        ingredients,
        exp: ingredients.reduce((total, ingredient) => total + ingredient.price, 0),
      }
    })

  return [...knownMenus, ...remoteOnlyMenus]
}

const primaryIngredientDefaults = [
  { keywords: ['감자'], name: '감자', quantity: '3개', price: 3600 },
  { keywords: ['곶감'], name: '감', quantity: '2개', price: 4300 },
  { keywords: ['사과'], name: '사과', quantity: '2개', price: 4200 },
  { keywords: ['죽순'], name: '죽순', quantity: '1팩', price: 6200 },
  { keywords: ['우엉'], name: '우엉', quantity: '1팩', price: 3600 },
  { keywords: ['바지락', '봉골레'], name: '바지락', quantity: '300g', price: 7600 },
  { keywords: ['꼬막'], name: '꼬막', quantity: '300g', price: 9800 },
  { keywords: ['두릅'], name: '두릅', quantity: '1팩', price: 6200 },
  { keywords: ['장어'], name: '장어', quantity: '1팩', price: 14800 },
  { keywords: ['무화과'], name: '무화과', quantity: '4개', price: 7200 },
  { keywords: ['포도'], name: '포도', quantity: '1송이', price: 6200 },
  { keywords: ['한라봉'], name: '한라봉', quantity: '2개', price: 7800 },
  { keywords: ['연근'], name: '연근', quantity: '1팩', price: 4200 },
  { keywords: ['고등어'], name: '고등어', quantity: '1마리', price: 6800 },
  { keywords: ['참외'], name: '참외', quantity: '2개', price: 5400 },
  { keywords: ['미나리'], name: '미나리', quantity: '1단', price: 3600 },
  { keywords: ['쑥'], name: '쑥', quantity: '1봉', price: 2800 },
  { keywords: ['꽈리고추'], name: '꽈리고추', quantity: '1봉', price: 2400 },
  { keywords: ['깻잎'], name: '깻잎', quantity: '2묶음', price: 2800 },
  { keywords: ['감'], name: '감', quantity: '2개', price: 4300 },
  { keywords: ['자두'], name: '자두', quantity: '5개', price: 5800 },
  { keywords: ['대하'], name: '대하', quantity: '300g', price: 12000 },
  { keywords: ['방어'], name: '방어', quantity: '200g', price: 13800 },
  { keywords: ['열무'], name: '열무김치', quantity: '1팩', price: 5600 },
  { keywords: ['애호박'], name: '애호박', quantity: '1개', price: 1800 },
] as const

const defaultSupportingIngredients: [Ingredient, Ingredient] = [
  { name: '양파', quantity: '1개', price: 1200 },
  { name: '간장', quantity: '1병', price: 3100 },
]

function createMissingMenuIngredients(menuName: string, seasonalIngredientIds: string[] = []): Ingredient[] {
  const primary = findSeasonalIngredientReference(seasonalIngredientIds)
    ?? primaryIngredientDefaults.find((item) => item.keywords.some((keyword) => menuName.includes(keyword)))
  const supporting = getSupportingIngredients(menuName)

  return [
    ...(primary ? [{ name: primary.name, quantity: primary.quantity, price: primary.price }] : []),
    ...supporting,
  ]
}

function findSeasonalIngredientReference(seasonalIngredientIds: string[]) {
  for (const seasonalIngredientId of seasonalIngredientIds) {
    const seasonalIngredient = fallbackSeasonalIngredients.find((item) => item.id === seasonalIngredientId)
    if (!seasonalIngredient) continue

    const ingredientName = normalizeIngredientCompareText(seasonalIngredient.name)
    const candidates = fallbackMenus
      .filter((menu) => menu.seasonalIngredientIds?.includes(seasonalIngredientId))
      .flatMap((menu) => menu.ingredients)
    const reference = candidates.find((ingredient) => normalizeIngredientCompareText(ingredient.name) === ingredientName)
      ?? candidates.find((ingredient) => normalizeIngredientCompareText(ingredient.name).includes(ingredientName))

    if (reference) return reference
  }

  return undefined
}

function getSupportingIngredients(menuName: string): [Ingredient, Ingredient] {
  if (/파이|타르트/.test(menuName)) {
    return [{ name: '밀가루', quantity: '1봉', price: 2800 }, { name: '버터', quantity: '1개', price: 3200 }]
  }
  if (/잼|청|마말레이드/.test(menuName)) {
    return [{ name: '설탕', quantity: '1봉', price: 2300 }, { name: '레몬', quantity: '1개', price: 1500 }]
  }
  if (/조림/.test(menuName)) {
    return [{ name: '간장', quantity: '1병', price: 3100 }, { name: '올리고당', quantity: '1병', price: 3600 }]
  }
  if (/주스|에이드|화채/.test(menuName)) {
    return [{ name: '탄산수', quantity: '1병', price: 1800 }, { name: '꿀', quantity: '1병', price: 4300 }]
  }
  if (/샐러드/.test(menuName)) {
    return [{ name: '샐러드 채소', quantity: '1팩', price: 3200 }, { name: '치즈', quantity: '1봉', price: 4800 }]
  }
  if (/된장찌개|된장국/.test(menuName)) {
    return [{ name: '된장', quantity: '1통', price: 4200 }, { name: '두부', quantity: '1모', price: 2500 }]
  }
  if (/전$/.test(menuName)) {
    return [{ name: '부침가루', quantity: '1봉', price: 3300 }, { name: '달걀', quantity: '6구', price: 4200 }]
  }
  if (/튀김/.test(menuName)) {
    return [{ name: '튀김가루', quantity: '1봉', price: 3300 }, { name: '식용유', quantity: '1병', price: 4500 }]
  }
  if (/구이/.test(menuName)) {
    return [{ name: '굵은소금', quantity: '1봉', price: 1800 }, { name: '레몬', quantity: '1개', price: 1500 }]
  }
  if (/회$/.test(menuName)) {
    return [{ name: '무순', quantity: '1팩', price: 1800 }, { name: '간장', quantity: '1병', price: 3100 }]
  }
  if (/초밥|비빔밥|밥$/.test(menuName)) {
    return [{ name: '쌀', quantity: '2컵', price: 1800 }, { name: '간장', quantity: '1병', price: 3100 }]
  }
  if (/김치|소박이/.test(menuName)) {
    return [{ name: '부추', quantity: '1줌', price: 2200 }, { name: '고춧가루', quantity: '1봉', price: 4200 }]
  }
  if (/장아찌|피클/.test(menuName)) {
    return [{ name: '식초', quantity: '1병', price: 2900 }, { name: '간장', quantity: '1병', price: 3100 }]
  }
  if (/무침|나물|숙회|데침/.test(menuName)) {
    return [{ name: '참기름', quantity: '1병', price: 5900 }, { name: '깨', quantity: '1봉', price: 2200 }]
  }
  if (/떡|인절미/.test(menuName)) {
    return [{ name: '찹쌀가루', quantity: '1봉', price: 3500 }, { name: '콩가루', quantity: '1봉', price: 2800 }]
  }
  if (/말랭이|차$/.test(menuName)) {
    return [{ name: '설탕', quantity: '1봉', price: 2300 }, { name: '꿀', quantity: '1병', price: 4300 }]
  }
  if (/파스타/.test(menuName)) {
    return [{ name: '파스타면', quantity: '1봉', price: 3300 }, { name: '올리브오일', quantity: '1병', price: 6500 }]
  }
  if (/술찜/.test(menuName)) {
    return [{ name: '화이트와인', quantity: '1병', price: 8900 }, { name: '버터', quantity: '1개', price: 3200 }]
  }
  if (/탕|국|백숙|전골|찜/.test(menuName)) {
    return [{ name: '육수', quantity: '1팩', price: 3300 }, { name: '대파', quantity: '1대', price: 1200 }]
  }
  if (/볶음/.test(menuName)) {
    return [{ name: '양파', quantity: '1개', price: 1200 }, { name: '간장', quantity: '1병', price: 3100 }]
  }

  return defaultSupportingIngredients
}

function normalizeMenuCatalog(menus: Menu[]) {
  const standaloneNames = new Set(menus
    .filter((menu) => !isHiddenMenu(menu) && !hasCombinedMenuName(menu.name))
    .map((menu) => getMenuNameKey(menu.name)))
  const normalizedMenus: Menu[] = []
  const usedIds = new Set<string>()
  const usedNames = new Set<string>()

  for (const menu of menus) {
    if (isHiddenMenu(menu)) continue

    const menuNames = splitCombinedMenuName(menu.name)
    if (menuNames.length <= 1) {
      addMenu(menu)
      continue
    }

    menuNames.forEach((name, index) => {
      if (standaloneNames.has(name)) return

      addMenu({
        ...menu,
        id: createSplitMenuId(menu.id, index, usedIds),
        name,
      })
    })
  }

  return normalizedMenus

  function addMenu(menu: Menu) {
    const key = getMenuNameKey(menu.name)
    if (usedNames.has(key)) return

    normalizedMenus.push(menu)
    usedIds.add(menu.id)
    usedNames.add(key)
  }
}

function filterVisibleSeasonalIngredients(ingredients: SeasonalIngredient[]) {
  return ingredients.filter((ingredient) => !hiddenSeasonalIngredientIds.has(ingredient.id))
}

function normalizeMenuDisplayName(name: string, id?: string) {
  if (id === 'spring-herb-bibimbap') return '달래비빔밥'

  return name.replace(/\s+/g, '')
}

function isHiddenMenu(menu: Menu) {
  const menuNameKey = getMenuNameKey(menu.name)

  return hiddenMenuIds.has(menu.id)
    || menu.seasonalIngredientIds?.some((id) => hiddenSeasonalIngredientIds.has(id))
    || isHiddenSeasonalMenu(menu, menuNameKey)
    || hiddenMenuNameWords.some((word) => menuNameKey.includes(getMenuNameKey(word)))
    || menu.ingredients.some((ingredient) => {
      const ingredientNameKey = getMenuNameKey(ingredient.name)
      return hiddenMenuNameWords.some((word) => ingredientNameKey.includes(getMenuNameKey(word)))
    })
}

function isHiddenSeasonalMenu(menu: Menu, menuNameKey: string) {
  const seasonalIngredientIds = menu.seasonalIngredientIds ?? []
  const isStrawberryMenu = seasonalIngredientIds.includes('strawberry')
  const isJukkumiMenu = seasonalIngredientIds.includes('jukkumi')
  const isPumpkinMenu = seasonalIngredientIds.includes('pumpkin')
  const isMandarinMenu = seasonalIngredientIds.includes('mandarin')
  if (isPumpkinMenu && menuNameKey === '빵') return true
  if (isMandarinMenu && menuNameKey === '귤') return true

  return (isStrawberryMenu && /케이크|케이스|타르트|타르느/.test(menuNameKey))
    || (isJukkumiMenu && /라면|짬뽕/.test(menuNameKey))
}

function hasCombinedMenuName(name: string) {
  return /[/／]/.test(name)
}

function splitCombinedMenuName(name: string) {
  return name
    .split(/[/／]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function getMenuNameKey(name: string) {
  return name
    .normalize('NFKC')
    .replace(/[\s·ㆍ,，/／_-]+/g, '')
    .toLowerCase()
}

function createSplitMenuId(baseId: string, index: number, usedIds: Set<string>) {
  const baseSplitId = `${baseId}-part-${index + 1}`
  if (!usedIds.has(baseSplitId)) return baseSplitId

  let suffix = 2
  while (usedIds.has(`${baseSplitId}-${suffix}`)) suffix += 1
  return `${baseSplitId}-${suffix}`
}

function mapDecorItem(row: DecorItemRow): DecorItem {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    badge: row.badge ?? undefined,
    unlockLevel: row.unlock_level ?? undefined,
    unlockByShopping: row.unlock_by_shopping ?? undefined,
  }
}

function mergeDecorItems(remoteItems: DecorItem[]) {
  const remoteById = new Map(remoteItems.map((item) => [item.id, item]))
  return fallbackDecorItems.map((localItem) => ({
    ...localItem,
    ...remoteById.get(localItem.id),
    badge: localItem.badge,
  }))
}

function createOrderMap(items: { id: string }[]) {
  return new Map(items.map((item, index) => [item.id, index]))
}

function compareByKnownOrder(a: string, b: string, orderMap: Map<string, number>) {
  const aOrder = orderMap.get(a) ?? Number.MAX_SAFE_INTEGER
  const bOrder = orderMap.get(b) ?? Number.MAX_SAFE_INTEGER

  if (aOrder !== bOrder) return aOrder - bOrder
  return a.localeCompare(b)
}
