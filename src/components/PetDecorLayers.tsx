import React from 'react'

void React

type DecorLayerProps = {
  name: string
}

const outline = '#70472f'

export function SudalOutfitLayer({ name }: DecorLayerProps) {
  switch (name) {
    case '체리 멜빵바지':
      return <Overalls color="#b94f43" accent="#fff3de" motif="cherry" />
    case '딸기 잠옷':
      return <Pajamas color="#ef8c8a" accent="#fff5df" motif="strawberry" />
    case '단풍잎 판초':
      return <Poncho color="#c9693f" accent="#f2b34f" />
    case '눈꽃 니트':
      return <Sweater color="#b65f58" accent="#fff6df" />
    case '농부 멜빵':
    case '밀짚 멜빵바지':
      return <Overalls color="#6f9a62" accent="#f5df9a" motif="button" />
    case '비옷+장화':
      return <RainSet />
    case '벚꽃 가디건':
      return <Cardigan color="#e9a6a1" accent="#fff5ec" motif="blossom" />
    case '장미 정원 드레스셔츠':
      return <DressShirt />
    case '리넨 멜빵바지':
      return <Overalls color="#c89a67" accent="#f5e6cb" motif="button" />
    case '호박 잠바':
      return <PumpkinJacket />
    case '눈송이 잠옷':
      return <Pajamas color="#8da7bb" accent="#fffaf0" motif="snow" />
    case '루돌프 코스튬':
      return <ReindeerCostume />
    case '요리사 앞치마 풀세트':
      return <ChefSet />
    case '소믈리에 나비넥타이':
      return <SommelierSet />
    case '줄무늬 뱃사공 셔츠':
      return <SailorShirt />
    case '수영복':
      return <Swimsuit />
    default:
      return null
  }
}

export function SudalAccessoryLayer({ name }: DecorLayerProps) {
  switch (name) {
    case '밀짚모자': return <StrawHat />
    case '밤톨 베레모': return <AcornBeret />
    case '여름용 튜브': return <SwimTube />
    case '단풍잎 부채': return <MapleFan />
    case '호빵 바구니': return <Basket kind="bun" />
    case '눈사람 머그': return <SnowmanMug />
    case '체리 파이 한 조각': return <Dessert kind="pie" />
    case '과일바구니': return <Basket kind="fruit" />
    case '우산': return <Umbrella />
    case '체리 바구니': return <Basket kind="cherry" />
    case '포도송이 모자장식': return <GrapeHatPiece />
    case '호빵 찜통': return <BunSteamer />
    case '딸기 우유팩': return <StrawberryMilk />
    case '케이크 한 조각': return <Dessert kind="cake" />
    case '꽃무늬 에디션': return <FloralEdition />
    case '방울 목걸이': return <BellNecklace />
    case '에코백': return <EcoBag />
    case '나무 도마+빵칼': return <BreadBoard />
    case '털실 뭉치+바늘': return <YarnSet />
    case '벙어리장갑': return <Mittens />
    default: return null
  }
}

function Overalls({ color, accent, motif }: { color: string; accent: string; motif: 'cherry' | 'button' }) {
  return (
    <g stroke={outline} strokeWidth="3" strokeLinejoin="round">
      <path d="M94 158h72l9 94c-25 13-65 13-90 0z" fill={color} />
      <path d="M96 158l-10-26M164 158l10-26" fill="none" strokeWidth="9" strokeLinecap="round" />
      <path d="M106 170h48v42h-48z" fill={accent} />
      <circle cx="104" cy="158" r="5" fill={accent} /><circle cx="156" cy="158" r="5" fill={accent} />
      {motif === 'cherry' ? <><circle cx="126" cy="190" r="6" fill="#c43f3f" /><circle cx="138" cy="190" r="6" fill="#d65345" /><path d="M126 184c3-10 8-11 12-15M138 184c-1-7-4-10-7-12" fill="none" stroke="#55784b" strokeWidth="3" /></> : <path d="M120 189h20" stroke={color} strokeWidth="4" strokeLinecap="round" />}
      <path d="M130 212v44" fill="none" opacity=".45" />
    </g>
  )
}

function Pajamas({ color, accent, motif }: { color: string; accent: string; motif: 'strawberry' | 'snow' }) {
  return (
    <g stroke={outline} strokeWidth="3" strokeLinejoin="round">
      <path d="M82 150c30-17 66-17 96 0l5 105c-30 16-76 16-106 0z" fill={color} />
      <path d="M130 151v106" fill="none" stroke={accent} strokeWidth="3" />
      <path d="M83 154l-17 50 20 8 13-44M177 154l17 50-20 8-13-44" fill={color} strokeLinecap="round" />
      {[176, 204, 232].map((y) => <circle key={y} cx="137" cy={y} r="3" fill={accent} stroke="none" />)}
      {motif === 'strawberry' ? <><path d="M108 183c7-7 17 0 12 10-5 10-13 10-18 0-5-10 1-14 6-10z" fill="#d94f4f" /><path d="M106 181l8-4 5 6" fill="#5e894f" /></> : <path d="M111 181v22M101 192h20M104 184l14 16M118 184l-14 16" stroke={accent} strokeWidth="3" />}
    </g>
  )
}

function Poncho({ color, accent }: { color: string; accent: string }) {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M72 151c34-24 82-24 116 0l17 83-37 17-38-20-38 20-37-17z" fill={color} /><path d="M130 139l18 28-18 12-18-12z" fill={accent} /><path d="M130 183l-8 15 8 15 8-15z" fill={accent} /></g>
}

function Sweater({ color, accent }: { color: string; accent: string }) {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M85 151c28-16 62-16 90 0l4 88c-28 13-70 13-98 0z" fill={color} /><path d="M88 164l-21 45M172 164l21 45" stroke={color} strokeWidth="20" strokeLinecap="round" /><path d="M130 176v42M109 197h42M115 182l30 30M145 182l-30 30" stroke={accent} strokeWidth="5" /><path d="M88 226h84" stroke={accent} strokeWidth="7" /></g>
}

function StrawHat() {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><ellipse cx="130" cy="61" rx="73" ry="18" fill="#e6bf67" /><path d="M92 58c3-37 73-37 76 0z" fill="#efcf7b" /><path d="M94 48c24 9 48 9 72 0" fill="none" stroke="#b96945" strokeWidth="8" /></g>
}

function RainSet() {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M88 145c25-17 59-17 84 0l12 93c-30 15-78 15-108 0z" fill="#e4b845" /><path d="M102 139c10-20 46-20 56 0l-10 27h-36z" fill="#e4b845" /><circle cx="137" cy="184" r="4" fill="#fff2b3" /><circle cx="137" cy="207" r="4" fill="#fff2b3" /><path d="M75 270h43v26H67c-3-12 0-21 8-26zM185 270h-43v26h51c3-12 0-21-8-26z" fill="#c56c43" /></g>
}

function Cardigan({ color, accent, motif }: { color: string; accent: string; motif: 'blossom' }) {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M87 151c27-14 59-14 86 0l4 85c-27 12-67 12-94 0z" fill={color} /><path d="M109 151l21 28 21-28v89h-42z" fill={accent} /><path d="M101 171l-27 42M159 171l27 42" stroke={color} strokeWidth="17" strokeLinecap="round" />{motif === 'blossom' && <g fill="#fff1ec" stroke="none"><circle cx="96" cy="193" r="5"/><circle cx="91" cy="188" r="5"/><circle cx="101" cy="188" r="5"/><circle cx="164" cy="214" r="5"/><circle cx="159" cy="209" r="5"/><circle cx="169" cy="209" r="5"/></g>}</g>
}

function DressShirt() {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M89 151c25-14 57-14 82 0l5 89c-28 13-64 13-92 0z" fill="#fff7e9" /><path d="M108 151l22 28 22-28M130 178v62" fill="none" /><path d="M95 175l-22 40M165 175l22 40" stroke="#fff7e9" strokeWidth="17" strokeLinecap="round" /><path d="M114 186c7-8 14-8 16 2 2-10 9-10 16-2-8 16-24 16-32 0z" fill="#b95158" /></g>
}

function PumpkinJacket() {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M83 153c29-19 65-19 94 0l4 89c-30 14-72 14-102 0z" fill="#d87835" /><path d="M130 151v96M101 164c-8 29-8 54 0 78M159 164c8 29 8 54 0 78" fill="none" stroke="#efab4d" strokeWidth="5" /><path d="M113 190l17 11 17-11-5 24h-24z" fill="#77452e" /><path d="M119 151l11-14 11 14" fill="#668448" /></g>
}

function ReindeerCostume() {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M84 151c28-18 64-18 92 0l6 94c-30 14-74 14-104 0z" fill="#9c6847" /><path d="M103 153l27 28 27-28" fill="#f0dfc6" /><path d="M88 72c-18-12-22-31-14-43M82 45L65 35M84 52l13-14M172 72c18-12 22-31 14-43M178 45l17-10M176 52l-13-14" fill="none" stroke="#7a4c2f" strokeWidth="7" strokeLinecap="round" /><circle cx="130" cy="112" r="10" fill="#c9483f" stroke="#8f342f" /></g>
}

function ChefSet() {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M89 154c25-15 57-15 82 0l3 94c-27 12-61 12-88 0z" fill="#fffaf0" /><path d="M130 157v92" fill="none" /><circle cx="119" cy="181" r="4" fill="#c65f4a" /><circle cx="141" cy="181" r="4" fill="#c65f4a" /><path d="M92 58c-12-20 8-35 24-24 6-25 39-25 45-1 18-9 34 12 19 28l-7 14H90z" fill="#fffaf0" /><path d="M100 72h60" /></g>
}

function SommelierSet() {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M97 154h66l8 85c-25 11-57 11-82 0z" fill="#fff8eb" /><path d="M109 151l21 26 21-26" fill="#6f3b35" /><path d="M130 162c-18-16-30-4-18 10 8 9 18 4 18-10 0 14 10 19 18 10 12-14 0-26-18-10z" fill="#8b3e43" /><path d="M143 192c21 1 21 35 0 36-21-1-21-35 0-36zM143 228v16M130 244h26" fill="none" stroke="#a96c55" /></g>
}

function SailorShirt() {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M88 151c27-15 57-15 84 0l5 91c-29 13-65 13-94 0z" fill="#fff8e9" /><path d="M104 151l26 31 26-31" fill="#4f7081" /><path d="M88 180h84M86 202h88M84 224h92" stroke="#678b9b" strokeWidth="8" /><path d="M107 151h46" stroke="#fff8e9" strokeWidth="5" /></g>
}

function Swimsuit() {
  return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M94 171c22-10 50-10 72 0l9 78c-27 12-63 12-90 0z" fill="#d85f50" /><path d="M99 178c13 16 49 16 62 0M91 217h78" fill="none" stroke="#ffe6a5" strokeWidth="7" /><circle cx="112" cy="198" r="4" fill="#ffe6a5" stroke="none" /><circle cx="147" cy="231" r="4" fill="#ffe6a5" stroke="none" /></g>
}

function AcornBeret() { return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M83 58c12-40 82-43 96 0-22 13-74 13-96 0z" fill="#8c5839" /><path d="M105 30c16 8 34 8 50 0" fill="none" stroke="#bf8b51" strokeWidth="8" /><path d="M132 22l8-12" strokeLinecap="round" /></g> }
function SwimTube() { return <g stroke={outline} strokeWidth="4"><ellipse cx="130" cy="220" rx="77" ry="37" fill="#f2b745" /><ellipse cx="130" cy="220" rx="42" ry="16" fill="none" /><path d="M70 201l23 15M166 218l24 17" stroke="#fff1b8" strokeWidth="9" /></g> }
function MapleFan() { return <g transform="translate(184 173) rotate(12)" stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M22 4l8 15 15-8-5 18 17 3-16 12 10 13-21-4-8 20-8-20-21 4 10-13-16-12 17-3-5-18 15 8z" fill="#cf633d" /><path d="M22 53v44" strokeWidth="7" strokeLinecap="round" /></g> }

function Basket({ kind }: { kind: 'bun' | 'fruit' | 'cherry' }) {
  return <g transform="translate(183 193)" stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M4 21h67l-8 48H12z" fill="#c99055" /><path d="M17 23c0-28 42-28 42 0" fill="none" strokeWidth="5" />{kind === 'bun' ? <><circle cx="25" cy="25" r="13" fill="#f3dbc0" /><circle cx="49" cy="25" r="13" fill="#f6dfc3" /><path d="M20 25h10M44 25h10" /></> : kind === 'cherry' ? <><circle cx="24" cy="28" r="9" fill="#cc4748" /><circle cx="44" cy="24" r="9" fill="#d7564e" /><circle cx="57" cy="34" r="9" fill="#bf3d42" /><path d="M25 19c6-11 15-12 20-13M45 15c4-8 10-10 16-9" fill="none" stroke="#63824e" /></> : <><circle cx="22" cy="29" r="10" fill="#e88b45" /><circle cx="42" cy="24" r="10" fill="#d5554b" /><circle cx="58" cy="34" r="10" fill="#8c6a9d" /><path d="M16 18l7-8 6 9" fill="#65864c" /></>}</g>
}

function SnowmanMug() { return <g transform="translate(190 180)" stroke={outline} strokeWidth="3"><path d="M2 5h45v54H2z" fill="#f7f5eb" /><path d="M47 17h8c18 0 18 29 0 29h-8" fill="none" strokeWidth="6" /><circle cx="18" cy="25" r="3" /><circle cx="31" cy="25" r="3" /><path d="M20 37c6 5 10 5 16 0" fill="none" /><path d="M8 8c12-8 24-8 36 0" stroke="#b9544d" strokeWidth="7" /></g> }
function Dessert({ kind }: { kind: 'pie' | 'cake' }) { return <g transform="translate(186 204)" stroke={outline} strokeWidth="3" strokeLinejoin="round">{kind === 'pie' ? <><path d="M2 39l64-23-15 47H11z" fill="#d9a15d" /><path d="M12 36l47-17" stroke="#f4d18d" strokeWidth="9" /><circle cx="36" cy="31" r="5" fill="#bf4650" /></> : <><path d="M4 22h58v43H4z" fill="#f1b7ac" /><path d="M4 22l28-17 30 17z" fill="#fff4df" /><path d="M9 39h49" stroke="#fff4df" strokeWidth="7" /><circle cx="34" cy="9" r="6" fill="#c94548" /></>}</g> }
function Umbrella() { return <g transform="translate(176 139)" stroke={outline} strokeWidth="4" strokeLinejoin="round"><path d="M3 49c8-53 72-53 80 0-13-7-27-7-40 0-13-7-27-7-40 0z" fill="#e8927f" /><path d="M43 49v96c0 19 24 19 24 2" fill="none" strokeWidth="7" strokeLinecap="round" /><path d="M43 3v-13" strokeWidth="6" /></g> }
function GrapeHatPiece() { return <g transform="translate(169 43)" stroke={outline} strokeWidth="2"><path d="M18 8c9-14 21-14 31-5-8 10-18 12-31 5z" fill="#638953" /><path d="M20 9c-11 10-10 21 2 25" fill="none" stroke="#638953" strokeWidth="5" />{[[14,27],[28,28],[42,28],[21,41],[35,42],[28,55]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="9" fill="#79618d" />)}</g> }
function BunSteamer() { return <g transform="translate(181 193)" stroke={outline} strokeWidth="3"><ellipse cx="35" cy="18" rx="35" ry="14" fill="#c88d50" /><path d="M0 18v47c8 14 62 14 70 0V18" fill="#d6a15e" /><path d="M6 41h58" /><ellipse cx="35" cy="18" rx="21" ry="8" fill="#f4dfc5" /><path d="M35 10v16" /></g> }
function StrawberryMilk() { return <g transform="translate(190 187)" stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M4 12l12-12h34l12 12v62H4z" fill="#f3a6a3" /><path d="M16 0l10 14h36M26 14v60" fill="none" /><path d="M34 37c8-9 20 0 13 11-7 11-17 11-23 0-6-11 2-16 10-11z" fill="#d84e52" /><path d="M31 35l8-7 8 8" fill="#668b51" /></g> }
function FloralEdition() { return <g fill="#f1a6a0" stroke={outline} strokeWidth="2">{[[77,78],[98,62],[126,57],[154,62],[178,79]].map(([x,y])=><g key={`${x}-${y}`} transform={`translate(${x} ${y})`}><circle cx="0" cy="-6" r="7"/><circle cx="6" cy="0" r="7"/><circle cx="0" cy="6" r="7"/><circle cx="-6" cy="0" r="7"/><circle r="4" fill="#f5d270"/></g>)}</g> }
function BellNecklace() { return <g stroke={outline} strokeWidth="3"><path d="M88 133c25 25 59 25 84 0" fill="none" stroke="#b9554b" strokeWidth="8" /><path d="M117 150c2-18 24-18 26 0l-4 20h-18z" fill="#e5b84e" /><circle cx="130" cy="168" r="4" fill={outline} /></g> }
function EcoBag() { return <g transform="translate(31 173)" stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M9 17c0-27 43-27 43 0" fill="none" strokeWidth="6" /><path d="M0 16h62l-5 66H5z" fill="#d9cda8" /><path d="M20 42c7 7 15 7 22 0" fill="none" stroke="#6f8b56" strokeWidth="5" /><path d="M31 50v17" stroke="#6f8b56" /></g> }
function BreadBoard() { return <g transform="translate(180 192)" stroke={outline} strokeWidth="3" strokeLinejoin="round"><rect x="0" y="12" width="69" height="58" rx="10" fill="#c88c54" /><path d="M54 11l22-21" stroke="#aeb7b4" strokeWidth="8" strokeLinecap="round" /><path d="M69-3l10-10" stroke={outline} strokeWidth="5" /><path d="M15 45h38" stroke="#f0c784" strokeWidth="7" strokeLinecap="round" /></g> }
function YarnSet() { return <g transform="translate(184 205)" stroke={outline} strokeWidth="3"><circle cx="32" cy="35" r="29" fill="#c87972" /><path d="M12 23c16 4 32 14 43 29M9 42c18-6 33-7 49-1M22 9c7 18 15 34 27 51" fill="none" stroke="#f1b5aa" /><path d="M48 5l25 61M59 3l18 60" stroke="#9aa4a5" strokeWidth="4" strokeLinecap="round" /></g> }
function Mittens() { return <g stroke={outline} strokeWidth="3" strokeLinejoin="round"><path d="M49 199c-6-20 4-37 17-34 8 2 9 12 5 20 12-8 22 2 16 13-8 15-28 19-38 1zM211 199c6-20-4-37-17-34-8 2-9 12-5 20-12-8-22 2-16 13 8 15 28 19 38 1z" fill="#b8615b" /><path d="M55 204l9 16M205 204l-9 16" stroke="#fff0dc" strokeWidth="7" /></g> }
