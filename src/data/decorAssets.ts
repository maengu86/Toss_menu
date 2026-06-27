import bakeryKitchen from '../components/sudal/rooms/bakery-kitchen.png'
import hotSpringVillage from '../components/sudal/rooms/hot-spring-village.png'
import mapleTeaParty from '../components/sudal/rooms/maple-tea-party.png'
import rainyWindow from '../components/sudal/rooms/rainy-window.png'
import snowmanGarden from '../components/sudal/rooms/snowman-garden.png'
import starlightCamp from '../components/sudal/rooms/starlight-camp.png'
import strawberryFarm from '../components/sudal/rooms/strawberry-farm.png'

const roomBackgrounds: Record<string, string> = {
  '딸기 농장': strawberryFarm,
  '단풍 다과회': mapleTeaParty,
  '눈사람 정원': snowmanGarden,
  '빗방울 창가': rainyWindow,
  '별빛 캠핑장': starlightCamp,
  '온천 마을': hotSpringVillage,
  '빵집 주방': bakeryKitchen,
}

export function getRoomBackgroundImage(name: string) {
  return roomBackgrounds[name]
}
