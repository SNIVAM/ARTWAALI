import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Ocean Wave Tray',
    category: 'tray',
    price: 1800,
    age: 8,
    desc: 'Large epoxy tray with ocean-blue & teal waves. Perfect for keys, perfumes, or serving.',
    art: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
<defs>
<linearGradient id="a1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0A3652"/><stop offset="100%" stop-color="#145C7A"/></linearGradient>
<radialGradient id="b1" cx="28%" cy="34%"><stop offset="0%" stop-color="#7FFFD4" stop-opacity=".44"/><stop offset="100%" stop-color="#7FFFD4" stop-opacity="0"/></radialGradient>
<radialGradient id="c1" cx="72%" cy="68%"><stop offset="0%" stop-color="#00BFBF" stop-opacity=".32"/><stop offset="100%" stop-color="#00BFBF" stop-opacity="0"/></radialGradient>
</defs>
<rect width="400" height="300" fill="url(#a1)"/>
<ellipse cx="112" cy="100" rx="200" ry="140" fill="url(#b1)"/>
<ellipse cx="288" cy="200" rx="160" ry="110" fill="url(#c1)"/>
<path d="M-5,128 C50,106 112,148 172,126 C232,104 280,144 342,122 C372,111 398,122 405,118 L405,300 L-5,300Z" fill="rgba(0,140,160,.42)"/>
<path d="M-5,154 C42,132 100,170 162,150 C224,130 292,166 360,146 C390,138 405,146 405,146 L405,300 L-5,300Z" fill="rgba(10,80,120,.56)"/>
<path d="M-5,183 C60,163 132,196 202,176 C272,156 342,192 405,173 L405,300 L-5,300Z" fill="rgba(8,50,82,.72)"/>
<path d="M22,131 C46,124 66,136 90,128" stroke="rgba(255,255,255,.66)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M196,122 C222,115 244,127 268,120" stroke="rgba(255,255,255,.58)" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M312,126 C330,120 350,130 370,124" stroke="rgba(255,255,255,.48)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<circle cx="68" cy="84" r="1.5" fill="rgba(255,255,255,.4)"/>
<circle cx="178" cy="70" r="2" fill="rgba(255,255,255,.34)"/>
<circle cx="308" cy="76" r="1.5" fill="rgba(255,255,255,.4)"/>
</svg>`,
  },
  {
    id: 2,
    name: 'Galaxy Coaster Set',
    category: 'coaster',
    price: 2400,
    age: 6,
    desc: 'Set of 4 deep-space coasters with gold star clusters and swirling nebula hues.',
    art: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
<defs>
<radialGradient id="a2" cx="50%" cy="50%"><stop offset="0%" stop-color="#1E0044"/><stop offset="55%" stop-color="#0E0022"/><stop offset="100%" stop-color="#06000F"/></radialGradient>
<radialGradient id="b2" cx="36%" cy="40%"><stop offset="0%" stop-color="#C9A84C" stop-opacity=".5"/><stop offset="100%" stop-color="#C9A84C" stop-opacity="0"/></radialGradient>
<radialGradient id="c2" cx="68%" cy="58%"><stop offset="0%" stop-color="#7B2FBE" stop-opacity=".7"/><stop offset="100%" stop-color="#7B2FBE" stop-opacity="0"/></radialGradient>
<radialGradient id="d2" cx="22%" cy="72%"><stop offset="0%" stop-color="#1E4AFF" stop-opacity=".38"/><stop offset="100%" stop-color="#1E4AFF" stop-opacity="0"/></radialGradient>
</defs>
<rect width="400" height="300" fill="url(#a2)"/>
<ellipse cx="144" cy="118" rx="220" ry="158" fill="url(#b2)"/>
<ellipse cx="276" cy="178" rx="182" ry="140" fill="url(#c2)"/>
<ellipse cx="84" cy="208" rx="158" ry="118" fill="url(#d2)"/>
<circle cx="40" cy="28" r="1.5" fill="white" opacity=".82"/><circle cx="118" cy="18" r="1" fill="white" opacity=".62"/>
<circle cx="198" cy="14" r="2" fill="white" opacity=".88"/><circle cx="278" cy="23" r="1" fill="white" opacity=".7"/>
<circle cx="350" cy="17" r="1.5" fill="white" opacity=".8"/><circle cx="382" cy="38" r="1" fill="white" opacity=".52"/>
<circle cx="58" cy="58" r="1" fill="white" opacity=".6"/><circle cx="158" cy="53" r="1.5" fill="white" opacity=".68"/>
<circle cx="238" cy="46" r="1" fill="white" opacity=".52"/><circle cx="322" cy="50" r="2" fill="white" opacity=".8"/>
<circle cx="98" cy="98" r="1.5" fill="white" opacity=".62"/><circle cx="228" cy="93" r="1" fill="white" opacity=".52"/>
<circle cx="362" cy="88" r="1" fill="white" opacity=".7"/><circle cx="28" cy="138" r="1" fill="white" opacity=".52"/>
<circle cx="168" cy="128" r="1.5" fill="white" opacity=".62"/><circle cx="292" cy="140" r="1" fill="white" opacity=".7"/>
<circle cx="148" cy="108" r="3" fill="#C9A84C" opacity=".92"/>
<circle cx="160" cy="97" r="1.5" fill="#C9A84C" opacity=".72"/><circle cx="138" cy="102" r="1" fill="#C9A84C" opacity=".6"/>
<circle cx="154" cy="118" r="2" fill="#C9A84C" opacity=".7"/><circle cx="165" cy="110" r="1" fill="#C9A84C" opacity=".5"/>
<path d="M98,148 Q198,98 300,158 Q352,188 200,198 Q98,208 98,148Z" fill="rgba(130,0,220,.1)"/>
</svg>`,
  },
  {
    id: 3,
    name: 'Amethyst Geode Clock',
    category: 'clock',
    price: 4500,
    age: 5,
    desc: 'Wall clock with amethyst geode slice design. Quartz movement included.',
    art: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
<defs>
<radialGradient id="a3" cx="50%" cy="50%"><stop offset="0%" stop-color="#F0E0FF"/><stop offset="22%" stop-color="#C084FC"/><stop offset="52%" stop-color="#7E22CE"/><stop offset="78%" stop-color="#3B0764"/><stop offset="100%" stop-color="#18002E"/></radialGradient>
<radialGradient id="b3" cx="50%" cy="50%"><stop offset="0%" stop-color="#C9A84C" stop-opacity=".38"/><stop offset="100%" stop-color="#C9A84C" stop-opacity="0"/></radialGradient>
</defs>
<rect width="400" height="300" fill="#0C001C"/>
<circle cx="200" cy="150" r="136" fill="#180030"/>
<circle cx="200" cy="150" r="124" fill="url(#a3)"/>
<path d="M200,150 L114,62 L128,82 L200,150Z" fill="#7E22CE" opacity=".82"/>
<path d="M200,150 L286,62 L272,84 L200,150Z" fill="#9333EA" opacity=".72"/>
<path d="M200,150 L78,150 L94,132 L200,150Z" fill="#7E22CE" opacity=".76"/>
<path d="M200,150 L322,150 L306,170 L200,150Z" fill="#A855F7" opacity=".66"/>
<path d="M200,150 L132,238 L152,220 L200,150Z" fill="#9333EA" opacity=".72"/>
<path d="M200,150 L268,238 L248,218 L200,150Z" fill="#7E22CE" opacity=".82"/>
<path d="M200,150 L156,56 L167,76 L200,150Z" fill="#C084FC" opacity=".52"/>
<path d="M200,150 L244,56 L234,78 L200,150Z" fill="#A855F7" opacity=".56"/>
<circle cx="200" cy="150" r="124" fill="none" stroke="#C9A84C" stroke-width="2.5" opacity=".5"/>
<circle cx="200" cy="150" r="28" fill="url(#b3)"/>
<circle cx="200" cy="150" r="20" fill="#F0E0FF" opacity=".82"/>
<circle cx="200" cy="150" r="7" fill="#C9A84C" opacity=".92"/>
<line x1="200" y1="150" x2="200" y2="130" stroke="#C9A84C" stroke-width="2.5" stroke-linecap="round"/>
<line x1="200" y1="150" x2="218" y2="156" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: 4,
    name: 'Pressed Flower Jewelry Box',
    category: 'decor',
    price: 3200,
    age: 4,
    desc: 'Resin jewelry box with real pressed botanicals sealed in warm amber tones.',
    art: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
<defs>
<linearGradient id="a4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7A5828"/><stop offset="55%" stop-color="#B8860B"/><stop offset="100%" stop-color="#6A4210"/></linearGradient>
<radialGradient id="b4" cx="62%" cy="38%"><stop offset="0%" stop-color="#F5C842" stop-opacity=".48"/><stop offset="100%" stop-color="#F5C842" stop-opacity="0"/></radialGradient>
<radialGradient id="c4" cx="30%" cy="30%"><stop offset="0%" stop-color="#FFF5DC" stop-opacity=".3"/><stop offset="100%" stop-color="#FFF5DC" stop-opacity="0"/></radialGradient>
</defs>
<rect width="400" height="300" fill="url(#a4)"/>
<rect width="400" height="300" fill="url(#b4)"/>
<ellipse cx="110" cy="90" rx="240" ry="140" fill="url(#c4)"/>
<circle cx="140" cy="110" r="9" fill="#F5E6C8" opacity=".9"/>
<ellipse cx="140" cy="93" rx="4.5" ry="11" fill="#F5E6C8" opacity=".85"/>
<ellipse cx="140" cy="127" rx="4.5" ry="11" fill="#F5E6C8" opacity=".85"/>
<ellipse cx="123" cy="110" rx="11" ry="4.5" fill="#F5E6C8" opacity=".85"/>
<ellipse cx="157" cy="110" rx="11" ry="4.5" fill="#F5E6C8" opacity=".85"/>
<ellipse cx="129" cy="99" rx="4.5" ry="11" transform="rotate(45,129,99)" fill="#F5E6C8" opacity=".8"/>
<ellipse cx="151" cy="121" rx="4.5" ry="11" transform="rotate(45,151,121)" fill="#F5E6C8" opacity=".8"/>
<ellipse cx="151" cy="99" rx="4.5" ry="11" transform="rotate(-45,151,99)" fill="#F5E6C8" opacity=".8"/>
<ellipse cx="129" cy="121" rx="4.5" ry="11" transform="rotate(-45,129,121)" fill="#F5E6C8" opacity=".8"/>
<circle cx="140" cy="110" r="7" fill="#C9A84C" opacity=".95"/>
<ellipse cx="176" cy="94" rx="19" ry="7" transform="rotate(-34,176,94)" fill="#4A6741" opacity=".7"/>
<ellipse cx="104" cy="130" rx="21" ry="7" transform="rotate(26,104,130)" fill="#3D5C35" opacity=".65"/>
<path d="M218,58 Q238,78 253,98 Q238,88 228,103" stroke="#4A6741" stroke-width="1.5" fill="none" opacity=".7"/>
<path d="M253,98 Q268,93 276,106" stroke="#4A6741" stroke-width="1" fill="none" opacity=".6"/>
<path d="M238,78 Q253,73 260,86" stroke="#4A6741" stroke-width="1" fill="none" opacity=".6"/>
<circle cx="270" cy="172" r="5.5" fill="#FFB3C6" opacity=".85"/>
<ellipse cx="270" cy="160" rx="3" ry="7.5" fill="#FFB3C6" opacity=".8"/>
<ellipse cx="270" cy="184" rx="3" ry="7.5" fill="#FFB3C6" opacity=".8"/>
<ellipse cx="258" cy="172" rx="7.5" ry="3" fill="#FFB3C6" opacity=".8"/>
<ellipse cx="282" cy="172" rx="7.5" ry="3" fill="#FFB3C6" opacity=".8"/>
<circle cx="270" cy="172" r="4.5" fill="#C9A84C" opacity=".9"/>
<ellipse cx="310" cy="202" rx="17" ry="5.5" transform="rotate(22,310,202)" fill="#3D5C35" opacity=".6"/>
</svg>`,
  },
  {
    id: 5,
    name: 'Teal Pour Wall Art',
    category: 'wall-art',
    price: 6800,
    age: 3,
    desc: 'Large abstract wall art (30×40 cm) with dramatic teal rivers and real gold leaf.',
    art: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
<defs>
<linearGradient id="a5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#091E1E"/><stop offset="100%" stop-color="#041212"/></linearGradient>
<linearGradient id="b5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00B4B4"/><stop offset="100%" stop-color="#007A7A"/></linearGradient>
<linearGradient id="c5" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="#004A4A"/><stop offset="100%" stop-color="#00AAAA"/></linearGradient>
</defs>
<rect width="400" height="300" fill="url(#a5)"/>
<path d="M-10,38 C62,16 82,78 144,56 C202,36 214,108 282,78 C342,52 372,88 410,68 L410,128 C372,108 342,132 282,120 C214,98 202,158 144,132 C82,108 62,148 -10,138Z" fill="url(#b5)" opacity=".85"/>
<path d="M-10,158 C50,138 92,196 162,173 C232,150 252,208 332,183 C372,170 395,183 410,178 L410,238 C390,233 368,220 332,233 C252,258 232,200 162,223 C92,248 50,208 -10,228Z" fill="url(#c5)" opacity=".75"/>
<path d="M60,8 C80,48 70,98 100,138 C130,178 120,228 150,268" stroke="#C9A84C" stroke-width="1.5" fill="none" opacity=".68"/>
<path d="M198,0 C208,38 194,88 220,128 C244,168 230,218 258,278" stroke="#C9A84C" stroke-width="1" fill="none" opacity=".54"/>
<path d="M318,18 C328,58 314,108 340,148 C360,183 348,228 370,268" stroke="#C9A84C" stroke-width="1.5" fill="none" opacity=".6"/>
<ellipse cx="88" cy="68" rx="8" ry="3" transform="rotate(-20,88,68)" fill="#C9A84C" opacity=".6"/>
<ellipse cx="218" cy="108" rx="6" ry="2.5" transform="rotate(16,218,108)" fill="#C9A84C" opacity=".55"/>
<ellipse cx="158" cy="198" rx="9" ry="3" transform="rotate(-28,158,198)" fill="#C9A84C" opacity=".64"/>
<ellipse cx="308" cy="173" rx="7" ry="2.5" transform="rotate(24,308,173)" fill="#C9A84C" opacity=".6"/>
<path d="M98,52 C128,46 150,58 178,50" stroke="rgba(255,255,255,.5)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<path d="M238,82 C264,76 280,88 310,80" stroke="rgba(255,255,255,.4)" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M48,176 C78,168 98,180 128,172" stroke="rgba(255,255,255,.44)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: 6,
    name: 'Pearl & Gold Serving Tray',
    category: 'tray',
    price: 2900,
    age: 2,
    desc: 'Elegant vanity tray in pearl white with flowing gold-leaf swirls. Great gift idea.',
    art: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
<defs>
<linearGradient id="a6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#EEE8DC"/><stop offset="45%" stop-color="#E5DECE"/><stop offset="100%" stop-color="#D2C5AC"/></linearGradient>
<radialGradient id="b6" cx="28%" cy="28%"><stop offset="0%" stop-color="white" stop-opacity=".7"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient>
</defs>
<rect width="400" height="300" fill="url(#a6)"/>
<ellipse cx="128" cy="98" rx="230" ry="158" fill="url(#b6)"/>
<path d="M-5,78 C42,68 62,98 112,83 C162,68 182,98 242,78 C292,60 322,88 410,63" stroke="#C9A84C" stroke-width="1.5" fill="none" opacity=".64"/>
<path d="M50,0 C60,38 48,88 70,132 C88,172 76,222 100,272" stroke="#C9A84C" stroke-width="1" fill="none" opacity=".54"/>
<path d="M-5,148 C32,138 72,162 122,146 C172,130 202,156 262,138 C312,122 362,146 410,131" stroke="#C9A84C" stroke-width="1.5" fill="none" opacity=".58"/>
<path d="M202,0 C217,34 207,74 227,112 C247,152 237,198 260,246" stroke="#C9A84C" stroke-width="1" fill="none" opacity=".44"/>
<path d="M332,8 C322,48 338,98 318,143 C302,182 316,228 302,272" stroke="#C9A84C" stroke-width=".8" fill="none" opacity=".48"/>
<path d="M98,98 C128,78 158,108 138,138 C118,168 78,158 88,128" stroke="#C9A84C" stroke-width=".6" fill="none" opacity=".4"/>
<path d="M258,178 C288,158 318,188 298,218 C278,248 238,238 248,208" stroke="#C9A84C" stroke-width=".6" fill="none" opacity=".35"/>
<ellipse cx="80" cy="63" rx="38" ry="18" transform="rotate(-14,80,63)" fill="rgba(255,255,255,.3)"/>
<ellipse cx="298" cy="228" rx="48" ry="20" transform="rotate(11,298,228)" fill="rgba(255,255,255,.24)"/>
<path d="M-5,218 C52,208 102,226 162,213 C222,200 272,220 332,208 C362,202 388,210 410,205" stroke="#B8A070" stroke-width=".5" fill="none" opacity=".44"/>
</svg>`,
  },
  {
    id: 7,
    name: 'Cosmic Paperweight',
    category: 'decor',
    price: 1200,
    age: 1,
    desc: 'Dome-shaped paperweight with a nebula frozen inside. Great desk keepsake or gift.',
    art: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
<defs>
<radialGradient id="a7" cx="50%" cy="50%"><stop offset="0%" stop-color="#0D1B3E"/><stop offset="100%" stop-color="#030912"/></radialGradient>
<radialGradient id="b7" cx="42%" cy="42%"><stop offset="0%" stop-color="#1E3A8A" stop-opacity=".9"/><stop offset="38%" stop-color="#7C3AED" stop-opacity=".7"/><stop offset="70%" stop-color="#EC4899" stop-opacity=".4"/><stop offset="100%" stop-color="#EC4899" stop-opacity="0"/></radialGradient>
<radialGradient id="c7" cx="60%" cy="55%"><stop offset="0%" stop-color="#7FFFD4" stop-opacity=".28"/><stop offset="100%" stop-color="#7FFFD4" stop-opacity="0"/></radialGradient>
<radialGradient id="d7" cx="50%" cy="50%"><stop offset="0%" stop-color="rgba(255,255,255,.38)"/><stop offset="60%" stop-color="rgba(255,255,255,0)"/></radialGradient>
<clipPath id="clip7"><circle cx="200" cy="148" r="118"/></clipPath>
</defs>
<rect width="400" height="300" fill="#040A14"/>
<ellipse cx="200" cy="268" rx="108" ry="17" fill="rgba(0,0,0,.42)"/>
<circle cx="200" cy="148" r="118" fill="url(#a7)"/>
<g clip-path="url(#clip7)">
<ellipse cx="168" cy="118" rx="98" ry="78" fill="url(#b7)"/>
<ellipse cx="248" cy="168" rx="88" ry="68" fill="url(#c7)"/>
<circle cx="148" cy="98" r="1.5" fill="white" opacity=".9"/>
<circle cx="188" cy="78" r="1" fill="white" opacity=".7"/>
<circle cx="238" cy="108" r="2" fill="white" opacity=".85"/>
<circle cx="208" cy="138" r="1" fill="white" opacity=".6"/>
<circle cx="268" cy="128" r="1.5" fill="white" opacity=".76"/>
<circle cx="162" cy="152" r="1" fill="white" opacity=".6"/>
<circle cx="128" cy="128" r="1.5" fill="white" opacity=".7"/>
<circle cx="298" cy="158" r="1" fill="white" opacity=".6"/>
<circle cx="218" cy="98" r="3" fill="white" opacity="1"/>
<circle cx="218" cy="98" r="8" fill="white" opacity=".14"/>
</g>
<circle cx="200" cy="148" r="118" fill="none" stroke="rgba(255,255,255,.11)" stroke-width="1"/>
<ellipse cx="163" cy="93" rx="44" ry="28" fill="url(#d7)"/>
</svg>`,
  },
  {
    id: 8,
    name: 'Rainbow Fluid Coasters',
    category: 'coaster',
    price: 3600,
    age: 7,
    desc: 'Set of 6 vibrant fluid pour coasters — every piece unique with full-spectrum colours.',
    art: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
<defs>
<linearGradient id="a8" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#180A2C"/><stop offset="100%" stop-color="#080412"/></linearGradient>
</defs>
<rect width="400" height="300" fill="url(#a8)"/>
<path d="M-10,18 C42,8 82,48 132,28 C182,8 202,58 262,33 C312,12 362,48 410,23 L410,73 C362,98 312,62 262,83 C202,108 182,58 132,78 C82,98 42,58 -10,68Z" fill="#EF4444" opacity=".76"/>
<path d="M-10,68 C42,58 82,98 132,78 C182,58 202,108 262,83 C312,62 362,98 410,73 L410,118 C362,143 312,107 262,128 C202,153 182,103 132,123 C82,143 42,103 -10,113Z" fill="#F97316" opacity=".76"/>
<path d="M-10,113 C42,103 82,143 132,123 C182,103 202,153 262,128 C312,107 362,143 410,118 L410,163 C362,188 312,152 262,173 C202,198 182,148 132,168 C82,188 42,148 -10,158Z" fill="#EAB308" opacity=".76"/>
<path d="M-10,158 C42,148 82,188 132,168 C182,148 202,198 262,173 C312,152 362,188 410,163 L410,208 C362,233 312,197 262,218 C202,243 182,193 132,213 C82,233 42,193 -10,203Z" fill="#22C55E" opacity=".72"/>
<path d="M-10,203 C42,193 82,233 132,213 C182,193 202,243 262,218 C312,197 362,233 410,208 L410,253 C362,278 312,242 262,263 C202,288 182,238 132,258 C82,278 42,238 -10,248Z" fill="#3B82F6" opacity=".72"/>
<path d="M-10,248 C42,238 82,278 132,258 C182,238 202,288 262,263 C312,242 362,278 410,253 L410,300 L-10,300Z" fill="#8B5CF6" opacity=".8"/>
<path d="M58,23 C88,16 114,33 144,23" stroke="rgba(255,255,255,.5)" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M238,38 C264,31 290,45 320,36" stroke="rgba(255,255,255,.44)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<path d="M28,123 C58,116 84,131 114,121" stroke="rgba(255,255,255,.4)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<path d="M268,168 C294,161 314,175 344,166" stroke="rgba(255,255,255,.4)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<rect width="400" height="300" fill="rgba(255,255,255,.04)"/>
</svg>`,
  },
  {
    id: 9,
    name: "Ocean Resin Side Table",
    category: 'decor',
    price: 9500,
    age: 12,
    desc: "Handcrafted side table with a free-form resin top in turquoise waves, white foam and gold flakes, on solid wood legs.",
    art: '',
    image: '/images/ocean-table.jpg',
  },
  {
    id: 10,
    name: "Glow-in-the-Dark Shiva Clock",
    category: 'clock',
    price: 3800,
    age: 11,
    desc: "Resin wall clock with a Shiva silhouette and stars that glow green in the dark. Quartz movement included.",
    art: '',
    image: '/images/shiva-glow-clock.jpg',
  },
  {
    id: 11,
    name: "Custom Name Plate",
    category: 'decor',
    price: 2200,
    age: 10,
    desc: "Personalised hanging name plate in midnight black resin with pressed leaves, pearls and gold leaf. Made to order with your name.",
    art: '',
    image: '/images/name-plate.jpg',
  },
  {
    id: 12,
    name: "Emerald Geode Tray",
    category: 'tray',
    price: 2600,
    age: 9,
    desc: "Wooden serving tray with an emerald green and gold geode-style resin pour and a glossy finish.",
    art: '',
    image: '/images/emerald-tray.jpg',
  },
  {
    id: 13,
    name: "Black Panther Sculpture",
    category: 'decor',
    price: 3500,
    age: 13,
    desc: "Where elegance meets the wild. Resin panther figure set on a bed of crystal glass.",
    art: '',
    image: '/images/panther.jpg',
  },
  {
    id: 14,
    name: "Magenta Galaxy Butterfly",
    category: 'wall-art',
    price: 7500,
    age: 14,
    desc: "Large wall butterfly with gold-wire outlines and magenta, purple and black resin wings with glitter.",
    art: '',
    image: '/images/butterfly-magenta.jpg',
  },
  {
    id: 15,
    name: "Indigo Midnight Butterfly",
    category: 'wall-art',
    price: 7500,
    age: 15,
    desc: "Large wall butterfly with copper-wire outlines and indigo, white and black resin wings.",
    art: '',
    image: '/images/butterfly-indigo.jpg',
  },
];
