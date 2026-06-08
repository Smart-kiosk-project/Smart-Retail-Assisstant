import { useState, useCallback, useRef } from 'react'

// Tell TypeScript these exist on window
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export const useVoiceInput = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      alert('Speech recognition not supported in this browser')
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      onResult(text)
    }

    recognition.onend = () => setIsListening(false)

    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }, [onResult])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  return { isListening, transcript, startListening, stopListening }
}