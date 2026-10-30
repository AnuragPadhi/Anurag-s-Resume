import { Portfolio } from './Portfolio/Portfolio.js'

// The portfolio content renders immediately; the 3D world is loaded on demand
let gameStarted = false

const startGame = async () =>
{
    if(gameStarted)
        return

    gameStarted = true
    document.documentElement.classList.remove('is-lite')
    document.documentElement.classList.add('is-loading-game')

    await import('./threejs-override.js')
    const { Game } = await import('./Game/Game.js')
    const game = new Game()
    portfolio.setGame(game)

    if(import.meta.env.VITE_GAME_PUBLIC)
    {
        window.game = game
        window.portfolio = portfolio
    }
}

// Full 3D on capable desktops, lightweight mode on phones, tablets and low-power devices
const isTouch = window.matchMedia('(pointer: coarse)').matches
const isSmall = window.innerWidth < 900
const saveData = navigator.connection?.saveData
const hasWebGL2 = (() =>
{
    try { return !!document.createElement('canvas').getContext('webgl2') }
    catch { return false }
})()
const forced = new URLSearchParams(window.location.search).get('mode')
const full3D = forced === '3d' || (forced !== 'lite' && !isTouch && !isSmall && !saveData && (hasWebGL2 || navigator.gpu))

// Set the mode before the first render so the layout doesn't animate in
if(!full3D)
    document.documentElement.classList.add('is-lite')

const portfolio = new Portfolio({ onStartGame: startGame })

if(full3D)
{
    portfolio.setIntroMode('loading')
    startGame()
}
else
{
    portfolio.setIntroMode('lite')
}
