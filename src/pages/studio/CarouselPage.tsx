import { useState, useEffect, useRef } from 'react'
import StudioLayout from './StudioLayout'

/* ── Constants ── */
const SLIDE_W = 1080
const CM_FORMATS = [
  { id: '1:1',  label: '1:1',  h: 1080 },
  { id: '4:5',  label: '4:5',  h: 1350 },
  { id: '9:16', label: '9:16', h: 1920 },
]
const CM_TEMPLATES = [
  { id: 'scrapbook', name: 'Scrapbook Love',    desc: 'Warm rotations · Tape shadows · Layered charm' },
  { id: 'polaroid',  name: 'Polaroid Stack',    desc: 'Classic frames · Soft tilt · Caption area' },
  { id: 'minimal',   name: 'Aesthetic Minimal', desc: 'Gradient wash · Centered · Elegant typography' },
  { id: 'story',     name: 'Story Mode',        desc: 'Full-bleed · Dark overlay · Bold captions' },
  { id: 'seamless',  name: 'Seamless Strip',    desc: 'Edge-to-edge · Continuous panorama' },
]
const BG_PRESETS = [
  { id: '#000000', label: 'Black' }, { id: '#ffffff', label: 'White' },
  { id: '#1a0f1e', label: 'Dark' },  { id: '#fdf4e3', label: 'Warm' },
  { id: '#0d1a2a', label: 'Navy' },  { id: 'custom',  label: 'Custom' },
]

/* ── Canvas helpers ── */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath()
}
function drawCoverInRect(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  ctx.drawImage(img, x + (w - img.naturalWidth * s) / 2, y + (h - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s)
}
function seededRand(seed: number) {
  let s = seed ^ 0x9e3779b9
  return () => { s = Math.imul(s ^ (s >>> 16), 0x45d9f3b); s = Math.imul(s ^ (s >>> 16), 0x45d9f3b); return ((s ^ (s >>> 16)) >>> 0) / 0xffffffff }
}
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' '); const lines: string[] = []; let cur = ''
  words.forEach(w => { const test = cur ? cur + ' ' + w : w; if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w } else cur = test })
  if (cur) lines.push(cur); return lines
}
function drawFancyText(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, maxW: number, style: any = {}) {
  if (!text) return
  const { font = `italic 400 52px "Playfair Display",Georgia,serif`, fill = 'rgba(255,255,255,.92)', shadow = true, lineH = 1.35 } = style
  ctx.save(); ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 3 }
  const lines = wrapText(ctx, text, maxW)
  const fs = parseFloat(font); const lh = fs * lineH; const totalH = lh * (lines.length - 1)
  lines.forEach((ln, i) => { ctx.fillStyle = fill; ctx.fillText(ln, cx, cy - totalH / 2 + i * lh) })
  ctx.restore()
}

function renderScrapbook(ctx: CanvasRenderingContext2D, imgs: HTMLImageElement[], W: number, H: number, overlays: any[]) {
  const n = imgs.length; if (!n) return
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#fdf0e0'); bg.addColorStop(.5, '#f8e4c8'); bg.addColorStop(1, '#f0d8b8')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
  ctx.save(); ctx.globalAlpha = .06
  for (let x = 0; x < W; x += 40) for (let y = 0; y < H; y += 40) { ctx.strokeStyle = '#8b6040'; ctx.lineWidth = .5; ctx.strokeRect(x, y, 40, 40) }
  ctx.restore()
  for (let si = 0; si < n; si++) {
    const zoneX = si * SLIDE_W, zoneW = SLIDE_W
    const numPics = Math.min(n > 1 ? 2 : 1, 1 + (si % 2))
    for (let pi = 0; pi < numPics; pi++) {
      const pr = seededRand(si * 13 + pi * 7 + 3)
      const curImg = imgs[(si + pi) % n]
      const pw = Math.round(zoneW * (0.62 + pr() * .14)), ph = Math.round(H * (0.52 + pr() * .14))
      const px = zoneX + Math.round((zoneW - pw) / 2 + (pr() - .5) * zoneW * .18)
      const py = Math.round((H - ph) / 2 + (pr() - .5) * H * .12)
      const angle = (pr() - .5) * (Math.PI / 14)
      ctx.save(); ctx.translate(px + pw / 2, py + ph / 2); ctx.rotate(angle)
      ctx.shadowColor = 'rgba(80,40,10,.28)'; ctx.shadowBlur = 28; ctx.shadowOffsetX = 4; ctx.shadowOffsetY = 8
      const border = Math.round(pw * .04), bottomBorder = Math.round(pw * .1)
      ctx.fillStyle = '#fff8f0'; roundRect(ctx, -pw / 2 - border, -ph / 2 - border, pw + border * 2, ph + border + bottomBorder, 4); ctx.fill()
      ctx.shadowColor = 'transparent'
      ctx.save(); roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 3); ctx.clip(); drawCoverInRect(ctx, curImg, -pw / 2, -ph / 2, pw, ph); ctx.restore()
      ctx.globalAlpha = .08; ctx.fillStyle = 'rgba(200,140,80,1)'; roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 3); ctx.fill(); ctx.globalAlpha = 1
      const tr2 = seededRand(si * 17 + pi)
      ctx.save(); ctx.rotate((tr2() - .5) * .3)
      ctx.fillStyle = `rgba(${180 + Math.round(tr2() * 60)},${160 + Math.round(tr2() * 40)},${100 + Math.round(tr2() * 60)},.55)`
      ctx.fillRect(-22, -ph / 2 - border - 7, 44, 14); ctx.restore(); ctx.restore()
    }
    const ov = overlays.find((o: any) => o.slide === si + 1)
    if (ov?.text) {
      const cx = zoneX + SLIDE_W / 2, cy = ov.pos === 'top' ? H * .08 : ov.pos === 'bottom' ? H * .92 : H * .5
      drawFancyText(ctx, ov.text, cx, cy, SLIDE_W - 100, { font: `italic 500 ${Math.round(H * .038)}px "Playfair Display",Georgia,serif`, fill: 'rgba(80,40,10,.82)', shadow: false })
    }
  }
}

function renderPolaroid(ctx: CanvasRenderingContext2D, imgs: HTMLImageElement[], W: number, H: number, overlays: any[]) {
  const n = imgs.length; if (!n) return
  const bg = ctx.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#ede8df'); bg.addColorStop(1, '#ddd4c4')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
  ctx.save(); ctx.globalAlpha = .04
  for (let x = 16; x < W; x += 32) for (let y = 16; y < H; y += 32) { ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fillStyle = '#6a5040'; ctx.fill() }
  ctx.restore()
  for (let si = 0; si < n; si++) {
    const img = imgs[si], zoneX = si * SLIDE_W, pr = seededRand(si * 11 + 5)
    const angle = (pr() - .5) * (Math.PI / 10)
    const border = Math.round(SLIDE_W * .056), bottomH = Math.round(SLIDE_W * .22)
    const pw = Math.round(SLIDE_W * .7), ph = Math.round(pw * (H / SLIDE_W) * .72)
    const frameW = pw + border * 2, frameH = ph + border + bottomH
    const fx2 = zoneX + (SLIDE_W - frameW) / 2, fy = (H - frameH) / 2 + (pr() - .5) * H * .06
    ctx.save(); ctx.translate(fx2 + frameW / 2, fy + frameH / 2); ctx.rotate(angle)
    ctx.shadowColor = 'rgba(40,20,0,.38)'; ctx.shadowBlur = 38; ctx.shadowOffsetX = 6; ctx.shadowOffsetY = 14
    ctx.fillStyle = '#faf6f0'; roundRect(ctx, -frameW / 2, -frameH / 2, frameW, frameH, 5); ctx.fill()
    ctx.shadowColor = 'transparent'
    ctx.save(); roundRect(ctx, -frameW / 2 + border, -frameH / 2 + border, pw, ph, 3); ctx.clip(); drawCoverInRect(ctx, img, -frameW / 2 + border, -frameH / 2 + border, pw, ph); ctx.restore()
    const ov = overlays.find((o: any) => o.slide === si + 1)
    if (ov?.text) {
      const capFs = Math.round(bottomH * .22)
      ctx.font = `italic 400 ${capFs}px "Cormorant Garamond",Georgia,serif`
      ctx.fillStyle = 'rgba(80,50,30,.72)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(ov.text, 0, frameH / 2 - bottomH / 2, frameW - border * 3)
    }
    ctx.restore()
  }
}

function renderMinimal(ctx: CanvasRenderingContext2D, imgs: HTMLImageElement[], W: number, H: number, overlays: any[]) {
  const n = imgs.length; if (!n) return
  for (let si = 0; si < n; si++) {
    const img = imgs[si], zoneX = si * SLIDE_W, hue = 260 + si * 22
    const bg = ctx.createLinearGradient(zoneX, 0, zoneX + SLIDE_W, H)
    bg.addColorStop(0, `hsl(${hue},28%,88%)`); bg.addColorStop(.5, `hsl(${hue + 30},20%,92%)`); bg.addColorStop(1, `hsl(${hue + 60},25%,87%)`)
    ctx.fillStyle = bg; ctx.fillRect(zoneX, 0, SLIDE_W, H)
    const pad = Math.round(SLIDE_W * .1), ov = overlays.find((o: any) => o.slide === si + 1)
    const hasText = ov?.text, textReserve = hasText ? Math.round(H * .18) : 0
    const imgW = SLIDE_W - pad * 2, imgH = H - pad * 2 - textReserve, imgX = zoneX + pad, imgY = pad
    ctx.save(); ctx.shadowColor = 'rgba(100,80,140,.2)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 12
    roundRect(ctx, imgX, imgY, imgW, imgH, 22); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fill(); ctx.restore()
    ctx.save(); roundRect(ctx, imgX, imgY, imgW, imgH, 22); ctx.clip(); drawCoverInRect(ctx, img, imgX, imgY, imgW, imgH); ctx.restore()
    if (hasText) {
      const cx = zoneX + SLIDE_W / 2, ty = ov.pos === 'top' ? pad * .6 : ov.pos === 'bottom' ? H - textReserve / 2 : imgY + imgH / 2
      drawFancyText(ctx, ov.text, cx, ty, SLIDE_W - pad * 3, { font: `italic 400 ${Math.round(H * .04)}px "Playfair Display",Georgia,serif`, fill: `hsl(${hue},40%,28%)`, shadow: false, lineH: 1.45 })
    }
  }
}

function renderStory(ctx: CanvasRenderingContext2D, imgs: HTMLImageElement[], W: number, H: number, overlays: any[]) {
  const n = imgs.length; if (!n) return
  for (let si = 0; si < n; si++) {
    const img = imgs[si], zoneX = si * SLIDE_W
    ctx.save(); ctx.beginPath(); ctx.rect(zoneX, 0, SLIDE_W, H); ctx.clip(); drawCoverInRect(ctx, img, zoneX, 0, SLIDE_W, H); ctx.restore()
    const topG = ctx.createLinearGradient(0, 0, 0, H * .45); topG.addColorStop(0, 'rgba(4,2,10,.82)'); topG.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = topG; ctx.fillRect(zoneX, 0, SLIDE_W, H)
    const botG = ctx.createLinearGradient(0, H * .52, 0, H); botG.addColorStop(0, 'rgba(0,0,0,0)'); botG.addColorStop(1, 'rgba(4,2,10,.88)')
    ctx.fillStyle = botG; ctx.fillRect(zoneX, 0, SLIDE_W, H)
    const ov = overlays.find((o: any) => o.slide === si + 1)
    if (ov?.text) {
      const cx = zoneX + SLIDE_W / 2, cy = ov.pos === 'top' ? H * .18 : ov.pos === 'center' ? H * .5 : H * .84
      drawFancyText(ctx, ov.text, cx, cy, SLIDE_W - Math.round(SLIDE_W * .18), { font: `italic 400 ${Math.round(H * .062)}px "Playfair Display",Georgia,serif`, fill: 'rgba(255,252,248,.95)', lineH: 1.3 })
    }
  }
}

function renderSeamless(ctx: CanvasRenderingContext2D, imgs: HTMLImageElement[], W: number, H: number, bgColor: string, gap: number, overlays: any[]) {
  const scaledWidths = imgs.map(img => { const s = H / img.naturalHeight; return Math.round(img.naturalWidth * s) })
  const totalContent = scaledWidths.reduce((a, b) => a + b, 0) + gap * (imgs.length - 1)
  const startX = Math.round((W - totalContent) / 2)
  ctx.fillStyle = bgColor; ctx.fillRect(0, 0, W, H)
  let x = startX
  imgs.forEach((img, i) => { const sw = scaledWidths[i]; ctx.drawImage(img, x, 0, sw, H); x += sw + (i < imgs.length - 1 ? gap : 0) })
}

function renderCarouselCanvas(imgs: HTMLImageElement[], cfg: any) {
  const { slideH = 1080, template = 'scrapbook', bgColor = '#1a0f1e', gap = 0, overlays = [] } = cfg
  const n = imgs.length; if (!n) return null
  let numSlides = n
  if (template === 'seamless') {
    const sw = imgs.map(img => { const s = slideH / img.naturalHeight; return Math.round(img.naturalWidth * s) })
    numSlides = Math.max(1, Math.ceil((sw.reduce((a, b) => a + b, 0) + gap * (n - 1)) / SLIDE_W))
  }
  const cv = document.createElement('canvas'); cv.width = numSlides * SLIDE_W; cv.height = slideH
  const ctx = cv.getContext('2d')!
  if (template === 'scrapbook') renderScrapbook(ctx, imgs, cv.width, slideH, overlays)
  else if (template === 'polaroid') renderPolaroid(ctx, imgs, cv.width, slideH, overlays)
  else if (template === 'minimal') renderMinimal(ctx, imgs, cv.width, slideH, overlays)
  else if (template === 'story') renderStory(ctx, imgs, cv.width, slideH, overlays)
  else renderSeamless(ctx, imgs, cv.width, slideH, bgColor, gap, overlays)
  return { cv, numSlides }
}

function sliceCanvas(cv: HTMLCanvasElement, numSlides: number, slideH: number): HTMLCanvasElement[] {
  return Array.from({ length: numSlides }, (_, i) => {
    const out = document.createElement('canvas'); out.width = SLIDE_W; out.height = slideH
    out.getContext('2d')!.drawImage(cv, i * SLIDE_W, 0, SLIDE_W, slideH, 0, 0, SLIDE_W, slideH)
    return out
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = src })
}

/* ── Types ── */
interface Photo { id: number; url: string; file: File }
interface Overlay { id: number; slide: number; text: string; pos: 'top' | 'center' | 'bottom' }

/* ── Page ── */
export default function CarouselPage() {
  const [step, setStep] = useState(0)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [template, setTemplate] = useState('scrapbook')
  const [format, setFormat] = useState('1:1')
  const [gap, setGap] = useState(0)
  const [bgColor, setBgColor] = useState('#1a0f1e')
  const [customBg, setCustomBg] = useState('#1a1025')
  const [overlays, setOverlays] = useState<Overlay[]>([{ id: 1, slide: 1, text: '', pos: 'bottom' }])
  const [slides, setSlides] = useState<HTMLCanvasElement[]>([])
  const [thumbs, setThumbs] = useState<string[]>([])
  const [mergedCv, setMergedCv] = useState<HTMLCanvasElement | null>(null)
  const [building, setBuilding] = useState(false)
  const [numSlides, setNumSlides] = useState(0)
  const [dragSrc, setDragSrc] = useState<number | null>(null)
  const [dragOv, setDragOv] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const effectiveBg = bgColor === 'custom' ? customBg : bgColor
  const slideH = CM_FORMATS.find(f => f.id === format)?.h ?? 1080
  const showBg = template === 'seamless'

  function addFiles(files: FileList | File[]) {
    const valid = [...files].filter(f => f.type.startsWith('image/')).slice(0, 20 - photos.length)
    setPhotos(p => [...p, ...valid.map(f => ({ id: Date.now() + Math.random(), url: URL.createObjectURL(f), file: f }))].slice(0, 20))
  }
  function removePhoto(id: number) { setPhotos(p => p.filter(x => x.id !== id)) }
  function addOverlay() { setOverlays(o => [...o, { id: Date.now(), slide: 1, text: '', pos: 'bottom' }]) }
  function removeOverlay(id: number) { setOverlays(o => o.filter(x => x.id !== id)) }
  function updateOverlay(id: number, key: string, val: any) { setOverlays(o => o.map(x => x.id === id ? { ...x, [key]: val } : x)) }

  async function build() {
    if (!photos.length) return
    setBuilding(true); await new Promise(r => setTimeout(r, 40))
    try {
      const imgs = await Promise.all(photos.map(p => loadImage(p.url)))
      const result = renderCarouselCanvas(imgs, { slideH, template, bgColor: effectiveBg, gap, overlays })
      if (!result) return
      const { cv, numSlides: ns } = result
      const sliceArr = sliceCanvas(cv, ns, slideH)
      setMergedCv(cv); setSlides(sliceArr); setThumbs(sliceArr.map(s => s.toDataURL('image/jpeg', .72)))
      setNumSlides(ns); setStep(1)
    } catch (e) { console.error(e) }
    setBuilding(false)
  }

  useEffect(() => {
    if (step !== 1 || !mergedCv) return
    const cv = previewCanvasRef.current; if (!cv) return
    cv.width = mergedCv.width; cv.height = mergedCv.height
    cv.getContext('2d')!.drawImage(mergedCv, 0, 0)
  }, [step, mergedCv])

  function downloadSlide(idx: number) {
    const a = document.createElement('a')
    a.href = slides[idx].toDataURL('image/png')
    a.download = `carousel-${template}-${idx + 1}.png`; a.click()
  }
  function downloadAll() { slides.forEach((_, i) => setTimeout(() => downloadSlide(i), i * 250)) }

  return (
    <StudioLayout>
      <div style={{ padding: '1.4rem 1rem 3rem', maxWidth: 560, margin: '0 auto' }}>
        <div className="cm-hdr">
          <h2 className="cm-hdr-t">Carousel Maker</h2>
          <p className="cm-hdr-s">designer-quality instagram slides</p>
        </div>

        <div className="steps" style={{ marginBottom: '1.2rem' }}>
          {['Design & Configure', 'Preview & Export'].map((l, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <div className={`sdot${i === step ? ' on' : i < step ? ' dn' : ''}`} title={l} />
              {i < 1 && <div className="sline" />}
            </span>
          ))}
        </div>

        {/* ── Step 0 ── */}
        {step === 0 && (
          <div className="fade-in">
            <p className="stitle">Photos</p>
            <div className="upzone" style={{ padding: '1.5rem 1rem' }}
              onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', fontSize: 0 }}
                onChange={e => { addFiles(e.target.files!); (e.target as HTMLInputElement).value = '' }} />
              <div className="up-icon">🖼</div>
              <p className="up-text">Drop images or tap to select</p>
              <p className="up-hint">Up to 20 photos · Any ratio · Drag thumbnails to reorder</p>
            </div>

            {photos.length > 0 && (
              <>
                <p className="photo-count mt3">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
                <div className="pgrid">
                  {photos.map((p, i) => (
                    <div key={p.id} className={`pthumb${dragOv === i ? ' over-t' : ''}`} draggable
                      onDragStart={e => { setDragSrc(i); e.dataTransfer.effectAllowed = 'move' }}
                      onDragOver={e => { e.preventDefault(); setDragOv(i) }}
                      onDrop={e => {
                        e.preventDefault(); if (dragSrc === null || dragSrc === i) return
                        setPhotos(p2 => { const a = [...p2]; const [m] = a.splice(dragSrc, 1); a.splice(i, 0, m); return a })
                        setDragSrc(null); setDragOv(null)
                      }}
                      onDragEnd={() => { setDragSrc(null); setDragOv(null) }}>
                      <img src={p.url} alt={`Photo ${i + 1}`} />
                      <button className="xbtn" onClick={e2 => { e2.stopPropagation(); removePhoto(p.id) }}>✕</button>
                      <span className="nbadge">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className="stitle mt5">Choose a Template</p>
            <div className="cm-tpl-grid">
              {CM_TEMPLATES.map(t => (
                <div key={t.id} className={`cm-tpl-card${template === t.id ? ' on' : ''}`} onClick={() => setTemplate(t.id)}>
                  <div className={`cm-tpl-thumb tt-${t.id}`}>
                    {t.id === 'polaroid' && (
                      <div className="tt-polaroid">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="tt-polar-frame" style={{ transform: `rotate(${(i - 1) * 7}deg)` }}>
                            <div className="tt-polar-img" /><div className="tt-polar-cap" />
                          </div>
                        ))}
                      </div>
                    )}
                    {t.id === 'story' && <div className="tt-story"><div className="tt-story-img" /><div className="tt-story-line" /></div>}
                    {t.id === 'seamless' && <div className="tt-seamless"><div className="tt-seamless-seg" /><div className="tt-seamless-seg" /><div className="tt-seamless-seg" /></div>}
                    {t.id === 'minimal' && <div className="tt-minimal"><div className="tt-minimal-inner" /></div>}
                  </div>
                  <div className="cm-tpl-info">
                    <p className="cm-tpl-name">{t.name}</p>
                    <p className="cm-tpl-desc">{t.desc}</p>
                  </div>
                  <div className="cm-tpl-chk">
                    <svg width="9" height="7" viewBox="0 0 9 7"><path d="M1 3.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              ))}
            </div>

            <p className="stitle mt5">Slide Format</p>
            <div className="fmt-row">
              {CM_FORMATS.map(f => (
                <span key={f.id} className={`fmt-pill${format === f.id ? ' on' : ''}`} onClick={() => setFormat(f.id)}>{f.label}</span>
              ))}
            </div>

            {showBg && (
              <>
                <p className="stitle mt5">Background</p>
                <div className="swatch-row">
                  {BG_PRESETS.map(sw => (
                    <div key={sw.id}
                      className={`swatch${bgColor === sw.id ? ' on' : ''}${sw.id === 'custom' ? ' swatch-custom' : ''}`}
                      style={{ background: sw.id === 'custom' ? 'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)' : sw.id }}
                      title={sw.label} onClick={() => setBgColor(sw.id)}>
                      {sw.id === 'custom' && <input type="color" value={customBg} onChange={e => { setCustomBg(e.target.value); setBgColor('custom') }} onClick={e => e.stopPropagation()} />}
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className="stitle mt5">
              Captions
              <button onClick={addOverlay} style={{ marginLeft: 'auto', border: '1px solid var(--surface-b)', borderRadius: 7, background: 'var(--surface)', color: 'var(--text3)', cursor: 'pointer', padding: '2px 10px', fontSize: '.7rem', fontFamily: 'var(--fa)', letterSpacing: '.08em' }}>
                + Add
              </button>
            </p>
            {overlays.length > 0 && (
              <div className="cm-text-form">
                {overlays.map((ov, i) => (
                  <div key={ov.id} className="cm-text-row">
                    <span className="cm-text-label">Slide</span>
                    <input type="number" className="cm-tinput" min={1} max={20} value={ov.slide} style={{ width: 42, flex: 'none', textAlign: 'center' }} onChange={e => updateOverlay(ov.id, 'slide', parseInt(e.target.value) || 1)} />
                    <input className="cm-tinput" type="text" placeholder={`Caption for slide ${i + 1}`} value={ov.text} maxLength={70} onChange={e => updateOverlay(ov.id, 'text', e.target.value)} />
                    <select className="cm-slide-sel" value={ov.pos} onChange={e => updateOverlay(ov.id, 'pos', e.target.value)}>
                      <option value="top">Top</option><option value="center">Mid</option><option value="bottom">Bottom</option>
                    </select>
                    <button onClick={() => removeOverlay(ov.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1rem', lineHeight: '1', flexShrink: 0, padding: '0 4px' }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="brow">
              <button className="btn btn-p" disabled={!photos.length || building} onClick={build}>
                {building ? <><span className="spin">◌</span> Rendering…</> : '✦ Generate Carousel'}
              </button>
            </div>

            {!photos.length && (
              <div className="cm-empty mt4">
                <div className="cm-empty-icon">✨</div>
                <p className="cm-empty-t">Upload photos to begin.<br />Pick a template, add captions.</p>
                <p className="cm-empty-s">Every template = a different vibe</p>
              </div>
            )}
          </div>
        )}

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className="fade-in">
            <p className="stitle">Full Strip Preview <span style={{ fontFamily: 'var(--fa)', fontStyle: 'italic', fontSize: '.63rem', color: 'var(--text3)', marginLeft: 'auto', letterSpacing: '.08em', fontWeight: 'normal' }}>{numSlides} slide{numSlides !== 1 ? 's' : ''} · {format} · scroll →</span></p>
            <div className="cm-preview-outer">
              <div className="cm-preview-inner">
                <canvas ref={previewCanvasRef} />
                <div className="slide-bounds" style={{ width: mergedCv ? mergedCv.width * (200 / slideH) : 0 }}>
                  {Array.from({ length: numSlides }, (_, i) => (
                    <div key={i} className="slide-bound" style={{ width: SLIDE_W * (200 / slideH), position: 'relative' }}>
                      <span className="slide-num">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="stitle mt5">Slides — tap any to download</p>
            <div className="cm-slide-grid">
              {thumbs.map((t, i) => (
                <div key={i} className="cm-slide-card" onClick={() => downloadSlide(i)}>
                  <img src={t} alt={`Slide ${i + 1}`} />
                  <span className="cm-slide-badge">{i + 1}/{numSlides}</span>
                  <button className="cm-slide-dl" onClick={e => { e.stopPropagation(); downloadSlide(i) }}>↓</button>
                </div>
              ))}
            </div>

            <button className="btn btn-g mt5" onClick={downloadAll}>⬇ Download All {numSlides} Slides (.png)</button>

            <div className="brow">
              <button className="btn btn-s" onClick={() => setStep(0)}>← Edit</button>
              <button className="btn btn-p" onClick={build} disabled={building}>
                {building ? <><span className="spin">◌</span> Rendering…</> : '↺ Rebuild'}
              </button>
            </div>
          </div>
        )}
      </div>
    </StudioLayout>
  )
}
