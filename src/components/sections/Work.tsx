import { WORK } from '../../data/content';
import { PaperPage } from '../PaperPage';
import { PaperDisclosure } from '../PaperDisclosure';

export function Work() {
  return <PaperPage id="work" label="Work" title="Building teams. Shipping software." description="From automating translation workflows to building a bank. The work, and the teams behind it.">
    <div className="paper-career">{WORK.map((role, i) => <PaperDisclosure key={role.company + role.period} defaultOpen={i === 0} heading={<span className="paper-role-heading"><span className="paper-meta">{role.period}</span><span className="paper-role-company">{role.company}</span><span className="paper-role-title">{role.role}</span></span>}>
      <p>{role.description}</p>
    </PaperDisclosure>)}</div>
  </PaperPage>;
}
