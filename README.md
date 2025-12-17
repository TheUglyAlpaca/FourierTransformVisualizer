# Audio Spectrogram Visualizer

A tool for analyzing music through audio visualization. Upload audio files to view waveforms and frequency spectrograms, helping you understand the frequency composition and structure of your music.

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FourierTransformVisualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Understanding Audio Visualization

### What is a Fourier Transform?

A Fourier Transform is a mathematical operation that decomposes a signal from the **time domain** (how a signal changes over time) into the **frequency domain** (what frequencies are present in the signal). In audio analysis, this allows us to see which frequencies (pitches) are present in a sound at any given moment.

When you hear music, you're experiencing sound waves that vary over time. A Fourier Transform breaks down these complex waves into their component frequencies, revealing the fundamental tones, harmonics, and overtones that make up the sound.

### Waveform (Time Domain)

A **waveform** displays audio in the time domain. It shows the amplitude (loudness) of the audio signal as it changes over time. The horizontal axis represents time, and the vertical axis represents amplitude.

- **What you see**: The shape of the sound wave as it oscillates
- **What it tells you**: When sounds occur, their relative loudness, and the overall dynamics of the audio
- **Use case**: Understanding the rhythm, timing, and volume changes in your music

### Spectrogram (Frequency Domain)

A **spectrogram** displays audio in the frequency domain. It shows which frequencies are present at each moment in time. The horizontal axis represents time, the vertical axis represents frequency (pitch), and the color intensity represents the amplitude of each frequency.

- **What you see**: A heat map showing frequency content over time
- **What it tells you**: Which notes, harmonics, and frequencies are present at any given moment
- **Use case**: Analyzing the harmonic content, identifying instruments, detecting pitch changes, and understanding the spectral characteristics of your music

### Time Domain vs Frequency Domain

- **Time Domain (Waveform)**: Answers "What happens when?" - Shows the signal's amplitude over time
- **Frequency Domain (Spectrogram)**: Answers "What frequencies are present?" - Shows the frequency content over time

Together, these two visualizations provide a complete picture of your audio: the waveform shows the temporal dynamics, while the spectrogram reveals the spectral composition.

## Usage

1. Click "Upload Audio" to select an audio file
2. Use the playback controls to play, pause, and loop your audio
3. Adjust the zoom slider to examine fine details
4. Change the "Spectrogram Detail" setting to adjust the frequency resolution (higher values provide more detail but require more processing)
5. Observe both the waveform and spectrogram to understand both the temporal and frequency characteristics of your music
