import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'
import PetAvatar from './components/PetAvatar'
import { getRoomBackgroundImage } from './data/decorAssets'
import { getSudalAccessoryPreviewImage } from './data/sudalDecorImages'
import { getPetClearDecorIconImage, getPetDecorIconImage, getPetFeedIconImage, getPetFeedIconImageById, getPetShareIconImage, getPetUiIconImage } from './data/sudalPetIcons'
import { fallbackAppData, loadAppData } from './services/appDataService'
import type { DecorItem, Ingredient, Menu, Screen, SeasonalIngredient, SeasonKey } from './types'
import petTabAccessoryIcon from './assets/sudal-tabs/accessory.png'
import petTabAllIcon from './assets/sudal-tabs/all.png'
import petTabFeedIcon from './assets/sudal-tabs/feed.png'
import petTabRoomIcon from './assets/sudal-tabs/room.png'
import applePorkSaladImage from './assets/sudal-icons/menus/apple-pork-salad.png'
import burdockGimbapImage from './assets/sudal-icons/menus/burdock-gimbap.png'
import cabbageHotpotImage from './assets/sudal-icons/menus/cabbage-hotpot.png'
import chestnutRiceImage from './assets/sudal-icons/menus/chestnut-rice.png'
import cockleBibimbapImage from './assets/sudal-icons/menus/cockle-bibimbap.png'
import codStewImage from './assets/sudal-icons/menus/cod-stew.png'
import cornBoiledImage from './assets/sudal-icons/menus/corn-boiled.png'
import cornButterGrillImage from './assets/sudal-icons/menus/corn-butter-grill.png'
import cornColdSoupImage from './assets/sudal-icons/menus/corn-cold-soup.png'
import cornCreamSoupImage from './assets/sudal-icons/menus/corn-cream-soup.png'
import cornGrillImage from './assets/sudal-icons/menus/corn-grill.png'
import cornJeonImage from './assets/sudal-icons/menus/corn-jeon.png'
import cornPotRiceImage from './assets/sudal-icons/menus/corn-pot-rice.png'
import cornRiceImage from './assets/sudal-icons/menus/corn-rice.png'
import cornSaladImage from './assets/sudal-icons/menus/corn-salad.png'
import dallaeSoyNoodleImage from './assets/sudal-icons/menus/dallae-soy-noodle.png'
import cucumberBibimNoodleImage from './assets/sudal-icons/menus/cucumber-bibim-noodle.png'
import cucumberColdSoupImage from './assets/sudal-icons/menus/cucumber-cold-soup.png'
import cucumberMuchimImage from './assets/sudal-icons/menus/cucumber-muchim.png'
import cucumberOijiImage from './assets/sudal-icons/menus/cucumber-oiji.png'
import cucumberPickleImage from './assets/sudal-icons/menus/cucumber-pickle.png'
import cucumberSaengchaeImage from './assets/sudal-icons/menus/cucumber-saengchae.png'
import cucumberSaladImage from './assets/sudal-icons/menus/cucumber-salad.png'
import cucumberSobagiImage from './assets/sudal-icons/menus/cucumber-sobagi.png'
import eelBaeksukImage from './assets/sudal-icons/menus/eel-baeksuk.png'
import eelGrillImage from './assets/sudal-icons/menus/eel-grill.png'
import eelJorimImage from './assets/sudal-icons/menus/eel-jorim.png'
import eelRiceBowlImage from './assets/sudal-icons/menus/eel-rice-bowl.png'
import eelSoupImage from './assets/sudal-icons/menus/eel-soup.png'
import eggplantDonburiImage from './assets/sudal-icons/menus/eggplant-donburi.png'
import eggplantFriedImage from './assets/sudal-icons/menus/eggplant-fried.png'
import eggplantGrillImage from './assets/sudal-icons/menus/eggplant-grill.png'
import eggplantJeonImage from './assets/sudal-icons/menus/eggplant-jeon.png'
import eggplantNamulImage from './assets/sudal-icons/menus/eggplant-namul.png'
import eggplantPastaImage from './assets/sudal-icons/menus/eggplant-pasta.png'
import eggplantStirFryImage from './assets/sudal-icons/menus/eggplant-stir-fry.png'
import figToastImage from './assets/sudal-icons/menus/fig-toast.png'
import gizzardShadFriedImage from './assets/sudal-icons/menus/gizzard-shad-fried.png'
import gizzardShadGrillImage from './assets/sudal-icons/menus/gizzard-shad-grill.png'
import gizzardShadJorimImage from './assets/sudal-icons/menus/gizzard-shad-jorim.png'
import gizzardShadSaladImage from './assets/sudal-icons/menus/gizzard-shad-salad.png'
import gizzardShadSashimiImage from './assets/sudal-icons/menus/gizzard-shad-sashimi.png'
import gizzardShadSsamImage from './assets/sudal-icons/menus/gizzard-shad-ssam.png'
import grapeCheongImage from './assets/sudal-icons/menus/grape-cheong.png'
import grapeJamImage from './assets/sudal-icons/menus/grape-jam.png'
import grapeJuiceImage from './assets/sudal-icons/menus/grape-juice.png'
import grapeSaladImage from './assets/sudal-icons/menus/grape-salad.png'
import grapeYogurtBowlImage from './assets/sudal-icons/menus/grape-yogurt-bowl.png'
import hallabongSaladImage from './assets/sudal-icons/menus/hallabong-salad.png'
import jukkumiGreenOnionMuchimImage from './assets/sudal-icons/menus/jukkumi-green-onion-muchim.png'
import jukkumiRamenJjamppongImage from './assets/sudal-icons/menus/jukkumi-ramen-jjamppong.png'
import jukkumiRiceBowlImage from './assets/sudal-icons/menus/jukkumi-rice-bowl.png'
import jukkumiShabuShabuImage from './assets/sudal-icons/menus/jukkumi-shabu-shabu.png'
import jukkumiSkewerImage from './assets/sudal-icons/menus/jukkumi-skewer.png'
import jukkumiStirFryImage from './assets/sudal-icons/menus/jukkumi-stir-fry.png'
import jukkumiSukhoeImage from './assets/sudal-icons/menus/jukkumi-sukhoe.png'
import lotusRootJorimImage from './assets/sudal-icons/menus/lotus-root-jorim.png'
import mackerelGrillImage from './assets/sudal-icons/menus/mackerel-grill.png'
import mandarinPuddingImage from './assets/sudal-icons/menus/mandarin-pudding.png'
import melonAdeImage from './assets/sudal-icons/menus/melon-ade.png'
import melonHwachaeImage from './assets/sudal-icons/menus/melon-hwachae.png'
import melonJuiceImage from './assets/sudal-icons/menus/melon-juice.png'
import melonMuchimImage from './assets/sudal-icons/menus/melon-muchim.png'
import melonSaladImage from './assets/sudal-icons/menus/melon-salad.png'
import melonSmoothieImage from './assets/sudal-icons/menus/melon-smoothie.png'
import melonSobagiImage from './assets/sudal-icons/menus/melon-sobagi.png'
import naengiSoybeanSoupImage from './assets/sudal-icons/menus/naengi-soybean-soup.png'
import oysterGukbapImage from './assets/sudal-icons/menus/oyster-gukbap.png'
import peachBingsuImage from './assets/sudal-icons/menus/peach-bingsu.png'
import peachCakeImage from './assets/sudal-icons/menus/peach-cake.png'
import peachCapreseImage from './assets/sudal-icons/menus/peach-caprese.png'
import peachCheongImage from './assets/sudal-icons/menus/peach-cheong.png'
import peachCompoteImage from './assets/sudal-icons/menus/peach-compote.png'
import peachJorimImage from './assets/sudal-icons/menus/peach-jorim.png'
import peachSaladImage from './assets/sudal-icons/menus/peach-salad.png'
import peachSangriaImage from './assets/sudal-icons/menus/peach-sangria.png'
import peachSmoothieImage from './assets/sudal-icons/menus/peach-smoothie.png'
import peachTartImage from './assets/sudal-icons/menus/peach-tart.png'
import peachYogurtBowlImage from './assets/sudal-icons/menus/peach-yogurt-bowl.png'
import pearSaladImage from './assets/sudal-icons/menus/pear-salad.png'
import pepperAnchovyStirFryImage from './assets/sudal-icons/menus/pepper-anchovy-stir-fry.png'
import pepperBeefStirFryImage from './assets/sudal-icons/menus/pepper-beef-stir-fry.png'
import pepperJangajjiImage from './assets/sudal-icons/menus/pepper-jangajji.png'
import pepperJeonImage from './assets/sudal-icons/menus/pepper-jeon.png'
import pepperMuchimImage from './assets/sudal-icons/menus/pepper-muchim.png'
import persimmonSaladImage from './assets/sudal-icons/menus/persimmon-salad.png'
import perillaJangajjiImage from './assets/sudal-icons/menus/perilla-jangajji.png'
import perillaJeonImage from './assets/sudal-icons/menus/perilla-jeon.png'
import perillaKimchiImage from './assets/sudal-icons/menus/perilla-kimchi.png'
import perillaSsambapImage from './assets/sudal-icons/menus/perilla-ssambap.png'
import plumAdeImage from './assets/sudal-icons/menus/plum-ade.png'
import plumCheongImage from './assets/sudal-icons/menus/plum-cheong.png'
import plumJamImage from './assets/sudal-icons/menus/plum-jam.png'
import plumSaladImage from './assets/sudal-icons/menus/plum-salad.png'
import plumTartImage from './assets/sudal-icons/menus/plum-tart.png'
import potatoJeonImage from './assets/sudal-icons/menus/potato-jeon.png'
import potatoJorimImage from './assets/sudal-icons/menus/potato-jorim.png'
import potatoSaladImage from './assets/sudal-icons/menus/potato-salad.png'
import potatoSoupImage from './assets/sudal-icons/menus/potato-soup.png'
import potatoStirFryImage from './assets/sudal-icons/menus/potato-stir-fry.png'
import pumpkinSoupImage from './assets/sudal-icons/menus/pumpkin-soup.png'
import radishBeefSoupImage from './assets/sudal-icons/menus/radish-beef-soup.png'
import shrimpSaltGrillImage from './assets/sudal-icons/menus/shrimp-salt-grill.png'
import spinachNamulImage from './assets/sudal-icons/menus/spinach-namul.png'
import springHerbBibimbapImage from './assets/sudal-icons/menus/spring-herb-bibimbap.png'
import strawberryCakeTartImage from './assets/sudal-icons/menus/strawberry-cake-tart.png'
import strawberrySaladImage from './assets/sudal-icons/menus/strawberry-salad.png'
import strawberryToastImage from './assets/sudal-icons/menus/strawberry-toast.png'
import mushroomBulgogiImage from './assets/sudal-icons/menus/mushroom-bulgogi.png'
import mushroomFriedImage from './assets/sudal-icons/menus/mushroom-fried.png'
import mushroomGangjeongImage from './assets/sudal-icons/menus/mushroom-gangjeong.png'
import mushroomGrillImage from './assets/sudal-icons/menus/mushroom-grill.png'
import mushroomHotpotImage from './assets/sudal-icons/menus/mushroom-hotpot.png'
import mushroomJeonImage from './assets/sudal-icons/menus/mushroom-jeon.png'
import mushroomJjigaeImage from './assets/sudal-icons/menus/mushroom-jjigae.png'
import mushroomPastaImage from './assets/sudal-icons/menus/mushroom-pasta.png'
import mushroomSoupImage from './assets/sudal-icons/menus/mushroom-soup.png'
import mushroomStirFryImage from './assets/sudal-icons/menus/mushroom-stir-fry.png'
import tomatoCapreseImage from './assets/sudal-icons/menus/tomato-caprese.png'
import tomatoColdPastaImage from './assets/sudal-icons/menus/tomato-cold-pasta.png'
import tomatoEggStirFryImage from './assets/sudal-icons/menus/tomato-egg-stir-fry.png'
import tomatoMarinadeImage from './assets/sudal-icons/menus/tomato-marinade.png'
import tomatoPastaImage from './assets/sudal-icons/menus/tomato-pasta.png'
import tomatoPickleImage from './assets/sudal-icons/menus/tomato-pickle.png'
import tomatoSaladImage from './assets/sudal-icons/menus/tomato-salad.png'
import tomatoSoupImage from './assets/sudal-icons/menus/tomato-soup.png'
import watermelonBingsuImage from './assets/sudal-icons/menus/watermelon-bingsu.png'
import watermelonFetaSaladImage from './assets/sudal-icons/menus/watermelon-feta-salad.png'
import watermelonHwachaeImage from './assets/sudal-icons/menus/watermelon-hwachae.png'
import watermelonJuiceImage from './assets/sudal-icons/menus/watermelon-juice.png'
import watermelonKongguksuImage from './assets/sudal-icons/menus/watermelon-kongguksu.png'
import watermelonPunchImage from './assets/sudal-icons/menus/watermelon-punch.png'
import watermelonSaladImage from './assets/sudal-icons/menus/watermelon-salad.png'
import watermelonSherbetImage from './assets/sudal-icons/menus/watermelon-sherbet.png'
import watermelonSmoothieImage from './assets/sudal-icons/menus/watermelon-smoothie.png'
import sweetPotatoBreadImage from './assets/sudal-icons/menus/sweet-potato-bread.png'
import sweetPotatoCheeseBakeImage from './assets/sudal-icons/menus/sweet-potato-cheese-bake.png'
import sweetPotatoFriedImage from './assets/sudal-icons/menus/sweet-potato-fried.png'
import sweetPotatoGratinImage from './assets/sudal-icons/menus/sweet-potato-gratin.png'
import sweetPotatoLatteImage from './assets/sudal-icons/menus/sweet-potato-latte.png'
import sweetPotatoMakgeolliImage from './assets/sudal-icons/menus/sweet-potato-makgeolli.png'
import sweetPotatoMatangImage from './assets/sudal-icons/menus/sweet-potato-matang.png'
import sweetPotatoRoastedImage from './assets/sudal-icons/menus/sweet-potato-roasted.png'
import sweetPotatoSaladImage from './assets/sudal-icons/menus/sweet-potato-salad.png'
import sweetPotatoSoupImage from './assets/sudal-icons/menus/sweet-potato-soup.png'
import yellowtailSashimiBowlImage from './assets/sudal-icons/menus/yellowtail-sashimi-bowl.png'
import youngRadishBibimbapImage from './assets/sudal-icons/menus/young-radish-bibimbap.png'
import youngRadishDoenjangMuchimImage from './assets/sudal-icons/menus/young-radish-doenjang-muchim.png'
import youngRadishKimchiImage from './assets/sudal-icons/menus/young-radish-kimchi.png'
import youngRadishNoodleImage from './assets/sudal-icons/menus/young-radish-noodle.png'
import zucchiniDoenjangJjigaeImage from './assets/sudal-icons/menus/zucchini-doenjang-jjigae.png'
import zucchiniJeonImage from './assets/sudal-icons/menus/zucchini-jeon.png'
import zucchiniJeongolImage from './assets/sudal-icons/menus/zucchini-jeongol.png'
import zucchiniNamulImage from './assets/sudal-icons/menus/zucchini-namul.png'
import zucchiniStirFryImage from './assets/sudal-icons/menus/zucchini-stir-fry.png'
import discountCouponImage from '../discount-coupon-20.jpg'

const menuDishImages = import.meta.glob('./assets/sudal-icons/menus/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

type KakaoLatLng = object
type KakaoMapInstance = {
  addControl: (control: object, position: unknown) => void
  panTo: (position: KakaoLatLng) => void
  setZoomable: (zoomable: boolean) => void
}
type KakaoMapMarker = { setMap: (map: KakaoMapInstance | null) => void }
type KakaoMapsSdk = {
  maps: {
    LatLng: new (latitude: number, longitude: number) => KakaoLatLng
    Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMapInstance
    ZoomControl: new () => object
    ControlPosition: { RIGHT: unknown }
    Marker: new (options: { map: KakaoMapInstance; position: KakaoLatLng }) => KakaoMapMarker
    services: {
      Places: new () => {
        keywordSearch: (
          keyword: string,
          callback: (results: KakaoPlace[], status: string) => void,
          options?: { location: KakaoLatLng; radius: number },
        ) => void
      }
      Status: { OK: string }
    }
    event: { addListener: (marker: KakaoMapMarker, eventName: string, listener: () => void) => void }
    load: (callback: () => void) => void
  }
}

declare global {
  interface Window {
    kakao?: KakaoMapsSdk
    __kakaoMapsSdkPromise?: Promise<void>
  }
}

const tossShoppingOptions = [
  { name: '토스쇼핑 배송', eta: '내일 도착 예정', fee: 0, perk: '무료 배송' },
  { name: '예약배송', eta: '내일 오전 도착', fee: 0, perk: '배송비 0원' },
  { name: '동네픽업', eta: '60분 후 픽업', fee: 0, perk: '근처 마트 수령' },
]
const paymentOptions = ['토스페이', '카드 간편결제', '계좌 결제']
const deliveryOptions = ['문 앞에 놓기', '직접 받을게요']
// 작업: 5단계 레벨업에 총 20만 XP가 필요하며 같은 구조를 반복합니다.
// 적용 위치: 펫홈 레벨 표시, 경험치 바, 20만 XP 단위 할인 쿠폰 발급.
const petLevelExpRequirements = [10000, 25000, 40000, 55000, 70000] as const
const couponRewardExp = petLevelExpRequirements.reduce((total, requirement) => total + requirement, 0)

// 작업: 메뉴와 식재료 가격을 동일한 수치의 XP로 사용합니다.
// 적용 위치: 메뉴 카드 XP 표시, 밥먹이기 버튼, 실제 펫 경험치 증가량.

const kakaoMapAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY as string | undefined
const kakaoMapDefaultLevel = 3

type ShopStep = 'detail' | 'cart' | 'checkout' | 'complete'

type FeedIngredient = Ingredient & {
  id: string
  menuName: string
}

type OrderSnapshot = {
  checkedPrice: number
  couponDiscount: number
  orderTotal: number
}

type OrderHistoryItem = {
  id: number
  orderedAt: string
  items: { name: string; quantity: string; count: number; price: number }[]
  discount: number
  total: number
  status: '주문 완료'
}

type RewardCoupon = {
  id: string
  level: number
  milestoneExp: number
}

type NearbyRestaurant = {
  id: string
  name: string
  menuName: string
  iconImage: string
  distance: string
  eta: string
  rating: string
}

type KakaoPlace = {
  id: string
  place_name: string
  x: string
  y: string
  road_address_name?: string
  address_name?: string
  phone?: string
  place_url?: string
  distance?: string
  menuName?: string
  searchKeyword?: string
}

type PetHomeDecorTab = 'all' | 'background' | 'accessory'

function formatWon(value: number) {
  return value.toLocaleString('ko-KR') + '원'
}

function ingredientKey(menuId: string, ingredientName: string) {
  return `${menuId}:${ingredientName}`
}

function getIngredientExp(ingredient: Ingredient) {
  return ingredient.price
}

function getMenuExp(menu: Menu) {
  return menu.ingredients.reduce((sum, ingredient) => sum + getIngredientExp(ingredient), 0)
}

function getPetLevel(totalExp: number) {
  const completedCycles = Math.floor(totalExp / couponRewardExp)
  const cycleExp = totalExp % couponRewardExp
  let completedLevelsInCycle = 0
  let threshold = 0

  for (const requirement of petLevelExpRequirements) {
    threshold += requirement
    if (cycleExp < threshold) break
    completedLevelsInCycle += 1
  }

  return completedCycles * petLevelExpRequirements.length + completedLevelsInCycle
}

function getLevelExpStatus(totalExp: number, level: number) {
  const levelIndex = level % petLevelExpRequirements.length
  const cycleExp = totalExp % couponRewardExp
  const currentLevelStartExp = petLevelExpRequirements
    .slice(0, levelIndex)
    .reduce((total, requirement) => total + requirement, 0)

  return {
    currentExp: cycleExp - currentLevelStartExp,
    requiredExp: petLevelExpRequirements[levelIndex],
  }
}

function getCouponCount(totalExp: number) {
  return Math.floor(totalExp / couponRewardExp)
}

function getEarnedCoupons(totalExp: number): RewardCoupon[] {
  return Array.from({ length: getCouponCount(totalExp) }, (_, index) => ({
    id: `level-coupon-${index + 1}`,
    level: petLevelExpRequirements.length + index * petLevelExpRequirements.length,
    milestoneExp: (index + 1) * couponRewardExp,
  }))
}

function getLevelProgress(totalExp: number, level: number) {
  const { currentExp, requiredExp } = getLevelExpStatus(totalExp, level)
  return Math.min(100, Math.max(0, (currentExp / requiredExp) * 100))
}

function App() {
  const [appData, setAppData] = useState(fallbackAppData)
  const { decorItems, menus, seasonalIngredients, seasons } = appData
  const firstSummerIngredient = seasonalIngredients.find((item) => item.seasonKey === 'summer') ?? seasonalIngredients[0]
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([])
  const [shoppingCatalogMenuIds, setShoppingCatalogMenuIds] = useState<string[]>([])
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>('summer')
  const [selectedSeasonalIngredientId, setSelectedSeasonalIngredientId] = useState(firstSummerIngredient.id)
  // 작업: 결제 완료된 식재료를 펫에게 먹일 수 있는 재고로 저장합니다.
  // 개인 수정 가능: 재료 카드에 더 많은 정보를 보여주고 싶으면 FeedIngredient 타입에 필드를 추가하면 됩니다.
  // 적용 위치: 주문 완료 후 펫홈 > 밥먹이기 목록.
  const [feedIngredients, setFeedIngredients] = useState<FeedIngredient[]>([])
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([])
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({})
  const [removedCartIngredientKeys, setRemovedCartIngredientKeys] = useState<string[]>([])
  const [lastOrder, setLastOrder] = useState<OrderSnapshot | null>(null)
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([])
  const [usedCouponIds, setUsedCouponIds] = useState<string[]>([])
  const [appliedCouponId, setAppliedCouponId] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  // 작업: 펫 경험치는 레벨별 잔여치가 아니라 누적 XP로 저장합니다.
  // 개인 수정 가능: 기본 시작 XP를 바꾸고 싶으면 0을 원하는 값으로 변경해도 됩니다.
  // 적용 위치: 펫홈 레벨 카드와 밥먹이기 후 성장 상태.
  const [exp, setExp] = useState(0)
  const [shopStep, setShopStep] = useState<ShopStep>('cart')
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0])
  const [deliveryOption, setDeliveryOption] = useState(deliveryOptions[0])
  const [shoppingRewardUnlocked, setShoppingRewardUnlocked] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState('아늑한 집안')
  const [selectedOutfit, setSelectedOutfit] = useState('')
  const [selectedAccessory, setSelectedAccessory] = useState('')
  const [toast, setToast] = useState('')
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimerRef = useRef<number | undefined>(undefined)
  const orderSequenceRef = useRef(0)

  useEffect(() => {
    let isMounted = true

    loadAppData()
      .then((data) => {
        if (isMounted) setAppData(data)
      })
      .catch((error) => {
        console.warn('Supabase data load failed. Falling back to local data.', error)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const selectedMenus = menus.filter((menu) => selectedMenuIds.includes(menu.id))
  const cartMenus = selectedMenus
    .map((menu) => ({
      ...menu,
      ingredients: menu.ingredients.filter((ingredient) => !removedCartIngredientKeys.includes(ingredientKey(menu.id, ingredient.name))),
    }))
    .filter((menu) => menu.ingredients.length > 0)
  const seasonIngredients = seasonalIngredients.filter((ingredient) => ingredient.seasonKey === selectedSeason)
  const activeSeasonalIngredientId = seasonIngredients.some((ingredient) => ingredient.id === selectedSeasonalIngredientId)
    ? selectedSeasonalIngredientId
    : (seasonIngredients[0]?.id ?? selectedSeasonalIngredientId)
  const seasonalMenus = menus.filter((menu) => menu.seasonalIngredientIds?.includes(activeSeasonalIngredientId))
  const seasonIngredientIds = new Set(seasonIngredients.map((ingredient) => ingredient.id))
  const seasonCatalogMenus = menus.filter((menu) => menu.seasonalIngredientIds?.some((id) => seasonIngredientIds.has(id)))
  const shoppingCatalogMenus = shoppingCatalogMenuIds.length > 0
    ? menus.filter((menu) => shoppingCatalogMenuIds.includes(menu.id))
    : seasonCatalogMenus

  const shoppingItems = cartMenus.flatMap((menu) => menu.ingredients.map((ingredient) => ({ menuId: menu.id, ingredient })))
  const checkedPrice = shoppingItems.reduce((sum, item) => (
    checkedIngredients.includes(ingredientKey(item.menuId, item.ingredient.name))
      ? sum + item.ingredient.price * (cartQuantities[ingredientKey(item.menuId, item.ingredient.name)] ?? 1)
      : sum
  ), 0)
  const earnedCoupons = getEarnedCoupons(exp)
  const availableCoupons = earnedCoupons.filter((coupon) => !usedCouponIds.includes(coupon.id))
  const activeCouponId = availableCoupons.some((coupon) => coupon.id === appliedCouponId) ? appliedCouponId : ''
  const couponDiscount = activeCouponId ? Math.min(20000, Math.floor(checkedPrice * 0.2)) : 0
  const selectedDeliveryInfo = tossShoppingOptions[0]
  const orderTotal = checkedPrice - couponDiscount + selectedDeliveryInfo.fee
  const displayCheckedPrice = shopStep === 'complete' ? lastOrder?.checkedPrice ?? checkedPrice : checkedPrice
  const displayCouponDiscount = shopStep === 'complete' ? lastOrder?.couponDiscount ?? couponDiscount : couponDiscount
  const displayOrderTotal = shopStep === 'complete' ? lastOrder?.orderTotal ?? orderTotal : orderTotal
  const checkedTotal = shoppingItems.reduce((total, item) => {
    const key = ingredientKey(item.menuId, item.ingredient.name)
    return checkedIngredients.includes(key) ? total + (cartQuantities[key] ?? 1) : total
  }, 0)
  const level = getPetLevel(exp)
  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function handleScrollActivity() {
    setIsScrolling(true)
    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = window.setTimeout(() => setIsScrolling(false), 900)
  }

  function changeSeason(season: SeasonKey) {
    const firstIngredient = seasonalIngredients.find((ingredient) => ingredient.seasonKey === season)
    setSelectedSeason(season)
    if (firstIngredient) setSelectedSeasonalIngredientId(firstIngredient.id)
  }

  function removeMenu(menuId: string) {
    setSelectedMenuIds((current) => current.filter((id) => id !== menuId))
    setCheckedIngredients((current) => current.filter((key) => !key.startsWith(`${menuId}:`)))
    setRemovedCartIngredientKeys((current) => current.filter((key) => !key.startsWith(`${menuId}:`)))
    setCartQuantities((quantities) => Object.fromEntries(
      Object.entries(quantities).filter(([key]) => !key.startsWith(`${menuId}:`)),
    ))
  }

  function feedPet(ingredient: FeedIngredient) {
    const nextExp = exp + getIngredientExp(ingredient)
    const couponIssued = getCouponCount(nextExp) > getCouponCount(exp)
    setExp(nextExp)
    setFeedIngredients((current) => current.filter((item) => item.id !== ingredient.id))
    if (couponIssued) showToast('20% 할인 쿠폰이 발급됐어요. 마이페이지에서 확인해 보세요.')
  }

  function toggleIngredient(key: string) {
    setCheckedIngredients((current) => (
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    ))
  }

  function changeCartQuantity(key: string, quantity: number) {
    const normalizedQuantity = Number.isFinite(quantity) ? Math.min(99, Math.max(1, Math.floor(quantity))) : 1
    setCartQuantities((current) => ({ ...current, [key]: normalizedQuantity }))
  }

  function addShoppingProduct(menuId: string, ingredientName: string) {
    const key = ingredientKey(menuId, ingredientName)
    setSelectedMenuIds((current) => current.includes(menuId) ? current : [...current, menuId])
    setRemovedCartIngredientKeys((current) => current.filter((item) => item !== key))
    setCheckedIngredients((current) => current.includes(key) ? current : [...current, key])
    setCartQuantities((current) => current[key] ? current : { ...current, [key]: 1 })
    showToast(`${ingredientName}을 장바구니에 담았어요.`)
  }

  function completeOrderFlow() {
    const checkedItems = shoppingItems.filter((item) => checkedIngredients.includes(ingredientKey(item.menuId, item.ingredient.name)))
    if (checkedItems.length === 0) {
      showToast('구매할 상품을 선택해주세요.')
      setShopStep('cart')
      setScreen('home')
      return
    }
    const orderedKeys = checkedItems.map((item) => ingredientKey(item.menuId, item.ingredient.name))
    const removedAfterOrder = new Set([...removedCartIngredientKeys, ...orderedKeys])
    orderSequenceRef.current += 1
    const orderId = orderSequenceRef.current

    setLastOrder({ checkedPrice, couponDiscount, orderTotal })
    setOrderHistory((current) => [{
      id: orderId,
      orderedAt: new Intl.DateTimeFormat('ko-KR', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
      items: checkedItems.map((item) => ({
        name: item.ingredient.name,
        quantity: item.ingredient.quantity,
        count: cartQuantities[ingredientKey(item.menuId, item.ingredient.name)] ?? 1,
        price: item.ingredient.price,
      })),
      discount: couponDiscount,
      total: orderTotal,
      status: '주문 완료',
    }, ...current])
    setRemovedCartIngredientKeys((current) => Array.from(new Set([...current, ...orderedKeys])))
    setFeedIngredients((current) => [
      ...current,
      ...checkedItems.flatMap((item, index) => {
        const menu = selectedMenus.find((selectedMenu) => selectedMenu.id === item.menuId)
        const quantity = cartQuantities[ingredientKey(item.menuId, item.ingredient.name)] ?? 1
        return Array.from({ length: quantity }, (_, unitIndex) => ({
          ...item.ingredient,
          id: `${orderId}:${index}:${unitIndex}:${item.menuId}:${item.ingredient.name}`,
          menuName: menu?.name ?? '주문 메뉴',
        }))
      }),
    ])
    setCartQuantities((current) => Object.fromEntries(
      Object.entries(current).filter(([key]) => !orderedKeys.includes(key)),
    ))
    if (activeCouponId) setUsedCouponIds((current) => [...current, activeCouponId])
    setAppliedCouponId('')
    setCheckedIngredients((current) => current.filter((key) => !orderedKeys.includes(key)))
    setSelectedMenuIds((current) => current.filter((menuId) => {
      const menu = menus.find((item) => item.id === menuId)
      return menu?.ingredients.some((ingredient) => !removedAfterOrder.has(ingredientKey(menuId, ingredient.name)))
    }))
    setShoppingRewardUnlocked(true)
    setShopStep('complete')
  }

  function selectDecor(item: DecorItem) {
    if (!isDecorUnlocked(item, level, shoppingRewardUnlocked)) {
      showToast(item.unlockByShopping ? '장보기 플로우를 완료하면 해금돼요.' : `레벨 ${item.unlockLevel}에 해금돼요.`)
      return
    }

    if (item.type === 'background') setSelectedBackground(item.name)
    if (item.type === 'outfit') setSelectedOutfit(item.name)
    if (item.type === 'accessory') setSelectedAccessory(item.name)
  }

  function clearDecor(type: 'outfit' | 'accessory') {
    if (type === 'outfit') setSelectedOutfit('')
    if (type === 'accessory') setSelectedAccessory('')
    showToast('착용을 해제했어요.')
  }

  async function copyShareLink() {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      showToast('먹보 링크를 복사했어요.')
    } catch {
      showToast(url)
    }
  }

  return (
    <div className="app-shell">
      <main className={`phone ${isScrolling ? 'is-scrolling' : ''}`}>
        {screen === 'home' && (
          <HomeScreen
            seasons={seasons}
            allSeasonalIngredients={seasonalIngredients}
            allMenus={menus}
            seasonIngredients={seasonIngredients}
            seasonalMenus={seasonalMenus}
            selectedSeason={selectedSeason}
            selectedSeasonalIngredientId={activeSeasonalIngredientId}
            selectedMenuIds={selectedMenuIds}
            onScrollActivity={handleScrollActivity}
            onSelectSeason={changeSeason}
            onSelectSeasonalIngredient={setSelectedSeasonalIngredientId}
            onOpenMenuDetail={(menuId) => {
              setShoppingCatalogMenuIds([menuId])
              setShopStep('detail')
              setScreen('shopping')
            }}
            onOpenProfile={() => setProfileOpen(true)}
          />
        )}

        {screen === 'shopping' && (
          <ShoppingScreen
            accessory={selectedAccessory}
            appliedCouponId={activeCouponId}
            availableCoupons={availableCoupons}
            cartQuantities={cartQuantities}
            checkedIngredients={checkedIngredients}
            checkedTotal={checkedTotal}
            deliveryOption={deliveryOption}
            deliveryOptions={deliveryOptions}
            catalogMenus={shoppingCatalogMenus}
            couponDiscount={displayCouponDiscount}
            selectedMenus={cartMenus}
            checkedPrice={displayCheckedPrice}
            deliveryTypeInfo={selectedDeliveryInfo}
            orderTotal={displayOrderTotal}
            paymentMethod={paymentMethod}
            paymentOptions={paymentOptions}
            outfit={selectedOutfit}
            step={shopStep}
            onCompleteOrder={completeOrderFlow}
            onAddProduct={addShoppingProduct}
            onApplyCoupon={setAppliedCouponId}
            onChangeQuantity={changeCartQuantity}
            onGoHome={() => {
              setLastOrder(null)
              setShoppingCatalogMenuIds([])
              setAppliedCouponId('')
              setShopStep('cart')
              setScreen('home')
            }}
            onGoPetHome={() => {
              setLastOrder(null)
              setShoppingCatalogMenuIds([])
              setAppliedCouponId('')
              setShopStep('cart')
              setScreen('petHome')
            }}
            onRemoveMenu={removeMenu}
            onScrollActivity={handleScrollActivity}
            onSelectDelivery={setDeliveryOption}
            onSelectPayment={setPaymentMethod}
            onSetStep={setShopStep}
            onToggleIngredient={toggleIngredient}
          />
        )}

        {screen === 'petHome' && (
          <PetHomeScreen
            background={selectedBackground}
            accessory={selectedAccessory}
            decorItems={decorItems}
            exp={exp}
            feedIngredients={feedIngredients}
            level={level}
            outfit={selectedOutfit}
            shoppingRewardUnlocked={shoppingRewardUnlocked}
            onClearDecor={clearDecor}
            onFeed={feedPet}
            onSelectDecor={selectDecor}
            onShare={copyShareLink}
            onScrollActivity={handleScrollActivity}
          />
        )}

        {profileOpen && (
          <MyPage
            coupons={earnedCoupons}
            exp={exp}
            orderHistory={orderHistory}
            usedCouponIds={usedCouponIds}
            onClose={() => setProfileOpen(false)}
          />
        )}

        <TabBar
          current={screen}
          cartCount={checkedTotal}
          onChange={(nextScreen) => {
            if (nextScreen === 'shopping') {
              setShoppingCatalogMenuIds(selectedMenuIds)
              setShopStep('cart')
            }
            setScreen(nextScreen)
          }}
        />
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function HomeScreen({
  seasons,
  allSeasonalIngredients,
  allMenus,
  seasonIngredients,
  seasonalMenus,
  selectedSeason,
  selectedSeasonalIngredientId,
  selectedMenuIds,
  onScrollActivity,
  onSelectSeason,
  onSelectSeasonalIngredient,
  onOpenMenuDetail,
  onOpenProfile,
}: {
  seasons: { key: SeasonKey; label: string; accent: string }[]
  allSeasonalIngredients: SeasonalIngredient[]
  allMenus: Menu[]
  seasonIngredients: SeasonalIngredient[]
  seasonalMenus: Menu[]
  selectedSeason: SeasonKey
  selectedSeasonalIngredientId: string
  selectedMenuIds: string[]
  onScrollActivity: () => void
  onSelectSeason: (season: SeasonKey) => void
  onSelectSeasonalIngredient: (id: string) => void
  onOpenMenuDetail: (id: string) => void
  onOpenProfile: () => void
}) {
  const [purchaseTab, setPurchaseTab] = useState<'cook' | 'delivery'>('cook')
  const [locationPreview, setLocationPreview] = useState(false)
  const [locationRequestId, setLocationRequestId] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const hasSearch = normalizedQuery.length > 0
  const ingredientSearchResults = hasSearch
    ? allSeasonalIngredients.filter((ingredient) => ingredient.name.toLowerCase().includes(normalizedQuery))
    : []
  const menuSearchResults = hasSearch
    ? allMenus.filter((menu) => (
      menu.name.toLowerCase().includes(normalizedQuery)
      || menu.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(normalizedQuery))
    ))
    : []
  const selectedSeasonalIngredient = seasonIngredients.find((ingredient) => ingredient.id === selectedSeasonalIngredientId)
  const seasonalMenuNames = useMemo(() => seasonalMenus.map((menu) => menu.name), [seasonalMenus])
  const nearbyRestaurants = seasonalMenus.map((menu, index) => ({
    id: `${menu.id}-restaurant`,
    name: index === 0 ? `오늘의 ${menu.name}` : `${menu.name} 맛집`,
    menuName: menu.name,
    iconImage: shoppingItemIconImage(menu.ingredients[0]?.name ?? ''),
    distance: `${320 + index * 280}m`,
    eta: `${18 + index * 7}분`,
    rating: (4.8 - index * 0.1).toFixed(1),
  }))

  return (
    <section className="screen" onScroll={onScrollActivity}>
      <header className="home-global-bar">
        <label className="shopping-search">
          <img alt="" aria-hidden="true" className="sudal-ui-icon" src={getPetUiIconImage('search')} />
          <input
            aria-label="제철 음식과 메뉴 검색"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="제철 음식과 메뉴 검색"
            type="text"
            value={searchQuery}
          />
          {searchQuery && (
            <button aria-label="검색어 지우기" className="shopping-search-clear" onClick={() => setSearchQuery('')} type="button">
              <img alt="" aria-hidden="true" className="sudal-ui-icon" src={getPetUiIconImage('clear')} />
            </button>
          )}
        </label>
        <button aria-label="마이페이지 열기" className="home-profile-button" onClick={onOpenProfile} type="button">
          <img alt="" aria-hidden="true" className="sudal-ui-icon" src={getPetUiIconImage('profile')} />
        </button>
      </header>

      {hasSearch ? (
        <section className="home-search-results">
          <div>
            <h2>제철 식재료</h2>
            <div className="home-search-result-list">
              {ingredientSearchResults.map((ingredient) => (
                <button
                  key={ingredient.id}
                  onClick={() => {
                    onSelectSeason(ingredient.seasonKey)
                    onSelectSeasonalIngredient(ingredient.id)
                  }}
                  type="button"
                >
                  <em aria-hidden="true">{ingredientIconImage(ingredient.name)}</em>
                  <span><strong>{ingredient.name}</strong></span>
                </button>
              ))}
              {ingredientSearchResults.length === 0 && <p>일치하는 제철 식재료가 없어요.</p>}
            </div>
          </div>

          <div>
            <h2>메뉴</h2>
            <div className="home-search-result-list">
              {menuSearchResults.map((menu) => {
                const selected = selectedMenuIds.includes(menu.id)
                return (
                  <button className={selected ? 'selected' : ''} key={menu.id} onClick={() => onOpenMenuDetail(menu.id)} type="button">
                    <em aria-hidden="true">{menuCardVisualImage(menu)}</em>
                    <span><strong>{menu.name}</strong></span>
                  </button>
                )
              })}
              {menuSearchResults.length === 0 && <p>일치하는 메뉴가 없어요.</p>}
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className={`season-panel season-panel-index season-${selectedSeason}`}>
            <div className="season-tabs" aria-label="계절 선택">
              {seasons.map((season) => (
                <button
                  className={selectedSeason === season.key ? 'active' : ''}
                  key={season.key}
                  onClick={() => onSelectSeason(season.key)}
                  style={{ '--season-accent': season.accent } as CSSProperties}
                  type="button"
                >
                  <span>{season.label}</span>
                </button>
              ))}
            </div>

            <div className="seasonal-grid" aria-label="제철 식재료" onScroll={onScrollActivity}>
              {seasonIngredients.map((ingredient) => (
                <button
                  className={`seasonal-tile ${selectedSeasonalIngredientId === ingredient.id ? 'active' : ''}`}
                  key={ingredient.id}
                  onClick={() => onSelectSeasonalIngredient(ingredient.id)}
                  type="button"
                >
                  <span className="food-emoji" aria-hidden="true">{ingredientIconImage(ingredient.name, 'food-icon-image')}</span>
                  <strong>{ingredient.name}</strong>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!hasSearch && (
        <section className="home-purchase-section">
          <nav className="home-purchase-tabs" aria-label="메뉴 이용 방법">
            <button className={purchaseTab === 'cook' ? 'active' : ''} onClick={() => setPurchaseTab('cook')} type="button">
              <b>요리</b>
            </button>
            <button
              className={purchaseTab === 'delivery' ? 'active' : ''}
              onClick={() => {
                setPurchaseTab('delivery')
                setLocationPreview(true)
                setLocationRequestId((current) => current + 1)
              }}
              type="button"
            >
              <b>배달</b>
            </button>
          </nav>

          {purchaseTab === 'cook' && (
            <div className="menu-list nested-menu-list">
              {seasonalMenus.map((menu) => (
                <button
                  className="menu-card"
                  key={menu.id}
                  onClick={() => onOpenMenuDetail(menu.id)}
                  style={{ '--menu-color': menu.color } as CSSProperties}
                  type="button"
                >
                  <span className="menu-card-visual" aria-hidden="true">
                    {menuCardVisualImage(menu)}
                  </span>
                  <strong>{menu.name}</strong>
                  <b>{formatWon(getMenuExp(menu))}</b>
                </button>
              ))}
            </div>
          )}

        {purchaseTab === 'delivery' && (
          <section className="home-delivery-panel">
          <KakaoRestaurantMap
            fallbackRestaurants={nearbyRestaurants}
            ingredientName={selectedSeasonalIngredient?.name ?? '제철'}
            keyword={`${selectedSeasonalIngredient?.name ?? '제철'} 맛집`}
            locationRequestId={locationRequestId}
            menuNames={seasonalMenuNames}
            onRequestCurrentLocation={() => {
              setLocationPreview(true)
              setLocationRequestId((current) => current + 1)
            }}
            useCurrentLocation={locationPreview}
          />

            <p className="home-location-status">
              {locationPreview ? '현재 위치를 허용하면 반경 5km 안의 결과를 우선 보여줘요.' : '카카오맵 키가 있으면 실제 장소 검색 결과가 지도에 표시돼요.'}
            </p>
            </section>
          )}
        </section>
      )}

    </section>
  )
}

function ShoppingScreen({
  accessory,
  appliedCouponId,
  availableCoupons,
  cartQuantities,
  catalogMenus,
  selectedMenus,
  checkedIngredients,
  checkedTotal,
  checkedPrice,
  couponDiscount,
  orderTotal,
  deliveryTypeInfo,
  step,
  paymentMethod,
  paymentOptions,
  outfit,
  deliveryOption,
  deliveryOptions,
  onToggleIngredient,
  onAddProduct,
  onApplyCoupon,
  onChangeQuantity,
  onSelectPayment,
  onSelectDelivery,
  onSetStep,
  onCompleteOrder,
  onGoHome,
  onGoPetHome,
  onRemoveMenu,
  onScrollActivity,
}: {
  accessory: string
  appliedCouponId: string
  availableCoupons: RewardCoupon[]
  cartQuantities: Record<string, number>
  catalogMenus: Menu[]
  selectedMenus: Menu[]
  checkedIngredients: string[]
  checkedTotal: number
  checkedPrice: number
  couponDiscount: number
  orderTotal: number
  deliveryTypeInfo: (typeof tossShoppingOptions)[number]
  step: ShopStep
  paymentMethod: string
  paymentOptions: string[]
  outfit: string
  deliveryOption: string
  deliveryOptions: string[]
  onToggleIngredient: (name: string) => void
  onAddProduct: (menuId: string, ingredientName: string) => void
  onApplyCoupon: (couponId: string) => void
  onChangeQuantity: (key: string, quantity: number) => void
  onSelectPayment: (method: string) => void
  onSelectDelivery: (option: string) => void
  onSetStep: (step: ShopStep) => void
  onCompleteOrder: () => void
  onGoHome: () => void
  onGoPetHome: () => void
  onRemoveMenu: (menuId: string) => void
  onScrollActivity: () => void
}) {
  const canContinue = checkedTotal > 0
  const allIngredientKeys = selectedMenus.flatMap((menu) => menu.ingredients.map((item) => ingredientKey(menu.id, item.name)))
  const checkedProductCount = checkedIngredients.filter((key) => allIngredientKeys.includes(key)).length
  const allChecked = allIngredientKeys.length > 0 && allIngredientKeys.every((key) => checkedIngredients.includes(key))
  const detailMenu = catalogMenus[0]
  const [excludedDetailIngredientKeys, setExcludedDetailIngredientKeys] = useState<string[]>([])
  const [cartMovePromptOpen, setCartMovePromptOpen] = useState(false)
  const selectedDetailIngredientKeys = detailMenu?.ingredients
    .map((ingredient) => ingredientKey(detailMenu.id, ingredient.name))
    .filter((key) => !excludedDetailIngredientKeys.includes(key)) ?? []
  const selectedCartProducts = selectedMenus.flatMap((menu) => menu.ingredients
    .filter((ingredient) => checkedIngredients.includes(ingredientKey(menu.id, ingredient.name)))
    .map((ingredient) => {
      const key = ingredientKey(menu.id, ingredient.name)
      return { key, menu, ingredient, quantity: cartQuantities[key] ?? 1 }
    }))
  const selectedCartQuantity = selectedCartProducts.reduce((total, product) => total + product.quantity, 0)

  function toggleDetailIngredient(key: string) {
    setExcludedDetailIngredientKeys((current) => (
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    ))
  }

  function addSelectedDetailIngredients(nextStep: 'cart' | 'checkout') {
    if (!detailMenu || selectedDetailIngredientKeys.length === 0) return

    detailMenu.ingredients.forEach((ingredient) => {
      const key = ingredientKey(detailMenu.id, ingredient.name)
      if (selectedDetailIngredientKeys.includes(key)) onAddProduct(detailMenu.id, ingredient.name)
    })
    if (nextStep === 'cart') {
      setCartMovePromptOpen(true)
      return
    }
    onSetStep('checkout')
  }

  return (
    <section className={`screen toss-screen shopping-step-${step}`} onScroll={onScrollActivity}>
      {step === 'detail' && detailMenu && (
        <div className="shopping-detail">
          <header className="shopping-sub-header">
            <button aria-label="뒤로가기" className="shopping-back-button" onClick={onGoHome} type="button">
              <img alt="" aria-hidden="true" className="sudal-ui-icon" src={getPetUiIconImage('back')} />
            </button>
            <button aria-label="장바구니" className="shopping-cart-button" onClick={() => onSetStep('cart')} type="button">
              <img alt="" aria-hidden="true" className="sudal-ui-icon" src={getPetUiIconImage('cart')} />
            </button>
          </header>
          <div className="shopping-detail-visual">
            <div className="shopping-detail-plate" aria-hidden="true">
              {menuCardVisualImage(detailMenu)}
            </div>
          </div>
          <div className="shopping-detail-copy">
            <h1>{detailMenu.name}</h1>
            <div className="shopping-detail-ingredients" aria-label="메뉴 재료 선택">
              <span>장바구니에 담을 재료를 선택해주세요</span>
              <div>
                {detailMenu.ingredients.map((ingredient) => {
                  const key = ingredientKey(detailMenu.id, ingredient.name)
                  const selected = selectedDetailIngredientKeys.includes(key)
                  return (
                    <button
                      aria-pressed={selected}
                      className={selected ? 'active' : undefined}
                      key={key}
                      onClick={() => toggleDetailIngredient(key)}
                      type="button"
                    >
                      <em aria-hidden="true">{ingredientIconImage(ingredient.name)}</em>
                      <strong>{ingredient.name}</strong>
                      <small>{formatWon(ingredient.price)}</small>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="shopping-detail-actions">
            <button
              disabled={selectedDetailIngredientKeys.length === 0}
              onClick={() => addSelectedDetailIngredients('cart')}
              type="button"
            >
              장바구니
            </button>
            <button
              disabled={selectedDetailIngredientKeys.length === 0}
              onClick={() => addSelectedDetailIngredients('checkout')}
              type="button"
            >
              구매하기
            </button>
          </div>
        </div>
      )}

      {cartMovePromptOpen && (
        <div
          className="cart-move-modal"
          onClick={() => setCartMovePromptOpen(false)}
          role="presentation"
        >
          <div
            aria-labelledby="cart-move-modal-title"
            aria-modal="true"
            className="cart-move-modal-card"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <span aria-hidden="true"><img alt="" className="sudal-modal-icon" src={getPetUiIconImage('cart')} /></span>
            <h2 id="cart-move-modal-title">장바구니로 이동하시겠습니까?</h2>
            <p>선택한 재료를 장바구니에 담았어요.</p>
            <div>
              <button
                onClick={() => {
                  setCartMovePromptOpen(false)
                  onGoHome()
                }}
                type="button"
              >
                아니오
              </button>
              <button
                onClick={() => {
                  setCartMovePromptOpen(false)
                  onSetStep('cart')
                }}
                type="button"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'cart' && (
        <>
          <div className="shopping-cart-head">
            <div>{selectedMenus.length > 0 && <strong>장바구니 {checkedTotal}</strong>}</div>
          </div>
          <div className="toss-menu-list">
            {selectedMenus.length === 0 && (
              <div className="empty-cart-pet">
                <div className="empty-cart-pet-room">
                  <PetAvatar outfit={outfit} accessory={accessory} body="sudal" />
                </div>
                <h2>배고파요...</h2>
                <p>오늘은 뭐 먹을래요?</p>
                <div>
                  <button className="toss-primary" onClick={onGoHome} type="button">제철홈에서 메뉴 고르기</button>
                </div>
              </div>
            )}
            {selectedMenus.length > 0 && (
              <label className="toss-select-all">
                <input
                  checked={allChecked}
                  onChange={() => {
                    allIngredientKeys.forEach((key) => {
                      if (allChecked === checkedIngredients.includes(key)) onToggleIngredient(key)
                    })
                  }}
                  type="checkbox"
                />
                <span>전체 선택</span>
                <b>{checkedProductCount}/{allIngredientKeys.length}</b>
              </label>
            )}
            {selectedMenus.map((menu) => {
                const menuKeys = menu.ingredients.map((item) => ingredientKey(menu.id, item.name))
                const menuChecked = menuKeys.every((key) => checkedIngredients.includes(key))
                return (
                  <article className="toss-menu-box" key={menu.id}>
                    <div className="toss-menu-box-head">
                      <label>
                        <input
                          checked={menuChecked}
                          onChange={() => {
                            menuKeys.forEach((key) => {
                              if (menuChecked === checkedIngredients.includes(key)) onToggleIngredient(key)
                            })
                          }}
                          type="checkbox"
                        />
                        <strong>오늘의 제철마켓</strong>
                      </label>
                      <button className="toss-menu-remove" onClick={() => onRemoveMenu(menu.id)} type="button">
                        선택삭제
                      </button>
                    </div>
                    <div className="ingredient-list toss-list toss-product-list">
                      {menu.ingredients.map((item) => {
                        const key = ingredientKey(menu.id, item.name)
                        const quantity = cartQuantities[key] ?? 1
                        return (
                          <div className="ingredient-row toss-row" key={key}>
                            <input
                              aria-label={`${item.name} 선택`}
                              checked={checkedIngredients.includes(key)}
                              onChange={() => onToggleIngredient(key)}
                              type="checkbox"
                            />
                            <em aria-hidden="true">{ingredientIconImage(item.name)}</em>
                            <span>
                              <strong>내일 도착 예정</strong>
                              <small>{item.name}, {item.quantity}</small>
                            </span>
                            <div className="cart-product-side">
                              <b>
                                <del>{formatWon(Math.round(item.price * 1.7 / 100) * 100 * quantity)}</del>
                                {formatWon(item.price * quantity)}
                              </b>
                              <div className="cart-quantity-control" aria-label={`${item.name} 수량`}>
                                <button
                                  aria-label={`${item.name} 수량 줄이기`}
                                  disabled={quantity <= 1}
                                  onClick={() => onChangeQuantity(key, quantity - 1)}
                                  type="button"
                                >
                                  −
                                </button>
                                <input
                                  aria-label={`${item.name} 수량 직접 입력`}
                                  inputMode="numeric"
                                  max="99"
                                  min="1"
                                  onChange={(event) => onChangeQuantity(key, event.currentTarget.valueAsNumber)}
                                  type="number"
                                  value={quantity}
                                />
                                <button
                                  aria-label={`${item.name} 수량 늘리기`}
                                  disabled={quantity >= 99}
                                  onClick={() => onChangeQuantity(key, quantity + 1)}
                                  type="button"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </article>
                )
            })}
          </div>
          <div className="toss-cart-orderbar" aria-label="주문 예상 금액">
            <div>
              <span>총 주문 예상금액</span>
              <strong>{formatWon(checkedPrice)}</strong>
            </div>
            <button className="toss-primary toss-cart-continue" disabled={!canContinue} onClick={() => onSetStep('checkout')} type="button">
              {checkedTotal}건 · {formatWon(checkedPrice)} 주문하기
            </button>
          </div>
        </>
      )}

      {step === 'checkout' && (
        <div className="shopping-checkout">
          <header className="shopping-sub-header">
            <button aria-label="뒤로가기" onClick={() => onSetStep('cart')} type="button">
              <img alt="" aria-hidden="true" className="sudal-ui-icon" src={getPetUiIconImage('back')} />
            </button>
          </header>
          <section className="shopping-address">
            <h1><span>집</span>으로 배송</h1>
            <p>서울특별시 중구 세종대로 110</p>
            <small>구매자 · 010-0000-0000</small>
            <button type="button">변경</button>
            <select aria-label="배송 시 요청사항" value={deliveryOption} onChange={(event) => onSelectDelivery(event.target.value)}>
              {deliveryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </section>
          <section className="shopping-order-products">
            <h2>주문상품 {selectedCartQuantity}개</h2>
            {selectedCartProducts.map(({ key, ingredient, quantity }) => (
              <article key={key}>
                <em aria-hidden="true">{ingredientIconImage(ingredient.name)}</em>
                <div>
                  <strong>내일 도착 예정</strong>
                  <span>{ingredient.name}, {ingredient.quantity}</span>
                  <b>{formatWon(ingredient.price * quantity)} · {quantity}개</b>
                  <small>무료 배송</small>
                </div>
              </article>
            ))}
          </section>
          <section className="shopping-payment-section">
            <div className="shopping-coupon">
              <div>
                <strong>쿠폰</strong>
                <span>20% 할인 · 최대 2만원</span>
              </div>
              <select
                aria-label="할인 쿠폰 선택"
                disabled={availableCoupons.length === 0}
                onChange={(event) => onApplyCoupon(event.target.value)}
                value={appliedCouponId}
              >
                <option value="">{availableCoupons.length === 0 ? '사용 가능한 쿠폰 없음' : '쿠폰 적용 안 함'}</option>
                {availableCoupons.map((coupon) => (
                  <option key={coupon.id} value={coupon.id}>
                    20% 할인(최대 2만원) · 레벨 {coupon.level} 달성
                  </option>
                ))}
              </select>
            </div>
            <h2>결제수단</h2>
            <div className="shopping-payment-options">
              {paymentOptions.map((option) => (
                <button className={paymentMethod === option ? 'active' : ''} key={option} onClick={() => onSelectPayment(option)} type="button">
                  {option}<span>{paymentMethod === option ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            <h2>토스포인트 사용</h2>
            <div className="shopping-points"><span>0</span><b>원</b></div>
            <div className="shopping-total">
              <strong>총 결제 금액</strong><b>{formatWon(orderTotal)}</b>
              <span>총 주문 금액</span><span>{formatWon(checkedPrice)}</span>
              {couponDiscount > 0 && (
                <>
                  <span>쿠폰 할인</span><span className="shopping-discount-value">-{formatWon(couponDiscount)}</span>
                </>
              )}
            </div>
            <div className="shopping-paybar">
              <button onClick={onCompleteOrder} type="button">{formatWon(orderTotal)} 결제하기</button>
            </div>
            <p className="shopping-payment-notice">실제 결제와 주문은 발생하지 않는 MVP 체험 화면입니다.</p>
          </section>
        </div>
      )}

      {step === 'complete' && (
        <div className="complete-card">
          <h2>주문 체험이 완료됐어요</h2>
          <p>실제 결제와 주문은 발생하지 않습니다.</p>
          <div className="receipt-drafts receipt-main" aria-label="주문 완료 영수증">
            <article className="receipt-draft receipt-draft-1">
              <dl>
                <div>
                  <dt>결제 수단</dt>
                  <dd>{paymentMethod}</dd>
                </div>
                <div>
                  <dt>배송 방식</dt>
                  <dd>{deliveryTypeInfo.name}</dd>
                </div>
                <div>
                  <dt>배송 요청</dt>
                  <dd>{deliveryOption}</dd>
                </div>
                {couponDiscount > 0 && (
                  <div>
                    <dt>쿠폰 할인</dt>
                    <dd>-{formatWon(couponDiscount)}</dd>
                  </div>
                )}
                <div>
                  <dt>총 결제금액</dt>
                  <dd>{formatWon(orderTotal)}</dd>
                </div>
              </dl>
            </article>
          </div>
          <button className="toss-primary" onClick={onGoPetHome} type="button">밥주러 가기</button>
          <button className="toss-secondary wide" onClick={onGoHome} type="button">장보러 가기</button>
        </div>
      )}
    </section>
  )
}

function KakaoRestaurantMap({
  fallbackRestaurants,
  ingredientName,
  keyword,
  locationRequestId,
  menuNames,
  onRequestCurrentLocation,
  useCurrentLocation,
}: {
  fallbackRestaurants: NearbyRestaurant[]
  ingredientName: string
  keyword: string
  locationRequestId: number
  menuNames: string[]
  onRequestCurrentLocation: () => void
  useCurrentLocation: boolean
}) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null)
  const markersRef = useRef<KakaoMapMarker[]>([])
  const currentLocationMarkerRef = useRef<KakaoMapMarker | null>(null)
  const lastLocationRequestIdRef = useRef(0)
  const menuKeywordSignature = menuNames.join('|')
  const searchKeywords = useMemo(
    () => buildMenuSearchKeywords(menuKeywordSignature ? menuKeywordSignature.split('|') : [], ingredientName, keyword),
    [ingredientName, keyword, menuKeywordSignature],
  )
  const [, setStatusMessage] = useState(kakaoMapAppKey ? '카카오맵을 불러오는 중이에요.' : '카카오맵 키를 설정하면 실제 지도가 표시돼요.')
  const [places, setPlaces] = useState<KakaoPlace[]>([])

  useEffect(() => {
    const appKey = kakaoMapAppKey ?? ''
    if (!appKey || !useCurrentLocation || locationRequestId === lastLocationRequestIdRef.current) return

    let canceled = false

    async function moveToCurrentLocation() {
      try {
        const center = await getSearchCenter(true)
        if (canceled || !mapRef.current) return

        await loadKakaoMapsSdk(appKey)
        if (canceled || !window.kakao) return

        const centerLatLng = new window.kakao.maps.LatLng(center.lat, center.lng)
        mapInstanceRef.current?.panTo(centerLatLng)
        if (mapInstanceRef.current) {
          currentLocationMarkerRef.current?.setMap(null)
          currentLocationMarkerRef.current = new window.kakao.maps.Marker({
            map: mapInstanceRef.current,
            position: centerLatLng,
          })
        }
        lastLocationRequestIdRef.current = locationRequestId
      } catch (error) {
        console.warn('Kakao current location move failed.', error)
      }
    }

    moveToCurrentLocation()

    return () => {
      canceled = true
    }
  }, [locationRequestId, useCurrentLocation])

  useEffect(() => {
    const appKey = kakaoMapAppKey ?? ''
    if (!appKey || !mapRef.current) return

    let canceled = false

    async function renderMap() {
      try {
        const center = await getSearchCenter(useCurrentLocation)
        if (canceled || !mapRef.current) return

        await loadKakaoMapsSdk(appKey)
        if (canceled || !mapRef.current || !window.kakao) return

        const kakao = window.kakao
        const centerLatLng = new kakao.maps.LatLng(center.lat, center.lng)
        const map = new kakao.maps.Map(mapRef.current, {
          center: centerLatLng,
          level: kakaoMapDefaultLevel,
        })
        mapInstanceRef.current = map
        map.setZoomable(false)
        const places = new kakao.maps.services.Places()
        const searchOptions = { location: centerLatLng, radius: 5000 }

        currentLocationMarkerRef.current?.setMap(null)
        currentLocationMarkerRef.current = new kakao.maps.Marker({
          map,
          position: centerLatLng,
        })
        markersRef.current.forEach((marker) => marker.setMap(null))
        markersRef.current = []

        const nextPlaces = await searchKakaoMenuPlaces(
          places,
          searchKeywords,
          searchOptions,
          kakao.maps.services.Status.OK,
        )
        if (canceled) return

        if (nextPlaces.length === 0) {
          setStatusMessage(`${ingredientName} 메뉴 검색 결과가 없어서 추천 목록을 띄워드릴게요`)
          setPlaces([])
          return
        }

        nextPlaces.forEach((place) => {
          const position = new kakao.maps.LatLng(Number(place.y), Number(place.x))
          const marker = new kakao.maps.Marker({ map, position })

          markersRef.current.push(marker)
        })

        setPlaces(nextPlaces)
        setStatusMessage(`${ingredientName} 메뉴 검색 결과 ${nextPlaces.length}곳을 표시했어요.`)
      } catch (error) {
        console.warn('Kakao map load failed.', error)
        setStatusMessage('카카오맵을 불러오지 못해서 미리보기 지도를 보여드려요.')
        setPlaces([])
      }
    }

    renderMap()

    return () => {
      canceled = true
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []
    }
  }, [ingredientName, keyword, searchKeywords, useCurrentLocation])

  if (!kakaoMapAppKey) {
    return <FallbackRestaurantMap fallbackRestaurants={fallbackRestaurants} />
  }

  return (
    <div className="kakao-place-section">
      <div className="home-map-preview has-kakao" aria-label="주변 음식점 지도">
        <div className="kakao-map-canvas" ref={mapRef} />
        <button className="home-map-location-button" aria-label="내 위치로 돌아가기" onClick={onRequestCurrentLocation} type="button">
          <img alt="" aria-hidden="true" className="sudal-ui-icon" src={getPetUiIconImage('location')} />
          내 위치로 돌아가기
        </button>
        <p className="kakao-map-status">현재 위치 기준으로 메뉴 맛집을 보여줘요.</p>
      </div>
      {places.length > 0 && (
        <div className="kakao-place-list" aria-label="주변 맛집 검색 결과">
          {places.map((place) => {
            const distanceText = place.distance ? `${Number(place.distance).toLocaleString('ko-KR')}m` : '카카오맵 장소'

            return (
              <a
                href={place.place_url}
                key={place.id}
                rel="noreferrer"
                target="_blank"
              >
                <strong>{place.place_name}</strong>
                <span>{place.menuName ? `${place.menuName} 검색 결과` : '카카오맵 검색 결과'}</span>
                <span>{place.road_address_name || place.address_name || '주소 정보 없음'}</span>
                <small>{[place.phone, distanceText].filter(Boolean).join(' · ')}</small>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}


function buildMenuSearchKeywords(menuNames: string[], ingredientName: string, fallbackKeyword: string) {
  const compactIngredientName = ingredientName.replace(/\s+/g, '')
  const normalizedMenuNames = menuNames
    .map((menuName) => menuName.trim())
    .filter(Boolean)
    .slice(0, 6)

  const menuKeywords = normalizedMenuNames.flatMap((menuName) => {
    const spacedMenuName = compactIngredientName && menuName.includes(compactIngredientName)
      ? menuName.replaceAll(compactIngredientName, ingredientName)
      : menuName
    return [`${spacedMenuName} 맛집`, spacedMenuName]
  })

  return [...new Set([...menuKeywords, fallbackKeyword])]
}

function searchKakaoMenuPlaces(
  placesService: KakaoMapsSdk['maps']['services']['Places'] extends new () => infer Service ? Service : never,
  keywords: string[],
  searchOptions: { location: KakaoLatLng; radius: number },
  okStatus: string,
) {
  const foundPlaces = new Map<string, KakaoPlace>()

  return keywords.reduce<Promise<KakaoPlace[]>>(async (previousSearch, searchKeyword) => {
    const currentPlaces = await previousSearch
    if (currentPlaces.length >= 8) return currentPlaces

    const results = await searchKakaoKeyword(placesService, searchKeyword, searchOptions, okStatus)
    const menuName = searchKeyword.replace(/\s*맛집\s*$/, '')
    results.forEach((place) => {
      if (foundPlaces.has(place.id)) return
      foundPlaces.set(place.id, { ...place, menuName, searchKeyword })
    })

    return Array.from(foundPlaces.values()).slice(0, 8)
  }, Promise.resolve([]))
}

function searchKakaoKeyword(
  placesService: KakaoMapsSdk['maps']['services']['Places'] extends new () => infer Service ? Service : never,
  keyword: string,
  searchOptions: { location: KakaoLatLng; radius: number },
  okStatus: string,
) {
  return new Promise<KakaoPlace[]>((resolve) => {
    placesService.keywordSearch(keyword, (results: KakaoPlace[], status: string) => {
      resolve(status === okStatus ? results : [])
    }, searchOptions)
  })
}

function FallbackRestaurantMap({ fallbackRestaurants }: { fallbackRestaurants: NearbyRestaurant[] }) {
  return (
    <div className="home-map-preview" aria-label="주변 음식점 지도 미리보기">
      <div className="map-road road-one" />
      <div className="map-road road-two" />
      <span className="map-current-location"><img alt="" aria-hidden="true" className="sudal-ui-icon" src={getPetUiIconImage('current')} /></span>
      {fallbackRestaurants.slice(0, 3).map((restaurant, index) => (
        <button
          className={`map-restaurant-pin pin-${index + 1}`}
          aria-label={`${restaurant.name} 위치`}
          key={restaurant.id}
          type="button"
        >
          <img alt="" aria-hidden="true" className="sudal-map-pin-icon" src={restaurant.iconImage} />
        </button>
      ))}
      {fallbackRestaurants.length === 0 && <p>이 제철 식재료로 만든 요리를 준비하고 있어요.</p>}
    </div>
  )
}

function loadKakaoMapsSdk(appKey: string) {
  if (window.kakao?.maps?.services) return Promise.resolve()
  if (window.__kakaoMapsSdkPromise) return window.__kakaoMapsSdkPromise

  window.__kakaoMapsSdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.dataset.kakaoMapSdk = 'true'
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&libraries=services&autoload=false`
    script.onload = () => {
      window.kakao?.maps?.load(resolve)
    }
    script.onerror = () => reject(new Error('Kakao Maps SDK load failed.'))
    document.head.appendChild(script)
  })

  return window.__kakaoMapsSdkPromise
}

function getSearchCenter(useCurrentLocation: boolean) {
  const defaultCenter = { lat: 37.5665, lng: 126.9780 }

  if (!useCurrentLocation || !navigator.geolocation) {
    return Promise.resolve(defaultCenter)
  }

  return new Promise<{ lat: number; lng: number }>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }),
      () => resolve(defaultCenter),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 5000 },
    )
  })
}

function shoppingItemIconImage(name: string) {
  return getPetFeedIconImage(name) || getPetUiIconImage('bag')
}

function ingredientIconImage(name: string, className = 'sudal-ingredient-icon') {
  const iconClassName = name.includes('장어') ? `${className} eel-icon-image` : className
  return <img alt="" aria-hidden="true" className={iconClassName} src={shoppingItemIconImage(name)} />
}

function renderableMenuImage(image: string) {
  const value = image.trim()
  if (!value) return ''
  return /^(https?:|data:|blob:|\/)/.test(value) ? value : ''
}

function menuDishImageById(id: string) {
  return menuDishImages[`./assets/sudal-icons/menus/${id}.png`] ?? ''
}

function menuCardVisualImage(menu: Menu) {
  const menuImagesById: Record<string, string> = {
    'spring-herb-bibimbap': springHerbBibimbapImage,
    'dallae-soy-noodle': dallaeSoyNoodleImage,
    'naengi-soybean-soup': naengiSoybeanSoupImage,
    'strawberry-toast': strawberryToastImage,
    'strawberry-salad': strawberrySaladImage,
    'strawberry-cake-tart': strawberryCakeTartImage,
    'strawberry-cake': strawberryCakeTartImage,
    'strawberry-tart': strawberryCakeTartImage,
    'jukkumi-green-onion-muchim': jukkumiGreenOnionMuchimImage,
    'jukkumi-ramen-jjamppong': jukkumiRamenJjamppongImage,
    'jukkumi-rice-bowl': jukkumiRiceBowlImage,
    'jukkumi-shabu-shabu': jukkumiShabuShabuImage,
    'jukkumi-skewer': jukkumiSkewerImage,
    'jukkumi-stir-fry': jukkumiStirFryImage,
    'jukkumi-sukhoe': jukkumiSukhoeImage,
    'pear-salad': pearSaladImage,
    'chestnut-rice': chestnutRiceImage,
    'pumpkin-soup': pumpkinSoupImage,
    'apple-pork-salad': applePorkSaladImage,
    'shrimp-salt-grill': shrimpSaltGrillImage,
    'persimmon-salad': persimmonSaladImage,
    'fig-toast': figToastImage,
    'mackerel-grill': mackerelGrillImage,
    'oyster-gukbap': oysterGukbapImage,
    'radish-beef-soup': radishBeefSoupImage,
    'cabbage-hotpot': cabbageHotpotImage,
    'mandarin-pudding': mandarinPuddingImage,
    'cod-stew': codStewImage,
    'spinach-namul': spinachNamulImage,
    'cockle-bibimbap': cockleBibimbapImage,
    'lotus-root-jorim': lotusRootJorimImage,
    'burdock-gimbap': burdockGimbapImage,
    'hallabong-salad': hallabongSaladImage,
    'yellowtail-sashimi-bowl': yellowtailSashimiBowlImage,
    'corn-pot-rice': cornPotRiceImage,
    'corn-cold-soup': cornColdSoupImage,
    'corn-boiled': cornBoiledImage,
    'corn-grill': cornGrillImage,
    'corn-butter-grill': cornButterGrillImage,
    'corn-cream-soup': cornCreamSoupImage,
    'corn-jeon': cornJeonImage,
    'corn-rice': cornRiceImage,
    'corn-salad': cornSaladImage,
    'cucumber-cold-soup': cucumberColdSoupImage,
    'cucumber-bibim-noodle': cucumberBibimNoodleImage,
    'cucumber-oiji': cucumberOijiImage,
    'cucumber-muchim': cucumberMuchimImage,
    'cucumber-pickle': cucumberPickleImage,
    'cucumber-saengchae': cucumberSaengchaeImage,
    'cucumber-sobagi': cucumberSobagiImage,
    'cucumber-salad': cucumberSaladImage,
    'eel-rice-bowl': eelRiceBowlImage,
    'eel-baeksuk': eelBaeksukImage,
    'eel-grill': eelGrillImage,
    'eel-jorim': eelJorimImage,
    'eel-soup': eelSoupImage,
    'eggplant-donburi': eggplantDonburiImage,
    'eggplant-grill': eggplantGrillImage,
    'eggplant-namul': eggplantNamulImage,
    'eggplant-jeon': eggplantJeonImage,
    'eggplant-pasta': eggplantPastaImage,
    'eggplant-stir-fry': eggplantStirFryImage,
    'eggplant-fried': eggplantFriedImage,
    'gizzard-shad-salad': gizzardShadSaladImage,
    'gizzard-shad-grill': gizzardShadGrillImage,
    'gizzard-shad-jorim': gizzardShadJorimImage,
    'gizzard-shad-sashimi': gizzardShadSashimiImage,
    'gizzard-shad-ssam': gizzardShadSsamImage,
    'gizzard-shad-fried': gizzardShadFriedImage,
    'grape-yogurt': grapeYogurtBowlImage,
    'grape-cheong': grapeCheongImage,
    'grape-jam': grapeJamImage,
    'grape-juice': grapeJuiceImage,
    'grape-salad': grapeSaladImage,
    'melon-smoothie': melonSmoothieImage,
    'melon-juice': melonJuiceImage,
    'melon-ade': melonAdeImage,
    'melon-hwachae': melonHwachaeImage,
    'melon-muchim': melonMuchimImage,
    'melon-salad': melonSaladImage,
    'melon-sobagi': melonSobagiImage,
    'mushroom-hotpot': mushroomHotpotImage,
    'mushroom-bulgogi': mushroomBulgogiImage,
    'mushroom-gangjeong': mushroomGangjeongImage,
    'mushroom-grill': mushroomGrillImage,
    'mushroom-jeon': mushroomJeonImage,
    'mushroom-pasta': mushroomPastaImage,
    'mushroom-soup': mushroomSoupImage,
    'mushroom-jjigae': mushroomJjigaeImage,
    'mushroom-stir-fry': mushroomStirFryImage,
    'mushroom-fried': mushroomFriedImage,
    'pepper-jeon': pepperJeonImage,
    'pepper-anchovy-stir-fry': pepperAnchovyStirFryImage,
    'pepper-beef-stir-fry': pepperBeefStirFryImage,
    'pepper-muchim': pepperMuchimImage,
    'pepper-jangajji': pepperJangajjiImage,
    'perilla-leaf-rice': perillaSsambapImage,
    'perilla-jeon': perillaJeonImage,
    'perilla-kimchi': perillaKimchiImage,
    'perilla-jangajji': perillaJangajjiImage,
    'plum-ade': plumAdeImage,
    'plum-cheong': plumCheongImage,
    'plum-jam': plumJamImage,
    'plum-salad': plumSaladImage,
    'plum-tart': plumTartImage,
    'potato-salad': potatoSaladImage,
    'potato-jeon': potatoJeonImage,
    'potato-jorim': potatoJorimImage,
    'potato-soup': potatoSoupImage,
    'potato-stir-fry': potatoStirFryImage,
    'peach-caprese': peachCapreseImage,
    'peach-yogurt-bowl': peachYogurtBowlImage,
    'peach-bingsu': peachBingsuImage,
    'peach-cheong': peachCheongImage,
    'peach-compote': peachCompoteImage,
    'peach-jorim': peachJorimImage,
    'peach-salad': peachSaladImage,
    'peach-sangria': peachSangriaImage,
    'peach-smoothie': peachSmoothieImage,
    'peach-tart': peachTartImage,
    'peach-cake': peachCakeImage,
    'tomato-cold-pasta': tomatoColdPastaImage,
    'tomato-marinade': tomatoMarinadeImage,
    'tomato-pickle': tomatoPickleImage,
    'tomato-caprese': tomatoCapreseImage,
    'tomato-egg-stir-fry': tomatoEggStirFryImage,
    'tomato-salad': tomatoSaladImage,
    'tomato-pasta': tomatoPastaImage,
    'tomato-soup': tomatoSoupImage,
    'watermelon-kongguksu': watermelonKongguksuImage,
    'watermelon-feta-salad': watermelonFetaSaladImage,
    'watermelon-bingsu': watermelonBingsuImage,
    'watermelon-salad': watermelonSaladImage,
    'watermelon-hwachae': watermelonHwachaeImage,
    'watermelon-punch': watermelonPunchImage,
    'watermelon-juice': watermelonJuiceImage,
    'watermelon-smoothie': watermelonSmoothieImage,
    'watermelon-sherbet': watermelonSherbetImage,
    'sweet-potato-gratin': sweetPotatoGratinImage,
    'sweet-potato-roasted': sweetPotatoRoastedImage,
    'sweet-potato-bread': sweetPotatoBreadImage,
    'sweet-potato-cheese-bake': sweetPotatoCheeseBakeImage,
    'sweet-potato-makgeolli': sweetPotatoMakgeolliImage,
    'sweet-potato-matang': sweetPotatoMatangImage,
    'sweet-potato-salad': sweetPotatoSaladImage,
    'sweet-potato-soup': sweetPotatoSoupImage,
    'sweet-potato-latte': sweetPotatoLatteImage,
    'sweet-potato-fried': sweetPotatoFriedImage,
    'young-radish-noodle': youngRadishNoodleImage,
    'young-radish-bibimbap': youngRadishBibimbapImage,
    'young-radish-doenjang-muchim': youngRadishDoenjangMuchimImage,
    'young-radish-kimchi': youngRadishKimchiImage,
    'zucchini-pancake': zucchiniJeonImage,
    'zucchini-doenjang-jjigae': zucchiniDoenjangJjigaeImage,
    'zucchini-jeongol': zucchiniJeongolImage,
    'zucchini-namul': zucchiniNamulImage,
    'zucchini-stir-fry': zucchiniStirFryImage,
  }
  const menuImage = menuImagesById[menu.id]
    || menuDishImageById(menu.id)
    || renderableMenuImage(menu.image)
    || tomatoMenuImageByName(menu)
    || cornMenuImageByName(menu)
    || peachMenuImageByName(menu)
    || watermelonMenuImageByName(menu)
    || yellowtailMenuImageByName(menu)
    || winterMenuImageByName(menu)
    || menu.seasonalIngredientIds?.map((id) => getPetFeedIconImageById(id)).find(Boolean)

  if (menuImage) {
    return <img alt="" aria-hidden="true" className="sudal-menu-dish-icon" src={menuImage} />
  }

  return ingredientIconImage(menu.ingredients[0]?.name ?? menu.name)
}

function cornMenuImageByName(menu: Menu) {
  const name = menu.name
  const isCornMenu = menu.seasonalIngredientIds?.includes('corn') || name.includes('옥수수')
  if (!isCornMenu) return ''

  if (name.includes('솥밥')) return cornPotRiceImage
  if (name.includes('냉수프') || name.includes('냉스프')) return cornColdSoupImage
  if (name.includes('삶기')) return cornBoiledImage
  if (name.includes('버터')) return cornButterGrillImage
  if (name.includes('크림')) return cornCreamSoupImage
  if (name.includes('구이')) return cornGrillImage
  if (name.includes('전')) return cornJeonImage
  if (name.includes('샐러드')) return cornSaladImage
  if (name.includes('밥')) return cornRiceImage
  return ''
}

function tomatoMenuImageByName(menu: Menu) {
  const name = menu.name
  const isTomatoMenu = menu.seasonalIngredientIds?.includes('tomato') || name.includes('토마토')
  if (!isTomatoMenu) return ''

  if (name.includes('냉파스타')) return tomatoColdPastaImage
  if (name.includes('마리네')) return tomatoMarinadeImage
  if (name.includes('절임')) return tomatoPickleImage
  if (name.includes('카프레제')) return tomatoCapreseImage
  if (name.includes('달걀') || name.includes('계란')) return tomatoEggStirFryImage
  if (name.includes('샐러드')) return tomatoSaladImage
  if (name.includes('파스타')) return tomatoPastaImage
  if (name.includes('수프') || name.includes('스프')) return tomatoSoupImage
  return ''
}

function peachMenuImageByName(menu: Menu) {
  const name = menu.name
  const isPeachMenu = menu.seasonalIngredientIds?.includes('peach') || name.includes('복숭아')
  if (!isPeachMenu) return ''

  if (name.includes('카프레제')) return peachCapreseImage
  if (name.includes('요거트')) return peachYogurtBowlImage
  if (name.includes('빙수')) return peachBingsuImage
  if (name.includes('청')) return peachCheongImage
  if (name.includes('콤포트')) return peachCompoteImage
  if (name.includes('조림')) return peachJorimImage
  if (name.includes('샐러드')) return peachSaladImage
  if (name.includes('상그리아')) return peachSangriaImage
  if (name.includes('스무디')) return peachSmoothieImage
  if (name.includes('타르트')) return peachTartImage
  if (name.includes('케이크') || name === '케이크') return peachCakeImage
  return ''
}

function watermelonMenuImageByName(menu: Menu) {
  const name = menu.name
  const isWatermelonMenu = menu.seasonalIngredientIds?.includes('watermelon') || name.includes('수박')
  if (!isWatermelonMenu) return ''

  if (name.includes('콩국수')) return watermelonKongguksuImage
  if (name.includes('페타')) return watermelonFetaSaladImage
  if (name.includes('빙수')) return watermelonBingsuImage
  if (name.includes('샐러드')) return watermelonSaladImage
  if (name.includes('화채')) return watermelonHwachaeImage
  if (name.includes('펀치')) return watermelonPunchImage
  if (name.includes('주스')) return watermelonJuiceImage
  if (name.includes('스무디')) return watermelonSmoothieImage
  if (name.includes('셔벗') || name.includes('샤베트') || name.includes('소르베')) return watermelonSherbetImage
  return ''
}

function yellowtailMenuImageByName(menu: Menu) {
  const name = menu.name
  const isYellowtailMenu = menu.seasonalIngredientIds?.includes('yellowtail') || name.includes('방어')
  if (!isYellowtailMenu) return ''

  if (name.includes('덮밥')) return menuDishImageById('yellowtail-sashimi-bowl')
  if (name.includes('구이')) return menuDishImageById('yellowtail-grill')
  if (name.includes('조림')) return menuDishImageById('yellowtail-jorim')
  if (name.includes('회')) return menuDishImageById('yellowtail-sashimi')
  if (name.includes('매운탕')) return menuDishImageById('yellowtail-spicy-fish-stew')
  if (name.includes('초밥')) return menuDishImageById('yellowtail-sushi')
  return ''
}

function winterMenuImageByName(menu: Menu) {
  const name = menu.name
  const seasonalIds = menu.seasonalIngredientIds ?? []
  const hasSeasonal = (id: string) => seasonalIds.includes(id)

  if (hasSeasonal('oyster') || name.includes('굴')) {
    if (name.includes('국밥')) return menuDishImageById('oyster-gukbap')
    if (name.includes('무침')) return menuDishImageById('oyster-muchim')
    if (name.includes('튀김')) return menuDishImageById('oyster-fried')
    if (name.includes('떡국')) return menuDishImageById('oyster-tteokguk')
    if (name.includes('생굴')) return menuDishImageById('raw-oyster')
    if (name.includes('찜')) return menuDishImageById('oyster-jjim')
    if (name.includes('전')) return menuDishImageById('oyster-jeon')
  }

  if (hasSeasonal('radish') || name.includes('무') || name.includes('동치미') || name.includes('깍두기')) {
    if (name.includes('소고기국')) return menuDishImageById('radish-beef-soup')
    if (name.includes('동치미')) return menuDishImageById('radish-dongchimi')
    if (name.includes('말랭이')) return menuDishImageById('dried-radish-muchim')
    if (name.includes('깍두기')) return menuDishImageById('kkakdugi')
    if (name.includes('조림')) return menuDishImageById('radish-jorim')
    if (name.includes('전')) return menuDishImageById('radish-jeon')
    if (name.includes('생채')) return menuDishImageById('radish-saengchae')
    if (name.includes('국')) return menuDishImageById('radish-soup')
  }

  if (hasSeasonal('cabbage') || name.includes('배추')) {
    if (name.includes('밀푀유') || name.includes('나베')) return menuDishImageById('cabbage-hotpot')
    if (name.includes('된장무침')) return menuDishImageById('cabbage-doenjang-muchim')
    if (name.includes('된장국')) return menuDishImageById('cabbage-doenjang-soup')
    if (name.includes('겉절이')) return menuDishImageById('cabbage-geotjeori')
    if (name.includes('김치')) return menuDishImageById('cabbage-kimchi')
    if (name.includes('전')) return menuDishImageById('cabbage-jeon')
    if (name.includes('쌈')) return menuDishImageById('cabbage-ssam')
  }

  if (hasSeasonal('mandarin') || name.includes('귤')) {
    if (name.includes('푸딩')) return menuDishImageById('mandarin-pudding')
    if (name.includes('케이크')) return menuDishImageById('mandarin-cake')
    if (name.includes('타르트')) return menuDishImageById('mandarin-tart')
    if (name.includes('청')) return menuDishImageById('mandarin-cheong')
    if (name.includes('화채')) return menuDishImageById('mandarin-hwachae')
    if (name.includes('주스')) return menuDishImageById('mandarin-juice')
    if (name.includes('마말레이드') || name.includes('마멀레이드')) return menuDishImageById('mandarin-marmalade')
    if (name === '귤') return menuDishImageById('mandarin')
  }

  if (hasSeasonal('cod') || name.includes('대구')) {
    if (name.includes('탕')) return menuDishImageById('cod-stew')
    if (name.includes('뽈찜')) return menuDishImageById('cod-ppoljjim')
    if (name.includes('조림')) return menuDishImageById('cod-jorim')
    if (name.includes('전')) return menuDishImageById('cod-jeon')
    if (name.includes('튀김')) return menuDishImageById('cod-fried')
    if (name.includes('찜')) return menuDishImageById('cod-jjim')
  }

  if (hasSeasonal('spinach') || name.includes('시금치')) {
    if (name.includes('나물')) return menuDishImageById('spinach-namul')
    if (name.includes('된장무침')) return menuDishImageById('spinach-doenjang-muchim')
    if (name.includes('된장국')) return menuDishImageById('spinach-doenjang-soup')
    if (name.includes('계란') || name.includes('달걀')) return menuDishImageById('spinach-egg-stir-fry')
    if (name.includes('전')) return menuDishImageById('spinach-jeon')
    if (name.includes('파스타')) return menuDishImageById('spinach-pasta')
  }

  if (hasSeasonal('cockle') || name.includes('꼬막')) {
    if (name.includes('비빔밥')) return menuDishImageById('cockle-bibimbap')
    if (name.includes('된장찌개')) return menuDishImageById('cockle-doenjang-jjigae')
    if (name.includes('전')) return menuDishImageById('cockle-jeon')
    if (name.includes('무침')) return menuDishImageById('cockle-muchim')
    if (name.includes('찜')) return menuDishImageById('cockle-jjim')
  }

  if (hasSeasonal('lotus-root') || name.includes('연근')) {
    if (name.includes('조림')) return menuDishImageById('lotus-root-jorim')
    if (name.includes('튀김')) return menuDishImageById('lotus-root-fried')
    if (name.includes('전')) return menuDishImageById('lotus-root-jeon')
    if (name.includes('밥')) return menuDishImageById('lotus-root-rice')
    if (name.includes('샐러드')) return menuDishImageById('lotus-root-salad')
    if (name.includes('차')) return menuDishImageById('lotus-root-tea')
  }

  if (hasSeasonal('burdock') || name.includes('우엉')) {
    if (name.includes('김밥')) return menuDishImageById('burdock-gimbap')
    if (name.includes('튀김')) return menuDishImageById('burdock-fried')
    if (name.includes('전')) return menuDishImageById('burdock-jeon')
    if (name.includes('조림')) return menuDishImageById('burdock-jorim')
    if (name.includes('밥')) return menuDishImageById('burdock-rice')
    if (name.includes('차')) return menuDishImageById('burdock-tea')
  }

  if (hasSeasonal('hallabong') || name.includes('한라봉')) {
    if (name.includes('샐러드')) return menuDishImageById('hallabong-salad')
    if (name.includes('청')) return menuDishImageById('hallabong-cheong')
    if (name.includes('주스')) return menuDishImageById('hallabong-juice')
    if (name.includes('마말레이드') || name.includes('마멀레이드')) return menuDishImageById('hallabong-marmalade')
    if (name.includes('타르트')) return menuDishImageById('hallabong-tart')
  }

  return ''
}

function MyPage({
  coupons,
  exp,
  orderHistory,
  usedCouponIds,
  onClose,
}: {
  coupons: RewardCoupon[]
  exp: number
  orderHistory: OrderHistoryItem[]
  usedCouponIds: string[]
  onClose: () => void
}) {
  const [page, setPage] = useState<'overview' | 'coupons' | 'orderDetail'>('overview')
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const totalSpent = orderHistory.reduce((sum, order) => sum + order.total, 0)
  const level = getPetLevel(exp)
  const availableCouponCount = coupons.filter((coupon) => !usedCouponIds.includes(coupon.id)).length
  const nextCouponRemainingExp = couponRewardExp - (exp % couponRewardExp)
  const selectedOrder = orderHistory.find((order) => order.id === selectedOrderId)
  const pageTitle = page === 'coupons' ? '내 쿠폰함' : page === 'orderDetail' ? '주문 상세' : '마이페이지'

  function goBack() {
    if (page === 'overview') {
      onClose()
      return
    }
    setPage('overview')
    setSelectedOrderId(null)
  }

  return (
    <section className="my-page">
      <header className="my-page-header">
        <button aria-label={page === 'overview' ? '마이페이지 닫기' : '마이페이지로 돌아가기'} onClick={goBack} type="button">
          <img alt="" aria-hidden="true" className="sudal-ui-icon" src={getPetUiIconImage('back')} />
        </button>
        <h1>{pageTitle}</h1>
        <span />
      </header>

      {page === 'overview' && (
        <>
          <div className="my-page-profile">
                <span aria-hidden="true"><img alt="" className="sudal-modal-icon" src={getPetUiIconImage('profile')} /></span>
            <div>
              <strong>제철 미식가</strong>
              <p><span>LEVEL {level}</span></p>
            </div>
          </div>

          <div className="my-page-summary">
            <div><span>주문</span><strong>{orderHistory.length}건</strong></div>
            <button className="my-coupon-summary-button" onClick={() => setPage('coupons')} type="button">
              <span>보유 쿠폰</span>
              <strong>{availableCouponCount}장 ›</strong>
            </button>
          </div>

          <section className="my-order-history">
            <div className="my-order-title">
              <h2>내 주문 내역</h2>
              <span>최근 주문순</span>
            </div>

            {orderHistory.length === 0 && (
              <div className="my-order-empty">
                <strong>아직 주문 내역이 없어요</strong>
                <p>상품을 구매하면 주문 내역이 여기에 쌓여요.</p>
              </div>
            )}

            {orderHistory.map((order) => (
              <button
                className="my-order-card"
                key={order.id}
                onClick={() => {
                  setSelectedOrderId(order.id)
                  setPage('orderDetail')
                }}
                type="button"
              >
                <div className="my-order-card-head">
                  <span>{order.orderedAt}</span>
                  <strong>{order.status}</strong>
                </div>
                <div className="my-order-items">
                  <em aria-hidden="true">{ingredientIconImage(order.items[0]?.name ?? '')}</em>
                  <div>
                    <strong>{order.items[0]?.name ?? '제철 상품'}{order.items.length > 1 ? ` 외 ${order.items.length - 1}개` : ''}</strong>
                    <p>{order.items.map((item) => `${item.name} ${item.quantity} × ${item.count}`).join(' · ')}</p>
                  </div>
                </div>
                {order.discount > 0 && <div className="my-order-discount"><span>쿠폰 할인</span><b>-{formatWon(order.discount)}</b></div>}
                <div className="my-order-total"><span>결제 금액</span><b>{formatWon(order.total)} ›</b></div>
              </button>
            ))}
          </section>
        </>
      )}

      {page === 'coupons' && (
        <section className="my-coupon-wallet my-coupon-page">
          <div className="my-order-title">
            <h2>내 쿠폰함</h2>
            <span>20% 할인 · 최대 2만원</span>
          </div>

          {coupons.length === 0 && (
            <div className="my-coupon-empty">
              <span aria-hidden="true"><img alt="" className="sudal-modal-icon" src={getPetUiIconImage('coupon')} /></span>
              <strong>아직 보유한 쿠폰이 없어요</strong>
              <p>{nextCouponRemainingExp.toLocaleString('ko-KR')} XP를 더 모으면 20% 할인 쿠폰을 받아요.</p>
            </div>
          )}

          <div className="my-coupon-list">
            {coupons.map((coupon) => {
              const used = usedCouponIds.includes(coupon.id)
              return (
                <article className={`my-coupon-card ${used ? 'used' : ''}`} key={coupon.id}>
                  <img alt="20% 할인, 최대 2만원 적용 가능한 프로 할인 쿠폰" src={discountCouponImage} />
                  <div>
                    <span>{used ? '사용 완료' : '사용 가능'}</span>
                    <strong>레벨 {coupon.level} 달성 쿠폰</strong>
                    <p>누적 {coupon.milestoneExp.toLocaleString('ko-KR')} XP 달성 보상 · 최대 2만원 할인</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {page === 'orderDetail' && selectedOrder && (
        <section className="my-order-detail">
          <div className="my-order-detail-status">
            <span>{selectedOrder.orderedAt}</span>
            <strong>{selectedOrder.status}</strong>
            <p>주문번호 #{String(selectedOrder.id).padStart(6, '0')}</p>
          </div>

          <div className="my-order-detail-products">
            <h2>주문 상품</h2>
            {selectedOrder.items.map((item, index) => (
              <article key={`${item.name}-${index}`}>
                <em aria-hidden="true">{ingredientIconImage(item.name)}</em>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.quantity} · {item.count}개</span>
                  <b>{formatWon(item.price * item.count)}</b>
                </div>
              </article>
            ))}
          </div>

          <div className="my-order-detail-payment">
            <h2>결제 정보</h2>
            <div>
              <span>상품 금액</span>
              <b>{formatWon(selectedOrder.items.reduce((total, item) => total + item.price * item.count, 0))}</b>
            </div>
            <div>
              <span>배송비</span>
              <b>무료</b>
            </div>
            {selectedOrder.discount > 0 && (
              <div>
                <span>쿠폰 할인</span>
                <b className="discount">-{formatWon(selectedOrder.discount)}</b>
              </div>
            )}
            <div className="total">
              <strong>총 결제 금액</strong>
              <b>{formatWon(selectedOrder.total)}</b>
            </div>
          </div>
        </section>
      )}
    </section>
  )
}

function PetHomeScreen({
  level,
  exp,
  background,
  outfit,
  accessory,
  feedIngredients,
  decorItems,
  shoppingRewardUnlocked,
  onClearDecor,
  onFeed,
  onSelectDecor,
  onShare: onShareFallback,
  onScrollActivity,
}: {
  level: number
  exp: number
  background: string
  outfit: string
  accessory: string
  feedIngredients: FeedIngredient[]
  decorItems: DecorItem[]
  shoppingRewardUnlocked: boolean
  onClearDecor: (type: 'outfit' | 'accessory') => void
  onFeed: (ingredient: FeedIngredient) => void
  onSelectDecor: (item: DecorItem) => void
  onShare: () => void
  onScrollActivity: () => void
}) {
  const [decorTab, setDecorTab] = useState<PetHomeDecorTab>('all')
  const [petTab, setPetTab] = useState<'feed' | 'decor'>('feed')
  const petRoomRef = useRef<HTMLDivElement>(null)
  const petHomeDecorItems = decorItems.filter((item) => item.type !== 'outfit' && isPetHomeVisibleDecorItem(item))
  const visibleItems = decorTab === 'all' ? petHomeDecorItems : petHomeDecorItems.filter((item) => item.type === decorTab)
  const canClearDecor = decorTab === 'accessory'
  const isClearSelected = accessory === ''
  const levelExpStatus = getLevelExpStatus(exp, level)
  const levelProgress = getLevelProgress(exp, level)
  const expLabel = `${levelExpStatus.currentExp.toLocaleString('ko-KR')}/${levelExpStatus.requiredExp.toLocaleString('ko-KR')} xp`
  const roomImage = getRoomBackgroundImage(background)
  const decorTabs: { id: PetHomeDecorTab; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'background', label: '방' },
    { id: 'accessory', label: '소품' },
  ]
  const decorTabIcons = {
    all: petTabAllIcon,
    background: petTabRoomIcon,
    accessory: petTabAccessoryIcon,
  } as const

  async function sharePetHomeImage() {
    const target = petRoomRef.current
    if (!target) return

    try {
      const canvas = await renderPetHomeShareCanvas(target, {
        background,
        roomImage,
      })
      const blob = await canvasToBlob(canvas)
      const file = new File([blob], 'mukbo-pet-home.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mukbo pet home',
          text: 'Sharing my pet home',
        })
        return
      }

      downloadBlob(blob, file.name)
    } catch {
      onShareFallback()
    }
  }

  function onShare() {
    void sharePetHomeImage()
  }

  return (
    <section className="screen pet-home-screen" onScroll={onScrollActivity}>
      <div className="pet-home-shell">
      <div
        className={`pet-room-stage ${roomClass(background)} ${roomImage ? 'has-room-image' : ''}`}
        ref={petRoomRef}
        style={roomImage ? { backgroundImage: `url(${roomImage})` } : undefined}
      >
        <button className="pet-share-button" aria-label="수달 영역 캡처" onClick={onShare} type="button">
          <img alt="" aria-hidden="true" src={getPetShareIconImage()} />
        </button>
        <PetAvatar outfit={outfit} background={background} accessory={accessory} body="sudal" />
      </div>

      <div className="pet-action-panel">
        <div className="pet-action-tabs" aria-label="펫홈 작업">
          <button className={petTab === 'feed' ? 'active' : ''} onClick={() => setPetTab('feed')} type="button">
            <img className="pet-action-tab-icon" alt="" aria-hidden="true" src={petTabFeedIcon} />
            <b>밥먹기</b>
          </button>
          {decorTabs.map((tab) => (
            <button
              className={petTab === 'decor' && decorTab === tab.id ? 'active' : ''}
              key={tab.id}
              onClick={() => {
                setPetTab('decor')
                setDecorTab(tab.id)
              }}
              type="button"
            >
              <img className="pet-action-tab-icon" alt="" aria-hidden="true" src={decorTabIcons[tab.id]} />
              <b>{tab.label}</b>
            </button>
          ))}
        </div>

        {petTab === 'feed' && (
          <section className="pet-feed-panel">
            <div className="level-card">
              <div className="pet-level-card-main">
                <div className="pet-level-mark">
                  <small>LEVEL</small>
                  <strong>{level}</strong>
                </div>
                <div className="pet-level-copy">
                  <span>{expLabel}</span>
                </div>
              </div>
              <div className="pet-level-progress-row">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
                </div>
                <b>{Math.round(levelProgress)}%</b>
              </div>
            </div>
            <div className="feed-list compact-feed-list">
              {feedIngredients.length === 0 && (
                <p className="empty">메뉴를 주문해 주세요</p>
              )}
              {feedIngredients.map((ingredient) => (
                <button className="feed-card" key={ingredient.id} onClick={() => onFeed(ingredient)} type="button">
                  <span className="feed-card-icon" aria-hidden="true">{ingredientIconImage(ingredient.name, 'feed-card-icon-image')}</span>
                  <span>
                    <strong>{ingredient.name}</strong>
                    <small>{ingredient.menuName}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {petTab === 'decor' && (
          <div className="pet-inventory">
            <div className="decor-grid">
              {canClearDecor && (
                <button
                  className={`decor-card pet-decor-card clear-card ${isClearSelected ? 'selected' : ''}`}
                  onClick={() => onClearDecor(decorTab)}
                  type="button"
                >
                  <span className="decor-card-visual decor-card-empty" aria-hidden="true">
                    <img alt="" src={getPetClearDecorIconImage()} />
                  </span>
                  <strong>미착용</strong>
                </button>
              )}
              {visibleItems
                .map((item, index) => ({
                  item,
                  unlocked: isDecorUnlocked(item, level, shoppingRewardUnlocked),
                  selected: item.name === background || item.name === outfit || item.name === accessory,
                  itemRoomImage: item.type === 'background' ? getRoomBackgroundImage(item.name) : undefined,
                  itemDecorImage: item.type === 'accessory' ? getSudalAccessoryPreviewImage(item.name) : '',
                  index,
                }))
                .sort((a, b) => Number(b.unlocked) - Number(a.unlocked) || a.index - b.index)
                .map(({ item, unlocked, selected, itemRoomImage, itemDecorImage }) => (
                  <button className={`decor-card pet-decor-card ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}`} key={item.id} onClick={() => onSelectDecor(item)} type="button">
                    <span
                      className={itemRoomImage ? 'decor-card-visual room-thumbnail' : 'decor-card-visual'}
                      style={itemRoomImage ? { backgroundImage: `url(${itemRoomImage})` } : undefined}
                    >
                      {!itemRoomImage && itemDecorImage && <img alt="" src={itemDecorImage} />}
                      {!itemRoomImage && !itemDecorImage && decorIcon(item)}
                    </span>
                    <strong>{item.name}</strong>
                    <small>{unlocked ? item.badge ?? '' : item.unlockByShopping ? '장보기 보상' : `Lv.${item.unlockLevel}`}</small>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </section>
  )
}

function decorIcon(item: DecorItem) {
  const iconImage = getPetDecorIconImage(item)
  return iconImage ? <img alt="" aria-hidden="true" className="sudal-decor-fallback-icon" src={iconImage} /> : null
}

const petHomeAccessoryIds = new Set([
  'bell-necklace',
  'pearl-blossom-necklace',
  'shell-necklace',
  'acorn-maple-necklace',
  'snow-pearl-necklace',
])

function isPetHomeVisibleDecorItem(item: DecorItem) {
  if (item.type === 'background') return true
  if (item.type === 'accessory') return petHomeAccessoryIds.has(item.id)
  return false
}

function roomClass(background: string) {
  if (background.includes('봄꽃')) return 'spring'
  if (background.includes('바닷가') || background.includes('여름')) return 'summer'
  if (background.includes('낙엽') || background.includes('가을')) return 'autumn'
  if (background.includes('눈꽃') || background.includes('겨울')) return 'winter'
  if (background.includes('피크닉')) return 'picnic'
  if (background.includes('초록')) return 'garden'
  if (background.includes('야시장')) return 'night'
  if (background.includes('구름')) return 'cloud'
  return 'sunny'
}

function TabBar({ current, cartCount, onChange }: { current: Screen; cartCount: number; onChange: (screen: Screen) => void }) {
  const tabs: { id: Screen; label: string; icon: string }[] = [
    { id: 'home', label: '제철홈', icon: getPetUiIconImage('home') },
    { id: 'shopping', label: '장바구니', icon: getPetUiIconImage('cart') },
    { id: 'petHome', label: '펫홈', icon: getPetUiIconImage('pet') },
  ]

  return (
    <nav className="tab-bar" aria-label="하단 탭">
      {tabs.map((tab) => (
        <button className={current === tab.id ? 'active' : ''} key={tab.id} onClick={() => onChange(tab.id)} type="button">
          <span className="tab-icon" aria-hidden="true">
            <img alt="" src={tab.icon} />
            {tab.id === 'shopping' && cartCount > 0 && <b>{cartCount}</b>}
          </span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

function isDecorUnlocked(item: DecorItem, level: number, shoppingRewardUnlocked: boolean) {
  if (item.unlockByShopping) return shoppingRewardUnlocked
  if (item.unlockLevel) return level >= item.unlockLevel
  return true
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas export failed'))
    }, 'image/png')
  })
}

async function renderPetHomeShareCanvas(
  target: HTMLElement,
  { background, roomImage }: { background: string; roomImage?: string },
) {
  const bounds = target.getBoundingClientRect()
  const scale = Math.max(2, window.devicePixelRatio || 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bounds.width * scale)
  canvas.height = Math.round(bounds.height * scale)

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas context unavailable')

  context.scale(scale, scale)

  if (roomImage) {
    const backgroundImage = await loadCanvasImage(roomImage)
    drawImageCover(context, backgroundImage, 0, 0, bounds.width, bounds.height)
  } else {
    drawPetRoomFallbackBackground(context, roomClass(background), bounds.width, bounds.height)
  }

  const petElement = target.querySelector('.dress-pet')
  const petBounds = petElement?.getBoundingClientRect()
  if (!petBounds) return canvas

  const petRect = {
    height: petBounds.height,
    width: petBounds.width,
    x: petBounds.left - bounds.left,
    y: petBounds.top - bounds.top,
  }

  await drawSvgImageLayers(context, target, petRect)

  return canvas
}

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight)
}

async function drawSvgImageLayers(
  context: CanvasRenderingContext2D,
  target: HTMLElement,
  petRect: { height: number; width: number; x: number; y: number },
) {
  const layers = Array.from(target.querySelectorAll<SVGImageElement>('.sudal-pet image'))

  for (const layer of layers) {
    const href = layer.href.baseVal || layer.getAttribute('href')
    if (!href) continue

    const image = await loadCanvasImage(href)
    const frame = {
      height: Number(layer.getAttribute('height') ?? 0),
      width: Number(layer.getAttribute('width') ?? 0),
      x: Number(layer.getAttribute('x') ?? 0),
      y: Number(layer.getAttribute('y') ?? 0),
    }

    drawImageMeet(
      context,
      image,
      petRect.x + (frame.x / 260) * petRect.width,
      petRect.y + (frame.y / 340) * petRect.height,
      (frame.width / 260) * petRect.width,
      (frame.height / 340) * petRect.height,
    )
  }
}

function drawImageMeet(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight)
}

function drawPetRoomFallbackBackground(context: CanvasRenderingContext2D, className: string, width: number, height: number) {
  const gradient = context.createLinearGradient(0, 0, 0, height)
  if (className === 'winter') {
    gradient.addColorStop(0, '#bfe7ff')
    gradient.addColorStop(0.54, '#edf6ff')
    gradient.addColorStop(1, '#dfefff')
  } else if (className === 'summer') {
    gradient.addColorStop(0, '#9edcf9')
    gradient.addColorStop(0.54, '#9edcf9')
    gradient.addColorStop(0.55, '#f7d886')
    gradient.addColorStop(1, '#f7d886')
  } else if (className === 'autumn') {
    gradient.addColorStop(0, '#e4b06c')
    gradient.addColorStop(1, '#d98955')
  } else if (className === 'night') {
    gradient.addColorStop(0, '#3f5578')
    gradient.addColorStop(1, '#927754')
  } else {
    gradient.addColorStop(0, '#f7cf79')
    gradient.addColorStop(1, '#f6c86d')
  }
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export default App
