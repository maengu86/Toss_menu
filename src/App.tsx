import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './App.css'
import PetAvatar from './components/PetAvatar'
import { decorItems, menus, seasonalIngredients, seasons } from './data'
import type { DecorItem, Menu, Screen, SeasonalIngredient, SeasonKey } from './types'

const tossShoppingOptions = [
  { name: '바로배송', eta: '오늘 밤 도착', fee: 3000, perk: '빠른 추천' },
  { name: '예약배송', eta: '내일 오전 도착', fee: 0, perk: '배송비 0원' },
  { name: '동네픽업', eta: '60분 후 픽업', fee: 0, perk: '근처 마트 수령' },
]
const paymentOptions = ['토스페이', '카드 간편결제', '계좌 결제']
const deliveryOptions = ['문 앞에 놓기', '직접 받을게요']
const maxExp = 100

type ShopStep = 'cart' | 'store' | 'checkout' | 'complete'
type SeasonPanelConcept = 'line' | 'chip' | 'mono' | 'compact' | 'split'

function formatWon(value: number) {
  return value.toLocaleString('ko-KR') + '원'
}

function ingredientKey(menuId: string, ingredientName: string) {
  return `${menuId}:${ingredientName}`
}

function App() {
  const firstSummerIngredient = seasonalIngredients.find((item) => item.seasonKey === 'summer') ?? seasonalIngredients[0]
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([])
  const [selectedMenuOpen, setSelectedMenuOpen] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>('summer')
  const [selectedSeasonalIngredientId, setSelectedSeasonalIngredientId] = useState(firstSummerIngredient.id)
  const [fedMenuIds, setFedMenuIds] = useState<string[]>([])
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([])
  const [level, setLevel] = useState(1)
  const [exp, setExp] = useState(18)
  const [selectedDeliveryType, setSelectedDeliveryType] = useState(tossShoppingOptions[0].name)
  const [shopStep, setShopStep] = useState<ShopStep>('cart')
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0])
  const [deliveryOption, setDeliveryOption] = useState(deliveryOptions[0])
  const [shoppingRewardUnlocked, setShoppingRewardUnlocked] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState('햇살 주방')
  const [selectedOutfit, setSelectedOutfit] = useState('기본 앞치마')
  const [selectedAccessory, setSelectedAccessory] = useState('장바구니')
  const [toast, setToast] = useState('')
  const [petMood, setPetMood] = useState<'idle' | 'happy'>('idle')
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimerRef = useRef<number | undefined>(undefined)

  const today = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date())

  const selectedMenus = menus.filter((menu) => selectedMenuIds.includes(menu.id))
  const seasonIngredients = seasonalIngredients.filter((ingredient) => ingredient.seasonKey === selectedSeason)
  const seasonalMenus = menus.filter((menu) => menu.seasonalIngredientIds?.includes(selectedSeasonalIngredientId))

  const shoppingItems = selectedMenus.flatMap((menu) => menu.ingredients.map((ingredient) => ({ menuId: menu.id, ingredient })))
  const totalPrice = shoppingItems.reduce((sum, item) => sum + item.ingredient.price, 0)
  const selectedDeliveryInfo = tossShoppingOptions.find((option) => option.name === selectedDeliveryType) ?? tossShoppingOptions[0]
  const orderTotal = totalPrice + selectedDeliveryInfo.fee
  const checkedTotal = shoppingItems.filter((item) => checkedIngredients.includes(ingredientKey(item.menuId, item.ingredient.name))).length
  const unlockedItems = decorItems.filter((item) => isDecorUnlocked(item, level, shoppingRewardUnlocked))

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
      if (current.includes(menuId)) return current.filter((id) => id !== menuId)
      const next = [...current, menuId]
      setSelectedMenuOpen(false)
      return next
    })
  }

  function removeMenu(menuId: string) {
    setSelectedMenuIds((current) => current.filter((id) => id !== menuId))
    setFedMenuIds((current) => current.filter((id) => id !== menuId))
  }

  function feedPet(menu: Menu) {
    if (fedMenuIds.includes(menu.id)) {
      showToast('이미 먹인 메뉴예요.')
      return
    }

    const next = exp + menu.exp
    const gainedLevel = Math.floor(next / maxExp)
    setLevel((current) => current + gainedLevel)
    setExp(next % maxExp)
    setFedMenuIds((current) => [...current, menu.id])
    setPetMood('happy')
    window.setTimeout(() => setPetMood('idle'), 1200)
    showToast(gainedLevel > 0 ? '먹보가 레벨업했어요!' : `${menu.name} 먹고 경험치 +${menu.exp}`)
  }

  function toggleIngredient(key: string) {
    setCheckedIngredients((current) => (
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    ))
  }

  function completeOrderFlow() {
    setShoppingRewardUnlocked(true)
    setShopStep('complete')
    showToast('주문 플로우 완료! 실제 결제는 진행되지 않았어요.')
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
            seasonIngredients={seasonIngredients}
            seasonalMenus={seasonalMenus}
            selectedSeason={selectedSeason}
            selectedSeasonalIngredientId={selectedSeasonalIngredientId}
            selectedMenuOpen={selectedMenuOpen}
            selectedMenus={selectedMenus}
            selectedMenuIds={selectedMenuIds}
            onRemoveMenu={removeMenu}
            onScrollActivity={handleScrollActivity}
            onSelectSeason={changeSeason}
            onSelectSeasonalIngredient={setSelectedSeasonalIngredientId}
            onSetSelectedMenuOpen={setSelectedMenuOpen}
            onToggleMenu={toggleMenu}
            onStartShopping={() => {
              if (selectedMenuIds.length === 0) {
                showToast('먼저 메뉴를 골라주세요.')
                return
              }
              setShopStep('cart')
              setScreen('shopping')
            }}
          />
        )}

        {screen === 'shopping' && (
          <ShoppingScreen
            checkedIngredients={checkedIngredients}
            checkedTotal={checkedTotal}
            deliveryOption={deliveryOption}
            deliveryOptions={deliveryOptions}
            selectedMenus={selectedMenus}
            deliveryType={selectedDeliveryType}
            deliveryTypeInfo={selectedDeliveryInfo}
            deliveryTypes={tossShoppingOptions}
            orderTotal={orderTotal}
            paymentMethod={paymentMethod}
            paymentOptions={paymentOptions}
            step={shopStep}
            totalPrice={totalPrice}
            onCompleteOrder={completeOrderFlow}
            onGoHome={() => setScreen('home')}
            onScrollActivity={handleScrollActivity}
            onSelectDelivery={setDeliveryOption}
            onSelectDeliveryType={setSelectedDeliveryType}
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
            fedMenuIds={fedMenuIds}
            level={level}
            outfit={selectedOutfit}
            petMood={petMood}
            selectedMenus={selectedMenus}
            shoppingRewardUnlocked={shoppingRewardUnlocked}
            unlockedCount={unlockedItems.length}
            onFeed={feedPet}
            onSelectDecor={selectDecor}
            onShare={copyShareLink}
            onScrollActivity={handleScrollActivity}
          />
        )}

        <TabBar current={screen} onChange={setScreen} />
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function HomeScreen({
  today,
  seasons,
  seasonIngredients,
  seasonalMenus,
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
  onStartShopping,
}: {
  today: string
  seasons: { key: SeasonKey; label: string; accent: string }[]
  seasonIngredients: SeasonalIngredient[]
  seasonalMenus: Menu[]
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
  onStartShopping: () => void
}) {
  const [seasonPanelConcept, setSeasonPanelConcept] = useState<SeasonPanelConcept>('line')

  return (
    <section className="screen" onScroll={onScrollActivity}>
      <header className="top-header">
        <p>{today}</p>
        <h1>오늘의 제철 음식 추천</h1>
      </header>

      <div className={`season-panel season-panel-${seasonPanelConcept}`}>
        <div className="season-concept-switch" aria-label="제철 탭 시안 선택">
          {[
            ['line', '1'],
            ['chip', '2'],
            ['mono', '3'],
            ['compact', '4'],
            ['split', '5'],
          ].map(([concept, label]) => (
            <button
              className={seasonPanelConcept === concept ? 'active' : ''}
              key={concept}
              onClick={() => setSeasonPanelConcept(concept as SeasonPanelConcept)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="season-tabs" aria-label="계절 선택">
          {seasons.map((season) => (
            <button
              className={selectedSeason === season.key ? 'active' : ''}
              key={season.key}
              onClick={() => onSelectSeason(season.key)}
              style={{ '--season-accent': season.accent } as CSSProperties}
              type="button"
            >
              {season.label}
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
                <p>{menu.ingredients.map((item) => item.name).join(', ')}</p>
              </div>
              <b>{menu.exp}xp</b>
            </button>
          )
        })}
      </div>

      <button className="primary-action" onClick={onStartShopping} type="button">
        구매하기
      </button>

      {selectedMenus.length > 0 && (
        <div className={`selected-menu-widget ${selectedMenuOpen ? 'open' : ''}`}>
          {selectedMenuOpen && (
            <>
              <button className="selected-menu-backdrop" aria-label="선택 메뉴 닫기" onClick={() => onSetSelectedMenuOpen(false)} type="button" />
              <div className="selected-menu-panel">
                {selectedMenus.map((menu) => (
                  <div className="selected-menu-chip" key={menu.id}>
                    <span>{menu.name}</span>
                    <button aria-label={`${menu.name} 삭제`} onClick={() => onRemoveMenu(menu.id)} type="button">삭제</button>
                  </div>
                ))}
                <button className="selected-menu-shop" onClick={onStartShopping} type="button">장보기로 이동</button>
              </div>
            </>
          )}
          <button className="selected-menu-fab" onClick={() => onSetSelectedMenuOpen(!selectedMenuOpen)} type="button">
            <span>{selectedMenus.length}</span>
            🛒
          </button>
        </div>
      )}
    </section>
  )
}

function ShoppingScreen({
  selectedMenus,
  checkedIngredients,
  checkedTotal,
  totalPrice,
  orderTotal,
  deliveryType,
  deliveryTypeInfo,
  deliveryTypes,
  step,
  paymentMethod,
  paymentOptions,
  deliveryOption,
  deliveryOptions,
  onToggleIngredient,
  onSelectDeliveryType,
  onSelectPayment,
  onSelectDelivery,
  onSetStep,
  onCompleteOrder,
  onGoHome,
  onScrollActivity,
}: {
  selectedMenus: Menu[]
  checkedIngredients: string[]
  checkedTotal: number
  totalPrice: number
  orderTotal: number
  deliveryType: string
  deliveryTypeInfo: (typeof tossShoppingOptions)[number]
  deliveryTypes: typeof tossShoppingOptions
  step: ShopStep
  paymentMethod: string
  paymentOptions: string[]
  deliveryOption: string
  deliveryOptions: string[]
  onToggleIngredient: (name: string) => void
  onSelectDeliveryType: (deliveryType: string) => void
  onSelectPayment: (method: string) => void
  onSelectDelivery: (option: string) => void
  onSetStep: (step: ShopStep) => void
  onCompleteOrder: () => void
  onGoHome: () => void
  onScrollActivity: () => void
}) {
  const itemCount = selectedMenus.reduce((count, menu) => count + menu.ingredients.length, 0)
  const canContinue = itemCount > 0

  return (
    <section className="screen toss-screen" onScroll={onScrollActivity}>
      <header className="toss-shopping-header">
        <button aria-label="뒤로" type="button">‹</button>
        <strong>토스쇼핑</strong>
        <span>주문</span>
      </header>

      <header className="compact-header toss-header">
        <span>오늘 뭐 먹지? 장보기</span>
        <h1>{step === 'complete' ? '주문 체험 완료' : '토스쇼핑에서 재료를 담아요'}</h1>
      </header>

      <div className="toss-steps" aria-label="쇼핑 진행 단계">
        {['상품', '배송', '결제'].map((label, index) => {
          const activeIndex = step === 'cart' ? 0 : step === 'store' ? 1 : 2
          return (
            <div className={index <= activeIndex ? 'active' : ''} key={label}>
              <span>{index + 1}</span>
              {label}
            </div>
          )
        })}
      </div>

      {step === 'cart' && (
        <>
          <div className="toss-summary-card">
            <span>선택 메뉴 재료</span>
            <strong>{formatWon(totalPrice)}</strong>
            <p>구매 체크 {checkedTotal}/{itemCount}</p>
          </div>
          <div className="toss-menu-list">
            {selectedMenus.length === 0 && <p className="empty">홈에서 메뉴를 먼저 선택해주세요.</p>}
            {selectedMenus.map((menu) => (
              <article className="toss-menu-box" key={menu.id}>
                <div className="toss-menu-box-head">
                  <span>메뉴</span>
                  <strong>{menu.name}</strong>
                  <b>{formatWon(menu.ingredients.reduce((sum, item) => sum + item.price, 0))}</b>
                </div>
                <div className="ingredient-list toss-list">
                  {menu.ingredients.map((item) => {
                    const key = ingredientKey(menu.id, item.name)
                    return (
                      <label className="ingredient-row toss-row" key={key}>
                        <input checked={checkedIngredients.includes(key)} onChange={() => onToggleIngredient(key)} type="checkbox" />
                        <span>
                          <strong>{item.name}</strong>
                        </span>
                        <b>{formatWon(item.price)}</b>
                      </label>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
          <div className="toss-cart-spacer" />
          <button className="toss-primary toss-cart-continue" disabled={!canContinue} onClick={() => onSetStep('store')} type="button">
            토스쇼핑 주문서로 계속하기
          </button>
        </>
      )}

      {step === 'store' && (
        <>
          <div className="toss-copy">
            <strong>배송 방식을 선택해주세요</strong>
            <p>토스쇼핑 주문서에 붙일 배송 옵션만 고르는 체험 화면이에요.</p>
          </div>
          <div className="store-list">
            {deliveryTypes.map((option) => (
              <button className={`store-card ${deliveryType === option.name ? 'selected' : ''}`} key={option.name} onClick={() => onSelectDeliveryType(option.name)} type="button">
                <span>{option.perk}</span>
                <strong>{option.name}</strong>
                <p>{option.eta} · 배송비 {formatWon(option.fee)}</p>
              </button>
            ))}
          </div>
          <div className="toss-button-row">
            <button className="toss-secondary" onClick={() => onSetStep('cart')} type="button">이전</button>
            <button className="toss-primary" onClick={() => onSetStep('checkout')} type="button">결제 화면으로</button>
          </div>
        </>
      )}

      {step === 'checkout' && (
        <>
          <div className="checkout-card">
            <div>
              <span>토스쇼핑 배송</span>
              <strong>{deliveryTypeInfo.name}</strong>
              <p>{deliveryTypeInfo.eta}</p>
            </div>
            <b>{formatWon(orderTotal)}</b>
          </div>
          <OptionGroup title="배송 요청">
            {deliveryOptions.map((option) => (
              <button className={deliveryOption === option ? 'active' : ''} key={option} onClick={() => onSelectDelivery(option)} type="button">{option}</button>
            ))}
          </OptionGroup>
          <OptionGroup title="결제 수단">
            {paymentOptions.map((option) => (
              <button className={paymentMethod === option ? 'active' : ''} key={option} onClick={() => onSelectPayment(option)} type="button">{option}</button>
            ))}
          </OptionGroup>
          <div className="price-sheet">
            <div><span>상품 금액</span><b>{formatWon(totalPrice)}</b></div>
            <div><span>배송비</span><b>{formatWon(deliveryTypeInfo.fee)}</b></div>
            <div className="total"><span>총 결제 금액</span><b>{formatWon(orderTotal)}</b></div>
          </div>
          <div className="toss-button-row">
            <button className="toss-secondary" onClick={() => onSetStep('store')} type="button">이전</button>
            <button className="toss-primary" onClick={onCompleteOrder} type="button">{formatWon(orderTotal)} 결제하기</button>
          </div>
        </>
      )}

      {step === 'complete' && (
        <div className="complete-card">
          <span>결제 기능 없음</span>
          <h2>주문 체험이 완료됐어요</h2>
          <p>토스쇼핑에서 {itemCount}개 재료를 주문한 것처럼 처리했어요. 실제 결제와 주문은 발생하지 않습니다.</p>
          <div className="receipt-mini">
            <div><span>결제 수단</span><b>{paymentMethod}</b></div>
            <div><span>배송 방식</span><b>{deliveryTypeInfo.name}</b></div>
            <div><span>배송 요청</span><b>{deliveryOption}</b></div>
            <div><span>총액</span><b>{formatWon(orderTotal)}</b></div>
          </div>
          <button className="toss-primary" onClick={onGoHome} type="button">홈에서 펫에게 밥 먹이기</button>
          <button className="toss-secondary wide" onClick={() => onSetStep('cart')} type="button">다시 장보기 보기</button>
        </div>
      )}
    </section>
  )
}

function OptionGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="option-group">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}

function PetHomeScreen({
  level,
  exp,
  background,
  outfit,
  accessory,
  selectedMenus,
  fedMenuIds,
  petMood,
  decorItems,
  shoppingRewardUnlocked,
  unlockedCount,
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
  selectedMenus: Menu[]
  fedMenuIds: string[]
  petMood: 'idle' | 'happy'
  decorItems: DecorItem[]
  shoppingRewardUnlocked: boolean
  unlockedCount: number
  onFeed: (menu: Menu) => void
  onSelectDecor: (item: DecorItem) => void
  onShare: () => void
  onScrollActivity: () => void
}) {
  const [decorTab, setDecorTab] = useState<'all' | DecorItem['type']>('all')
  const visibleItems = decorTab === 'all' ? decorItems : decorItems.filter((item) => item.type === decorTab)
  const nextReward = getClosestReward(level, shoppingRewardUnlocked)

  return (
    <section className="screen pet-home-screen" onScroll={onScrollActivity}>
      <header className="compact-header pet-home-header">
        <div>
          <span>먹보</span>
          <h1>먹보의 방 꾸미기</h1>
        </div>
        <button aria-label="먹보 링크 복사" onClick={onShare} type="button">↗</button>
      </header>

      <div className={`pet-room-stage ${roomClass(background)}`}>
        <SeasonRoomDecor background={background} />
        <PetAvatar mood={petMood} outfit={outfit} background={background} accessory={accessory} />
        <div className="pet-room-status">
          <div>
            <span>해금 {unlockedCount}/{decorItems.length}</span>
            <strong>{nextReward.title}</strong>
          </div>
          <small>{nextReward.reward}</small>
        </div>
      </div>

      <section className="pet-feed-panel">
        <div className="section-title">
          <h2>먹보에게 먹이기</h2>
          <span>Lv. {level}</span>
        </div>
        <div className="level-card">
          <div>
            <strong>Lv. {level}</strong>
            <span>{exp}/{maxExp} xp</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${exp}%` }} />
          </div>
        </div>
        <div className="feed-list compact-feed-list">
          {selectedMenus.length === 0 && <p className="empty">홈에서 메뉴를 고르면 먹보에게 먹일 수 있어요.</p>}
          {selectedMenus.map((menu) => {
            const fed = fedMenuIds.includes(menu.id)
            return (
              <button className="feed-card" disabled={fed} key={menu.id} onClick={() => onFeed(menu)} type="button">
                <span>{menu.name}</span>
                <b>{fed ? '먹었어요' : `+${menu.exp} xp`}</b>
              </button>
            )
          })}
        </div>
      </section>

      <div className="pet-inventory">
        <div className="decor-tabs" aria-label="꾸미기 분류">
          <button className={decorTab === 'all' ? 'active' : ''} onClick={() => setDecorTab('all')} type="button">♥</button>
          <button className={decorTab === 'background' ? 'active' : ''} onClick={() => setDecorTab('background')} type="button">▦</button>
          <button className={decorTab === 'outfit' ? 'active' : ''} onClick={() => setDecorTab('outfit')} type="button">👕</button>
          <button className={decorTab === 'accessory' ? 'active' : ''} onClick={() => setDecorTab('accessory')} type="button">☕</button>
        </div>

        <div className="decor-grid">
          {visibleItems.map((item) => {
            const unlocked = isDecorUnlocked(item, level, shoppingRewardUnlocked)
            const selected = item.name === background || item.name === outfit || item.name === accessory
            return (
              <button className={`decor-card ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}`} key={item.id} onClick={() => onSelectDecor(item)} type="button">
                <span>{decorIcon(item)}</span>
                <strong>{item.name}</strong>
                <small>{unlocked ? (selected ? '착용중' : '해금됨') : item.unlockByShopping ? '장보기 보상' : `Lv.${item.unlockLevel}`}</small>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SeasonRoomDecor({ background }: { background: string }) {
  const isSpring = background.includes('봄꽃') || background.includes('피크닉')
  const isSummer = background.includes('여름') || background.includes('햇살') || background.includes('바닷가')
  const isAutumn = background.includes('가을') || background.includes('야시장')
  const isWinter = background.includes('겨울') || background.includes('구름') || background.includes('눈꽃')
  const icons = isSpring
    ? ['🌷', '🍓', '🌿']
    : isAutumn
      ? ['🍁', '🍠', '🌰']
      : isWinter
        ? ['❄️', '🍊', '☃️']
        : isSummer
          ? ['🍉', '🌊', '🧊']
          : ['☀️', '🌿', '🍽️']

  return (
    <div className="season-room-decor" aria-hidden="true">
      {icons.map((icon, index) => <span key={`${icon}-${index}`}>{icon}</span>)}
    </div>
  )
}

function getClosestReward(level: number, shoppingRewardUnlocked: boolean) {
  if (!shoppingRewardUnlocked) {
    return {
      title: '다음 보상: 장보기 주문서 완료',
      reward: '구름 방 · 레인 판초 · 미니 선풍기',
    }
  }
  if (level < 2) {
    return {
      title: '다음 보상: 먹보 Lv.2',
      reward: '야시장 · 겨울 목도리 · 선글라스',
    }
  }
  return {
    title: '보상 수집 진행중',
    reward: '새 메뉴를 먹이면 경험치가 올라요',
  }
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
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'shopping', label: '장보기', icon: '🛒' },
    { id: 'petHome', label: '펫홈', icon: '🐾' },
  ]

  return (
    <nav className="tab-bar" aria-label="하단 탭">
      {tabs.map((tab) => (
        <button className={current === tab.id ? 'active' : ''} key={tab.id} onClick={() => onChange(tab.id)} type="button">
          <span>{tab.icon}</span>
          {tab.label}
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
