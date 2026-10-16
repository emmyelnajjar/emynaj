import SplitText from './reactbits/SplitText';

// Kicker line plus a section title that rises in line by line as it scrolls into view.
export default function SectionHead({ kicker, title, small = false }) {
  return (
    <div className={`section-head${small ? ' is-small' : ''}`}>
      <SplitText
        text={kicker}
        tag="span"
        className="kicker"
        splitType="chars"
        textAlign="left"
        delay={25}
        duration={0.9}
        effect="fade"
        rootMargin="-60px"
      />
      <SplitText
        text={title}
        tag="h2"
        className="section-title"
        splitType="lines"
        mask
        textAlign="left"
        delay={110}
        duration={1.2}
        ease="expo.out"
        from={{ yPercent: 105 }}
        to={{ yPercent: 0 }}
        rootMargin="-60px"
      />
    </div>
  );
}
