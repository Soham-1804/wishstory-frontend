import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="bg-[#1e0e0b] px-[5%] pt-16 pb-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="font-serif text-2xl font-medium text-wine tracking-wide">
            Wish<span className="text-gold">Story</span>
          </Link>
          <p className="text-xs text-white/30 mt-3 leading-relaxed font-light max-w-[220px]">
            We craft cinematic stories for the moments that matter most to you.
          </p>
        </div>
        <div>
          <div className="text-gold/60 text-[10px] tracking-[0.2em] uppercase mb-4">Explore</div>
          <ul className="space-y-2.5">
            {['Occasions','How It Works','Pricing','Demo'].map(item => (
              <li key={item}>
                <a href={`/#${item.toLowerCase().replace(' ','-')}`}
                   className="text-white/35 text-xs hover:text-white/70 transition-colors font-light">{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-gold/60 text-[10px] tracking-[0.2em] uppercase mb-4">Account</div>
          <ul className="space-y-2.5">
            {[['Sign Up','/register'],['Log In','/login'],['Dashboard','/dashboard'],['My Stories','/dashboard/stories']].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-white/35 text-xs hover:text-white/70 transition-colors font-light">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-gold/60 text-[10px] tracking-[0.2em] uppercase mb-4">Legal</div>
          <ul className="space-y-2.5">
            {[
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
              ['Refund Policy', '/refund'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-white/35 text-xs hover:text-white/70 transition-colors font-light">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-[#140906] px-[5%] py-4 flex justify-between items-center">
        <span className="text-white/20 text-xs font-light">© 2025 WishStory. All rights reserved. wishstory.in</span>
        <span className="text-gold/40 text-xs">Made with love ♥</span>
      </div>
    </footer>
  )
}
