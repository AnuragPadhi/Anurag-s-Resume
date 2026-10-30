// Single source of truth for all portfolio content.
// Everything shown in the HTML panels and on the 3D signs is read from here.

export const profile = {
    name: 'Anurag Padhi',
    headline: 'Final-year BBA Decision Science student at Christ University, Bengaluru',
    positioning: 'Business-minded, analytical and people-oriented.',
    intro: 'I enjoy understanding problems, working with people, analysing information and turning it into practical solutions. My experience spans business analytics at Mu Sigma, HR and recruitment at POP (by Razorpay), and award-winning product and business-plan projects.',
    interests: [ 'Product Management', 'Business Analytics', 'HR & People Operations', 'Business Operations' ],
    lookingFor: 'Open to entry-level roles in Product, Business Analytics, HR / People Operations and Business Operations.',
    location: 'Bengaluru, Karnataka, India',
    email: 'anuragpadhidash@gmail.com',
    phone: '+91 81034 25210',
    phoneHref: 'tel:+918103425210',
    linkedin: 'https://linkedin.com/in/anurag-padhi/',
    linkedinLabel: 'linkedin.com/in/anurag-padhi',
    resume: 'resume/Anurag-Padhi-Resume.pdf',
    resumeFileName: 'Anurag-Padhi-Resume.pdf',
    highlights: [
        { value: '9.05', label: 'CGPA / 10' },
        { value: '4', label: 'Roles held' },
        { value: '100+', label: 'Candidates interviewed' },
        { value: '1st', label: 'ProdXPulse, 500+ teams' },
    ]
}

export const experience = [
    {
        organisation: 'Mu Sigma Inc.',
        role: 'Apprentice – Business Analytics',
        duration: 'July 2026 – Present',
        current: true,
        points: [
            'Researched and documented the lifecycle, mechanism of action and patient journey of Mavacamten (Camzyos) by Bristol Myers Squibb.',
            'Built a 7-day equipment failure prediction model for an Oil & Gas client using historical operational data.',
            'Used problem decomposition and root cause analysis to turn data into actionable business recommendations.',
        ]
    },
    {
        organisation: 'POP (by Razorpay)',
        role: 'HR Intern',
        duration: 'March 2026 – June 2026',
        points: [
            'Screened and interviewed 100+ candidates across technical and non-technical roles.',
            'Managed recruitment end to end, from job posting to onboarding.',
            'Designed an automated attendance tracking system that reduced manual HR work and improved data accuracy.',
            'Worked with department heads on hiring strategy and workforce planning.',
        ]
    },
    {
        organisation: 'Happy Folks Club',
        role: 'HR Intern',
        duration: 'January 2025 – August 2025',
        points: [
            'Conducted candidate screening and interviews.',
            'Tracked intern satisfaction and productivity.',
            'Coordinated with team leads to maintain employee engagement.',
        ]
    },
    {
        organisation: 'Teachers By Choice',
        role: 'Quantitative Aptitude Tutor',
        duration: 'January 2025 – Present',
        current: true,
        points: [
            'Teach quantitative reasoning and data interpretation, improving students’ analytical speed and accuracy.',
            'Mentored students who cleared Christ University’s BBA (Hons.) entrance examination.',
            'Recognised as Tutor of the Month and Most Impactful Teacher.',
        ]
    },
]

export const projects = [
    {
        name: 'BioNex',
        tagline: 'Piezoelectric energy harvesting for pacemakers',
        problem: 'Pacemaker batteries run down, and patients need surgery to replace them.',
        contribution: 'Proposed a biocompatible piezoelectric energy harvesting solution and developed a B2B business model aimed at pacemaker manufacturers, covering market analysis and financial feasibility.',
        solution: 'Harvest energy from the body’s natural motion to extend pacemaker battery life, sold B2B to device manufacturers.',
        achievements: [
            '2nd Prize – Innowave, Christ University Incubation Centre',
            'Selected for incubation',
            'Top 5 – Tech Zephyr B Plan Competition, IIT Bhubaneswar (2025)',
        ],
        image: 'bionex.webp',
    },
    {
        name: 'Mitti Mantra',
        tagline: 'AI-powered farm intelligence platform',
        problem: 'Indian smallholder farmers have little access to real-time agricultural intelligence and decision support.',
        contribution: 'Contributed to product ideation, user journey mapping and solution framework design in a cross-functional team of four.',
        solution: 'An AI-driven platform that gives smallholder farmers real-time agricultural intelligence and decision support.',
        achievements: [
            '1st Prize – ProdXPulse product hackathon (2025), among 500+ participants from premier institutes',
        ],
        image: 'mitti-mantra.webp',
    },
]

export const education = {
    institution: 'Christ University, Central Campus',
    place: 'Bengaluru',
    degree: 'Bachelor of Business Administration – Decision Science',
    duration: 'June 2024 – Expected June 2027',
    cgpa: '9.05 / 10 (up to Semester 4)',
    coursework: [ 'Business Statistics', 'Data Interpretation', 'Operations Research', 'Strategic Management', 'Organisational Behaviour', 'Decision Modelling' ],
    extra: {
        title: 'COIL International Learning Programme',
        text: 'Collaborative academic project with Baylor University, USA, offering cross-cultural and global business exposure.'
    }
}

export const certifications = [
    'Fundamentals of People Analytics',
    'Introduction to Cloud Computing',
    'Siemens Mobility – Project Manager Job Simulation (Forage)',
    'Python Bootcamp',
]

export const achievements = [
    { title: 'ProdXPulse – 1st Prize', text: 'Mitti Mantra won among 500+ participants in a product development hackathon.' },
    { title: 'Innowave – 2nd Prize', text: 'BioNex, at Christ University Incubation Centre’s flagship competition. Selected for incubation.' },
    { title: 'Tech Zephyr – Top 5', text: 'BioNex at the B Plan Competition, IIT Bhubaneswar (2025).' },
    { title: 'IIM Ranchi – YCP 2.0', text: 'Selected for the Young Changemakers Programme in leadership and social entrepreneurship.' },
    { title: 'Placement Trials – 4th', text: 'Ranked 4th at Melange, Christ University’s annual HR competition.' },
    { title: 'COIL Programme', text: 'International academic collaboration with Baylor University, USA.' },
]

export const skills = [
    { category: 'Analytics', items: [ 'Excel', 'Data Interpretation', 'Power BI', 'SQL', 'Python', 'Agile' ] },
    { category: 'Product & Operations', items: [ 'Product Thinking', 'User Journey Mapping', 'Process Improvement', 'Stakeholder Management' ] },
    { category: 'HR', items: [ 'Talent Acquisition', 'Recruitment Operations', 'Employee Engagement', 'Attendance Tracking' ] },
    { category: 'Tools', items: [ 'Figma', 'MS Office', 'Naukri', 'LinkedIn', 'Google Workspace', 'Keka HRMS' ] },
    { category: 'Soft skills', items: [ 'Communication', 'Cross-functional Collaboration', 'Problem-Solving', 'Leadership' ] },
    { category: 'Languages', items: [ 'English', 'Hindi', 'Odia' ] },
]

// Sections: id, nav label, and the respawn point of the 3D area that represents it
export const sections = [
    { id: 'home',         label: 'Home',         respawn: 'landing' },
    { id: 'experience',   label: 'Experience',   respawn: 'career' },
    { id: 'projects',     label: 'Projects',     respawn: 'projects' },
    { id: 'education',    label: 'Education',    respawn: 'lab' },
    { id: 'achievements', label: 'Achievements', respawn: 'achievements' },
    { id: 'skills',       label: 'Skills',       respawn: 'social' },
    { id: 'contact',      label: 'Contact',      respawn: 'social' },
]
