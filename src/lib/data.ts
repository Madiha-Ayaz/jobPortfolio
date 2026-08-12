// src/lib/data.ts
// Single source of truth for portfolio content. Used by both the Vite
// frontend (via `@/lib/data`) and the AI server (via a relative import).

export interface Project {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    liveUrl: string;
    repoUrl: string;
  }
  
  export const projects: Project[] = [
    {
      id: 1,
      title: 'Rent Car',
      description: 'A modern car rental platform with features for searching, filtering, and booking vehicles. Built with Next.js and a custom backend.',
      imageUrl: '/car rent.PNG', 
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      liveUrl: 'https://car-rent-website-update.vercel.app/',
      repoUrl: 'https://github.com/Madiha-Ayaz/car-rent-website-update.git',
    },
    {
      id: 2,
      title: 'Attendance App',
      description: 'An intuitive and user-friendly application designed to manage and track attendance efficiently, with features for adding, editing, and monitoring attendance records',
      imageUrl: '/pp attendence.png', 
      tags: ['html', 'css', 'javascript'],
      liveUrl: 'https://madiha-ayaz.github.io/attendenceapp/',
      repoUrl: 'https://github.com/Madiha-Ayaz/attendenceapp.git',
    },
    {
      id: 3,
      title: 'Modern Bank UI',
      description: 'A sleek and responsive user interface for a modern banking application, focusing on UX and data visualization.',
      imageUrl: '/Capture.PNG',
      tags: ['React', 'Vite', 'UI/UX', 'Charts.js'],
      liveUrl: '#',
      repoUrl: '#',
    },
    {
      id: 4,
      title: 'Word processor app',
      description: 'A smart word processing tool that leverages GPT-3 to summarize long articles and texts into concise, easy-to-read summaries, enhancing productivity and readability',
      imageUrl: '/unnamed.jpg',
      tags: ['Node.js', 'javascript', 'local storage'],
      liveUrl: 'https://client-node-js-2nd-project.vercel.app/',
      repoUrl: 'https://github.com/Madiha-Ayaz/client-node.js-2nd-project.git',
    },
    {
      id: 5,
      title: 'BMI Calculator',
      description: 'A simple and effective Body Mass Index calculator with a user-friendly interface and clear result presentation.',
      imageUrl: '/BMI+levels-640w.webp',
      tags: ['UV', 'Python', 'Streamlit'],
      liveUrl: 'https://madiha-ayaz-bmi-calculator-main-xreqth.streamlit.app/',
      repoUrl: 'https://github.com/Madiha-Ayaz/BMI-Calculator.git',
    },
    {
      id: 6,
      title: 'Student ID Card ',
      description: 'A web-based Student ID Card application that allows users to create, view, and manage student identification cards efficiently with a clean and responsive design.',
      imageUrl: '/id card.jpg',
      tags: ['Firebase authentication'],
      liveUrl: 'https://student-id-card-ten.vercel.app/',
      repoUrl: 'https://github.com/Madiha-Ayaz/student-id-card.git',
    },
    {
      id: 7,
      title: 'Antigravity Hackathon (Google)',
      description: 'A standout AI-powered project built for Google\'s Antigravity Hackathon. An intelligent agent that monitors and reacts in real time, sending instant WhatsApp and voice call alerts for detected threats.',
      imageUrl: '/antigravity-hackathon.jpg',
      tags: ['AI Agent', 'Next.js', 'TypeScript', 'WhatsApp', 'Google Hackathon'],
      liveUrl: 'https://hackathon-main-flax.vercel.app/',
      repoUrl: 'https://github.com/Madiha-Ayaz/Final_antigravity_hackathon.git',
    },
    {
      id: 8,
      title: 'SmartBank - Agentic AI Banking',
      description: 'A full-stack AI-based smart banking platform with a modern React/Vite UI, agentic AI workflows, document AI verification, a RAG knowledge base, and secure banking APIs.',
      imageUrl: '/smartbank-screenshot.png',
      tags: ['React', 'TypeScript', 'AI Agents', 'Python', 'RAG'],
      liveUrl: 'https://ui-beta-flame.vercel.app/',
      repoUrl: 'https://github.com/Madiha-Ayaz/SmartBank-Agentic-AI-Banking-Platform.git',
    },
  ];
  
  export interface BlogPost {
      id: number;
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      author: string;
      date: string;
      tags: string[];
      imageUrl: string;
  }
  
  export const blogPosts: BlogPost[] = [
    {
        id: 1,
        slug: 'my-journey-from-curiosity-to-code',
        title: 'The Road Less Traveled: My Journey from Curiosity to Code',
        excerpt: 'A personal story of late-night coding sessions, tireless efforts, and the passion that drives me to build fast, flawless, and intelligent web applications.',
        content: `
<p>Every developer has a story of how they started. Mine isn't one of overnight success, but of gradual, persistent effort—a journey fueled by a simple question: "How does this work?" My name is Madiha Ayaz, and this is the story of how my curiosity transformed into a career dedicated to building the future of the web.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The First Spark</h3>
<p>It began with a fascination for the seamless digital experiences that shape our world. I wanted to understand the magic behind the curtain. This curiosity led me to my first line of code, and from that moment, I was hooked. The path was challenging, marked by late-night coding sessions, complex bugs, and the daunting feeling of facing a mountain of new technologies. Yet, with every problem solved and every concept mastered, my passion only grew stronger.</p>
<h3 class="text-xl font-bold mt-6 mb-3">A Commitment to Growth</h3>
<p>My journey has been one of continuous learning. I believe that in the fast-paced world of web development, standing still is moving backward. This belief led me to pursue certifications from renowned institutions like <strong>PIAIC</strong>, <strong>GIAIC</strong>, and <strong>SMIT</strong>. These programs provided me with a structured and deep understanding of computer science and web development principles, validating my skills and reinforcing my commitment to my craft.</p>
<h3 class="text-xl font-bold mt-6 mb-3">My Philosophy: Fast, Flawless, and Intelligent</h3>
<p>Through my experiences, I have cultivated a simple yet powerful development philosophy. I strive to build applications that are:</p>
<ul class="list-disc list-inside space-y-2">
    <li><strong>Fast:</strong> Because in today's world, speed is a feature.</li>
    <li><strong>Flawless:</strong> Because user trust is built on reliability and attention to detail.</li>
    <li><strong>Intelligent:</strong> Because the best applications feel like they are designed just for you.</li>
</ul>
<p>This philosophy is the "why" behind every technical choice I make. It’s a promise to my clients and their users. My story is a testament to the power of passion and perseverance. It’s a reminder that with enough dedication, curiosity can indeed be transformed into expertise.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-11-28',
        tags: ['Personal Growth', 'Motivation', 'Web Development', 'Career'],
        imageUrl: '/arab-woman-abaya-hijab-girl-muslim-working-laptop-office-education-online-entrepreneur-freelancer_1030874-9889.avif',
    },
    {
        id: 2,
        slug: 'case-study-portfolio-with-ai-chatbot',
        title: 'Case Study: Building My Personal Portfolio with an AI Chatbot',
        excerpt: 'A deep dive into the process of building this portfolio using Next.js, Tailwind CSS, TypeScript, and Firebase, including the integration of a custom AI chatbot.',
        content: `
<p>A personal portfolio is more than just a resume; it's a developer's digital handshake. For my own portfolio, I wanted to create an immersive experience that not only showcases my work but also my skills in action. This case study breaks down how I built this website using a modern tech stack and integrated a custom AI chatbot.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Project Planning & Tech Stack</h3>
<p>The primary goal was to build a fast, responsive, and visually appealing portfolio that could also serve as a demonstration of my technical abilities. I chose the following technologies:</p>
<ul class="list-disc list-inside space-y-2">
    <li><strong>Next.js & React:</strong> For its performance benefits, server-side rendering, and robust component model.</li>
    <li><strong>TypeScript:</strong> To ensure type safety and improve code quality and maintainability.</li>
    <li><strong>Tailwind CSS:</strong> For rapid, utility-first styling and creating a responsive design.</li>
    <li><strong>Firebase Authentication:</strong> To provide a secure and easy-to-implement authentication system.</li>
    <li><strong>Python & Flask:</strong> For the backend of the custom AI chatbot, leveraging the power of Google's Gemini API.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">The Challenge: The AI Chatbot</h3>
<p>The most exciting and challenging part of this project was integrating a custom AI chatbot. The main hurdles were:</p>
<ol class="list-decimal list-inside space-y-2">
    <li><strong>API Key Security:</strong> Exposing the Gemini API key on the client-side was not an option.</li>
    <li><strong>Real-time Communication:</strong> The interaction between the user and the chatbot needed to be smooth and feel instantaneous.</li>
</ol>
<h3 class="text-xl font-bold mt-6 mb-3">The Solution</h3>
<p>To solve the security issue, I built a simple backend proxy server using <strong>Python</strong> and <strong>Flask</strong>. The Next.js frontend sends the user's message to this Flask server, which then securely communicates with the Gemini API. This approach ensures that the API key remains safe on the server.</p>
<p>For the user interface, I created a chat component in React that manages the conversation state, handles user input, and displays the messages in a clean, intuitive way. The result is a seamless and interactive experience that allows visitors to engage with me and my work on a deeper level.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Results and Takeaways</h3>
<p>This project was a fantastic learning experience that allowed me to apply my skills in a real-world context. The final result is a portfolio that is not only a showcase of my projects but also a project in itself—a testament to my philosophy of building fast, flawless, and intelligent web applications.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-11-27',
        tags: ['Case Study', 'Next.js', 'TypeScript', 'Firebase', 'AI', 'Chatbot'],
        imageUrl: '/screen shot.PNG',
    },
    {
        id: 3,
        slug: 'tutorial-firebase-authentication-nextjs',
        title: 'Tutorial: A Step-by-Step Guide to Firebase Authentication in Next.js',
        excerpt: 'A comprehensive tutorial on integrating Firebase Authentication into your Next.js and React application using TypeScript.',
        content: `
<p>Firebase Authentication is a powerful and easy-to-use service for managing user authentication. In this tutorial, I'll walk you through the process of integrating it into a modern Next.js 14 application using TypeScript.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Step 1: Set Up Your Firebase Project</h3>
<p>First, head over to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a>, create a new project, and navigate to the "Authentication" section. Enable the sign-in methods you want to support (e.g., Email/Password, Google, etc.).</p>
<h3 class="text-xl font-bold mt-6 mb-3">Step 2: Install Firebase in Your Next.js App</h3>
<p>In your Next.js project, install the Firebase SDK:</p>
<pre><code class="language-bash">npm install firebase
</code></pre>
<h3 class="text-xl font-bold mt-6 mb-3">Step 3: Create a Firebase Configuration File</h3>
<p>Create a file, for example, <code>src/lib/firebase.ts</code>, to initialize Firebase. Store your API keys in environment variables (<code>.env.local</code>) and prefix them with <code>NEXT_PUBLIC_</code> to make them accessible on the client-side.</p>
<pre><code class="language-typescript">// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... and other config values
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
</code></pre>
<h3 class="text-xl font-bold mt-6 mb-3">Step 4: Create an Authentication Context</h3>
<p>A React Context is an excellent way to manage and provide the user's authentication state throughout your application. Create a file like <code>src/context/AuthContext.tsx</code>.</p>
<pre><code class="language-typescript">// src/context/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
</code></pre>
<p>Then, wrap your application's layout with the <code>AuthProvider</code> in <code>src/app/layout.tsx</code>.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Step 5: Build Your Login Component</h3>
<p>Now you can create a login page that uses Firebase's authentication methods, like <code>signInWithEmailAndPassword</code>, and the <code>useAuth</code> hook to get the user's state.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Security Best Practice</h3>
<p>Always validate user sessions on the server-side for protected routes and API endpoints, especially for write operations to your database. While client-side checks are great for UI changes, never trust the client alone for security-sensitive actions.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-11-26',
        tags: ['Tutorial', 'Next.js', 'Firebase', 'Authentication', 'TypeScript'],
        imageUrl: '/images.jpeg',
    }
  ];

/* ═══════════════════════════════════════════════════════════════
   PROFILE & AI KNOWLEDGE BASE
   Central, structured profile used by the AI backend (job matching,
   semantic search, agent grounding) and by the frontend.
   ═══════════════════════════════════════════════════════════════ */

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'ai' | 'design' | 'tools';
}

export const skills: Skill[] = [
  { name: 'React', level: 92, category: 'frontend' },
  { name: 'Next.js', level: 90, category: 'frontend' },
  { name: 'JavaScript', level: 92, category: 'frontend' },
  { name: 'TypeScript', level: 88, category: 'frontend' },
  { name: 'Tailwind CSS', level: 95, category: 'frontend' },
  { name: 'HTML/CSS', level: 95, category: 'frontend' },
  { name: 'Animations', level: 88, category: 'frontend' },
  { name: 'Node.js', level: 80, category: 'backend' },
  { name: 'Python', level: 78, category: 'backend' },
  { name: 'Firebase', level: 82, category: 'backend' },
  { name: 'REST APIs', level: 78, category: 'backend' },
  { name: 'AI Chatbots', level: 85, category: 'ai' },
  { name: 'Prompt Engineering', level: 84, category: 'ai' },
  { name: 'Generative AI', level: 82, category: 'ai' },
  { name: 'Figma', level: 75, category: 'design' },
  { name: 'Git & GitHub', level: 85, category: 'tools' },
];

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export const certifications: Certification[] = [
  { name: 'Fundamentals of Python with AI', issuer: 'Presidential Initiative AI Course (PIAIC)', year: '2022' },
  { name: 'Generative AI', issuer: 'Governor Initiative AI Course (GIAIC)', year: '2024' },
  { name: 'MERN Stack Developer', issuer: 'Saylani Mass IT Training (SMIT)', year: '2025' },
];

export interface Education {
  degree: string;
  university: string;
  graduated: string;
}

export const education: Education[] = [
  { degree: 'B.BIT (Bachelor of Business & Information Technology)', university: 'Virtual University', graduated: '2024' },
];

export interface ProfileLink {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  links: ProfileLink[];
  resumeUrl: string;
  openTo: string[];
}

export const profile: Profile = {
  name: 'Madiha Ayaz',
  role: 'Frontend Developer',
  tagline: 'Frontend Developer · AI Enthusiast · 3D Builder',
  bio: 'Professional frontend web developer building lightning-fast, flawless and intelligent web applications. Specializes in Next.js, React, TypeScript, Tailwind CSS and integrating smart solutions like AI chatbots and Firebase authentication. Certified by PIAIC, GIAIC and SMIT.',
  location: 'Pakistan',
  email: 'madiha.ayaz@example.com',
  links: [
    { label: 'GitHub', url: 'https://github.com/Madiha-Ayaz' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/madiha-ayaz-ba68512b5/' },
  ],
  resumeUrl: '/Madiha_Ayaz_CV.pdf',
  openTo: [
    'Frontend Developer roles',
    'React / Next.js positions',
    'AI-assisted web application projects',
    'Freelance & remote opportunities',
  ],
};

/** Plain-text rendering of the profile — used by AI prompts. */
export function profileToText(): string {
  const skillLines = skills.map((s) => `- ${s.name} (${s.level}/100, ${s.category})`).join('\n');
  const certLines = certifications.map((c) => `- ${c.name} — ${c.issuer} (${c.year})`).join('\n');
  const projectLines = projects
    .map((p) => `- ${p.title}: ${p.description} [tags: ${p.tags.join(', ')}]`)
    .join('\n');
  return [
    `NAME: ${profile.name}`,
    `ROLE: ${profile.role}`,
    `TAGLINE: ${profile.tagline}`,
    `BIO: ${profile.bio}`,
    `LOCATION: ${profile.location}`,
    `OPEN TO: ${profile.openTo.join('; ')}`,
    '',
    'SKILLS:',
    skillLines,
    '',
    'CERTIFICATIONS:',
    certLines,
    '',
    'EDUCATION:',
    `- ${education[0]?.degree} — ${education[0]?.university} (${education[0]?.graduated})`,
    '',
    'SELECTED PROJECTS:',
    projectLines,
  ].join('\n');
}