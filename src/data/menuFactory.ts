import type { Menu } from '../types'

export function createMenu(
  id: string,
  name: string,
  season: string,
  weather: string,
  _legacyExp: number,
  color: string,
  seasonalIngredientIds: string[],
  ingredients: [string, string, number][],
): Menu {
  const menuIngredients = ingredients.map(([ingredientName, quantity, price]) => ({
    name: ingredientName,
    quantity,
    price,
  }))

  return {
    image: '',
    imageFallback: '🍽️',
    id,
    name,
    season,
    weather,
    description: '',
    exp: menuIngredients.reduce((total, ingredient) => total + ingredient.price, 0),
    color,
    seasonalIngredientIds,
    ingredients: menuIngredients,
  }
}
