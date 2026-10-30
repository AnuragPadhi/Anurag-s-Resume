import { profile, experience, projects, education, certifications, achievements, skills, sections } from '../data/portfolio.js'

// Recruiter-first HTML layer: navigation bar, intro card and section panels.
// Works on its own (no 3D needed); the driving game plugs in through `setGame()`.
export class Portfolio
{
    static getInstance()
    {
        return Portfolio.instance
    }

    constructor({ onStartGame = null } = {})
    {
        if(Portfolio.instance)
            return Portfolio.instance

        Portfolio.instance = this

        this.game = null
        this.onStartGame = onStartGame
        this.current = null

        this.element = document.querySelector('.js-portfolio')
        this.render()
        this.setNavigation()
        this.setPanel()
        this.setIntro()
        this.setKeyboard()
    }

    /**
     * Rendering
     */
    render()
    {
        const escape = (text) => `${text}`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const list = (items) => `<ul class="bullets">${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`
        const chips = (items) => `<ul class="chips">${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`

        const resumeLink = (label, extraClass = '') => /* html */`
            <a class="button is-primary ${extraClass}" href="${profile.resume}" download="${profile.resumeFileName}" aria-label="Download resume (PDF)">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14"/></svg>
                <span>${label}</span>
            </a>`

        const contactList = /* html */`
            <ul class="contact-list">
                <li><span class="label">Email</span><a href="mailto:${profile.email}">${profile.email}</a></li>
                <li><span class="label">Phone</span><a href="${profile.phoneHref}">${profile.phone}</a></li>
                <li><span class="label">LinkedIn</span><a href="${profile.linkedin}" target="_blank" rel="noopener">${profile.linkedinLabel}</a></li>
                <li><span class="label">Location</span><span>${profile.location}</span></li>
            </ul>`

        const contents = {
            home: /* html */`
                <p class="lead">${escape(profile.positioning)}</p>
                <p>${escape(profile.intro)}</p>
                <h3>Interested in</h3>
                ${chips(profile.interests)}
                <p class="note">${escape(profile.lookingFor)}</p>
                <div class="actions">${resumeLink('Download resume')}<button class="button js-goto" data-section="contact">Contact</button></div>`,

            experience: experience.map(item => /* html */`
                <article class="entry">
                    <header>
                        <h3>${escape(item.organisation)}</h3>
                        <p class="meta"><strong>${escape(item.role)}</strong><span>${escape(item.duration)}</span></p>
                    </header>
                    ${list(item.points)}
                </article>`).join(''),

            projects: projects.map(item => /* html */`
                <article class="entry">
                    <header>
                        <h3>${escape(item.name)}</h3>
                        <p class="meta"><span>${escape(item.tagline)}</span></p>
                    </header>
                    <dl class="facts">
                        <dt>Problem</dt><dd>${escape(item.problem)}</dd>
                        <dt>My contribution</dt><dd>${escape(item.contribution)}</dd>
                        <dt>Solution</dt><dd>${escape(item.solution)}</dd>
                        <dt>Achievement</dt><dd>${list(item.achievements)}</dd>
                    </dl>
                </article>`).join(''),

            education: /* html */`
                <article class="entry">
                    <header>
                        <h3>${escape(education.institution)}</h3>
                        <p class="meta"><strong>${escape(education.degree)}</strong><span>${escape(education.duration)} · ${escape(education.place)}</span></p>
                    </header>
                    <p class="score">CGPA <strong>${escape(education.cgpa)}</strong></p>
                    <h4>Relevant coursework</h4>
                    ${chips(education.coursework)}
                    <h4>${escape(education.extra.title)}</h4>
                    <p>${escape(education.extra.text)}</p>
                </article>
                <article class="entry">
                    <header><h3>Certifications</h3></header>
                    ${list(certifications)}
                </article>`,

            achievements: /* html */`
                <ul class="cards">
                    ${achievements.map(item => `<li><h4>${escape(item.title)}</h4><p>${escape(item.text)}</p></li>`).join('')}
                </ul>`,

            skills: skills.map(group => /* html */`
                <div class="skill-group">
                    <h4>${escape(group.category)}</h4>
                    ${chips(group.items)}
                </div>`).join(''),

            contact: /* html */`
                <p class="lead">Thanks for stopping by.</p>
                <p>If you're hiring for product, analytics, HR or operations roles, I'd be glad to talk. Feel free to reach out by email, phone or LinkedIn.</p>
                ${contactList}
                <div class="actions">
                    <a class="button is-primary" href="mailto:${profile.email}">Email me</a>
                    <a class="button" href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
                    ${resumeLink('Resume')}
                </div>`,
        }

        const titles = {
            home: `About ${profile.name.split(' ')[0]}`,
            experience: 'Experience',
            projects: 'Projects',
            education: 'Education & Certifications',
            achievements: 'Achievements',
            skills: 'Skills',
            contact: 'Let’s connect',
        }

        const interests = profile.interests.map(item => item.replace(' Management', '').replace(' & People Operations', '')).join(' · ')

        this.element.innerHTML = /* html */`
            <header class="portfolio-bar">
                <button class="brand js-goto" data-section="home" aria-label="About ${escape(profile.name)}">
                    <span class="brand-mark">AP</span>
                    <span class="brand-name">${escape(profile.name)}</span>
                </button>
                <nav class="portfolio-nav js-nav" aria-label="Portfolio sections">
                    ${sections.map(section => `<button class="js-goto" data-section="${section.id}">${section.label}</button>`).join('')}
                </nav>
                ${resumeLink('Resume', 'is-compact')}
            </header>

            <section class="portfolio-intro js-intro" aria-label="Introduction">
                <p class="eyebrow">Portfolio · ${escape(profile.location.replace(', Karnataka', ''))}</p>
                <h1>${escape(profile.name)}</h1>
                <p class="headline">${escape(profile.headline)}</p>
                <p class="interests">${escape(interests)}</p>
                <p class="summary">${escape(profile.positioning)} ${escape(profile.intro.split('. ')[0])}.</p>
                <ul class="highlights">
                    ${profile.highlights.map(item => `<li><strong>${escape(item.value)}</strong><span>${escape(item.label)}</span></li>`).join('')}
                </ul>
                <div class="actions">
                    <button class="button is-primary js-explore">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m0 0-6-6m6 6-6 6"/></svg>
                        <span class="js-explore-label">Explore portfolio</span>
                    </button>
                    ${resumeLink('Download resume')}
                </div>
                <p class="quick">
                    Jump to
                    ${sections.filter(section => section.id !== 'home').map(section => `<button class="js-goto" data-section="${section.id}">${section.label}</button>`).join('')}
                </p>
                <p class="contact-line">
                    <a href="mailto:${profile.email}">${profile.email}</a>
                    <a href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
                    <a href="${profile.phoneHref}">${profile.phone}</a>
                </p>
                <p class="drive-hint js-drive-hint"></p>
            </section>

            <aside class="portfolio-panel js-panel" aria-live="polite" hidden>
                <div class="panel-inner">
                    <header class="panel-header">
                        <h2 class="js-panel-title"></h2>
                        <button class="panel-close js-panel-close" aria-label="Close panel">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
                        </button>
                    </header>
                    <div class="panel-content js-panel-content"></div>
                    <footer class="panel-footer">
                        <button class="js-panel-previous">← <span></span></button>
                        <button class="js-panel-next"><span></span> →</button>
                    </footer>
                </div>
            </aside>
        `

        this.contents = contents
        this.titles = titles
    }

    /**
     * Navigation (bar, quick links and any element with .js-goto)
     */
    setNavigation()
    {
        this.element.addEventListener('click', (event) =>
        {
            // Any option clicked while the car exists => two short honks
            if(event.target.closest('button, a') && this.game?.player)
                this.game.player.honkTwice()

            const target = event.target.closest('.js-goto')

            if(target)
                this.open(target.dataset.section, { travel: true })
        })

        this.navButtons = [...this.element.querySelectorAll('.js-nav .js-goto')]
    }

    /**
     * Panel
     */
    setPanel()
    {
        this.panel = {}
        this.panel.element = this.element.querySelector('.js-panel')
        this.panel.title = this.element.querySelector('.js-panel-title')
        this.panel.content = this.element.querySelector('.js-panel-content')
        this.panel.previous = this.element.querySelector('.js-panel-previous')
        this.panel.next = this.element.querySelector('.js-panel-next')

        this.element.querySelector('.js-panel-close').addEventListener('click', () => this.close())
        this.panel.previous.addEventListener('click', () => this.step(-1))
        this.panel.next.addEventListener('click', () => this.step(1))

        // Keep scroll / touch inside the panels from reaching the 3D controls
        for(const element of [ this.panel.element, this.element.querySelector('.js-intro') ])
        {
            for(const type of [ 'wheel', 'pointerdown', 'touchstart', 'touchmove', 'mousedown' ])
                element.addEventListener(type, (event) => event.stopPropagation(), { passive: true })
        }
    }

    open(id, { travel = false } = {})
    {
        if(!this.contents[id])
            return

        this.hideIntro()

        this.current = id
        this.panel.title.textContent = this.titles[id]
        this.panel.content.innerHTML = this.contents[id]
        this.panel.content.scrollTop = 0
        this.panel.element.hidden = false
        requestAnimationFrame(() => this.panel.element.classList.add('is-open'))

        // Previous / next labels
        const index = sections.findIndex(section => section.id === id)
        const previous = sections[(index - 1 + sections.length) % sections.length]
        const next = sections[(index + 1) % sections.length]
        this.panel.previous.querySelector('span').textContent = previous.label
        this.panel.next.querySelector('span').textContent = next.label

        for(const button of this.navButtons)
            button.classList.toggle('is-active', button.dataset.section === id)

        // Drive the car to the matching area
        if(travel && this.game)
            this.travel(id)
    }

    step(direction)
    {
        const index = sections.findIndex(section => section.id === this.current)
        const next = sections[(index + direction + sections.length) % sections.length]
        this.open(next.id, { travel: true })
    }

    close()
    {
        this.current = null
        this.panel.element.classList.remove('is-open')
        this.panel.element.hidden = true

        for(const button of this.navButtons)
            button.classList.remove('is-active')

        // Without 3D, closing a panel brings the intro back
        if(!this.game)
            this.showIntro()
    }

    travel(id)
    {
        const section = sections.find(section => section.id === id)

        if(!section || this.travelling === section.respawn)
            return

        // Navigating counts as starting the experience; travel once the world is revealed
        if(!this.introStarted || !this.game.player)
        {
            this.pendingTravel = id
            this.wantsStart = true
            this.introStart?.()
            return
        }

        // Skip teleporting when the car is already close
        const respawn = this.game.respawns.getByName(section.respawn)
        if(respawn && Math.hypot(respawn.position.x - this.game.player.position.x, respawn.position.z - this.game.player.position.z) < 12)
            return

        this.travelling = section.respawn
        this.game.player.respawn(section.respawn, () =>
        {
            this.travelling = null
            this.game.view.focusPoint.isTracking = true
        })
    }

    /**
     * Intro card
     */
    setIntro()
    {
        this.intro = {}
        this.intro.element = this.element.querySelector('.js-intro')
        this.intro.exploreLabel = this.element.querySelector('.js-explore-label')
        this.intro.hint = this.element.querySelector('.js-drive-hint')

        this.element.querySelector('.js-explore').addEventListener('click', () =>
        {
            this.hideIntro()
            this.wantsStart = true

            if(this.introStart)
                this.introStart()
            else if(this.onStartGame)
                this.onStartGame()
        })
    }

    // Called by the game once its "click to start" intro is ready
    setIntroStart(callback)
    {
        this.introStart = callback

        if(this.wantsStart)
            callback()
    }

    // Called by the game when the visitor starts driving (button, click or keyboard)
    onIntroStarted()
    {
        this.wantsStart = true
        this.introStarted = true
        this.hideIntro()

        if(this.pendingTravel)
        {
            const id = this.pendingTravel
            this.pendingTravel = null

            // Wait for the reveal animation to finish before moving the car
            const waitForReveal = () =>
            {
                if(this.game.reveal?.step === 2)
                    setTimeout(() => this.travel(id), 600)
                else
                    setTimeout(waitForReveal, 200)
            }
            waitForReveal()
        }
    }

    setIntroMode(mode)
    {
        // 'loading': 3D is loading in the background, 'lite': 3D is optional (mobile / low power)
        if(mode === 'lite')
        {
            this.intro.exploreLabel.textContent = 'Drive through it in 3D'
            this.intro.hint.textContent = 'Lightweight mode: the 3D world loads only if you start it.'
        }
        else
        {
            this.intro.exploreLabel.textContent = 'Explore portfolio'
            this.intro.hint.textContent = 'Drive with WASD or arrow keys. Every building opens part of my story.'
        }
    }

    hideIntro()
    {
        this.intro.element.classList.add('is-hidden')
    }

    showIntro()
    {
        this.intro.element.classList.remove('is-hidden')
    }

    /**
     * Keyboard
     */
    setKeyboard()
    {
        window.addEventListener('keydown', (event) =>
        {
            if(event.key === 'Escape' && this.current)
            {
                event.stopImmediatePropagation()
                this.close()
            }
        }, { capture: true })
    }

    /**
     * Game bridge
     */
    setGame(game)
    {
        this.game = game
        this.element.classList.add('has-game')
    }
}
