# Audio Spectrogram Visualizer

A high-performance, interactive audio visualization tool built with **Vite**, **TypeScript**, and **WaveSurfer.js**. This application visualizes audio files as both a waveform and a frequency spectrogram, providing detailed insights into the audio's composition.

## Features

### 🎵 Audio Visualization
- **Waveform**: High-definition, continuous waveform rendering.
- **Spectrogram**: Detailed frequency analysis synchronized with playback.
- **Color Theme**: Vibrant **Yellow → Orange → Red → Purple** gradient theme for optimal visual contrast.

### 🎛 Controls
- **Playback**: Play, Pause, and Loop functionality.
- **Speed**: Adjustable playback rates (`0.5x`, `1x`, `2x`).
- **Zoom**: Interactive zoom slider to inspecting fine details.
- **Expand**: Toggle between a standard view and an expanded, full-height spectrogram view.
- **Volume**: Precision volume control with Mute toggle.

### ⚡ Synchronization
- **Auto Center**: The playback head stays centered while the audio scrolls, ensuring better tracking.
- **Sync Line**: A vertical indicator line connects the waveform and spectrogram for precise temporal alignment.

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Tech Stack
- **Vite**: Fast development build tool.
- **TypeScript**: Typed JavaScript for robust logic.
- **WaveSurfer.js**: Powerful audio visualization library.
- **CSS3**: Modern styling with specific focus on flexbox layouts and gradients.
