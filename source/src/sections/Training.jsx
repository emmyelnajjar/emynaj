import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollExpand from '../components/reactbits/ScrollExpand';
import ScrollStack, { ScrollStackItem } from '../components/reactbits/ScrollStack';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import { training } from '../data/content';
import { prefersReducedMotion } from '../lib/smoothScroll';
import stageArt from '../assets/art/stage.svg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Cards stack on top of each other only on big screens; on phones they are too tall to stick.
function useWide() {
  const query = '(min-width: 901px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)';
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

function Program({ program, index }) {
  return (
    <div className="program">
      <div className="program-head">
        <span className="program-count" aria-hidden="true">
          0{index + 1}
        </span>
        <h3 className="program-name">{program.name}</h3>
        <span className="program-tag">{program.tag}</span>
      </div>
      <ol className="program-modules">
        {program.modules.map((mod, i) => (
          <li className="module" key={mod.title}>
            <span className="module-num" aria-hidden="true">
              {i + 1}
            </span>
            <div className="module-body">
              <h4>{mod.title}</h4>
              <p>{mod.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Training() {
  const root = useRef(null);
  const wide = useWide();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Problems get crossed out; the good results get a tick.
      gsap.utils.toArray('.fix-bad li').forEach(li => {
        gsap.fromTo(
          li,
          { '--strike': 0 },
          { '--strike': 1, ease: 'none', scrollTrigger: { trigger: li, start: 'top 80%', end: 'top 55%', scrub: true } }
        );
      });
      gsap.utils.toArray('.fix-good li').forEach((li, i) => {
        gsap.fromTo(
          li,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            delay: i * 0.12,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.fix-good', start: 'top 75%', once: true }
          }
        );
      });
    },
    { scope: root, dependencies: [wide], revertOnUpdate: true }
  );

  return (
    <section id="training" ref={root} className="training">
      <ScrollExpand
        className="training-expand"
        src={stageArt}
        alt=""
        title={training.kicker}
        useWindowScroll
        startWidth={46}
        startHeight={56}
        startRadius={32}
        endRadius={0}
        mediaZoom={1.25}
        scrollDistance={0.9}
        holdDistance={0.25}
        overlayScrim={0.75}
        enabled={!prefersReducedMotion()}
      >
        <h2 className="section-title training-title">{training.title}</h2>
      </ScrollExpand>

      <div className="programs-wrap">
        {wide ? (
          <ScrollStack
            className="programs-stack"
            useWindowScroll
            smoothScroll={false}
            itemDistance={120}
            itemStackDistance={34}
            stackPosition="16%"
            itemScale={0.04}
            baseScale={0.9}
            dimAmount={0.35}
            holdDistance={60}
          >
            {training.programs.map((program, p) => (
              <ScrollStackItem key={program.name} itemClassName={`program-card tone-${p}`}>
                <Program program={program} index={p} />
              </ScrollStackItem>
            ))}
          </ScrollStack>
        ) : (
          <div className="wrap programs-list">
            {training.programs.map((program, p) => (
              <AnimatedContent
                key={program.name}
                className={`program-card tone-${p}`}
                distance={60}
                duration={1.1}
                threshold={0.1}
              >
                <Program program={program} index={p} />
              </AnimatedContent>
            ))}
          </div>
        )}
      </div>

      <div className="wrap">
        <div className="fixes-grid">
          {training.fixes.map((col, c) => (
            <AnimatedContent
              key={col.title}
              className={`fixes-col ${c === 0 ? 'fix-bad' : 'fix-good'}`}
              distance={50}
              duration={1.1}
              delay={c * 0.12}
              threshold={0.15}
            >
              <h3>{col.title}</h3>
              <ul>
                {col.items.map(item => (
                  <li key={item}>
                    <span className="fix-icon" aria-hidden="true">
                      {c === 0 ? '✕' : '✓'}
                    </span>
                    <span className="fix-text">
                      <span>{item}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </AnimatedContent>
          ))}
        </div>

        {/* Screen readers read the plain sentence; the animated copy is only for the eyes. */}
        <p className="visually-hidden">{training.note}</p>
        <ScrollReveal
          as="div"
          containerClassName="fixes-note"
          textClassName="fixes-note-text"
          baseOpacity={0.12}
          baseRotation={0}
          blurStrength={4}
          wordAnimationEnd="bottom 60%"
        >
          {training.note}
        </ScrollReveal>
      </div>
    </section>
  );
}
