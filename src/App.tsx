import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'
import PetAvatar from './components/PetAvatar'
import { getRoomBackgroundImage } from './data/decorAssets'
import { fallbackAppData, loadAppData } from './services/appDataService'
import type { DecorItem, Ingredient, Menu, Screen, SeasonalIngredient, SeasonKey } from './types'

declare global {
  interface Window {
    kakao?: any
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
// 작업: 펫 레벨업 기준을 누적 XP로 관리합니다.
// 개인 수정 가능: 2레벨/3레벨 기준을 바꾸고 싶으면 아래 숫자만 조정하면 됩니다.
// 적용 위치: 펫홈 레벨 표시, 경험치 바, 꾸미기 아이템 잠금 해제 조건.
const petLevelThresholds = [
  { level: 1, minExp: 0 },
  { level: 2, minExp: 10000 },
  { level: 3, minExp: 30000 },
] as const

// 작업: 메뉴와 식재료 가격을 동일한 수치의 XP로 사용합니다.
// 적용 위치: 메뉴 카드 XP 표시, 밥먹이기 버튼, 실제 펫 경험치 증가량.

const receiptDrafts = [
  { id: 1, title: '라인형 영수증' },
]

const kakaoMapAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY as string | undefined

type ShopStep = 'store' | 'detail' | 'cart' | 'checkout' | 'complete'

type FeedIngredient = Ingredient & {
  id: string
  menuName: string
}

type OrderSnapshot = {
  checkedPrice: number
  orderTotal: number
}

type OrderHistoryItem = {
  id: number
  orderedAt: string
  items: { name: string; quantity: string }[]
  total: number
  status: '주문 완료'
}

type NearbyRestaurant = {
  id: string
  name: string
  menuName: string
  emoji: string
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
}

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
  return petLevelThresholds.reduce((currentLevel, threshold) => (
    totalExp >= threshold.minExp ? threshold.level : currentLevel
  ), 1)
}

function getNextLevelThreshold(level: number) {
  return petLevelThresholds.find((threshold) => threshold.level > level)
}

function getCurrentLevelThreshold(level: number) {
  let currentThreshold = 0
  for (const threshold of petLevelThresholds) {
    if (threshold.level <= level) currentThreshold = threshold.minExp
  }
  return currentThreshold
}

function getLevelProgress(totalExp: number, level: number) {
  const nextThreshold = getNextLevelThreshold(level)
  if (!nextThreshold) return 100

  const currentThreshold = getCurrentLevelThreshold(level)
  const levelRange = nextThreshold.minExp - currentThreshold
  return Math.min(100, Math.max(0, ((totalExp - currentThreshold) / levelRange) * 100))
}

function App() {
  const [appData, setAppData] = useState(fallbackAppData)
  const { decorItems, menus, seasonalIngredients, seasons } = appData
  const firstSummerIngredient = seasonalIngredients.find((item) => item.seasonKey === 'summer') ?? seasonalIngredients[0]
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([])
  const [shoppingCatalogMenuIds, setShoppingCatalogMenuIds] = useState<string[]>([])
  const [selectedMenuOpen, setSelectedMenuOpen] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>('summer')
  const [selectedSeasonalIngredientId, setSelectedSeasonalIngredientId] = useState(firstSummerIngredient.id)
  // 작업: 결제 완료된 식재료를 펫에게 먹일 수 있는 재고로 저장합니다.
  // 개인 수정 가능: 재료 카드에 더 많은 정보를 보여주고 싶으면 FeedIngredient 타입에 필드를 추가하면 됩니다.
  // 적용 위치: 주문 완료 후 펫홈 > 밥먹이기 목록.
  const [feedIngredients, setFeedIngredients] = useState<FeedIngredient[]>([])
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([])
  const [removedCartIngredientKeys, setRemovedCartIngredientKeys] = useState<string[]>([])
  const [lastOrder, setLastOrder] = useState<OrderSnapshot | null>(null)
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([])
  const [profileOpen, setProfileOpen] = useState(false)
  // 작업: 펫 경험치는 레벨별 잔여치가 아니라 누적 XP로 저장합니다.
  // 개인 수정 가능: 기본 시작 XP를 바꾸고 싶으면 0을 원하는 값으로 변경해도 됩니다.
  // 적용 위치: 펫홈 레벨 카드와 밥먹이기 후 성장 상태.
  const [exp, setExp] = useState(0)
  const [shopStep, setShopStep] = useState<ShopStep>('store')
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0])
  const [deliveryOption, setDeliveryOption] = useState(deliveryOptions[0])
  const [shoppingRewardUnlocked, setShoppingRewardUnlocked] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState('햇살 주방')
  const [selectedOutfit, setSelectedOutfit] = useState('기본 앞치마')
  const [selectedAccessory, setSelectedAccessory] = useState('장바구니')
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

  const today = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date())

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
    checkedIngredients.includes(ingredientKey(item.menuId, item.ingredient.name)) ? sum + item.ingredient.price : sum
  ), 0)
  const selectedDeliveryInfo = tossShoppingOptions[0]
  const orderTotal = checkedPrice + selectedDeliveryInfo.fee
  const displayCheckedPrice = shopStep === 'complete' ? lastOrder?.checkedPrice ?? checkedPrice : checkedPrice
  const displayOrderTotal = shopStep === 'complete' ? lastOrder?.orderTotal ?? orderTotal : orderTotal
  const checkedTotal = shoppingItems.filter((item) => checkedIngredients.includes(ingredientKey(item.menuId, item.ingredient.name))).length
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

  function toggleMenu(menuId: string) {
    setSelectedMenuIds((current) => {
      if (current.includes(menuId)) {
        setCheckedIngredients((keys) => keys.filter((key) => !key.startsWith(`${menuId}:`)))
        setRemovedCartIngredientKeys((keys) => keys.filter((key) => !key.startsWith(`${menuId}:`)))
        return current.filter((id) => id !== menuId)
      }
      setRemovedCartIngredientKeys((keys) => keys.filter((key) => !key.startsWith(`${menuId}:`)))
      const next = [...current, menuId]
      setSelectedMenuOpen(false)
      return next
    })
  }

  function removeMenu(menuId: string) {
    setSelectedMenuIds((current) => current.filter((id) => id !== menuId))
    setCheckedIngredients((current) => current.filter((key) => !key.startsWith(`${menuId}:`)))
    setRemovedCartIngredientKeys((current) => current.filter((key) => !key.startsWith(`${menuId}:`)))
  }

  function clearMenuSelection() {
    setSelectedMenuIds([])
    setCheckedIngredients([])
    setRemovedCartIngredientKeys([])
    setShoppingCatalogMenuIds([])
    setSelectedMenuOpen(false)
  }

  function feedPet(ingredient: FeedIngredient) {
    setExp((current) => current + getIngredientExp(ingredient))
    setFeedIngredients((current) => current.filter((item) => item.id !== ingredient.id))
  }

  function toggleIngredient(key: string) {
    setCheckedIngredients((current) => (
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    ))
  }

  function addShoppingProduct(menuId: string, ingredientName: string) {
    const key = ingredientKey(menuId, ingredientName)
    setSelectedMenuIds((current) => current.includes(menuId) ? current : [...current, menuId])
    setRemovedCartIngredientKeys((current) => current.filter((item) => item !== key))
    setCheckedIngredients((current) => current.includes(key) ? current : [...current, key])
    showToast(`${ingredientName}을 장바구니에 담았어요.`)
  }

  function toggleShoppingProduct(menuId: string, ingredientName: string) {
    const key = ingredientKey(menuId, ingredientName)
    if (checkedIngredients.includes(key)) {
      setCheckedIngredients((current) => current.filter((item) => item !== key))
      return
    }
    addShoppingProduct(menuId, ingredientName)
  }

  function completeOrderFlow() {
    const checkedItems = shoppingItems.filter((item) => checkedIngredients.includes(ingredientKey(item.menuId, item.ingredient.name)))
    if (checkedItems.length === 0) {
      showToast('구매할 상품을 선택해주세요.')
      setShopStep('store')
      return
    }
    const orderedKeys = checkedItems.map((item) => ingredientKey(item.menuId, item.ingredient.name))
    orderSequenceRef.current += 1
    const orderId = orderSequenceRef.current

    setLastOrder({ checkedPrice, orderTotal })
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
      })),
      total: orderTotal,
      status: '주문 완료',
    }, ...current])
    setRemovedCartIngredientKeys((current) => Array.from(new Set([...current, ...orderedKeys])))
    setFeedIngredients((current) => [
      ...current,
      ...checkedItems.map((item, index) => {
        const menu = selectedMenus.find((selectedMenu) => selectedMenu.id === item.menuId)
        return {
          ...item.ingredient,
          id: `${orderId}:${index}:${item.menuId}:${item.ingredient.name}`,
          menuName: menu?.name ?? '주문 메뉴',
        }
      }),
    ])
    setCheckedIngredients((current) => current.filter((key) => !orderedKeys.includes(key)))
    setSelectedMenuIds([])
    setSelectedMenuOpen(false)
    setShoppingRewardUnlocked(true)
    setShopStep('complete')
  }

  function restartShoppingAfterOrder() {
    setLastOrder(null)
    setShoppingCatalogMenuIds([])
    setShopStep('store')
    setScreen('shopping')
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
            today={today}
            seasons={seasons}
            allSeasonalIngredients={seasonalIngredients}
            allMenus={menus}
            seasonIngredients={seasonIngredients}
            seasonalMenus={seasonalMenus}
            checkedTotal={checkedTotal}
            selectedSeason={selectedSeason}
            selectedSeasonalIngredientId={activeSeasonalIngredientId}
            selectedMenuOpen={selectedMenuOpen}
            selectedMenus={selectedMenus}
            selectedMenuIds={selectedMenuIds}
            onRemoveMenu={removeMenu}
            onScrollActivity={handleScrollActivity}
            onSelectSeason={changeSeason}
            onSelectSeasonalIngredient={setSelectedSeasonalIngredientId}
            onSetSelectedMenuOpen={setSelectedMenuOpen}
            onToggleMenu={toggleMenu}
            onOpenCart={() => {
              setShoppingCatalogMenuIds(selectedMenuIds)
              setShopStep('cart')
              setScreen('shopping')
            }}
            onOpenProfile={() => setProfileOpen(true)}
            onCancelSelection={clearMenuSelection}
            onStartShopping={() => {
              if (selectedMenuIds.length === 0) {
                showToast('먼저 메뉴를 골라주세요.')
                return
              }
              setShoppingCatalogMenuIds(selectedMenuIds)
              setShopStep('store')
              setScreen('shopping')
            }}
          />
        )}

        {screen === 'shopping' && (
          <ShoppingScreen
            background={selectedBackground}
            accessory={selectedAccessory}
            checkedIngredients={checkedIngredients}
            checkedTotal={checkedTotal}
            deliveryOption={deliveryOption}
            deliveryOptions={deliveryOptions}
            catalogMenus={shoppingCatalogMenus}
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
            onToggleProduct={toggleShoppingProduct}
            onGoHome={() => {
              setLastOrder(null)
              setShopStep('store')
              setScreen('petHome')
            }}
            onRestartShopping={restartShoppingAfterOrder}
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
            onFeed={feedPet}
            onSelectDecor={selectDecor}
            onShare={copyShareLink}
            onScrollActivity={handleScrollActivity}
          />
        )}

        {profileOpen && (
          <MyPage orderHistory={orderHistory} onClose={() => setProfileOpen(false)} />
        )}

        <TabBar
          current={screen}
          onChange={(nextScreen) => {
            if (nextScreen === 'shopping' && screen !== 'shopping') {
              setShoppingCatalogMenuIds(selectedMenuIds)
              setShopStep('store')
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
  today,
  seasons,
  allSeasonalIngredients,
  allMenus,
  seasonIngredients,
  seasonalMenus,
  checkedTotal,
  selectedSeason,
  selectedSeasonalIngredientId,
  selectedMenuOpen,
  selectedMenus,
  selectedMenuIds,
  onRemoveMenu,
  onScrollActivity,
  onSelectSeason,
  onSelectSeasonalIngredient,
  onSetSelectedMenuOpen,
  onToggleMenu,
  onOpenCart,
  onOpenProfile,
  onCancelSelection,
  onStartShopping,
}: {
  today: string
  seasons: { key: SeasonKey; label: string; accent: string }[]
  allSeasonalIngredients: SeasonalIngredient[]
  allMenus: Menu[]
  seasonIngredients: SeasonalIngredient[]
  seasonalMenus: Menu[]
  checkedTotal: number
  selectedSeason: SeasonKey
  selectedSeasonalIngredientId: string
  selectedMenuOpen: boolean
  selectedMenus: Menu[]
  selectedMenuIds: string[]
  onRemoveMenu: (id: string) => void
  onScrollActivity: () => void
  onSelectSeason: (season: SeasonKey) => void
  onSelectSeasonalIngredient: (id: string) => void
  onSetSelectedMenuOpen: (open: boolean) => void
  onToggleMenu: (id: string) => void
  onOpenCart: () => void
  onOpenProfile: () => void
  onCancelSelection: () => void
  onStartShopping: () => void
}) {
  const [purchaseTab, setPurchaseTab] = useState<'cook' | 'delivery'>('cook')
  const [locationPreview, setLocationPreview] = useState(false)
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
  const nearbyRestaurants = seasonalMenus.map((menu, index) => ({
    id: `${menu.id}-restaurant`,
    name: index === 0 ? `오늘의 ${menu.name}` : `${menu.name} 맛집`,
    menuName: menu.name,
    emoji: shoppingItemEmoji(menu.ingredients[0]?.name ?? ''),
    distance: `${320 + index * 280}m`,
    eta: `${18 + index * 7}분`,
    rating: (4.8 - index * 0.1).toFixed(1),
  }))

  return (
    <section className="screen" onScroll={onScrollActivity}>
      <header className="home-global-bar">
        <label className="shopping-search">
          <span aria-hidden="true">🔍</span>
          <input
            aria-label="제철 음식과 메뉴 검색"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="제철 음식과 메뉴 검색"
            type="search"
            value={searchQuery}
          />
        </label>
        <button aria-label="마이페이지 열기" onClick={onOpenProfile} type="button">👤</button>
        <button aria-label={`장바구니 ${checkedTotal}개`} onClick={onOpenCart} type="button">
          🛒
          {checkedTotal > 0 && <b>{checkedTotal}</b>}
        </button>
      </header>

      {hasSearch ? (
        <section className="home-search-results">
          <div>
            <h2>제철 식재료 <span>{ingredientSearchResults.length}</span></h2>
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
                  <em aria-hidden="true">{ingredient.emoji}</em>
                  <span><strong>{ingredient.name}</strong><small>{ingredient.season} 제철</small></span>
                  <b>선택</b>
                </button>
              ))}
              {ingredientSearchResults.length === 0 && <p>일치하는 제철 식재료가 없어요.</p>}
            </div>
          </div>

          <div>
            <h2>메뉴 <span>{menuSearchResults.length}</span></h2>
            <div className="home-search-result-list">
              {menuSearchResults.map((menu) => {
                const selected = selectedMenuIds.includes(menu.id)
                return (
                  <button className={selected ? 'selected' : ''} key={menu.id} onClick={() => onToggleMenu(menu.id)} type="button">
                    <em aria-hidden="true">{shoppingItemEmoji(menu.ingredients[0]?.name ?? '')}</em>
                    <span><strong>{menu.name}</strong><small>{menu.ingredients.map((ingredient) => ingredient.name).join(' · ')}</small></span>
                    <b>{selected ? '선택됨' : '선택'}</b>
                  </button>
                )
              })}
              {menuSearchResults.length === 0 && <p>일치하는 메뉴가 없어요.</p>}
            </div>
          </div>
        </section>
      ) : (
        <>
          <header className="top-header">
            <p>{today}</p>
            <h1>제철음식 뭐가있을까?</h1>
          </header>

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
                  <span className="food-emoji" aria-hidden="true">{ingredient.emoji}</span>
                  <strong>{ingredient.name}</strong>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <nav className="home-purchase-tabs" aria-label="메뉴 이용 방법">
        <button className={purchaseTab === 'cook' ? 'active' : ''} onClick={() => setPurchaseTab('cook')} type="button">
          <span aria-hidden="true">🍳</span>
          요리
        </button>
        <button className={purchaseTab === 'delivery' ? 'active' : ''} onClick={() => setPurchaseTab('delivery')} type="button">
          <span aria-hidden="true">🛵</span>
          배달
        </button>
      </nav>

      {purchaseTab === 'cook' && (
        <>
          <div className="section-title sub-directory-title">
            <h2>메뉴 추천</h2>
            <span>{selectedMenuIds.length}개 선택</span>
          </div>

          <div className="menu-list nested-menu-list">
            {seasonalMenus.map((menu) => {
              const selected = selectedMenuIds.includes(menu.id)
              return (
                <button
                  className={`menu-card ${selected ? 'selected' : ''}`}
                  key={menu.id}
                  onClick={() => onToggleMenu(menu.id)}
                  style={{ '--menu-color': menu.color } as CSSProperties}
                  type="button"
                >
                  <div>
                    <strong>{menu.name}</strong>
                  </div>
                  <b>{getMenuExp(menu).toLocaleString('ko-KR')}xp</b>
                </button>
              )
            })}
          </div>
        </>
      )}

      {purchaseTab === 'delivery' && (
        <section className="home-delivery-panel">
          <div className="home-delivery-heading">
            <div>
              <span>총 {seasonalMenus.length}개 요리 · 내 주변 제철 맛집</span>
              <h2>{selectedSeasonalIngredient?.name ?? '제철 식재료'}로 만든 모든 요리</h2>
            </div>
            <button onClick={() => setLocationPreview(true)} type="button">📍 내 위치</button>
          </div>

          <KakaoRestaurantMap
            fallbackRestaurants={nearbyRestaurants}
            keyword={`${selectedSeasonalIngredient?.name ?? '제철'} 맛집`}
            useCurrentLocation={locationPreview}
          />

          <p className="home-location-status">
            {locationPreview ? '현재 위치를 허용하면 반경 5km 안의 결과를 우선 보여줘요.' : '카카오맵 키가 있으면 실제 장소 검색 결과가 지도에 표시돼요.'}
          </p>
        </section>
      )}

      {purchaseTab === 'cook' && selectedMenus.length > 0 && (
        <div className={`selected-menu-widget ${selectedMenuOpen ? 'open' : ''}`}>
          {selectedMenuOpen && (
            <>
              <button className="selected-menu-backdrop" aria-label="선택 메뉴 닫기" onClick={() => onSetSelectedMenuOpen(false)} type="button" />
              <div className="selected-menu-panel variant-2">
                {selectedMenus.map((menu) => (
                  <div className="selected-menu-chip" key={menu.id}>
                    <span>{menu.name}</span>
                    <button aria-label={`${menu.name} 삭제`} onClick={() => onRemoveMenu(menu.id)} type="button">×</button>
                  </div>
                ))}
                <div className="selected-menu-actions">
                  <button className="selected-menu-shop" onClick={onStartShopping} type="button">구매하기</button>
                  <button className="selected-menu-cancel" onClick={onCancelSelection} type="button">취소</button>
                </div>
              </div>
            </>
          )}
          <button className="selected-menu-fab" aria-label="선택 메뉴 열기" onClick={() => onSetSelectedMenuOpen(!selectedMenuOpen)} type="button">
            <span>{selectedMenus.length}</span>
          </button>
        </div>
      )}
    </section>
  )
}

function ShoppingScreen({
  background,
  accessory,
  catalogMenus,
  selectedMenus,
  checkedIngredients,
  checkedTotal,
  checkedPrice,
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
  onToggleProduct,
  onSelectPayment,
  onSelectDelivery,
  onSetStep,
  onCompleteOrder,
  onGoHome,
  onRestartShopping,
  onRemoveMenu,
  onScrollActivity,
}: {
  background: string
  accessory: string
  catalogMenus: Menu[]
  selectedMenus: Menu[]
  checkedIngredients: string[]
  checkedTotal: number
  checkedPrice: number
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
  onToggleProduct: (menuId: string, ingredientName: string) => void
  onSelectPayment: (method: string) => void
  onSelectDelivery: (option: string) => void
  onSetStep: (step: ShopStep) => void
  onCompleteOrder: () => void
  onGoHome: () => void
  onRestartShopping: () => void
  onRemoveMenu: (menuId: string) => void
  onScrollActivity: () => void
}) {
  const canContinue = checkedTotal > 0
  const allIngredientKeys = selectedMenus.flatMap((menu) => menu.ingredients.map((item) => ingredientKey(menu.id, item.name)))
  const allChecked = allIngredientKeys.length > 0 && allIngredientKeys.every((key) => checkedIngredients.includes(key))
  const catalogProducts = catalogMenus
    .flatMap((menu) => menu.ingredients.map((ingredient) => ({
      key: ingredientKey(menu.id, ingredient.name),
      menuId: menu.id,
      menuName: menu.name,
      ingredient,
    })))
    .filter((product, index, products) => products.findIndex((item) => item.ingredient.name === product.ingredient.name) === index)
  const [selectedProductKey, setSelectedProductKey] = useState('')
  const selectedProduct = catalogProducts.find((product) => product.key === selectedProductKey) ?? catalogProducts[0]
  const selectedCartProducts = selectedMenus.flatMap((menu) => menu.ingredients
    .filter((ingredient) => checkedIngredients.includes(ingredientKey(menu.id, ingredient.name)))
    .map((ingredient) => ({ menu, ingredient })))

  function openProduct(productKey: string) {
    setSelectedProductKey(productKey)
    onSetStep('detail')
  }

  return (
    <section className="screen toss-screen" onScroll={onScrollActivity}>
      {step === 'store' && (
        <div className="shopping-home">
          <nav className="shopping-category-tabs" aria-label="쇼핑 카테고리">
            <button className="active" type="button">쇼핑 홈</button>
            <button type="button">제철 식재료</button>
            <button type="button">특가</button>
            <button type="button">인기 상품</button>
          </nav>

          <button className="shopping-hero" onClick={() => catalogProducts[0] && openProduct(catalogProducts[0].key)} type="button">
            <span>이번 주 제철 특가</span>
            <strong>{catalogProducts[0]?.ingredient.name ?? '제철 식재료'}<br />최대 58% 할인</strong>
            <small>선택한 메뉴에 꼭 필요한 재료만 모았어요</small>
            <em aria-hidden="true">{shoppingItemEmoji(catalogProducts[0]?.ingredient.name ?? '')}</em>
          </button>

          <section className="shopping-recommendations">
            <div className="shopping-section-title">
              <h2>제철 메뉴를 위한 추천 상품</h2>
              <small>AI 추천</small>
            </div>
            <div className="shopping-product-grid">
              {catalogProducts.map((product, index) => {
                const discount = 38 + ((index * 7) % 48)
                return (
                  <article className={`shopping-product-card tone-${index % 6}`} key={product.key}>
                    <button className="shopping-product-main" onClick={() => openProduct(product.key)} type="button">
                      <span className="shopping-discount">{discount}% 특가</span>
                      <em aria-hidden="true">{shoppingItemEmoji(product.ingredient.name)}</em>
                      <strong>{product.ingredient.name}, {product.ingredient.quantity}</strong>
                      <small>● {(6.7 + index * 1.3).toFixed(1)}만 명 · ★ {(4.5 + (index % 4) * 0.1).toFixed(1)}</small>
                      <p>지금 30일 내 최저가 ↓</p>
                    </button>
                    <button
                      className={`shopping-card-cart ${checkedIngredients.includes(product.key) ? 'added' : ''}`}
                      aria-label={`${product.ingredient.name} ${checkedIngredients.includes(product.key) ? '선택 해제' : '선택'}`}
                      onClick={() => onToggleProduct(product.menuId, product.ingredient.name)}
                      type="button"
                    >
                      {checkedIngredients.includes(product.key) ? '✅' : '🛒'}
                    </button>
                  </article>
                )
              })}
            </div>
          </section>
          {checkedTotal > 0 && (
            <div className="shopping-home-buybar">
              <button onClick={() => onSetStep('cart')} type="button">
                {checkedTotal}개 상품 구매하기 · {formatWon(checkedPrice)}
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'detail' && selectedProduct && (
        <div className="shopping-detail">
          <header className="shopping-sub-header">
            <button aria-label="쇼핑 홈으로" onClick={() => onSetStep('store')} type="button">←</button>
            <div>
              <button aria-label="공유" type="button">📤</button>
              <button aria-label="검색" type="button">🔍</button>
              <button aria-label="장바구니" onClick={() => onSetStep('cart')} type="button">🛒</button>
            </div>
          </header>
          <div className="shopping-detail-visual">
            <em aria-hidden="true">{shoppingItemEmoji(selectedProduct.ingredient.name)}</em>
            <span>1 / 2</span>
          </div>
          <div className="shopping-detail-copy">
            <div className="shopping-detail-badges">
              <span>내일도착</span><span>늦으면보상</span><span>신선식품 1위</span>
            </div>
            <h1>{selectedProduct.ingredient.name}, {selectedProduct.ingredient.quantity}</h1>
            <p className="shopping-original-price">58% <del>{formatWon(Math.round(selectedProduct.ingredient.price / 0.42 / 100) * 100)}</del></p>
            <strong className="shopping-sale-price">{formatWon(selectedProduct.ingredient.price)}</strong>
            <p>무료배송</p>
            <dl>
              <div><dt>평점 · 리뷰</dt><dd>⭐ 4.7 (3,527)</dd></div>
              <div><dt>배송일정</dt><dd>내일 도착</dd></div>
              <div><dt>판매자</dt><dd>오늘의 제철마켓 · 공식</dd></div>
            </dl>
          </div>
          <div className="shopping-product-info">
            <div><span>중량, 수량</span><strong>{selectedProduct.ingredient.quantity}</strong></div>
            <h2>이 상품의 모든 상점 리뷰</h2>
            <div className="shopping-rating">⭐⭐⭐⭐⭐ <b>4.7</b> <span>(3,527개)</span></div>
            <blockquote>신선하고 포장도 꼼꼼해요. 제철 메뉴를 만들기 딱 좋은 재료예요.</blockquote>
          </div>
          <div className="shopping-detail-actions">
            <button aria-label="찜하기" type="button">🤍</button>
            <button onClick={() => onAddProduct(selectedProduct.menuId, selectedProduct.ingredient.name)} type="button">장바구니</button>
            <button onClick={() => {
              onAddProduct(selectedProduct.menuId, selectedProduct.ingredient.name)
              onSetStep('checkout')
            }} type="button">구매하기</button>
          </div>
        </div>
      )}

      {step === 'cart' && (
        <>
          <div className="shopping-cart-head">
            <button aria-label="제철홈으로" onClick={onGoHome} type="button">←</button>
            <div><strong>장바구니 {checkedTotal}</strong></div>
          </div>
          <div className="toss-menu-list">
            {selectedMenus.length === 0 && (
              <div className="empty-cart-pet">
                <PetAvatar outfit={outfit} background={background} accessory={accessory} />
                <h2>배고파요...</h2>
                <p>오늘은 뭐 먹을래요?</p>
                <div>
                  <button className="toss-primary" onClick={() => onSetStep('store')} type="button">장보러가기</button>
                  <button className="toss-secondary" onClick={onGoHome} type="button">펫 관리하기</button>
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
                <b>{checkedTotal}/{allIngredientKeys.length}</b>
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
                        return (
                          <label className="ingredient-row toss-row" key={key}>
                            <input checked={checkedIngredients.includes(key)} onChange={() => onToggleIngredient(key)} type="checkbox" />
                            <em aria-hidden="true">{shoppingItemEmoji(item.name)}</em>
                            <span>
                              <strong>내일 도착 예정</strong>
                              <small>{item.name}, {item.quantity}</small>
                            </span>
                            <b><del>{formatWon(Math.round(item.price * 1.7 / 100) * 100)}</del>{formatWon(item.price)}</b>
                          </label>
                        )
                      })}
                    </div>
                  </article>
                )
            })}
          </div>
          <div className="toss-cart-spacer" />
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
            <button aria-label="장바구니로" onClick={() => onSetStep('cart')} type="button">←</button>
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
            <h2>주문상품 {selectedCartProducts.length}건</h2>
            {selectedCartProducts.map(({ menu, ingredient }) => (
              <article key={ingredientKey(menu.id, ingredient.name)}>
                <em aria-hidden="true">{shoppingItemEmoji(ingredient.name)}</em>
                <div><strong>내일 도착 예정</strong><span>{ingredient.name}, {ingredient.quantity}</span><b>{formatWon(ingredient.price)} · 1개</b><small>무료 배송</small></div>
              </article>
            ))}
          </section>
          <section className="shopping-payment-section">
            <div className="shopping-coupon"><strong>쿠폰</strong><span>최대 할인 적용 중</span></div>
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
            <div className="shopping-total"><strong>총 결제 금액</strong><b>{formatWon(orderTotal)}</b><span>총 주문 금액</span><span>{formatWon(checkedPrice)}</span></div>
          </section>
          <div className="shopping-paybar">
            <button onClick={onCompleteOrder} type="button">{formatWon(orderTotal)} 결제하기</button>
            <small>실제 결제와 주문은 발생하지 않는 MVP 체험 화면입니다.</small>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="complete-card">
          <h2>주문 체험이 완료됐어요</h2>
          <p>실제 결제와 주문은 발생하지 않습니다.</p>
          <div className="receipt-mini">
            <div><span>결제 수단</span><b>{paymentMethod}</b></div>
            <div><span>배송 방식</span><b>{deliveryTypeInfo.name}</b></div>
            <div><span>배송 요청</span><b>{deliveryOption}</b></div>
            <div><span>총액</span><b>{formatWon(orderTotal)}</b></div>
          </div>
          <div className="receipt-drafts receipt-main" aria-label="주문 완료 영수증">
            {receiptDrafts.map((draft) => (
              <article className={`receipt-draft receipt-draft-${draft.id}`} key={draft.id}>
                {/* 작업: 선택된 라인형 영수증을 주문완료 메인 UI로 적용합니다.
                    개인 수정 가능: 항목 순서는 바꿔도 되지만 실제 주문값 바인딩은 유지해야 합니다.
                    적용 위치: 장보기 > 주문완료 화면의 메인 영수증. */}
                <div className="receipt-draft-head">
                  <strong>적용 영수증</strong>
                  <span>{draft.title}</span>
                </div>
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
                  <div>
                    <dt>총 결제금액</dt>
                    <dd>{formatWon(orderTotal)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
          <button className="toss-primary" onClick={onGoHome} type="button">밥주러 가기</button>
          <button className="toss-secondary wide" onClick={onRestartShopping} type="button">장보러 가기</button>
        </div>
      )}
    </section>
  )
}

function KakaoRestaurantMap({
  fallbackRestaurants,
  keyword,
  useCurrentLocation,
}: {
  fallbackRestaurants: NearbyRestaurant[]
  keyword: string
  useCurrentLocation: boolean
}) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const placeMarkerRef = useRef(new Map<string, { infoWindow: any; marker: any; position: any }>())
  const [statusMessage, setStatusMessage] = useState(kakaoMapAppKey ? '카카오맵을 불러오는 중이에요.' : '카카오맵 키를 설정하면 실제 지도가 표시돼요.')
  const [places, setPlaces] = useState<KakaoPlace[]>([])
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null)

  const openPlace = (place: KakaoPlace) => {
    setSelectedPlace(place)

    const markerInfo = placeMarkerRef.current.get(place.id)
    if (!markerInfo || !mapInstanceRef.current) return

    placeMarkerRef.current.forEach(({ infoWindow }) => infoWindow.close())
    markerInfo.infoWindow.open(mapInstanceRef.current, markerInfo.marker)
    mapInstanceRef.current.panTo(markerInfo.position)
  }

  useEffect(() => {
    const appKey = kakaoMapAppKey ?? ''
    if (!appKey || !mapRef.current) return

    let canceled = false
    setSelectedPlace(null)
    setPlaces([])

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
          level: 5,
        })
        mapInstanceRef.current = map
        map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT)
        const places = new kakao.maps.services.Places()
        const searchOptions = useCurrentLocation
          ? { location: centerLatLng, radius: 5000 }
          : undefined

        markersRef.current.forEach((marker) => marker.setMap(null))
        placeMarkerRef.current.clear()
        markersRef.current = [
          new kakao.maps.Marker({
            map,
            position: centerLatLng,
          }),
        ]

        places.keywordSearch(keyword, (results: KakaoPlace[], status: string) => {
          if (canceled) return

          if (status !== kakao.maps.services.Status.OK) {
            setStatusMessage(`${keyword} 검색 결과가 없어서 추천 목록을 먼저 보여드려요.`)
            setPlaces([])
            return
          }

          const nextPlaces = results.slice(0, 8)
          const bounds = new kakao.maps.LatLngBounds()
          nextPlaces.forEach((place) => {
            const position = new kakao.maps.LatLng(Number(place.y), Number(place.x))
            const marker = new kakao.maps.Marker({ map, position })
            const infoWindow = new kakao.maps.InfoWindow({
              content: `<div style="padding:8px 10px;font-size:12px;font-weight:700;white-space:nowrap;">${escapeHtml(place.place_name)}</div>`,
            })

            kakao.maps.event.addListener(marker, 'click', () => {
              openPlace(place)
            })

            placeMarkerRef.current.set(place.id, { infoWindow, marker, position })
            markersRef.current.push(marker)
            bounds.extend(position)
          })

          map.setBounds(bounds)
          setPlaces(nextPlaces)
          if (nextPlaces[0]) {
            openPlace(nextPlaces[0])
          }
          setStatusMessage(`${keyword} 검색 결과 ${nextPlaces.length}곳을 표시했어요.`)
        }, searchOptions)
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
      placeMarkerRef.current.clear()
    }
  }, [keyword, useCurrentLocation])

  if (!kakaoMapAppKey) {
    return <FallbackRestaurantMap fallbackRestaurants={fallbackRestaurants} />
  }

  return (
    <div className="kakao-place-section">
      <div className="home-map-preview has-kakao" aria-label="주변 음식점 지도">
        <div className="kakao-map-canvas" ref={mapRef} />
        <p className="kakao-map-status">{statusMessage}</p>
      </div>
      {selectedPlace && (
        <article className="kakao-place-card">
          <strong>{selectedPlace.place_name}</strong>
          <span>{selectedPlace.road_address_name || selectedPlace.address_name || '주소 정보 없음'}</span>
          <div>
            {selectedPlace.phone && <small>{selectedPlace.phone}</small>}
            {selectedPlace.distance && <small>{Number(selectedPlace.distance).toLocaleString('ko-KR')}m</small>}
          </div>
          {selectedPlace.place_url && (
            <a href={selectedPlace.place_url} rel="noreferrer" target="_blank">상세보기</a>
          )}
        </article>
      )}
      {places.length > 0 && (
        <div className="kakao-place-list" aria-label="주변 맛집 검색 결과">
          {places.map((place) => {
            const isSelected = selectedPlace?.id === place.id
            const distanceText = place.distance ? `${Number(place.distance).toLocaleString('ko-KR')}m` : '카카오맵 장소'

            return (
              <button
                aria-pressed={isSelected}
                className={isSelected ? 'active' : undefined}
                key={place.id}
                onClick={() => openPlace(place)}
                type="button"
              >
                <strong>{place.place_name}</strong>
                <span>{place.road_address_name || place.address_name || '주소 정보 없음'}</span>
                <small>{[place.phone, distanceText].filter(Boolean).join(' · ')}</small>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FallbackRestaurantMap({ fallbackRestaurants }: { fallbackRestaurants: NearbyRestaurant[] }) {
  return (
    <div className="home-map-preview" aria-label="주변 음식점 지도 미리보기">
      <div className="map-road road-one" />
      <div className="map-road road-two" />
      <span className="map-current-location">🔵</span>
      {fallbackRestaurants.slice(0, 3).map((restaurant, index) => (
        <button
          className={`map-restaurant-pin pin-${index + 1}`}
          aria-label={`${restaurant.name} 위치`}
          key={restaurant.id}
          type="button"
        >
          {restaurant.emoji}
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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

function shoppingItemEmoji(name: string) {
  if (name.includes('수박')) return '🍉'
  if (name.includes('콩국수') || name.includes('소면') || name.includes('파스타')) return '🍜'
  if (name.includes('콩국물') || name.includes('우유') || name.includes('요거트')) return '🥛'
  if (name.includes('복숭아')) return '🍑'
  if (name.includes('옥수수')) return '🌽'
  if (name.includes('토마토')) return '🍅'
  if (name.includes('오이') || name.includes('애호박')) return '🥒'
  if (name.includes('가지')) return '🍆'
  if (name.includes('귤') || name.includes('한라봉')) return '🍊'
  if (name.includes('배추') || name.includes('샐러드') || name.includes('깻잎') || name.includes('루꼴라') || name.includes('시금치') || name.includes('무순')) return '🥬'
  if (name.includes('굴') || name.includes('꼬막') || name.includes('바지락')) return '🦪'
  if (name === '무' || name.startsWith('무 ')) return '🌱'
  if (name.includes('고구마')) return '🍠'
  if (name.includes('버섯')) return '🍄'
  if (name.includes('딸기')) return '🍓'
  if (name.includes('치즈') || name.includes('리코타') || name.includes('모차렐라')) return '🧀'
  if (name.includes('쌀') || name.includes('밥')) return '🍚'
  if (name.includes('참외')) return '🍈'
  if (name.includes('고추')) return '🌶️'
  if (name.includes('감자')) return '🥔'
  if (name.includes('달걀')) return '🥚'
  if (name.includes('양파') || name.includes('대파') || name.includes('쪽파') || name.includes('부추')) return '🧅'
  if (name.includes('버터')) return '🧈'
  if (name.includes('두부')) return '⬜'
  if (name.includes('미역') || name.includes('김')) return '🌿'
  if (name.includes('밀가루') || name.includes('가루') || name.includes('그래놀라')) return '🌾'
  if (name.includes('꿀') || name.includes('올리고당')) return '🍯'
  if (name.includes('자두')) return '🟣'
  if (name.includes('포도')) return '🍇'
  if (name.includes('탄산수')) return '🥤'
  if (name.includes('사과')) return '🍎'
  if (name.includes('배')) return '🍐'
  if (name.includes('레몬')) return '🍋'
  if (name.includes('감')) return '🟠'
  if (name.includes('무화과')) return '🫐'
  if (name.includes('밤')) return '🌰'
  if (name.includes('단호박')) return '🎃'
  if (name.includes('견과')) return '🥜'
  if (name.includes('대하') || name.includes('새우')) return '🦐'
  if (name.includes('오징어')) return '🦑'
  if (name.includes('장어') || name.includes('전어') || name.includes('고등어') || name.includes('대구') || name.includes('방어')) return '🐟'
  if (name.includes('고기') || name.includes('돼지') || name.includes('소고기')) return '🥩'
  if (name.includes('두릅') || name.includes('미나리') || name.includes('쑥') || name.includes('죽순') || name.includes('쑥갓') || name.includes('연근') || name.includes('우엉')) return '🌿'
  if (name.includes('간장') || name.includes('고추장') || name.includes('된장') || name.includes('쌈장') || name.includes('소스')) return '🫙'
  if (name.includes('오일') || name.includes('식초') || name.includes('참기름') || name.includes('마요네즈')) return '🧴'
  if (name.includes('젤라틴')) return '🍮'
  if (name.includes('소금') || name.includes('깨')) return '🧂'
  return '🛍️'
}

function MyPage({
  orderHistory,
  onClose,
}: {
  orderHistory: OrderHistoryItem[]
  onClose: () => void
}) {
  const totalSpent = orderHistory.reduce((sum, order) => sum + order.total, 0)

  return (
    <section className="my-page">
      <header className="my-page-header">
        <button aria-label="마이페이지 닫기" onClick={onClose} type="button">←</button>
        <h1>마이페이지</h1>
        <span />
      </header>

      <div className="my-page-profile">
        <span aria-hidden="true">👤</span>
        <div>
          <strong>제철 미식가</strong>
          <p>오늘도 맛있는 제철 음식을 골라보세요.</p>
        </div>
      </div>

      <div className="my-page-summary">
        <div><span>주문</span><strong>{orderHistory.length}건</strong></div>
        <div><span>총 주문금액</span><strong>{formatWon(totalSpent)}</strong></div>
      </div>

      <section className="my-order-history">
        <div className="my-order-title">
          <h2>내 주문 내역</h2>
          <span>최근 주문순</span>
        </div>

        {orderHistory.length === 0 && (
          <div className="my-order-empty">
            <span aria-hidden="true">🧾</span>
            <strong>아직 주문 내역이 없어요</strong>
            <p>상품을 구매하면 주문 내역이 여기에 쌓여요.</p>
          </div>
        )}

        {orderHistory.map((order) => (
          <article className="my-order-card" key={order.id}>
            <div className="my-order-card-head">
              <span>{order.orderedAt}</span>
              <strong>{order.status}</strong>
            </div>
            <div className="my-order-items">
              <em aria-hidden="true">{shoppingItemEmoji(order.items[0]?.name ?? '')}</em>
              <div>
                <strong>{order.items[0]?.name ?? '제철 상품'}{order.items.length > 1 ? ` 외 ${order.items.length - 1}개` : ''}</strong>
                <p>{order.items.map((item) => `${item.name} ${item.quantity}`).join(' · ')}</p>
              </div>
            </div>
            <div className="my-order-total"><span>결제 금액</span><b>{formatWon(order.total)}</b></div>
          </article>
        ))}
      </section>
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
  onFeed,
  onSelectDecor,
  onShare,
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
  onFeed: (ingredient: FeedIngredient) => void
  onSelectDecor: (item: DecorItem) => void
  onShare: () => void
  onScrollActivity: () => void
}) {
  const [decorTab, setDecorTab] = useState<'all' | DecorItem['type']>('all')
  const [petTab, setPetTab] = useState<'feed' | 'decor'>('feed')
  const visibleItems = decorTab === 'all' ? decorItems : decorItems.filter((item) => item.type === decorTab)
  const nextLevelThreshold = getNextLevelThreshold(level)
  const levelProgress = getLevelProgress(exp, level)
  const expLabel = nextLevelThreshold ? `${exp}/${nextLevelThreshold.minExp} xp` : `${exp} xp`
  const roomImage = getRoomBackgroundImage(background)
  const decorTabs: { id: 'all' | DecorItem['type']; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'background', label: '방' },
    { id: 'outfit', label: '옷' },
    { id: 'accessory', label: '소품' },
  ]

  return (
    <section className="screen pet-home-screen" onScroll={onScrollActivity}>
      <div
        className={`pet-room-stage ${roomClass(background)} ${roomImage ? 'has-room-image' : ''}`}
        style={roomImage ? { backgroundImage: `url(${roomImage})` } : undefined}
      >
        <button className="pet-share-button" aria-label="먹보 링크 복사" onClick={onShare} type="button">📤</button>
        <PetAvatar outfit={outfit} background={background} accessory={accessory} body="sudal" />
      </div>

      <div className="pet-action-tabs" aria-label="펫홈 작업">
        <button className={petTab === 'feed' ? 'active' : ''} onClick={() => setPetTab('feed')} type="button">
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
                <strong>먹보가 자라고 있어요</strong>
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
                <span className="feed-card-icon" aria-hidden="true">{shoppingItemEmoji(ingredient.name)}</span>
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
            {visibleItems.map((item) => {
              const unlocked = isDecorUnlocked(item, level, shoppingRewardUnlocked)
              const selected = item.name === background || item.name === outfit || item.name === accessory
              const itemRoomImage = item.type === 'background' ? getRoomBackgroundImage(item.name) : undefined
              return (
                <button className={`decor-card ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}`} key={item.id} onClick={() => onSelectDecor(item)} type="button">
                  <span
                    className={itemRoomImage ? 'decor-card-visual room-thumbnail' : 'decor-card-visual'}
                    style={itemRoomImage ? { backgroundImage: `url(${itemRoomImage})` } : undefined}
                  >
                    {!itemRoomImage && decorIcon(item)}
                  </span>
                  <strong>{item.name}</strong>
                  <small>{unlocked ? (selected ? '착용중' : item.badge ?? '') : item.unlockByShopping ? '장보기 보상' : `Lv.${item.unlockLevel}`}</small>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function decorIcon(item: DecorItem) {
  if (item.type === 'background') {
    if (item.name.includes('봄꽃')) return '🌷'
    if (item.name.includes('바닷가')) return '🌊'
    if (item.name.includes('낙엽')) return '🍁'
    if (item.name.includes('눈꽃')) return '❄️'
    if (item.name.includes('피크닉')) return '🌼'
    if (item.name.includes('초록')) return '🪟'
    if (item.name.includes('야시장')) return '🌙'
    if (item.name.includes('구름')) return '☁️'
    return '☀️'
  }
  if (item.type === 'outfit') {
    if (item.name.includes('수박')) return '🍉'
    if (item.name.includes('목도리')) return '🧣'
    if (item.name.includes('셰프')) return '🧑‍🍳'
    if (item.name.includes('판초')) return '☔'
    return '👕'
  }
  if (item.name.includes('머그')) return '☕'
  if (item.name.includes('딸기')) return '🍓'
  if (item.name.includes('선글라스')) return '🕶️'
  if (item.name.includes('숟가락')) return '🥄'
  if (item.name.includes('선풍기')) return '🪭'
  if (item.name.includes('주스')) return '🧃'
  if (item.name.includes('군고구마')) return '🍠'
  if (item.name.includes('귤')) return '🍊'
  return '🛍️'
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

function TabBar({ current, onChange }: { current: Screen; onChange: (screen: Screen) => void }) {
  const tabs: { id: Screen; label: string; icon: string }[] = [
    { id: 'home', label: '제철홈', icon: '🌿' },
    { id: 'petHome', label: '펫홈', icon: '💛' },
  ]

  return (
    <nav className="tab-bar" aria-label="하단 탭">
      {tabs.map((tab) => (
        <button className={current === tab.id ? 'active' : ''} key={tab.id} onClick={() => onChange(tab.id)} type="button">
          <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
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

export default App
