-- menus에는 있지만 menu_ingredients가 비어 있어 0XP로 표시되는 메뉴를 보완합니다.
-- 이미 재료가 하나라도 있는 메뉴는 건드리지 않으므로 여러 번 실행해도 안전합니다.

with primary_defaults(priority, keyword, ingredient_name, quantity, price) as (
  values
    (1, '감자', '감자', '3개', 3600),
    (2, '곶감', '감', '2개', 4300),
    (3, '사과', '사과', '2개', 4200),
    (4, '죽순', '죽순', '1팩', 6200),
    (5, '우엉', '우엉', '1팩', 3600),
    (6, '바지락', '바지락', '300g', 7600),
    (7, '봉골레', '바지락', '300g', 7600),
    (8, '꼬막', '꼬막', '300g', 9800),
    (9, '두릅', '두릅', '1팩', 6200),
    (10, '장어', '장어', '1팩', 14800),
    (11, '무화과', '무화과', '4개', 7200),
    (12, '포도', '포도', '1송이', 6200),
    (13, '한라봉', '한라봉', '2개', 7800),
    (14, '연근', '연근', '1팩', 4200),
    (15, '고등어', '고등어', '1마리', 6800),
    (16, '참외', '참외', '2개', 5400),
    (17, '미나리', '미나리', '1단', 3600),
    (18, '쑥', '쑥', '1봉', 2800),
    (19, '꽈리고추', '꽈리고추', '1봉', 2400),
    (20, '깻잎', '깻잎', '2묶음', 2800),
    (21, '감', '감', '2개', 4300),
    (22, '자두', '자두', '5개', 5800),
    (23, '대하', '대하', '300g', 12000),
    (24, '방어', '방어', '200g', 13800),
    (25, '열무', '열무김치', '1팩', 5600),
    (26, '애호박', '애호박', '1개', 1800)
),
support_defaults(priority, pattern, second_name, second_quantity, second_price, third_name, third_quantity, third_price) as (
  values
    (1, '파이|타르트', '밀가루', '1봉', 2800, '버터', '1개', 3200),
    (2, '잼|청|마말레이드', '설탕', '1봉', 2300, '레몬', '1개', 1500),
    (3, '조림', '간장', '1병', 3100, '올리고당', '1병', 3600),
    (4, '주스|에이드|화채', '탄산수', '1병', 1800, '꿀', '1병', 4300),
    (5, '샐러드', '샐러드 채소', '1팩', 3200, '치즈', '1봉', 4800),
    (6, '된장찌개|된장국', '된장', '1통', 4200, '두부', '1모', 2500),
    (7, '전$', '부침가루', '1봉', 3300, '달걀', '6구', 4200),
    (8, '튀김', '튀김가루', '1봉', 3300, '식용유', '1병', 4500),
    (9, '구이', '굵은소금', '1봉', 1800, '레몬', '1개', 1500),
    (10, '회$', '무순', '1팩', 1800, '간장', '1병', 3100),
    (11, '초밥|비빔밥|밥$', '쌀', '2컵', 1800, '간장', '1병', 3100),
    (12, '김치|소박이', '부추', '1줌', 2200, '고춧가루', '1봉', 4200),
    (13, '장아찌|피클', '식초', '1병', 2900, '간장', '1병', 3100),
    (14, '무침|나물|숙회|데침', '참기름', '1병', 5900, '깨', '1봉', 2200),
    (15, '떡|인절미', '찹쌀가루', '1봉', 3500, '콩가루', '1봉', 2800),
    (16, '말랭이|차$', '설탕', '1봉', 2300, '꿀', '1병', 4300),
    (17, '파스타', '파스타면', '1봉', 3300, '올리브오일', '1병', 6500),
    (18, '술찜', '화이트와인', '1병', 8900, '버터', '1개', 3200),
    (19, '탕|국|백숙|전골|찜', '육수', '1팩', 3300, '대파', '1대', 1200),
    (20, '볶음', '양파', '1개', 1200, '간장', '1병', 3100)
),
missing_menus as (
  select
    menu.id as menu_id,
    coalesce(primary_item.ingredient_name, '제철 식재료') as primary_name,
    coalesce(primary_item.quantity, '1팩') as primary_quantity,
    coalesce(primary_item.price, 4500) as primary_price,
    coalesce(support_item.second_name, '양파') as second_name,
    coalesce(support_item.second_quantity, '1개') as second_quantity,
    coalesce(support_item.second_price, 1200) as second_price,
    coalesce(support_item.third_name, '간장') as third_name,
    coalesce(support_item.third_quantity, '1병') as third_quantity,
    coalesce(support_item.third_price, 3100) as third_price
  from public.menus as menu
  left join lateral (
    select ingredient_name, quantity, price
    from primary_defaults
    where position(keyword in menu.name) > 0
    order by priority
    limit 1
  ) as primary_item on true
  left join lateral (
    select second_name, second_quantity, second_price, third_name, third_quantity, third_price
    from support_defaults
    where menu.name ~ pattern
    order by priority
    limit 1
  ) as support_item on true
  where not exists (
    select 1
    from public.menu_ingredients as ingredient
    where ingredient.menu_id = menu.id
  )
),
ingredients_to_insert as (
  select menu_id, primary_name as name, primary_quantity as quantity, primary_price as price, 1 as sort_order
  from missing_menus
  union all
  select menu_id, second_name, second_quantity, second_price, 2
  from missing_menus
  union all
  select menu_id, third_name, third_quantity, third_price, 3
  from missing_menus
)
insert into public.menu_ingredients (menu_id, name, quantity, price, sort_order)
select
  ingredients_to_insert.menu_id,
  ingredients_to_insert.name,
  ingredients_to_insert.quantity,
  ingredients_to_insert.price,
  ingredients_to_insert.sort_order
from ingredients_to_insert
join public.menus as menu on menu.id = ingredients_to_insert.menu_id
where lower(regexp_replace(ingredients_to_insert.name, '[[:space:]/·・,()[\]-]', '', 'g'))
  <> lower(regexp_replace(menu.name, '[[:space:]/·・,()[\]-]', '', 'g'));

update public.menus as menu
set exp = ingredient_totals.total_price
from (
  select menu_id, sum(price)::integer as total_price
  from public.menu_ingredients
  group by menu_id
) as ingredient_totals
where ingredient_totals.menu_id = menu.id
  and ingredient_totals.total_price > 0;

-- 실행 결과가 0행이면 모든 메뉴에 양수 XP가 연결된 상태입니다.
select
  menu.id,
  menu.name,
  coalesce(sum(ingredient.price), 0) as calculated_exp
from public.menus as menu
left join public.menu_ingredients as ingredient on ingredient.menu_id = menu.id
group by menu.id, menu.name
having coalesce(sum(ingredient.price), 0) <= 0
order by menu.id;
