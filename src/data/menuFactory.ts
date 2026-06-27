import type { Menu } from '../types'

const baseMenuFields = { image: '', imageFallback: '🍽️' }

export function createMenu(
  id: string,
  name: string,
  season: string,
  weather: string,
  exp: number,
  color: string,
  seasonalIngredientIds: string[],
  ingredients: [string, string, number][],
): Menu {
  return {
    ...baseMenuFields,
    id,
    name,
    season,
    weather,
    description: '',
    exp,
    color,
    seasonalIngredientIds,
    ingredients: ingredients.map(([ingredientName, quantity, price]) => ({ name: ingredientName, quantity, price })),
  }
}
