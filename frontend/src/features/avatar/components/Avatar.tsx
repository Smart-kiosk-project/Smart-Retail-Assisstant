import type { AvatarState } from '../types'

import idleImg from '../../../assets/avatar/02-idle.png'
import greetingImg from '../../../assets/avatar/03-greeting.png'
import listeningImg from '../../../assets/avatar/04-listening.png'
import thinkingImg from '../../../assets/avatar/05-thinking.png'
import talkingImg from '../../../assets/avatar/06-talking.png'
import goodbyeImg from '../../../assets/avatar/07-goodbye.png'

interface AvatarProps {
  state: AvatarState
}

const avatarImages: Record<AvatarState, string> = {
  idle: idleImg,
  greeting: greetingImg,
  listening: listeningImg,
  thinking: thinkingImg,
  talking: talkingImg,
  goodbye: goodbyeImg,
}

const Avatar = ({ state }: AvatarProps) => {
  return (
    <div className="avatar-wrapper">
      <img
        src={avatarImages[state]}
        alt="AI Assistant"
        className={`avatar-image avatar-${state}`}
      />
      <div className="blink-overlay" />
    </div>
  )
}

export default Avatar