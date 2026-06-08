import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../features/avatar/components/Avatar'
import VoiceInput from '../features/avatar/components/VoiceInput'
import ParticleBackground from '../features/avatar/components/ParticleBackground'
import { useAvatarState } from '../features/avatar/hooks/useAvatarState'
import { useVoiceInput } from '../features/avatar/hooks/useVoiceInput'
import '../styles/avatar.css'

const BILLING_KEYWORDS = ['billing', 'bill', 'pay', 'payment', 'checkout', 'cart']

export default function AvatarPage() {
  const navigate = useNavigate()
  const { state, setIdle, setGreeting, setListening, setThinking, setTalking } = useAvatarState()
  const [message, setMessage] = useState('Hi! I am Priya. How can I help you today?')
  const [transcript, setTranscript] = useState('')
  const [showTranscript, setShowTranscript] = useState(false)

  useEffect(() => {
    setGreeting()
    const timer = setTimeout(() => setIdle(), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleUserSpeech = useCallback(
    (text: string) => {
      setShowTranscript(true)
      setTranscript(`"${text}"`)
      setThinking()
      setMessage('Let me check that for you...')

      setTimeout(() => {
        const lower = text.toLowerCase()
        const wantsBilling = BILLING_KEYWORDS.some((k) => lower.includes(k))

        if (wantsBilling) {
          setTalking()
          setMessage('Sure! Taking you to the billing page.')
          setTimeout(() => navigate('/billing'), 2000)
        } else {
          setTalking()
          setMessage("I didn't quite get that. Try saying billing, payment or checkout.")
          setTimeout(() => {
            setIdle()
            setTranscript('')
            setShowTranscript(false)
          }, 3000)
        }
      }, 1500)
    },
    [navigate, setThinking, setTalking, setIdle]
  )

  const { isListening, startListening, stopListening } = useVoiceInput(handleUserSpeech)

  const handleMicClick = () => {
    setListening()
    setMessage('Listening...')
    setTranscript('')
    setShowTranscript(false)
    startListening()
  }

  return (
    <div className="kiosk-root">

      {/* Three.js background — layer 0 */}
      <ParticleBackground avatarState={state} />

      {/* Header — layer 1 */}
      <header className="kiosk-header">
        <div className="kiosk-header-left">
          <div className="kiosk-logo">✦</div>
          <div>
            <div className="kiosk-title">Priya — AI Assistant</div>
            <div className="kiosk-subtitle">Smart Retail Kiosk</div>
          </div>
        </div>
        <div className="kiosk-header-right">
          <div className="kiosk-status-pill">
            <span className="kiosk-status-dot" />
            <span className="kiosk-status-text">Online</span>
          </div>
          <span className="kiosk-badge">Kiosk 01</span>
        </div>
      </header>

      {/* Avatar — full screen center, layer 1 */}
      <div className="kiosk-avatar-area">
        <Avatar state={state} />
      </div>

      {/* Bottom overlay — layer 2 */}
      <div className="kiosk-overlay">

        {/* State chip */}
        <div className="kiosk-state-chip">
          <span className="kiosk-state-dot" data-state={state} />
          <span className="kiosk-state-label">{state}</span>
        </div>

        {/* Chat bubble */}
        <div className="kiosk-chat-bubble">
          <p className="kiosk-chat-text">{message}</p>
          {showTranscript && transcript && (
            <p className="kiosk-transcript">{transcript}</p>
          )}
        </div>

        {/* Mic button */}
        <VoiceInput
          isListening={isListening}
          onStart={handleMicClick}
          onStop={stopListening}
        />

        <p className="kiosk-footer-hint">🔒 Voice processed locally · Say "billing" to proceed</p>
      </div>
    </div>
  )
}