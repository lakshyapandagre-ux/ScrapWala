# ScrapWala — design.md

## 0. Precedence

- Visuals ke liye yeh file final hai. Behavior ke liye PRD hai, aur PRD ke 8 hard rules (local-first, no fake precision, no PII, etc.) hamesha jeetenge.
- Reference apps se sirf patterns lo. Unke logos, illustrations, photos, text, "No.1 app" jaise claims, investor portraits ya fake stats mat copy karo.
- Collector ke liye DigiLocker/KYC jaisa koi flow nahi banana (PRD rule 5).

## 1. Design intent

ScrapWala ko ek native Android app jaisa feel karna hai, website jaisa nahi. Isme image-first cards, bade bold titles aur bottom pe sticky CTA hoga. Trust ka signal har price ke saath source, freshness aur confidence label se aayega. Baseline screen 360×800 hai aur 320px pe bhi kuch nahi tootna chahiye.

## 2. Pattern map

| Pattern | Reference | ScrapWala usage |
|---|---|---|
| Hero header with location pill + "Sell Now" outline pill | The Kabadiwala home | Collector Home top |
| Category grid, radio circle top-right | The Kabadiwala | Sell flow step 1 (7 e-waste categories) |
| Section heading with trailing thin rule + gray subtitle | The Kabadiwala | Har home/rates section |
| Rate list row (thumb, name, gray category, big ₹/kg right) | The Kabadiwala rate list | Rates screen |
| Floating "Sell Now" bar with overlapping thumbnails + dismiss X | The Kabadiwala | Selected category ka mini bar |
| Blue info banner + white pill CTA, sticky above nav | The Kabadiwala | "Rate indicative hai" banner |
| "Please keep in mind" sheet, 2×2 tiles with red-cross overlay | The Kabadiwala | **Safety cards** (battery/CRT/PCB/cable) |
| Request summary: gray section labels above white cards | The Kabadiwala | Lot summary screen |
| Profile: dark green header + 2×2 tiles + grouped settings | The Kabadiwala | Collector Profile |
| Live price card with sparkline + delta chip | Recykal.Market | Home + Rates |
| Center raised FAB in bottom nav | Recykal.Market | "Sell" FAB (recycler: "Scan") |
| Dark charcoal header + grouped demand list + sticky "Create Listing" pill with count | Recykal.Market | **Recycler incoming lots** |
| Floating pill bottom nav, strikethrough old rate → new green rate | Third app | Nav style + "Market vs Formal price" |
| Dark trust card | Recykal.Market | "Your impact" card (sirf user ka apna real data) |

## 3. App shell rules (PWA, app feel)

- `manifest.json`: `display: standalone`, `theme_color: #0F5A43`, `background_color: #F6F8F6`, maskable icons 192/512.
- Meta viewport mein `viewport-fit=cover`. Safe areas ke liye `env(safe-area-inset-*)`. Full-height screens ke liye `100dvh`.
- Global CSS: `-webkit-tap-highlight-color: transparent`, `overscroll-behavior-y: none`, `-webkit-text-size-adjust: 100%`, UI chrome pe `user-select: none`.
- Collector aur Recycler UI ek centered column mein (`max-w-[480px] mx-auto`). Desktop pe bahar ka bg `#E9EEE9` aur column pe shadow. Admin full-width hai.
- Bottom nav sirf top-level tabs pe dikhta hai. Wizard aur full-screen flows mein nav hide hota hai aur sticky CTA bar aata hai.

## 4. Design tokens

```css
:root {
  /* brand */
  --sw-forest-900:#0B3D2E; --sw-forest-800:#0F5A43;   /* FAB, dark cards, status bar */
  --sw-green-700:#256618;  --sw-green-600:#2E7D1F;    /* primary CTA */
  --sw-green-100:#D9F5D0;  --sw-green-50:#EFFAEB;     /* soft fills, "Add" button bg */
  /* neutrals */
  --sw-ink-900:#14181A; --sw-ink-800:#262B29;         /* titles / charcoal headers */
  --sw-ink-600:#5B636B; --sw-ink-400:#9AA1A9;
  --sw-line:#E6E9E6; --sw-bg:#F6F8F6; --sw-card:#FFFFFF;
  /* semantic */
  --sw-info-700:#0B4F9C; --sw-info-50:#E6F0FB;
  --sw-amber-500:#F5B301; --sw-amber-50:#FFF4DC;      /* keep-in-mind tiles, tips, warnings */
  --sw-red-600:#C62828;  --sw-red-50:#FDE8E8;         /* remove, hazard, failed */
  --sw-gold:linear-gradient(135deg,#F5B301,#FFD666);  /* EPR premium only */
  /* category tiles (pastel) */
  --cat-crt:#DDE8FF; --cat-lcd:#D8F6FB; --cat-pcb:#E0F5DA; --cat-cable:#FFE8D6;
  --cat-battery:#FFF9D6; --cat-motor:#FFE0E3; --cat-plastic:#EADFFB;
}
```
