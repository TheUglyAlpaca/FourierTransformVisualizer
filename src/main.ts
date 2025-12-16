import './style.css'
import WaveSurfer from 'wavesurfer.js'
import Spectrogram from 'wavesurfer.js/dist/plugins/spectrogram.js'

// --- Init & Configuration ---
let waveSurfer: WaveSurfer | null = null
const containerWaveform = '#waveform'
const containerSpectrogram = '#spectrogram'

// DOM Elements
const fileInput = document.getElementById('audio-upload') as HTMLInputElement
const playButton = document.getElementById('play-pause') as HTMLButtonElement
const volumeSlider = document.getElementById('volume') as HTMLInputElement
const fftSelect = document.getElementById('fft-size') as HTMLSelectElement
const zoomSlider = document.getElementById('zoom') as HTMLInputElement
const expandButton = document.getElementById('expand-btn') as HTMLButtonElement
const loadingContainer = document.getElementById('loading-container') as HTMLDivElement
const loadingBar = document.getElementById('loading-bar') as HTMLDivElement
const loopButton = document.getElementById('loop-btn') as HTMLButtonElement
const muteButton = document.getElementById('mute-btn') as HTMLButtonElement
const speedButtons = document.querySelectorAll('.speed-btn')

const iconPlay = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-play">
  <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
</svg>
`
const iconPause = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-pause">
  <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" />
</svg>
`
const iconVolume = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
</svg>
`
const iconMute = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" />
</svg>
`

// State
let currentFileUrl: string | null = null
let isLooping = false
let isMuted = false

// --- Functions ---

function initWaveSurfer(url: string, fftSamples: number) {
  // Destroy existing instance if any (to re-init with new Spectrogram settings)
  if (waveSurfer) {
    waveSurfer.destroy()
  }


  // Create Gradient
  const ctx = document.createElement('canvas').getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, 128)
  gradient.addColorStop(0, '#ffff00') // Yellow
  gradient.addColorStop(0.33, '#ff9800') // Orange
  gradient.addColorStop(0.66, '#f44336') // Red
  gradient.addColorStop(1, '#9c27b0') // Purple

  waveSurfer = WaveSurfer.create({
    container: containerWaveform,
    waveColor: '#4a4a4a', // Darker base color
    progressColor: gradient,
    url: url,
    height: 128,
    autoCenter: true,
    plugins: [
      Spectrogram.create({
        container: containerSpectrogram,
        labels: true,
        height: 256,
        fftSamples: fftSamples,
        labelsBackground: '#141414',
        labelsColor: '#c0c0c0',
      }),
    ],
  })

  // Show loading container
  loadingContainer.style.display = 'block'
  loadingBar.style.width = '0%'

  // Loading progress
  waveSurfer.on('loading', (percent: number) => {
    loadingBar.style.width = `${percent}%`
  })

  // 1. Waveform Ready
  waveSurfer.on('ready', () => {
    // Note: Spectrogram generation might still be happening.
    // However, WaveSurfer doesn't expose a clean "spectrogram-ready" event on the main instance easily
    // for all versions. But usually 'ready' means decoded.

    // We delay hiding the loading bar slightly to allow spectrogram to render if it's fast,
    // or we could listen to the plugin if we had a ref. 
    // Since Spectrogram is synchronous on the decoded buffer usually, it might block the UI.
    // To make the loading bar "feel" right for DFT, we'll fake a small delay or check connection.

    // Actually, in the current version, there isn't a specific async event for spectrogram calculation completion exposed globally.
    // But we can ensure the bar fills up.

    loadingBar.style.width = '100%'

    setTimeout(() => {
      loadingContainer.style.display = 'none'
    }, 500) // Increased delay to cover typical small file DFT time

    playButton.disabled = false
    loopButton.disabled = false
    playButton.innerHTML = iconPlay

    // Reset Zoom to default (50) and apply it
    zoomSlider.value = '50'
    const minPx = 20
    const maxPx = 200
    // 50% of the range
    const zoomLevel = minPx + (maxPx - minPx) * 0.5
    waveSurfer?.zoom(zoomLevel)
  })

  waveSurfer.on('finish', () => {
    if (isLooping && waveSurfer) {
      waveSurfer.play()
    } else {
      playButton.innerHTML = iconPlay
    }
  })

  // Set initial volume
  waveSurfer?.setVolume(parseFloat(volumeSlider.value))

  // Event Listeners
  // (Ready listener moved up)

  waveSurfer.on('play', () => {
    playButton.innerHTML = iconPause
  })

  waveSurfer.on('pause', () => {
    playButton.innerHTML = iconPlay
  })

  // (Finish listener moved up)
}

// --- User Interactions ---

// File Upload
fileInput.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    currentFileUrl = URL.createObjectURL(file)
    const fftSamples = parseInt(fftSelect.value)

    playButton.disabled = true
    loopButton.disabled = true
    // Keep the icon as play or show a loading state if desired, but button is disabled
    playButton.innerHTML = iconPlay

    initWaveSurfer(currentFileUrl, fftSamples)
  }
})

// Play/Pause
playButton.addEventListener('click', () => {
  if (!waveSurfer) return

  if (waveSurfer.isPlaying()) {
    waveSurfer.pause()
  } else {
    waveSurfer.play()
  }
})

// Volume Control
volumeSlider.addEventListener('input', (e) => {
  if (!waveSurfer) return
  const target = e.target as HTMLInputElement
  const value = parseFloat(target.value)
  waveSurfer.setVolume(value)
  if (value === 0) {
    isMuted = true
    muteButton.classList.add('active')
    muteButton.innerHTML = iconMute
  } else {
    isMuted = false
    muteButton.classList.remove('active')
    muteButton.innerHTML = iconVolume
  }
})

// Mute Control
muteButton.addEventListener('click', () => {
  if (!waveSurfer) return
  isMuted = !isMuted
  waveSurfer.setMuted(isMuted)
  if (isMuted) {
    muteButton.classList.add('active')
    muteButton.innerHTML = iconMute
  } else {
    muteButton.classList.remove('active')
    muteButton.innerHTML = iconVolume
  }
})

// Loop Control
loopButton.addEventListener('click', () => {
  isLooping = !isLooping
  if (isLooping) {
    loopButton.classList.add('active')
  } else {
    loopButton.classList.remove('active')
  }
  // WaveSurfer doesn't natively expose loop property easily on the instance without backend config,
  // but we are using the 'finish' event listener to handle loop manually.
})

// Speed Control
speedButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (!waveSurfer) return
    const target = e.target as HTMLButtonElement
    const speed = parseFloat(target.dataset.speed || '1')

    waveSurfer.setPlaybackRate(speed)

    // Update active class
    speedButtons.forEach(b => b.classList.remove('active'))
    target.classList.add('active')
  })
})

// FFT Size Control
fftSelect.addEventListener('change', (e) => {
  if (!currentFileUrl) return

  // We need to re-initialize WaveSurfer to change spectrogram FFT size
  // Note: WaveSurfer spectrogram plugin doesn't support dynamic update of fftSamples without re-init currently
  const target = e.target as HTMLSelectElement
  const fftSamples = parseInt(target.value)

  // Save current playback state
  const wasPlaying = waveSurfer?.isPlaying() ?? false
  const currentTime = waveSurfer?.getCurrentTime() ?? 0

  initWaveSurfer(currentFileUrl, fftSamples)

  // Restore state once ready
  if (waveSurfer) {
    waveSurfer.once('ready', () => {
      waveSurfer?.setTime(currentTime)
      if (wasPlaying) {
        waveSurfer?.play()
      }
    })
  }
})

// Zoom Control
zoomSlider.addEventListener('input', (e) => {
  if (!waveSurfer) return
  const target = e.target as HTMLInputElement
  const value = parseInt(target.value)
  // Min pxPerSec = 20 (default roughly), Max = 1000?
  // Let's map 0-100 to minPxPerSec
  const minPx = 20
  const maxPx = 200
  const zoomLevel = minPx + (maxPx - minPx) * (value / 100)

  waveSurfer.zoom(zoomLevel)
})

// Expand Spectrogram
expandButton.addEventListener('click', () => {
  const container = document.querySelector('.visualizer-container')
  container?.classList.toggle('spectrogram-expanded')
  const isExpanded = container?.classList.contains('spectrogram-expanded') ?? false

  if (isExpanded) {
    expandButton.textContent = 'Collapse'
  } else {
    expandButton.textContent = 'Expand'
  }

  // Force resize internal elements
  const spectrogramEl = document.getElementById('spectrogram')
  if (spectrogramEl) {
    // 1. Try to access Shadow Root if present
    const root = spectrogramEl.shadowRoot || spectrogramEl

    // 2. Find internal wrapper and canvas
    // WaveSurfer Spectrogram usually creates a wrapper div and a canvas inside
    const children = root.querySelectorAll('div, canvas')
    children.forEach(child => {
      const el = child as HTMLElement
      if (isExpanded) {
        el.style.height = '100%'
        el.style.width = '100%'
      } else {
        // Remove inline styles to revert to defaults (or CSS)
        el.style.height = ''
        el.style.width = ''
      }
    })
  }
})
