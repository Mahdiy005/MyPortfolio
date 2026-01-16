import { useState, useEffect } from 'react';
import { aboutAPI } from '../services/api';

export default function About() {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fallback data in case API fails
    const fallbackData = {
        summary: `Ambitious and detail-oriented Junior ASP.NET Backend Developer with a strong academic
            background in Information Technology. Completed comprehensive training in ASP.NET Core,
            SQL Server, and modern backend technologies. Eager to apply problem-solving skills and
            backend development knowledge in real-world business solutions.`,
        education: {
            degree: "Bachelor of Information Technology",
            institution: "Faculty of Computers and Information — Beni Suef University",
            grade: "Excellent with Honors",
            year: "2025"
        },
        experience: [{
            id: 1,
            title: "Backend Developer",
            company: "Corelia Company",
            duration: "6 Months",
            responsibilities: [
                "Built and maintained RESTful APIs",
                "Implemented business logic and database operations",
                "Collaborated with frontend developers to integrate APIs",
                "Participated in debugging, performance optimization, and code reviews"
            ]
        }],
        training: [{
            id: 1,
            title: ".NET Backend Development Track",
            provider: "Route Academy",
            skills: [
                "Developed backend web applications using ASP.NET Core",
                "Built RESTful APIs with SQL Server and Entity Framework",
                "Authentication, authorization, and API testing with Postman",
                "Version control with Git"
            ]
        }],
        skills: [
            { id: 1, category: "Languages", items: "C#, SQL, JavaScript" },
            { id: 2, category: "Backend", items: "ASP.NET Core, Entity Framework, LINQ" },
            { id: 3, category: "Database", items: "SQL Server, T-SQL, Database Design" },
            { id: 4, category: "Tools", items: "Visual Studio, Git, Postman, Swagger" },
            { id: 5, category: "Concepts", items: "REST APIs, MVC, Clean Architecture, CQRS" },
            { id: 6, category: "Languages", items: "Arabic (Native), English (Very Good)" }
        ]
    };

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await aboutAPI.get();
                setAboutData(response.data);
            } catch (error) {
                console.log('Using fallback about data');
                setAboutData(fallbackData);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutData();
    }, []);

    if (loading) {
        return (
            <section className="about-page">
                <h2>About Me</h2>
                <p>Loading...</p>
            </section>
        );
    }

    const data = aboutData || fallbackData;

    return (
        <section className="about-page">
            <h2>About Me</h2>
            <p className="about-summary">{data.summary}</p>

            <div className="about-section">
                <h3>Education</h3>
                <div className="card">
                    <h4>{data.education.degree}</h4>
                    <p>{data.education.institution}</p>
                    <p className="tech">Grade: {data.education.grade} | Graduation: {data.education.year}</p>
                </div>
            </div>

            <div className="about-section">
                <h3>Experience</h3>
                {data.experience.map(exp => (
                    <div className="card" key={exp.id}>
                        <h4>{exp.title} — {exp.company}</h4>
                        <p className="tech">Duration: {exp.duration}</p>
                        <ul>
                            {exp.responsibilities.map((resp, idx) => (
                                <li key={idx}>{resp}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="about-section">
                <h3>Technical Training</h3>
                {data.training.map(tr => (
                    <div className="card" key={tr.id}>
                        <h4>{tr.title} — {tr.provider}</h4>
                        <ul>
                            {tr.skills.map((skill, idx) => (
                                <li key={idx}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="about-section">
                <h3>Technical Skills</h3>
                <div className="skills-grid">
                    {data.skills.map(skill => (
                        <div className="skill-category" key={skill.id}>
                            <h4>{skill.category}</h4>
                            <p>{skill.items}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
