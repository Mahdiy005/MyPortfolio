import { useEffect, useState } from 'react';
import { settingsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiSave, FiPhone, FiMail, FiLinkedin, FiGithub, FiTwitter, FiInstagram, FiMapPin, FiFileText, FiCode, FiUser } from 'react-icons/fi';
import './AdminStyles.css';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        logoName: '',
        personName: '',
        phone: '',
        email: '',
        linkedin: '',
        github: '',
        twitter: '',
        instagram: '',
        location: '',
        resumeUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await settingsAPI.get();
            setSettings(response.data);
        } catch (error) {
            toast.error('Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await settingsAPI.update(settings);
            toast.success('Settings saved successfully!');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Manage your contact information and social links</p>
            </div>

            <form onSubmit={handleSubmit} className="settings-form">
                <div className="settings-section">
                    <h2>Branding</h2>

                    <div className="settings-grid">
                        <div className="form-group">
                            <label>
                                <FiCode /> Logo Name
                            </label>
                            <input
                                type="text"
                                value={settings.logoName}
                                onChange={e => handleChange('logoName', e.target.value)}
                                placeholder="M.Mahdi"
                            />
                            <small className="form-hint">Displayed in the header logo</small>
                        </div>

                        <div className="form-group">
                            <label>
                                <FiUser /> Full Name
                            </label>
                            <input
                                type="text"
                                value={settings.personName}
                                onChange={e => handleChange('personName', e.target.value)}
                                placeholder="Mohamed Mahdi"
                            />
                            <small className="form-hint">Your name shown in the hero section</small>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Contact Information</h2>

                    <div className="settings-grid">
                        <div className="form-group">
                            <label>
                                <FiPhone /> Phone Number
                            </label>
                            <input
                                type="tel"
                                value={settings.phone}
                                onChange={e => handleChange('phone', e.target.value)}
                                placeholder="+1 234 567 8900"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FiMail /> Email Address
                            </label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={e => handleChange('email', e.target.value)}
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FiMapPin /> Location
                            </label>
                            <input
                                type="text"
                                value={settings.location}
                                onChange={e => handleChange('location', e.target.value)}
                                placeholder="City, Country"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FiFileText /> Resume URL
                            </label>
                            <input
                                type="url"
                                value={settings.resumeUrl}
                                onChange={e => handleChange('resumeUrl', e.target.value)}
                                placeholder="https://example.com/resume.pdf"
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Social Links</h2>

                    <div className="settings-grid">
                        <div className="form-group">
                            <label>
                                <FiLinkedin /> LinkedIn
                            </label>
                            <input
                                type="url"
                                value={settings.linkedin}
                                onChange={e => handleChange('linkedin', e.target.value)}
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FiGithub /> GitHub
                            </label>
                            <input
                                type="url"
                                value={settings.github}
                                onChange={e => handleChange('github', e.target.value)}
                                placeholder="https://github.com/yourusername"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FiTwitter /> Twitter / X
                            </label>
                            <input
                                type="url"
                                value={settings.twitter}
                                onChange={e => handleChange('twitter', e.target.value)}
                                placeholder="https://twitter.com/yourhandle"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FiInstagram /> Instagram
                            </label>
                            <input
                                type="url"
                                value={settings.instagram}
                                onChange={e => handleChange('instagram', e.target.value)}
                                placeholder="https://instagram.com/yourhandle"
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-actions">
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                <FiSave /> Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
