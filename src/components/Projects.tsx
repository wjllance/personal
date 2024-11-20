import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectsSection = styled.section`
  min-height: 100vh;
  padding: 100px 20px;
  background: #ffffff;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 20px;
`;

const ProjectCard = styled(motion.div)`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const ProjectDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tech = styled.span`
  background: #e9ecef;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  color: #495057;
`;

const Links = styled.div`
  display: flex;
  gap: 1rem;
`;

const LinkButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #2980b9;
  }
`;

interface Project {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubLink: string;
  liveLink?: string;
}

interface ProjectsProps {
  id?: string;
}

const Projects: React.FC<ProjectsProps> = ({ id }) => {
  const projects: Project[] = [
    {
      title: "Project 1",
      description: "A full-stack web application built with React and Node.js.",
      image: "/project1.jpg",
      techStack: ["React", "Node.js", "MongoDB", "Express"],
      githubLink: "https://github.com/",
      liveLink: "https://project1.com"
    },
    {
      title: "Project 2",
      description: "A machine learning project for image classification.",
      image: "/project2.jpg",
      techStack: ["Python", "TensorFlow", "OpenCV"],
      githubLink: "https://github.com/"
    },
    {
      title: "Project 3",
      description: "A mobile app built with React Native.",
      image: "/project3.jpg",
      techStack: ["React Native", "TypeScript", "Firebase"],
      githubLink: "https://github.com/",
      liveLink: "https://project3.com"
    }
  ];

  return (
    <ProjectsSection id={id}>
      <Container>
        <Title>My Projects</Title>
        <ProjectGrid>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectImage src={project.image} alt={project.title} />
              <ProjectContent>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <TechStack>
                  {project.techStack.map(tech => (
                    <Tech key={tech}>{tech}</Tech>
                  ))}
                </TechStack>
                <Links>
                  <LinkButton href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <FaGithub /> Code
                  </LinkButton>
                  {project.liveLink && (
                    <LinkButton href={project.liveLink} target="_blank" rel="noopener noreferrer">
                      <FaExternalLinkAlt /> Live Demo
                    </LinkButton>
                  )}
                </Links>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Container>
    </ProjectsSection>
  );
};

export default Projects;
