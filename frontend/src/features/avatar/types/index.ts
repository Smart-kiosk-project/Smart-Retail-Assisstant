export type AvatarState =
  | 'idle'
  | 'greeting'
  | 'listening'
  | 'thinking'
  | 'talking'
  | 'goodbye'

export interface AvatarImages {
  idle: string
  greeting: string
  listening: string
  thinking: string
  talking: string
  goodbye: string
}