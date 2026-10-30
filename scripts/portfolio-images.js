// Generates the board images shown in the 3D Projects and Education areas.
// Run with: node scripts/portfolio-images.js
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'static')

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const card = ({ eyebrow, title, subtitle, badges = [], accent = '#ff5a4f' }) =>
{
    const badgesSvg = badges.map((badge, i) =>
    {
        const y = 360 + i * 54
        return `
            <rect x="70" y="${y}" rx="22" ry="22" width="${badge.length * 15 + 60}" height="44" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="2"/>
            <text x="100" y="${y + 30}" font-size="24" font-weight="700" fill="#ffffff">${escape(badge)}</text>`
    }).join('')

    return Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" font-family="Segoe UI, Arial, sans-serif">
            <defs>
                <radialGradient id="bg" cx="0" cy="0" r="1.3">
                    <stop offset="0" stop-color="#3a2f43"/>
                    <stop offset="1" stop-color="#1d1721"/>
                </radialGradient>
            </defs>
            <rect width="960" height="540" fill="url(#bg)"/>
            <rect x="70" y="70" width="70" height="8" rx="4" fill="${accent}"/>
            <text x="70" y="130" font-size="28" font-weight="700" fill="${accent}" letter-spacing="3">${escape(eyebrow.toUpperCase())}</text>
            <text x="68" y="225" font-size="88" font-weight="800" fill="#ffffff">${escape(title)}</text>
            <text x="70" y="290" font-size="34" fill="#e9dff0">${escape(subtitle)}</text>
            ${badgesSvg}
        </svg>
    `)
}

const items = [
    // Projects
    { file: 'projects/images/bionex.webp', eyebrow: 'Project · Healthcare', title: 'BioNex', subtitle: 'Piezoelectric energy harvesting for pacemakers', badges: [ '2nd Prize – Innowave · Incubated', 'Top 5 – Tech Zephyr, IIT Bhubaneswar' ] },
    { file: 'projects/images/mitti-mantra.webp', eyebrow: 'Project · Agritech', title: 'Mitti Mantra', subtitle: 'AI-powered farm intelligence platform', badges: [ '1st Prize – ProdXPulse · 500+ participants' ], accent: '#7fd36b' },

    // Education & certifications
    { file: 'lab/images/christ-university.webp', eyebrow: 'Education', title: 'Christ University', subtitle: 'BBA Decision Science · 2024 – 2027', badges: [ 'CGPA 9.05 / 10' ], accent: '#5390ff' },
    { file: 'lab/images/coil.webp', eyebrow: 'International programme', title: 'COIL', subtitle: 'Collaborative project with Baylor University, USA', badges: [ 'Global business exposure' ], accent: '#5390ff' },
    { file: 'lab/images/people-analytics.webp', eyebrow: 'Certification', title: 'People Analytics', subtitle: 'Fundamentals of People Analytics', accent: '#b65fff' },
    { file: 'lab/images/cloud-computing.webp', eyebrow: 'Certification', title: 'Cloud Computing', subtitle: 'Introduction to Cloud Computing', accent: '#b65fff' },
    { file: 'lab/images/siemens-forage.webp', eyebrow: 'Certification · Forage', title: 'Siemens Mobility', subtitle: 'Project Manager Job Simulation', accent: '#b65fff' },
    { file: 'lab/images/python-bootcamp.webp', eyebrow: 'Certification', title: 'Python Bootcamp', subtitle: 'Python Bootcamp certificate', accent: '#b65fff' },
]

for(const item of items)
{
    const output = path.join(root, item.file)
    await sharp(card(item)).webp({ quality: 82 }).toFile(output)

    if(item.file.startsWith('lab/'))
        await sharp(card(item)).resize(240, 136).webp({ quality: 80 }).toFile(output.replace('.webp', '-mini.webp'))

    console.log('✓', item.file)
}
