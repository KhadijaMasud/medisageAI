import { useState, useEffect, useCallback } from 'react';
import { isSpeechSynthesisSupported, findBestVoice } from '@/lib/speechUtils';

interface SpeechSynthesisOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

export function useSpeechSynthesis(options: SpeechSynthesisOptions = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  // Initialize speech synthesis and get available voices
  useEffect(() => {
    const supported = isSpeechSynthesisSupported();
    setSupported(supported);

    if (supported) {
      // Get voices
      const getVoicesList = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      // Some browsers load voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoicesList;
      }

      getVoicesList();

      // Clean up when component unmounts
      return () => {
        cancel();
      };
    }
  }, []);

  // Speak text
  const speak = useCallback(
    (text: string) => {
      if (!supported) return;

      // Cancel any ongoing speech
      cancel();

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Set utterance properties based on options
      const voice = options.voice || findBestVoice(options.lang || 'en-US');
      if (voice) utterance.voice = voice;
      
      if (options.rate !== undefined) utterance.rate = options.rate;
      if (options.pitch !== undefined) utterance.pitch = options.pitch;
      if (options.volume !== undefined) utterance.volume = options.volume;
      if (options.lang !== undefined) utterance.lang = options.lang;

      // Handle events
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      // Start speaking
      window.speechSynthesis.speak(utterance);
    },
    [supported, options]
  );

  // Cancel speech
  const cancel = useCallback(() => {
    if (supported) {
      setSpeaking(false);
      window.speechSynthesis.cancel();
    }
  }, [supported]);

  return {
    speak,
    cancel,
    speaking,
    supported,
    voices
  };
}
