import styles from './WaveDivider.module.css';

/**
 * SVG wave divider between sections.
 * @param {string} fillFrom - CSS colour of the section above
 * @param {string} fillTo   - CSS colour of the section below (wave fill)
 * @param {boolean} flip    - flips the wave vertically
 */
export default function WaveDivider({ fillFrom = '#fdf8f0', fillTo = '#f5e6c8', flip = false }) {
  return (
    <div
      className={`${styles.waveDivider} ${flip ? styles.flip : ''}`}
      aria-hidden="true"
      style={{ background: fillFrom }}
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={fillTo}
        />
      </svg>
    </div>
  );
}
