import { useState, useEffect, useRef, useCallback } from 'react'
import StudioLayout from './StudioLayout'

/* ── Constants ── */
const CW = 960, CH = 540
const SLIDE_DUR = 4200
const TRANS_DUR = 900
const SLIDE_TOT = SLIDE_DUR + TRANS_DUR

const RATIOS = [
  { id: '16:9', label: '16:9', w: 960, h: 540,  tw: 44, th: 27 },
  { id: '9:16', label: '9:16', w: 540, h: 960,  tw: 27, th: 44 },
  { id: '1:1',  label: '1:1',  w: 720, h: 720,  tw: 36, th: 36 },
  { id: '4:3',  label: '4:3',  w: 800, h: 600,  tw: 36, th: 27 },
]
const TEMPLATES = [
  { id: 'romantic',  name: 'Soft Romantic',  desc: 'Ken Burns · Fade transitions · Rose overlay' },
  { id: 'memories',  name: 'Cute Memories',  desc: 'Polaroid frames · Cream palette · Playful' },
  { id: 'cinematic', name: 'Cinematic Love', desc: 'Letterbox · Dark mood · Dramatic zoom' },
]
const TRACKS = [
  { id: 'soft',      name: 'Soft Reverie',  vibe: 'Gentle C-major ambient pad',  icon: '🎹' },
  { id: 'playful',   name: 'Sweet Waltz',   vibe: 'Warm F-major with shimmer',   icon: '🎶' },
  { id: 'cinematic', name: 'Midnight Lull', vibe: 'Melancholic Am chord pad',    icon: '🌙' },
]

/* ── Canvas helpers ── */
function easeQ(t: number) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number, zoom = 1, panX = .5, panY = .5) {
  if (!img || !img.naturalWidth) return
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * zoom
  const dw = img.naturalWidth * s, dh = img.naturalHeight * s
  ctx.drawImage(img, (W - dw) * panX, (H - dh) * panY, dw, dh)
}
function vignette(ctx: CanvasRenderingContext2D, W: number, H: number, r0: number, r1: number, color: string, alpha: number) {
  const g = ctx.createRadialGradient(W / 2, H / 2, r0, W / 2, H / 2, r1)
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, color || 'rgba(0,0,0,0.7)')
  ctx.save(); ctx.globalAlpha = alpha || 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore()
}
function drawText(ctx: CanvasRenderingContext2D, txt: string, x: number, y: number, font: string, color: string, maxW?: number) {
  ctx.save(); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  maxW ? ctx.fillText(txt, x, y, maxW) : ctx.fillText(txt, x, y); ctx.restore()
}
function getSlideState(elapsed: number, n: number) {
  if (!n) return { idx: 0, next: 0, sp: 0, inSlide: true }
  const cyc = n * SLIDE_TOT, t = elapsed % cyc
  const raw = Math.floor(t / SLIDE_TOT), idx = Math.min(raw, n - 1)
  const tInCycle = t - raw * SLIDE_TOT, inSlide = tInCycle < SLIDE_DUR
  const sp = inSlide ? tInCycle / SLIDE_DUR : (tInCycle - SLIDE_DUR) / TRANS_DUR
  return { idx, next: (idx + 1) % n, sp, inSlide }
}

function renderRomantic(ctx: CanvasRenderingContext2D, W: number, H: number, imgs: HTMLImageElement[], elapsed: number, text: string) {
  const n = imgs.length; if (!n) return
  const { idx, next, sp, inSlide } = getSlideState(elapsed, n)
  ctx.fillStyle = '#120608'; ctx.fillRect(0, 0, W, H)
  if (inSlide) {
    const zoom = 1 + sp * 0.06, panX = 0.5 + Math.sin(idx * 1.3) * 0.08
    drawCover(ctx, imgs[idx], W, H, zoom, panX, 0.5)
    ctx.fillStyle = 'rgba(80,10,25,0.28)'; ctx.fillRect(0, 0, W, H)
    vignette(ctx, W, H, W * 0.22, W * 0.72, 'rgba(10,2,5,0.72)', 1)
    if (text) drawText(ctx, text, W / 2, H * 0.88, `italic 400 ${clamp(W * 0.038, 18, 40)}px 'Cormorant Garamond',serif`, 'rgba(244,220,210,0.72)', W * 0.75)
  } else {
    drawCover(ctx, imgs[idx], W, H, 1.06, 0.5, 0.5)
    ctx.globalAlpha = easeQ(sp); drawCover(ctx, imgs[next], W, H, 1.0, 0.5, 0.5); ctx.globalAlpha = 1
    ctx.fillStyle = `rgba(80,10,25,${0.28 + sp * 0.18})`; ctx.fillRect(0, 0, W, H)
    vignette(ctx, W, H, W * 0.22, W * 0.72, 'rgba(10,2,5,0.72)', 1)
  }
}

function renderMemories(ctx: CanvasRenderingContext2D, W: number, H: number, imgs: HTMLImageElement[], elapsed: number, text: string) {
  const n = imgs.length; if (!n) return
  const { idx, next, sp, inSlide } = getSlideState(elapsed, n)
  ctx.fillStyle = '#fdf6ee'; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = 'rgba(230,200,170,0.22)'; ctx.fillRect(0, 0, W, H)
  function polaroid(img: HTMLImageElement, alpha: number, yShift = 0) {
    const pw = W * 0.62, ph = pw * 0.78, border = pw * 0.045, bottom = pw * 0.18
    const x = (W - pw) / 2, y = (H - ph - border * 2 - bottom) / 2 + yShift
    ctx.save(); ctx.globalAlpha = alpha
    ctx.fillStyle = '#faf6f0'; ctx.shadowColor = 'rgba(100,60,20,0.28)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 8
    ctx.fillRect(x, y, pw + border * 2, ph + border * 2 + bottom)
    ctx.shadowColor = 'transparent'; ctx.restore()
    ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.rect(x + border, y + border, pw, ph); ctx.clip()
    drawCover(ctx, img, pw, ph, 1.02, 0.5, 0.5)
    const g = ctx.createLinearGradient(x + border, y + border, x + border, y + border + ph)
    g.addColorStop(0, 'rgba(253,246,238,0.08)'); g.addColorStop(1, 'rgba(200,160,110,0.18)')
    ctx.fillStyle = g; ctx.fillRect(x + border, y + border, pw, ph)
    ctx.restore()
    if (text) {
      ctx.save(); ctx.globalAlpha = alpha
      ctx.font = `italic 400 ${clamp(pw * 0.07, 13, 24)}px 'Cormorant Garamond',serif`
      ctx.fillStyle = 'rgba(80,55,35,0.7)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, x + border + pw / 2, y + border + ph + bottom / 2, pw - 20)
      ctx.restore()
    }
  }
  if (inSlide) { polaroid(imgs[idx], 1, 0) }
  else { polaroid(imgs[idx], 1 - easeQ(sp), 0); polaroid(imgs[next], easeQ(sp), 0) }
}

function renderCinematic(ctx: CanvasRenderingContext2D, W: number, H: number, imgs: HTMLImageElement[], elapsed: number, text: string) {
  const n = imgs.length; if (!n) return
  const { idx, next, sp, inSlide } = getSlideState(elapsed, n)
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H)
  const lb = H * 0.14
  ctx.save(); ctx.beginPath(); ctx.rect(0, lb, W, H - lb * 2); ctx.clip()
  if (inSlide) {
    const zoom = 1 + sp * 0.04, panX = idx % 2 === 0 ? 0.3 + sp * 0.4 : 0.7 - sp * 0.4
    drawCover(ctx, imgs[idx], W, H - lb * 2, zoom, panX, 0.5)
    vignette(ctx, W, H - lb * 2, W * 0.15, W * 0.65, 'rgba(0,0,0,0.75)', 1)
  } else {
    drawCover(ctx, imgs[idx], W, H - lb * 2, 1.04, 0.5, 0.5)
    ctx.globalAlpha = easeQ(sp)
    drawCover(ctx, imgs[next], W, H - lb * 2, 1.0, 0.5, 0.5)
    ctx.globalAlpha = 1
    vignette(ctx, W, H - lb * 2, W * 0.15, W * 0.65, 'rgba(0,0,0,0.8)', 1)
  }
  ctx.restore()
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, lb); ctx.fillRect(0, H - lb, W, lb)
  if (text) drawText(ctx, text, W / 2, H - lb / 2, `italic 400 ${clamp(W * 0.032, 14, 30)}px 'Playfair Display',serif`, 'rgba(200,180,150,0.85)', W * 0.7)
}

function renderFrame(ctx: CanvasRenderingContext2D, W: number, H: number, imgs: HTMLImageElement[], elapsed: number, template: string, text: string) {
  if (template === 'romantic') renderRomantic(ctx, W, H, imgs, elapsed, text)
  else if (template === 'memories') renderMemories(ctx, W, H, imgs, elapsed, text)
  else renderCinematic(ctx, W, H, imgs, elapsed, text)
}

/* ── Audio Engine ── */
class AudioEngine {
  ctx: AudioContext | null = null
  master: GainNode | null = null
  nodes: AudioNode[] = []
  dest: MediaStreamAudioDestinationNode | null = null

  start(track: string, muted: boolean, audioFile: File | null) {
    this.stop()
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext
      this.ctx = new AC()
      this.master = this.ctx.createGain()
      this.master.gain.setValueAtTime(muted ? 0 : .9, this.ctx.currentTime)
      this.dest = this.ctx.createMediaStreamDestination()
      this.master.connect(this.dest)
      this.master.connect(this.ctx.destination)
      if (audioFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (!this.ctx) return
          this.ctx.decodeAudioData(e.target!.result as ArrayBuffer, (buf) => {
            if (!this.ctx) return
            const src = this.ctx.createBufferSource()
            src.buffer = buf; src.loop = true; src.connect(this.master!); src.start()
            this.nodes.push(src)
          })
        }
        reader.readAsArrayBuffer(audioFile); return
      }
      this.master.gain.setValueAtTime(muted ? 0 : .22, this.ctx.currentTime)
      const CHORDS: Record<string, number[]> = {
        soft:     [261.63, 329.63, 392.00, 523.25],
        playful:  [349.23, 440.00, 523.25, 659.25],
        cinematic:[220.00, 261.63, 311.13, 392.00],
      }
      const freqs = CHORDS[track] || CHORDS.soft
      freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()
        const flt = this.ctx!.createBiquadFilter()
        const lfo = this.ctx!.createOscillator()
        const lfog = this.ctx!.createGain()
        osc.type = 'sine'; osc.frequency.value = f
        flt.type = 'lowpass'; flt.frequency.value = 600 + i * 150; flt.Q.value = .8
        lfo.type = 'sine'; lfo.frequency.value = .15 + i * .04; lfog.gain.value = .025
        lfo.connect(lfog); lfog.connect(gain.gain)
        gain.gain.setValueAtTime(0, this.ctx!.currentTime)
        gain.gain.linearRampToValueAtTime(.072 / (i + 1), this.ctx!.currentTime + 3)
        osc.connect(flt); flt.connect(gain); gain.connect(this.master!)
        osc.start(); lfo.start(); this.nodes.push(osc, lfo)
      })
    } catch (e) { console.warn('AudioEngine:', e) }
  }
  setMuted(m: boolean) {
    if (!this.master || !this.ctx) return
    this.master.gain.linearRampToValueAtTime(m ? 0 : .22, this.ctx.currentTime + .5)
  }
  getTrack() { return this.dest?.stream.getAudioTracks()[0] || null }
  stop() {
    this.nodes.forEach(n => { try { (n as OscillatorNode).stop() } catch (e) {} })
    this.nodes = []
    if (this.ctx) { try { this.ctx.close() } catch (e) {} }
    this.ctx = null; this.master = null; this.dest = null
  }
}

/* ── Photo Uploader ── */
interface Photo { id: number; url: string; file: File }
function PhotoUploader({ photos, setPhotos, ratio, setRatio, onNext }: {
  photos: Photo[]; setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>
  ratio: string; setRatio: (r: string) => void; onNext: () => void
}) {
  const [over, setOver] = useState(false)
  const [dragSrc, setDragSrc] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function addFiles(files: FileList | File[]) {
    const valid = [...files].filter(f => f.type.startsWith('image/')).slice(0, 20 - photos.length)
    const newPhotos = valid.map(f => ({ id: Date.now() + Math.random(), url: URL.createObjectURL(f), file: f }))
    setPhotos(p => [...p, ...newPhotos].slice(0, 20))
  }
  function onDrop(e: React.DragEvent) { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files) }
  function remove(id: number) { setPhotos(p => p.filter(x => x.id !== id)) }
  function onThumbDrop(e: React.DragEvent, i: number) {
    e.preventDefault()
    if (dragSrc === null || dragSrc === i) return
    setPhotos(p => { const a = [...p]; const [m] = a.splice(dragSrc, 1); a.splice(i, 0, m); return a })
    setDragSrc(null); setDragOver(null)
  }

  return (
    <div className="fade-in">
      <p className="stitle">Upload Photos</p>
      <div className={`upzone${over ? ' over' : ''}`}
        onDrop={onDrop} onDragOver={e => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
        onClick={() => fileRef.current?.click()}>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => { addFiles(e.target.files!); (e.target as HTMLInputElement).value = '' }} />
        <div className="up-icon">🌸</div>
        <p className="up-text">Drop photos here or tap to select</p>
        <p className="up-hint">5–20 images · Drag to reorder after uploading</p>
      </div>

      {photos.length > 0 && (
        <>
          <p className="photo-count mt3">{photos.length} photo{photos.length !== 1 ? 's' : ''} · drag thumbnails to reorder</p>
          <div className="pgrid">
            {photos.map((p, i) => (
              <div key={p.id} className={`pthumb${dragOver === i ? ' over-t' : ''}`}
                draggable
                onDragStart={e => { setDragSrc(i); e.dataTransfer.effectAllowed = 'move' }}
                onDragOver={e => { e.preventDefault(); setDragOver(i) }}
                onDrop={e => onThumbDrop(e, i)}
                onDragEnd={() => { setDragSrc(null); setDragOver(null) }}>
                <img src={p.url} alt={`Photo ${i + 1}`} />
                <button className="xbtn" onClick={e => { e.stopPropagation(); remove(p.id) }}>✕</button>
                <span className="nbadge">{i + 1}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="stitle mt5">Output Ratio</p>
      <div className="ratio-row">
        {RATIOS.map(r => (
          <div key={r.id} className={`ratio-btn${ratio === r.id ? ' on' : ''}`} onClick={() => setRatio(r.id)}>
            <div className="ratio-thumb" style={{ width: r.tw, height: r.th }} />
            <span className="ratio-lbl">{r.label}</span>
          </div>
        ))}
      </div>

      <div className="brow">
        <button className="btn btn-p" disabled={photos.length < 2} onClick={onNext}>Continue →</button>
      </div>
    </div>
  )
}

/* ── Customize Step ── */
function CustomizeStep({ template, setTemplate, text, setText, music, setMusic, muted, setMuted, audioFile, setAudioFile, onBack, onNext }: any) {
  const audioInputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="fade-in">
      <p className="stitle">Choose a Style</p>
      <div className="tgrid">
        {TEMPLATES.map(t => (
          <div key={t.id} className={`tcard${template === t.id ? ' on' : ''}`} onClick={() => setTemplate(t.id)}>
            <div className={`tthumb tt-${t.id}`}>
              {t.id === 'cinematic' && <div className="tt-cin-inner" />}
            </div>
            <div className="tinfo">
              <p className="tname">{t.name}</p>
              <p className="tdesc">{t.desc}</p>
            </div>
            <div className="tchk">{template === t.id && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}</div>
          </div>
        ))}
      </div>

      <p className="stitle mt5">Text Overlay</p>
      <input className="tinput" type="text" placeholder="Our Story ♡   or   For You, Always"
        value={text} onChange={e => setText(e.target.value)} maxLength={40} />

      <p className="stitle mt5">Background Music</p>
      <div className="mopts">
        {TRACKS.map(t => (
          <div key={t.id} className={`mopt${music === t.id && !audioFile ? ' on' : ''}`}
            onClick={() => { setMusic(t.id); setAudioFile(null) }}>
            <span className="micon">{t.icon}</span>
            <div style={{ flex: 1 }}><p className="mname">{t.name}</p><p className="mvibe">{t.vibe}</p></div>
            <div className="mchk" />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '.48rem' }}>
        <div className={`audio-upload-zone${audioFile ? ' on' : ''}`} onClick={() => audioInputRef.current?.click()}>
          <input ref={audioInputRef} type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
            onChange={e => { const f = e.target.files?.[0]; if (f) { setAudioFile(f); setMusic(null) }; (e.target as HTMLInputElement).value = '' }} />
          <span className="auz-icon">{audioFile ? '🎵' : '📂'}</span>
          <div style={{ flex: 1 }}>
            <p className="auz-name">{audioFile ? (audioFile as File).name : 'Upload your own music'}</p>
            <p className="auz-hint">{audioFile ? 'Tap to change · loops automatically' : 'MP3, WAV, OGG, M4A supported'}</p>
          </div>
          {audioFile && <button onClick={e => { e.stopPropagation(); setAudioFile(null); setMusic('soft') }}
            style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1rem', lineHeight: '1', flexShrink: 0 }}>✕</button>}
        </div>
      </div>

      <div className="mute-row">
        <button className={`mutebtn${muted ? ' muted' : ''}`} onClick={() => setMuted((m: boolean) => !m)}>
          {muted ? '🔇 Muted' : '🔊 Sound On'}
        </button>
      </div>

      <div className="brow">
        <button className="btn btn-s" onClick={onBack}>← Back</button>
        <button className="btn btn-p" onClick={onNext}>Preview →</button>
      </div>
    </div>
  )
}

/* ── Preview Step ── */
function PreviewStep({ photos, template, text, music, muted, audioFile, ratio, onBack }: any) {
  const ratioConfig = RATIOS.find(r => r.id === ratio) || RATIOS[0]
  const W = ratioConfig.w, H = ratioConfig.h
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number | null>(null)
  const imgsRef = useRef<HTMLImageElement[]>([])
  const audioRef = useRef(new AudioEngine())
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [playing, setPlaying] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genProg, setGenProg] = useState(0)
  const [genStatus, setGenStatus] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [imgsLoaded, setImgsLoaded] = useState(false)
  const totalDur = photos.length * SLIDE_TOT

  useEffect(() => {
    let alive = true; setImgsLoaded(false)
    Promise.all(photos.map((p: Photo) => new Promise<HTMLImageElement | null>(res => {
      const img = new Image(); img.onload = () => res(img); img.onerror = () => res(null); img.src = p.url
    }))).then(imgs => {
      if (!alive) return
      imgsRef.current = imgs.filter(Boolean) as HTMLImageElement[]; setImgsLoaded(true)
    })
    return () => { alive = false }
  }, [photos])

  const startPreview = useCallback(() => {
    if (!imgsLoaded || generating) return
    setPlaying(true); audioRef.current.start(music, muted, audioFile)
    startRef.current = null
    function tick(ts: number) {
      if (!startRef.current) startRef.current = ts
      const cv = canvasRef.current; if (!cv) return
      renderFrame(cv.getContext('2d')!, W, H, imgsRef.current, ts - startRef.current, template, text)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [imgsLoaded, generating, music, muted, template, text, W, H, audioFile])

  function stopPreview() { cancelAnimationFrame(rafRef.current); setPlaying(false); audioRef.current.stop() }

  useEffect(() => { audioRef.current.setMuted(muted) }, [muted])
  useEffect(() => () => { cancelAnimationFrame(rafRef.current); audioRef.current.stop() }, [])
  useEffect(() => {
    if (!imgsLoaded) return
    const cv = canvasRef.current; if (!cv) return
    renderFrame(cv.getContext('2d')!, W, H, imgsRef.current, 0, template, text)
  }, [imgsLoaded, template, text, W, H])

  async function generate() {
    if (generating || !imgsLoaded) return
    stopPreview(); setGenerating(true); setGenProg(0); setGenStatus('Preparing…'); setVideoUrl(null)
    await new Promise(r => setTimeout(r, 100))
    const cv = canvasRef.current; if (!cv) { setGenerating(false); return }
    const audio = audioRef.current; audio.start(music, muted, audioFile)
    const stream = (cv as any).captureStream(30)
    const at = audio.getTrack(); if (at && !muted) stream.addTrack(at)
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm'
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 })
    recorderRef.current = rec; chunksRef.current = []
    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mime })
      setVideoUrl(URL.createObjectURL(blob)); setGenerating(false); setGenStatus(''); setGenProg(100); audio.stop()
    }
    rec.start(100); setGenStatus('Recording…')
    const t0 = performance.now()
    function tick(ts: number) {
      const el = ts - t0, pct = Math.min(100, (el / totalDur) * 100)
      setGenProg(pct); if (pct < 99) setGenStatus(`${Math.round(pct)}% — ${Math.round((totalDur - el) / 1000)}s remaining`)
      renderFrame(cv.getContext('2d')!, W, H, imgsRef.current, el, template, text)
      if (el >= totalDur) { rec.stop(); return }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  return (
    <div className="fade-in">
      <p className="stitle">Preview & Export</p>
      <div className="cbox">
        <canvas ref={canvasRef} width={W} height={H} />
        {!playing && !generating && (
          <div className="cplay" onClick={startPreview}>
            <div className="playbtn"><svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg></div>
          </div>
        )}
        {playing && (
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <button onClick={stopPreview} style={{ background: 'rgba(0,0,0,.6)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: '4px 10px', color: 'rgba(255,255,255,.8)', fontSize: '.7rem', cursor: 'pointer', fontFamily: 'var(--fa)', letterSpacing: '.08em' }}>
              ⏸ Stop
            </button>
          </div>
        )}
      </div>

      {generating && (
        <div className="gprog mt4">
          <div className="gtrack"><div className="gfill" style={{ width: `${genProg}%` }} /></div>
          <p className="gstat">{genStatus}</p>
        </div>
      )}

      {videoUrl && (
        <div className="mt4 fade-in">
          <div className="vresult"><video src={videoUrl} controls loop playsInline /></div>
          <button className="btn btn-g mt3" onClick={() => {
            const a = document.createElement('a'); a.href = videoUrl; a.download = 'memory-reel.webm'; a.click()
          }}>⬇ Download Video (.webm)</button>
        </div>
      )}

      <div className="brow">
        <button className="btn btn-s" onClick={onBack} disabled={generating}>← Back</button>
        <button className="btn btn-p" onClick={generate} disabled={generating || !imgsLoaded}>
          {generating ? <><span className="spin">◌</span> Generating…</> : '✦ Generate Video'}
        </button>
      </div>
    </div>
  )
}

/* ── Page ── */
export default function MemoryReelPage() {
  const [step, setStep] = useState(0)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [ratio, setRatio] = useState('16:9')
  const [template, setTemplate] = useState('romantic')
  const [text, setText] = useState('')
  const [music, setMusic] = useState('soft')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [muted, setMuted] = useState(false)

  return (
    <StudioLayout>
      <div style={{ padding: '1.4rem 1rem 3rem', maxWidth: 560, margin: '0 auto' }}>
        <div className="vmh">
          <h2 className="vmh-t">Memory Reel</h2>
          <p className="vmh-s">turn your photos into a romantic story</p>
        </div>
        <div className="steps">
          {['Upload', 'Customize', 'Preview'].map((l, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <div className={`sdot${i === step ? ' on' : i < step ? ' dn' : ''}`} title={l} />
              {i < 2 && <div className="sline" />}
            </span>
          ))}
        </div>
        {step === 0 && <PhotoUploader photos={photos} setPhotos={setPhotos} ratio={ratio} setRatio={setRatio} onNext={() => setStep(1)} />}
        {step === 1 && <CustomizeStep template={template} setTemplate={setTemplate} text={text} setText={setText} music={music} setMusic={setMusic} muted={muted} setMuted={setMuted} audioFile={audioFile} setAudioFile={setAudioFile} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
        {step === 2 && <PreviewStep photos={photos} template={template} text={text} music={music} muted={muted} audioFile={audioFile} ratio={ratio} onBack={() => setStep(1)} />}
      </div>
    </StudioLayout>
  )
}
