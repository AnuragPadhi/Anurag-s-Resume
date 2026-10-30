import * as THREE from 'three/webgpu'
import { abs, color, float, mix, pow, smoothstep, uniform, uv, vec4 } from 'three/tsl'
import gsap from 'gsap'
import { Game } from '../Game.js'

// Headlight effect: an additive pool of light on the ground in front of the car (no model change).
// Turns on automatically at night and can be toggled (N key or the on-screen button).
export class Headlights
{
    constructor(chassis)
    {
        this.game = Game.getInstance()
        this.chassis = chassis
        this.active = false
        this.intensity = uniform(0)

        this.setMesh()
        this.setNight()
        this.setInputs()
        this.setButton()
    }

    setMesh()
    {
        // Plane lying on the ground, extending forward (+x is the front of the chassis)
        const length = 6.5
        const width = 3.8
        const geometry = new THREE.PlaneGeometry(length, width)
        geometry.rotateX(- Math.PI * 0.5)

        const material = new THREE.MeshBasicNodeMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        })

        const distance = uv().x
        const side = abs(uv().y.sub(0.5))
        const halfWidth = mix(float(0.12), float(0.5), distance)
        const cone = smoothstep(halfWidth.sub(0.12), halfWidth, side).oneMinus() // edge0 < edge1 (reversed smoothstep is undefined on WebGPU)
        const falloff = pow(distance.oneMinus().max(0), 1.6).mul(smoothstep(0, 0.06, distance))
        const strength = cone.mul(falloff).mul(this.intensity)

        material.outputNode = vec4(color('#ffe9b8').mul(strength).mul(1.4), strength)

        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(1.2 + length / 2, - 0.86, 0)
        this.mesh.renderOrder = 1
        this.mesh.frustumCulled = false
        this.chassis.add(this.mesh)
    }

    setNight()
    {
        const night = this.game.dayCycles.intervalEvents.get('night')

        if(night)
            this.set(night.inInterval, false)

        // Automatic: switch with the day cycle (a manual toggle holds until the next change)
        this.game.dayCycles.events.on('night', (inInterval) =>
        {
            this.set(inInterval)
        })
    }

    setInputs()
    {
        this.game.inputs.addActions([
            { name: 'headlights', categories: [ 'wandering', 'racing', 'cinematic' ], keys: [ 'Keyboard.KeyN' ] },
        ])

        this.game.inputs.events.on('headlights', (action) =>
        {
            if(action.active)
                this.toggle()
        })
    }

    setButton()
    {
        this.button = document.querySelector('.js-headlights-trigger')

        if(!this.button)
            return

        this.button.addEventListener('click', (event) =>
        {
            event.preventDefault()
            this.toggle()
        })

        this.button.classList.toggle('is-active', this.active)
    }

    toggle()
    {
        this.set(!this.active)
    }

    set(active, animate = true)
    {
        this.active = active
        gsap.to(this.intensity, { value: active ? 1 : 0, duration: animate ? 0.35 : 0, overwrite: true })
        this.button?.classList.toggle('is-active', active)
    }
}
