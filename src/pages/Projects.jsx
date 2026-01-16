import { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';

const defaultProjectImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop';

// Fallback projects in case API is unavailable
const fallbackProjects = [
    {
        id: '1',
        title: 'User Management System',
        description: 'A web application for managing user accounts, roles, and permissions. Implemented login, registration, role-based access, and JWT authentication.',
        technologies: ['ASP.NET Core', 'Identity', 'SQL Server', 'Entity Framework Core'],
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
        githubUrl: 'https://github.com/mohamedmahdi/user-management-system'
    },
    {
        id: '2',
        title: 'E-Commerce Backend API',
        description: 'Designed and developed RESTful APIs to manage products, categories, shopping cart, and orders. Implemented filtering, sorting, and pagination.',
        technologies: ['ASP.NET Core Web API', 'SQL Server', 'EF Core', 'Swagger'],
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
        githubUrl: 'https://github.com/mohamedmahdi/ecommerce-api'
    },
    {
        id: '3',
        title: 'Task Management System',
        description: 'A multi-user backend system for task creation, assignment, and tracking. Included role-based access control and email notifications.',
        technologies: ['ASP.NET Core MVC', 'Identity', 'Razor Pages'],
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
        githubUrl: 'https://github.com/mohamedmahdi/task-management'
    },
    {
        id: '4',
        title: 'Blog API with Admin Panel',
        description: 'Created a backend API with an admin panel to manage blog posts and user comments. Admin panel built using Razor Pages and Bootstrap.',
        technologies: ['ASP.NET Core', 'SQL Server', 'Entity Framework Core'],
        imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
        githubUrl: 'https://github.com/mohamedmahdi/blog-api'
    }
];

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            // If API returns projects, use them; otherwise use fallback
            if (response.data && response.data.length > 0) {
                setProjects(response.data);
            } else {
                setProjects(fallbackProjects);
            }
        } catch (error) {
            console.log('Using fallback projects:', error.message);
            setProjects(fallbackProjects);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="projects-page">
                <h2>Projects</h2>
                <p className="projects-intro">Loading projects...</p>
            </section>
        );
    }

    return (
        <section className="projects-page">
            <h2>Projects</h2>
            <p className="projects-intro">Here are some of the projects I've built during my training and professional experience.</p>
            <div className="grid">
                {projects.map((p) => (
                    <article key={p.id || p.title} className="card project-card">
                        <div className="project-image">
                            <img
                                src={p.imageUrl || p.image || defaultProjectImage}
                                alt={p.title}
                                onError={(e) => { e.target.src = defaultProjectImage }}
                            />
                            {p.featured && <span className="featured-badge">Featured</span>}
                        </div>
                        <div className="project-content">
                            <h3>{p.title}</h3>
                            <p>{p.description}</p>
                            <p className="tech">{(p.technologies || p.tech || []).join(' • ')}</p>
                            <div className="project-links">
                                {p.liveUrl && (
                                    <a href={p.liveUrl} target="_blank" rel="noreferrer" className="project-link live-link">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                                        </svg>
                                        Live Demo
                                    </a>
                                )}
                                {(p.githubUrl || p.github) && (
                                    <a href={p.githubUrl || p.github} target="_blank" rel="noreferrer" className="project-link">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        Source Code
                                    </a>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
