import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import SectionHead from '../components/SectionHead';
import TiltedCard from '../components/reactbits/TiltedCard';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import { markets } from '../data/content';
import { prefersReducedMotion } from '../lib/smoothScroll';
import dubaiArt from '../assets/art/dubai.svg';
import egyptArt from '../assets/art/egypt.svg';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

const art = { UAE: dubaiArt, Egypt: egyptArt };

export default function Markets() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // A little plane flies the route from Dubai to Cairo while you scroll.
      mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
        const path = root.current.querySelector('.route-path');
        const length = path.getTotalLength();
        const flight = { trigger: '.market-list', start: 'top 65%', end: 'bottom 70%', scrub: 0.8 };
        gsap.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: flight });
        gsap.to('.route-plane', {
          ease: 'none',
          scrollTrigger: flight,
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: 90 }
        });
        gsap.set(path, { strokeDasharray: length });
      });

      if (prefersReducedMotion()) return () => mm.revert();

      // Area names pop in one by one.
      gsap.utils.toArray('.market-areas').forEach(list => {
        gsap.fromTo(
          list.children,
          { y: 16, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(2)',
            stagger: 0.08,
            scrollTrigger: { trigger: list, start: 'top 92%', once: true }
          }
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="markets" ref={root} className="markets">
      <div className="wrap">
        <SectionHead kicker={markets.kicker} title={markets.title} />

        <div className="market-list">
          <svg className="route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="route-path" d="M 56 2 C 62 40, 40 58, 45 98" />
          </svg>
          <span className="route-plane" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30">
              <path
                fill="currentColor"
                d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"
              />
            </svg>
          </span>

          {markets.items.map((m, i) => (
            <article className={`market-row${i % 2 ? ' is-flipped' : ''}`} key={m.name}>
              <AnimatedContent className="market-art" distance={80} direction="vertical" duration={1.3} threshold={0.1}>
                <TiltedCard
                  imageSrc={art[m.name]}
                  altText=""
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  rotateAmplitude={10}
                  scaleOnHover={1.04}
                  showTooltip={false}
                  flipOnClick={false}
                  radius={28}
                  glare={0.35}
                  glareColor="#f3ead9"
                  floating
                />
                <span className="market-stamp" aria-hidden="true">
                  {m.city}
                </span>
              </AnimatedContent>

              <AnimatedContent className="market-text" distance={50} duration={1.2} delay={0.1} threshold={0.12}>
                <span className="market-index" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="market-name">
                  {m.name} <sup>{m.city}</sup>
                </h3>
                <p>{m.text}</p>
                <ul className="market-areas">
                  {m.areas.map(area => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </AnimatedContent>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
