import { useState, useCallback } from 'react'
import type { AvatarState } from '../types'

export const useAvatarState = () => {
  const [state, setState] = useState<AvatarState>('idle')

  const setIdle = useCallback(() => setState('idle'), [])
  const setGreeting = useCallback(() => setState('greeting'), [])
  const setListening = useCallback(() => setState('listening'), [])
  const setThinking = useCallback(() => setState('thinking'), [])
  const setTalking = useCallback(() => setState('talking'), [])
  const setGoodbye = useCallback(() => setState('goodbye'), [])

  return {
    state,
    setIdle,
    setGreeting,
    setListening,
    setThinking,
    setTalking,
    setGoodbye,
  }
}