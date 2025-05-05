interface SpeechWaveProps {
  isActive: boolean;
}

export default function SpeechWave({ isActive }: SpeechWaveProps) {
  return (
    <div className={`speech-wave mr-2 ${isActive ? '' : 'opacity-50'}`}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
