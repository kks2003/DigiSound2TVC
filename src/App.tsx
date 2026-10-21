import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Play, Download, Settings2, FileAudio, Square, Maximize, ZoomIn, MoveHorizontal, Globe, FilePlus, HelpCircle, X, Minus, Scissors } from 'lucide-react';

const dict = {
  hu: {
    title: "TVC 4 bites digi hang konvertáló",
    subtitle: "Videoton TVC 4-bit audio converter",
    errorDecoding: "Nem támogatott vagy hibás audio fájl.",
    dropzone: "Húzz ide egy audio fájlt, vagy kattints a tallózáshoz",
    originalAudio: "Eredeti hang",
    playSelected: "Lejátszás (Kijelölt)",
    stop: "Stop",
    viewZoomPan: "Nézet (Zoom & Pan)",
    zoom: "Nagyítás (Zoom)",
    pan: "Pásztázás (Pan)",
    selection: "Kijelölés",
    start: "Kezdet:",
    end: "Vég:",
    length: "Hossz:",
    convSettings: "Konvertálási beállítások",
    normalizeTitle: "Beállítja a maximális hangerőt, ami még nem torzít",
    normalize: "Max Hangerő (Normalize)",
    gain: "Hangerő (Gain)",
    lowpass: "Aluláteresztő (Lowpass)",
    highpass: "Felüláteresztő (Highpass)",
    ditherTitle: "Véletlenszerű zaj hozzáadása a kvantálási torzítás (zúgás) simítására",
    dither: "Dither (Zajszórás)",
    gateTitle: "A csendes részek teljes lenémítása",
    gate: "Zajzár (Noise Gate)",
    convertedAudio: "4-bites konvertált hang",
    play4bit: "Lejátszás (4-bit)",
    converting: "Konvertálás...",
    save: "Mentés",
    wavFormat: "WAV formátum",
    standardAudio: "Szabványos audio fájl (8 bit mono)",
    tvcPacked: "TVC Bináris (Tömörített)",
    byte2samples: "1 byte = 2 db 4-bites minta",
    tvcUnpacked: "TVC Bináris (Kibontott)",
    byte1sample: "1 byte = 1 db 4 bites minta + grafikus mód",
    graphicsMode: "Grafikus mód:",
    newAudio: "Új hang",
    compressor: "Kompresszor (Dinamika)",
    preEmphasis: "Előkiemelés (Pre-emphasis)",
    noiseShaping: "Zajformálás (Noise Shaping)",
    sampleRate: "Mintavételezés:",
    sampleRateTitle: "A konvertált hang frekvenciája (Hz)",
    zoomToSelection: "Zoom a kijelölésre",
    trimSilence: "Szünetek vágása",
    trimSilenceTitle: "Csend eltávolítása a hang elejéről és végéről",
    estimatedSize: "Becsült fájlméret:",
    bytes: "bájt",
    selectAll: "Mindet kijelöl",
    clearSelection: "Kijelölés törlése",
    showAll: "Mindet mutat",
    helpTitle: "Súgó és működési leírás",
    helpClose: "Bezárás",
    helpIntro: "Ez az eszköz a modern hangfájlokat alakítja át a Videoton TVC számítógép 4-bites hangrendszere számára emészthető formátumba. Mivel a 4-bit mindössze 16 hangerőszintet jelent, a nyers konverzió nagyon zajos lenne. Az alábbi beállítások segítenek a legjobb minőség elérésében.",
    helpItems: [
      { title: "Szünetek vágása (Trim Silence)", desc: "Automatikusan, ráhagyás nélkül eltávolítja a csendes részeket az eredeti hang elejéről és végéről." },
      { title: "Max Hangerő (Normalize)", desc: "Automatikusan beállítja a hangerőt a lehető legmagasabb szintre torzítás nélkül. Érdemes ezzel kezdeni a feldolgozást." },
      { title: "Hangerő (Gain)", desc: "Kézi hangerőszabályzás. Ha a hang túl halk, a 4-bites konverzió során elvesznek a finom részletek." },
      { title: "Aluláteresztő (Lowpass)", desc: "Levágja a magas frekvenciákat. Mivel a TVC lejátszási frekvenciája alacsony, a túl magas hangok zavaró 'visszatükröződést' (aliasing) okozhatnak. Érdemes a cél lejátszási frekvencia felére állítani." },
      { title: "Felüláteresztő (Highpass)", desc: "Levágja a mély hangokat. Eltávolítja a felesleges dübörgést és az egyenáramú eltolódást (DC offset), így több 'hely' marad a hasznos hangoknak a 16 szinten." },
      { title: "Dither (Zajszórás)", desc: "Nagyon halk, véletlenszerű zajt ad a hanghoz konverzió előtt. Bár furcsán hangzik, ez elfedi a 4-bites 'lépcsőzetes' torzítást, és simábbá teszi a halk részeket." },
      { title: "Zajzár (Noise Gate)", desc: "Teljesen elnémítja azokat a részeket, amik egy megadott szintnél halkabbak. Hasznos a szünetekben lévő alapzaj eltüntetésére." },
      { title: "Kompresszor (Dinamika)", desc: "Csökkenti a különbséget a leghalkabb és leghangosabb részek között. A 4-bites hangnál a halk részek nagyon torzak lennének, a kompresszor segít ezeket felhangosítani." },
      { title: "Előkiemelés (Pre-emphasis)", desc: "Felerősíti a magasabb hangokat a konverzió előtt. Később a lejátszásnál ez tompulhat, így ezzel kompenzálhatjuk a veszteséget, tisztábbá téve a beszédet." },
      { title: "Zajformálás (Noise Shaping)", desc: "A konverzió során keletkező hibát (zajt) áttolja a magasabb, kevésbé hallható frekvenciákra. Ditherrel együtt használva sokat javít a minőségen." },
      { title: "TVC Bináris (Tömörített)", desc: "1 bájtba 2 darab 4-bites mintát csomagol (felső és alsó 4 bit). Helytakarékos formátum. A mentésnél beállítható a sorrend (Felső-Alsó vagy Alsó-Felső)." },
      { title: "TVC Bináris (Kibontott)", desc: "1 bájtba 1 mintát tesz. A minta a 2-5. bitekre kerül. A 0-1. bitek a kiválasztott grafikus módnak megfelelően (00, 01, 11) lesznek beállítva, így közvetlenül lehet a 6-os portra írni a bájtokat a megadott grafikus módban." },
      { title: "Nézet (Zoom & Pan)", desc: "A nagyítással (Zoom) beleláthatsz a hanghullám részleteibe, a pásztázással (Pan) pedig mozoghatsz a felnagyított nézetben. Az egérgörgővel is nagyíthatsz a hullámforma felett. A 'Mindet mutat' gombbal visszaállíthatod az alapértelmezett nézetet." },
      { title: "Kijelölés", desc: "Csak a kijelölt rész kerül konvertálásra és mentésre. A 'Zoom a kijelölésre' gombbal ráközelíthetsz a választott részre. A 'Mindet kijelöl' és 'Kijelölés törlése' gombokkal gyorsan módosíthatod a tartományt. A kijelölés 0,01 másodperces lépésekkel finomhangolható." },
      { title: "Mintavételezés", desc: "Meghatározza a kimeneti fájl frekvenciáját. Magasabb érték jobb minőséget, de nagyobb fájlméretet jelent. A becsült fájlméretet a hullámforma alatt láthatod. Egyedi frekvencia is megadható." },
      { title: "Beállítások mentése/töltése", desc: "A beállítások elmenthetők és visszatölthetők a böngésző helyi tárhelyébe (offline is működik)." },
      { title: "TRSE kompatibilis mentés", desc: "Ha ez be van nyomva (ez az alap) akkor packed módnál ha a konvertálandó bájt értéke 0 akkor az helyett 7-et ír be a bináris fájlba és a fájl végére pedig mindig rak egy 0-ás (minta vége) bájtot. Unpacked módnál nem módosítja a 0 értékeket és nem rak a végére 0-t, hanem az utolsó bájt 6. bitjét (64) 1-re állítja." },
      { title: "Minta ritkítás", desc: "A minta ritkítás (decimation) során a program csak minden N-edik mintát tartja meg. Ez csökkenti a fájlméretet, de ha ugyanazon a frekvencián játsszuk le, akkor a hang N-szer gyorsabb lesz (chipmunk effektus). Ha az eredeti sebességet szeretnéd, a lejátszási frekvenciát is el kell osztani ezzel az értékkel a TVC-n." }
    ],
    nibbleOrder: "4-bit sorrend (Packed):",
    upperLower: "Felső-Alsó",
    lowerUpper: "Alsó-Felső",
    customFreq: "Egyedi...",
    savePreset: "Mentés",
    loadPreset: "Töltés",
    preset: "Beállítás",
    trseCompatible: "TRSE kompatibilis mentés",
    byteProcessingInterval: "Minta ritkítás",
    byteProcessingIntervalDesc: "Hányadik mintát tartsa meg. Az 1 a default (minden minta). Ha 2-re állítod, minden 2. mintát veszi csak figyelembe. Ez csökkenti a fájlméretet, de ha ugyanazon a frekvencián játsszod le, a hang gyorsabb lesz.",
    trseCodeSnippet: `program DigiPlayer_4khz_2x4bit;
@use "GE"
var  
  SoundFx : incbin("tuctuc_4bit_4.0kHz_packed.bin");
begin
  // Ha a minta ritkítás (decimation) > 1, a frekvenciát is osztani kell!
  // Pl. 4kHz és 2-es ritkítás esetén: GE::DIGI_FREQ_2_KHZ
  GE::DigiSoundOn(GE::DIGI_FREQ_4_KHZ,GE::DIGI_TYPE_2x4BIT);
  GE::PlayDigiSound(#SoundFx);
  loop();
end.`
  },
  en: {
    title: "TVC 4-bit Digital Audio Converter",
    subtitle: "Videoton TVC 4-bit audio converter",
    errorDecoding: "Unsupported or corrupted audio file.",
    dropzone: "Drag and drop an audio file here, or click to browse",
    originalAudio: "Original audio",
    playSelected: "Play (Selected)",
    stop: "Stop",
    viewZoomPan: "View (Zoom & Pan)",
    zoom: "Zoom",
    pan: "Pan",
    selection: "Selection",
    start: "Start:",
    end: "End:",
    length: "Length:",
    convSettings: "Conversion settings",
    normalizeTitle: "Sets the maximum volume without distortion",
    normalize: "Normalize",
    gain: "Gain",
    lowpass: "Lowpass",
    highpass: "Highpass",
    ditherTitle: "Add random noise to smooth quantization distortion",
    dither: "Dither",
    gateTitle: "Completely mute silent parts",
    gate: "Noise Gate",
    convertedAudio: "4-bit converted audio",
    play4bit: "Play (4-bit)",
    converting: "Converting...",
    save: "Save",
    wavFormat: "WAV format",
    standardAudio: "Standard audio file (8 bit mono)",
    tvcPacked: "TVC Binary (Packed)",
    byte2samples: "1 byte = 2 x 4-bit samples",
    tvcUnpacked: "TVC Binary (Unpacked)",
    byte1sample: "1 byte = 1 x 4-bit sample + graphics mode",
    graphicsMode: "Graphics mode:",
    newAudio: "New audio",
    compressor: "Compressor (Dynamics)",
    preEmphasis: "Pre-emphasis",
    noiseShaping: "Noise Shaping",
    sampleRate: "Sample Rate:",
    sampleRateTitle: "Frequency of the converted audio (Hz)",
    zoomToSelection: "Zoom to selection",
    trimSilence: "Trim Silence",
    trimSilenceTitle: "Remove silence from the beginning and end of the audio",
    estimatedSize: "Estimated file size:",
    bytes: "bytes",
    selectAll: "Select All",
    clearSelection: "Clear Selection",
    showAll: "Show All",
    helpTitle: "Help & Documentation",
    helpClose: "Close",
    helpIntro: "This tool converts modern audio files into a format suitable for the Videoton TVC computer's 4-bit audio system. Since 4-bit means only 16 volume levels, raw conversion would be very noisy. The settings below help achieve the best possible quality.",
    helpItems: [
      { title: "Trim Silence", desc: "Automatically removes silent parts from the beginning and end of the original audio, without any padding." },
      { title: "Normalize", desc: "Automatically sets the volume to the highest possible level without distortion. Good starting point." },
      { title: "Gain", desc: "Manual volume control. If the audio is too quiet, fine details will be lost during the 4-bit conversion." },
      { title: "Lowpass", desc: "Cuts off high frequencies. Since the TVC playback rate is low, high frequencies can cause annoying aliasing noise. Set it to half of your target playback rate." },
      { title: "Highpass", desc: "Cuts off low frequencies. Removes unnecessary rumble and DC offset, leaving more 'headroom' for useful sounds across the 16 levels." },
      { title: "Dither", desc: "Adds very quiet, random noise before conversion. It masks the harsh 4-bit quantization distortion, making quiet parts sound smoother." },
      { title: "Noise Gate", desc: "Completely mutes parts that are quieter than the set level. Useful for removing background noise during pauses." },
      { title: "Compressor (Dynamics)", desc: "Reduces the dynamic range (difference between quiet and loud). In 4-bit audio, quiet parts get heavily distorted; the compressor helps boost them." },
      { title: "Pre-emphasis", desc: "Boosts higher frequencies before conversion. This compensates for high-frequency loss during low-fidelity playback, making speech clearer." },
      { title: "Noise Shaping", desc: "Pushes the quantization error (noise) into higher, less audible frequencies. Combined with dither, it significantly improves quality." },
      { title: "TVC Binary (Packed)", desc: "Packs two 4-bit samples into 1 byte (upper and lower 4 bits). Memory efficient format. You can choose the order (Upper-Lower or Lower-Upper)." },
      { title: "TVC Binary (Unpacked)", desc: "Puts 1 sample into 1 byte. The sample is placed on bits 2-5. Bits 0-1 are set according to the selected graphics mode (00, 01, 11), allowing direct writing to port 6 in the specified mode." },
      { title: "View (Zoom & Pan)", desc: "Zoom allows you to see the details of the waveform, and Pan lets you move across the zoomed view. You can also use the mouse wheel to zoom over the waveform. Use 'Show All' to reset the view." },
      { title: "Selection", desc: "Only the selected part will be converted and saved. Use 'Zoom to selection' to focus on your choice. 'Select All' and 'Clear Selection' help you manage the range quickly. Selection can be fine-tuned in 0.01s steps." },
      { title: "Sample Rate", desc: "Determines the output file frequency. Higher values mean better quality but larger file size. Estimated file size is shown below the waveform. Custom frequency can be set." },
      { title: "Save/Load Presets", desc: "Settings can be saved and loaded into your browser's local storage (works offline)." },
      { title: "TRSE Compatible Save", desc: "If this is enabled (default), in packed mode any byte value of 0 will be replaced with 7 in the binary file, and a 0-byte (end of sample) will always be appended to the end of the file. In unpacked mode, 0 values are not modified and no 0-byte is appended; instead, the 6th bit (64) of the last byte is set to 1." },
      { title: "Sample Decimation", desc: "During sample decimation, the program only keeps every Nth sample. This reduces the file size, but if played at the same frequency, the sound will be N times faster (chipmunk effect). If you want the original speed, you must also divide the playback frequency by this value on the TVC." }
    ],
    nibbleOrder: "4-bit Order (Packed):",
    upperLower: "Upper-Lower",
    lowerUpper: "Lower-Upper",
    customFreq: "Custom...",
    savePreset: "Save",
    loadPreset: "Load",
    preset: "Preset",
    trseCompatible: "TRSE Compatible Save",
    byteProcessingInterval: "Sample Decimation",
    byteProcessingIntervalDesc: "Which sample to keep. 1 is default (all samples). If set to 2, it only keeps every 2nd sample. This reduces file size, but if played at the same frequency, the sound will be faster.",
    trseCodeSnippet: `program DigiPlayer_4khz_2x4bit;
@use "GE"
var  
  SoundFx : incbin("tuctuc_4bit_4.0kHz_packed.bin");
begin
  // If sample decimation > 1, the frequency must be divided!
  // E.g. 4kHz with decimation 2: GE::DIGI_FREQ_2_KHZ
  GE::DigiSoundOn(GE::DIGI_FREQ_4_KHZ,GE::DIGI_TYPE_2x4BIT);
  GE::PlayDigiSound(#SoundFx);
  loop();
end.`
  }
};

// --- Utils ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

async function processAudio(
  buffer: AudioBuffer, 
  startSec: number, 
  endSec: number, 
  gain: number, 
  lowpass: number, 
  highpass: number,
  dither: number,
  gate: number,
  compressorAmt: number,
  preEmphasisAmt: number,
  useNoiseShaping: boolean,
  targetSampleRate: number,
  byteProcessingInterval: number
): Promise<Float32Array> {
  const duration = endSec - startSec;
  const targetLength = Math.max(1, Math.floor(duration * targetSampleRate));
  
  // OfflineAudioContext has a minimum sample rate (usually 3000)
  const workingSampleRate = Math.max(3000, targetSampleRate);
  const workingLength = Math.max(1, Math.floor(duration * workingSampleRate));
  
  const offlineCtx = new OfflineAudioContext(1, workingLength, workingSampleRate);
  
  const source = offlineCtx.createBufferSource();
  source.buffer = buffer;

  let currentNode: AudioNode = source;

  // 1. DC Blocker & Highpass (Steep - 2 poles)
  for(let i=0; i<2; i++) {
    const hp = offlineCtx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = Math.max(20, highpass);
    currentNode.connect(hp);
    currentNode = hp;
  }

  // 2. Pre-emphasis (Highshelf)
  if (preEmphasisAmt > 0) {
    const pe = offlineCtx.createBiquadFilter();
    pe.type = 'highshelf';
    pe.frequency.value = 3000;
    pe.gain.value = preEmphasisAmt;
    currentNode.connect(pe);
    currentNode = pe;
  }

  // 3. Compressor
  if (compressorAmt > 0) {
    const comp = offlineCtx.createDynamicsCompressor();
    comp.threshold.value = -50 * (compressorAmt / 100);
    comp.ratio.value = 1 + 19 * (compressorAmt / 100);
    comp.attack.value = 0.005;
    comp.release.value = 0.050;
    currentNode.connect(comp);
    currentNode = comp;
  }

  // 4. Steep Lowpass (3 poles for brickwall-like roll-off)
  for(let i=0; i<3; i++) {
    const lp = offlineCtx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = Math.min(lowpass, targetSampleRate / 2 - 100);
    currentNode.connect(lp);
    currentNode = lp;
  }

  const gainNode = offlineCtx.createGain();
  gainNode.gain.value = gain;
  currentNode.connect(gainNode);
  gainNode.connect(offlineCtx.destination);

  source.start(0, startSec, duration);

  const renderedBuffer = await offlineCtx.startRendering();
  let channelData = renderedBuffer.getChannelData(0);

  // If we had to use a higher rate for the context, resample back to target
  if (workingSampleRate !== targetSampleRate) {
    const resampled = new Float32Array(targetLength);
    for (let i = 0; i < targetLength; i++) {
      const pos = (i / targetLength) * channelData.length;
      resampled[i] = channelData[Math.floor(pos)];
    }
    channelData = resampled;
  }

  const processedLength = Math.ceil(targetLength / byteProcessingInterval);
  const quantized = new Float32Array(processedLength);
  const lsb = 2 / 15; // 4-bit has 16 levels (-1 to 1 range is size 2. 2/15 is the step)
  let error = 0;

  for (let i = 0, outIdx = 0; i < targetLength; i += byteProcessingInterval, outIdx++) {
    let sample = channelData[i];

    // Noise Gate
    if (Math.abs(sample) < gate) {
      sample = 0;
    }

    // Dither
    if (dither > 0 && sample !== 0) {
      sample += (Math.random() - 0.5) * lsb * dither;
    }

    // Noise Shaping (Error Feedback)
    if (useNoiseShaping) {
      sample += error * 0.8; 
    }

    sample = Math.max(-1, Math.min(1, sample));
    const quantizedInt = Math.round((sample + 1) / 2 * 15);
    const quantizedSample = (quantizedInt / 15) * 2 - 1;
    
    if (useNoiseShaping) {
      error = sample - quantizedSample;
    }

    if (outIdx < processedLength) {
      quantized[outIdx] = quantizedSample;
    }
  }
  return quantized;
}

function get4BitIntArray(quantizedFloat: Float32Array): Uint8Array {
  const arr = new Uint8Array(quantizedFloat.length);
  for (let i = 0; i < quantizedFloat.length; i++) {
    arr[i] = Math.round((quantizedFloat[i] + 1) / 2 * 15);
  }
  return arr;
}

function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length);
  const view = new DataView(buffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true); // Byte rate (sampleRate * blockAlign)
  view.setUint16(32, 1, true); // Block align
  view.setUint16(34, 8, true); // Bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset++) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    // 8-bit WAV is unsigned: 0..255, 128 is silence
    let v = Math.round((s + 1) * 127.5);
    view.setUint8(offset, v);
  }

  return new Blob([view], { type: 'audio/wav' });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- Components ---

const FineSlider = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  unit = "", 
  className = "",
  precision = 10
}: { 
  label: string, 
  value: number, 
  min: number, 
  max: number, 
  step: number, 
  onChange: (v: number) => void, 
  unit?: string,
  className?: string,
  precision?: number
}) => {
  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(Number(newValue.toFixed(precision)));
  };
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(Number(newValue.toFixed(precision)));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-amber-400">{Number(value.toFixed(precision))} {unit}</span>
      </label>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleDecrement}
          className="p-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded border border-neutral-700 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={e => onChange(Number(parseFloat(e.target.value).toFixed(precision)))}
          className="flex-1 accent-amber-500"
        />
        <button 
          onClick={handleIncrement}
          className="p-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded border border-neutral-700 transition-colors"
        >
          <span className="w-4 h-4 flex items-center justify-center font-bold">+</span>
        </button>
      </div>
    </div>
  );
};

const OriginalWaveform = ({ 
  buffer, 
  selection, 
  viewStart, 
  viewEnd, 
  playbackPosition,
  onSelectionChange,
  onZoomChange,
  onPanChange,
  t
}: { 
  buffer: AudioBuffer, 
  selection: {start: number, end: number}, 
  viewStart: number,
  viewEnd: number,
  playbackPosition: number | null,
  onSelectionChange: (s: {start: number, end: number}) => void,
  onZoomChange: (z: (prev: number) => number) => void,
  onPanChange: (p: (prev: number) => number) => void,
  t: any
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragMode, setDragMode] = useState<'none' | 'start' | 'end' | 'new'>('none');
  const [dragOrigin, setDragOrigin] = useState(0);
  const [hoverMode, setHoverMode] = useState<'none' | 'start' | 'end'>('none');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !buffer) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const data = buffer.getChannelData(0);
    
    const startSample = Math.max(0, Math.floor(viewStart * buffer.sampleRate));
    const endSample = Math.min(data.length, Math.floor(viewEnd * buffer.sampleRate));
    const samplesToDraw = endSample - startSample;
    
    if (samplesToDraw <= 0) return;

    const step = Math.max(1, Math.floor(samplesToDraw / width));
    const amp = height / 2;

    ctx.fillStyle = '#10b981'; 
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      const offset = startSample + i * step;
      
      for (let j = 0; j < step; j++) {
        if (offset + j < data.length) {
          const datum = data[offset + j];
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }
      }
      
      if (min <= max) {
        ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
      }
    }

    // Draw selection
    const selStartX = ((selection.start - viewStart) / (viewEnd - viewStart)) * width;
    const selEndX = ((selection.end - viewStart) / (viewEnd - viewStart)) * width;
    
    const drawStartX = Math.max(0, selStartX);
    const drawEndX = Math.min(width, selEndX);
    
    if (drawEndX > drawStartX) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.fillRect(drawStartX, 0, drawEndX - drawStartX, height);
    }

    // Draw handles
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;

    const drawHandle = (x: number) => {
      if (x >= -2 && x <= width + 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Top triangle
        ctx.beginPath();
        ctx.moveTo(x - 6, 0);
        ctx.lineTo(x + 6, 0);
        ctx.lineTo(x, 8);
        ctx.fill();

        // Bottom triangle
        ctx.beginPath();
        ctx.moveTo(x - 6, height);
        ctx.lineTo(x + 6, height);
        ctx.lineTo(x, height - 8);
        ctx.fill();
      }
    };

    if (selection.start >= viewStart && selection.start <= viewEnd) drawHandle(selStartX);
    if (selection.end >= viewStart && selection.end <= viewEnd) drawHandle(selEndX);

    // Draw playback line
    if (playbackPosition !== null && playbackPosition >= viewStart && playbackPosition <= viewEnd) {
      const x = ((playbackPosition - viewStart) / (viewEnd - viewStart)) * width;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

  }, [buffer, selection, viewStart, viewEnd, playbackPosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e: WheelEvent) => {
      if (!buffer) return;
      e.preventDefault();
      
      const zoomFactor = 1.1;
      if (e.deltaY < 0) {
        onZoomChange(prev => Math.min(1000, prev * zoomFactor));
      } else {
        onZoomChange(prev => Math.max(1, prev / zoomFactor));
      }
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [buffer, onZoomChange]);

  const getEventData = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !buffer) return { sec: 0, x: 0, width: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
    } else {
        clientX = (e as React.MouseEvent).clientX;
    }
    const x = clientX - rect.left;
    const sec = viewStart + (x / rect.width) * (viewEnd - viewStart);
    return { sec: Math.max(0, Math.min(buffer.duration, sec)), x, width: rect.width };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const { sec, x, width } = getEventData(e);
    const selStartX = ((selection.start - viewStart) / (viewEnd - viewStart)) * width;
    const selEndX = ((selection.end - viewStart) / (viewEnd - viewStart)) * width;

    const HANDLE_WIDTH = 12;

    if (Math.abs(x - selStartX) <= HANDLE_WIDTH) {
      setDragMode('start');
    } else if (Math.abs(x - selEndX) <= HANDLE_WIDTH) {
      setDragMode('end');
    } else {
      setDragMode('new');
      setDragOrigin(sec);
      onSelectionChange({ start: sec, end: sec });
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { sec, x, width } = getEventData(e);

    if (dragMode === 'none') {
      const selStartX = ((selection.start - viewStart) / (viewEnd - viewStart)) * width;
      const selEndX = ((selection.end - viewStart) / (viewEnd - viewStart)) * width;
      const HANDLE_WIDTH = 12;

      if (Math.abs(x - selStartX) <= HANDLE_WIDTH) {
        setHoverMode('start');
      } else if (Math.abs(x - selEndX) <= HANDLE_WIDTH) {
        setHoverMode('end');
      } else {
        setHoverMode('none');
      }
      return;
    }

    if (dragMode === 'start') {
      onSelectionChange({ start: Math.min(sec, selection.end - 0.001), end: selection.end });
    } else if (dragMode === 'end') {
      onSelectionChange({ start: selection.start, end: Math.max(sec, selection.start + 0.001) });
    } else if (dragMode === 'new') {
      if (sec < dragOrigin) {
        onSelectionChange({ start: sec, end: dragOrigin });
      } else {
        onSelectionChange({ start: dragOrigin, end: sec });
      }
    }
  };

  const handleEnd = () => {
    setDragMode('none');
  };

  const zoomToSelection = () => {
    if (!buffer || selection.end <= selection.start) return;
    
    const selDuration = selection.end - selection.start;
    const newZoom = buffer.duration / selDuration;
    onZoomChange(() => newZoom);
    
    const viewDuration = buffer.duration / newZoom;
    const maxPan = buffer.duration - viewDuration;
    if (maxPan > 0) {
      const newPan = (selection.start / maxPan) * 100;
      onPanChange(() => Math.max(0, Math.min(100, newPan)));
    } else {
      onPanChange(() => 0);
    }
  };

  let cursorClass = 'cursor-crosshair';
  if (hoverMode === 'start' || hoverMode === 'end' || dragMode === 'start' || dragMode === 'end') {
    cursorClass = 'cursor-ew-resize';
  }

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        width={800}
        height={150}
        className={`w-full h-[150px] bg-neutral-950 rounded-lg border border-neutral-800 touch-none ${cursorClass}`}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
      />
      <button
        onClick={zoomToSelection}
        className="absolute top-2 right-2 p-2 bg-neutral-900/80 hover:bg-emerald-600 text-white rounded-lg border border-neutral-700 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs"
        title={t.zoomToSelection}
      >
        <ZoomIn className="w-4 h-4" />
        {t.zoomToSelection}
      </button>
    </div>
  );
};

const ConvertedWaveform = ({ data, playbackPosition, targetSampleRate }: { data: Float32Array | null, playbackPosition: number | null, targetSampleRate: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#262626'; 
    ctx.lineWidth = 1;
    for (let i = 0; i <= 15; i++) {
      const y = (i / 15) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!data || data.length === 0) return;

    const step = data.length / width;
    
    ctx.strokeStyle = '#f59e0b'; 
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < width; i++) {
      const idx = Math.floor(i * step);
      const val = data[idx]; 
      const y = (1 - (val + 1) / 2) * height;
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.stroke();

    // Draw playback line
    if (playbackPosition !== null) {
      const duration = data.length / targetSampleRate;
      if (playbackPosition >= 0 && playbackPosition <= duration) {
        const x = (playbackPosition / duration) * width;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }
  }, [data, playbackPosition, targetSampleRate]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={150}
      className="w-full h-[150px] bg-neutral-950 rounded-lg border border-neutral-800"
    />
  );
};

export default function App() {
  const [lang, setLang] = useState<'hu' | 'en'>('hu');
  const t = dict[lang];

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selection, setSelection] = useState<{start: number, end: number}>({start: 0, end: 0});
  
  // Audio processing states
  const [gain, setGain] = useState<number>(1.0);
  const [lowpass, setLowpass] = useState<number>(2000);
  const [highpass, setHighpass] = useState<number>(0);
  const [dither, setDither] = useState<number>(0.5);
  const [gate, setGate] = useState<number>(0.0);
  const [compressor, setCompressor] = useState<number>(0);
  const [preEmphasis, setPreEmphasis] = useState<number>(0);
  const [noiseShaping, setNoiseShaping] = useState<boolean>(true);
  const [targetSampleRate, setTargetSampleRate] = useState<number>(4000);
  
  // View states
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<number>(0); // 0 to 100
  
  const [graphicsMode, setGraphicsMode] = useState<string>('16');
  const [nibbleOrder, setNibbleOrder] = useState<'upperLower' | 'lowerUpper'>('lowerUpper');
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [customRate, setCustomRate] = useState<number>(5085);
  const [presets, setPresets] = useState<boolean[]>([false, false, false]);
  const [isTrseCompatible, setIsTrseCompatible] = useState<boolean>(true);
  const [quantizedData, setQuantizedData] = useState<Float32Array | null>(null);
  const [byteProcessingInterval, setByteProcessingInterval] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingConverted, setIsPlayingConverted] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState<number | null>(null);

  useEffect(() => {
    const newPresets = [false, false, false];
    for (let i = 0; i < 3; i++) {
      if (localStorage.getItem(`tvc_preset_${i}`)) {
        newPresets[i] = true;
      }
    }
    setPresets(newPresets);
  }, []);

  const savePreset = (index: number) => {
    const presetData = {
      gain, lowpass, highpass, dither, gate, compressor, preEmphasis, noiseShaping,
      targetSampleRate, isCustomRate, customRate, graphicsMode, nibbleOrder, isTrseCompatible, byteProcessingInterval
    };
    localStorage.setItem(`tvc_preset_${index}`, JSON.stringify(presetData));
    const newPresets = [...presets];
    newPresets[index] = true;
    setPresets(newPresets);
  };

  const loadPreset = (index: number) => {
    const dataStr = localStorage.getItem(`tvc_preset_${index}`);
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        if (data.gain !== undefined) setGain(data.gain);
        if (data.lowpass !== undefined) setLowpass(data.lowpass);
        if (data.highpass !== undefined) setHighpass(data.highpass);
        if (data.dither !== undefined) setDither(data.dither);
        if (data.gate !== undefined) setGate(data.gate);
        if (data.compressor !== undefined) setCompressor(data.compressor);
        if (data.preEmphasis !== undefined) setPreEmphasis(data.preEmphasis);
        if (data.noiseShaping !== undefined) setNoiseShaping(data.noiseShaping);
        if (data.targetSampleRate !== undefined) setTargetSampleRate(data.targetSampleRate);
        if (data.isCustomRate !== undefined) setIsCustomRate(data.isCustomRate);
        if (data.customRate !== undefined) setCustomRate(data.customRate);
        if (data.graphicsMode !== undefined) setGraphicsMode(data.graphicsMode);
        if (data.nibbleOrder !== undefined) setNibbleOrder(data.nibbleOrder);
        if (data.isTrseCompatible !== undefined) setIsTrseCompatible(data.isTrseCompatible);
        if (data.byteProcessingInterval !== undefined) setByteProcessingInterval(data.byteProcessingInterval);
      } catch (e) {
        console.error("Failed to load preset", e);
      }
    }
  };

  const deletePreset = (index: number) => {
    localStorage.removeItem(`tvc_preset_${index}`);
    const newPresets = [...presets];
    newPresets[index] = false;
    setPresets(newPresets);
  };

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const playbackStartTimeRef = useRef<number>(0);
  const playbackOffsetRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);

  // Sync scrollbar when pan changes externally
  useEffect(() => {
    if (scrollbarRef.current) {
      const target = scrollbarRef.current;
      const maxScroll = target.scrollWidth - target.clientWidth;
      const expectedScrollLeft = (pan / 100) * maxScroll;
      if (Math.abs(target.scrollLeft - expectedScrollLeft) > 1) {
        target.scrollLeft = expectedScrollLeft;
      }
    }
  }, [pan, zoom]);

  const updatePlaybackPosition = useCallback(() => {
    if (!audioCtxRef.current) return;
    const elapsed = audioCtxRef.current.currentTime - playbackStartTimeRef.current;
    setPlaybackPosition(playbackOffsetRef.current + elapsed);
    animationFrameRef.current = requestAnimationFrame(updatePlaybackPosition);
  }, []);

  const stopAll = useCallback(() => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch (e) {}
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPlayingOriginal(false);
    setIsPlayingConverted(false);
    setPlaybackPosition(null);
  }, []);

  const playOriginal = () => {
    stopAll();
    if (!audioCtxRef.current || !audioBuffer) return;
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtxRef.current.destination);
    
    const start = selection.start;
    const duration = selection.end - selection.start;
    
    playbackStartTimeRef.current = audioCtxRef.current.currentTime;
    playbackOffsetRef.current = start;
    
    source.start(0, start, duration);
    source.onended = () => {
      setIsPlayingOriginal(false);
      setPlaybackPosition(null);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    sourceNodeRef.current = source;
    setIsPlayingOriginal(true);
    animationFrameRef.current = requestAnimationFrame(updatePlaybackPosition);
  };

  const createSafeAudioBuffer = (ctx: AudioContext, data: Float32Array, rate: number) => {
    if (rate >= 3000) {
      const buffer = ctx.createBuffer(1, data.length, rate);
      buffer.copyToChannel(data, 0);
      return buffer;
    } else {
      // Upsample by repeating to reach a safe rate
      const factor = Math.ceil(3000 / rate);
      const safeRate = rate * factor;
      const safeData = new Float32Array(data.length * factor);
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < factor; j++) {
          safeData[i * factor + j] = data[i];
        }
      }
      const buffer = ctx.createBuffer(1, safeData.length, safeRate);
      buffer.copyToChannel(safeData, 0);
      return buffer;
    }
  };

  const playConverted = () => {
    stopAll();
    if (!audioCtxRef.current || !quantizedData || !audioBuffer) return;
    const buffer = createSafeAudioBuffer(audioCtxRef.current, quantizedData, targetSampleRate);
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtxRef.current.destination);
    
    playbackStartTimeRef.current = audioCtxRef.current.currentTime;
    playbackOffsetRef.current = 0;
    
    source.start();
    source.onended = () => {
      setIsPlayingConverted(false);
      setPlaybackPosition(null);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    sourceNodeRef.current = source;
    setIsPlayingConverted(true);
    animationFrameRef.current = requestAnimationFrame(updatePlaybackPosition);
  };

  const isPlayingConvertedRef = useRef(isPlayingConverted);
  useEffect(() => {
    isPlayingConvertedRef.current = isPlayingConverted;
  }, [isPlayingConverted]);

  useEffect(() => {
    if (isPlayingConvertedRef.current && quantizedData && audioCtxRef.current) {
      const currentPos = playbackOffsetRef.current + (audioCtxRef.current.currentTime - playbackStartTimeRef.current);
      const duration = quantizedData.length / targetSampleRate;
      
      if (sourceNodeRef.current) {
        sourceNodeRef.current.onended = null;
        try { sourceNodeRef.current.stop(); } catch (e) {}
      }

      if (currentPos >= duration) {
        setIsPlayingConverted(false);
        setPlaybackPosition(null);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        return;
      }
      
      const buffer = createSafeAudioBuffer(audioCtxRef.current, quantizedData, targetSampleRate);
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      
      playbackStartTimeRef.current = audioCtxRef.current.currentTime;
      playbackOffsetRef.current = currentPos;
      
      source.start(0, currentPos);
      source.onended = () => {
        setIsPlayingConverted(false);
        setPlaybackPosition(null);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
      sourceNodeRef.current = source;
    }
  }, [quantizedData, targetSampleRate]);

  const debouncedSelection = useDebounce(selection, 300);
  const debouncedGain = useDebounce(gain, 300);
  const debouncedLowpass = useDebounce(lowpass, 300);
  const debouncedHighpass = useDebounce(highpass, 300);
  const debouncedDither = useDebounce(dither, 300);
  const debouncedGate = useDebounce(gate, 300);
  const debouncedCompressor = useDebounce(compressor, 300);
  const debouncedPreEmphasis = useDebounce(preEmphasis, 300);
  const debouncedNoiseShaping = useDebounce(noiseShaping, 300);
  const debouncedTargetSampleRate = useDebounce(targetSampleRate, 300);
  const debouncedByteProcessingInterval = useDebounce(byteProcessingInterval, 300);

  // Calculate view window
  const viewDuration = audioBuffer ? audioBuffer.duration / zoom : 0;
  const maxPan = audioBuffer ? audioBuffer.duration - viewDuration : 0;
  const viewStart = (pan / 100) * maxPan;
  const viewEnd = viewStart + viewDuration;

  useEffect(() => {
    if (!audioBuffer) return;
    if (debouncedSelection.end <= debouncedSelection.start) return;

    let isCancelled = false;
    setIsProcessing(true);

    processAudio(
      audioBuffer, 
      debouncedSelection.start, 
      debouncedSelection.end, 
      debouncedGain, 
      debouncedLowpass, 
      debouncedHighpass,
      debouncedDither,
      debouncedGate,
      debouncedCompressor,
      debouncedPreEmphasis,
      debouncedNoiseShaping,
      debouncedTargetSampleRate,
      debouncedByteProcessingInterval
    ).then(data => {
        if (!isCancelled) {
          setQuantizedData(data);
          setIsProcessing(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [audioBuffer, debouncedSelection, debouncedGain, debouncedLowpass, debouncedHighpass, debouncedDither, debouncedGate, debouncedCompressor, debouncedPreEmphasis, debouncedNoiseShaping, debouncedTargetSampleRate, debouncedByteProcessingInterval]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await loadFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await loadFile(file);
  };

  const loadFile = async (file: File) => {
    try {
      setFileName(file.name);
      const arrayBuffer = await file.arrayBuffer();
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const buffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
      setSelection({ start: 0, end: Math.min(buffer.duration, 10) });
      setZoom(1);
      setPan(0);
    } catch (error) {
      console.error("Failed to decode audio data:", error);
      alert(t.errorDecoding || "Nem támogatott vagy hibás audio fájl.");
      setFileName("");
    }
  };

  const normalizeAudio = useCallback(() => {
    if (!audioBuffer) return;
    
    const startSample = Math.max(0, Math.floor(selection.start * audioBuffer.sampleRate));
    const endSample = Math.min(audioBuffer.length, Math.floor(selection.end * audioBuffer.sampleRate));
    const data = audioBuffer.getChannelData(0);
    
    let maxAmp = 0;
    for (let i = startSample; i < endSample; i++) {
      const abs = Math.abs(data[i]);
      if (abs > maxAmp) maxAmp = abs;
    }
    
    if (maxAmp > 0) {
      const targetGain = 0.99 / maxAmp; // Leave a tiny bit of headroom
      setGain(Number(targetGain.toFixed(2)));
    }
  }, [audioBuffer, selection]);

  const trimSilence = useCallback(() => {
    if (!audioBuffer || !audioCtxRef.current) return;
    
    const data = audioBuffer.getChannelData(0);
    const threshold = 0.01; // roughly -40dB
    
    let startSample = 0;
    for (let i = 0; i < data.length; i++) {
      if (Math.abs(data[i]) > threshold) {
        startSample = i;
        break;
      }
    }
    
    let endSample = data.length - 1;
    for (let i = data.length - 1; i >= 0; i--) {
      if (Math.abs(data[i]) > threshold) {
        endSample = i;
        break;
      }
    }
    
    if (startSample >= endSample) {
      return; // All silence or very short
    }
    
    const newLength = endSample - startSample;
    const newBuffer = audioCtxRef.current.createBuffer(1, newLength, audioBuffer.sampleRate);
    newBuffer.getChannelData(0).set(data.subarray(startSample, endSample));
    
    setAudioBuffer(newBuffer);
    setSelection({ start: 0, end: newBuffer.duration });
    setZoom(1);
    setPan(0);
  }, [audioBuffer]);

  const exportPacked = () => {
    if (!quantizedData) return;
    const ints = get4BitIntArray(quantizedData);
    
    const packedLen = Math.ceil(ints.length / 2);
    const packed = new Uint8Array(isTrseCompatible ? packedLen + 1 : packedLen);
    for (let i = 0; i < ints.length; i += 2) {
      const first = ints[i];
      const second = i + 1 < ints.length ? ints[i + 1] : 0;
      let val = 0;
      if (nibbleOrder === 'upperLower') {
        val = (first << 4) | second;
      } else {
        val = (second << 4) | first;
      }
      if (isTrseCompatible && val === 0) {
        val = 7;
      }
      packed[i / 2] = val;
    }
    if (isTrseCompatible) {
      packed[packedLen] = 0;
    }
    const baseName = fileName.split('.').slice(0, -1).join('.') || 'audio';
    const freq = (targetSampleRate / 1000).toFixed(1) + 'kHz';
    downloadBlob(new Blob([packed], { type: 'application/octet-stream' }), `${baseName}_4bit_${freq}_packed.bin`);
  };

  const exportUnpacked = () => {
    if (!quantizedData) return;
    const ints = get4BitIntArray(quantizedData);
    
    const unpacked = new Uint8Array(ints.length);
    
    let lowerBits = 0;
    if (graphicsMode === '2') lowerBits = 0; // 00b
    else if (graphicsMode === '4') lowerBits = 1; // 01b
    else if (graphicsMode === '16') lowerBits = 3; // 11b

    for (let i = 0; i < ints.length; i++) {
      let val = (ints[i] << 2) | lowerBits;
      unpacked[i] = val;
    }
    if (isTrseCompatible && ints.length > 0) {
      unpacked[ints.length - 1] |= (1 << 6);
    }
    
    const baseName = fileName.split('.').slice(0, -1).join('.') || 'audio';
    const freq = (targetSampleRate / 1000).toFixed(1) + 'kHz';
    downloadBlob(new Blob([unpacked], { type: 'application/octet-stream' }), `${baseName}_4bit_${freq}_unpacked_g${graphicsMode}.bin`);
  };

  const exportWav = () => {
    if (!quantizedData || !audioBuffer) return;
    const blob = encodeWAV(quantizedData, targetSampleRate);
    const baseName = fileName.split('.').slice(0, -1).join('.') || 'audio';
    const freq = (targetSampleRate / 1000).toFixed(1) + 'kHz';
    downloadBlob(blob, `${baseName}_4bit_${freq}.wav`);
  };

  const handleReset = () => {
    stopAll();
    setAudioBuffer(null);
    setFileName('');
    setQuantizedData(null);
    setSelection({start: 0, end: 0});
    setZoom(1);
    setPan(0);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-400">{t.title}</h1>
            <p className="text-neutral-400 mt-2">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition-colors flex items-center justify-center"
              title={t.helpTitle}
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            {audioBuffer && (
              <button 
                onClick={handleReset}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition-colors flex items-center gap-2 text-sm"
              >
                <FilePlus className="w-4 h-4" />
                {t.newAudio}
              </button>
            )}
            <button 
              onClick={() => setLang(lang === 'hu' ? 'en' : 'hu')}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Globe className="w-4 h-4" />
              {lang === 'hu' ? 'EN' : 'HU'}
            </button>
          </div>
        </header>

        {!audioBuffer ? (
          <div 
            className="border-2 border-dashed border-neutral-700 rounded-xl p-8 md:p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-neutral-900"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-12 h-12 mx-auto text-neutral-500 mb-4" />
            <p className="text-lg">{t.dropzone}</p>
            <input id="file-upload" type="file" accept=".wav,.mp3,.ogg,.flac,.aac,.m4a,audio/wav,audio/mpeg,audio/ogg,audio/flac,audio/aac,audio/mp4" className="hidden" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="space-y-8">
            <section className="space-y-4 bg-neutral-900 p-4 md:p-6 rounded-xl border border-neutral-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                <h2 className="text-xl font-semibold flex items-center gap-2 min-w-0 w-full">
                  <FileAudio className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="truncate">{t.originalAudio} ({fileName})</span>
                </h2>
                <button 
                  onClick={isPlayingOriginal ? stopAll : playOriginal}
                  className={`w-full sm:w-auto sm:min-w-[220px] shrink-0 px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${isPlayingOriginal ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}
                >
                  {isPlayingOriginal ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlayingOriginal ? t.stop : t.playSelected}
                </button>
              </div>
              
              <div className="space-y-1">
                <OriginalWaveform 
                  buffer={audioBuffer} 
                  selection={selection} 
                  viewStart={viewStart}
                  viewEnd={viewEnd}
                  playbackPosition={isPlayingOriginal ? playbackPosition : null}
                  onSelectionChange={setSelection}
                  onZoomChange={setZoom}
                  onPanChange={setPan}
                  t={t}
                />

                <div 
                  ref={scrollbarRef}
                  className={`w-full overflow-x-auto overflow-y-hidden h-4 rounded bg-neutral-800 custom-scrollbar ${zoom === 1 ? "opacity-30 pointer-events-none" : ""}`}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    const maxScroll = target.scrollWidth - target.clientWidth;
                    if (maxScroll > 0) {
                      setPan((target.scrollLeft / maxScroll) * 100);
                    }
                  }}
                >
                  <div style={{ width: `${zoom * 100}%`, height: '1px' }} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">{t.sampleRate}</div>
                  <div className="text-emerald-400 font-mono text-lg">{targetSampleRate} Hz</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">{t.estimatedSize}</div>
                  <div className="text-amber-400 font-mono text-lg">
                    {Math.ceil((quantizedData?.length || 0) / 2)} / {quantizedData?.length || 0} {t.bytes}
                  </div>
                  <div className="text-[10px] text-neutral-600">(Packed / Unpacked)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">{t.selection}</div>
                  <div className="text-blue-400 font-mono text-lg">{(selection.end - selection.start).toFixed(3)}s</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
                {/* View Controls (Zoom & Pan) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">{t.viewZoomPan}</h3>
                    <button 
                      onClick={() => { setZoom(1); setPan(0); }}
                      className="text-[10px] px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 transition-colors"
                    >
                      {t.showAll}
                    </button>
                  </div>
                  <FineSlider 
                    label={t.zoom}
                    value={zoom}
                    min={1}
                    max={1000}
                    step={0.1}
                    onChange={setZoom}
                    unit="x"
                    precision={1}
                  />
                  <button 
                    onClick={trimSilence}
                    className="w-full px-3 py-1.5 mt-2 bg-neutral-800 hover:bg-neutral-700 text-blue-400 rounded-lg border border-neutral-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    title={t.trimSilenceTitle}
                  >
                    <Scissors className="w-4 h-4" />
                    {t.trimSilence}
                  </button>
                </div>

                {/* Selection Controls */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">{t.selection}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelection({ start: 0, end: audioBuffer.duration })}
                        className="text-[10px] px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 transition-colors"
                      >
                        {t.selectAll}
                      </button>
                      <button 
                        onClick={() => setSelection({ start: 0, end: 0 })}
                        className="text-[10px] px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 transition-colors"
                      >
                        {t.clearSelection}
                      </button>
                    </div>
                  </div>
                  <FineSlider 
                    label={t.start}
                    value={Number(selection.start.toFixed(3))}
                    min={0}
                    max={audioBuffer.duration}
                    step={0.01}
                    onChange={v => setSelection(s => ({ ...s, start: Math.min(v, s.end - 0.001) }))}
                    unit="s"
                    precision={3}
                  />
                  <FineSlider 
                    label={t.end}
                    value={Number(selection.end.toFixed(3))}
                    min={0}
                    max={audioBuffer.duration}
                    step={0.01}
                    onChange={v => setSelection(s => ({ ...s, end: Math.max(v, s.start + 0.001) }))}
                    unit="s"
                    precision={3}
                  />
                </div>
              </div>
            </section>

            <section className="bg-neutral-900 p-4 md:p-6 rounded-xl border border-neutral-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-amber-400" />
                  {t.convSettings}
                </h3>
                <button 
                  onClick={normalizeAudio}
                  className="w-full sm:w-auto px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-lg border border-neutral-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  title={t.normalizeTitle}
                >
                  <Maximize className="w-4 h-4" />
                  {t.normalize}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FineSlider 
                  label={t.gain}
                  value={gain}
                  min={0.1}
                  max={10}
                  step={0.1}
                  onChange={setGain}
                  unit="x"
                  precision={1}
                />

                <FineSlider 
                  label={t.lowpass}
                  value={lowpass}
                  min={500}
                  max={22050}
                  step={100}
                  onChange={setLowpass}
                  unit="Hz"
                  precision={0}
                />

                <FineSlider 
                  label={t.highpass}
                  value={highpass}
                  min={0}
                  max={10000}
                  step={50}
                  onChange={setHighpass}
                  unit="Hz"
                  precision={0}
                />

                <FineSlider 
                  label={t.dither}
                  value={dither}
                  min={0}
                  max={2}
                  step={0.05}
                  onChange={setDither}
                  precision={2}
                />

                <FineSlider 
                  label={t.gate}
                  value={gate}
                  min={0}
                  max={0.5}
                  step={0.01}
                  onChange={setGate}
                  precision={2}
                />

                <FineSlider 
                  label={t.compressor}
                  value={compressor}
                  min={0}
                  max={100}
                  step={1}
                  onChange={setCompressor}
                  unit="%"
                  precision={0}
                />

                <FineSlider 
                  label={t.preEmphasis}
                  value={preEmphasis}
                  min={0}
                  max={20}
                  step={1}
                  onChange={setPreEmphasis}
                  unit="dB"
                  precision={0}
                />

                <div className="space-y-2 flex items-center pt-5">
                  <label className="flex items-center gap-3 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={noiseShaping} 
                      onChange={e => setNoiseShaping(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                    <span>{t.noiseShaping}</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex justify-between text-sm">
                    <span title={t.sampleRateTitle}>{t.sampleRate}</span>
                    <span className="text-amber-400">{(targetSampleRate / 1000).toFixed(1)} kHz</span>
                  </label>
                  <select 
                    value={isCustomRate ? "custom" : targetSampleRate}
                    onChange={e => {
                      if (e.target.value === "custom") {
                        setIsCustomRate(true);
                        setTargetSampleRate(customRate);
                      } else {
                        setIsCustomRate(false);
                        setTargetSampleRate(parseInt(e.target.value));
                      }
                    }}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  >
                    <option value={2000}>2 kHz</option>
                    <option value={4000}>4 kHz</option>
                    <option value={8000}>8 kHz</option>
                    <option value={11025}>11.025 kHz</option>
                    <option value={22050}>22.05 kHz</option>
                    <option value={44100}>44.1 kHz</option>
                    <option value="custom">{t.customFreq}</option>
                  </select>
                  {isCustomRate && (
                    <div className="flex items-center gap-2 mt-2">
                      <input 
                        type="number" 
                        value={customRate}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          setCustomRate(val || 0);
                          if (val > 0) setTargetSampleRate(val);
                        }}
                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        min="1"
                        max="192000"
                      />
                      <span className="text-sm text-neutral-400">Hz</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex justify-between text-sm">
                    <span title={t.byteProcessingIntervalDesc}>{t.byteProcessingInterval}</span>
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(interval => (
                      <button
                        key={interval}
                        onClick={() => setByteProcessingInterval(interval)}
                        className={`flex-1 py-2 px-1 rounded-md text-xs font-bold transition-all border whitespace-nowrap ${
                          byteProcessingInterval === interval 
                            ? 'bg-amber-500 border-amber-400 text-neutral-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] ring-1 ring-amber-400/50' 
                            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
                        }`}
                      >
                        {interval}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-800 space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">{t.preset}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map(index => (
                      <div key={index} className="flex flex-col gap-1">
                        <button
                          onClick={() => savePreset(index)}
                          className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs transition-colors border border-neutral-700"
                        >
                          {t.savePreset} {index + 1}
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => loadPreset(index)}
                            disabled={!presets[index]}
                            className="w-full py-1.5 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded text-xs transition-colors border border-amber-500/30 disabled:opacity-30 disabled:hover:bg-amber-500/20"
                          >
                            {t.loadPreset} {index + 1}
                          </button>
                          {presets[index] && (
                            <button
                              onClick={() => deletePreset(index)}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm transition-colors"
                              title="Delete preset"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4 bg-neutral-900 p-4 md:p-6 rounded-xl border border-neutral-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                <h2 className="text-xl font-semibold flex items-center gap-2 min-w-0 w-full">
                  <FileAudio className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="truncate">{t.convertedAudio}</span>
                </h2>
                <button 
                  onClick={isPlayingConverted ? stopAll : playConverted}
                  disabled={isProcessing || !quantizedData}
                  className={`w-full sm:w-auto sm:min-w-[220px] shrink-0 px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 ${isPlayingConverted ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'}`}
                >
                  {isPlayingConverted ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlayingConverted ? t.stop : t.play4bit}
                </button>
              </div>
              <div className="relative">
                <ConvertedWaveform 
                  data={quantizedData} 
                  playbackPosition={isPlayingConverted ? playbackPosition : null}
                  targetSampleRate={targetSampleRate}
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center rounded-lg">
                    <span className="text-amber-400 font-medium animate-pulse">{t.converting}</span>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-6 bg-neutral-900 p-4 md:p-6 rounded-xl border border-neutral-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-400" />
                  {t.save}
                </h2>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isTrseCompatible}
                        onChange={(e) => setIsTrseCompatible(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isTrseCompatible ? 'bg-blue-500' : 'bg-neutral-700'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isTrseCompatible ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                      {t.trseCompatible}
                    </span>
                  </label>
                  <div className="relative group/tooltip">
                    <HelpCircle className="w-4 h-4 text-neutral-500 hover:text-blue-400 cursor-help transition-colors" />
                    <div className="absolute bottom-full right-0 mb-2 w-[400px] p-3 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10">
                      <pre className="text-xs text-blue-300 font-mono whitespace-pre-wrap break-words">
                        {t.trseCodeSnippet}
                      </pre>
                      <div className="absolute -bottom-2 right-2 border-8 border-transparent border-t-neutral-800"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={exportWav} disabled={!quantizedData} className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors disabled:opacity-50 text-left space-y-1">
                  <div className="font-medium text-blue-400">{t.wavFormat}</div>
                  <div className="text-xs text-neutral-400">{t.standardAudio}</div>
                </button>
                
                <div className="flex flex-col bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
                  <button onClick={exportPacked} disabled={!quantizedData} className="p-4 w-full text-left transition-colors hover:bg-neutral-700 disabled:opacity-50 group">
                    <div className="font-medium text-blue-400 group-hover:text-blue-300 transition-colors">{t.tvcPacked}</div>
                    <div className="text-xs text-neutral-400 mt-1 group-hover:text-neutral-300 transition-colors">{t.byte2samples}</div>
                  </button>
                  
                  <div className="px-4 pb-4">
                    <div className="pt-4 border-t border-neutral-700">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">{t.nibbleOrder}</label>
                      </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setNibbleOrder('upperLower')}
                        className={`flex-1 py-2.5 px-1 rounded-md text-[10px] font-black transition-all border whitespace-nowrap uppercase tracking-tighter ${
                          nibbleOrder === 'upperLower' 
                            ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] ring-1 ring-blue-400/50' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
                        }`}
                      >
                        {t.upperLower}
                      </button>
                      <button
                        onClick={() => setNibbleOrder('lowerUpper')}
                        className={`flex-1 py-2.5 px-1 rounded-md text-[10px] font-black transition-all border whitespace-nowrap uppercase tracking-tighter ${
                          nibbleOrder === 'lowerUpper' 
                            ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] ring-1 ring-blue-400/50' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
                        }`}
                      >
                        {t.lowerUpper}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
                  <button onClick={exportUnpacked} disabled={!quantizedData} className="p-4 w-full text-left transition-colors hover:bg-neutral-700 disabled:opacity-50 group">
                    <div className="font-medium text-blue-400 group-hover:text-blue-300 transition-colors">{t.tvcUnpacked}</div>
                    <div className="text-xs text-neutral-400 mt-1 group-hover:text-neutral-300 transition-colors">{t.byte1sample}</div>
                  </button>
                  
                  <div className="px-4 pb-4">
                    <div className="pt-4 border-t border-neutral-700">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">{t.graphicsMode}</label>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-400/10 px-1.5 rounded">MODE {graphicsMode}</span>
                      </div>
                    <div className="flex gap-1.5">
                      {['2', '4', '16'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => setGraphicsMode(mode)}
                          className={`flex-1 py-2.5 px-1 rounded-md text-[10px] font-black transition-all border whitespace-nowrap uppercase tracking-tighter ${
                            graphicsMode === mode 
                              ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] ring-1 ring-blue-400/50' 
                              : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
                          }`}
                        >
                          GRAPHICS {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </div>
        )}
      </div>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <HelpCircle className="w-6 h-6" />
                {t.helpTitle}
              </h2>
              <button 
                onClick={() => setIsHelpOpen(false)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                title={t.helpClose}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto space-y-6">
              <p className="text-neutral-300 leading-relaxed">
                {t.helpIntro}
              </p>
              <div className="space-y-4">
                {t.helpItems.map((item: {title: string, desc: string}, idx: number) => (
                  <div key={idx} className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                    <h3 className="font-semibold text-amber-400 mb-1">{item.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
