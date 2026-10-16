import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const raf = time => lenis?.raf(time * 1000);

// Starts Lenis and keeps it in step with GSAP ScrollTrigger.
// People who ask their device for less motion get normal browser scrolling.
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return null;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function stopSmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(raf);
  lenis.destroy();
  lenis = null;
}

export const getLenis = () => lenis;

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle('scroll-locked', locked);
}

const headerOffset = () => {
  const header = document.querySelector('.site-header');
  return header ? header.offsetHeight : 0;
};

// Scrolls to "#id" (or the very top for "#top"), leaving room for the fixed header.
export function scrollToHash(hash, { immediate = false } = {}) {
  const id = hash.replace(/^#/, '');
  const target = id === 'top' || id === '' ? 0 : document.getElementById(id);
  if (target === null) return false;

  if (lenis) {
    // Make sure Lenis knows the current page height before it aims.
    lenis.resize();
    lenis.scrollTo(target, {
      offset: target === 0 ? 0 : -headerOffset() + 1,
      immediate,
      force: true,
      duration: 1.4,
      easing: t => 1 - Math.pow(1 - t, 4)
    });
  } else {
    const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - headerOffset() + 1;
    window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
  }
  return true;
}
