type PetAvatarProps = {
  mood?: 'idle' | 'happy'
  outfit?: string
  background?: string
  accessory?: string
}

function PetAvatar({
  mood = 'idle',
  outfit = '기본 앞치마',
  background = '햇살 주방',
  accessory = '장바구니',
}: PetAvatarProps) {
  const isHappy = mood === 'happy'
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

  return (
    <div className={`pet-stage pet-dress-stage ${stageClass} ${isHappy ? 'is-eating' : ''}`}>
      <svg className={`pet-svg dress-pet soft-pet ${isHappy ? 'is-eating' : ''}`} viewBox="0 0 260 260" role="img" aria-label="먹보 펫">
        <defs>
          <linearGradient id="petHead" x1="68" x2="192" y1="36" y2="155" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff9e9" />
            <stop offset="1" stopColor="#ffd987" />
          </linearGradient>
          <linearGradient id="petBody" x1="78" x2="182" y1="134" y2="225" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff4dc" />
            <stop offset="1" stopColor="#ffc86e" />
          </linearGradient>
        </defs>

        <ellipse cx="130" cy="229" rx="65" ry="14" fill="#7b5835" opacity="0.13" />
        <circle cx="62" cy="58" r="8" fill="#ffffff" opacity="0.6" />
        <circle cx="205" cy="54" r="6" fill="#ffffff" opacity="0.55" />

        <path d="M84 82c-21-19-34-19-43-5 18 2 30 12 39 30z" fill="#ffe0a2" stroke="#8b6038" strokeWidth="5" />
        <path d="M176 82c21-19 34-19 43-5-18 2-30 12-39 30z" fill="#ffe0a2" stroke="#8b6038" strokeWidth="5" />
        <path d="M104 49c8-18 22-23 36-10-14 4-22 13-25 28z" fill="#8fdc80" />
        <path d="M156 49c-8-18-22-23-36-10 14 4 22 13 25 28z" fill="#75c963" />

        <path
          d="M62 104c0-39 30-68 68-68s68 29 68 68c0 43-27 73-68 73s-68-30-68-73z"
          fill="url(#petHead)"
          stroke="#8b6038"
          strokeWidth="6"
        />
        <path
          d="M80 168c0-33 20-54 50-54s50 21 50 54v12c0 33-20 54-50 54s-50-21-50-54z"
          fill="url(#petBody)"
          stroke="#8b6038"
          strokeWidth="6"
        />
        <ellipse cx="130" cy="184" rx="34" ry="40" fill="#fffdf2" opacity="0.9" />

        <path d="M84 170c-22 8-31 21-26 36 16 2 29-8 37-28z" fill="#ffe0a2" stroke="#8b6038" strokeWidth="5" />
        <path d="M176 170c22 8 31 21 26 36-16 2-29-8-37-28z" fill="#ffe0a2" stroke="#8b6038" strokeWidth="5" />
        <path d="M100 225c-10 8-8 17 5 19 9-2 15-8 16-17z" fill="#ffd789" stroke="#8b6038" strokeWidth="5" />
        <path d="M160 225c10 8 8 17-5 19-9-2-15-8-16-17z" fill="#ffd789" stroke="#8b6038" strokeWidth="5" />

        <circle cx="104" cy="104" r="10" fill="#29384a" />
        <circle cx="156" cy="104" r="10" fill="#29384a" />
        <circle cx="101" cy="100" r="3" fill="#ffffff" />
        <circle cx="153" cy="100" r="3" fill="#ffffff" />
        <circle cx="88" cy="123" r="12" fill="#f29aa0" opacity="0.74" />
        <circle cx="172" cy="123" r="12" fill="#f29aa0" opacity="0.74" />
        <path d="M124 116c4 4 8 4 12 0" fill="none" stroke="#d7a131" strokeWidth="5" strokeLinecap="round" />
        <path d={isHappy ? 'M106 135c15 15 33 15 48 0' : 'M112 138c11 7 25 7 36 0'} fill="none" stroke="#29384a" strokeWidth="5" strokeLinecap="round" />
        {isHappy && (
          <g className="munch-bites">
            <circle cx="94" cy="141" r="5" fill="#ff8a58" />
            <circle cx="166" cy="142" r="4" fill="#75b84f" />
            <path d="M126 129c4 3 8 3 12 0" stroke="#ff8a58" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {hasGlasses && (
          <g>
            <rect x="86" y="95" width="34" height="20" rx="10" fill="#29384a" />
            <rect x="140" y="95" width="34" height="20" rx="10" fill="#29384a" />
            <path d="M120 105h20" stroke="#29384a" strokeWidth="5" />
            <path d="M92 101h22M146 101h22" stroke="#ffcf57" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        <path d="M91 168h78l-8 42H99z" fill="#fff9ec" stroke="#8b6038" strokeWidth="4" />
        <text x="130" y="192" textAnchor="middle" fill="#7e887f" fontSize="12" fontWeight="900">MUKBO</text>

        {hasScarf && (
          <>
            <path d="M84 150c28 12 64 12 92 0l4 16c-35 13-65 13-100 0z" fill="#ef6b55" />
            <path d="M155 162l28 28" stroke="#ef6b55" strokeWidth="10" strokeLinecap="round" />
          </>
        )}
        {hasChefCoat && (
          <>
            <path d="M94 166h72v46H94z" fill="#ffffff" opacity="0.8" />
            <path d="M130 168v40" stroke="#d7e0e7" strokeWidth="4" />
            <circle cx="120" cy="181" r="3" fill="#5b6f82" />
            <circle cx="140" cy="181" r="3" fill="#5b6f82" />
          </>
        )}
        {hasPoncho && <path d="M76 160c24-17 84-17 108 0l-13 52H89z" fill="#8fc6f4" opacity="0.76" stroke="#5b8ab8" strokeWidth="4" />}
        {hasWatermelonHat && (
          <>
            <path d="M78 75c20-24 84-24 104 0-25 15-79 15-104 0z" fill="#6fc66d" stroke="#397c40" strokeWidth="4" />
            <path d="M95 75c22 8 48 8 70 0" stroke="#f35f62" strokeWidth="8" strokeLinecap="round" />
          </>
        )}
        {hasPin && (
          <g transform="translate(166 60)">
            <path d="M10 0c7 5 9 13 2 21C5 13 3 5 10 0z" fill="#ef5a63" />
            <path d="M11 2c-7 5-9 13-2 21 7-8 9-16 2-21z" fill="#f06b7d" />
            <path d="M8 0h6" stroke="#75b84f" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {hasMug && (
          <g transform="translate(190 160)">
            <path d="M0 10c0-7 5-12 12-12h18c7 0 12 5 12 12v30c0 7-5 12-12 12H12C5 52 0 47 0 40z" fill="#e4544f" stroke="#9e3735" strokeWidth="4" />
            <path d="M42 14h5c8 0 12 6 12 13s-4 13-12 13h-5" fill="none" stroke="#9e3735" strokeWidth="5" />
            <path d="M16 22c8-10 20-4 20 6 0 9-10 15-20 23C6 43-4 37-4 28c0-10 12-16 20-6z" fill="#fff7df" transform="scale(.7)" />
          </g>
        )}
        {hasBag && (
          <g transform="translate(35 169)">
            <path d="M8 10c0-8 7-14 15-14s15 6 15 14" fill="none" stroke="#5b6f82" strokeWidth="4" />
            <rect x="2" y="10" width="42" height="42" rx="14" fill="#ffb25f" stroke="#8b6038" strokeWidth="4" />
            <circle cx="23" cy="31" r="12" fill="#29384a" />
            <path d="M17 37c4 4 8 4 12 0" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
        {hasSpoon && (
          <g transform="translate(192 158) rotate(-18)">
            <ellipse cx="12" cy="10" rx="8" ry="12" fill="#d9e1e8" stroke="#8b9aa7" strokeWidth="3" />
            <path d="M12 22v44" stroke="#8b9aa7" strokeWidth="6" strokeLinecap="round" />
          </g>
        )}
        {hasFan && (
          <g transform="translate(188 164)">
            <circle cx="24" cy="24" r="20" fill="#d7f0ff" stroke="#68a8cb" strokeWidth="4" />
            <path d="M24 24l-13-8M24 24l13-8M24 24v15" stroke="#68a8cb" strokeWidth="4" strokeLinecap="round" />
            <rect x="18" y="43" width="12" height="22" rx="6" fill="#68a8cb" />
          </g>
        )}
        {hasJuice && (
          <g transform="translate(188 158)">
            <path d="M9 4h36l-5 54H14z" fill="#ff6f63" stroke="#9e3735" strokeWidth="4" />
            <path d="M15 18h24" stroke="#fff7df" strokeWidth="5" strokeLinecap="round" opacity="0.82" />
            <path d="M31 3l9-17" stroke="#75b84f" strokeWidth="5" strokeLinecap="round" />
            <circle cx="28" cy="36" r="4" fill="#29384a" opacity="0.5" />
          </g>
        )}
        {hasSweetPotato && (
          <g transform="translate(187 169)">
            <path d="M5 28c8-22 42-27 55-8 8 13-5 30-27 31C14 52 0 42 5 28z" fill="#9b5a37" stroke="#6e3f2b" strokeWidth="4" />
            <path d="M19 29c8-7 19-9 30-6" stroke="#f5c06b" strokeWidth="5" strokeLinecap="round" />
            <path d="M12 43c11 5 28 5 42-4" stroke="#f2d08a" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
        {hasMandarin && (
          <g transform="translate(184 166)">
            <path d="M6 23h54l-7 34H13z" fill="#d59a4c" stroke="#8b6038" strokeWidth="4" />
            <path d="M15 23c0-10 8-17 18-17s18 7 18 17" fill="none" stroke="#8b6038" strokeWidth="4" />
            <circle cx="22" cy="29" r="9" fill="#f2a13b" />
            <circle cx="38" cy="28" r="9" fill="#ffb25f" />
            <circle cx="32" cy="39" r="9" fill="#f2a13b" />
          </g>
        )}
      </svg>
    </div>
  )
}

export default PetAvatar
