import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitText from '../components/reactbits/SplitText';
import Magnet from '../components/reactbits/Magnet';
import AnimatedContent from '../components/reactbits/AnimatedContent';
import LightRays from '../components/reactbits/LightRays';
import ClickSpark from '../components/reactbits/ClickSpark';
import { contact } from '../data/content';
import { prefersReducedMotion } from '../lib/smoothScroll';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Contact() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // The giant name slides in from the side as you reach the end of the page.
      gsap.fromTo(
        '.contact-giant',
        { xPercent: 12 },
        {
          xPercent: -4,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true }
        }
      );
    },
    { scope: root }
  );

  const fullTitle = `${contact.titleStart} ${contact.titleAccent}`;

  return (
    <section id="contact" ref={root} className="contact-section">
      <div className="contact-rays" aria-hidden="true">
        <LightRays
          raysOrigin="top-center"
          raysColor="#d98358"
          raysSpeed={0.8}
          lightSpread={0.9}
          rayLength={2.2}
          glow={0.5}
          haze={0.3}
          intensity={0.9}
          followMouse
          mouseInfluence={0.08}
          clickPulse={false}
          opacity={0.85}
        />
      </div>
      <ClickSpark sparkColor={['#d98358', '#f3ead9']} sparkCount={10} sparkRadius={34} style={{ height: 'auto' }}>
        <div className="wrap">
          <div className="contact-grid">
            <div>
              <h2 className="contact-title" aria-label={fullTitle}>
                <span aria-hidden="true">
                  <SplitText
                    text={contact.titleStart}
                    tag="span"
                    splitType="words"
                    mask
                    textAlign="left"
                    delay={60}
                    duration={1.2}
                    ease="expo.out"
                    from={{ yPercent: 110 }}
                    to={{ yPercent: 0 }}
                    rootMargin="-60px"
                  />{' '}
                  <SplitText
                    text={contact.titleAccent}
                    tag="em"
                    splitType="chars"
                    textAlign="left"
                    delay={40}
                    duration={1}
                    effect="blur"
                    rootMargin="-60px"
                  />
                </span>
              </h2>

              <AnimatedContent distance={30} duration={1.1} delay={0.2} threshold={0.1}>
                <p className="contact-lead">{contact.lead}</p>
              </AnimatedContent>

              <AnimatedContent
                className="wa-buttons"
                distance={30}
                duration={1}
                delay={0.3}
                stagger={0.1}
                threshold={0.1}
              >
                {contact.buttons.map(btn => (
                  <Magnet key={btn.href} padding={60} magnetStrength={4}>
                    <a className="wa-btn" href={btn.href} target="_blank" rel="noopener">
                      <span>{btn.label}</span>
                      <span className="wa-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </Magnet>
                ))}
              </AnimatedContent>
            </div>

            <AnimatedContent className="contact-side" distance={50} duration={1.2} stagger={0.12} threshold={0.1}>
              <div className="contact-block">
                <span className="label">EMAIL</span>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
              <div className="contact-block">
                <span className="label">WEBSITE</span>
                <span className="val">{contact.website}</span>
              </div>
              <div className="contact-block">
                <span className="label">FOLLOW</span>
                <div className="social-row">
                  {contact.socials.map(s => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </ClickSpark>
      <div className="contact-giant" aria-hidden="true">
        EMY<span>NAJ</span>
      </div>
    </section>
  );
}
