import { useEffect, useState, useRef } from 'react';
import { projectsAPI, uploadAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiExternalLink, FiGithub, FiUpload, FiImage } from 'react-icons/fi';
import './AdminStyles.css';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        imageUrl: '',
        liveUrl: '',
        githubUrl: '',
        featured: false
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.data);
        } catch (error) {
            toast.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description,
                technologies: project.technologies.join(', '),
                imageUrl: project.imageUrl || '',
                liveUrl: project.liveUrl || '',
                githubUrl: project.githubUrl || '',
                featured: project.featured || false
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                technologies: '',
                imageUrl: '',
                liveUrl: '',
                githubUrl: '',
                featured: false
            });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProject(null);
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select a valid image file (jpg, png, gif, webp)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const response = await uploadAPI.uploadImage(file);
            // Cloudinary returns full URL directly
            setFormData({ ...formData, imageUrl: response.data.imageUrl });
            toast.success('Image uploaded successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    // Get display image URL (handle both uploaded and external URLs)
    const getImageUrl = (url) => {
        if (!url) return '';
        // If it's a relative URL from our server, prepend the base URL
        if (url.startsWith('/uploads/')) {
            return `${UPLOADS_BASE_URL}${url}`;
        }
        return url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            toast.error('Title and description are required');
            return;
        }

        const projectData = {
            ...formData,
            technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t)
        };

        try {
            if (editingProject) {
                await projectsAPI.update(editingProject.id, projectData);
                toast.success('Project updated successfully!');
            } else {
                await projectsAPI.create(projectData);
                toast.success('Project created successfully!');
            }
            closeModal();
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save project');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await projectsAPI.delete(id);
            toast.success('Project deleted successfully!');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    return (
        <div className="projects-page">
            <div className="page-header">
                <div>
                    <h1>Projects</h1>
                    <p>Manage your portfolio projects</p>
                </div>
                <button className="btn-primary" onClick={() => openModal()}>
                    <FiPlus /> Add Project
                </button>
            </div>

            {/* Projects Grid */}
            <div className="projects-grid">
                {projects.length > 0 ? (
                    projects.map(project => (
                        <div key={project.id} className="project-card-admin">
                            {project.imageUrl && (
                                <div className="project-image">
                                    <img src={getImageUrl(project.imageUrl)} alt={project.title} />
                                </div>
                            )}
                            <div className="project-content">
                                <div className="project-header">
                                    <h3>{project.title}</h3>
                                    {project.featured && <span className="badge">Featured</span>}
                                </div>
                                <p className="project-desc">{project.description}</p>

                                {project.technologies.length > 0 && (
                                    <div className="project-tech">
                                        {project.technologies.map((tech, i) => (
                                            <span key={i} className="tech-tag">{tech}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="project-links">
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                            <FiExternalLink /> Live
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                            <FiGithub /> GitHub
                                        </a>
                                    )}
                                </div>

                                <div className="project-actions">
                                    <button className="btn-edit" onClick={() => openModal(project)}>
                                        <FiEdit2 /> Edit
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(project.id)}>
                                        <FiTrash2 /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <FiPlus size={48} />
                        <h3>No projects yet</h3>
                        <p>Start by adding your first project</p>
                        <button className="btn-primary" onClick={() => openModal()}>
                            <FiPlus /> Add Project
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Project title"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Project description"
                                    rows={4}
                                />
                            </div>

                            <div className="form-group">
                                <label>Technologies (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.technologies}
                                    onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                                    placeholder="React, Node.js, MongoDB"
                                />
                            </div>

                            <div className="form-group">
                                <label><FiImage /> Project Image</label>
                                <div className="image-upload-section">
                                    {formData.imageUrl && (
                                        <div className="image-preview">
                                            <img src={formData.imageUrl} alt="Preview" />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    )}
                                    <div className="upload-controls">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn-upload"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                        >
                                            {uploading ? (
                                                <span className="loading-spinner"></span>
                                            ) : (
                                                <>
                                                    <FiUpload /> Upload Image
                                                </>
                                            )}
                                        </button>
                                        <span className="upload-hint">or paste URL below</span>
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="image-url-input"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Live URL</label>
                                    <input
                                        type="url"
                                        value={formData.liveUrl}
                                        onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                                        placeholder="https://myproject.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>GitHub URL</label>
                                    <input
                                        type="url"
                                        value={formData.githubUrl}
                                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                                        placeholder="https://github.com/user/repo"
                                    />
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                    />
                                    Featured Project
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    <FiSave /> {editingProject ? 'Update' : 'Create'} Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
