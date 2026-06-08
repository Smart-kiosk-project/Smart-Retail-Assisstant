import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../features/avatar/components/Avatar'
import VoiceInput from '../features/avatar/components/VoiceInput'
import { useAvatarState } from '../features/avatar/hooks/useAvatarState'
import { useVoiceInput } from '../features/avatar/hooks/useVoiceInput'
import '../styles/avatar.css'

const BILLING_KEYWORDS = ['billing', 'bill', 'pay', 'payment', 'checkout', 'cart']

export default function AvatarPage() {
  const navigate = useNavigate()
  const { state, setIdle, setGreeting, setListening, setThinking, setTalking } =
    useAvatarState()
  const [message, setMessage] = useState('Hi! I am Priya. How can I help you today?')
  const [transcript, setTranscript] = useState('')

  useEffect(() => {
    setGreeting()
    const timer = setTimeout(() => setIdle(), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleUserSpeech = useCallback(
    (text: string) => {
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
          }, 3000)
        }
      }, 1500)
    },
    [navigate, setThinking, setTalking, setIdle]
  )

  const { isListening, startListening, stopListening } =
    useVoiceInput(handleUserSpeech)

  const handleMicClick = () => {
    setListening()
    setMessage('Listening...')
    setTranscript('')
    startListening()
  }

  return (
    <div className="avatar-page">

      {/* Header */}
      <div className="avatar-header">
        <div className="avatar-header-left">
          <div className="avatar-logo-box">✦</div>
          <div>
            <div className="avatar-header-title">Priya — AI Assistant</div>
            <div className="avatar-header-sub">Smart Retail Kiosk</div>
          </div>
        </div>
        <div className="avatar-header-right">
          <div className="avatar-status-pill">
            <span className="avatar-status-dot" />
            <span className="avatar-status-text">Online</span>
          </div>
          <span className="avatar-terminal-badge">Kiosk 01</span>
        </div>
      </div>

      {/* Body */}
      <div className="avatar-body">

        {/* Left — Avatar */}
        <div className="avatar-left-panel">
          <div className="avatar-wrapper">
            <Avatar state={state} />
            <div className="blink-overlay" />
          </div>
        </div>

        {/* Right — Controls */}
        <div className="avatar-right-panel">
          <div className="avatar-right-inner">

            {/* State indicator */}
            <span className="avatar-section-label">Assistant status</span>
            <div className="avatar-state-card">
              <span className="avatar-state-label">Current state</span>
              <span className="avatar-state-value">{state}</span>
            </div>

            <div className="avatar-divider" />

            {/* Chat area */}
            <span className="avatar-section-label">Response</span>
            <div className="avatar-chat-area">
              <div className="avatar-chat-bubble">
                <p>{message}</p>
              </div>
            </div>

            {/* Transcript */}
            <p className="avatar-transcript">{transcript}</p>

            <div className="avatar-divider" />

            {/* Voice input */}
            <span className="avatar-section-label">Voice input</span>
            <VoiceInput
              isListening={isListening}
              onStart={handleMicClick}
              onStop={stopListening}
            />

            {/* Footer */}
            <div className="avatar-footer-hint">
              🔒 Voice processed locally · Say "billing" to proceed
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}