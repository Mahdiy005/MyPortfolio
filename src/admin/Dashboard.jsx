import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, settingsAPI } from '../services/api';
import { FiFolder, FiSettings, FiPlus, FiExternalLink } from 'react-icons/fi';
import './AdminStyles.css';

export default function Dashboard() {
    const [stats, setStats] = useState({ projects: 0, featuredProjects: 0 });
    const [recentProjects, setRecentProjects] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projectsRes, settingsRes] = await Promise.all([
                projectsAPI.getAll(),
                settingsAPI.get()
            ]);

            const projects = projectsRes.data;
            setStats({
                projects: projects.length,
                featuredProjects: projects.filter(p => p.featured).length
            });
            setRecentProjects(projects.slice(-3).reverse());
            setSettings(settingsRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back! Here's an overview of your portfolio.</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon projects">
                        <FiFolder size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.projects}</h3>
                        <p>Total Projects</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon featured">
                        <FiExternalLink size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.featuredProjects}</h3>
                        <p>Featured Projects</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon settings">
                        <FiSettings size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{Object.values(settings).filter(v => v).length}</h3>
                        <p>Links Configured</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/admin/projects" className="action-card">
                        <FiPlus size={24} />
                        <span>Add New Project</span>
                    </Link>
                    <Link to="/admin/settings" className="action-card">
                        <FiSettings size={24} />
                        <span>Update Settings</span>
                    </Link>
                </div>
            </div>

            {/* Recent Projects */}
            <div className="recent-section">
                <h2>Recent Projects</h2>
                {recentProjects.length > 0 ? (
                    <div className="recent-list">
                        {recentProjects.map(project => (
                            <div key={project.id} className="recent-item">
                                <div className="recent-info">
                                    <h4>{project.title}</h4>
                                    <p>{project.description.substring(0, 80)}...</p>
                                </div>
                                {project.featured && <span className="badge">Featured</span>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-message">No projects yet. Start by adding your first project!</p>
                )}
            </div>
        </div>
    );
}
