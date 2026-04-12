import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './studio.css'

const NAV = [
  { path: '/36-questions', label: '36 Questions', emoji: '💬' },
  { path: '/memory-reel',  label: 'Memory Reel',  emoji: '🎬' },
  { path: '/polaroid',     label: 'Polaroid',      emoji: '📷' },
  { path: '/carousel',     label: 'Carousel',      emoji: '🖼'  },
]

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  // Inject Google Fonts once
  useEffect(() => {
    const id = 'studio-fonts'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Cormorant:ital,wght@0,300;1,300&display=swap'
    document.head.appendChild(link)
  }, [])

  const [tab, setTab] = useState('questions');

      return (
        <div className="app">
          {/* Animated parchment background */}
          <div className="orbs" aria-hidden="true">
            <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />
          </div>

          {/* Views */}
          <div className="view" style={{ display: tab === 'questions' ? 'block' : 'none' }}>
            <QuestionsView />
          </div>
          <div className="view" style={{ display: tab === 'polaroid' ? 'block' : 'none' }}>
            <PolaroidStudio />
          </div>

          {/* Tab bar */}
          <nav className="tabs">
            <button className={`tab${tab === 'questions' ? ' on' : ''}`} onClick={() => setTab('questions')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              <span className="tab-lbl">Questions</span>
              <div className="tab-pip" />
            </button>
            <button className={`tab${tab === 'polaroid' ? ' on' : ''}`} onClick={() => setTab('polaroid')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="16" rx="2" />
                <circle cx="12" cy="11" r="3.5" />
                <path d="M8 3l1.5 2h5L16 3" />
                <line x1="17" y1="8" x2="19" y2="8" />
              </svg>
              <span className="tab-lbl">Polaroid</span>
              <div className="tab-pip" />
            </button>
          </nav>
        </div>
      );
    
}
