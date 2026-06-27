import { decorItems } from './decorItems'

const outfitModules = import.meta.glob('../assets/sudal-decor/outfits/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const accessoryModules = import.meta.glob('../assets/sudal-decor/accessories/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const outfitImages = Object.fromEntries(
  decorItems
    .filter((item) => item.type === 'outfit')
    .map((item) => [item.name, outfitModules[`../assets/sudal-decor/outfits/${item.id}.png`] ?? '']),
)

const accessoryImages = Object.fromEntries(
  decorItems
    .filter((item) => item.type === 'accessory')
    .map((item) => [item.name, accessoryModules[`../assets/sudal-decor/accessories/${item.id}.png`] ?? '']),
)

export function getSudalOutfitImage(name: string) {
  return outfitImages[name] ?? ''
}

export function getSudalAccessoryImage(name: string) {
  return accessoryImages[name] ?? ''
}
