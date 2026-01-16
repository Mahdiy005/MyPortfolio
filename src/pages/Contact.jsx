import { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

// Fallback contact info
const fallbackSettings = {
    email: 'mohamedibrahimahmedmahdi@gmail.com',
    phone: '+20 115 803 7427',
    linkedin: 'https://linkedin.com/in/mohamedmahdi',
    github: 'https://github.com/mohamedmahdi',
    twitter: '',
    instagram: '',
    location: 'Cairo, Egypt',
    resumeUrl: ''
};

export default function Contact() {
    const [settings, setSettings] = useState(fallbackSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await settingsAPI.get();
            // Merge API settings with fallback (use fallback for empty values)
            const apiSettings = response.data;
            setSettings({
                email: apiSettings.email || fallbackSettings.email,
                phone: apiSettings.phone || fallbackSettings.phone,
                linkedin: apiSettings.linkedin || fallbackSettings.linkedin,
                github: apiSettings.github || fallbackSettings.github,
                twitter: apiSettings.twitter || fallbackSettings.twitter,
                instagram: apiSettings.instagram || fallbackSettings.instagram,
                location: apiSettings.location || fallbackSettings.location,
                resumeUrl: apiSettings.resumeUrl || fallbackSettings.resumeUrl
            });
        } catch (error) {
            console.log('Using fallback settings:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Format phone for display
    const formatPhone = (phone) => {
        if (!phone) return '';
        return phone.replace(/[^\d+]/g, '').replace(/(\+\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
    };

    // Extract username from URL for display
    const getDisplayName = (url, platform) => {
        if (!url) return '';
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname.replace(/^\/+|\/+$/g, '');
            return `${platform}.com/${path}`;
        } catch {
            return url;
        }
    };

    if (loading) {
        return (
            <section className="contact-page">
                <h2>Contact Me</h2>
                <p className="contact-intro">Loading contact information...</p>
            </section>
        );
    }

    return (
        <section className="contact-page">
            <h2>Contact Me</h2>
            <p className="contact-intro">
                I'm currently looking for opportunities as a Junior ASP.NET Backend Developer.
                Feel free to reach out if you'd like to work together!
            </p>

            <div className="contact-grid">
                {settings.email && (
                    <a href={`mailto:${settings.email}`} className="contact-card">
                        <div className="contact-icon">✉️</div>
                        <h3>Email</h3>
                        <p>{settings.email}</p>
                    </a>
                )}

                {settings.phone && (
                    <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="contact-card">
                        <div className="contact-icon">📱</div>
                        <h3>Phone</h3>
                        <p>{settings.phone}</p>
                    </a>
                )}

                {settings.linkedin && (
                    <a href={settings.linkedin} target="_blank" rel="noreferrer" className="contact-card">
                        <div className="contact-icon">💼</div>
                        <h3>LinkedIn</h3>
                        <p>{getDisplayName(settings.linkedin, 'linkedin')}</p>
                    </a>
                )}

                {settings.github && (
                    <a href={settings.github} target="_blank" rel="noreferrer" className="contact-card">
                        <div className="contact-icon">💻</div>
                        <h3>GitHub</h3>
                        <p>{getDisplayName(settings.github, 'github')}</p>
                    </a>
                )}

                {settings.twitter && (
                    <a href={settings.twitter} target="_blank" rel="noreferrer" className="contact-card">
                        <div className="contact-icon">🐦</div>
                        <h3>Twitter / X</h3>
                        <p>{getDisplayName(settings.twitter, 'twitter')}</p>
                    </a>
                )}

                {settings.instagram && (
                    <a href={settings.instagram} target="_blank" rel="noreferrer" className="contact-card">
                        <div className="contact-icon">📸</div>
                        <h3>Instagram</h3>
                        <p>{getDisplayName(settings.instagram, 'instagram')}</p>
                    </a>
                )}
            </div>

            <div className="contact-info">
                {settings.location && <p><strong>Location:</strong> {settings.location}</p>}
                <p><strong>Military Status:</strong> Exempt</p>
                {settings.resumeUrl && (
                    <a href={settings.resumeUrl} target="_blank" rel="noreferrer" className="resume-link">
                        📄 Download Resume
                    </a>
                )}
            </div>
        </section>
    )
}
