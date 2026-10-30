import * as THREE from 'three/webgpu'
import { Game } from '../../Game.js'
import { color, float, Fn, luminance, max, mix, positionGeometry, step, texture, uniform, uv, vec4 } from 'three/tsl'
import gsap from 'gsap'
import { clamp } from 'three/src/math/MathUtils.js'
import { Area } from './Area.js'
import { InteractivePoints } from '../../InteractivePoints.js'
import { Portfolio } from '../../../Portfolio/Portfolio.js'

// Timeline stones, keyed by the slot names baked in the scene (ordered from first to latest)
const careerLabels = {
    careerHetic:           { title: 'CHRIST UNIVERSITY', subtitle: 'BBA DECISION SCIENCE', color: 'blue', size: [ 316, 60 ], length: 17, ongoing: true, laneX: 31.04 }, // June 2024 → June 2027, on its own lane
    careerFreelancer:      { title: 'TEACHERS BY CHOICE', subtitle: 'TUTOR', color: 'orange', size: [ 240, 60 ] },
    careerUzik:            { title: 'HAPPY FOLKS CLUB', subtitle: 'HR INTERN', color: 'orange', size: [ 168, 60 ] },
    careerIRLTeacher:      { title: 'COIL PROGRAMME', subtitle: 'BAYLOR UNIVERSITY, USA', color: 'green', size: [ 268, 92 ] },
    careerImmersiveGarden: { title: 'POP BY RAZORPAY', subtitle: 'HR INTERN', color: 'orange', size: [ 340, 60 ] },
    careerOnlineTeacher:   { title: 'MU SIGMA INC.', subtitle: 'BUSINESS ANALYTICS', color: 'purple', size: [ 332, 92 ] },
}

// Year shown on the counter for each unit driven along the timeline
const careerYears = [ [ 0, 2024 ], [ 3, 2025 ], [ 8, 2026 ], [ 15, 2027 ] ]

export class CareerArea extends Area
{
    constructor(references)
    {
        super(references)

        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: '💼 Career',
                expanded: false,
            })
        }

        this.setSounds()
        this.setLines()
        this.setYears()
        this.setInteractivePoint()
        this.setAchievement()
    }

    setSounds()
    {
        this.sounds = {}
        this.sounds.stoneOut = this.game.audio.register({
            path: 'sounds/stoneSlides/stoneSlideOut.mp3',
            autoplay: false,
            loop: false,
            volume: 0.3,
            antiSpam: 0.1,
            positions: new THREE.Vector3(),
            distanceFade: 14,
            onPlay: (item, line) =>
            {
                item.positions[0].copy(line.origin)
                item.rate = 1.2 + line.index * 0.1
            }
        })
        this.sounds.stoneIn = this.game.audio.register({
            path: 'sounds/stoneSlides/stoneSlideIn.mp3',
            autoplay: false,
            loop: false,
            volume: 0.2,
            rate: 0.8,
            antiSpam: 0.1,
            positions: new THREE.Vector3(),
            distanceFade: 14,
            onPlay: (item, line) =>
            {
                item.positions[0].copy(line.origin)
                // item.rate = 0.9 + Math.random() * 0.2
            }
        })
    }

    setLines()
    {
        this.lines = {}
        this.lines.items = []
        this.lines.activeElevation = 2.5
        this.lines.padding = 0.25
        
        const lineGroups = this.references.items.get('line')

        const colors = {
            blue: uniform(color('#5390ff')),
            orange: uniform(color('#ff8039')),
            purple: uniform(color('#b65fff')),
            green: uniform(color('#a2ffab'))
        }

        for(const group of lineGroups)
        {
            const line = {}
            line.group = group
            line.label = careerLabels[line.group.userData.texture]

            // Dedicated lane (no baked track there, so draw one)
            if(line.label?.laneX)
            {
                line.group.position.x = line.label.laneX
                this.addLaneTrack(line.group.position, line.label.length, line.label.color)
            }
            line.size = line.label?.length ?? parseFloat(line.group.userData.size)
            line.hasEnd = line.label?.ongoing ? false : line.group.userData.hasEnd
            line.color = line.label ? line.label.color : line.group.userData.color
            line.texture = this.createLabelTexture(line.label)

            line.stone = line.group.children.find(child => child.name.startsWith('stone'))
            line.stone.position.y = 0
            
            line.origin = line.group.position.clone()
            
            line.isIn = false
            line.isUp = false
            line.elevationTarget = 0
            line.offsetTarget = 0
            line.labelReveal = uniform(0)

            {
                line.textMesh = line.stone.children.find(child => child.name.startsWith('careerText'))

                const material = new THREE.MeshLambertNodeMaterial({ transparent: true })
                
                const baseColor = colors[line.color]

                material.outputNode = Fn(() =>
                {
                    const baseUv = uv().toVar()

                    step(baseUv.x, line.labelReveal).lessThan(0.5).discard()

                    const textureColor = texture(line.texture, baseUv)

                    const alpha = step(0.1, max(textureColor.r, textureColor.g))

                    const emissiveColor = baseColor.div(luminance(baseColor)).mul(1.7)

                    const maskColor = color('#251f2b')
                    const finalColor = mix(maskColor, emissiveColor, textureColor.r)
                    
                    return vec4(finalColor, alpha)
                })()

                // Mesh
                line.textMesh.castShadow = false
                line.textMesh.receiveShadow = false
                line.textMesh.material = material
            }

            this.lines.items.push(line)
        }

        this.lines.items.sort((a, b) => b.origin.z - a.origin.z)

        let i = 0
        for(const line of this.lines.items)
        {
            line.index = i++
        }

        // Debug
        if(this.game.debug.active)
        {
            this.game.debug.addThreeColorBinding(this.debugPanel, colors.blue.value, 'blue')
            this.game.debug.addThreeColorBinding(this.debugPanel, colors.orange.value, 'orange')
            this.game.debug.addThreeColorBinding(this.debugPanel, colors.purple.value, 'purple')
            this.game.debug.addThreeColorBinding(this.debugPanel, colors.green.value, 'green')
        }
    }

    // Same layout as the original baked textures: green = dark plate, red = glowing text, black = transparent
    createLabelTexture(label)
    {
        const scale = 4
        const [ width, height ] = label.size
        const canvas = document.createElement('canvas')
        canvas.width = width * scale
        canvas.height = height * scale
        const context = canvas.getContext('2d')
        const rowHeight = canvas.height / 2

        const drawRow = (text, row) =>
        {
            let fontSize = rowHeight * 0.92
            context.font = `900 ${fontSize}px Nunito, sans-serif`
            while(context.measureText(text).width > canvas.width * 0.96 && fontSize > 10)
            {
                fontSize -= 2
                context.font = `900 ${fontSize}px Nunito, sans-serif`
            }

            const textWidth = context.measureText(text).width
            const padding = rowHeight * 0.08
            context.fillStyle = '#00ff00'
            context.fillRect(0, row * rowHeight, Math.min(canvas.width, textWidth + padding * 2), rowHeight)
            context.fillStyle = '#ff0000'
            context.textBaseline = 'middle'
            context.fillText(text, padding, row * rowHeight + rowHeight * 0.54)
        }

        const draw = () =>
        {
            context.fillStyle = '#000000'
            context.fillRect(0, 0, canvas.width, canvas.height)
            drawRow(label.title, 0)
            drawRow(label.subtitle, 1)
        }
        draw()

        const texture = new THREE.CanvasTexture(canvas)
        texture.flipY = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.generateMipmaps = false
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping

        // Redraw once the web font is available
        document.fonts?.load('900 20px Nunito').then(() =>
        {
            draw()
            texture.needsUpdate = true
        })

        return texture
    }

    addLaneTrack(start, length, colorName)
    {
        const colors = { blue: '#5390ff', orange: '#ff8039', purple: '#b65fff', green: '#a2ffab' }
        const group = new THREE.Group()
        group.position.set(start.x, 0.03, start.z)

        // Dark base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.04, length + 0.5),
            new THREE.MeshBasicNodeMaterial({ color: '#251f2b' })
        )
        base.position.z = - length / 2
        group.add(base)

        // Glowing line
        const glow = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.05, length),
            new THREE.MeshBasicNodeMaterial({ color: new THREE.Color(colors[colorName]).multiplyScalar(2) })
        )
        glow.position.set(0, 0.01, - length / 2)
        group.add(glow)

        this.game.scene.add(group)
    }

    setInteractivePoint()
    {
        const respawn = this.game.respawns.getByName('career')
        const position = new THREE.Vector3(respawn.position.x - 3.5, 1, respawn.position.z + 1.5)

        this.interactivePoint = this.game.interactivePoints.create(
            position,
            'My experience',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                Portfolio.getInstance().open('experience')
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    setYears()
    {
        this.year = {}
        this.year.group = this.references.items.get('year')[0]
        this.year.originZ = this.year.group.position.z
        this.year.size = 17
        this.year.offsetTarget = 0
        this.year.start = careerYears[0][1]
        this.year.current = this.year.start

        //    Digit indexes
        //
        //      --- 0 ---
        //    |           |
        //    5           1
        //    |           |
        //      --- 6 --- 
        //    |           |
        //    4           2
        //    |           |
        //      --- 3 ---

        const a = 255

        const digitData = new Uint8Array([
            a, a, a, a, a, a, 0, // 0
            0, a, a, 0, 0, 0, 0, // 1
            a, a, 0, a, a, 0, a, // 2
            a, a, a, a, 0, 0, a, // 3
            0, a, a, 0, 0, a, a, // 4
            a, 0, a, a, 0, a, a, // 5
            a, 0, a, a, a, a, a, // 6
            a, a, a, 0, 0, 0, 0, // 7
            a, a, a, a, a, a, a, // 8
            a, a, a, a, 0, a, a, // 9
        ])

        this.year.digitsTexture = new THREE.DataTexture(
            digitData,
            7,
            10,
            THREE.RedFormat,
            THREE.UnsignedByteType,
            THREE.UVMapping,
            THREE.ClampToEdgeWrapping,
            THREE.ClampToEdgeWrapping,
            THREE.NearestFilter,
            THREE.NearestFilter
        )
        this.year.digitsTexture.generateMipmaps = false
        this.year.digitsTexture.needsUpdate = true

        this.year.digits = []

        const digitMeshes = this.year.group.children.filter(child => child.name.startsWith('digit'))

        for(const mesh of digitMeshes)
        {
            const digit = {}
            digit.mesh = mesh
            digit.indexUniform = uniform(0)
            
            const material = new THREE.MeshBasicNodeMaterial()
            material.outputNode = vec4(1.7)

            material.positionNode = Fn(() =>
            {
                const barUv = uv(1).toVar()

                const uvY = digit.indexUniform.div(10).add(float(0.5).div(10))
                barUv.y.assign(uvY)

                const barActive = texture(this.year.digitsTexture, barUv).r

                const newPosition = positionGeometry.toVar()
                newPosition.y.subAssign(barActive.oneMinus())

                return newPosition
            })()

            digit.mesh.material = material

            this.year.digits.push(digit)
        }

        this.year.updateDigits = (year = 2025) =>
        {
            const yearString = `${year}`
            let i = 0
            for(const digit of this.year.digits)
            {
                digit.indexUniform.value = parseInt(yearString[i])
                i++
            }
        }

        this.year.updateDigits(this.year.current)

        // // Test mesh
        // const mesh = new THREE.Mesh(
        //     new THREE.PlaneGeometry(2, 2),
        //     new THREE.MeshBasicMaterial({ map: this.year.digitsTexture, side: THREE.DoubleSide })
        // )
        // mesh.position.y = 4
        // mesh.position.z = -30
        // mesh.position.x = -10
        // this.game.scene.add(mesh)
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'career')
        })
    }

    update()
    {
        // Lines
        for(const line of this.lines.items)
        {
            const delta = line.origin.z - this.game.player.position.z

            // Is in
            if(delta > - this.lines.padding && delta < line.size + this.lines.padding * 2)
            {
                if(!line.isIn)
                {
                    line.isIn = true
                    gsap.to(line.labelReveal, { value: 1, duration: 1, delay: 0.3, overwrite: true, ease: 'power2.inOut' })
                }
            }

            // Is out
            else
            {
                if(line.isIn)
                {
                    line.isIn = false
                    gsap.to(line.labelReveal, { value: 0, duration: 1, overwrite: true, ease: 'power2.inOut' })
                }
            }

            // Elevation
            if(line.isIn)
            {
                if(!line.isUp)
                {
                    line.isUp = true
                    this.sounds.stoneOut.play(line)
                }
            }
            else
            {
                if(delta > line.size)
                {
                    if(line.hasEnd)
                    {
                        if(line.isUp)
                        {
                            line.isUp = false
                            gsap.delayedCall(0.3, () =>
                            {
                                this.sounds.stoneIn.play(line)
                            })
                        }
                    }
                }
                else
                {
                    if(line.isUp)
                    {
                        line.isUp = false
                        gsap.delayedCall(0.3, () =>
                        {
                            this.sounds.stoneIn.play(line)
                        })
                    }
                }
            }

            line.elevationTarget = line.isUp ? this.lines.activeElevation : 0
            line.stone.position.y += (line.elevationTarget - line.stone.position.y) * this.game.ticker.deltaScaled * 3

            // Position
            if(line.isIn)
            {
                if(line.stone.position.y > 1)
                    line.offsetTarget = - clamp(delta, 0, line.size)
            }
            else
            {
                // End
                if(delta > line.size)
                    line.offsetTarget = - line.size
                // Start
                else
                    line.offsetTarget = 0
            }

            line.stone.position.z += (line.offsetTarget - line.stone.position.z) * this.game.ticker.deltaScaled * 10
        }

        // Year
        const delta = this.year.originZ - this.game.player.position.z

        if(delta > this.year.size)
            this.year.offsetTarget = this.year.size
        else if(delta < 0)
            this.year.offsetTarget = 0
        else
            this.year.offsetTarget = delta

        const finalPositionZ = this.year.originZ - this.year.offsetTarget
        this.year.group.position.z += (finalPositionZ - this.year.group.position.z) * this.game.ticker.deltaScaled * 10

        let yearCurrent = careerYears[0][1]
        for(const [ offset, year ] of careerYears)
        {
            if(this.year.offsetTarget >= offset)
                yearCurrent = year
        }

        if(yearCurrent !== this.year.current)
        {
            this.year.current = yearCurrent
            this.year.updateDigits(this.year.current)
        }
    }
}