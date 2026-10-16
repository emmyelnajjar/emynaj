import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitText from '../components/reactbits/SplitText';
import Magnet from '../components/reactbits/Magnet';
import Grainient from '../components/reactbits/Grainient';
import ShinyText from '../components/reactbits/ShinyText';
import CircularText from '../components/reactbits/CircularText';
import { hero } from '../data/content';
import { prefersReducedMotion } from '../lib/smoothScroll';
import portrait from '../assets/emmy.jpg';
import skyArt from '../assets/art/sky.svg';
import boutiqueArt from '../assets/art/boutique.svg';
import dubaiArt from '../assets/art/dubai.svg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const lineFrom = { yPercent: 110, opacity: 0 };
const lineTo = delay => ({ yPercent: 0, opacity: 1, delay });

// One small picture for each chapter of the title: the sky, fashion, real estate.
const chips = [skyArt, boutiqueArt, dubaiArt];

export default function Hero() {
  const root = useRef(null);
  const fullTitle = [...hero.titleLines, hero.titleAccent].join(' ');
  const lines = [...hero.titleLines, hero.titleAccent];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Little pictures open up inside the title, one after another.
      gsap.fromTo(
        '.hero-chip',
        { width: 0, opacity: 0, marginLeft: 0 },
        { width: '1.5em', opacity: 1, marginLeft: '0.28em', duration: 1.2, ease: 'expo.out', stagger: 0.18, delay: 1.1 }
      );

      // Portrait rises in an arch, the badge spins in, then the words around it.
      const stacked = window.matchMedia('(max-width: 900px)').matches;
      const photo = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: stacked ? { trigger: '.hero-media', start: 'top 85%', once: true } : undefined
      });
      photo
        .fromTo(
          '.hero-arch',
          { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0 0)' },
          { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)', duration: 1.6, ease: 'expo.inOut' },
          0
        )
        .fromTo('.hero-photo', { scale: 1.35 }, { scale: 1.08, duration: 2.2 }, 0)
        .fromTo('.hero-sun', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 2 }, 0.3)
        .fromTo('.hero-badge', { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: 1.4 }, 1);

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.hero-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.2)
        .fromTo('.hero-sub', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 1.05)
        .fromTo('.hero-ctas .pill', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, 1.2)
        .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 1 }, 1.6);

      // While scrolling away: the photo sinks a little, the sun drifts up, the words fade.
      const away = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero-photo', { yPercent: 4, ease: 'none', scrollTrigger: away });
      gsap.to('.hero-sun', { yPercent: -40, ease: 'none', scrollTrigger: away });
      gsap.to('.hero-text', { yPercent: -10, opacity: 0.2, ease: 'none', scrollTrigger: away });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <Grainient
          colors={['#1d1713', '#4a2a1a', '#7a4024', '#241c16', '#5c3420']}
          type="linear"
          angle={40}
          speed={0.5}
          flow={0.9}
          softness={1}
          silk={0.5}
          grainAmount={0.06}
          contrast={1.05}
          saturation={0.95}
          interactive
          clickSwirl={false}
        />
      </div>

      <div className="hero-text">
        <span className="hero-eyebrow">
          <ShinyText text={hero.eyebrowName} color="#c1663f" shineColor="#f3ead9" speed={3} delay={2} />
          <em>{hero.eyebrowPlace}</em>
        </span>

        <h1 id="hero-title" className="hero-title" aria-label={fullTitle}>
          {lines.map((line, i) => (
            <span className="hero-line" aria-hidden="true" key={line}>
              <SplitText
                text={line}
                tag={i === lines.length - 1 ? 'em' : 'span'}
                splitType="chars"
                mask
                trigger="load"
                textAlign="left"
                delay={22}
                duration={1.1}
                ease="expo.out"
                from={lineFrom}
                to={lineTo(0.35 + i * 0.16)}
              />
              <span className="hero-chip">
                <img src={chips[i]} alt="" />
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-sub">{hero.sub}</p>

        <div className="hero-ctas">
          {hero.ctas.map((cta, i) => (
            <Magnet key={cta.href} padding={40} magnetStrength={6} wrapperClassName="magnet-inline">
              <a href={cta.href} className={`pill${i === 0 ? ' pill-solid' : ''}`}>
                {cta.label}{' '}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </Magnet>
          ))}
        </div>
      </div>

      <div className="hero-media">
        <div className="hero-sun" aria-hidden="true" />
        <div className="hero-arch">
          <img
            className="hero-photo"
            src={portrait}
            alt={hero.imageAlt}
            width="1000"
            height="1502"
            fetchPriority="high"
            decoding="async"
          />
          <div className="tint" />
        </div>
        <div className="hero-badge" aria-hidden="true">
          <CircularText
            text="EMYNAJ ✦ UAE & EGYPT ✦ "
            spinDuration={18}
            onHover="speedUp"
            size={150}
            fontSize={13}
            fontWeight={500}
            letterSpacing={2}
            color="#f3ead9"
          >
            <span className="hero-badge-mark">E</span>
          </CircularText>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
