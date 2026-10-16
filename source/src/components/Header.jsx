import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { nav, navCta } from '../data/content';
import { lockScroll, prefersReducedMotion } from '../lib/smoothScroll';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Header() {
  const headerRef = useRef(null);
  const drawerRef = useRef(null);
  const menuBtnRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Hide the bar while reading down the page, show it again on the way up.
  useGSAP(() => {
    const header = headerRef.current;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => {
        const y = self.scroll();
        setScrolled(y > 40);
        if (prefersReducedMotion()) return;
        const hide = self.direction === 1 && y > 300;
        gsap.to(header, { yPercent: hide ? -100 : 0, duration: 0.45, ease: 'power3.out', overwrite: true });
      }
    });

    // Highlight the menu link for the section on screen.
    const triggers = nav.map(({ href }) => {
      const el = document.querySelector(href);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: self => {
          if (self.isActive) setActive(href);
          else setActive(current => (current === href ? '' : current));
        }
      });
    });

    return () => {
      st.kill();
      triggers.forEach(t => t?.kill());
    };
  }, []);

  // Show the header whenever keyboard focus lands inside it.
  useEffect(() => {
    const header = headerRef.current;
    const show = () => gsap.to(header, { yPercent: 0, duration: 0.3, overwrite: true });
    // Also bring it back when the mouse moves up to the top edge of the window.
    const onMove = e => {
      if (e.pointerType === 'mouse' && e.clientY < 70) show();
    };
    header.addEventListener('focusin', show);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      header.removeEventListener('focusin', show);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  // Mobile menu: animate in, lock the page, close on Escape.
  useGSAP(
    () => {
      const drawer = drawerRef.current;
      const links = drawer.querySelectorAll('.drawer-link');
      const reduce = prefersReducedMotion();
      lockScroll(open);

      if (open) {
        gsap.set(drawer, { visibility: 'visible' });
        gsap.fromTo(
          drawer,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: reduce ? 0 : 0.7, ease: 'expo.inOut' }
        );
        gsap.fromTo(
          links,
          { yPercent: reduce ? 0 : 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: reduce ? 0 : 0.8, ease: 'expo.out', stagger: 0.06, delay: reduce ? 0 : 0.3 }
        );
        closeBtnRef.current?.focus({ preventScroll: true });
      } else {
        gsap.to(drawer, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: reduce ? 0 : 0.55,
          ease: 'expo.inOut',
          onComplete: () => gsap.set(drawer, { visibility: 'hidden' })
        });
      }
    },
    { dependencies: [open] }
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <>
      <header ref={headerRef} className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="nav">
          <a href="#top" className="wordmark" aria-label="EMYNAJ, back to top">
            EMY<span>NAJ</span>
          </a>
          <nav className="links" aria-label="Main">
            {nav.map(item => (
              <a key={item.href} href={item.href} className={active === item.href ? 'is-active' : undefined}>
                {item.label}
              </a>
            ))}
          </nav>
          <a href={navCta.href} className="nav-cta">
            <span>{navCta.label}</span>
          </a>
          <button
            ref={menuBtnRef}
            className="menu-btn"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="drawer"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        ref={drawerRef}
        id="drawer"
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
      >
        <button
          ref={closeBtnRef}
          className="drawer-close"
          type="button"
          aria-label="Close menu"
          onClick={() => {
            setOpen(false);
            menuBtnRef.current?.focus();
          }}
        >
          ✕
        </button>
        <nav className="drawer-nav" aria-label="Mobile">
          {nav.map((item, i) => (
            <span className="drawer-mask" key={item.href}>
              <a className="drawer-link" href={item.href} onClick={() => setOpen(false)}>
                <span className="drawer-num">0{i + 1}</span>
                {item.label}
              </a>
            </span>
          ))}
        </nav>
        <a className="drawer-cta" href={navCta.href} onClick={() => setOpen(false)}>
          {navCta.label} <span aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}
