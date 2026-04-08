// import React from 'react';
import ProjectCard from '../components/ProjectCard';
import { motion } from 'framer-motion';

const projectsData = [
  {
    title: 'Persona — Secure Personal Control Center',
    description:
      'Category: Mobile Security Application. A local-first security and productivity platform integrating a password vault, offline 2FA authenticator, encrypted task manager, and secure notes. Designed with a zero-trust architecture ensuring complete data privacy on-device.',
    imageUrl: 'https://image.winudf.com/v2/image1/ZGV2X2ltYWdlXzQwNTMzOTU1XzI2MjEzOV8yMDI2MDMxMjAzNDYxMjA1NA/icon.webp?w=140&fakeurl=1&type=.webp',
    liveUrl: 'https://apkpure.com/persona-security-productivity/com.mk.hiro.persona_app',
    sourceUrl: 'https://github.com/Fierrez/Persona',
    tags: [
      'Mobile Security',
      'Flutter',
      'Dart',
      'AES-256',
      'EncryptedSharedPreferences',
      'iOS Keychain',
    ],
  },
  {
    title: 'Business Intelligence & Analytics System (OJT Project)',
    description:
      'Category: Enterprise Web Application. A data analytics platform that transforms operational and sales data into actionable dashboards and reports for business decision-making.',
    imageUrl: 'https://via.placeholder.com/400x250?text=Business+Intelligence',
    liveUrl: '#',
    sourceUrl: '#',
    tags: ['Next.js', 'TypeScript', 'Spring Boot', 'MariaDB/MySQL', 'REST APIs', 'Analytics'],
  },
  {
    title: 'Supply Chain Management Analytics Module (OJT Project)',
    description:
      'Category: Data Analytics Module. A supply chain analytics component focused on order consolidation, fulfillment tracking, and performance optimization.',
    imageUrl: 'https://via.placeholder.com/400x250?text=Supply+Chain',
    liveUrl: '#',
    sourceUrl: '#',
    tags: ['Next.js', 'REST APIs', 'Data Visualization', 'Logistics', 'Optimization'],
  },
  {
    title: 'PosePal — AI Posture Monitoring & Feedback System (Capstone Project)',
    description:
      'Category: AI System / Full-Stack Application. A posture monitoring system combining AI detection pipelines, desktop admin tools, backend APIs, and a mobile client to analyze posture, provide feedback, and promote healthier habits.',
    imageUrl: 'https://via.placeholder.com/400x250?text=PosePal',
    liveUrl: '#',
    sourceUrl: 'https://github.com/Fierrez/PosePal-Application-Development',
    tags: ['AI', 'Computer Vision', 'Python', 'Flutter', 'Dart', 'Pytest', 'Full-Stack'],
  },
  {
    title: 'AI Chat System — custom-ai-agent',
    description:
            'A production-ready AI chat system built with FastAPI, Next.js, PostgreSQL, and Redis, featuring short-term and long-term memory (STM/LTM), streaming token responses (SSE), embedding-based semantic retrieval, modular AI services, and Dockerized deployment. Runs fully local (self-hosted) with optional Docker containers — no external cloud dependencies required. Designed for scalable, memory-driven chat with JWT auth and production considerations.',
    imageUrl: 'https://via.placeholder.com/400x250?text=AI+Chat+System',
    liveUrl: '#',
    sourceUrl: 'https://github.com/Fierrez/custom-ai-agent',
       tags: ['FastAPI', 'Next.js', 'PostgreSQL', 'Redis', 'SSE', 'Docker', 'Self-Hosted', 'Python', 'TypeScript', 'Embeddings'],
  },
];

const Projects = () => {
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="p-8 text-white h-full overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projectsData.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
      </motion.div>
  );   
};

export default Projects;
      
