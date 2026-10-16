import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitText from '../components/reactbits/SplitText';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import CountUp from '../components/reactbits/CountUp';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import Threads from '../components/reactbits/Threads';
import { about } from '../data/content';
import { prefersReducedMotion } from '../lib/smoothScroll';
import skyArt from '../assets/art/sky.svg';
import stageArt from '../assets/art/stage.svg';
import dubaiArt from '../assets/art/dubai.svg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One picture per chapter of her story: in the air, training rooms, and the deals today.
const scenes = [
  { src: skyArt, label: 'Aviation' },
  { src: stageArt, label: 'Training' },
  { src: dubaiArt, label: 'UAE & Egypt' }
];

export default function About() {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      // The picture on the left changes to match the paragraph you are reading.
      gsap.utils.toArray('.chapter').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: self => self.isActive && setActive(i)
        });
      });

      if (prefersReducedMotion()) return;

      // Stats band: numbers float up from different depths.
      gsap.utils.toArray('.stat-cell').forEach((cell, i) => {
        gsap.fromTo(
          cell,
          { y: 60 + i * 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.stats-band', start: 'top 80%', once: true }
          }
        );
      });

      // The big quote mark grows as the quote comes in.
      gsap.fromTo(
        '.quote-mark',
        { scale: 0.3, rotate: -20, opacity: 0 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.quote-block', start: 'top 90%', end: 'top 40%', scrub: true }
        }
      );
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} className="about">
      <div className="wrap">
        <div className="section-head">
          <SplitText
            text={about.kicker}
            tag="span"
            className="kicker"
            splitType="chars"
            textAlign="left"
            delay={25}
            duration={0.9}
            effect="fade"
            rootMargin="-60px"
          />
          <ScrollReveal
            containerClassName="section-title about-title"
            textClassName="about-title-text"
            baseOpacity={0.14}
            baseRotation={0}
            blurStrength={5}
            wordAnimationEnd="bottom 55%"
          >
            {about.title}
          </ScrollReveal>
        </div>

        <div className="story">
          <div className="story-visual" aria-hidden="true">
            <div className="story-window">
              {scenes.map((s, i) => (
                <img key={s.label} src={s.src} alt="" className={i === active ? 'is-on' : ''} />
              ))}
            </div>
            <div className="story-dots">
              {scenes.map((s, i) => (
                <span key={s.label} className={i === active ? 'is-on' : ''}>
                  <b>0{i + 1}</b> {s.label}
                </span>
              ))}
            </div>
          </div>

          <div className="story-copy">
            {about.paragraphs.map((text, i) => (
              <div className="chapter" key={i}>
                <img className="chapter-art" src={scenes[i].src} alt="" aria-hidden="true" />
                <span className="chapter-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <AnimatedContent distance={40} duration={1.1} threshold={0.12}>
                  <p>{text}</p>
                </AnimatedContent>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-band">
        <div className="stats-threads" aria-hidden="true">
          <Threads
            color={[0.85, 0.51, 0.35]}
            accentColor={[0.95, 0.92, 0.85]}
            amplitude={1.4}
            distance={0.3}
            lineCount={60}
            thickness={0.5}
            speed={0.4}
            brightness={1.1}
            opacity={0.55}
            enableMouseInteraction
          />
        </div>
        <div className="wrap stats-grid">
          {about.stats.map(stat => (
            <div className="stat-cell" key={stat.label}>
              <CountUp
                className="stat-num"
                to={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                duration={2.2}
                easing="expo"
              />
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap">
        <figure className="quote-block">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <AnimatedContent distance={30} duration={1.2} blur={6} threshold={0.15}>
            <blockquote className="pull-quote">{about.quote}</blockquote>
            <figcaption className="pull-quote-attr">{about.quoteAttr}</figcaption>
          </AnimatedContent>
        </figure>
      </div>
    </section>
  );
}
