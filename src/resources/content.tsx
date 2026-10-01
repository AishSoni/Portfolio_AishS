import { About, Gallery, Home, Person, Social, Work } from "@/types";

const person: Person = {
  firstName: "Aish",
  lastName: "Soni",
  name: "Aish Soni",
  role: "Full-Stack & Applied AI Engineer",
  avatar: "/images/avatar.png",
  email: "aishsoni15@gmail.com",
  location: "Asia/Kolkata",
  locationDisplay: "Indore, India",
  languages: ["Hindi", "English"],
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/AishSoni",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/aish-soni15/",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: "Portfolio of Aish Soni, a full-stack and applied AI engineer building reliable products and developer tools.",
  headline: <>I build AI products and reliable web systems.</>,
  featured: {
    display: false,
    title: (
      <>
        Recent project: <strong className="ml-4">Fabriik</strong>
      </>
    ),
    href: "/work/fabriik-multiplayer-canvas-editor",
  },
  subline: (
    <>
      I work across product engineering, applied AI, and distributed systems. <br />
      I enjoy turning ambiguous problems into useful software—from multi-agent workspaces and research tools
      to real-time collaborative editors and production insurance journeys. <br />
      I care about clear interfaces, validated state transitions, and systems that remain understandable as they grow.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
    description: `Meet ${person.name}, ${person.role} from ${person.locationDisplay ?? person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I am a full-stack and applied AI engineer who likes working close to both the product and the system underneath it.
        I have built AI agents, RAG pipelines, real-time collaboration tools, developer tools, and production web flows.
        My approach is practical: understand the failure modes, make the important state explicit, and ship a small reliable path before adding complexity.
        Outside engineering, I have led developer communities, organized national events, and worked with cross-functional teams.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Plum Benefits",
        timeframe: "Jan 2026 – Jul 2026",
        role: "SDE Intern · Bangalore",
        achievements: [
          <>Owned the Retail Health Insurance self-checkout journey across web and mobile: a 13-step flow covering eKYC, medical questionnaires, and payment.</>,
          <>Designed and shipped a production payment flow without insurer SDKs or webhooks, using a 7-state FSM across browser tabs, native WebView bridges, and backend polling fallbacks.</>,
          <>Added New Relic observability across ICICI Lombard, HDFC Ergo, and Niva Bupa, covering success rates, error classification, and latency percentiles.</>,
          <>Added Meta Graph API support and webhook-based Metabase observability, reducing WhatsApp messaging costs by up to 92%.</>,
          <>Initiated a 115-file frontend refactor with a Zustand-backed step machine, runtime Zod schema generation, and descriptor-driven dynamic form rendering for a future insurer aggregator integration.</>,
        ],
        images: [],
      },
      {
        company: "Resustainability",
        timeframe: "May 2025 – Aug 2025",
        role: "Software Engineering Intern · Indore",
        achievements: [
          <>Built an LLM-powered internal support tool with LangChain and LiteLLM using Qwen, reducing IT support requests by 21%.</>,
          <>Deployed Linux-based internal applications as Docker images on AWS EC2, improving ESG reporting efficiency by 34%.</>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Studies",
    institutions: [
      {
        name: "Indian Institute of Information Technology, Bhopal",
        description: <>B.Tech in Electronics & Communication Engineering · Oct 2022 – Jun 2026 · CGPA 8.41/10</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Product Engineering",
        description: <>TypeScript, JavaScript, Python, React, Next.js, Node.js, FastAPI, SQL, Postgres, Supabase, and Firebase for full-stack products and internal tools.</>,
        images: [],
      },
      {
        title: "Applied AI Systems",
        description: <>RAG, LangChain, LangGraph, MCPs, DeepEval, Qdrant, multi-agent orchestration, provider abstractions, structured outputs, and LLM evaluation.</>,
        images: [],
      },
      {
        title: "Distributed & Real-Time Systems",
        description: <>Yjs CRDTs, Cloudflare Durable Objects, WebSockets, SSE, state machines, optimistic updates, validation gates, and rollback-safe workflows.</>,
        images: [],
      },
      {
        title: "Cloud & Delivery",
        description: <>Docker, Linux, AWS EC2, Google Cloud, Cloudflare Workers, CI/CD, GitHub Actions, observability, and production troubleshooting.</>,
        images: [],
      },
      {
        title: "Programming Foundations",
        description: <>C++, Python, data structures and algorithms, database systems, computer networks, operating systems, system design, and competitive programming.</>,
        images: [],
      },
      {
        title: "Leadership & Community",
        description: <>GDG On Campus Lead Organizer, elected Student Council Secretary, and co-founder of Axios. Led 26–30 member teams and organized workshops, speaker sessions, and a national hackathon.</>,
        images: [],
      },
    ],
  },
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Selected software, AI, and systems projects by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Gallery – ${person.name}`,
  description: `A collection of images and moments captured by ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "Horizontal image 1",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "Vertical image 1",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "Horizontal image 2",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "Vertical image 2",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "Horizontal image 3",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "Vertical image 3",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "Horizontal image 4",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "Vertical image 4",
      orientation: "vertical",
    },
  ],
};

export { person, social, home, about, work, gallery };
