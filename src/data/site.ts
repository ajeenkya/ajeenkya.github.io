export const site = {
  name: 'Ajeenkya (AJ) Bhatalkar',
  short: 'AJ Bhatalkar',
  tagline: 'AI Engineer · Technical Founder · Engineering Leader',
  location: 'San Francisco Bay Area',
  description:
    'Identity infrastructure, ML-powered trust systems, and next-generation AI agents. Building the AI-native stack with voice-first interfaces, LLM agents, and product-grade automation.',
  links: {
    github: 'https://github.com/ajeenkya',
    linkedin: 'https://www.linkedin.com/in/ajeenkya/',
    email: 'mailto:ajeenkyab@gmail.com',
    resume: '/aj-bhatalkar-resume.pdf',
  },
};

export const stats = [
  { value: '10+', label: 'Years', sub: 'Engineering leadership at Airbnb, Twitter, and early-stage startups' },
  { value: '$23.9M', label: 'Annualized impact', sub: 'Combined business value delivered in 2025' },
  { value: '19', label: 'Engineers', sub: 'Identity Platform, Defense, and Business Verification' },
];

export const projects = [
  {
    title: 'Identity Misuse Detection: Rules to ML',
    tag: 'Trust & Safety',
    blurb:
      "Architected Airbnb's identity misuse detection system. Evolved from rule-based heuristics to a full ML stack processing 83K verification events per day with 500+ online features.",
    metrics: [
      { v: '83K', l: 'Daily events' },
      { v: '500+', l: 'Online features' },
      { v: '~95%', l: 'Appeal collapse' },
      { v: '$207K', l: 'Monthly savings' },
    ],
    note: 'The model score became a platform signal, consumed by ATO, Chargeback, Fake Account, and Fraud Investigation models across Airbnb.',
  },
  {
    title: 'Behavioral Trajectory Score',
    tag: 'Applied ML',
    blurb:
      'Self-supervised sequence model for identity misuse detection. Catches misuse classes that image-and-metadata stacks miss. Designed as a Trust-wide platform primitive.',
    metrics: [
      { v: '40%', l: 'Suspension redactions cut (v4)' },
      { v: '2x', l: 'Precision lift v1 to v2' },
      { v: '+50%', l: 'Precision v2 to v3' },
      { v: '100%', l: 'Global coverage' },
    ],
    note: 'Roughly 7 hosts per week who would have been wrongly suspended are now protected.',
  },
  {
    title: 'Loadout',
    tag: 'AI-Native Product',
    blurb:
      'Solo-built indie product: the OS layer for Claude Code. Five-layer architecture (CLAUDE.md, hooks, rules, memory, skills) shipped as a starter pack plus an 8-chapter PDF guide.',
    metrics: [
      { v: 'Live', l: 'loadout.hellomilo.app' },
      { v: '5', l: 'Composable layers' },
      { v: '3', l: 'Pricing tiers' },
      { v: '1', l: 'Founder' },
    ],
    note: 'Ships with autonomous gates (claim-verification, ship-readiness, em-dash discipline) plus a doc-cascade rule library that compounds across sessions.',
  },
];

export const experience = [
  {
    company: 'Airbnb',
    role: 'Engineering Manager · Identity',
    where: 'San Francisco',
    when: 'Jan 2017 → Present',
    points: [
      'Leads 19 engineers across Identity Platform, Defense, and Business Verification.',
      'Roadmap covers NFC, biometrics, Airbnb Passports, and digital wallets.',
      '8 promotions under direct coaching, including 3 IC-to-manager transitions.',
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
    domain: 'Leadership',
    items: ['Team building from zero', 'Succession planning', 'Cross-functional execution at scale', '8 promotions coached'],
  },
  {
    domain: 'Marketplace & Trust',
    items: ['Identity verification primitives', 'KYC and regulatory readiness (DSA)', 'Trust & safety systems', 'ML-in-the-loop at global scale'],
  },
  {
    domain: 'Applied AI',
    items: ['Claude API and Anthropic SDK', 'MCP server design', 'Agent orchestration', 'Evals and guardrails', 'Self-supervised sequence modeling'],
  },
];

export const aiStack = [
  { k: 'Voice-first AI', v: 'Hands-free coding, TTS pipelines, voice agents that speak before they think.' },
  { k: 'LLM agents', v: 'Multi-agent orchestration, tool use, persistent memory, evals on the same loop.' },
  { k: 'SaaS experiments', v: 'Loadout, Verso, Glassbox AI: shipping indie products on the AI-native stack.' },
  { k: 'Automation', v: 'Doc cascades, autonomous gates, ship-readiness checks that compound across projects.' },
];
