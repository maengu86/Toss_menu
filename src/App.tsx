import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './App.css'
import PetAvatar from './components/PetAvatar'
import { decorItems, menus, seasonalIngredients, seasons } from './data'
import type { DecorItem, Ingredient, Menu, Screen, SeasonalIngredient, SeasonKey } from './types'

const tossShoppingOptions = [
  { name: '바로배송', eta: '오늘 밤 도착', fee: 3000, perk: '빠른 추천' },
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

// 작업: 메뉴 가격을 XP로 변환합니다. 10원당 1xp 규칙을 한 곳에서 관리합니다.
// 개인 수정 가능: 환산 비율을 바꾸려면 10을 원하는 금액 기준으로 변경하면 됩니다.
// 적용 위치: 메뉴 카드 XP 표시, 밥먹이기 버튼, 실제 펫 경험치 증가량.
const wonPerPetExp = 10

const receiptDrafts = [
  { id: 1, title: '라인형 영수증', description: '결제, 배송, 요청, 총액을 한 줄씩 고정 노출합니다.' },
]

const checkoutDrafts = [
  { id: 1, title: '기본 주문서', description: '배송과 결제 정보를 위에서 아래로 차분하게 확인합니다.' },
  { id: 2, title: '요약 카드형', description: '총액을 강조하고 옵션을 카드 안에 묶어서 보여줍니다.' },
  { id: 3, title: '체크리스트형', description: '결제 전 확인할 항목을 체크리스트처럼 정리합니다.' },
  { id: 4, title: '분리 블록형', description: '상품, 배송, 결제 정보를 독립된 블록으로 나눕니다.' },
  { id: 5, title: '하단 결제형', description: '결제 버튼 직전 최종 확인용으로 압축해서 보여줍니다.' },
]

const decorBoxDrafts = [
  { id: 1, title: '기본 격자형', description: '아이템을 같은 크기 카드로 정리합니다.' },
  { id: 2, title: '선택 강조형', description: '현재 착용 중인 아이템을 더 강하게 표시합니다.' },
  { id: 3, title: '잠금 정보형', description: '레벨과 장보기 해금 조건을 먼저 보여줍니다.' },
  { id: 4, title: '작은 버튼형', description: '많은 꾸미기 아이템을 촘촘하게 보여줍니다.' },
  { id: 5, title: '미리보기형', description: '캐릭터에 적용될 느낌을 설명과 함께 보여줍니다.' },
]

const emptyFeedDrafts = [
  { id: 1, tone: '#fff4ef' },
  { id: 2, tone: '#f2f7ff' },
  { id: 3, tone: '#f4fbf5' },
  { id: 4, tone: '#faf5ff' },
  { id: 5, tone: '#fff9e8' },
]

type ShopStep = 'cart' | 'checkout' | 'complete'

type FeedIngredient = Ingredient & {
  id: string
  menuName: string
}

function formatWon(value: number) {
  return value.toLocaleString('ko-KR') + '원'
}

function ingredientKey(menuId: string, ingredientName: string) {
  return `${menuId}:${ingredientName}`
}

function getIngredientExp(ingredient: Ingredient) {
  return Math.floor(ingredient.price / wonPerPetExp)
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
  const firstSummerIngredient = seasonalIngredients.find((item) => item.seasonKey === 'summer') ?? seasonalIngredients[0]
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([])
  const [selectedMenuOpen, setSelectedMenuOpen] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>('summer')
  const [selectedSeasonalIngredientId, setSelectedSeasonalIngredientId] = useState(firstSummerIngredient.id)
  // 작업: 결제 완료된 식재료를 펫에게 먹일 수 있는 재고로 저장합니다.
  // 개인 수정 가능: 재료 카드에 더 많은 정보를 보여주고 싶으면 FeedIngredient 타입에 필드를 추가하면 됩니다.
  // 적용 위치: 주문 완료 후 펫홈 > 밥먹이기 목록.
  const [feedIngredients, setFeedIngredients] = useState<FeedIngredient[]>([])
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([])
  // 작업: 펫 경험치는 레벨별 잔여치가 아니라 누적 XP로 저장합니다.
  // 개인 수정 가능: 기본 시작 XP를 바꾸고 싶으면 0을 원하는 값으로 변경해도 됩니다.
  // 적용 위치: 펫홈 레벨 카드와 밥먹이기 후 성장 상태.
  const [exp, setExp] = useState(0)
  const [shopStep, setShopStep] = useState<ShopStep>('cart')
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

  const today = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date())

  const selectedMenus = menus.filter((menu) => selectedMenuIds.includes(menu.id))
  const seasonIngredients = seasonalIngredients.filter((ingredient) => ingredient.seasonKey === selectedSeason)
  const seasonalMenus = menus.filter((menu) => menu.seasonalIngredientIds?.includes(selectedSeasonalIngredientId))

  const shoppingItems = selectedMenus.flatMap((menu) => menu.ingredients.map((ingredient) => ({ menuId: menu.id, ingredient })))
  const checkedPrice = shoppingItems.reduce((sum, item) => (
    checkedIngredients.includes(ingredientKey(item.menuId, item.ingredient.name)) ? sum + item.ingredient.price : sum
  ), 0)
  const selectedDeliveryInfo = tossShoppingOptions[0]
  const orderTotal = checkedPrice + selectedDeliveryInfo.fee
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
      if (current.includes(menuId)) return current.filter((id) => id !== menuId)
      const next = [...current, menuId]
      setSelectedMenuOpen(false)
      return next
    })
  }

  function removeMenu(menuId: string) {
    setSelectedMenuIds((current) => current.filter((id) => id !== menuId))
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

  function completeOrderFlow() {
    const checkedItems = shoppingItems.filter((item) => checkedIngredients.includes(ingredientKey(item.menuId, item.ingredient.name)))
    orderSequenceRef.current += 1
    const orderId = orderSequenceRef.current

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
            checkedPrice={checkedPrice}
            deliveryTypeInfo={selectedDeliveryInfo}
            orderTotal={orderTotal}
            paymentMethod={paymentMethod}
            paymentOptions={paymentOptions}
            step={shopStep}
            onBackHome={() => setScreen('home')}
            onCompleteOrder={completeOrderFlow}
            onGoHome={() => setScreen('petHome')}
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
  return (
    <section className="screen" onScroll={onScrollActivity}>
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
              <b>{getMenuExp(menu)}xp</b>
            </button>
          )
        })}
      </div>

      {selectedMenus.length > 0 && (
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
                <button className="selected-menu-shop" onClick={onStartShopping} type="button">구매하기</button>
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
  selectedMenus,
  checkedIngredients,
  checkedTotal,
  checkedPrice,
  orderTotal,
  deliveryTypeInfo,
  step,
  paymentMethod,
  paymentOptions,
  deliveryOption,
  deliveryOptions,
  onToggleIngredient,
  onSelectPayment,
  onSelectDelivery,
  onSetStep,
  onBackHome,
  onCompleteOrder,
  onGoHome,
  onScrollActivity,
}: {
  selectedMenus: Menu[]
  checkedIngredients: string[]
  checkedTotal: number
  checkedPrice: number
  orderTotal: number
  deliveryTypeInfo: (typeof tossShoppingOptions)[number]
  step: ShopStep
  paymentMethod: string
  paymentOptions: string[]
  deliveryOption: string
  deliveryOptions: string[]
  onToggleIngredient: (name: string) => void
  onSelectPayment: (method: string) => void
  onSelectDelivery: (option: string) => void
  onSetStep: (step: ShopStep) => void
  onBackHome: () => void
  onCompleteOrder: () => void
  onGoHome: () => void
  onScrollActivity: () => void
}) {
  const canContinue = checkedTotal > 0

  return (
    <section className="screen toss-screen" onScroll={onScrollActivity}>
      <div className="toss-back-row">
        <button aria-label="홈으로 돌아가기" onClick={onBackHome} type="button">‹</button>
      </div>

      {step === 'cart' && (
        <>
          <div className="toss-menu-list">
            {selectedMenus.length === 0 && <p className="empty">홈에서 메뉴를 먼저 선택해주세요.</p>}
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
                        <strong>{menu.name}</strong>
                      </label>
                    </div>
                    <div className="ingredient-list toss-list toss-product-list">
                      {menu.ingredients.map((item) => {
                        const key = ingredientKey(menu.id, item.name)
                        return (
                          <label className="ingredient-row toss-row" key={key}>
                            <input checked={checkedIngredients.includes(key)} onChange={() => onToggleIngredient(key)} type="checkbox" />
                            <em aria-hidden="true">{shoppingItemEmoji(item.name)}</em>
                            <span>
                              <strong>{item.name}</strong>
                            </span>
                            <b>{formatWon(item.price)}</b>
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
              주문하기
            </button>
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
            <div><span>상품 금액</span><b>{formatWon(checkedPrice)}</b></div>
            <div><span>배송비</span><b>{formatWon(deliveryTypeInfo.fee)}</b></div>
            <div className="total"><span>총 결제 금액</span><b>{formatWon(orderTotal)}</b></div>
          </div>
          <div className="checkout-drafts" aria-label="장보기 주문 페이지 시안">
            {checkoutDrafts.map((draft) => (
              <article className={`checkout-draft checkout-draft-${draft.id}`} key={draft.id}>
                {/* 작업: 장보기 주문 페이지에서 실제 결제 정보가 들어간 시안을 비교합니다.
                    개인 수정 가능: 시안 제목과 항목 배치는 자유롭게 바꿔도 됩니다.
                    적용 위치: 장보기 > 주문/결제 단계. */}
                <div className="checkout-draft-head">
                  <strong>시안 {draft.id}</strong>
                  <span>{draft.title}</span>
                </div>
                <p>{draft.description}</p>
                <dl>
                  <div><dt>상품 금액</dt><dd>{formatWon(checkedPrice)}</dd></div>
                  <div><dt>배송</dt><dd>{deliveryTypeInfo.name}</dd></div>
                  <div><dt>요청</dt><dd>{deliveryOption}</dd></div>
                  <div><dt>결제</dt><dd>{paymentMethod}</dd></div>
                  <div><dt>총액</dt><dd>{formatWon(orderTotal)}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <div className="toss-button-row">
            <button className="toss-secondary" onClick={() => onSetStep('cart')} type="button">이전</button>
            <button className="toss-primary" onClick={onCompleteOrder} type="button">{formatWon(orderTotal)} 결제하기</button>
          </div>
        </>
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
          <div className="receipt-drafts" aria-label="주문 완료 정보 시안">
            {receiptDrafts.map((draft) => (
              <article className={`receipt-draft receipt-draft-${draft.id}`} key={draft.id}>
                {/* 작업: 주문완료 시안에 실제 적용될 주문 데이터를 넣어 디자인 판단이 가능하게 합니다.
                    개인 수정 가능: title/description이나 필드 순서는 자유롭게 바꿔도 됩니다.
                    적용 위치: 장보기 > 주문완료 화면의 영수증 시안 목록. */}
                <div className="receipt-draft-head">
                  <strong>시안 {draft.id}</strong>
                  <span>{draft.title}</span>
                </div>
                <p>{draft.description}</p>
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
          <button className="toss-secondary wide" onClick={() => onSetStep('cart')} type="button">장보러 가기</button>
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

function shoppingItemEmoji(name: string) {
  if (name.includes('수박')) return '🍉'
  if (name.includes('콩국수') || name.includes('소면') || name.includes('파스타')) return '🍜'
  if (name.includes('콩국물') || name.includes('우유') || name.includes('요거트')) return '🥛'
  if (name.includes('복숭아')) return '🍑'
  if (name.includes('옥수수')) return '🌽'
  if (name.includes('토마토')) return '🍅'
  if (name.includes('오이')) return '🥒'
  if (name.includes('가지')) return '🍆'
  if (name.includes('귤')) return '🍊'
  if (name.includes('배추')) return '🥬'
  if (name.includes('굴')) return '🦪'
  if (name.includes('무')) return '⚪'
  if (name.includes('고구마')) return '🍠'
  if (name.includes('버섯')) return '🍄'
  if (name.includes('딸기')) return '🍓'
  if (name.includes('샐러드')) return '🥗'
  if (name.includes('치즈')) return '🧀'
  if (name.includes('쌀') || name.includes('밥')) return '🍚'
  return '🛒'
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
  const decorTabs: { id: 'all' | DecorItem['type']; label: string; icon: string }[] = [
    { id: 'all', label: '전체', icon: '🧩' },
    { id: 'background', label: '방', icon: '🏠' },
    { id: 'outfit', label: '옷', icon: '👕' },
    { id: 'accessory', label: '소품', icon: '🎒' },
  ]

  return (
    <section className="screen pet-home-screen" onScroll={onScrollActivity}>
      <div className={`pet-room-stage ${roomClass(background)}`}>
        <button className="pet-share-button" aria-label="먹보 링크 복사" onClick={onShare} type="button">📤</button>
        <PetAvatar outfit={outfit} background={background} accessory={accessory} />
      </div>

      <div className="pet-action-tabs" aria-label="펫홈 작업">
        <button className={petTab === 'feed' ? 'active' : ''} onClick={() => setPetTab('feed')} type="button">
          <span aria-hidden="true">🍚</span>
          <b>밥주러 가기</b>
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
            <span aria-hidden="true">{tab.icon}</span>
            <b>{tab.label}</b>
          </button>
        ))}
      </div>

      {petTab === 'feed' && (
        <section className="pet-feed-panel">
          <div className="level-card">
            <div>
              <strong>Lv. {level}</strong>
              <span>{expLabel}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
            </div>
          </div>
          <div className="feed-list compact-feed-list">
            {feedIngredients.length === 0 && (
              <div className="empty-feed-drafts" aria-label="밥먹이기 빈 상태">
                {/* 작업: 먹일 메뉴가 없을 때 주문 안내를 보여줍니다.
                    개인 수정 가능: 안내 문구는 자유롭게 바꿔도 됩니다.
                    적용 위치: 펫홈 > 밥먹이기 탭의 빈 상태. */}
                {emptyFeedDrafts.slice(0, 1).map((draft) => (
                  <p className="empty" key={draft.id} style={{ '--empty-tone': draft.tone } as CSSProperties}>
                    메뉴를 주문해 주세요
                  </p>
                ))}
              </div>
            )}
            {feedIngredients.map((ingredient) => (
              <button className="feed-card" key={ingredient.id} onClick={() => onFeed(ingredient)} type="button">
                <span>
                  <strong>{ingredient.name}</strong>
                  <small>{ingredient.menuName} · {ingredient.quantity}</small>
                </span>
                <b>+{getIngredientExp(ingredient)} xp</b>
              </button>
            ))}
          </div>
        </section>
      )}

      {petTab === 'decor' && (
        <div className="pet-inventory">
          <div className="decor-box-drafts" aria-label="꾸미기 박스 시안">
            {decorBoxDrafts.map((draft) => (
              <article className={`decor-box-draft decor-box-draft-${draft.id}`} key={draft.id}>
                {/* 작업: 꾸미기 박스의 적용 방향을 5개 시안으로 비교합니다.
                    개인 수정 가능: 시안 문구와 강조 색상은 자유롭게 조정해도 됩니다.
                    적용 위치: 펫홈 > 꾸미기 탭 상단. */}
                <strong>시안 {draft.id}</strong>
                <span>{draft.title}</span>
                <p>{draft.description}</p>
              </article>
            ))}
          </div>
          <div className="decor-grid">
            {visibleItems.map((item) => {
              const unlocked = isDecorUnlocked(item, level, shoppingRewardUnlocked)
              const selected = item.name === background || item.name === outfit || item.name === accessory
              return (
                <button className={`decor-card ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}`} key={item.id} onClick={() => onSelectDecor(item)} type="button">
                  <span>{decorIcon(item)}</span>
                  <strong>{item.name}</strong>
                  <small>{unlocked ? (selected ? '착용중' : '') : item.unlockByShopping ? '장보기 보상' : `Lv.${item.unlockLevel}`}</small>
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
    { id: 'home', label: '홈', icon: '🌿' },
    { id: 'shopping', label: '장보기', icon: '🛍️' },
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
