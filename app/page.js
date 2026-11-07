'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

/* ---- EDIT DETAILS HERE ---- */
const BRAND = { name: 'jarymedia', tagline: 'Creating. Building. Iterating.', email: 'mayjary08@gmail.com', phone: '+91 8104968065' };
const ROLL = ['brands', 'websites', 'identities', 'launches'];
const SERVICES = [
  { t: 'Web design', tone: 'l', art: 'a', d: 'Interfaces that feel inevitable. Fast, accessible and built in Next.js, then polished to the last pixel.', tags: ['UI and UX', 'Next.js', 'Motion'] },
  { t: 'Branding', tone: 'd', art: 'b', d: 'Names, logos and visual systems with a clear point of view, so people recognise you before they read a word.', tags: ['Identity', 'Strategy', 'Guidelines'] },
  { t: 'Development', tone: 's', art: 'c', d: 'Clean code, great performance and a CMS your team will actually enjoy using.', tags: ['React', 'SEO', 'Performance'] },
  { t: 'Content and motion', tone: 'd', art: 'e', d: 'Launch films, social assets and animated brand moments that keep your site alive after day one.', tags: ['Video', 'Animation', 'Social'] },
];
const STEPS = [
  ['Creating.', 'We start with the idea: research, positioning and a visual language with a real point of view.'],
  ['Building.', 'Design becomes code. Fast, accessible sites in Next.js, built to scale with you.'],
  ['Iterating.', 'Launch is the first draft of the next version. We measure, refine and keep improving.'],
];

function Intro({ done }) {
  const dot = useRef(null), burst = useRef(null), word = useRef(null);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(async () => {
      const r = dot.current.getBoundingClientRect(), b = burst.current;
      Object.assign(b.style, { display: 'block', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
      animate(word.current, { opacity: 0 }, { duration: 0.5, delay: 0.25 });
      await animate(b, { scale: (2 * Math.hypot(innerWidth, innerHeight)) / r.width }, { duration: 1.25, ease: [0.76, 0, 0.24, 1] });
      document.body.style.overflow = '';
      done();
    }, 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <div className="burst" ref={burst} />
      <div ref={word} style={{ position: 'relative', zIndex: 2 }}>
        <div className="mark" aria-label={BRAND.name}>
          {BRAND.name.split('').map((c, i) => (
            <motion.span key={i} style={{ display: 'inline-block' }} initial={{ y: 60, opacity: 0, filter: 'blur(14px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} transition={{ delay: 0.2 + i * 0.09, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>{c}</motion.span>
          ))}
          <motion.span ref={dot} className="dotp" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: 'spring', stiffness: 300, damping: 12 }} />
        </div>
      </div>
      <motion.div className="tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}>*{BRAND.tagline}</motion.div>
    </motion.div>
  );
}

function DotGrid() {
  const c = useRef(null);
  useEffect(() => {
    const cv = c.current, ctx = cv.getContext('2d'), gap = 36;
    let w, h, mx = -999, my = -999, raf;
    const size = () => { const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1; cv.width = r.width * d; cv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); w = r.width; h = r.height; };
    const move = (e) => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let x = gap / 2; x < w; x += gap) for (let y = gap / 2; y < h; y += gap) {
        const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy), f = Math.max(0, 1 - d / 190);
        ctx.beginPath(); ctx.arc(x + (dx / (d || 1)) * f * 22, y + (dy / (d || 1)) * f * 22, 1.3 + f * 2.8, 0, 7);
        ctx.fillStyle = `rgba(22,22,22,${0.16 + f * 0.6})`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    size(); draw();
    addEventListener('resize', size); addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', move); };
  }, []);
  return <canvas ref={c} aria-hidden />;
}

function Roll() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % ROLL.length), 2400); return () => clearInterval(t); }, []);
  return (
    <span className="roll">
      <AnimatePresence mode="wait">
        <motion.span key={i} style={{ display: 'inline-block' }} initial={{ y: '90%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-90%', opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>{ROLL[i]}</motion.span>
      </AnimatePresence>
    </span>
  );
}

function Service({ s, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  return (
    <div className="item" ref={ref}>
      <motion.article className={`svc ${s.tone}`} style={{ top: `calc(11vh + ${i * 26}px)`, scale }}>
        <div>
          <h3>{s.t}</h3><p>{s.d}</p>
          <div className="tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
        </div>
        <div className={`art ${s.art}`} aria-hidden />
      </motion.article>
    </div>
  );
}

function Step({ s, i, p }) {
  const o = useTransform(p, [i / 3 - 0.08, i / 3 + 0.06, (i + 1) / 3 - 0.06, (i + 1) / 3 + 0.04], [0.15, 1, 1, 0.15]);
  return (
    <motion.div className="step" style={{ opacity: i === 0 ? 1 : o }}>
      <h3>{s[0]}</h3><p>{s[1]}</p>
    </motion.div>
  );
}

export default function Page() {
  const [ready, setReady] = useState(false);
  const [hide, setHide] = useState(false);
  const { scrollY } = useScroll();
  const prev = useRef(0);
  useMotionValueEvent(scrollY, 'change', (y) => { setHide(y > prev.current && y > 240); prev.current = y; });
  const skew = useTransform(useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 }), [-3000, 3000], [-7, 7]);

  const procRef = useRef(null);
  const { scrollYProgress: pp } = useScroll({ target: procRef, offset: ['start 70%', 'end 60%'] });
  const line = useSpring(pp, { stiffness: 120, damping: 30 });

  const send = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent('New project from ' + f.get('name'))}&body=${encodeURIComponent(f.get('message') + '\n\n' + f.get('name') + ' (' + f.get('email') + ')')}`;
  };

  const lines = [['We build'], [<Roll key="r" />], ['people remember.']];
  return (
    <main>
      <AnimatePresence>{!ready && <Intro done={() => setReady(true)} />}</AnimatePresence>

      <motion.nav className="nav" animate={{ y: ready && !hide ? 0 : -90 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <a href="#top" className="mark">{BRAND.name}<span className="dotp" /></a>
        <ul><li><a href="#services">Services</a></li><li><a href="#process">Process</a></li><li><a href="#contact">Contact</a></li></ul>
        <a href="#contact" className="pill">Start a project</a>
      </motion.nav>

      <section id="top" className="hero">
        <DotGrid />
        <h1>
          {lines.map((l, i) => (
            <span className="ln" key={i}>
              <motion.span initial={{ y: '110%' }} animate={{ y: ready ? 0 : '110%' }} transition={{ delay: 0.1 + i * 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }}>{l}</motion.span>
            </span>
          ))}
        </h1>
        <motion.div className="row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }} transition={{ delay: 0.7, duration: 0.8 }}>
          <p>{BRAND.name} is a web design and branding studio. {BRAND.tagline}</p>
          <div className="btns"><a className="btn" href="#contact">Start a project</a><a className="btn ghost" href="#services">Our services</a></div>
        </motion.div>
      </section>

      <div className="band" aria-hidden>
        <motion.div style={{ skewX: skew }}>
          <div className="mq">
            {[0, 1].map((k) => <div key={k} style={{ display: 'flex' }}>{['Web design', 'Branding', 'Identity', 'Development', 'Motion'].map((w) => <span key={w + k}>{w}<i> ✦</i></span>)}</div>)}
          </div>
        </motion.div>
      </div>

      <section id="services" className="sec"><h2>Everything a brand needs to show up online.</h2></section>
      <div className="stack">{SERVICES.map((s, i) => <Service key={s.t} s={s} i={i} />)}</div>

      <section id="process" className="proc" ref={procRef}>
        <div className="sticky"><h2 style={{ fontSize: 'clamp(2.2rem,5vw,5rem)', letterSpacing: '-.06em', lineHeight: 0.95, fontWeight: 900 }}>One loop.<br />Never finished.</h2></div>
        <div className="steps">
          <div className="line"><motion.b style={{ scaleY: line }} /></div>
          {STEPS.map((s, i) => <Step key={s[0]} s={s} i={i} p={pp} />)}
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Let’s build something worth noticing.</h2>
        <div className="cgrid">
          <div>
            <a className="big" href={`mailto:${BRAND.email}`}><span>Email</span><b>{BRAND.email}</b></a>
            <a className="big" href={`tel:${BRAND.phone.replace(/\s/g, '')}`}><span>Phone</span><b>{BRAND.phone}</b></a>
          </div>
          <form onSubmit={send}>
            <input name="name" placeholder="Your name" required aria-label="Your name" />
            <input name="email" type="email" placeholder="Your email" required aria-label="Your email" />
            <textarea name="message" rows={4} placeholder="Tell us about your project" required aria-label="Message" />
            <button className="btn" type="submit">Send message</button>
          </form>
        </div>
        <div className="foot">
          <div className="mark" aria-hidden>{BRAND.name}<span className="dotp" /></div>
          <div><span>*{BRAND.tagline}</span><span>© 2026 {BRAND.name}</span><a href="#top">Back to top</a></div>
        </div>
      </section>
    </main>
  );
}
