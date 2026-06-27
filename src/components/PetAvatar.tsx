import sudalMain from './sudal/sudal_main.png'

type PetAvatarProps = {
  outfit?: string
  background?: string
  accessory?: string
  body?: 'default' | 'sudal'
}

function PetAvatar({
  outfit = '기본 앞치마',
  background = '햇살 주방',
  accessory = '장바구니',
  body = 'default',
}: PetAvatarProps) {
  const hasWatermelonHat = outfit.includes('수박')
  const hasScarf = outfit.includes('목도리')
  const hasChefCoat = outfit.includes('셰프')
  const hasPoncho = outfit.includes('판초')
  const hasMug = accessory.includes('머그')
  const hasBag = accessory.includes('장바구니')
  const hasPin = accessory.includes('딸기')
  const hasGlasses = accessory.includes('선글라스')
  const hasSpoon = accessory.includes('숟가락')
  const hasFan = accessory.includes('선풍기')
  const hasJuice = accessory.includes('주스')
  const hasSweetPotato = accessory.includes('군고구마')
  const hasMandarin = accessory.includes('귤')
  const stageClass = background.includes('피크닉')
    ? 'picnic'
    : background.includes('초록')
      ? 'garden'
      : background.includes('봄꽃')
        ? 'spring'
        : background.includes('바닷가') || background.includes('여름')
          ? 'summer'
          : background.includes('낙엽') || background.includes('가을')
            ? 'autumn'
            : background.includes('눈꽃') || background.includes('겨울')
              ? 'winter'
              : background.includes('야시장')
                ? 'night'
                : background.includes('구름')
                  ? 'cloud'
                  : ''

  if (body === 'sudal') {
    return (
      <div className={`pet-stage pet-dress-stage ${stageClass}`}>
        <svg className="pet-svg dress-pet sudal-pet" viewBox="0 0 260 340" role="img" aria-label="먹보 수달 펫">
          <image href={sudalMain} x="18" y="5" width="224" height="324" preserveAspectRatio="xMidYMid meet" />

          {hasScarf && (
            <>
              <path d="M75 117c34 14 76 14 110 0l2 17c-42 15-72 15-114 0z" fill="#ef6b55" />
              <path d="M159 130l25 36" stroke="#ef6b55" strokeWidth="10" strokeLinecap="round" />
            </>
          )}
          {hasChefCoat && (
            <>
              <path d="M91 166c22-12 56-12 78 0l-4 82H95z" fill="#ffffff" opacity="0.9" stroke="#d7e0e7" strokeWidth="3" />
              <path d="M130 168v74" stroke="#d7e0e7" strokeWidth="4" />
              <circle cx="118" cy="188" r="3" fill="#5b6f82" />
              <circle cx="142" cy="188" r="3" fill="#5b6f82" />
            </>
          )}
          {hasPoncho && <path d="M67 151c30-18 96-18 126 0l-15 102H82z" fill="#8fc6f4" opacity="0.8" stroke="#5b8ab8" strokeWidth="4" />}
          {hasWatermelonHat && (
            <>
              <path d="M67 55c28-26 98-26 126 0-30 17-96 17-126 0z" fill="#6fc66d" stroke="#397c40" strokeWidth="4" />
              <path d="M88 55c28 9 56 9 84 0" stroke="#f35f62" strokeWidth="9" strokeLinecap="round" />
            </>
          )}
          {hasPin && (
            <g transform="translate(177 58)">
              <path d="M10 0c7 5 9 13 2 21C5 13 3 5 10 0z" fill="#ef5a63" />
              <path d="M8 0h6" stroke="#75b84f" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
          {hasGlasses && (
            <g transform="translate(0 -25)">
              <rect x="82" y="103" width="38" height="21" rx="10" fill="#3f4652" opacity="0.9" />
              <rect x="140" y="103" width="38" height="21" rx="10" fill="#3f4652" opacity="0.9" />
              <path d="M120 113h20" stroke="#3f4652" strokeWidth="5" />
            </g>
          )}

          {hasMug && <AccessoryMug />}
          {hasBag && <AccessoryBag />}
          {hasSpoon && <AccessorySpoon />}
          {hasFan && <AccessoryFan />}
          {hasJuice && <AccessoryJuice />}
          {hasSweetPotato && <AccessorySweetPotato />}
          {hasMandarin && <AccessoryMandarin />}
        </svg>
      </div>
    )
  }

  return (
    <div className={`pet-stage pet-dress-stage ${stageClass}`}>
      <svg className="pet-svg dress-pet soft-pet" viewBox="0 0 260 260" role="img" aria-label="먹보 펫">
        <defs>
          {/* Character palette: 시안 3번 기준입니다. stopColor만 바꾸면 몸 전체 톤을 쉽게 조정할 수 있습니다. */}
          <linearGradient id="mukboBody" x1="70" x2="190" y1="42" y2="218" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff3ec" />
            <stop offset="0.55" stopColor="#f7d7c4" />
            <stop offset="1" stopColor="#eec2ad" />
          </linearGradient>
          <linearGradient id="mukboEar" x1="55" x2="92" y1="40" y2="132" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffd8ca" />
            <stop offset="1" stopColor="#f27f5b" />
          </linearGradient>
        </defs>

        <ellipse cx="130" cy="230" rx="66" ry="13" fill="#7b5835" opacity="0.12" />

        {/* Z-order guide: SVG는 아래 코드가 먼저 뒤에 깔립니다. 몸통/팔을 먼저 그리고 얼굴을 나중에 그려 얼굴이 가려지지 않게 합니다. */}
        {/* Body: 3등신 비율의 몸통입니다. d 경로의 숫자를 바꾸면 키, 몸통 폭, 다리 길이를 수정할 수 있습니다. */}
        <path
          d="M78 135c6-36 28-56 52-56s46 20 52 56l12 82H66z"
          fill="url(#mukboBody)"
          stroke="#6f5a45"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="M88 155h84l-10 52h-64z" fill="#fff8f5" opacity="0.9" />
        <text x="130" y="190" textAnchor="middle" fill="#7e887f" fontSize="11" fontWeight="900">MUKBO</text>

        {/* Arms/feet: 얼굴보다 뒤쪽에 있어야 해서 머리보다 먼저 렌더링합니다. */}
        <path d="M82 158c-24 9-34 25-27 42 18 0 31-12 40-33z" fill="url(#mukboEar)" stroke="#6f5a45" strokeWidth="5" strokeLinecap="round" />
        <path d="M178 158c24 9 34 25 27 42-18 0-31-12-40-33z" fill="url(#mukboEar)" stroke="#6f5a45" strokeWidth="5" strokeLinecap="round" />
        <path d="M96 218c-13 6-13 18 2 22 11 0 18-6 21-17z" fill="#f27f5b" stroke="#6f5a45" strokeWidth="5" strokeLinecap="round" />
        <path d="M164 218c13 6 13 18-2 22-11 0-18-6-21-17z" fill="#f27f5b" stroke="#6f5a45" strokeWidth="5" strokeLinecap="round" />

        {/* Ears/head: 시안 3번의 물방울 귀입니다. 귀 모양은 M/C 좌표를 조절해서 바꿀 수 있습니다. */}
        <path d="M78 91c-31-18-40-48-22-69 28 10 40 35 34 68z" fill="url(#mukboEar)" stroke="#6f5a45" strokeWidth="5" strokeLinejoin="round" />
        <path d="M182 91c31-18 40-48 22-69-28 10-40 35-34 68z" fill="url(#mukboEar)" stroke="#6f5a45" strokeWidth="5" strokeLinejoin="round" />
        <path
          d="M58 95c0-43 32-72 72-72s72 29 72 72c0 45-30 74-72 74s-72-29-72-74z"
          fill="url(#mukboBody)"
          stroke="#6f5a45"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="M86 120c16 18 72 18 88 0 3 25-16 42-44 42s-47-17-44-42z" fill="#ffffff" opacity="0.36" />

        {/* Face: 눈(cx/cy), 볼(ellipse), 입(path)을 바꾸면 표정을 수정할 수 있습니다. */}
        <circle cx="103" cy="89" r="8" fill="#3f3a36" />
        <circle cx="157" cy="89" r="8" fill="#3f3a36" />
        <circle cx="100" cy="86" r="2.5" fill="#ffffff" />
        <circle cx="154" cy="86" r="2.5" fill="#ffffff" />
        <ellipse cx="87" cy="111" rx="11" ry="8" fill="#f27f5b" opacity="0.22" />
        <ellipse cx="173" cy="111" rx="11" ry="8" fill="#f27f5b" opacity="0.22" />
        <path d="M124 103c4 4 8 4 12 0" fill="none" stroke="#b884a2" strokeWidth="5" strokeLinecap="round" />
        <path d="M113 124c11 8 23 8 34 0" fill="none" stroke="#3f3a36" strokeWidth="5" strokeLinecap="round" />

        {hasScarf && (
          <>
            <path d="M82 151c30 12 66 12 96 0l3 15c-37 13-65 13-102 0z" fill="#ef6b55" />
            <path d="M155 162l25 28" stroke="#ef6b55" strokeWidth="9" strokeLinecap="round" />
          </>
        )}
        {hasChefCoat && (
          <>
            <path d="M96 168h68v42H96z" fill="#ffffff" opacity="0.82" />
            <path d="M130 170v36" stroke="#d7e0e7" strokeWidth="4" />
            <circle cx="119" cy="183" r="3" fill="#5b6f82" />
            <circle cx="141" cy="183" r="3" fill="#5b6f82" />
          </>
        )}
        {hasPoncho && <path d="M76 160c24-15 84-15 108 0l-13 52H89z" fill="#8fc6f4" opacity="0.76" stroke="#5b8ab8" strokeWidth="4" />}
        {hasWatermelonHat && (
          <>
            <path d="M81 72c22-21 76-21 98 0-23 14-75 14-98 0z" fill="#6fc66d" stroke="#397c40" strokeWidth="4" />
            <path d="M98 72c20 7 44 7 64 0" stroke="#f35f62" strokeWidth="8" strokeLinecap="round" />
          </>
        )}
        {hasPin && (
          <g transform="translate(166 66)">
            <path d="M10 0c7 5 9 13 2 21C5 13 3 5 10 0z" fill="#ef5a63" />
            <path d="M8 0h6" stroke="#75b84f" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
        {hasGlasses && (
          <g>
            <rect x="86" y="103" width="32" height="18" rx="9" fill="#3f4652" />
            <rect x="142" y="103" width="32" height="18" rx="9" fill="#3f4652" />
            <path d="M118 112h24" stroke="#3f4652" strokeWidth="5" />
          </g>
        )}

        {hasMug && <AccessoryMug />}
        {hasBag && <AccessoryBag />}
        {hasSpoon && <AccessorySpoon />}
        {hasFan && <AccessoryFan />}
        {hasJuice && <AccessoryJuice />}
        {hasSweetPotato && <AccessorySweetPotato />}
        {hasMandarin && <AccessoryMandarin />}
      </svg>
    </div>
  )
}

function AccessoryMug() {
  return (
    <g transform="translate(190 164)">
      <path d="M0 10c0-7 5-12 12-12h18c7 0 12 5 12 12v30c0 7-5 12-12 12H12C5 52 0 47 0 40z" fill="#e4544f" stroke="#9e3735" strokeWidth="4" />
      <path d="M42 14h5c8 0 12 6 12 13s-4 13-12 13h-5" fill="none" stroke="#9e3735" strokeWidth="5" />
    </g>
  )
}

function AccessoryBag() {
  return (
    <g transform="translate(35 173)">
      <path d="M8 10c0-8 7-14 15-14s15 6 15 14" fill="none" stroke="#5b6f82" strokeWidth="4" />
      <rect x="2" y="10" width="42" height="42" rx="12" fill="#ffb25f" stroke="#6f5a45" strokeWidth="4" />
      <path d="M16 32c5 5 10 5 15 0" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

function AccessorySpoon() {
  return (
    <g transform="translate(193 161) rotate(-18)">
      <ellipse cx="12" cy="10" rx="8" ry="12" fill="#d9e1e8" stroke="#8b9aa7" strokeWidth="3" />
      <path d="M12 22v44" stroke="#8b9aa7" strokeWidth="6" strokeLinecap="round" />
    </g>
  )
}

function AccessoryFan() {
  return (
    <g transform="translate(188 166)">
      <circle cx="24" cy="24" r="20" fill="#d7f0ff" stroke="#68a8cb" strokeWidth="4" />
      <path d="M24 24l-13-8M24 24l13-8M24 24v15" stroke="#68a8cb" strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

function AccessoryJuice() {
  return (
    <g transform="translate(190 162)">
      <path d="M9 4h36l-5 54H14z" fill="#ff6f63" stroke="#9e3735" strokeWidth="4" />
      <path d="M15 18h24" stroke="#fff7df" strokeWidth="5" strokeLinecap="round" opacity="0.82" />
      <path d="M31 3l9-17" stroke="#75b84f" strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

function AccessorySweetPotato() {
  return (
    <g transform="translate(187 173)">
      <path d="M5 28c8-22 42-27 55-8 8 13-5 30-27 31C14 52 0 42 5 28z" fill="#9b5a37" stroke="#6e3f2b" strokeWidth="4" />
      <path d="M19 29c8-7 19-9 30-6" stroke="#f5c06b" strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

function AccessoryMandarin() {
  return (
    <g transform="translate(184 170)">
      <path d="M6 23h54l-7 34H13z" fill="#d59a4c" stroke="#6f5a45" strokeWidth="4" />
      <circle cx="22" cy="29" r="9" fill="#f2a13b" />
      <circle cx="38" cy="28" r="9" fill="#ffb25f" />
      <circle cx="32" cy="39" r="9" fill="#f2a13b" />
    </g>
  )
}

export default PetAvatar
