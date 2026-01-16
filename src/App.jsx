import { useState, useEffect, useMemo } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { settingsAPI } from './services/api'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

// Admin imports
import Login from './admin/Login'
import DashboardLayout from './admin/DashboardLayout'
import Dashboard from './admin/Dashboard'
import ProjectsPage from './admin/ProjectsPage'
import SettingsPage from './admin/SettingsPage'
import AboutPage from './admin/AboutPage'
import ProtectedRoute from './admin/ProtectedRoute'

export default function App() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [particlesInit, setParticlesInit] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
    const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'medium')
    const [siteSettings, setSiteSettings] = useState({ logoName: 'M.Mahdi', personName: 'Mohamed Mahdi' })
    const location = useLocation()

    // Check if we're on admin pages
    const isAdminRoute = location.pathname.startsWith('/admin')

    const toggleMenu = () => setMenuOpen(!menuOpen)
    const closeMenu = () => setMenuOpen(false)
    const toggleSettings = () => setSettingsOpen(!settingsOpen)

    // Fetch site settings (logo name, person name)
    useEffect(() => {
        const fetchSiteSettings = async () => {
            try {
                const response = await settingsAPI.get()
                if (response.data) {
                    setSiteSettings(prev => ({
                        logoName: response.data.logoName || prev.logoName,
                        personName: response.data.personName || prev.personName
                    }))
                }
            } catch (error) {
                console.log('Using default site settings')
            }
        }
        fetchSiteSettings()
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        document.documentElement.setAttribute('data-font-size', fontSize)
        localStorage.setItem('fontSize', fontSize)
    }, [fontSize])

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine)
        }).then(() => {
            setParticlesInit(true)
        })
    }, [])

    const particlesOptions = useMemo(() => {
        const particleColor = theme === 'light' ? '#2563eb' : '#ff6b00'
        const particleOpacity = theme === 'light' ? 0.8 : 0.5
        const linkOpacity = theme === 'light' ? 0.4 : 0.15

        return {
            background: {
                color: { value: 'transparent' }
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onClick: {
                        enable: true,
                        mode: 'push'
                    }
                },
                modes: {
                    grab: {
                        distance: 200,
                        links: { opacity: 0.8 }
                    },
                    push: { quantity: 6 }
                }
            },
            particles: {
                color: { value: particleColor },
                links: {
                    color: particleColor,
                    distance: 150,
                    enable: true,
                    opacity: linkOpacity,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    outModes: { default: 'bounce' }
                },
                number: {
                    density: { enable: true, area: 600 },
                    value: 120
                },
                opacity: {
                    value: particleOpacity,
                    random: true,
                    animation: {
                        enable: true,
                        speed: 1,
                        minimumValue: 0.1
                    }
                },
                shape: {
                    type: ['circle', 'triangle', 'polygon'],
                    polygon: { sides: 6 }
                },
                size: {
                    value: { min: 1, max: 4 },
                    random: true
                }
            },
            detectRetina: true
        }
    }, [theme])

    // If on admin routes, render admin layout only
    if (isAdminRoute) {
        return (
            <Routes>
                <Route path="/admin" element={<Login />} />
                <Route path="/admin/*" element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        )
    }

    return (
        <div className="app">
            {particlesInit && (
                <Particles
                    id="tsparticles"
                    options={particlesOptions}
                    className="particles-bg"
                />
            )}
            <header className="header">
                <div className="header-inner">
                    <a href="/" className="logo">
                        <span className="logo-icon">&lt;/&gt;</span>
                        <span className="logo-text">{siteSettings.logoName}</span>
                    </a>
                    <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
                        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Home</NavLink>
                        {/* <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Services</NavLink> */}
                        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>About me</NavLink>
                        <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Portfolio</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Contact me</NavLink>
                    </nav>
                    <a href="#contact" className="btn btn-primary header-cta">Hire Me</a>
                    <button className="settings-btn" onClick={toggleSettings} aria-label="Settings">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                            <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                        </svg>
                    </button>
                    {settingsOpen && (
                        <div className="settings-panel">
                            <div className="settings-header">
                                <h3>Settings</h3>
                                <button className="settings-close" onClick={toggleSettings}>×</button>
                            </div>
                            <div className="settings-group">
                                <label>Theme</label>
                                <div className="settings-options">
                                    <button
                                        className={`settings-option ${theme === 'dark' ? 'active' : ''}`}
                                        onClick={() => setTheme('dark')}
                                    >
                                        🌙 Dark
                                    </button>
                                    <button
                                        className={`settings-option ${theme === 'light' ? 'active' : ''}`}
                                        onClick={() => setTheme('light')}
                                    >
                                        ☀️ Light
                                    </button>
                                </div>
                            </div>
                            <div className="settings-group">
                                <label>Font Size</label>
                                <div className="settings-options">
                                    <button
                                        className={`settings-option ${fontSize === 'small' ? 'active' : ''}`}
                                        onClick={() => setFontSize('small')}
                                    >
                                        A-
                                    </button>
                                    <button
                                        className={`settings-option ${fontSize === 'medium' ? 'active' : ''}`}
                                        onClick={() => setFontSize('medium')}
                                    >
                                        A
                                    </button>
                                    <button
                                        className={`settings-option ${fontSize === 'large' ? 'active' : ''}`}
                                        onClick={() => setFontSize('large')}
                                    >
                                        A+
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <button className="burger" onClick={toggleMenu} aria-label="Toggle menu">
                        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>
            </header>
            <main className="main">
                <Routes>
                    <Route path="/" element={<Home personName={siteSettings.personName} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/services" element={<Home personName={siteSettings.personName} />} />
                </Routes>
            </main>
        </div>
    )
}
