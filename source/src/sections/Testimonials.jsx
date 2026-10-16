import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHead from '../components/SectionHead';
import { testimonials } from '../data/content';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const initials = name =>
  name
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2);

export default function Testimonials() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Large screens: the section holds still and the quotes slide sideways as you scroll.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        const distance = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        });
        tl.to(track, { x: () => -distance(), ease: 'none' }, 0).fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none' },
          0
        );

        // Cards tilt slightly in as they arrive from the right.
        gsap.utils.toArray('.testi', track).forEach(card => {
          gsap.fromTo(
            card,
            { opacity: 0.35, rotateY: -18, rotateZ: 3, y: 40, transformPerspective: 1200 },
            {
              opacity: 1,
              rotateY: 0,
              rotateZ: 0,
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tl,
                start: 'left 100%',
                end: 'left 60%',
                scrub: true
              }
            }
          );
        });
      });

      // Small screens: cards are a swipeable row; fade them up on arrival.
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          trackRef.current,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'expo.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: trackRef.current, start: 'top 85%', once: true }
          }
        );
      });

      // Small screens: the line under the cards follows the sideways swipe.
      mm.add('(max-width: 1023px)', () => {
        const track = trackRef.current;
        const onScroll = () => {
          const max = track.scrollWidth - track.clientWidth;
          gsap.set(barRef.current, { scaleX: max > 0 ? track.scrollLeft / max : 1 });
        };
        onScroll();
        track.addEventListener('scroll', onScroll, { passive: true });
        return () => track.removeEventListener('scroll', onScroll);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="testimonials" ref={root} className="testimonials">
      <div ref={pinRef} className="testi-pin">
        <div className="wrap">
          <SectionHead kicker={testimonials.kicker} title={testimonials.title} />
        </div>

        <div className="testi-viewport">
          <ul
            ref={trackRef}
            className="testi-track"
            tabIndex={0}
            aria-label="Testimonials, scroll sideways to read more"
          >
            {testimonials.items.map((t, i) => (
              <li className="testi-item" key={t.name}>
                <article className={`testi tone-${i % 3}`}>
                  <span className="testi-mark" aria-hidden="true">
                    “
                  </span>
                  <blockquote>
                    <p>{t.quote}</p>
                  </blockquote>
                  <div className="testi-foot">
                    <span className="testi-avatar" aria-hidden="true">
                      {initials(t.name)}
                    </span>
                    <span>
                      <span className="testi-name">{t.name}</span>
                      <span className="testi-index" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')} / {String(testimonials.items.length).padStart(2, '0')}
                      </span>
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <div className="wrap">
          <div className="testi-progress" aria-hidden="true">
            <i ref={barRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
