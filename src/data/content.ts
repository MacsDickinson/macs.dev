// Central content source for the site. Blog posts are placeholders to be
// retrofitted with real content later.

export type Talk = {
  type: 'Talk' | 'Workshop' | 'Podcast';
  title: string;
  venue: string;
  date: string;
  description: string;
  upcoming?: boolean;
};

export type Principle = {
  title: string;
  body: string;
};

export type WorkRole = {
  period: string;
  role: string;
  company: string;
  description: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tag: string;
  body: string[];
};

export type PodcastEpisode = {
  number: string;
  title: string;
  show: string;
  date: string;
  duration: string;
  description: string;
};

export const PROFILE = {
  name: 'Macs Dickinson',
  role: 'Engineering Director',
  company: 'LHV Bank',
  tagline:
  'Talking about software and other less interesting things since 2009.',
  intro:
  'I specialise in scaling high-performance engineering teams with a focus on sustainable growth, organisational health, and leveraging AI safely in regulated environments.',
  previously: ['Sky Betting & Gaming', 'PokerStars', 'Ticket Arena'],
  email: 'contact@macs.dev',
  location: 'United Kingdom'
};

export const ASK_ME_ABOUT = [
'Scaling engineering teams without losing culture',
'Restructuring orgs for better flow',
'Making AI actually useful in regulated industries',
'Mental health in the workplace'];


export const PRINCIPLES: Principle[] = [
{
  title: 'Teams > Tools',
  body: 'Culture eats strategy for breakfast. Tools are secondary to communication.'
},
{
  title: 'Measure Outcomes',
  body: 'Activity is not progress. Focus on business value and customer impact.'
},
{
  title: 'Sustainable Pace',
  body: 'Burnout destroys more value than it creates. Long-term thinking wins.'
},
{
  title: 'AI as Leverage',
  body: "AI isn't magic, it's a force multiplier for capable engineers."
},
{
  title: 'Humans First',
  body: 'People are humans before they are employees. Respect who they are, not just what they do.'
},
{
  title: 'Living Systems',
  body: 'Organisations grow, adapt, and evolve. Static structures guarantee fragility.'
}];


export const TALKS: Talk[] = [
{
  type: 'Talk',
  title: 'Leading Through the Noise: Making AI Stick in Engineering Teams',
  venue: 'Wrk Digital: Leadership',
  date: 'Mar 2026',
  upcoming: true,
  description:
  'AI is evolving faster than engineering organisations can comfortably track, leaving leaders to cut through constant noise and hype. This talk focuses on how engineering leaders can drive real AI adoption through culture, experimentation and clear decision-making.'
},
{
  type: 'Workshop',
  title:
  'Nimble Scaling: LHV Bank accelerates value flow through Team Topologies',
  venue: 'Conflux Case Study',
  date: 'Dec 2025',
  description:
  'Hands-on workshops on restructuring engineering organisations for flow, alignment and sustainable delivery.'
},
{
  type: 'Talk',
  title: 'AI, Data & Automation: Redefining the Customer Experience',
  venue: 'Open Banking Expo 2025',
  date: 'Oct 2025',
  description:
  'Session on how AI, data and automation are transforming customer experience in financial services, representing LHV Bank at Open Banking Expo 2025.'
},
{
  type: 'Podcast',
  title: 'What Regulated Engineering Teaches You About Trust',
  venue: 'The Engineering Room',
  date: 'Aug 2025',
  description:
  'A conversation on building software where the cost of being wrong is measured in more than downtime, and why constraints can make better engineers.'
}];


export const WORK: WorkRole[] = [
{
  period: '2023 — Present',
  role: 'Engineering Director',
  company: 'LHV Bank',
  description:
  'Leading engineering across a growing UK bank, scaling high-performing teams and embedding AI safely within a heavily regulated environment.'
},
{
  period: '2019 — 2023',
  role: 'Head of Engineering',
  company: 'Sky Betting & Gaming',
  description:
  'Scaled platform teams and led org design work, focusing on flow, developer experience and sustainable delivery at scale.'
},
{
  period: '2015 — 2019',
  role: 'Engineering Lead',
  company: 'PokerStars',
  description:
  'Built and led teams shipping high-throughput, high-availability systems for a global real-money gaming platform.'
},
{
  period: '2009 — 2015',
  role: 'Software Engineer',
  company: 'Ticket Arena',
  description:
  'Where it started — building ticketing and events platforms, and learning to talk about software in public for the first time.'
}];


export const PODCASTS: PodcastEpisode[] = [
{
  number: '048',
  title: 'Making AI Stick Without the Hype',
  show: 'The Engineering Room',
  date: 'May 2026',
  duration: '52 min',
  description:
  'How to move engineering teams past AI theatre toward genuine, durable adoption.'
},
{
  number: '041',
  title: 'Org Design for Flow',
  show: 'Deploy Friday',
  date: 'Feb 2026',
  duration: '47 min',
  description:
  'Team Topologies in practice, and what actually changed value flow at LHV Bank.'
},
{
  number: '033',
  title: 'Mental Health in Engineering Leadership',
  show: 'Lead Dev Radio',
  date: 'Nov 2025',
  duration: '61 min',
  description:
  'An honest conversation about burnout, boundaries and leading people as humans first.'
}];


export const BLOG_POSTS: BlogPost[] = [
{
  slug: 'culture-eats-strategy',
  title: 'Culture Eats Strategy for Breakfast (and Tools for Lunch)',
  excerpt:
  'Why the org chart you cannot see matters more than the one you can, and how communication quietly decides what your teams can build.',
  date: '2026-04-18',
  readingTime: '7 min read',
  tag: 'Leadership',
  body: [
  'Every engineering organisation ships two things: the product, and a reflection of how its people talk to each other. The second one is invisible until it breaks.',
  'When leaders reach for tools to fix delivery problems, they are usually treating a symptom. A new project tracker will not repair a team that does not trust each other, and a shinier CI pipeline will not fix decisions being made in the wrong rooms.',
  'The uncomfortable truth is that most scaling problems are communication problems wearing a technical costume. Solve the communication, and the architecture tends to follow.',
  'This is why I obsess over team boundaries, hand-offs and cognitive load long before I worry about frameworks. Get the human system right, and the technical system has a fighting chance.']

},
{
  slug: 'ai-in-regulated-environments',
  title: 'Making AI Actually Useful in a Regulated Bank',
  excerpt:
  'Hype is cheap and regulators are patient. A practical look at adopting AI where the cost of being wrong is measured in more than downtime.',
  date: '2026-03-02',
  readingTime: '9 min read',
  tag: 'AI',
  body: [
  'In a bank, "move fast and break things" is not a slogan, it is an incident report waiting to happen. That does not mean AI has no place, it means the bar for trust is higher.',
  'We started by treating AI as leverage for capable engineers rather than a replacement for judgement. The goal was never to remove humans from the loop, but to remove toil so humans could spend their attention where it matters.',
  'Governance came first, not last. Every use case had a clear owner, a clear boundary, and a clear answer to "what happens when this is wrong?". That framing turned a scary topic into an engineering problem.',
  'The result was not a moonshot. It was a steady accumulation of small, boring, reliable wins, which is exactly what regulated software should look like.']

},
{
  slug: 'restructuring-for-flow',
  title: 'Restructuring an Org Without Grinding It to a Halt',
  excerpt:
  'Reorgs have a terrible reputation for good reason. Here is how to change the shape of a team while keeping value flowing.',
  date: '2026-01-20',
  readingTime: '6 min read',
  tag: 'Org Design',
  body: [
  'Most reorgs fail because they optimise the box-and-line diagram instead of the flow of work through it. People end up in tidy boxes and delivery quietly gets worse.',
  'I start from the streams of value a company cares about and design teams backwards from there. If a team cannot own something end to end, that is a design smell worth chasing down.',
  'Change is applied in slices, not big bangs. One boundary at a time, measured, adjusted, and only then repeated. Living systems adapt, they do not get bulldozed.',
  'Done well, a restructure barely registers as an event. It feels like the organisation slowly starting to breathe more easily.']

}];