import { About, Home, Person, Social, Work } from "@/types";

const person: Person = {
  firstName: "Aish Soni",
  lastName: "Soni",
  name: `Aish Soni`,
  role: "Aspiring Software Engineer",
  avatar: "/images/avatar.png",
  email: "aishsoni15@gmail.com",
  location: "Asia/Kolkata", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["Hindi", "English"], // optional: Leave the array empty if you don't want to display languages
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
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
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Curious. Consistent. Always building.</>,
  featured: {
    display: false,
    title: (
      <>
        Recent project: <strong className="ml-4">Once UI</strong>
      </>
    ),
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
    <>
      Curious. Consistent. Always building. <br />
      That’s how I’d describe myself. I’m currently studying at IIIT Bhopal, but most of my growth has happened outside classrooms <br />
      organizing national hackathons, leading developer clubs, and shipping projects that people actually use. <br />
      I thrive at the intersection of code, design, and leadership, and I’m excited to keep building impactful software with great teams.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
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
        I am a B.Tech Electronics and Communication Engineering student at IIIT Bhopal with a strong interest in technology, leadership, and community building.
        Always learning and looking into new cool tech, I enjoy taking initiative,
        learning from challenges, and working with diverse teams.
        Alongside my technical skills, I bring strengths in communication, public speaking,
        and design, which help me connect ideas with people.
        I am always looking for opportunities to grow as a developer, collaborator, and leader.
      </>
    ),
  },
  work: {
    display: false, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "FLY",
        timeframe: "2022 - Present",
        role: "Senior Design Engineer",
        achievements: [
          <>
            Redesigned the UI/UX for the FLY platform, resulting in a 20%
            increase in user engagement and 30% faster load times.
          </>,
          <>
            Spearheaded the integration of AI tools into design workflows,
            enabling designers to iterate 50% faster.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Once UI Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Creativ3",
        timeframe: "2018 - 2022",
        role: "Lead Designer",
        achievements: [
          <>
            Developed a design system that unified the brand across multiple
            platforms, improving design consistency by 40%.
          </>,
          <>
            Led a cross-functional team to launch a new product line,
            contributing to a 15% increase in overall company revenue.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Indian Institute of Information Technology, Bhopal",
        description: <>Studying electronics and comms engineering.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
              {
                title: "Full-Stack Development",
                description: (
                  <>I love taking an idea from scratch to production—building with React, Next.js, Node.js, and Firebase, and making sure users actually enjoy the experience.</>
                ),
                images: [],
              },
              {
                title: "AI & Intelligent Systems",
                description: (
                  <>From research agents to resume reviewers, I build AI tools using Python, LangChain, LangGraph, and FastAPI—focused on real-world impact, not just demos.</>
                ),
                images: [],
              },
              {
                title: "Cloud & DevOps",
                description: (
                  <>Comfortable deploying on Google Cloud and Dockerized environments, balancing speed, privacy, and scalability for projects big and small.</>
                ),
                images: [],
              },
              {
                title: "Programming Foundations",
                description: (
                  <>Strong problem-solving in C++ and Python, with experience in algorithms, databases, and system design—backed by competitive programming practice.</>
                ),
                images: [],
              },
              {
                title: "Design & Collaboration",
                description: (
                  <>Blending engineering with creativity—leading 30+ member teams, organizing hackathons with 1,000+ participants, and designing visuals for 20+ events.</>
                ),
                images: [],
              },
              {
                title: "Communication & Leadership",
                description: (
                  <>Public speaking, community building, and cross-team collaboration—because the best tech gets built when people work well together.</>
                ),
                images: [],
              },
            ],
  },
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

export { person, social, home, about, work };