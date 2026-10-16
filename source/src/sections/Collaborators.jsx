import SectionHead from '../components/SectionHead';
import CurvedLoop from '../components/reactbits/CurvedLoop';
import { collaborators } from '../data/content';

const half = Math.ceil(collaborators.names.length / 2);
const rows = [collaborators.names.slice(0, half), collaborators.names.slice(half)];

export default function Collaborators() {
  return (
    <section className="collab">
      <div className="wrap">
        <SectionHead kicker={collaborators.kicker} title={collaborators.title} />
      </div>

      {/* Two curved ribbons of names you can also drag. Screen readers get the plain list below instead. */}
      <div className="collab-loops" aria-hidden="true">
        <CurvedLoop
          marqueeText={rows[0].join('  ✦  ')}
          separator="✦"
          speed={1.2}
          curveAmount={120}
          fontSize={96}
          fontWeight={400}
          className="collab-loop-text"
          color="#211b16"
          scrollBoost={1.5}
          edgeFade={0.08}
        />
        <CurvedLoop
          marqueeText={rows[1].join('  ✦  ')}
          separator="✦"
          speed={1}
          curveAmount={120}
          direction="right"
          fontSize={96}
          fontWeight={400}
          className="collab-loop-text"
          color="#f3ead9"
          scrollBoost={1.5}
          edgeFade={0.08}
        />
      </div>

      <div className="wrap">
        <ul className="collab-row">
          {collaborators.names.map(name => (
            <li className="collab-item" key={name}>
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
