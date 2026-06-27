import homeInterior from '../components/sudal/rooms/home-interior.png'
import bakeryKitchen from '../components/sudal/rooms/bakery-kitchen.png'
import hotSpringVillage from '../components/sudal/rooms/hot-spring-village.png'
import mapleTeaParty from '../components/sudal/rooms/maple-tea-party.png'
import rainyWindow from '../components/sudal/rooms/rainy-window.png'
import snowmanGarden from '../components/sudal/rooms/snowman-garden.png'
import autumnReadingRoom from '../components/sudal/rooms/autumn-reading-room.png'
import springGreenhouse from '../components/sudal/rooms/spring-greenhouse.png'
import starlightCamp from '../components/sudal/rooms/starlight-camp.png'
import strawberryFarm from '../components/sudal/rooms/strawberry-farm.png'
import summerSeasideRoom from '../components/sudal/rooms/summer-seaside-room.png'
import winterFireplaceRoom from '../components/sudal/rooms/winter-fireplace-room.png'

const roomBackgrounds: Record<string, string> = {
  '아늑한 집안': homeInterior,
  '딸기 농장': strawberryFarm,
  '단풍 다과회': mapleTeaParty,
  '눈사람 정원': snowmanGarden,
  '빗방울 창가': rainyWindow,
  '별빛 캠핑장': starlightCamp,
  '온천 마을': hotSpringVillage,
  '빵집 주방': bakeryKitchen,
  '봄 햇살 온실': springGreenhouse,
  '여름 바닷가 방': summerSeasideRoom,
  '가을 독서방': autumnReadingRoom,
  '겨울 벽난로 방': winterFireplaceRoom,
}

export function getRoomBackgroundImage(name: string) {
  return roomBackgrounds[name]
}
