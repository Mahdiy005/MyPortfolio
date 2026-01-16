import { useEffect, useState } from 'react';
import { aboutAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
    FiSave, FiPlus, FiEdit2, FiTrash2, FiX, FiUser, FiBook,
    FiBriefcase, FiAward, FiCode
} from 'react-icons/fi';
import './AdminStyles.css';

export default function AboutPage() {
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('summary');

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'experience' | 'training' | 'skill'
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        try {
            const response = await aboutAPI.get();
            setAbout(response.data);
        } catch (error) {
            toast.error('Failed to fetch about content');
        } finally {
            setLoading(false);
        }
    };

    // Summary handlers
    const handleSaveSummary = async () => {
        setSaving(true);
        try {
            await aboutAPI.updateSummary(about.summary);
            toast.success('Summary updated successfully!');
        } catch (error) {
            toast.error('Failed to update summary');
        } finally {
            setSaving(false);
        }
    };

    // Education handlers
    const handleSaveEducation = async () => {
        setSaving(true);
        try {
            await aboutAPI.updateEducation(about.education);
            toast.success('Education updated successfully!');
        } catch (error) {
            toast.error('Failed to update education');
        } finally {
            setSaving(false);
        }
    };

    // Experience handlers
    const openExperienceModal = (experience = null) => {
        setModalType('experience');
        setEditingItem(experience);
        setFormData(experience ? {
            title: experience.title,
            company: experience.company,
            duration: experience.duration,
            responsibilities: experience.responsibilities.join('\n')
        } : {
            title: '',
            company: '',
            duration: '',
            responsibilities: ''
        });
        setModalOpen(true);
    };

    const handleSaveExperience = async () => {
        const experienceData = {
            title: formData.title,
            company: formData.company,
            duration: formData.duration,
            responsibilities: formData.responsibilities.split('\n').filter(r => r.trim())
        };

        try {
            if (editingItem) {
                await aboutAPI.updateExperience(editingItem.id, experienceData);
                toast.success('Experience updated!');
            } else {
                await aboutAPI.addExperience(experienceData);
                toast.success('Experience added!');
            }
            setModalOpen(false);
            fetchAbout();
        } catch (error) {
            toast.error('Failed to save experience');
        }
    };

    const handleDeleteExperience = async (id) => {
        if (!window.confirm('Delete this experience?')) return;
        try {
            await aboutAPI.deleteExperience(id);
            toast.success('Experience deleted!');
            fetchAbout();
        } catch (error) {
            toast.error('Failed to delete experience');
        }
    };

    // Training handlers
    const openTrainingModal = (training = null) => {
        setModalType('training');
        setEditingItem(training);
        setFormData(training ? {
            title: training.title,
            institution: training.institution,
            skills: training.skills.join('\n')
        } : {
            title: '',
            institution: '',
            skills: ''
        });
        setModalOpen(true);
    };

    const handleSaveTraining = async () => {
        const trainingData = {
            title: formData.title,
            institution: formData.institution,
            skills: formData.skills.split('\n').filter(s => s.trim())
        };

        try {
            if (editingItem) {
                await aboutAPI.updateTraining(editingItem.id, trainingData);
                toast.success('Training updated!');
            } else {
                await aboutAPI.addTraining(trainingData);
                toast.success('Training added!');
            }
            setModalOpen(false);
            fetchAbout();
        } catch (error) {
            toast.error('Failed to save training');
        }
    };

    const handleDeleteTraining = async (id) => {
        if (!window.confirm('Delete this training?')) return;
        try {
            await aboutAPI.deleteTraining(id);
            toast.success('Training deleted!');
            fetchAbout();
        } catch (error) {
            toast.error('Failed to delete training');
        }
    };

    // Skills handlers
    const handleUpdateSkill = (index, field, value) => {
        const newSkills = [...about.skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        setAbout({ ...about, skills: newSkills });
    };

    const handleAddSkill = () => {
        const newSkills = [...about.skills, { id: Date.now().toString(), category: '', items: '' }];
        setAbout({ ...about, skills: newSkills });
    };

    const handleRemoveSkill = (index) => {
        const newSkills = about.skills.filter((_, i) => i !== index);
        setAbout({ ...about, skills: newSkills });
    };

    const handleSaveSkills = async () => {
        setSaving(true);
        try {
            await aboutAPI.updateSkills(about.skills);
            toast.success('Skills updated successfully!');
        } catch (error) {
            toast.error('Failed to update skills');
        } finally {
            setSaving(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    return (
        <div className="about-admin-page">
            <div className="page-header">
                <h1>About Me</h1>
                <p>Manage your about page content</p>
            </div>

            {/* Tabs */}
            <div className="about-tabs">
                <button
                    className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summary')}
                >
                    <FiUser /> Summary
                </button>
                <button
                    className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                    onClick={() => setActiveTab('education')}
                >
                    <FiBook /> Education
                </button>
                <button
                    className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                    onClick={() => setActiveTab('experience')}
                >
                    <FiBriefcase /> Experience
                </button>
                <button
                    className={`tab-btn ${activeTab === 'training' ? 'active' : ''}`}
                    onClick={() => setActiveTab('training')}
                >
                    <FiAward /> Training
                </button>
                <button
                    className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                    onClick={() => setActiveTab('skills')}
                >
                    <FiCode /> Skills
                </button>
            </div>

            {/* Summary Tab */}
            {activeTab === 'summary' && (
                <div className="about-section-admin">
                    <div className="section-header">
                        <h2>Professional Summary</h2>
                    </div>
                    <div className="form-group">
                        <textarea
                            value={about.summary}
                            onChange={(e) => setAbout({ ...about, summary: e.target.value })}
                            rows={6}
                            placeholder="Write your professional summary..."
                        />
                    </div>
                    <button className="btn-primary" onClick={handleSaveSummary} disabled={saving}>
                        {saving ? <span className="loading-spinner"></span> : <><FiSave /> Save Summary</>}
                    </button>
                </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
                <div className="about-section-admin">
                    <div className="section-header">
                        <h2>Education</h2>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Degree</label>
                            <input
                                type="text"
                                value={about.education.degree}
                                onChange={(e) => setAbout({
                                    ...about,
                                    education: { ...about.education, degree: e.target.value }
                                })}
                                placeholder="e.g., Bachelor of Information Technology"
                            />
                        </div>
                        <div className="form-group">
                            <label>Institution</label>
                            <input
                                type="text"
                                value={about.education.institution}
                                onChange={(e) => setAbout({
                                    ...about,
                                    education: { ...about.education, institution: e.target.value }
                                })}
                                placeholder="e.g., University Name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Grade</label>
                            <input
                                type="text"
                                value={about.education.grade}
                                onChange={(e) => setAbout({
                                    ...about,
                                    education: { ...about.education, grade: e.target.value }
                                })}
                                placeholder="e.g., Excellent with Honors"
                            />
                        </div>
                        <div className="form-group">
                            <label>Graduation Year</label>
                            <input
                                type="text"
                                value={about.education.graduationYear}
                                onChange={(e) => setAbout({
                                    ...about,
                                    education: { ...about.education, graduationYear: e.target.value }
                                })}
                                placeholder="e.g., 2025"
                            />
                        </div>
                    </div>
                    <button className="btn-primary" onClick={handleSaveEducation} disabled={saving}>
                        {saving ? <span className="loading-spinner"></span> : <><FiSave /> Save Education</>}
                    </button>
                </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
                <div className="about-section-admin">
                    <div className="section-header">
                        <h2>Work Experience</h2>
                        <button className="btn-primary" onClick={() => openExperienceModal()}>
                            <FiPlus /> Add Experience
                        </button>
                    </div>
                    <div className="items-list">
                        {about.experience.map((exp) => (
                            <div key={exp.id} className="item-card">
                                <div className="item-info">
                                    <h3>{exp.title}</h3>
                                    <p className="item-subtitle">{exp.company} • {exp.duration}</p>
                                    <ul className="item-details">
                                        {exp.responsibilities.map((r, i) => (
                                            <li key={i}>{r}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="item-actions">
                                    <button className="btn-icon" onClick={() => openExperienceModal(exp)}>
                                        <FiEdit2 />
                                    </button>
                                    <button className="btn-icon delete" onClick={() => handleDeleteExperience(exp.id)}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {about.experience.length === 0 && (
                            <p className="empty-message">No experience added yet.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Training Tab */}
            {activeTab === 'training' && (
                <div className="about-section-admin">
                    <div className="section-header">
                        <h2>Technical Training</h2>
                        <button className="btn-primary" onClick={() => openTrainingModal()}>
                            <FiPlus /> Add Training
                        </button>
                    </div>
                    <div className="items-list">
                        {about.training.map((tr) => (
                            <div key={tr.id} className="item-card">
                                <div className="item-info">
                                    <h3>{tr.title}</h3>
                                    <p className="item-subtitle">{tr.institution}</p>
                                    <ul className="item-details">
                                        {tr.skills.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="item-actions">
                                    <button className="btn-icon" onClick={() => openTrainingModal(tr)}>
                                        <FiEdit2 />
                                    </button>
                                    <button className="btn-icon delete" onClick={() => handleDeleteTraining(tr.id)}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {about.training.length === 0 && (
                            <p className="empty-message">No training added yet.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
                <div className="about-section-admin">
                    <div className="section-header">
                        <h2>Technical Skills</h2>
                        <button className="btn-secondary" onClick={handleAddSkill}>
                            <FiPlus /> Add Category
                        </button>
                    </div>
                    <div className="skills-editor">
                        {about.skills.map((skill, index) => (
                            <div key={skill.id} className="skill-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        value={skill.category}
                                        onChange={(e) => handleUpdateSkill(index, 'category', e.target.value)}
                                        placeholder="e.g., Languages"
                                    />
                                </div>
                                <div className="form-group flex-grow">
                                    <label>Skills</label>
                                    <input
                                        type="text"
                                        value={skill.items}
                                        onChange={(e) => handleUpdateSkill(index, 'items', e.target.value)}
                                        placeholder="e.g., C#, JavaScript, Python"
                                    />
                                </div>
                                <button
                                    className="btn-icon delete"
                                    onClick={() => handleRemoveSkill(index)}
                                    title="Remove"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="btn-primary" onClick={handleSaveSkills} disabled={saving}>
                        {saving ? <span className="loading-spinner"></span> : <><FiSave /> Save Skills</>}
                    </button>
                </div>
            )}

            {/* Modal for Experience/Training */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {editingItem ? 'Edit' : 'Add'} {modalType === 'experience' ? 'Experience' : 'Training'}
                            </h2>
                            <button className="modal-close" onClick={closeModal}>
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="modal-form">
                            {modalType === 'experience' && (
                                <>
                                    <div className="form-group">
                                        <label>Job Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g., Backend Developer"
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Company *</label>
                                            <input
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                placeholder="e.g., Tech Company"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Duration</label>
                                            <input
                                                type="text"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                placeholder="e.g., 6 Months"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Responsibilities (one per line)</label>
                                        <textarea
                                            value={formData.responsibilities}
                                            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                                            rows={5}
                                            placeholder="Built RESTful APIs&#10;Implemented authentication&#10;Collaborated with team"
                                        />
                                    </div>
                                </>
                            )}

                            {modalType === 'training' && (
                                <>
                                    <div className="form-group">
                                        <label>Training Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g., .NET Backend Development Track"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Institution *</label>
                                        <input
                                            type="text"
                                            value={formData.institution}
                                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                            placeholder="e.g., Route Academy"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Skills Learned (one per line)</label>
                                        <textarea
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                            rows={5}
                                            placeholder="ASP.NET Core development&#10;RESTful API design&#10;Database management"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={modalType === 'experience' ? handleSaveExperience : handleSaveTraining}
                                >
                                    <FiSave /> {editingItem ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
