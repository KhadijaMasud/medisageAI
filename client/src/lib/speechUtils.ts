// Utility functions for speech recognition and synthesis

export function isSpeechRecognitionSupported(): boolean {
  return (
    'SpeechRecognition' in window ||
    'webkitSpeechRecognition' in window
  );
}

export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

export function getVoices(): SpeechSynthesisVoice[] {
  return window.speechSynthesis.getVoices();
}

export function findBestVoice(preferredLanguage: string = 'en-US'): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;
  
  const voices = getVoices();
  
  // Try to find a voice that matches the preferred language
  let voice = voices.find(v => v.lang === preferredLanguage && v.localService);
  
  // If no match with localService, try any voice with preferred language
  if (!voice) {
    voice = voices.find(v => v.lang === preferredLanguage);
  }
  
  // If still no match, try a voice that starts with the language code
  if (!voice) {
    voice = voices.find(v => v.lang.startsWith(preferredLanguage.split('-')[0]));
  }
  
  // Fallback to the first available voice
  if (!voice && voices.length > 0) {
    voice = voices[0];
  }
  
  return voice || null;
}

// Extract key information from medical text
export function extractKeyPoints(text: string): string[] {
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
  const keyPoints: string[] = [];
  
  // Look for sentences that might contain key information
  const keywordPatterns = [
    /\b(important|critical|essential|key|vital|significant)\b/i,
    /\b(symptom|sign|indication|treatment|therapy|medication|dosage|warning|caution)\b/i,
    /\b(recommend|advise|suggest)\b/i,
    /\b(should|must|need to|have to)\b/i,
  ];
  
  for (const sentence of sentences) {
    for (const pattern of keywordPatterns) {
      if (pattern.test(sentence)) {
        keyPoints.push(sentence.trim() + '.');
        break;
      }
    }
  }
  
  return keyPoints.length > 0 ? keyPoints : [text.trim()];
}
