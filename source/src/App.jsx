import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Header from './components/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Markets from './sections/Markets';
import Training from './sections/Training';
import Collaborators from './sections/Collaborators';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import { scrollToHash, startSmoothScroll, stopSmoothScroll } from './lib/smoothScroll';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const progressRef = useRef(null);

  // Lenis smooth scroll, synced with ScrollTrigger.
  useEffect(() => {
    startSmoothScroll();

    // Fonts and the photo change the page height once they load, so re-measure.
    // Watching the page height catches all of these, however late they arrive.
    let timer = 0;
    let lastHeight = document.body.scrollHeight;
    const refresh = () => ScrollTrigger.refresh();
    const resizeObserver = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastHeight) < 2) return;
      lastHeight = h;
      clearTimeout(timer);
      timer = setTimeout(refresh, 150);
    });
    resizeObserver.observe(document.body);
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);

    // Open the right section if the page was loaded with a #link.
    // Layout settles in steps (fonts, photo, pinned testimonials), so keep re-aiming
    // until the visitor scrolls on their own.
    let stopAiming = () => {};
    if (window.location.hash) {
      const hash = window.location.hash;
      const go = () => scrollToHash(hash, { immediate: true });
      const userEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
      stopAiming = () => {
        ScrollTrigger.removeEventListener('refresh', go);
        window.removeEventListener('load', go);
        userEvents.forEach(ev => window.removeEventListener(ev, stopAiming));
      };
      requestAnimationFrame(go);
      window.addEventListener('load', go);
      ScrollTrigger.addEventListener('refresh', go);
      userEvents.forEach(ev => window.addEventListener(ev, stopAiming, { passive: true }));
      setTimeout(stopAiming, 4000);
    }

    return () => {
      stopAiming();
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener('load', refresh);
      stopSmoothScroll();
    };
  }, []);

  // Every in-page link (#about, #contact ...) glides with Lenis and leaves room for the header.
  useEffect(() => {
    const onClick = e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      const exists = hash === '#top' || document.getElementById(hash.slice(1));
      if (!exists) return;
      e.preventDefault();
      // Wait one frame so a closing mobile menu has unlocked the page first.
      requestAnimationFrame(() => scrollToHash(hash));
      if (window.location.hash !== hash) window.history.pushState(null, '', hash === '#top' ? window.location.pathname + window.location.search : hash);
    };
    const onPop = () => scrollToHash(window.location.hash || '#top');
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  // Thin reading progress line at the very top.
  useGSAP(() => {
    gsap.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } }
    );
  });

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <div ref={progressRef} className="progress" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Header />
      <main id="top">
        <Hero />
        <About />
        <Markets />
        <Training />
        <Collaborators />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
