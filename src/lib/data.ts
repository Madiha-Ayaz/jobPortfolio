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
    {
      id: 9,
      title: 'AI Problem Solver',
      description: 'An AI-powered platform that takes a problem and walks it to a working solution — combining reasoning, code generation, and live execution into one automated flow.',
      imageUrl: '/7407ba0b0453e13df2c6b7bce1f34525.jpg',
      tags: ['AI', 'Automation', 'Problem Solving', 'LLM'],
      liveUrl: 'http://44.217.190.143/',
      repoUrl: 'https://github.com/Madiha-Ayaz/ai_problem_solver.git',
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
      category: string;
      imageUrl: string;
  }
  
  export const blogPosts: BlogPost[] = [
    {
        id: 1,
        slug: 'my-journey-from-curiosity-to-code',
        title: 'The Road Less Traveled: My Journey from Curiosity to Code',
        category: 'Learning & Career',
        excerpt: 'A personal story of late-night coding sessions, tireless efforts, and the passion that drives me to build fast, flawless, and intelligent web applications.',
        content: `
<p>Every developer has a story of how they started. Mine isn't one of overnight success, but of gradual, persistent effortâ€”a journey fueled by a simple question: "How does this work?" My name is Madiha Ayaz, and this is the story of how my curiosity transformed into a career dedicated to building the future of the web.</p>
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
<p>This philosophy is the "why" behind every technical choice I make. Itâ€™s a promise to my clients and their users. My story is a testament to the power of passion and perseverance. Itâ€™s a reminder that with enough dedication, curiosity can indeed be transformed into expertise.</p>
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
        category: 'Projects & Case Studies',
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
<p>This project was a fantastic learning experience that allowed me to apply my skills in a real-world context. The final result is a portfolio that is not only a showcase of my projects but also a project in itselfâ€”a testament to my philosophy of building fast, flawless, and intelligent web applications.</p>
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
        category: 'Web Development',
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
    },
    {
        id: 4,
        slug: 'understanding-rag-retrieval-augmented-generation',
        title: 'Understanding RAG: How Retrieval-Augmented Generation Powers Smarter AI',
        category: 'AI & Artificial Intelligence',
        excerpt: 'What is RAG, why does it make AI replies more accurate and grounded, and how can you connect a vector database to your chatbot without hallucination?',
        content: `
<p>Large language models are brilliant, but they have a dirty secret: they don't actually <em>know</em> your data. Ask them about your product, your latest project, or yesterday's changelog, and they will confidently invent an answer. Retrieval-Augmented Generation (RAG) fixes exactly that.</p>
<h3 class="text-xl font-bold mt-6 mb-3">What Is RAG?</h3>
<p>RAG is a pattern that pairs a language model with a retriever. Instead of answering from memory alone, the system first searches a knowledge base â€” documents, code, FAQs â€” for the most relevant chunks, and then feeds those chunks to the model as context. The result: answers that are grounded in real, up-to-date information.</p>
<ol class="list-decimal list-inside space-y-2">
    <li><strong>Index:</strong> Split your documents into chunks and embed them with a model like "text-embedding-3-small".</li>
    <li><strong>Store:</strong> Save the vectors in a database such as Pinecone, Weaviate, pgvector, or even Chroma.</li>
    <li><strong>Retrieve:</strong> Convert the user's question into a vector and fetch the nearest neighbors.</li>
    <li><strong>Generate:</strong> Stuff the retrieved chunks into the prompt and let the model answer using only that context.</li>
</ol>
<h3 class="text-xl font-bold mt-6 mb-3">Why RAG Beats Fine-Tuning for Most Projects</h3>
<p>Fine-tuning teaches a model a style or a narrow behavior â€” but it still can't recall fresh data, and it is expensive to run repeatedly. RAG updates your answer quality by simply adding new documents to the index. No retraining. No GPU farms. This is why the SmartBank agentic platform uses a RAG knowledge base for document verification: compliance facts change, and the index changes with them.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The Minimal Recipe</h3>
<pre><code class="language-typescript">// pseudocode â€” retrieval step
const queryVec = await embed(question);
const docs = await vectorDb.query(queryVec, { topK: 4 });
const prompt = buildPrompt(question, docs);
const answer = await llm.complete(prompt);
</code></pre>
<p>RAG turned my AI chatbots from "confidently wrong" into "usefully accurate". If you are shipping any generative feature, start here.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-12-02',
        tags: ['AI', 'RAG', 'Python', 'Machine Learning', 'Tutorial'],
        imageUrl: '/images (1).jpeg',
    },
    {
        id: 5,
        slug: 'building-immersive-3d-landing-pages-review',
        title: 'Building Immersive 3D Landing Pages with React Three Fiber',
        category: 'UI/UX & 3D Web Design',
        excerpt: 'A hands-on guide to adding GPU-rendered 3D scenes to your marketing pages: lighting, post-processing, performance budgets and graceful fallbacks.',
        content: `
<p>A landing page that rotates a glowing globe as you scroll is no longer a wow-factor extra â€” it is a craft. This article walks through the choices that made 3D a joy instead of a janky mess.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Choose the Right Abstraction</h3>
<p>Raw <strong>Three.js</strong> gives total control, but writing scene graphs by hand is slow. <strong>React Three Fiber</strong> (R3F) gives you a declarative React component tree over that same Three.js engine: <code>&lt;mesh&gt;</code>, <code>&lt;ambientLight&gt;</code>, <code>&lt;OrbitControls&gt;</code>. The mental model stays "props", not "imperative update loops".</p>
<h3 class="text-xl font-bold mt-6 mb-3">Lighting Is 80% of the Mood</h3>
<p>A flat default-lit sphere is boring. Use an <code>Environment</code> preset from <code>@react-three/drei</code>, add a rim light for a teal-violet separation on the silhouette, and let a faint point light grade the scene. My palette for this portfolio â€” <em>teal, violet, fuchsia on deep blue-black</em> â€” works because the fill light is cool and the key light is warm.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Performance Is a Feature</h3>
<ol class="list-decimal list-inside space-y-2">
    <li><strong>Lazy-mount</strong> heavy canvases; don't pay for them on first paint.</li>
    <li><strong>Post-processing sparingly:</strong> bloom is expensive; use it on a separate pass.</li>
    <li><strong>Frame loop control:</strong> pause the renderer when the scene is off-screen.</li>
    <li><strong>DevicePixelRatio cap:</strong> <code>dpr={[1, 1.5]}</code> keeps phones smooth.</li>
</ol>
<h3 class="text-xl font-bold mt-6 mb-3">Always Offer a Fallback</h3>
<p>Respect <code>prefers-reduced-motion</code>, detect tablet GPUs, and swap in a CSS animated placeholder when WebGL is unavailable. The elegant fallback is the sign of a professional, not the 3D itself.</p>
<p>The result is a section users remember â€” delivered in a bundle they don't notice.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-12-05',
        tags: ['3D', 'Three.js', 'React', 'Web Development'],
        imageUrl: '/maxresdefault.jpg',
    },
    {
        id: 6,
        slug: 'case-study-smartbank-agentic-ai-banking',
        category: 'Projects & Case Studies',
        title: 'Case Study: SmartBank â€” Architecting an Agentic AI Banking Platform',
        excerpt: 'How a React/Vite UI, agentic AI workflows, document verification and a RAG knowledge base came together into a full-stack banking showcase.',
        content: `
<p>SmartBank started as a question: what does a bank feel like when every screen is powered by an agent that can think? This case study is the behind-the-scenes of that answer.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The Blueprint</h3>
<ul class="list-disc list-inside space-y-2">
    <li><strong>Frontend:</strong> React + Vite, TypeScript, Tailwind â€” a sleek component system with data-visualisation dashboards.</li>
    <li><strong>Agentic AI:</strong> a multi-step workflow that can reason over a goal (e.g. "approve this loan") rather than a single fixed prompt.</li>
    <li><strong>Document verification:</strong> uploaded IDs are run through vision + RAG checks before being accepted.</li>
    <li><strong>RAG knowledge base:</strong> regulation and policy documents live in an index; the agent retrieves and cites, never guesses.</li>
    <li><strong>Secure APIs:</strong> backend endpoints are caller-scoped, with server-side session validation for every mutation.</li>
</ol>
<h3 class="text-xl font-bold mt-6 mb-3">What "Agentic" Actually Changed</h3>
<p>A traditional chatbot answers a question; an agent completes a task. The difference is tool-calling: the model decides when to query the ledger API, when to search policy, and when to ask the user for clarification â€” with guardrails that prevent risky actions. It is the same pattern powering the hackathon monitor bot: react, verify, then act.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Lessons Learned</h3>
<p>Put verifiability first. Every AI-generated action logs its reasoning trail and its sources. Users don't need to trust a black box; they need to audit one. That habit â€” <em>record, then persuade</em> â€” is available to any full-stack project you build today.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-12-09',
        tags: ['Case Study', 'AI Agents', 'React', 'RAG', 'TypeScript'],
        imageUrl: '/smartbank-screenshot.png',
    },
    {
        id: 7,
        slug: 'habits-of-effective-junior-developers',
        title: '7 Habits of Highly Effective Junior Developers',
        category: 'Learning & Career',
        excerpt: 'You don\x27t need 10 years of experience to ship like a senior. Learn the daily habits that separate fast learners from the stalled.',
        content: `
<p>Everyone talks about "learning to code", but the developers who flourish share a quieter pattern: great daily habits. Here are the seven I wish someone had handed me on day one.</p>
<h3 class="text-xl font-bold mt-6 mb-3">1. Read the error â€” then read it again</h3>
<p>Most bugs are solved by taking the red text at face value. Copy the full stack trace before you Google it. Nine times out of ten the answer is in the last line.</p>
<h3 class="text-xl font-bold mt-6 mb-3">2. Ship something every week</h3>
<p>Side-projects compound. Even a tiny deployed thing â€” a calculator, a form, a glow effect â€” teaches deployment, debugging and design constraints no tutorial does.</p>
<h3 class="text-xl font-bold mt-6 mb-3">3. Write it for tomorrow's reader</h3>
<p>Comment the <em>why</em>, not the <em>what</em>. Five minutes of naming well saves people (including future you) five hours.</p>
<h3 class="text-xl font-bold mt-6 mb-3">4. Learn to read other people's code</h3>
<p>Open-source and senior PRs are free universities. Before writing a line, search how the framework you use solves the same problem internally.</p>
<h3 class="text-xl font-bold mt-6 mb-3">5. Ask, but bring evidence</h3>
<p>"I tried X and Y, this is the trace, where would you look next?" is a question that gets answered. "Help, it doesn't work" gets ignored.</p>
<h3 class="text-xl font-bold mt-6 mb-3">6. Care about the pixels and the milliseconds</h3>
<p>The difference between "it works" and "it feels professional" is attention â€” spacing, motion easing, empty states. Every polished detail is a signal.</p>
<h3 class="text-xl font-bold mt-6 mb-3">7. Protect the curiosity</h3>
<p>The best developers aren't the ones who memorised the most APIs. They are the ones who never stopped asking "how does this actually work?" â€” the same question that started this whole journey.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-12-14',
        tags: ['Career', 'Motivation', 'Web Development'],
        imageUrl: '/arab-woman-abaya-hijab-girl-muslim-working-laptop-office-education-online-entrepreneur-freelancer_1030874-9889.avif',
    },
    {
        id: 8,
        slug: 'tool-calling-ai-agents-openrouter',
        title: 'Practical Guide: Tool-Calling AI Agents with OpenRouter',
        category: 'AI Agents & Automation',
        excerpt: 'From function schema to autonomous loop â€” a step-by-step recipe for agents that can search, call APIs and act, using a single OpenRouter key.',
        content: `
<p>An AI agent is a language model given hands: functions it can choose to call. This guide builds a conversation loop where the model decides whether to answer directly or to fetch real-world data via tools â€” using one OpenRouter key for everything.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The Core Loop</h3>
<pre><code class="language-typescript">while (true) {
  const res = await client.chat.completions.create({ model, messages, tools });
  if (res.tool_calls) { runTools(res.tool_calls, toolRegistry); continue; }
  return res.message.content;
}
</code></pre>
<p>Notice the loop: every time the model asks for a tool, you actually run it and append the result as a new user message. The conversation grows until the model is satisfied. That is the whole trick.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Describing Tools So the Model Understands Them</h3>
<p>A tool schema is just a JSON schema with a description. Be explicit about when to use it and what the fields mean:</p>
<pre><code class="language-json">{
  "type": "function",
  "function": {
    "name": "search_web",
    "description": "Search the web for recent information.",
    "parameters": {
      "type": "object",
      "properties": { "q": { "type": "string" } },
      "required": ["q"]
    }
  }
}
</code></pre>
<h3 class="text-xl font-bold mt-6 mb-3">OpenRouter as a Single Gateway</h3>
<p>OpenRouter exposes dozens of models behind one OpenAI-compatible API with one key. Your tool-calling loop is transport-agnostic: you can swap <code>gpt-4o</code>, <code>claude-sonnet</code> or an open model without touching the loop â€” and the server-side proxy keeps the key out of the browser.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Guardrails Worth Adding</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Cap the number of tool iterations (max 8) to stop runaway loops.</li>
    <li>Validate tool inputs, never trust the model's JSON blindly.</li>
    <li>Rate-limit per user and log every tool call for auditability.</li>
</ul>
<p>The agentic future isn't a bigger model; it's a model with good hands and a clear job to do.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-12-18',
        tags: ['AI', 'AI Agents', 'OpenRouter', 'Node.js', 'Tutorial'],
        imageUrl: '/7407ba0b0453e13df2c6b7bce1f34525.jpg',
    },
    {
        id: 9,
        slug: 'websockets-vs-server-sent-events',
        category: 'Web Development',
        title: 'WebSockets vs Server-Sent Events: Choosing the Right Realtime API',
        excerpt: 'Both push data to the browser, but they are not the same tool. A practical comparison of latency, direction, reconnection and when each one wins.',
        content: `
<p>When your app needs to feel alive â€” a chat panel, a live ticker, a deploy progress bar â€” the browser gives you two built-in options: WebSockets and Server-Sent Events (SSE). They look similar at a glance, yet they solve different problems. Here is how to choose.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The One-Line Difference</h3>
<p><strong>WebSockets</strong> are a full-duplex channel: the client and the server can both send messages any time. <strong>SSE</strong> is strictly one-way â€” the server pushes, the client listens. If your UI only ever <em>receives</em> updates, SSE is usually the simpler, more robust choice.</p>
<h3 class="text-xl font-bold mt-6 mb-3">When WebSockets Win</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Chat, multiplayer cursors and collaborative editors â€” places where the user <em>produces</em> events too.</li>
    <li>Low-latency games or live dashboards with constant bidirectional traffic.</li>
    <li>When one persistent connection must carry messages in both directions.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">When SSE Wins</h3>
<ol class="list-decimal list-inside space-y-2">
    <li><strong>Push-only feeds:</strong> notifications, build status, stock prices, "live" activity badges.</li>
    <li><strong>Simplicity:</strong> SSE rides on plain HTTP with standard retry headers â€” no protocol handshake dance.</li>
    <li><strong>Firewalls:</strong> any proxy that handles HTTP handles SSE; WebSockets often need extra configuration.</li>
</ol>
<h3 class="text-xl font-bold mt-6 mb-3">The Shape of the Data</h3>
<pre><code class="language-http">// SSE â€” plain HTTP, one event per lines
data: {"status": "deploy_finished"}

// WebSocket â€” after the upgrade, any message any time
ws://api.example.com/events
</code></pre>
<h3 class="text-xl font-bold mt-6 mb-3">Automatic Reconnection Is the Hidden Gem</h3>
<p>The browser reconnects SSE streams on its own and can resume from the last event via the <code>Last-Event-ID</code> header. WebSockets need manual reconnection logic, heartbeats and exponential backoff. For a status feed or a "live" badge, that free resilience is hard to beat.</p>
<p>Rule of thumb: if the server is the only talker, start with SSE. Reach for WebSockets the moment the client needs to interrupt and steer the stream.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-12-21',
        tags: ['Tutorial', 'WebSockets', 'Realtime', 'Node.js'],
        imageUrl: '/unnamed.jpg',
    },
    {
        id: 10,
        slug: 'building-cloud-run-free-tier-web-services',
        category: 'Web Development',
        title: 'Deploying Free, Always-On Web Services on Cloud Run',
        excerpt: 'Spin up production-grade APIs and jobs that never go to sleep â€” using the Cloud Run free tier, containerized cleanly and secured by default.',
        content: `
<p>Free tiers usually mean "it sleeps when nobody looks". Cloud Run's free tier is different: your service stays warm enough that cold starts are rare, and you only pay when you exceed a monthly allotment of requests and CPU time.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Why Cloud Run for Side Projects</h3>
<ul class="list-disc list-inside space-y-2">
    <li><strong>Auto-scaling:</strong> zero to many instances in seconds, no cluster to babysit.</li>
    <li><strong>Custom domains + HTTPS</strong> for free, with managed certificates.</li>
    <li><strong>Containers:</strong> ship whatever runs in a container â€” Node, Python, Go.</li>
    <li><strong>Observability baked in:</strong> structured logs and traces come free.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">The Minimal Dockerfile</h3>
<pre><code class="language-dockerfile">FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
</code></pre>
<h3 class="text-xl font-bold mt-6 mb-3">Staying Inside the Free Tier</h3>
<ol class="list-decimal list-inside space-y-2">
    <li>Set <code>min-instances 0</code> so it scales to zero when idle.</li>
    <li>Keep image size small â€” Alpine + a single runtime keeps CPU time low.</li>
    <li>Use <code>CPU only allocated during request processing</code> unless you truly need background work.</li>
</ol>
<p>Your backend can be live, professional and effectively free â€” the exact bargain every portfolio project wants.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-12-24',
        tags: ['Deployment', 'Cloud', 'Node.js', 'DevOps'],
        imageUrl: '/Capture.PNG',
    },
    {
        id: 11,
        slug: 'designing-functional-dashboards-that-feel-alive',
        category: 'UI/UX & 3D Web Design',
        title: 'Designing Dashboards That Feel Alive, Not Just Filled',
        excerpt: 'Data viz is 10% charts and 90% attention. A practical guide to sparklines, micro-interactions and empty states that keep users engaged.',
        content: `
<p>Most dashboards are charts waiting for someone to care. The ones people actually open every day share a secret: they reward attention with motion and context. Here is how to build that feeling.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Lead With the Story, Not the Chart</h3>
<p>Put the single number that matters at the top. A big, animated count-up beats a grid of tiny charts every time. Spark a comparison line underneath â€” "up 12% this week" â€” so the number has a personality.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Motion Is Feedback, Not Decoration</h3>
<ol class="list-decimal list-inside space-y-2">
    <li>Animate chart entrance so users learn the layout once.</li>
    <li>Let bars grow, points pulse and lines draw themselves on data change.</li>
    <li>Respect <code>prefers-reduced-motion</code> â€” a professional dashboard does both.</li>
</ol>
<h3 class="text-xl font-bold mt-6 mb-3">Empty States Are Part of the Design</h3>
<p>A blank chart with no message is a dead end. Add a friendly illustration, a call-to-action and a "refresh" affordance. First-run experience decides whether someone comes back.</p>
<p>The best dashboards feel like a cockpit: calm when calm, alive when it should be â€” and always telling you what matters next.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-12-27',
        tags: ['UI', 'Data Visualization', 'Design', 'React'],
        imageUrl: '/saman.PNG',
    },
    {
        id: 12,
        slug: 'rag-vector-chunks-without-heavy-gpus',
        category: 'AI & Artificial Intelligence',
        title: 'RAG Chunking That Actually Works â€” Without a Heavy GPU',
        excerpt: 'Most RAG failures come from bad chunking, not bad models. A hands-on recipe for embeddings and vector search that runs on modest hardware.',
        content: `
<p>People blame the model when RAG gives weird answers. Nine times out of ten the culprit is chunking: text split at the wrong boundaries so the retriever pulls fragments that lack context.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Chunk Consider the Meaning, Not the Characters</h3>
<p>Splitting by a fixed character count tears sentences and code blocks in half. Instead, split on paragraph and heading boundaries first, then merge into semantic units of roughly a few hundred tokens with a small overlap.</p>
<pre><code class="language-python">from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=600, chunk_overlap=80,
    separators=["\n## ", "\n### ", "\n\n", "\n", ". ", " "],
)
chunks = splitter.split_text(document)
</code></pre>
<h3 class="text-xl font-bold mt-6 mb-3">Embeddings on Modest Hardware</h3>
<p>You don't need a GPU. Small, local embeddings such as <code>all-MiniLM-L6-v2</code> give solid recall and run fine on CPU. For larger corpora, a lightweight vector store like Chroma or pgvector keeps queries snappy without extra infrastructure.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The One-Metric Test</h3>
<p>Before praising your pipeline, run a single question against every chunk and measure whether the right context appears in the top-4. If not, tighten the separator list or shrink the chunk size. That feedback loop is the entire craft of RAG.</p>
`,
        author: 'Madiha Ayaz',
        date: '2025-12-30',
        tags: ['RAG', 'AI', 'Python', 'Machine Learning'],
        imageUrl: '/BMI+levels-640w.webp',
    },
    {
        id: 13,
        slug: 'modern-state-management-react-hooks',
        category: 'Web Development',
        title: 'Modern State Management in React: Hooks, Stores and When to Reach for Each',
        excerpt: 'Redux, React Query, useContext or just useState? A clear decision tree for choosing state architecture that stays simple as your app grows.',
        content: `
<p>Every React app eventually hits the same question: where does this data live? The ecosystem offers dozens of answers, but most projects only need two or three of them. This guide cuts through the options and gives you a decision tree that actually holds up.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Start Local, Stay Local</h3>
<p>Begin with <code>useState</code> and <code>useReducer</code>. A form field, an open dialog, a filter toggle â€” these are component concerns. Lifting them into a global store before you need to is the fastest way to add bugs for free.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Server Data Does Not Belong in a Store</h3>
<p>Remote data â€” users, posts, API responses â€” has a different lifecycle: loading, error, stale-while-revalidate, cached. Libraries like React Query or SWR model exactly that. Storing fetched data in a global store means re-implementing caching, retries and invalidation by hand, poorly.</p>
<pre><code class="language-typescript">// React Query owns the server-data lifecycle
const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: () => api.get('/posts'),
});
</code></pre>
<h3 class="text-xl font-bold mt-6 mb-3">When Context Is Enough</h3>
<p><code>useContext</code> is perfect for <em>app config</em>: theme, language, current user session â€” pieces that rarely change and are read everywhere. It is not a reactive store for hot, frequently-updating state; every consumer re-renders on any change.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Reach for a Real Store for Cross-Cutting Live State</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Shared websocket traffic that many components mutate (a live feed, a chat).</li>
    <li>Undo/redo history that must span screens.</li>
    <li>Derived selections that were painful to express with plain useState.</li>
</ul>
<p>Zustand or Redux Toolkit are solid picks here â€” but make them the <em>exception</em>, not the default.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The One-Question Test</h3>
<p>Ask: "Would this state survive if this component unmounted?" If the answer is no, keep it local. If it must survive â€” it is application state, not component state. Two buckets, two tools, zero ceremony.</p>
`,
        author: 'Madiha Ayaz',
        date: '2026-01-03',
        tags: ['React', 'State Management', 'Tutorial', 'TypeScript'],
        imageUrl: '/imag.PNG',
    },
{
        id: 14,
        slug: 'what-are-ai-agents-beginners-guide',
        title: 'What Are AI Agents? A Beginner-Friendly Guide',
        excerpt: 'Forget one-shot chatbots. AI agents can search, call APIs, write files and take action. A plain-English introduction to how they work.',
        content: `
<p>An <strong>AI agent</strong> is a language model (called the "brain") wrapped in a loop that can use <em>tools</em>. Instead of answering a single question and stopping, an agent can decide: "I need to search the web", "I should fetch that record", "I need to ask the user something". Then it takes those actions and keeps going until the job is done.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The Three Ingredients</h3>
<ul class="list-disc list-inside space-y-2">
    <li><strong>Model:</strong> the reasoning engine that understands the goal and your request.</li>
    <li><strong>Tools:</strong> functions the model may call - search, database queries, notifications, calculators.</li>
    <li><strong>Loop:</strong> "think, call a tool, read the result, think again" until it has enough to answer.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">A Simple Analogy</h3>
<p>A chatbot is a librarian who answers from memory. An agent is a librarian with a phone, a search card and permission to run to other libraries, verify a fact and bring back a checked, cited answer. The difference is not intelligence - it is <em>agency</em>.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Where Agents Shine</h3>
<ol class="list-decimal list-inside space-y-2">
    <li>Support bots that look up order status and refund policies.</li>
    <li>Automations that draft, verify and send messages.</li>
    <li>Research assistants that search and summarize across many sources.</li>
</ol>
<h3 class="text-xl font-bold mt-6 mb-3">Key Takeaways</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Agents = model + tools + a reasoning loop.</li>
    <li>Tools are declared as JSON schemas; the model calls them by name.</li>
    <li>Guardrails (max iterations, input validation, audit logs) keep agents safe.</li>
</ul>
<p>Start small: give a model one tool, add a loop, and watch a chatbot become an assistant that does things.</p>
`,
        author: 'Madiha Ayaz',
        date: '2026-01-29',
        category: 'AI Agents & Automation',
        tags: ['AI', 'AI Agents', 'Beginner', 'Automation'],
        imageUrl: '/id card.jpg',
    },
    {
        id: 15,
        slug: 'ai-agents-vs-traditional-chatbots',
        title: 'AI Agents vs Traditional Chatbots',
        excerpt: 'When is a plain chatbot enough, and when do you need an agentic system? A practical comparison of capability, cost and complexity.',
        content: `
<p>Every week brings a product claiming to be "agentic AI". But most of what is called a chatbot is really a <em>retriever</em>: it reads context and answers. Here is a clear-eyed comparison.</p>
<h3 class="text-xl font-bold mt-6 mb-3">What a Traditional Chatbot Does</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Answers from a prompt plus retrieved documents (RAG).</li>
    <li>Never changes anything - it informs, it does not act.</li>
    <li>Simple to build, cheap to run, easy to debug.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">What an AI Agent Adds</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Tool calling: search, APIs, databases, notifications.</li>
    <li>Multi-step reasoning with a visible plan and audit trail.</li>
    <li>The ability to complete a goal, not just answer a question.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">Decision Guide</h3>
<table class="table-auto w-full text-sm my-4"><thead><tr><th class="px-3 py-2 text-left">Use a chatbot when</th><th class="px-3 py-2 text-left">Use an agent when</th></tr></thead><tbody><tr><td class="px-3 py-2">Answers only from docs</td><td class="px-3 py-2">Live data is involved</td></tr><tr><td class="px-3 py-2">No side effects allowed</td><td class="px-3 py-2">A task must be completed</td></tr><tr><td class="px-3 py-2">Budget and latency matter most</td><td class="px-3 py-2">The workflow is multi-step</td></tr></tbody></table>
<h3 class="text-xl font-bold mt-6 mb-3">The Honest Conclusion</h3>
<p>Agents are strictly more powerful but strictly harder to secure, test and cost. My rule: start with RAG; add tools only when the product genuinely needs action. Many "agent" demos are really good retrieval with extra hype.</p>
`,
        author: 'Madiha Ayaz',
        date: '2026-02-02',
        category: 'AI Agents & Automation',
        tags: ['AI', 'AI Agents', 'Chatbot', 'Decision Making'],
        imageUrl: '/unnamed.jpg',
    },
    {
        id: 16,
        slug: 'how-ai-is-changing-web-development',
        title: 'How AI Is Changing Web Development',
        excerpt: 'From AI-assisted code to intelligent interfaces, the craft is shifting from writing code to designing systems and curating quality.',
        content: `
<p>AI did not replace developers - it changed the shape of the job. The developer of tomorrow spends less time typing boilerplate and more time on architecture, prompt design, evaluation and user experience.</p>
<h3 class="text-xl font-bold mt-6 mb-3">How AI Already Affects the Stack</h3>
<ul class="list-disc list-inside space-y-2">
    <li><strong>Coding assistance:</strong> autocomplete and pair-programming copilots speed up routine code.</li>
    <li><strong>Code review:</strong> AI flags bugs, security gaps and style drift in minutes.</li>
    <li><strong>UI generation:</strong> models draft components and layouts you then refine.</li>
    <li><strong>Personalization:</strong> server-side models tailor content per user in real time.</li>
    <li><strong>Conversational UIs:</strong> chat and voice become first-class interfaces.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">What Changes for Developers</h3>
<ol class="list-decimal list-inside space-y-2">
    <li>Prompting and evaluation become core skills - you are grading outputs, not just writing code.</li>
    <li>Security matters more: AI introduces new attack surfaces (prompt injection, data leaks).</li>
    <li>Shipping gets faster, so judgment and taste decide who wins.</li>
</ol>
<h3 class="text-xl font-bold mt-6 mb-3">What Stays the Same</h3>
<p>Browsers, accessibility, performance budgets, APIs and clean architecture still matter - probably more. AI amplifies whatever foundation you build on. A messy codebase with AI produces messy features twice as fast.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Key Takeaways</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Treat AI like a fast intern: supervise everything it touches.</li>
    <li>Invest in fundamentals; AI compounds their value.</li>
    <li>Learn evaluation and prompt hygiene early - they are the new DevOps.</li>
</ul>
`,
        author: 'Madiha Ayaz',
        date: '2026-02-05',
        category: 'AI & Artificial Intelligence',
        tags: ['AI', 'Web Development', 'Career', 'Future'],
        imageUrl: '/antigravity-hackathon.jpg',
    },
    {
        id: 17,
        slug: 'how-to-build-an-ai-powered-web-application',
        title: 'How to Build an AI-Powered Web Application',
        excerpt: 'A complete practical blueprint: picking the model, keeping keys server-side, streaming responses and grounding answers with RAG.',
        content: `
<p>Building an AI feature does not mean bolting a chat window onto a CRUD app. This is the architecture I use when a product needs genuine AI power.</p>
<h3 class="text-xl font-bold mt-6 mb-3">1. Pick the Model Access Pattern</h3>
<p>Use an OpenAI-compatible gateway (OpenRouter works well) behind a small server proxy. Never ship keys to the client:</p>
<pre><code class="language-typescript">// server route - keep the key out of the browser
app.post('/api/ai/complete', async (req, res) => {
  const reply = await llmComplete(req.body.messages);
  res.json({ content: reply });
});
</code></pre>
<h3 class="text-xl font-bold mt-6 mb-3">2. Ground It With RAG</h3>
<p>Good answers need context. Chunk your docs, embed them, store the vectors, retrieve the top-k and stuff those chunks into the prompt. This is how chatbots stop hallucinating your own product facts.</p>
<h3 class="text-xl font-bold mt-6 mb-3">3. Stream for Feel</h3>
<p>Users tolerate seconds, not minutes. Stream tokens over Server-Sent Events so the interface feels responsive even when the model is slow.</p>
<h3 class="text-xl font-bold mt-6 mb-3">4. Add Guardrails</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Cap context size and token budget.</li>
    <li>Rate-limit per user and log every request.</li>
    <li>Validate model output before it reaches the UI (type-check JSON).</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">Key Takeaways</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Proxy the model server-side; never expose keys.</li>
    <li>RAG beats fine-tuning for most product data.</li>
    <li>Streaming and evaluation separate "demo" from "product".</li>
</ul>
`,
        author: 'Madiha Ayaz',
        date: '2026-02-08',
        category: 'Web Development',
        tags: ['AI', 'Web Development', 'RAG', 'Architecture'],
        imageUrl: '/pp attendence.png',
    },
    {
        id: 18,
        slug: 'challenges-building-a-full-stack-application',
        title: 'Challenges I Faced While Building a Full-Stack Application',
        excerpt: 'Real war stories from the trenches: auth headaches, CORS, state sprawl and deployment shocks - and how I solved each one.',
        content: `
<p>Every full-stack project looks simple in a tutorial and falls apart in production. These are the challenges that actually taught me to build.</p>
<h3 class="text-xl font-bold mt-6 mb-3">1. Authentication Is Harder Than It Looks</h3>
<p>I started treating login as a form. Then came sessions, token expiry, refresh flows and route guards. The fix: use a mature provider (Firebase Auth), keep session state in one context and always validate on the server - never trust the client.</p>
<h3 class="text-xl font-bold mt-6 mb-3">2. CORS, the Silent Killer</h3>
<p>The frontend worked in dev and broke in deployment. Every API server needs an explicit allow-list, not a wildcard, and correctly formatted preflight responses. Debugging a missing Access-Control-Allow-Origin header for an afternoon is a rite of passage.</p>
<h3 class="text-xl font-bold mt-6 mb-3">3. State Management Sprawl</h3>
<p>Props drilling turned ugly fast. I consolidated shared state into context providers (auth, portfolio, notifications) and kept everything else local. Rule: global for identity, local for everything temporary.</p>
<h3 class="text-xl font-bold mt-6 mb-3">4. Deployment Shocks</h3>
<p>Environment variables missing, static assets 404ing on the SPA fallback, Firebase rules refusing writes. The lesson: deploy early, test in production early and treat the build pipeline as part of the product.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Key Takeaways</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Security and correctness live server-side, period.</li>
    <li>Deploy on day one; iterate in a real environment.</li>
    <li>Every painful bug becomes a permanent lesson.</li>
</ul>
`,
        author: 'Madiha Ayaz',
        date: '2026-02-12',
        category: 'Projects & Case Studies',
        tags: ['Full-Stack', 'Firebase', 'Career', 'Debugging'],
        imageUrl: '/Capture.PNG',
    },
    {
        id: 19,
        slug: 'from-idea-to-deployment-my-development-journey',
        title: 'From Idea to Deployment: My Development Journey',
        excerpt: 'A tour of how I take an idea from a napkin sketch to a live product: planning, building, testing and shipping on a reliable loop.',
        content: `
<p>An idea costs nothing; a deployed product costs everything. This is the pipeline I follow to keep momentum from first thought to launch.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Phase 1 - Define, Do Not Design</h3>
<p>I write one sentence that captures the outcome: "A student can generate and download an ID card in under a minute." Scope flows from that sentence; features that do not serve it get cut.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Phase 2 - Choose Boring Technology</h3>
<p>For new builds I choose what I can debug in the dark: React for the UI, a typed backend, Firebase for auth and persistence. Familiarity ships; novelty struggles.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Phase 3 - Build the Ugly Version</h3>
<p>The first version is functional and unpolished. This is where the real requirements appear - the edge cases you could never imagine on a whiteboard.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Phase 4 - Polish What Matters</h3>
<p>Empty states, loading skeletons, error toasts and micro-animations. Details are what turn "works" into "feels professional".</p>
<h3 class="text-xl font-bold mt-6 mb-3">Phase 5 - Ship and Observe</h3>
<p>Deploy, watch logs, listen to feedback, then repeat. The loop - define, build, ship, learn - is the entire craft.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Key Takeaways</h3>
<ul class="list-disc list-inside space-y-2">
    <li>One outcome sentence decides every feature decision.</li>
    <li>Ship the ugly version fast; polish selectively.</li>
    <li>Real learning happens after deployment, not before.</li>
</ul>
`,
        author: 'Madiha Ayaz',
        date: '2026-02-16',
        category: 'Web Development',
        tags: ['Career', 'Web Development', 'Productivity'],
        imageUrl: '/saman.PNG',
    },
    {
        id: 20,
        slug: 'how-automation-saves-time-and-improves-productivity',
        title: 'How Automation Can Save Time and Improve Productivity',
        excerpt: 'Scripts, scheduled jobs and AI agents that pay for themselves tenfold. Practical, time-tested automation patterns for developers.',
        content: `
<p>Every repetitive task is a small leak in your week. Automation plugs those leaks. Here is the pattern I use to decide what to automate - and what actually saved me hours.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The Rule of Threes</h3>
<p>If you have done a task three times, automate it. Write a script, a scheduled job or an AI agent. Three is the magic number: rare enough that hand-typing hurts, common enough that the automation pays for itself.</p>
<h3 class="text-xl font-bold mt-6 mb-3">High-Value Wins</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Cron jobs that run backups, health checks and report emails at 3 a.m.</li>
    <li>Git hooks that lint, format and run tests before every commit.</li>
    <li>Deploy pipelines that build, test and publish in one command.</li>
    <li>AI agents that triage inboxes, summarize meetings and draft replies.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">Automate Inputs, Not Judgment</h3>
<p>Automation is a multiplier, not a replacement. The valuable parts - deciding what matters, approving a risky change - stay human. Let the machine do the predictable lifting.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Key Takeaways</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Automate routines, not one-off tasks.</li>
    <li>Start with the most boring, most frequent task you can find.</li>
    <li>Measure before and after - savings should be visible, not assumed.</li>
</ul>
`,
        author: 'Madiha Ayaz',
        date: '2026-02-20',
        category: 'AI Agents & Automation',
        tags: ['Automation', 'AI Agents', 'Productivity'],
        imageUrl: '/images.jpeg',
    },
    {
        id: 21,
        slug: 'why-good-uiux-matters-in-ai-applications',
        title: 'Why Good UI/UX Matters in AI Applications',
        excerpt: 'Black-box AI needs clarity more than any other product. How thoughtful design builds trust in outputs users cannot verify by hand.',
        content: `
<p>AI products have a trust problem: the user cannot verify the answer. Great design is how you close that gap. Here is why UI/UX is a feature of AI, not a skin on top of it.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Show the Reasoning Trail</h3>
<p>Citations, sources and step-by-step progress bars turn "AI said so" into "the AI said so, based on these three documents". Transparency is the killer UX pattern for generative features.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Manage Uncertainty Explicitly</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Show confidence levels instead of silent guesses.</li>
    <li>Offer retry and "edit the input" as first-class controls.</li>
    <li>Label factual versus creative outputs (facts get sources).</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">Latency Is a Design Problem</h3>
<p>Models are slow. Streaming text, skeleton loaders and "thinking..." indicators make delays feel intentional. A polished waiting state outperforms a fast black box.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The 3D Touch</h3>
<p>Gloss, glass and motion are not decoration - they signal "intelligent, live, premium". Interaction feedback (glare following the pointer, tilt on hover) makes AI feel responsive rather than spooky. Predictable motion builds calm; calm builds trust.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Key Takeaways</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Design honestly: show sources and confidence.</li>
    <li>Turn latency into an elegant waiting state.</li>
    <li>Feedback and motion convert skepticism into trust.</li>
</ul>
`,
        author: 'Madiha Ayaz',
        date: '2026-02-24',
        category: 'UI/UX & 3D Web Design',
        tags: ['UI/UX', 'AI', 'Design', 'Trust'],
        imageUrl: '/smartbank-screenshot.png',
    },
    {
        id: 22,
        slug: 'how-i-approach-learning-new-technologies',
        title: 'How I Approach Learning New Technologies',
        excerpt: 'A practical study system: build tiny projects, read error messages before docs and keep a "ship weekly" bias. What actually works.',
        content: `
<p>Technology changes fast; how you learn it should not. This is the loop I use to pick up Next.js, Three.js, Firebase, RAG and agent frameworks without burning out.</p>
<h3 class="text-xl font-bold mt-6 mb-3">1. Start With a 3-Day Toy</h3>
<p>Books and docs give context; projects give skill. In the first 72 hours I build the smallest possible thing - a counter, a card, a glowing cube - and ship it. The goal is a tiny win, not mastery.</p>
<h3 class="text-xl font-bold mt-6 mb-3">2. Read Errors Before Docs</h3>
<p>The red text is a curriculum. Reproduce the error, read it, fix it, write it down. Debugging beats memorizing every single time.</p>
<h3 class="text-xl font-bold mt-6 mb-3">3. Learn With the Community</h3>
<p>Real lessons live in open source and senior PRs. I search "how does X handle Y" inside the library's own source before reaching for tutorials. Reading well-designed code teaches the conventions books miss.</p>
<h3 class="text-xl font-bold mt-6 mb-3">4. Keep a Written Evidence Log</h3>
<pre><code class="language-markdown">## 2026-01-12 - React Three Fiber
Lesson: dpr={[1, 1.5]} keeps phones smooth.
Proof: before 45fps / after 60fps on a mid phone.
</code></pre>
<p>Notes I can search later turn learning into a compounding asset.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Key Takeaways</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Ship a tiny toy in 72 hours - momentum is the teacher.</li>
    <li>Debug first, document second, tutorials last.</li>
    <li>Record each lesson with proof; searchable notes compound.</li>
</ul>
`,
        author: 'Madiha Ayaz',
        date: '2026-02-27',
        category: 'Learning & Career',
        tags: ['Learning', 'Career', 'Study System'],
        imageUrl: '/7407ba0b0453e13df2c6b7bce1f34525.jpg',
    },
    {
        id: 23,
        slug: 'technology-in-modern-education',
        title: 'Technology in Modern Education',
        excerpt: 'From teacher dashboards to interactive learning, software is reshaping classrooms - and why great tools still need great teaching.',
        content: `
<p>Education is being rebuilt by software, one lesson plan at a time. As an educator-turned-developer, I see technology as a force multiplier for teaching - not a replacement for it.</p>
<h3 class="text-xl font-bold mt-6 mb-3">What Technology Changes in the Classroom</h3>
<ul class="list-disc list-inside space-y-2">
    <li><strong>Personalization:</strong> adaptive platforms adjust difficulty per student in real time.</li>
    <li><strong>Feedback loops:</strong> auto-graded quizzes give instant, kind feedback instead of next-week grades.</li>
    <li><strong>Teacher dashboards:</strong> one screen shows who is stuck, who is bored and who is ready for more.</li>
    <li><strong>Access:</strong> recorded lessons and subtitled content reach learners beyond the room.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">Designing for Learning, Not Screens</h3>
<p>The best education apps are the ones students forget using. Interface, pace and feedback follow pedagogy: keep attention, reduce friction, reward progress. That is why UI/UX thinking belongs at the heart of edtech, not on its edges.</p>
<h3 class="text-xl font-bold mt-6 mb-3">The Human Layer Stays</h3>
<p>Technology scales the mechanics of teaching - grading, tracking, pacing - but the relationship between teacher and learner is what makes learning stick. Build tools that give teachers time, never tools that replace them.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Key Takeaways</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Adaptive pacing and instant feedback are edtech superpowers.</li>
    <li>Teacher dashboards should reduce decisions, not add them.</li>
    <li>Humans teach best; software enables that teaching.</li>
</ul>
`,
        author: 'Madiha Ayaz',
        date: '2026-03-03',
        category: 'Teaching & Technology',
        tags: ['Education', 'Teaching', 'EdTech', 'Technology'],
        imageUrl: '/arab-woman-abaya-hijab-girl-muslim-working-laptop-office-education-online-entrepreneur-freelancer_1030874-9889.avif',
    },
    {
        id: 24,
        slug: 'how-ai-can-help-students-and-teachers',
        title: 'How AI Can Help Students and Teachers',
        excerpt: 'Practical, responsible ways students and teachers can use AI today - drafting, explaining, quizzing and saving hours of routine work.',
        content: `
<p>Used well, AI is the personal tutor and teaching assistant schools never had the budget for. Used badly, it is a shortcut to nowhere. Here is the responsible, practical playbook.</p>
<h3 class="text-xl font-bold mt-6 mb-3">For Students: Learn, Do Not Outsource</h3>
<ul class="list-disc list-inside space-y-2">
    <li><strong>Explain it simply:</strong> paste confusing material and ask "explain this to a 10-year-old".</li>
    <li><strong>Generate practice:</strong> "make me 5 questions about the water cycle" beats re-reading.</li>
    <li><strong>Grade my plan:</strong> ask for feedback on a study plan or a draft answer before submitting.</li>
    <li><strong>Never copy-paste:</strong> always rewrite and verify - the output is a starting point, not an answer key.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">For Teachers: Automate the Routine</h3>
<ul class="list-disc list-inside space-y-2">
    <li>Draft rubrics, lesson plans and differentiated activities in minutes.</li>
    <li>Generate varied quiz questions with difficulty levels.</li>
    <li>Summarize discussions or grade drafts against a rubric.</li>
    <li>Always review AI output for accuracy and tone before it reaches a child.</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3">The Golden Rule</h3>
<p>AI should improve the thinking process, never replace it. A student who verifies, rephrases and questions an AI answer is doing real learning; one who submits it verbatim is not.</p>
<h3 class="text-xl font-bold mt-6 mb-3">Key Takeaways</h3>
<ul class="list-disc list-inside space-y-2">
    <li>AI is a tutor and a teaching assistant - a multiplier, not a cheat.</li>
    <li>Turn outputs into questions and practice, not final answers.</li>
    <li>Review everything: the human stays accountable.</li>
</ul>
`,
        author: 'Madiha Ayaz',
        date: '2026-03-07',
        category: 'Teaching & Technology',
        tags: ['AI', 'Education', 'Teaching', 'Students'],
        imageUrl: '/screen shot.PNG',
    }
  ];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   INSPIRATIONAL QUOTES
   Unique voices from science, software and ideas â€” quote + author
   + profession. Shown on the blog page as a "wisdom" gallery.
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

export interface InspirationalQuote {
  quote: string;
  author: string;
  profession: string;
  image: string;
}

export const inspirationalQuotes: InspirationalQuote[] = [
  { quote: 'The best way to predict the future is to invent it.', author: 'Alan Kay', profession: 'Computer Scientist', image: '/inspirations/alan-kay.jpg' },
  { quote: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci', profession: 'Polymath, Artist & Engineer', image: '/inspirations/leonardo-da-vinci.jpg' },
  { quote: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds', profession: 'Software Engineer, Creator of Linux', image: '/inspirations/linus-torvalds.jpg' },
  { quote: 'Nothing in life is to be feared, it is only to be understood.', author: 'Marie Curie', profession: 'Physicist & Chemist', image: '/inspirations/marie-curie.jpg' },
  { quote: 'The most dangerous phrase in the language is: "We\u2019ve always done it this way."', author: 'Grace Hopper', profession: 'Computer Scientist, Rear Admiral', image: '/inspirations/grace-hopper.jpg' },
  { quote: 'Design is not just what it looks like and feels like. Design is how it works.', author: 'Steve Jobs', profession: 'Co-founder of Apple', image: '/inspirations/steve-jobs.jpg' },
  { quote: 'People recognize the software. I think of those who depend on us; we must never fail them.', author: 'Margaret Hamilton', profession: 'Software Engineer, Apollo Mission', image: '/inspirations/margaret-hamilton.jpg' },
  { quote: 'Make it work, make it right, make it fast.', author: 'Kent Beck', profession: 'Software Engineer, Extreme Programming', image: '/inspirations/kent-beck.jpg' },
  { quote: 'That brain of mine is something more than merely mortal; as time will show.', author: 'Ada Lovelace', profession: 'First Computer Programmer', image: '/inspirations/ada-lovelace.jpg' },
  { quote: 'A ship in port is safe, but that\u2019s not what ships are built for.', author: 'Grace Hopper', profession: 'Computer Scientist, Rear Admiral', image: '/inspirations/grace-hopper.jpg' },
];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PROFILE & AI KNOWLEDGE BASE
   Central, structured profile used by the AI backend (job matching,
   semantic search, agent grounding) and by the frontend.
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

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
  imageUrl?: string;
  status?: string;
}

export const certifications: Certification[] = [
  { name: 'Presidential Initiative for Artificial Intelligence and Computing', issuer: 'PIAIC', year: '2022', status: 'In Progress' },
  { name: 'Governor Initiative for Artificial Intelligence and Computing', issuer: 'GIAIC', year: '2024', status: 'In Progress' },
  { name: 'MERN Stack Developer', issuer: 'Saylani Mass IT Training (SMIT)', year: '2025', imageUrl: '/cer.PNG' },
  { name: 'Google Antigravity Hackathon', issuer: 'Google', year: '2025', imageUrl: '/1782404779823.jfif' },
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
  tagline: 'Frontend Developer Â· AI Enthusiast Â· 3D Builder',
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

/** Plain-text rendering of the profile â€” used by AI prompts. */
export function profileToText(): string {
  const skillLines = skills.map((s) => `- ${s.name} (${s.level}/100, ${s.category})`).join('\n');
  const certLines = certifications.map((c) => `- ${c.name} â€” ${c.issuer} (${c.year})`).join('\n');
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
    `- ${education[0]?.degree} â€” ${education[0]?.university} (${education[0]?.graduated})`,
    '',
    'SELECTED PROJECTS:',
    projectLines,
  ].join('\n');
}