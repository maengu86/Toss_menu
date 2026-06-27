export type Ingredient = {
  name: string
  quantity: string
  price: number
}

export type Menu = {
  id: string
  name: string
  season: string
  weather: string
  description: string
  exp: number
  color: string
  image: string
  imageFallback: string
  seasonalIngredientIds?: string[]
  ingredients: Ingredient[]
}

export type SeasonalIngredient = {
  id: string
  name: string
  season: string
  seasonKey: SeasonKey
  emoji: string
}

export type Screen = 'home' | 'shopping' | 'petHome'

export type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter'

export type DecorItem = {
  id: string
  name: string
  type: 'background' | 'outfit' | 'accessory'
  badge?: string
  unlockLevel?: number
  unlockByShopping?: boolean
  unlockSeasonKey?: SeasonKey
  unlockSeasonSpendWon?: number
}
