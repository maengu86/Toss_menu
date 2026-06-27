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
const hiddenMenuNameWords = ['아스파라거스']

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
    name: row.name,
    season: row.season,
    seasonKey: row.season_key,
    emoji: row.emoji,
  }
}

function mapMenu(row: MenuRow): Menu {
  const ingredients = [...(row.menu_ingredients ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map<Ingredient>((ingredient) => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
      price: ingredient.price,
    }))

  return {
    id: row.id,
    name: row.name,
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
    .map((menu) => ({
      ...menu,
      exp: menu.ingredients.reduce((total, ingredient) => total + ingredient.price, 0),
    }))

  return [...knownMenus, ...remoteOnlyMenus]
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

function isHiddenMenu(menu: Menu) {
  return menu.seasonalIngredientIds?.some((id) => hiddenSeasonalIngredientIds.has(id))
    || hiddenMenuNameWords.some((word) => menu.name.includes(word))
    || menu.ingredients.some((ingredient) => hiddenMenuNameWords.some((word) => ingredient.name.includes(word)))
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
