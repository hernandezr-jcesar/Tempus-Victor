import { Injectable } from '@angular/core';

interface AudioAsset {
  buffer: AudioBuffer;
  source: AudioBufferSourceNode | null; // Allow null for initialization
  playing: boolean;
  paused: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AudioOnceService {
  private context: AudioContext | null = null;
  private assets: { [soundName: string]: AudioAsset } = {};

  constructor() {}

  async loadSound(soundName: string, audioFilePath: string) {
    if (!this.context) {
      this.context = new AudioContext();
    }

    const response = await fetch(audioFilePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

    this.assets[soundName] = {
      buffer: audioBuffer,
      source: null,
      playing: false,
      paused: false,
    };
  }
  playSound(soundName: string) {
    // console.log('PLAYING');

    if (this.context && this.assets[soundName]) {
      const source = this.context.createBufferSource();
      if (this.assets[soundName].playing == false) {
        // Check if not already playing
        source.buffer = this.assets[soundName].buffer;
        source.connect(this.context.destination);

        // Handle potential errors during playback
        source.onended = () => {
          // console.log('Sound playback ended.');
        };

        source.addEventListener('error', (errorEvent: Event) => {
          if (errorEvent.currentTarget instanceof AudioBufferSourceNode) {
            const source = errorEvent.currentTarget as AudioBufferSourceNode;
            console.error('Error playing sound:', source.context.state); // Or other properties
          } else {
            console.error('Unexpected error type:', errorEvent);
          }
        });

        source.start();
        this.assets[soundName].source = source;
        this.assets[soundName].playing = true; // Mark as playing
      }
    }
  }

  pauseSound(soundName: string) {
    if (this.assets[soundName]?.source && this.assets[soundName].playing) {
      this.assets[soundName].source?.stop();
      this.assets[soundName].playing = false;
    }
  }
}
