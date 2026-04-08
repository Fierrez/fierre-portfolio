// import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ArrowRight, GithubLogo } from '@phosphor-icons/react';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      className="relative rounded-lg overflow-hidden shadow-lg group"
      style={{ transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#090909] to-[#252525] rounded-lg" />
      <motion.div
        className="relative bg-gradient-to-tr from-[#1a1a1a]/80 to-[#2a2a2a]/80 backdrop-blur-sm rounded-lg overflow-hidden h-full"
        whileHover={{
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
          borderColor: 'rgba(0, 255, 255, 0.5)',
        }}
        style={{ borderWidth: '1px', borderColor: 'transparent' }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={project.imageUrl}
            alt={project.title}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-full flex items-center transition-colors shadow-lg"
              >
                <ArrowRight size={20} className="mr-2" />
                Live Demo
              </a>
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full flex items-center transition-colors shadow-lg"
              >
                <GithubLogo size={20} className="mr-2" />
                Source
              </a>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-gray-300 mb-4 text-sm leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {(project.tags || []).map((tag) => (
              <span key={tag} className="bg-cyan-900/50 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full border border-cyan-700/50">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    liveUrl: PropTypes.string.isRequired,
    sourceUrl: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ProjectCard;
