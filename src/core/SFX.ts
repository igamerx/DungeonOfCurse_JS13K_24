export class SoundPlayer {
    private audioContext: AudioContext | null = null;
    private volumeNode: GainNode | null = null;

    // Initialize the AudioContext
    private getAudioContext(): AudioContext {
        if (this.audioContext === null) {
            this.audioContext = new AudioContext();
            this.volumeNode = this.audioContext.createGain(); // Create a GainNode
            this.volumeNode.connect(this.audioContext.destination); // Connect it to the audio context's destination
        }
        return this.audioContext;
    }

    // Set the volume level
    public setVolume(volume: number): void {
        const context = this.getAudioContext();
        if (this.volumeNode) {
            this.volumeNode.gain.value = Math.max(0, Math.min(volume, 1)); // Clamp volume between 0 and 1
        }
    }

    // Create and play a sound from the provided sample function
    public playSound(sampleFunction: (i: number) => number): void {
        try {
            const context = this.getAudioContext();
            const sampleRate = context.sampleRate;
            const length = 96000; // 2 seconds of audio
            const buffer = context.createBuffer(1, length, sampleRate);
            const data = buffer.getChannelData(0);

            // Fill the buffer with the sample data
            for (let i = 0; i < length; i++) {
                data[i] = sampleFunction(i);
            }

            // Create and configure the buffer source
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.volumeNode || context.destination); // Connect to volume node
            source.start();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
}

  export const audioFX = new SoundPlayer();