# Videoton TVC 4-bit Digital Audio Converter (DigiSound3TVC)

Egy böngészőben futó (online és önálló offline egyfájlos formában is használható) audió konvertáló és vágó eszköz a **Videoton TVC** 8-bites számítógép digitális hangrendszeréhez.

A modern audio fájlokat (WAV, MP3, OGG, FLAC stb.) alakítja át a TVC 4-bites DA hangrendszere, illetve a Turbo Rascal Syntax Error (TRSE) lejátszórutinok által közvetlenül lejátszható formátumba.

---

## Fő funkciók

- **Hullámforma megjelenítés és interaktív szerkesztés:**
  - Zoom & Pan funkciók az audió pontos vizsgálatához.
  - Tartománykijelölés 0,01 másodperces finomhangolással.
  - Automatikus csendvágás (*Trim Silence*) az elejéről és végéről.
  - Eredeti kijelölt részlet és konvertált 4-bites hang azonnali visszahallgatása.

- **Dinamika és szűrő beállítások:**
  - **Normalizálás (Normalize):** Maximális kivezérlés torzítás nélkül.
  - **Hangerő (Gain):** Kézi erősítés / csillapítás.
  - **Szűrők:** Állítható felüláteresztő (Highpass - DC offset és dübörgés szűrésére) és meredek aluláteresztő (Lowpass - aliasing ellen).
  - **Pre-emphasis:** Magashang-előkiemelés a tiszta beszédért és magasakért.
  - **Dinamika kompresszor:** Halk részletek kiemelése a 4-bites felbontáshoz.
  - **Zajzár (Noise Gate):** Szünetek alapzajának elnémítása.
  - **Dither & Zajformálás (Noise Shaping):** Kvantálási torzítás simítása, a kvantálási zaj kevésbé hallható sávokba tolása.

- **Rugalmas mintavételezés és ritkítás:**
  - Szabványos célfrekvenciák (2 kHz, 4 kHz, 8 kHz, 11 kHz, 22 kHz, 44 kHz) vagy tetszőleges egyedi frekvencia (Hz).
  - **Minta ritkítás (Decimation):** 1-től 5-ig választható mintaátugrás a fájlméret csökkentésére.
  - Valós idejű becsült kimeneti fájlméret számítás (Packed / Unpacked).

- **Mentési profilok (Presets):**
  - Beállítások elmentése és visszatöltése a böngésző helyi tárhelyéből (Local Storage).

---

## Kimeneti formátumok és TVC / TRSE integráció

### 1. TVC Bináris – Tömörített (Packed / 2x4 bit)
- **1 bájt = 2 db 4-bites minta** (felső és alsó nibble).
- Választható bit/nibble sorrend:
  - **Felső-Alsó (Upper-Lower)**
  - **Alsó-Felső (Lower-Upper)** *(TVC rutinoknál jellemző alapértelmezett)*
- **TRSE kompatibilis mentés:**
  - A tömörített adatfolyamban a `0` értékű bájtok helyett `7` kerül beírásra, így a hang nem áll meg idő előtt.
  - A fájl legvégére egy lezáró `0x00` bájt kerül (mintavég jelzés).

#### TRSE példakód (Packed 4 kHz):
```pascal
program DigiPlayer_4khz_2x4bit;
@use "GE"
var  
  SoundFx : incbin("minta_4bit_4.0kHz_packed.bin");
begin
  // Ha a minta ritkítás (decimation) > 1, a frekvenciát is osztani kell!
  // Pl. 4kHz és 2-es ritkítás esetén: GE::DIGI_FREQ_2_KHZ
  GE::DigiSoundOn(GE::DIGI_FREQ_4_KHZ, GE::DIGI_TYPE_2x4BIT);
  GE::PlayDigiSound(#SoundFx);
  loop();
end.
```

---

### 2. TVC Bináris – Kibontott (Unpacked / 1x4 bit)
- **1 bájt = 1 db 4-bites minta** a 2–5. bitekre igazítva (`sample << 2`).
- A 0–1. bitek a TVC aktuális grafikus módjához igazodnak, így a bájtok közvetlenül kiírhatók a TVC 6-os I/O portjára:
  - **GRAPHICS 2:** `00b`
  - **GRAPHICS 4:** `01b`
  - **GRAPHICS 16:** `11b`
- **TRSE / Lejátszó kompatibilis mintavég jelzés:**
  - Az utolsó bájtban a **6. bit (`0x40` / 64)** automatikusan 1-re lesz állítva, ami a lejátszó ciklus számára jelzi az adatfolyam végét.

---

### 3. WAV formátum
- Szabványos, 8-bites mono WAV formátum a konvertált hang PC-s ellenőrzéséhez és archiválásához.

---

## Használat

### Közvetlen futtatás böngészőben (Telepítés nélkül)
Csak nyisd meg a gyökérkönyvtárban lévő [DigiSound3TVC.html](DigiSound3TVC.html) fájlt bármilyen modern böngészőben (Chrome, Firefox, Edge). Nincs szükség szerverre vagy internetkapcsolatra.

### Fejlesztői környezet futtatása (Node.js)

Ha módosítani szeretnéd a forráskódot:

1. **Függőségek telepítése:**
   ```bash
   npm install
   ```

2. **Fejlesztői szerver indítása:**
   ```bash
   npm run dev
   ```

3. **Önálló, egyfájlos HTML build készítése:**
   ```bash
   npm run build
   ```
   A build a `dist/index.html` fájlba generálódik (minden JavaScript, CSS és komponens beágyazva egyetlen HTML fájlba).

---

## Licenc

MIT
