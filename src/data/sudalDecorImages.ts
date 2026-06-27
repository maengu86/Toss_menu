import { decorItems } from './decorItems'

const outfitModules = import.meta.glob('../assets/sudal-decor/outfits/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const outfitPreviewModules = import.meta.glob('../assets/sudal-decor/outfits/*-preview.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const outfitWornModules = import.meta.glob('../assets/sudal-decor/outfits/*-worn.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const accessoryModules = import.meta.glob('../assets/sudal-decor/accessories/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const accessoryPreviewModules = import.meta.glob('../assets/sudal-decor/accessories/*-preview.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const accessoryWornModules = import.meta.glob('../assets/sudal-decor/accessories/*-worn.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const outfitImages = Object.fromEntries(
  decorItems
    .filter((item) => item.type === 'outfit')
    .map((item) => [item.name, outfitModules[`../assets/sudal-decor/outfits/${item.id}.png`] ?? '']),
)

const outfitPreviewImages = Object.fromEntries(
  decorItems
    .filter((item) => item.type === 'outfit')
    .map((item) => [item.name, outfitPreviewModules[`../assets/sudal-decor/outfits/${item.id}-preview.png`] ?? outfitImages[item.name] ?? '']),
)

const outfitWornImages = Object.fromEntries(
  decorItems
    .filter((item) => item.type === 'outfit')
    .map((item) => [item.name, outfitWornModules[`../assets/sudal-decor/outfits/${item.id}-worn.png`] ?? outfitImages[item.name] ?? '']),
)

const accessoryImages = Object.fromEntries(
  decorItems
    .filter((item) => item.type === 'accessory')
    .map((item) => [item.name, accessoryModules[`../assets/sudal-decor/accessories/${item.id}.png`] ?? '']),
)

const accessoryPreviewImages = Object.fromEntries(
  decorItems
    .filter((item) => item.type === 'accessory')
    .map((item) => [item.name, accessoryPreviewModules[`../assets/sudal-decor/accessories/${item.id}-preview.png`] ?? accessoryImages[item.name] ?? '']),
)

const accessoryWornImages = Object.fromEntries(
  decorItems
    .filter((item) => item.type === 'accessory')
    .map((item) => [item.name, accessoryWornModules[`../assets/sudal-decor/accessories/${item.id}-worn.png`] ?? accessoryImages[item.name] ?? '']),
)

export function getSudalOutfitImage(name: string) {
  return outfitImages[name] ?? outfitImages[getOutfitImageAlias(name)] ?? ''
}

export function getSudalAccessoryImage(name: string) {
  return accessoryImages[name] ?? ''
}

export function getSudalOutfitPreviewImage(name: string) {
  return outfitPreviewImages[name] ?? outfitPreviewImages[getOutfitImageAlias(name)] ?? outfitImages[name] ?? outfitImages[getOutfitImageAlias(name)] ?? ''
}

export function getSudalOutfitWornImage(name: string) {
  return outfitWornImages[name] ?? outfitWornImages[getOutfitImageAlias(name)] ?? outfitImages[name] ?? outfitImages[getOutfitImageAlias(name)] ?? ''
}

export function getSudalAccessoryPreviewImage(name: string) {
  return accessoryPreviewImages[name] ?? accessoryImages[name] ?? ''
}

export function getSudalAccessoryWornImage(name: string) {
  return accessoryWornImages[name] ?? accessoryImages[name] ?? ''
}

function getOutfitImageAlias(name: string) {
  if (name === '밀짚 멜빵바지') return '농부 멜빵'
  return name
}
