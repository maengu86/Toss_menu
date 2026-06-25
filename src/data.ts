import type { DecorItem, Menu, SeasonalIngredient, SeasonKey } from './types'

export const seasons: { key: SeasonKey; label: string; accent: string }[] = [
  { key: 'spring', label: '봄', accent: '#7abf63' },
  { key: 'summer', label: '여름', accent: '#ff9a62' },
  { key: 'autumn', label: '가을', accent: '#d79555' },
  { key: 'winter', label: '겨울', accent: '#70aeca' },
]

// 작업: 홈의 제철 식재료 탭에 노출되는 기준 데이터입니다.
// 개인 수정 가능: 식재료를 추가/삭제해도 됩니다. 단, 메뉴의 seasonalIngredientIds와 id를 맞춰야 합니다.
// 적용 위치: 홈 > 계절 탭 > 제철 식재료 목록.
export const seasonalIngredients: SeasonalIngredient[] = [
  { id: 'dallae', name: '달래', season: '봄', seasonKey: 'spring', emoji: '🌿' },
  { id: 'naengi', name: '냉이', season: '봄', seasonKey: 'spring', emoji: '🌱' },
  { id: 'strawberry', name: '딸기', season: '봄', seasonKey: 'spring', emoji: '🍓' },
  { id: 'asparagus', name: '아스파라거스', season: '봄', seasonKey: 'spring', emoji: '🥬' },
  { id: 'jukkumi', name: '주꾸미', season: '봄', seasonKey: 'spring', emoji: '🐙' },
  { id: 'spring-cabbage', name: '봄동', season: '봄', seasonKey: 'spring', emoji: '🥬' },
  { id: 'dureup', name: '두릅', season: '봄', seasonKey: 'spring', emoji: '🌱' },
  { id: 'minari', name: '미나리', season: '봄', seasonKey: 'spring', emoji: '🌿' },
  { id: 'watermelon', name: '수박', season: '여름', seasonKey: 'summer', emoji: '🍉' },
  { id: 'peach', name: '복숭아', season: '여름', seasonKey: 'summer', emoji: '🍑' },
  { id: 'corn', name: '초당옥수수', season: '여름', seasonKey: 'summer', emoji: '🌽' },
  { id: 'tomato', name: '토마토', season: '여름', seasonKey: 'summer', emoji: '🍅' },
  { id: 'cucumber', name: '오이', season: '여름', seasonKey: 'summer', emoji: '🥒' },
  { id: 'eggplant', name: '가지', season: '여름', seasonKey: 'summer', emoji: '🍆' },
  { id: 'melon', name: '참외', season: '여름', seasonKey: 'summer', emoji: '🍈' },
  { id: 'pepper', name: '꽈리고추', season: '여름', seasonKey: 'summer', emoji: '🌶️' },
  { id: 'zucchini', name: '애호박', season: '여름', seasonKey: 'summer', emoji: '🥒' },
  { id: 'perilla-leaf', name: '깻잎', season: '여름', seasonKey: 'summer', emoji: '🌿' },
  { id: 'potato', name: '감자', season: '여름', seasonKey: 'summer', emoji: '🥔' },
  { id: 'young-radish', name: '열무', season: '여름', seasonKey: 'summer', emoji: '🥬' },
  { id: 'gizzard-shad', name: '전어', season: '가을', seasonKey: 'autumn', emoji: '🐟' },
  { id: 'sweet-potato', name: '고구마', season: '가을', seasonKey: 'autumn', emoji: '🍠' },
  { id: 'mushroom', name: '버섯', season: '가을', seasonKey: 'autumn', emoji: '🍄' },
  { id: 'pear', name: '배', season: '가을', seasonKey: 'autumn', emoji: '🍐' },
  { id: 'chestnut', name: '밤', season: '가을', seasonKey: 'autumn', emoji: '🌰' },
  { id: 'pumpkin', name: '단호박', season: '가을', seasonKey: 'autumn', emoji: '🎃' },
  { id: 'apple', name: '사과', season: '가을', seasonKey: 'autumn', emoji: '🍎' },
  { id: 'shrimp', name: '대하', season: '가을', seasonKey: 'autumn', emoji: '🦐' },
  { id: 'oyster', name: '굴', season: '겨울', seasonKey: 'winter', emoji: '🦪' },
  { id: 'radish', name: '무', season: '겨울', seasonKey: 'winter', emoji: '🥬' },
  { id: 'cabbage', name: '배추', season: '겨울', seasonKey: 'winter', emoji: '🥬' },
  { id: 'mandarin', name: '귤', season: '겨울', seasonKey: 'winter', emoji: '🍊' },
  { id: 'cod', name: '대구', season: '겨울', seasonKey: 'winter', emoji: '🐟' },
  { id: 'spinach', name: '시금치', season: '겨울', seasonKey: 'winter', emoji: '🥬' },
  { id: 'cockle', name: '꼬막', season: '겨울', seasonKey: 'winter', emoji: '🦪' },
  { id: 'lotus-root', name: '연근', season: '겨울', seasonKey: 'winter', emoji: '🪷' },
]

const base = { image: '', imageFallback: '🍽️' }

// 작업: 식재료별 대표 메뉴를 연결합니다.
// 개인 수정 가능: 메뉴를 추가할 때 seasonalIngredientIds에는 대표 식재료 id 하나를 우선 넣어주세요.
// 적용 위치: 홈 > 식재료 선택 후 메뉴 추천, 장보기 재료 목록, 펫홈 식재료 먹이기.
export const menus: Menu[] = [
  menu('spring-herb-bibimbap', '봄나물 비빔밥', '봄', '맑은 날', 30, '#75b84f', ['dallae'], [
    ['달래', '1묶음', 2500], ['냉이', '1봉', 2900], ['고추장', '1통', 3500],
  ]),
  menu('dallae-soy-noodle', '달래 간장국수', '봄', '가벼운 날', 27, '#6fb85d', ['dallae'], [
    ['달래', '1묶음', 2500], ['소면', '1봉', 3200], ['간장', '1병', 3100],
  ]),
  menu('naengi-soybean-soup', '냉이 된장국', '봄', '따뜻한 날', 31, '#8abd63', ['naengi'], [
    ['냉이', '1봉', 2900], ['된장', '1통', 4200], ['두부', '1모', 2500],
  ]),
  menu('strawberry-toast', '딸기 프렌치토스트', '봄', '브런치 날', 29, '#f06b7d', ['strawberry'], [
    ['딸기', '1팩', 6500], ['식빵', '1봉', 3200], ['생크림', '1팩', 3900],
  ]),
  menu('strawberry-salad', '딸기 리코타 샐러드', '봄', '산뜻한 날', 26, '#ec7184', ['strawberry'], [
    ['딸기', '1팩', 6500], ['리코타', '1팩', 5200], ['샐러드 채소', '1팩', 3200],
  ]),
  menu('asparagus-risotto', '아스파라거스 리소토', '봄', '든든한 날', 37, '#5ca86f', ['asparagus'], [
    ['아스파라거스', '1팩', 6200], ['쌀', '1컵', 900], ['치즈', '1봉', 4800],
  ]),
  menu('jukkumi-stir-fry', '주꾸미 볶음', '봄', '매콤한 날', 41, '#d96b4f', ['jukkumi'], [
    ['주꾸미', '300g', 9800], ['양파', '1개', 1200], ['고추장', '1통', 3500],
  ]),
  menu('spring-cabbage-geotjeori', '봄동 겉절이', '봄', '가벼운 반찬', 24, '#8abd63', ['spring-cabbage'], [
    ['봄동', '1포기', 3200], ['쪽파', '1줌', 1800], ['고춧가루', '1봉', 4200],
  ]),
  menu('dureup-tempura', '두릅 튀김', '봄', '바삭한 날', 33, '#6aa85e', ['dureup'], [
    ['두릅', '1팩', 6200], ['튀김가루', '1봉', 3300], ['간장', '1병', 3100],
  ]),
  menu('minari-pancake', '미나리전', '봄', '향긋한 날', 28, '#52a064', ['minari'], [
    ['미나리', '1단', 3600], ['부침가루', '1봉', 3300], ['오징어', '1팩', 6900],
  ]),
  menu('watermelon-kongguksu', '수박 콩국수', '여름', '더운 날', 34, '#ff8a58', ['watermelon'], [
    ['콩국수면', '1인분', 3200], ['수박', '1/6통', 5800], ['콩국물', '500ml', 4200],
  ]),
  menu('watermelon-feta-salad', '수박 페타 샐러드', '여름', '가벼운 날', 28, '#f05d5e', ['watermelon'], [
    ['수박', '1/8통', 3600], ['샐러드 채소', '1팩', 3200], ['페타치즈', '80g', 5200],
  ]),
  menu('peach-caprese', '복숭아 카프레제', '여름', '입맛 돋는 날', 32, '#f79d8a', ['peach'], [
    ['복숭아', '2개', 6200], ['모차렐라', '1팩', 4800], ['바질', '1팩', 2500],
  ]),
  menu('peach-yogurt-bowl', '복숭아 요거트볼', '여름', '아침 메뉴', 24, '#ffb39f', ['peach'], [
    ['복숭아', '1개', 3100], ['그릭요거트', '1컵', 4200], ['그래놀라', '1봉', 3900],
  ]),
  menu('corn-pot-rice', '초당옥수수 솥밥', '여름', '든든한 날', 36, '#f4c84d', ['corn'], [
    ['초당옥수수', '2개', 5600], ['쌀', '2컵', 1800], ['버터', '1조각', 1200],
  ]),
  menu('corn-cold-soup', '초당옥수수 냉수프', '여름', '가벼운 날', 29, '#efbd42', ['corn'], [
    ['초당옥수수', '2개', 5600], ['우유', '500ml', 2600], ['양파', '1개', 1000],
  ]),
  menu('tomato-cold-pasta', '토마토 냉파스타', '여름', '더운 날', 35, '#e85b4f', ['tomato'], [
    ['토마토', '3개', 4200], ['파스타면', '1봉', 3300], ['올리브오일', '1병', 6500],
  ]),
  menu('tomato-marinade', '토마토 마리네이드', '여름', '상큼한 날', 25, '#dd5147', ['tomato'], [
    ['토마토', '4개', 5600], ['올리브오일', '1병', 6500], ['양파', '1개', 1000],
  ]),
  menu('cucumber-cold-soup', '오이 냉국', '여름', '무더운 날', 26, '#65b96e', ['cucumber'], [
    ['오이', '2개', 2600], ['미역', '1봉', 2200], ['식초', '1병', 2900],
  ]),
  menu('cucumber-bibim-noodle', '오이 비빔국수', '여름', '입맛 돋는 날', 31, '#68aa58', ['cucumber'], [
    ['오이', '1개', 1300], ['소면', '1봉', 3200], ['고추장', '1통', 3500],
  ]),
  menu('eggplant-donburi', '가지 덮밥', '여름', '든든한 날', 34, '#7b5ab6', ['eggplant'], [
    ['가지', '2개', 3200], ['밥', '1공기', 1200], ['간장', '1병', 3100],
  ]),
  menu('melon-smoothie', '참외 스무디', '여름', '간식 시간', 23, '#e9c955', ['melon'], [
    ['참외', '2개', 5400], ['요거트', '1컵', 3500], ['꿀', '1병', 4300],
  ]),
  menu('pepper-jeon', '꽈리고추전', '여름', '반찬 만드는 날', 33, '#4b9d54', ['pepper'], [
    ['꽈리고추', '1봉', 2400], ['두부', '1모', 2500], ['부침가루', '1봉', 3300],
  ]),
  menu('zucchini-pancake', '애호박전', '여름', '비 오는 날', 27, '#77b957', ['zucchini'], [
    ['애호박', '1개', 1800], ['달걀', '6구', 4200], ['부침가루', '1봉', 3300],
  ]),
  menu('perilla-leaf-rice', '깻잎 쌈밥', '여름', '향긋한 날', 30, '#4f9f5f', ['perilla-leaf'], [
    ['깻잎', '2묶음', 2800], ['밥', '1공기', 1200], ['쌈장', '1통', 3300],
  ]),
  menu('potato-salad', '감자 샐러드', '여름', '부드러운 날', 25, '#d6a94a', ['potato'], [
    ['감자', '3개', 3600], ['달걀', '6구', 4200], ['마요네즈', '1병', 3900],
  ]),
  menu('young-radish-noodle', '열무 비빔국수', '여름', '시원한 날', 31, '#67aa54', ['young-radish'], [
    ['열무김치', '1팩', 5600], ['소면', '1봉', 3200], ['고추장', '1통', 3500],
  ]),
  menu('gizzard-shad-salad', '전어 무침', '가을', '신선한 날', 42, '#5f9f68', ['gizzard-shad'], [
    ['전어', '300g', 9800], ['쪽파', '1줌', 1800], ['고추장', '1통', 3500],
  ]),
  menu('sweet-potato-gratin', '고구마 그라탕', '가을', '포근한 날', 31, '#d9853b', ['sweet-potato'], [
    ['고구마', '2개', 4200], ['치즈', '1봉', 4800], ['우유', '500ml', 2600],
  ]),
  menu('mushroom-hotpot', '버섯 전골', '가을', '뜨끈한 날', 39, '#9a7656', ['mushroom'], [
    ['버섯모둠', '1팩', 6800], ['육수', '1팩', 3300], ['쌀', '1컵', 1200],
  ]),
  menu('pear-salad', '배 샐러드', '가을', '가벼운 날', 25, '#caa95a', ['pear'], [
    ['배', '1개', 3800], ['루꼴라', '1팩', 3300], ['견과류', '1봉', 4500],
  ]),
  menu('chestnut-rice', '밤 솥밥', '가을', '든든한 날', 34, '#8c6a42', ['chestnut'], [
    ['밤', '1봉', 6200], ['쌀', '2컵', 1800], ['버터', '1조각', 1200],
  ]),
  menu('pumpkin-soup', '단호박 수프', '가을', '부드러운 날', 29, '#d88a38', ['pumpkin'], [
    ['단호박', '1통', 5200], ['우유', '500ml', 2600], ['양파', '1개', 1200],
  ]),
  menu('apple-pork-salad', '사과 돼지고기 샐러드', '가을', '상큼한 날', 35, '#d95d5d', ['apple'], [
    ['사과', '2개', 4200], ['돼지고기', '200g', 7600], ['샐러드 채소', '1팩', 3200],
  ]),
  menu('shrimp-salt-grill', '대하 소금구이', '가을', '고소한 날', 44, '#d98b55', ['shrimp'], [
    ['대하', '300g', 12000], ['굵은소금', '1봉', 1800], ['레몬', '1개', 1500],
  ]),
  menu('oyster-gukbap', '굴국밥', '겨울', '따뜻한 날', 48, '#4f97b8', ['oyster'], [
    ['생굴', '200g', 7600], ['대파', '1대', 1200], ['쌀', '1공기', 1200],
  ]),
  menu('radish-beef-soup', '무 소고기국', '겨울', '시원한 국물', 36, '#7fa7b8', ['radish'], [
    ['무', '1/3개', 1900], ['소고기', '200g', 8900], ['대파', '1대', 1200],
  ]),
  menu('cabbage-hotpot', '배추 밀푀유나베', '겨울', '추운 날', 43, '#7fb86a', ['cabbage'], [
    ['배추', '1/2포기', 4200], ['샤브샤브용 고기', '300g', 9800], ['육수', '1팩', 3300],
  ]),
  menu('mandarin-pudding', '귤 푸딩', '겨울', '간식 시간', 22, '#f2a13b', ['mandarin'], [
    ['귤', '5개', 4300], ['우유', '500ml', 2600], ['젤라틴', '1봉', 2400],
  ]),
  menu('cod-stew', '대구탕', '겨울', '뜨끈한 날', 45, '#4f8faf', ['cod'], [
    ['대구', '1팩', 9800], ['무', '1/4개', 1500], ['쑥갓', '1봉', 2600],
  ]),
  menu('spinach-namul', '시금치 나물', '겨울', '담백한 반찬', 23, '#5f9f68', ['spinach'], [
    ['시금치', '1단', 3200], ['참기름', '1병', 5900], ['깨', '1봉', 2200],
  ]),
  menu('cockle-bibimbap', '꼬막 비빔밥', '겨울', '감칠맛 나는 날', 42, '#8a6a58', ['cockle'], [
    ['꼬막', '300g', 9800], ['밥', '1공기', 1200], ['부추', '1줌', 2200],
  ]),
  menu('lotus-root-jorim', '연근 조림', '겨울', '아삭한 반찬', 27, '#b48a64', ['lotus-root'], [
    ['연근', '1팩', 4200], ['간장', '1병', 3100], ['올리고당', '1병', 3600],
  ]),
]

export const decorItems: DecorItem[] = [
  { id: 'sunny-kitchen', name: '햇살 주방', type: 'background' },
  { id: 'spring-flower-room', name: '봄꽃 창가', type: 'background' },
  { id: 'summer-beach-room', name: '여름 바닷가', type: 'background' },
  { id: 'autumn-leaf-room', name: '가을 낙엽방', type: 'background', unlockLevel: 2 },
  { id: 'winter-snow-room', name: '겨울 눈꽃방', type: 'background', unlockByShopping: true },
  { id: 'picnic-mat', name: '피크닉 매트', type: 'background' },
  { id: 'garden-window', name: '초록 창가', type: 'background' },
  { id: 'night-market', name: '야시장', type: 'background', unlockLevel: 2 },
  { id: 'cloud-room', name: '구름 방', type: 'background', unlockByShopping: true },
  { id: 'basic-bib', name: '기본 앞치마', type: 'outfit' },
  { id: 'watermelon-hat', name: '수박 모자', type: 'outfit' },
  { id: 'winter-scarf', name: '겨울 목도리', type: 'outfit', unlockLevel: 2 },
  { id: 'chef-coat', name: '셰프 코트', type: 'outfit' },
  { id: 'rain-poncho', name: '레인 판초', type: 'outfit', unlockByShopping: true },
  { id: 'heart-mug', name: '하트 머그', type: 'accessory' },
  { id: 'market-bag', name: '장바구니', type: 'accessory' },
  { id: 'berry-pin', name: '딸기 핀', type: 'accessory' },
  { id: 'watermelon-juice', name: '수박 주스', type: 'accessory' },
  { id: 'roasted-sweet-potato', name: '군고구마 봉투', type: 'accessory', unlockLevel: 2 },
  { id: 'mandarin-basket', name: '귤 바구니', type: 'accessory', unlockByShopping: true },
  { id: 'sun-glasses', name: '선글라스', type: 'accessory', unlockLevel: 2 },
  { id: 'soup-spoon', name: '수프 숟가락', type: 'accessory' },
  { id: 'mini-fan', name: '미니 선풍기', type: 'accessory', unlockByShopping: true },
]

function menu(
  id: string,
  name: string,
  season: string,
  weather: string,
  exp: number,
  color: string,
  seasonalIngredientIds: string[],
  ingredients: [string, string, number][],
): Menu {
  return {
    ...base,
    id,
    name,
    season,
    weather,
    description: '',
    exp,
    color,
    seasonalIngredientIds,
    ingredients: ingredients.map(([ingredientName, quantity, price]) => ({ name: ingredientName, quantity, price })),
  }
}
