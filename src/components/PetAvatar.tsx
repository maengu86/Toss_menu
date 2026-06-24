type PetAvatarProps = {
  outfit?: string
  background?: string
  accessory?: string
}

function PetAvatar({
  outfit = '기본 앞치마',
  background = '햇살 주방',
  accessory = '장바구니',
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

  return (
    <div className={`pet-stage pet-dress-stage ${stageClass}`}>
      <svg className="pet-svg dress-pet soft-pet" viewBox="0 0 260 260" role="img" aria-label="먹보 펫">
        <defs>
          <linearGradient id="mukboBody" x1="70" x2="190" y1="42" y2="218" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fffdf5" />
            <stop offset="0.55" stopColor="#fff0cf" />
            <stop offset="1" stopColor="#ffd79a" />
          </linearGradient>
          <linearGradient id="mukboEar" x1="55" x2="92" y1="76" y2="118" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffe2b5" />
            <stop offset="1" stopColor="#ffba80" />
          </linearGradient>
        </defs>

        <ellipse cx="130" cy="230" rx="66" ry="13" fill="#7b5835" opacity="0.12" />

        <path d="M78 98c-18-20-38-19-49 1 17 0 31 10 43 26z" fill="url(#mukboEar)" stroke="#6f5a45" strokeWidth="5" strokeLinejoin="round" />
        <path d="M182 98c18-20 38-19 49 1-17 0-31 10-43 26z" fill="url(#mukboEar)" stroke="#6f5a45" strokeWidth="5" strokeLinejoin="round" />

        <path
          d="M58 132c0-54 30-91 72-91s72 37 72 91c0 61-28 96-72 96s-72-35-72-96z"
          fill="url(#mukboBody)"
          stroke="#6f5a45"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="M83 163c8 33 25 49 47 49s39-16 47-49c-11 13-27 20-47 20s-36-7-47-20z" fill="#fffaf0" opacity="0.78" />

        <path d="M72 166c-15 7-23 19-21 31 14 3 27-6 34-25z" fill="#ffe0ad" stroke="#6f5a45" strokeWidth="5" strokeLinecap="round" />
        <path d="M188 166c15 7 23 19 21 31-14 3-27-6-34-25z" fill="#ffe0ad" stroke="#6f5a45" strokeWidth="5" strokeLinecap="round" />
        <path d="M104 222c-12 6-11 17 2 20 10-1 17-7 19-17z" fill="#ffd79a" stroke="#6f5a45" strokeWidth="5" strokeLinecap="round" />
        <path d="M156 222c12 6 11 17-2 20-10-1-17-7-19-17z" fill="#ffd79a" stroke="#6f5a45" strokeWidth="5" strokeLinecap="round" />

        <circle cx="101" cy="112" r="8" fill="#3f3a36" />
        <circle cx="159" cy="112" r="8" fill="#3f3a36" />
        <circle cx="98" cy="109" r="2.5" fill="#ffffff" />
        <circle cx="156" cy="109" r="2.5" fill="#ffffff" />
        <ellipse cx="85" cy="133" rx="11" ry="8" fill="#f3a4a0" opacity="0.72" />
        <ellipse cx="175" cy="133" rx="11" ry="8" fill="#f3a4a0" opacity="0.72" />
        <path d="M124 124c4 4 8 4 12 0" fill="none" stroke="#d49836" strokeWidth="5" strokeLinecap="round" />
        <path d="M111 144c12 7 26 7 38 0" fill="none" stroke="#3f3a36" strokeWidth="5" strokeLinecap="round" />

        <path d="M93 168h74l-7 42h-60z" fill="#fff8ed" stroke="#6f5a45" strokeWidth="4" />
        <path d="M103 180h54" stroke="#e6d5bd" strokeWidth="4" strokeLinecap="round" />
        <text x="130" y="198" textAnchor="middle" fill="#7e887f" fontSize="11" fontWeight="900">MUKBO</text>

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
