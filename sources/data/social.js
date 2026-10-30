import { profile } from './portfolio.js'

// Interactive points around the statue in the Skills & Contact area
export default [
    { name: 'Email', url: `mailto:${profile.email}`, align: 'right' },
    { name: 'LinkedIn', url: profile.linkedin, align: 'right' },
    { name: 'Call', url: profile.phoneHref, align: 'right' },
    { name: 'Resume', url: profile.resume, align: 'left' },
    { name: 'Skills', panel: 'skills', align: 'left' },
    { name: 'Contact', panel: 'contact', align: 'left' },
]
