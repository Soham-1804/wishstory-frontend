import { useState, useEffect, useRef } from 'react'
import StudioLayout from './StudioLayout'
import Navbar from '../../components/layout/Navbar'

const FX_LIST = [
  { k: 'grain',    label: 'Film Grain' },
  { k: 'warm',     label: 'Warm Tones' },
  { k: 'vignette', label: 'Vignette' },
  { k: 'fade',     label: 'Light Leak' },
  { k: 'scratch',  label: 'Scratches' },
]

export default  /* VideoMakerView removed */

    /* ══════════════════════════════════════════════════
       COMPONENT: Polaroid Studio
    ══════════════════════════════════════════════════ */
    function PolaroidStudio() {
      const [photo, setPhoto] = useState(null);
      const [caption, setCaption] = useState('');
      const [fx, setFx] = useState({ grain: true, fade: false, warmth: true, vignette: true, tilt: false });
      const [date, setDate] = useState(() => new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }));
      const canvasRef = useRef(null);
      const imgRef = useRef(null);

      function loadPhoto(files) {
        if (!files[0]) return;
        const url = URL.createObjectURL(files[0]);
        const img = new Image(); img.onload = () => { imgRef.current = img; draw(); }; img.src = url;
        setPhoto(url);
      }

      function draw() {
        const cv = canvasRef.current; if (!cv) return;
        const img = imgRef.current; if (!img) return;

        const PW = 600, border = 44, bottom = 120, PH = 480;
        cv.width = PW + border * 2; cv.height = PH + border + bottom;
        const ctx = cv.getContext('2d');

        // Subtle shadow behind polaroid
        ctx.shadowColor = 'rgba(44,26,26,0.18)'; ctx.shadowBlur = 32; ctx.shadowOffsetY = 12;
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.shadowColor = 'transparent';

        if (fx.tilt) { ctx.save(); ctx.translate(cv.width / 2, cv.height / 2); ctx.rotate(-0.04); ctx.translate(-cv.width / 2, -cv.height / 2); }

        // Top rule — brand gold
        ctx.fillStyle = 'rgba(196,168,130,0.25)';
        ctx.fillRect(border, border, PW, 2);

        // Photo area
        ctx.save(); ctx.beginPath(); ctx.rect(border, border, PW, PH); ctx.clip();
        const s = Math.max(PW / img.naturalWidth, PH / img.naturalHeight);
        ctx.drawImage(img, border + (PW - img.naturalWidth * s) / 2, border + (PH - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);

        if (fx.warmth) { ctx.globalAlpha = 0.14; ctx.fillStyle = 'rgba(196,168,130,1)'; ctx.fillRect(border, border, PW, PH); }
        if (fx.fade) {
          const fg = ctx.createLinearGradient(border, border, border + PW, border + PH);
          fg.addColorStop(0, 'rgba(250,248,244,0.18)'); fg.addColorStop(1, 'rgba(237,232,223,0.05)');
          ctx.globalAlpha = 1; ctx.fillStyle = fg; ctx.fillRect(border, border, PW, PH);
        }
        if (fx.vignette) {
          const vg = ctx.createRadialGradient(border + PW / 2, border + PH / 2, PW * .18, border + PW / 2, border + PH / 2, PW * .72);
          vg.addColorStop(0, 'transparent'); vg.addColorStop(1, 'rgba(44,26,26,0.38)');
          ctx.globalAlpha = 1; ctx.fillStyle = vg; ctx.fillRect(border, border, PW, PH);
        }
        if (fx.grain) {
          ctx.globalAlpha = 0.035;
          for (let i = 0; i < 8000; i++) {
            const x = border + Math.random() * PW, y = border + Math.random() * PH;
            ctx.fillStyle = Math.random() > .5 ? '#2C1A1A' : '#FAF8F4';
            ctx.fillRect(x, y, 1.2, 1.2);
          }
        }
        ctx.restore();

        // Caption area
        ctx.globalAlpha = 1;
        if (caption) {
          ctx.font = `italic 400 22px "Cormorant Garamond"`;
          ctx.fillStyle = '#5A3A2E'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(caption, cv.width / 2, border + PH + bottom * .42, PW - 20);
        }
        if (date) {
          ctx.font = `300 12px "Jost"`; ctx.letterSpacing = '0.1em';
          ctx.fillStyle = 'rgba(140,112,96,0.65)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(date.toUpperCase(), cv.width / 2, border + PH + bottom * .72, PW - 40);
        }

        if (fx.tilt) ctx.restore();
      }

      useEffect(() => { if (imgRef.current) draw(); }, [fx, caption, date]);

      function download() {
        const cv = canvasRef.current; if (!cv) return;
        const a = document.createElement('a'); a.href = cv.toDataURL('image/png');
        a.download = `wishstory-polaroid-${Date.now()}.png`; a.click();
      }

      const FX_OPTS = [
        { id: 'grain', label: 'Grain' },
        { id: 'fade', label: 'Matte' },
        { id: 'warmth', label: 'Warm' },
        { id: 'vignette', label: 'Vignette' },
        { id: 'tilt', label: 'Tilted' },
      ];

      return (
        <>
          <Navbar />
          <div style={{ paddingTop: 72 }}>
            <div className="pstudio fade-in">
          <div className="psth">
            <h2 className="psth-t">Polaroid Studio</h2>
            <p className="psth-s">Craft a timeless keepsake</p>
          </div>

          {!photo ? (
            <div className="upzone" style={{ margin: '1rem 0' }}>
              <input type="file" accept="image/*" onChange={e => loadPhoto(e.target.files)} />
              <div className="up-icon">🖼</div>
              <p className="up-text">Choose a photo</p>
              <p className="up-hint">JPEG · PNG · WEBP</p>
            </div>
          ) : (
            <>
              <div className="pol-wrap"><canvas ref={canvasRef} /></div>

              <p className="stitle">Effects</p>
              <div className="fx-row">
                {FX_OPTS.map(f => (
                  <button key={f.id} className={`fxbtn${fx[f.id] ? ' on' : ''}`}
                    onClick={() => setFx(x => ({ ...x, [f.id]: !x[f.id] }))}>
                    {f.label}
                  </button>
                ))}
              </div>

              <p className="stitle mt4">Caption</p>
              <input className="pol-caption" placeholder="A moment worth keeping…"
                value={caption} onChange={e => { setCaption(e.target.value); }} maxLength={60}
                onBlur={draw} />

              <p className="stitle mt4">Date</p>
              <input className="pol-caption" value={date}
                onChange={e => setDate(e.target.value)} onBlur={draw} />

              <div className="brow mt5">
                <button className="btn btn-s" onClick={() => { setPhoto(null); imgRef.current = null; }}>← Retake</button>
                <button className="btn btn-g" onClick={download}>↓ Save Polaroid</button>
              </div>
            </>
          )}
            </div>
          </div>
        </>
      );
    }