import type { AvatarState } from '../types'

import idleImg      from '../../../assets/avatar/02-idle.png'
import greetingImg  from '../../../assets/avatar/03-greeting.png'
import listeningImg from '../../../assets/avatar/04-listening.png'
import thinkingImg  from '../../../assets/avatar/05-thinking.png'
import talkingImg   from '../../../assets/avatar/06-talking.png'
import goodbyeImg   from '../../../assets/avatar/07-goodbye.png'
import baseImg      from '../../../assets/avatar/01-base.png'

interface AvatarProps {
  state: AvatarState
}

const STATE_IMAGES: Record<AvatarState, string> = {
  idle:      idleImg,
  greeting:  greetingImg,
  listening: listeningImg,
  thinking:  thinkingImg,
  talking:   talkingImg,
  goodbye:   goodbyeImg,
}

export default function Avatar({ state }: AvatarProps) {
  return (
    <div className="avatar-wrapper">
      <img
        src={STATE_IMAGES[state]}
        alt={`Avatar ${state}`}
        className={`avatar-image avatar-${state}`}
        onError={(e) => {
          const target = e.currentTarget
          if (target.src !== baseImg) {
            target.src = baseImg
          }
        }}
      />
      <div className="blink-overlay" />
    </div>
  )
}