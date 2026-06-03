export const site = {
  name: 'Ajeenkya (AJ) Bhatalkar',
  short: 'AJ Bhatalkar',
  tagline: 'AI Engineer. Operator. Founding-team builder.',
  location: 'San Francisco Bay Area',
  description:
    'Engineering manager turned AI-native builder. Ten years scaling identity, trust, and ML systems at Airbnb and Twitter. Now shipping voice-first agents, LLM orchestration, and indie SaaS as I look for the right zero-to-one team.',
  status:
    'Open to Head of Engineering, Founding Engineer, and Engineer-in-Residence roles at AI-native startups and venture studios.',
  links: {
    github: 'https://github.com/ajeenkya',
    linkedin: 'https://www.linkedin.com/in/ajeenkyabhatalkar/',
    email: 'mailto:ajeenkyab@gmail.com',
    resume: '/aj-bhatalkar-resume.pdf',
  },
};

export const stats = [
  { value: '10+', label: 'Years shipping', sub: 'Engineering leadership at Airbnb, Twitter, and early-stage startups' },
  { value: '$23.9M', label: 'Annualized impact', sub: 'Identity and trust systems shipped in 2025' },
  { value: '0 → 1', label: 'Shipped solo', sub: 'Three AI-native products built and launched in the last year' },
];

export const projects = [
  {
    title: 'Loadout. The OS layer for Claude Code',
    tag: 'Indie SaaS · Zero to One',
    blurb:
      'Solo-built and shipped an AI-native product in 60 days: a five-layer Claude Code operating system (CLAUDE.md, hooks, rules, memory, skills) plus an 8-chapter PDF and starter pack. Designed the architecture, wrote the code, built the landing page, ran paid traffic, and closed the first sales.',
    metrics: [
      { v: 'Live', l: 'loadout.hellomilo.app' },
      { v: '5', l: 'Composable layers' },
      { v: '3', l: 'Pricing tiers' },
      { v: '60 days', l: 'Idea to revenue' },
    ],
    note: 'Built end to end: product, brand, copy, payment rails, gates, deploy pipeline. Shows the full founder loop, not just the engineering slice.',
  },
  {
    title: 'Identity Misuse Detection. Rules to ML',
    tag: 'Platform · Applied ML',
    blurb:
      "Architected Airbnb's identity misuse detection system. Evolved it from rule-based heuristics to a full ML stack processing 83K verification events per day with 500+ online features. The model score is now a platform signal consumed across Airbnb Trust.",
    metrics: [
      { v: '83K', l: 'Daily events' },
      { v: '500+', l: 'Online features' },
      { v: '~95%', l: 'Appeal collapse' },
      { v: '$207K', l: 'Monthly savings' },
    ],
    note: 'Owned the full lifecycle: research, modeling, online infra, rollout, downstream integration with ATO, Chargeback, Fake Account, and Fraud Investigation models.',
  },
  {
    title: 'Behavioral Trajectory Score',
    tag: 'Applied ML · Self-supervised',
    blurb:
      'Authored a self-supervised sequence model for identity misuse detection. Catches misuse classes that image-and-metadata stacks miss. Designed as a Trust-wide platform primitive consumed by ATO and fraud models.',
    metrics: [
      { v: '40%', l: 'Suspension redactions cut (v4)' },
      { v: '2x', l: 'Precision lift v1 to v2' },
      { v: '+50%', l: 'Precision v2 to v3' },
      { v: '100%', l: 'Global coverage' },
    ],
    note: 'Roughly 7 hosts per week who would have been wrongly suspended are now protected. Country-aware verification waterfall.',
  },
  {
    title: 'Verso. AI-native reading companion',
    tag: 'Indie iOS · Voice AI',
    blurb:
      'Native iOS reader plus agent memory built on local LLMs and TTS pipelines. Voice-first, hands-free, ships forwarded newsletters cleanly. Built solo from concept through device QA on iPhone 17 Pro Max.',
    metrics: [
      { v: 'iOS', l: 'Native Swift' },
      { v: 'Local', l: 'On-device LLMs' },
      { v: 'TTS', l: 'k2-fsa pipeline' },
      { v: '5', l: 'Slash commands' },
    ],
    note: 'Demonstrates the voice-first stack: hands-free coding loops, TTS sweetening, agent memory, multi-modal input.',
  },
];

export const experience = [
  {
    company: 'Airbnb',
    role: 'Engineering Manager. Identity',
    where: 'San Francisco',
    when: 'Jan 2017 → Present',
    points: [
      'Leads 19 engineers across Identity Platform, Defense, and Business Verification.',
      'Roadmap covers NFC, biometrics, Airbnb Passports, and digital wallets.',
      '8 promotions under direct coaching, including 3 IC-to-manager transitions.',
      '$23.9M annualized business impact delivered in 2025 across revenue, fraud mitigation, and ops savings.',
    ],
  },
  {
    company: 'Indie (Milo Labs)',
    role: 'Solo Founder. AI-Native Products',
    where: 'Sunnyvale, CA',
    when: '2025 → Present',
    points: [
      'Loadout. Claude Code OS guide + starter pack. Designed, shipped, monetized.',
      'Verso. iOS reader with on-device agent memory and voice TTS.',
      'Glassbox AI. Visual QA agency tooling for AI-generated UI.',
    ],
  },
  {
    company: 'Twitter',
    role: 'Software Engineer',
    where: 'San Francisco',
    when: 'May 2013 → Dec 2016',
    points: [
      'Built ad formats at scale; one optimization lifted CTR by 17%.',
      'Led client engineering across Web, Android, and iOS.',
      'Built Twitter Cards and the inline rendering framework for iOS.',
    ],
  },
  {
    company: 'Booyah!',
    role: 'Gameplay Engineer',
    where: 'San Francisco',
    when: '2012 → 2013',
    points: ['Gameplay engineering for social gaming experiences at an early-stage startup.'],
  },
  {
    company: 'PlayMesh',
    role: 'iOS Game Developer',
    where: 'Mountain View',
    when: '2010 → 2012',
    points: ['iOS game development following M.S. in Computer Science from USC.'],
  },
];

export const skills = [
  {
    domain: 'Zero to One',
    items: [
      'Founding-team execution: product, engineering, GTM in one head',
      'Shipping solo: Loadout, Verso, Glassbox AI in the last 12 months',
      'Speed plus discipline: autonomous gates, ship-readiness checks, doc cascades',
      'Comfortable owning revenue, not just code',
    ],
  },
  {
    domain: 'Applied AI',
    items: [
      'Claude API and Anthropic SDK in production',
      'MCP server design and multi-agent orchestration',
      'Voice-first agents: TTS pipelines, hands-free coding loops',
      'Evals, guardrails, self-supervised sequence modeling',
    ],
  },
  {
    domain: 'Leadership at Scale',
    items: [
      'EM of 19 engineers across three sub-teams at Airbnb',
      'Identity, trust, and ML platform primitives consumed company-wide',
      '8 promotions coached, including 3 IC-to-manager transitions',
      'Compliance and regulatory readiness (DSA, KYC) at marketplace scale',
    ],
  },
];

export const aiStack = [
  { k: 'Voice-first AI', v: 'Hands-free coding loops, TTS pipelines, voice agents that ship.' },
  { k: 'LLM agents', v: 'Multi-agent orchestration, tool use, persistent memory, evals on the same loop.' },
  { k: 'Indie SaaS', v: 'Loadout, Verso, Glassbox AI. Shipping the AI-native stack as products, not demos.' },
  { k: 'Doc cascades', v: 'Autonomous gates and ship-readiness checks that compound across every project.' },
];

export const lookingFor = [
  {
    role: 'Head of Engineering / Founding Team',
    fit: 'Operator who has run 19 engineers, plus active AI-native builder reps. Bring the EM discipline; ship like a founder.',
  },
  {
    role: 'Engineer in Residence',
    fit: 'Use the runway to find product-market fit on an AI-native thesis. Identity, trust, voice, agents, and marketplace are home turf.',
  },
  {
    role: 'Founding Engineer (AI-Native)',
    fit: 'Solo-shipped Loadout in 60 days. Comfortable owning the full stack from prompt to prod to pricing page.',
  },
  {
    role: 'Founding Engineering Lead',
    fit: 'Hybrid IC plus manager from day one. Build the team, write the code, set the bar.',
  },
];
