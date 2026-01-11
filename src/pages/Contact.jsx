export default function Contact() {
    return (
        <section className="contact-page">
            <h2>Contact Me</h2>
            <p className="contact-intro">
                I'm currently looking for opportunities as a Junior ASP.NET Backend Developer.
                Feel free to reach out if you'd like to work together!
            </p>

            <div className="contact-grid">
                <a href="mailto:mohamedibrahimahmedmahdi@gmail.com" className="contact-card">
                    <div className="contact-icon">✉️</div>
                    <h3>Email</h3>
                    <p>mohamedibrahimahmedmahdi@gmail.com</p>
                </a>

                <a href="tel:+201158037427" className="contact-card">
                    <div className="contact-icon">📱</div>
                    <h3>Phone</h3>
                    <p>+20 115 803 7427</p>
                </a>

                <a href="https://linkedin.com/in/mohamedmahdi" target="_blank" rel="noreferrer" className="contact-card">
                    <div className="contact-icon">💼</div>
                    <h3>LinkedIn</h3>
                    <p>linkedin.com/in/mohamedmahdi</p>
                </a>

                <a href="https://github.com/mohamedmahdi" target="_blank" rel="noreferrer" className="contact-card">
                    <div className="contact-icon">💻</div>
                    <h3>GitHub</h3>
                    <p>github.com/mohamedmahdi</p>
                </a>
            </div>

            <div className="contact-info">
                <p><strong>Location:</strong> Cairo, Egypt</p>
                <p><strong>Military Status:</strong> Exempt</p>
            </div>
        </section>
    )
}
