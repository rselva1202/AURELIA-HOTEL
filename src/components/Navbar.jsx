import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import siteConfig from '../data/siteConfig';

const navLinks = [
  { label: 'About',     href: '#about' },
  { label: 'Rooms',     href: '#rooms' },
  { label: 'Dining',    href: '#dining' },
  { label: 'Gallery',   href: '#gallery' },
  { label: 'Location',  href: '#location' },
  { label: 'Contact',   href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const menuRef                   = useRef(null);

  // Shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('scroll-locked', menuOpen);
    return () => document.body.classList.remove('scroll-locked');
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <a href="#" className={styles.logo} aria-label="Aurelia Hotel — home">
            <span className={styles.logoA}>A</span>
            <span className={styles.logoText}>{siteConfig.brandName}</span>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className={styles.desktopNav}>
            <ul role="list">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={styles.navLink}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Book CTA */}
          <a
            href="#booking"
            className={`btn btn-outline ${styles.bookBtn}`}
            aria-label="Book a room enquiry"
          >
            <span>Book Now</span>
          </a>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav aria-label="Mobile navigation">
          <ul role="list" className={styles.mobileLinks}>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={styles.mobileLink} onClick={closeMenu}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#booking" className={`btn btn-sand ${styles.mobileBook}`} onClick={closeMenu}>
                <span>Book Now</span>
              </a>
            </li>
          </ul>
        </nav>
        <p className={styles.mobileLocation}>{siteConfig.location}</p>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
