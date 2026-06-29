import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(scriptDir, '..')
const outputPath = path.join(root, 'supabase/latest-data-sync.sql')
const shouldCheck = process.argv.includes('--check')

function extractArray(source, marker) {
  const markerIndex = source.indexOf(marker)
  if (markerIndex < 0) throw new Error(`Cannot find ${marker}`)

  const assignmentIndex = source.indexOf('=', markerIndex)
  const start = source.indexOf('[', assignmentIndex)
  let depth = 0

  for (let index = start; index < source.length; index += 1) {
    const char = source[index]
    if (char === '[') depth += 1
    if (char === ']') {
      depth -= 1
      if (depth === 0) return source.slice(start, index + 1)
    }
  }

  throw new Error(`Cannot extract ${marker}`)
}

function sql(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

function values(rows) {
  return rows.map((row) => `  (${row.join(', ')})`).join(',\n')
}

const seasonalSource = fs.readFileSync(path.join(root, 'src/data/seasonalIngredients.ts'), 'utf8')
const menusSource = fs.readFileSync(path.join(root, 'src/data/menus.ts'), 'utf8')

const seasonalIngredients = Function(`return ${extractArray(seasonalSource, 'export const seasonalIngredients')}`)()
const menus = Function('createMenu', `return ${extractArray(menusSource, 'export const menus')}`)((id, name, season, weather, _legacyExp, color, seasonalIngredientIds, ingredients) => {
  const menuIngredients = ingredients.map(([ingredientName, quantity, price]) => ({
    name: ingredientName,
    quantity,
    price,
  }))

  return {
    id,
    name,
    season,
    weather,
    color,
    seasonalIngredientIds,
    ingredients: menuIngredients,
    exp: menuIngredients.reduce((total, ingredient) => total + ingredient.price, 0),
    imageFallback: '🍽️',
  }
})

const ingredientById = new Map(seasonalIngredients.map((ingredient) => [ingredient.id, ingredient]))
const seasonKeyByLabel = new Map([
  ['봄', 'spring'],
  ['여름', 'summer'],
  ['가을', 'autumn'],
  ['겨울', 'winter'],
])

const menuRows = menus.map((menu) => {
  const seasonKey = ingredientById.get(menu.seasonalIngredientIds[0])?.seasonKey ?? seasonKeyByLabel.get(menu.season)
  if (!seasonKey) throw new Error(`Missing season key for ${menu.id}`)

  return [
    sql(menu.id),
    sql(menu.name),
    sql(menu.season),
    sql(seasonKey),
    sql(menu.weather),
    String(menu.exp),
    sql(menu.color),
    sql(menu.imageFallback),
  ]
})

const menuIds = menus.map((menu) => [sql(menu.id)])
const relationRows = menus.flatMap((menu) => menu.seasonalIngredientIds.map((ingredientId) => [
  sql(menu.id),
  sql(ingredientId),
]))
const ingredientRows = menus.flatMap((menu) => menu.ingredients.map((ingredient, index) => [
  sql(menu.id),
  sql(ingredient.name),
  sql(ingredient.quantity),
  String(ingredient.price),
  String(index + 1),
]))

const output = `-- Local src/data 최신값을 Supabase DB에 반영합니다.
-- 실행 위치: Supabase SQL Editor
-- 범위: seasonal_ingredients, menus, menu_seasonal_ingredients, menu_ingredients
-- 주의: 아래 delete는 이 파일에 포함된 메뉴 id의 연결/재료만 교체합니다.

begin;

insert into public.seasonal_ingredients (id, name, season, season_key, emoji) values
${values(seasonalIngredients.map((ingredient) => [
  sql(ingredient.id),
  sql(ingredient.name),
  sql(ingredient.season),
  sql(ingredient.seasonKey),
  sql(ingredient.emoji),
]))}
on conflict (id) do update set
  name = excluded.name,
  season = excluded.season,
  season_key = excluded.season_key,
  emoji = excluded.emoji;

insert into public.menus (id, name, season, season_key, weather, exp, color, image_fallback) values
${values(menuRows)}
on conflict (id) do update set
  name = excluded.name,
  season = excluded.season,
  season_key = excluded.season_key,
  weather = excluded.weather,
  exp = excluded.exp,
  color = excluded.color,
  image_fallback = excluded.image_fallback;

with synced_menus(id) as (
  values
${values(menuIds)}
)
delete from public.menu_ingredients
where menu_id in (select id from synced_menus);

with synced_menus(id) as (
  values
${values(menuIds)}
)
delete from public.menu_seasonal_ingredients
where menu_id in (select id from synced_menus);

insert into public.menu_seasonal_ingredients (menu_id, ingredient_id) values
${values(relationRows)}
on conflict (menu_id, ingredient_id) do nothing;

insert into public.menu_ingredients (menu_id, name, quantity, price, sort_order) values
${values(ingredientRows)};

commit;

-- 확인용
select
  (select count(*) from public.seasonal_ingredients) as seasonal_ingredients_count,
  (select count(*) from public.menus) as menus_count,
  (select count(*) from public.menu_seasonal_ingredients) as menu_seasonal_links_count,
  (select count(*) from public.menu_ingredients) as menu_ingredients_count;
`

if (shouldCheck) {
  const currentOutput = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : ''
  if (currentOutput !== output) {
    console.error('supabase/latest-data-sync.sql is out of date. Run `npm run db:sql` and commit the result.')
    process.exit(1)
  }

  console.log(`verified ${menus.length} menus, ${seasonalIngredients.length} seasonal ingredients`)
} else {
  fs.writeFileSync(outputPath, output)
  console.log(`generated ${menus.length} menus, ${seasonalIngredients.length} seasonal ingredients`)
}
