create table if not exists public.seasons (
  key text primary key,
  label text not null,
  accent text not null,
  sort_order integer not null
);

create table if not exists public.seasonal_ingredients (
  id text primary key,
  name text not null,
  season text not null,
  season_key text not null references public.seasons(key),
  emoji text not null
);

create table if not exists public.menus (
  id text primary key,
  name text not null,
  season text not null,
  season_key text not null references public.seasons(key),
  weather text not null,
  description text not null default '',
  exp integer not null,
  color text not null,
  image text not null default '',
  image_fallback text not null default '🍽️'
);

create table if not exists public.menu_seasonal_ingredients (
  menu_id text not null references public.menus(id) on delete cascade,
  ingredient_id text not null references public.seasonal_ingredients(id) on delete cascade,
  primary key (menu_id, ingredient_id)
);

create table if not exists public.menu_ingredients (
  id bigint generated always as identity primary key,
  menu_id text not null references public.menus(id) on delete cascade,
  name text not null,
  quantity text not null,
  price integer not null,
  sort_order integer not null
);

create table if not exists public.decor_items (
  id text primary key,
  name text not null,
  type text not null check (type in ('background', 'outfit', 'accessory')),
  unlock_level integer,
  unlock_by_shopping boolean not null default false
);

create index if not exists seasonal_ingredients_season_key_idx on public.seasonal_ingredients(season_key);
create index if not exists menus_season_key_idx on public.menus(season_key);
create index if not exists menu_ingredients_menu_id_idx on public.menu_ingredients(menu_id);

alter table public.seasons enable row level security;
alter table public.seasonal_ingredients enable row level security;
alter table public.menus enable row level security;
alter table public.menu_seasonal_ingredients enable row level security;
alter table public.menu_ingredients enable row level security;
alter table public.decor_items enable row level security;

drop policy if exists "Public read seasons" on public.seasons;
create policy "Public read seasons"
  on public.seasons for select
  using (true);

drop policy if exists "Public read seasonal ingredients" on public.seasonal_ingredients;
create policy "Public read seasonal ingredients"
  on public.seasonal_ingredients for select
  using (true);

drop policy if exists "Public read menus" on public.menus;
create policy "Public read menus"
  on public.menus for select
  using (true);

drop policy if exists "Public read menu seasonal ingredients" on public.menu_seasonal_ingredients;
create policy "Public read menu seasonal ingredients"
  on public.menu_seasonal_ingredients for select
  using (true);

drop policy if exists "Public read menu ingredients" on public.menu_ingredients;
create policy "Public read menu ingredients"
  on public.menu_ingredients for select
  using (true);

drop policy if exists "Public read decor items" on public.decor_items;
create policy "Public read decor items"
  on public.decor_items for select
  using (true);

insert into public.seasons (key, label, accent, sort_order) values
  ('spring', '봄', '#7abf63', 1),
  ('summer', '여름', '#ff9a62', 2),
  ('autumn', '가을', '#d79555', 3),
  ('winter', '겨울', '#70aeca', 4)
on conflict (key) do update set
  label = excluded.label,
  accent = excluded.accent,
  sort_order = excluded.sort_order;

insert into public.seasonal_ingredients (id, name, season, season_key, emoji) values
  ('dallae', '달래', '봄', 'spring', '🌿'),
  ('naengi', '냉이', '봄', 'spring', '🌱'),
  ('strawberry', '딸기', '봄', 'spring', '🍓'),
  ('asparagus', '아스파라거스', '봄', 'spring', '🥦'),
  ('watermelon', '수박', '여름', 'summer', '🍉'),
  ('peach', '복숭아', '여름', 'summer', '🍑'),
  ('corn', '초당옥수수', '여름', 'summer', '🌽'),
  ('tomato', '토마토', '여름', 'summer', '🍅'),
  ('cucumber', '오이', '여름', 'summer', '🥒'),
  ('eggplant', '가지', '여름', 'summer', '🍆'),
  ('melon', '참외', '여름', 'summer', '🍈'),
  ('pepper', '풋고추', '여름', 'summer', '🌶️'),
  ('gizzard-shad', '전어', '가을', 'autumn', '🐟'),
  ('sweet-potato', '고구마', '가을', 'autumn', '🍠'),
  ('mushroom', '버섯', '가을', 'autumn', '🍄'),
  ('pear', '배', '가을', 'autumn', '🍐'),
  ('oyster', '굴', '겨울', 'winter', '🦪'),
  ('radish', '무', '겨울', 'winter', '⚪'),
  ('cabbage', '배추', '겨울', 'winter', '🥬'),
  ('mandarin', '귤', '겨울', 'winter', '🍊')
on conflict (id) do update set
  name = excluded.name,
  season = excluded.season,
  season_key = excluded.season_key,
  emoji = excluded.emoji;

insert into public.menus (id, name, season, season_key, weather, exp, color) values
  ('spring-herb-bibimbap', '봄나물 비빔밥', '봄', 'spring', '맑은 날', 30, '#75b84f'),
  ('dallae-soy-noodle', '달래 간장국수', '봄', 'spring', '가벼운 날', 27, '#6fb85d'),
  ('naengi-soybean-soup', '냉이 된장국', '봄', 'spring', '따뜻한 날', 31, '#8abd63'),
  ('strawberry-toast', '딸기 프렌치토스트', '봄', 'spring', '브런치 날', 29, '#f06b7d'),
  ('strawberry-salad', '딸기 리코타 샐러드', '봄', 'spring', '산뜻한 날', 26, '#ec7184'),
  ('asparagus-risotto', '아스파라거스 리소토', '봄', 'spring', '든든한 날', 37, '#5ca86f'),
  ('watermelon-kongguksu', '수박 콩국수', '여름', 'summer', '더운 날', 34, '#ff8a58'),
  ('watermelon-feta-salad', '수박 페타 샐러드', '여름', 'summer', '가벼운 날', 28, '#f05d5e'),
  ('peach-caprese', '복숭아 카프레제', '여름', 'summer', '입맛 없는 날', 32, '#f79d8a'),
  ('peach-yogurt-bowl', '복숭아 요거트볼', '여름', 'summer', '아침 메뉴', 24, '#ffb39f'),
  ('corn-pot-rice', '초당옥수수 솥밥', '여름', 'summer', '든든한 날', 36, '#f4c84d'),
  ('corn-cold-soup', '초당옥수수 냉스프', '여름', 'summer', '가벼운 날', 29, '#efbd42'),
  ('tomato-cold-pasta', '토마토 냉파스타', '여름', 'summer', '더운 날', 35, '#e85b4f'),
  ('tomato-marinade', '토마토 마리네이드', '여름', 'summer', '상큼한 날', 25, '#dd5147'),
  ('cucumber-cold-soup', '오이 냉국', '여름', 'summer', '무더운 날', 26, '#65b96e'),
  ('cucumber-bibim-noodle', '오이 비빔국수', '여름', 'summer', '입맛 없는 날', 31, '#68aa58'),
  ('eggplant-donburi', '가지 덮밥', '여름', 'summer', '든든한 날', 34, '#7b5ab6'),
  ('melon-smoothie', '참외 스무디', '여름', 'summer', '간식 시간', 23, '#e9c955'),
  ('pepper-jeon', '풋고추전', '여름', 'summer', '반찬 만드는 날', 33, '#4b9d54'),
  ('gizzard-shad-salad', '전어 무침', '가을', 'autumn', '선선한 날', 42, '#5f9f68'),
  ('sweet-potato-gratin', '고구마 그라탱', '가을', 'autumn', '포근한 날', 31, '#d9853b'),
  ('mushroom-hotpot', '버섯 전골', '가을', 'autumn', '쌀쌀한 날', 39, '#9a7656'),
  ('pear-salad', '배 샐러드', '가을', 'autumn', '가벼운 날', 25, '#caa95a'),
  ('oyster-gukbap', '굴국밥', '겨울', 'winter', '따뜻한 날', 48, '#4f97b8'),
  ('cabbage-hotpot', '배추 밀푀유나베', '겨울', 'winter', '추운 날', 43, '#7fb86a'),
  ('mandarin-pudding', '귤 푸딩', '겨울', 'winter', '간식 시간', 22, '#f2a13b')
on conflict (id) do update set
  name = excluded.name,
  season = excluded.season,
  season_key = excluded.season_key,
  weather = excluded.weather,
  exp = excluded.exp,
  color = excluded.color;

insert into public.menu_seasonal_ingredients (menu_id, ingredient_id) values
  ('spring-herb-bibimbap', 'dallae'),
  ('spring-herb-bibimbap', 'naengi'),
  ('dallae-soy-noodle', 'dallae'),
  ('naengi-soybean-soup', 'naengi'),
  ('strawberry-toast', 'strawberry'),
  ('strawberry-salad', 'strawberry'),
  ('asparagus-risotto', 'asparagus'),
  ('watermelon-kongguksu', 'watermelon'),
  ('watermelon-feta-salad', 'watermelon'),
  ('peach-caprese', 'peach'),
  ('peach-yogurt-bowl', 'peach'),
  ('corn-pot-rice', 'corn'),
  ('corn-cold-soup', 'corn'),
  ('tomato-cold-pasta', 'tomato'),
  ('tomato-marinade', 'tomato'),
  ('cucumber-cold-soup', 'cucumber'),
  ('cucumber-bibim-noodle', 'cucumber'),
  ('eggplant-donburi', 'eggplant'),
  ('melon-smoothie', 'melon'),
  ('pepper-jeon', 'pepper'),
  ('gizzard-shad-salad', 'gizzard-shad'),
  ('sweet-potato-gratin', 'sweet-potato'),
  ('mushroom-hotpot', 'mushroom'),
  ('pear-salad', 'pear'),
  ('oyster-gukbap', 'oyster'),
  ('oyster-gukbap', 'radish'),
  ('cabbage-hotpot', 'cabbage'),
  ('mandarin-pudding', 'mandarin')
on conflict (menu_id, ingredient_id) do nothing;

delete from public.menu_ingredients;

insert into public.menu_ingredients (menu_id, name, quantity, price, sort_order) values
  ('spring-herb-bibimbap', '달래', '1묶음', 2500, 1),
  ('spring-herb-bibimbap', '냉이', '1봉', 2900, 2),
  ('spring-herb-bibimbap', '고추장', '1통', 3500, 3),
  ('dallae-soy-noodle', '달래', '1묶음', 2500, 1),
  ('dallae-soy-noodle', '소면', '1봉', 3200, 2),
  ('dallae-soy-noodle', '간장', '1병', 3100, 3),
  ('naengi-soybean-soup', '냉이', '1봉', 2900, 1),
  ('naengi-soybean-soup', '된장', '1통', 4200, 2),
  ('naengi-soybean-soup', '두부', '1모', 2500, 3),
  ('strawberry-toast', '딸기', '1팩', 6500, 1),
  ('strawberry-toast', '식빵', '1봉', 3200, 2),
  ('strawberry-toast', '생크림', '1팩', 3900, 3),
  ('strawberry-salad', '딸기', '1팩', 6500, 1),
  ('strawberry-salad', '리코타', '1팩', 5200, 2),
  ('strawberry-salad', '샐러드 채소', '1팩', 3200, 3),
  ('asparagus-risotto', '아스파라거스', '1단', 6200, 1),
  ('asparagus-risotto', '쌀', '1컵', 900, 2),
  ('asparagus-risotto', '치즈', '1팩', 4800, 3),
  ('watermelon-kongguksu', '콩국수면', '1인분', 3200, 1),
  ('watermelon-kongguksu', '수박', '1/6통', 5800, 2),
  ('watermelon-kongguksu', '콩국물', '500ml', 4200, 3),
  ('watermelon-feta-salad', '수박', '1/8통', 3600, 1),
  ('watermelon-feta-salad', '샐러드 채소', '1팩', 3200, 2),
  ('watermelon-feta-salad', '페타치즈', '80g', 5200, 3),
  ('peach-caprese', '복숭아', '2개', 6200, 1),
  ('peach-caprese', '모차렐라', '1팩', 4800, 2),
  ('peach-caprese', '바질', '1팩', 2500, 3),
  ('peach-yogurt-bowl', '복숭아', '1개', 3100, 1),
  ('peach-yogurt-bowl', '그릭요거트', '1컵', 4200, 2),
  ('peach-yogurt-bowl', '그래놀라', '1봉', 3900, 3),
  ('corn-pot-rice', '초당옥수수', '2개', 5600, 1),
  ('corn-pot-rice', '쌀', '2컵', 1800, 2),
  ('corn-pot-rice', '버터', '1조각', 1200, 3),
  ('corn-cold-soup', '초당옥수수', '2개', 5600, 1),
  ('corn-cold-soup', '우유', '500ml', 2600, 2),
  ('corn-cold-soup', '양파', '1개', 1000, 3),
  ('tomato-cold-pasta', '토마토', '3개', 4200, 1),
  ('tomato-cold-pasta', '파스타면', '1봉', 3300, 2),
  ('tomato-cold-pasta', '올리브오일', '1병', 6500, 3),
  ('tomato-marinade', '토마토', '4개', 5600, 1),
  ('tomato-marinade', '올리브오일', '1병', 6500, 2),
  ('tomato-marinade', '양파', '1개', 1000, 3),
  ('cucumber-cold-soup', '오이', '2개', 2600, 1),
  ('cucumber-cold-soup', '미역', '1봉', 2200, 2),
  ('cucumber-cold-soup', '식초', '1병', 2900, 3),
  ('cucumber-bibim-noodle', '오이', '1개', 1300, 1),
  ('cucumber-bibim-noodle', '소면', '1봉', 3200, 2),
  ('cucumber-bibim-noodle', '고추장', '1통', 3500, 3),
  ('eggplant-donburi', '가지', '2개', 3200, 1),
  ('eggplant-donburi', '밥', '1공기', 1200, 2),
  ('eggplant-donburi', '간장', '1병', 3100, 3),
  ('melon-smoothie', '참외', '2개', 5400, 1),
  ('melon-smoothie', '요거트', '1컵', 3500, 2),
  ('melon-smoothie', '꿀', '1병', 4300, 3),
  ('pepper-jeon', '풋고추', '1봉', 2400, 1),
  ('pepper-jeon', '두부', '1모', 2500, 2),
  ('pepper-jeon', '부침가루', '1봉', 3300, 3),
  ('gizzard-shad-salad', '전어', '300g', 9800, 1),
  ('gizzard-shad-salad', '쪽파', '1줌', 1800, 2),
  ('gizzard-shad-salad', '고추장', '1통', 3500, 3),
  ('sweet-potato-gratin', '고구마', '2개', 4200, 1),
  ('sweet-potato-gratin', '치즈', '1팩', 4800, 2),
  ('sweet-potato-gratin', '우유', '500ml', 2600, 3),
  ('mushroom-hotpot', '버섯모둠', '1팩', 6800, 1),
  ('mushroom-hotpot', '육수', '1팩', 3300, 2),
  ('mushroom-hotpot', '대파', '1대', 1200, 3),
  ('pear-salad', '배', '1개', 3800, 1),
  ('pear-salad', '루꼴라', '1팩', 3300, 2),
  ('pear-salad', '견과류', '1봉', 4500, 3),
  ('oyster-gukbap', '생굴', '200g', 7600, 1),
  ('oyster-gukbap', '무', '1/3개', 1900, 2),
  ('oyster-gukbap', '대파', '1대', 1200, 3),
  ('cabbage-hotpot', '배추', '1/2포기', 4200, 1),
  ('cabbage-hotpot', '샤브샤브용 고기', '300g', 9800, 2),
  ('cabbage-hotpot', '육수', '1팩', 3300, 3),
  ('mandarin-pudding', '귤', '5개', 4300, 1),
  ('mandarin-pudding', '우유', '500ml', 2600, 2),
  ('mandarin-pudding', '젤라틴', '1봉', 2400, 3);

insert into public.decor_items (id, name, type, unlock_level, unlock_by_shopping) values
  ('sunny-kitchen', '햇살 주방', 'background', null, false),
  ('spring-flower-room', '봄꽃 창가', 'background', null, false),
  ('summer-beach-room', '여름 바닷가', 'background', null, false),
  ('autumn-leaf-room', '가을 낙엽방', 'background', 2, false),
  ('winter-snow-room', '겨울 눈꽃방', 'background', null, true),
  ('picnic-mat', '피크닉 매트', 'background', null, false),
  ('garden-window', '초록 창가', 'background', null, false),
  ('night-market', '야시장', 'background', 2, false),
  ('cloud-room', '구름 방', 'background', null, true),
  ('basic-bib', '기본 앞치마', 'outfit', null, false),
  ('watermelon-hat', '수박 모자', 'outfit', null, false),
  ('winter-scarf', '겨울 목도리', 'outfit', 2, false),
  ('chef-coat', '셰프 코트', 'outfit', null, false),
  ('rain-poncho', '레인 판초', 'outfit', null, true),
  ('heart-mug', '하트 머그', 'accessory', null, false),
  ('market-bag', '장바구니', 'accessory', null, false),
  ('berry-pin', '딸기 핀', 'accessory', null, false),
  ('watermelon-juice', '수박 주스', 'accessory', null, false),
  ('roasted-sweet-potato', '군고구마 봉투', 'accessory', 2, false),
  ('mandarin-basket', '귤 바구니', 'accessory', null, true),
  ('sun-glasses', '선글라스', 'accessory', 2, false),
  ('soup-spoon', '스프 숟가락', 'accessory', null, false),
  ('mini-fan', '미니 선풍기', 'accessory', null, true)
on conflict (id) do update set
  name = excluded.name,
  type = excluded.type,
  unlock_level = excluded.unlock_level,
  unlock_by_shopping = excluded.unlock_by_shopping;
