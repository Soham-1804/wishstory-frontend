import { useState, useEffect, useRef, useCallback } from 'react'
import StudioLayout from './StudioLayout'
import Navbar from '../../components/layout/Navbar'

const QUESTIONS = [
  {id:1,set:1,text:"Given the choice of anyone in the world, whom would you want as a dinner guest?"},
  {id:2,set:1,text:"Would you like to be famous? In what way?"},
  {id:3,set:1,text:"Before making a telephone call, do you ever rehearse what you are going to say? Why?"},
  {id:4,set:1,text:"What would constitute a 'perfect' day for you?"},
  {id:5,set:1,text:"When did you last sing to yourself? To someone else?"},
  {id:6,set:1,text:"If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years of your life, which would you want?"},
  {id:7,set:1,text:"Do you have a secret hunch about how you will die?"},
  {id:8,set:1,text:"Name three things you and your partner appear to have in common."},
  {id:9,set:1,text:"For what in your life do you feel most grateful?"},
  {id:10,set:1,text:"If you could change anything about the way you were raised, what would it be?"},
  {id:11,set:1,text:"Take four minutes and tell your partner your life story in as much detail as possible."},
  {id:12,set:1,text:"If you could wake up tomorrow having gained any one quality or ability, what would it be?"},
  {id:13,set:2,text:"If a crystal ball could tell you the truth about yourself, your life, the future, or anything else, what would you want to know?"},
  {id:14,set:2,text:"Is there something that you've dreamed of doing for a long time? Why haven't you done it?"},
  {id:15,set:2,text:"What is the greatest accomplishment of your life?"},
  {id:16,set:2,text:"What do you value most in a friendship?"},
  {id:17,set:2,text:"What is your most treasured memory?"},
  {id:18,set:2,text:"What is your most terrible memory?"},
  {id:19,set:2,text:"If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?"},
  {id:20,set:2,text:"What does friendship mean to you?"},
  {id:21,set:2,text:"What roles do love and affection play in your life?"},
  {id:22,set:2,text:"Alternate sharing something you consider a positive characteristic of your partner. Share a total of five items."},
  {id:23,set:2,text:"How close and warm is your family? Do you feel your childhood was happier than most other people's?"},
  {id:24,set:2,text:"How do you feel about your relationship with your mother?"},
  {id:25,set:3,text:"Make three true 'we' statements each. For instance, 'We are both in this room feeling...'"},
  {id:26,set:3,text:"Complete this sentence: 'I wish I had someone with whom I could share...'"},
  {id:27,set:3,text:"If you were going to become a close friend with your partner, please share what would be important for them to know."},
  {id:28,set:3,text:"Tell your partner what you like about them; be very honest this time, saying things that you might not say to someone you've just met."},
  {id:29,set:3,text:"Share with your partner an embarrassing moment in your life."},
  {id:30,set:3,text:"When did you last cry in front of another person? By yourself?"},
  {id:31,set:3,text:"Tell your partner something that you like about them already."},
  {id:32,set:3,text:"What, if anything, is too serious to be joked about?"},
  {id:33,set:3,text:"If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven't you told them yet?"},
  {id:34,set:3,text:"Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to safely make a final dash to save any one item. What would it be? Why?"},
  {id:35,set:3,text:"Of all the people in your family, whose death would you find most disturbing? Why?"},
  {id:36,set:3,text:"Share a personal problem and ask your partner's advice on how they might handle it. Also, ask your partner to reflect back to you how you seem to be feeling about the problem you have chosen."},
]

export default function QuestionsView() {
      const [cur, setCur] = useState(0);
      const [enterDir, setEnterDir] = useState('er');
      const [phase, setPhase] = useState('idle');
      const [pendingIdx, setPending] = useState(null);

      const goTo = useCallback((idx) => {
        if (phase !== 'idle' || idx < 0 || idx >= QUESTIONS.length) return;
        const dir = idx > cur ? 'xl' : 'xr';
        const enter = idx > cur ? 'er' : 'el';
        setEnterDir(enter); setPending(idx); setPhase(dir);
      }, [phase, cur]);

      useEffect(() => {
        if (phase === 'xl' || phase === 'xr') {
          const t = setTimeout(() => { setCur(pendingIdx); setPhase('in'); }, 230);
          return () => clearTimeout(t);
        }
        if (phase === 'in') {
          const t = setTimeout(() => setPhase('idle'), 360);
          return () => clearTimeout(t);
        }
      }, [phase, pendingIdx]);

      useEffect(() => {
        const h = (e) => {
          if (e.key === 'ArrowRight') goTo(cur + 1);
          if (e.key === 'ArrowLeft') goTo(cur - 1);
        };
        window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
      }, [goTo, cur]);

      const txStart = useRef(null);
      const onTS = (e) => { txStart.current = e.touches[0].clientX; };
      const onTE = (e) => {
        if (!txStart.current) return;
        const dx = txStart.current - e.changedTouches[0].clientX;
        const dy = Math.abs(txStart.current - e.changedTouches[0].clientY);
        if (Math.abs(dx) > 44 && Math.abs(dx) > dy) goTo(dx > 0 ? cur + 1 : cur - 1);
        txStart.current = null;
      };

      const q = QUESTIONS[cur];
      const prog = ((cur + 1) / QUESTIONS.length) * 100;
      const anim = phase === 'xl' ? 'xl' : phase === 'xr' ? 'xr' : phase === 'in' ? enterDir : '';

      return (
        <>
          <Navbar />
          <div style={{ paddingTop: 72 }}>
            <div className="qv" onTouchStart={onTS} onTouchEnd={onTE}>
          <header className="qh">
            <p className="qh-eye">Arthur Aron's</p>
            <h1 className="qh-t">36 Questions</h1>
            <p className="qh-s">to fall in love</p>
            <div className="qh-div" aria-hidden="true">
              <span className="qh-line" />
              <span className="qh-gem">◆</span>
              <span className="qh-line" />
            </div>
            <div className="set-pills">
              {[1, 2, 3].map(s => (
                <button key={s} className={`spill${q.set === s ? ' on' : ''}`}
                  onClick={() => goTo(QUESTIONS.findIndex(x => x.set === s))}>
                  Set {s}
                </button>
              ))}
            </div>
          </header>

          <div className="qstage">
            <div className="qtap l" onClick={() => goTo(cur - 1)} aria-label="Previous" />
            <div className="qtap r" onClick={() => goTo(cur + 1)} aria-label="Next" />
            <div className={`qcard${anim ? ' ' + anim : ''}`} key={cur}>
              <span className="qnum" aria-hidden="true">{String(cur + 1).padStart(2, '0')}</span>
              <div className="qbody">
                <p className="qtext">{q.text}</p>
              </div>
              <p className="qhint">tap sides to navigate · swipe</p>
            </div>
          </div>

          <footer className="qfooter">
            <p className="qplabel">
              Question <strong>{cur + 1}</strong> of {QUESTIONS.length}
            </p>
            <div className="qtrack"><div className="qfill" style={{ width: prog + '%' }} /></div>
            <div className="qdots" aria-hidden="true">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`qdot${i === cur ? ' c' : i < cur ? ' d' : ''}`}
                  onClick={() => goTo(i)} style={{ cursor: 'pointer' }} />
              ))}
            </div>
          </footer>
            </div>
          </div>
        </>
      );
    }