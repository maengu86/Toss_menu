import sudalMain from './sudal/sudal_main.png'
import { getSudalAccessoryWornImage, getSudalOutfitWornImage } from '../data/sudalDecorImages'

type PetAvatarProps = {
  outfit?: string
  background?: string
  accessory?: string
  body?: 'default' | 'sudal'
}

function PetAvatar({
  outfit = '체리 멜빵바지',
  background = '아늑한 집안',
  accessory = '체리 머리핀',
  body = 'default',
}: PetAvatarProps) {
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
    const outfitImage = getSudalOutfitWornImage(outfit)
    const accessoryImage = getSudalAccessoryWornImage(accessory)
    const outfitFrame = getOutfitFrame(outfit)
    const accessoryFrame = getAccessoryFrame(accessory)

    return (
      <div className={`pet-stage pet-dress-stage ${stageClass}`}>
        <svg className="pet-svg dress-pet sudal-pet" viewBox="0 0 260 340" role="img" aria-label="먹보 수달 펫">
          <image href={sudalMain} x="18" y="5" width="224" height="324" preserveAspectRatio="xMidYMid meet" />
          {outfitImage && (
            <image
              href={outfitImage}
              x={outfitFrame.x}
              y={outfitFrame.y}
              width={outfitFrame.width}
              height={outfitFrame.height}
              preserveAspectRatio="xMidYMid meet"
            />
          )}
          {accessoryImage && (
            <image
              href={accessoryImage}
              x={accessoryFrame.x}
              y={accessoryFrame.y}
              width={accessoryFrame.width}
              height={accessoryFrame.height}
              preserveAspectRatio="xMidYMid meet"
            />
          )}
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

      </svg>
    </div>
  )
}

export default PetAvatar

function getOutfitFrame(name: string) {
  if (name.includes('딸기 잠옷')) {
    return { x: 0, y: 8, width: 260, height: 332 }
  }
  if (name.includes('농부 멜빵') || name.includes('밀짚 멜빵바지')) {
    return { x: 0, y: 0, width: 260, height: 340 }
  }
  return { x: 34, y: 92, width: 192, height: 170 }
}

function getAccessoryFrame(name: string) {
  if (name.includes('수박 주스')) {
    return { x: 0, y: 0, width: 260, height: 340 }
  }
  if (name.includes('딸기 우유팩')) {
    return { x: 15, y: 30, width: 195, height: 255 }
  }
  if (name.includes('목걸이')) {
    return { x: 6, y: 88, width: 248, height: 104 }
  }
  if (name.includes('밀짚모자')) {
    return { x: 46, y: 0, width: 168, height: 220 }
  }
  if (name.includes('안경') || name.includes('선글라스')) {
    return { x: 44, y: 46, width: 176, height: 86 }
  }
  if (name.includes('머리핀') || name.includes('베레모') || name.includes('모자') || name.includes('버킷햇') || name.includes('털모자') || name.includes('꽃')) {
    return { x: 58, y: 10, width: 144, height: 104 }
  }
  if (name.includes('가방') || name.includes('바구니') || name.includes('보틀') || name.includes('주스') || name.includes('머그') || name.includes('스푼') || name.includes('팬')) {
    return { x: 30, y: 128, width: 200, height: 126 }
  }
  return { x: 46, y: 54, width: 168, height: 104 }
}
