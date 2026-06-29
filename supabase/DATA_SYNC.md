# DB Data Sync

`src/data`의 로컬 데이터를 Supabase DB에 반영하는 흐름입니다.

## 데이터 수정

1. `src/data/menus.ts` 또는 `src/data/seasonalIngredients.ts`를 수정합니다.
2. SQL을 다시 생성합니다.

```bash
npm run db:sql
```

3. 아래 파일이 갱신되면 함께 커밋합니다.

```txt
supabase/latest-data-sync.sql
```

## 로컬 확인

SQL 파일이 최신인지 확인합니다.

```bash
npm run db:check
```

앱 빌드도 확인합니다.

```bash
npm run build
```

## DB 반영

GitHub 저장소에서 `Actions` -> `Sync Supabase Data` -> `Run workflow`를 누르면
`supabase/latest-data-sync.sql`이 Supabase DB에 적용됩니다.

## 필요한 GitHub Secret

GitHub repository `Settings` -> `Secrets and variables` -> `Actions`에 아래 값을 추가합니다.

```txt
SUPABASE_DB_URL
```

값은 Supabase의 Postgres connection string입니다. 이 값은 비밀 정보이므로 코드나 채팅에 올리지 않습니다.

## 안전장치

- GitHub Actions는 수동 실행만 지원합니다.
- 한 번에 하나만 실행되도록 `concurrency`를 설정했습니다.
- SQL 실행 중 오류가 나면 즉시 중단됩니다.
- `latest-data-sync.sql`은 이 파일에 포함된 메뉴 id의 재료/연결만 교체합니다.
