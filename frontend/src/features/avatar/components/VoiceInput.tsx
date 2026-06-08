interface VoiceInputProps {
  isListening: boolean
  onStart: () => void
  onStop: () => void
}

const VoiceInput = ({ isListening, onStart, onStop }: VoiceInputProps) => {
  return (
    <div className="voice-input-wrapper">
      <button
        className={`mic-button ${isListening ? 'mic-active' : ''}`}
        onClick={isListening ? onStop : onStart}
      >
        <span className="mic-icon">{isListening ? '🔴' : '🎤'}</span>
        <span className="mic-label">
          {isListening ? 'Listening...' : 'Tap to speak'}
        </span>
      </button>
      {isListening && (
        <div className="listening-waves">
          <span /><span /><span /><span /><span />
        </div>
      )}
    </div>
  )
}

export default VoiceInput