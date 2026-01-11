export default function About() {
    return (
        <section className="about-page">
            <h2>About Me</h2>
            <p className="about-summary">
                Ambitious and detail-oriented Junior ASP.NET Backend Developer with a strong academic
                background in Information Technology. Completed comprehensive training in ASP.NET Core,
                SQL Server, and modern backend technologies. Eager to apply problem-solving skills and
                backend development knowledge in real-world business solutions.
            </p>

            <div className="about-section">
                <h3>Education</h3>
                <div className="card">
                    <h4>Bachelor of Information Technology</h4>
                    <p>Faculty of Computers and Information — Beni Suef University</p>
                    <p className="tech">Grade: Excellent with Honors | Graduation: 2025</p>
                </div>
            </div>

            <div className="about-section">
                <h3>Experience</h3>
                <div className="card">
                    <h4>Backend Developer — Corelia Company</h4>
                    <p className="tech">Duration: 6 Months</p>
                    <ul>
                        <li>Built and maintained RESTful APIs</li>
                        <li>Implemented business logic and database operations</li>
                        <li>Collaborated with frontend developers to integrate APIs</li>
                        <li>Participated in debugging, performance optimization, and code reviews</li>
                    </ul>
                </div>
            </div>

            <div className="about-section">
                <h3>Technical Training</h3>
                <div className="card">
                    <h4>.NET Backend Development Track — Route Academy</h4>
                    <ul>
                        <li>Developed backend web applications using ASP.NET Core</li>
                        <li>Built RESTful APIs with SQL Server and Entity Framework</li>
                        <li>Authentication, authorization, and API testing with Postman</li>
                        <li>Version control with Git</li>
                    </ul>
                </div>
            </div>

            <div className="about-section">
                <h3>Technical Skills</h3>
                <div className="skills-grid">
                    <div className="skill-category">
                        <h4>Languages</h4>
                        <p>C#, SQL, JavaScript</p>
                    </div>
                    <div className="skill-category">
                        <h4>Backend</h4>
                        <p>ASP.NET Core, Entity Framework, LINQ</p>
                    </div>
                    <div className="skill-category">
                        <h4>Database</h4>
                        <p>SQL Server, T-SQL, Database Design</p>
                    </div>
                    <div className="skill-category">
                        <h4>Tools</h4>
                        <p>Visual Studio, Git, Postman, Swagger</p>
                    </div>
                    <div className="skill-category">
                        <h4>Concepts</h4>
                        <p>REST APIs, MVC, Clean Architecture, CQRS</p>
                    </div>
                    <div className="skill-category">
                        <h4>Languages</h4>
                        <p>Arabic (Native), English (Very Good)</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
