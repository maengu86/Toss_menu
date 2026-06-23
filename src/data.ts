import type { DecorItem, Menu, SeasonalIngredient, SeasonKey } from './types'

export const seasons: { key: SeasonKey; label: string; accent: string }[] = [
  { key: 'spring', label: '봄', accent: '#7abf63' },
  { key: 'summer', label: '여름', accent: '#ff9a62' },
  { key: 'autumn', label: '가을', accent: '#d79555' },
  { key: 'winter', label: '겨울', accent: '#70aeca' },
]

export const seasonalIngredients: SeasonalIngredient[] = [
  { id: 'dallae', name: '달래', season: '봄', seasonKey: 'spring', emoji: '🌿' },
  { id: 'naengi', name: '냉이', season: '봄', seasonKey: 'spring', emoji: '🌱' },
  { id: 'strawberry', name: '딸기', season: '봄', seasonKey: 'spring', emoji: '🍓' },
  { id: 'asparagus', name: '아스파라거스', season: '봄', seasonKey: 'spring', emoji: '🥦' },
  { id: 'watermelon', name: '수박', season: '여름', seasonKey: 'summer', emoji: '🍉' },
  { id: 'peach', name: '복숭아', season: '여름', seasonKey: 'summer', emoji: '🍑' },
  { id: 'corn', name: '초당옥수수', season: '여름', seasonKey: 'summer', emoji: '🌽' },
  { id: 'tomato', name: '토마토', season: '여름', seasonKey: 'summer', emoji: '🍅' },
  { id: 'cucumber', name: '오이', season: '여름', seasonKey: 'summer', emoji: '🥒' },
  { id: 'eggplant', name: '가지', season: '여름', seasonKey: 'summer', emoji: '🍆' },
  { id: 'melon', name: '참외', season: '여름', seasonKey: 'summer', emoji: '🍈' },
  { id: 'pepper', name: '풋고추', season: '여름', seasonKey: 'summer', emoji: '🌶️' },
  { id: 'gizzard-shad', name: '전어', season: '가을', seasonKey: 'autumn', emoji: '🐟' },
  { id: 'sweet-potato', name: '고구마', season: '가을', seasonKey: 'autumn', emoji: '🍠' },
  { id: 'mushroom', name: '버섯', season: '가을', seasonKey: 'autumn', emoji: '🍄' },
  { id: 'pear', name: '배', season: '가을', seasonKey: 'autumn', emoji: '🍐' },
  { id: 'oyster', name: '굴', season: '겨울', seasonKey: 'winter', emoji: '🦪' },
  { id: 'radish', name: '무', season: '겨울', seasonKey: 'winter', emoji: '⚪' },
  { id: 'cabbage', name: '배추', season: '겨울', seasonKey: 'winter', emoji: '🥬' },
  { id: 'mandarin', name: '귤', season: '겨울', seasonKey: 'winter', emoji: '🍊' },
]

const base = { image: '', imageFallback: '🍽️' }

export const menus: Menu[] = [
  menu('spring-herb-bibimbap', '봄나물 비빔밥', '봄', '맑은 날', 30, '#75b84f', ['dallae', 'naengi'], [
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
    ['아스파라거스', '1단', 6200], ['쌀', '1컵', 900], ['치즈', '1팩', 4800],
  ]),
  menu('watermelon-kongguksu', '수박 콩국수', '여름', '더운 날', 34, '#ff8a58', ['watermelon'], [
    ['콩국수면', '1인분', 3200], ['수박', '1/6통', 5800], ['콩국물', '500ml', 4200],
  ]),
  menu('watermelon-feta-salad', '수박 페타 샐러드', '여름', '가벼운 날', 28, '#f05d5e', ['watermelon'], [
    ['수박', '1/8통', 3600], ['샐러드 채소', '1팩', 3200], ['페타치즈', '80g', 5200],
  ]),
  menu('peach-caprese', '복숭아 카프레제', '여름', '입맛 없는 날', 32, '#f79d8a', ['peach'], [
    ['복숭아', '2개', 6200], ['모차렐라', '1팩', 4800], ['바질', '1팩', 2500],
  ]),
  menu('peach-yogurt-bowl', '복숭아 요거트볼', '여름', '아침 메뉴', 24, '#ffb39f', ['peach'], [
    ['복숭아', '1개', 3100], ['그릭요거트', '1컵', 4200], ['그래놀라', '1봉', 3900],
  ]),
  menu('corn-pot-rice', '초당옥수수 솥밥', '여름', '든든한 날', 36, '#f4c84d', ['corn'], [
    ['초당옥수수', '2개', 5600], ['쌀', '2컵', 1800], ['버터', '1조각', 1200],
  ]),
  menu('corn-cold-soup', '초당옥수수 냉스프', '여름', '가벼운 날', 29, '#efbd42', ['corn'], [
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
  menu('cucumber-bibim-noodle', '오이 비빔국수', '여름', '입맛 없는 날', 31, '#68aa58', ['cucumber'], [
    ['오이', '1개', 1300], ['소면', '1봉', 3200], ['고추장', '1통', 3500],
  ]),
  menu('eggplant-donburi', '가지 덮밥', '여름', '든든한 날', 34, '#7b5ab6', ['eggplant'], [
    ['가지', '2개', 3200], ['밥', '1공기', 1200], ['간장', '1병', 3100],
  ]),
  menu('melon-smoothie', '참외 스무디', '여름', '간식 시간', 23, '#e9c955', ['melon'], [
    ['참외', '2개', 5400], ['요거트', '1컵', 3500], ['꿀', '1병', 4300],
  ]),
  menu('pepper-jeon', '풋고추전', '여름', '반찬 만드는 날', 33, '#4b9d54', ['pepper'], [
    ['풋고추', '1봉', 2400], ['두부', '1모', 2500], ['부침가루', '1봉', 3300],
  ]),
  menu('gizzard-shad-salad', '전어 무침', '가을', '선선한 날', 42, '#5f9f68', ['gizzard-shad'], [
    ['전어', '300g', 9800], ['쪽파', '1줌', 1800], ['고추장', '1통', 3500],
  ]),
  menu('sweet-potato-gratin', '고구마 그라탱', '가을', '포근한 날', 31, '#d9853b', ['sweet-potato'], [
    ['고구마', '2개', 4200], ['치즈', '1팩', 4800], ['우유', '500ml', 2600],
  ]),
  menu('mushroom-hotpot', '버섯 전골', '가을', '쌀쌀한 날', 39, '#9a7656', ['mushroom'], [
    ['버섯모둠', '1팩', 6800], ['육수', '1팩', 3300], ['대파', '1대', 1200],
  ]),
  menu('pear-salad', '배 샐러드', '가을', '가벼운 날', 25, '#caa95a', ['pear'], [
    ['배', '1개', 3800], ['루꼴라', '1팩', 3300], ['견과류', '1봉', 4500],
  ]),
  menu('oyster-gukbap', '굴국밥', '겨울', '따뜻한 날', 48, '#4f97b8', ['oyster', 'radish'], [
    ['생굴', '200g', 7600], ['무', '1/3개', 1900], ['대파', '1대', 1200],
  ]),
  menu('cabbage-hotpot', '배추 밀푀유나베', '겨울', '추운 날', 43, '#7fb86a', ['cabbage'], [
    ['배추', '1/2포기', 4200], ['샤브샤브용 고기', '300g', 9800], ['육수', '1팩', 3300],
  ]),
  menu('mandarin-pudding', '귤 푸딩', '겨울', '간식 시간', 22, '#f2a13b', ['mandarin'], [
    ['귤', '5개', 4300], ['우유', '500ml', 2600], ['젤라틴', '1봉', 2400],
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
  { id: 'soup-spoon', name: '스프 숟가락', type: 'accessory' },
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
