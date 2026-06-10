import type { AvatarState } from "../types";

import baseImg from "../../../assets/avatar/01-base.png";
import idleImg from "../../../assets/avatar/02-idle.png";
import greetingImg from "../../../assets/avatar/03-greeting.png";
import listeningImg from "../../../assets/avatar/04-listening.png";
import thinkingImg from "../../../assets/avatar/05-thinking.png";
import talkingImg from "../../../assets/avatar/06-talking.png";
import goodbyeImg from "../../../assets/avatar/07-goodbye.png";

const avatarImages: Record<AvatarState, string> = {
  base: baseImg,
  idle: idleImg,
  greeting: greetingImg,
  listening: listeningImg,
  thinking: thinkingImg,
  talking: talkingImg,
  goodbye: goodbyeImg,
};

interface AvatarProps {
  state: AvatarState;
}

const Avatar = ({ state }: AvatarProps) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <img
        src={avatarImages[state]}
        alt={`BMO ${state}`}
        style={{ width: "250px", height: "250px", objectFit: "cover", borderRadius: "50%" }}
      />
    </div>
  );
};

export default Avatar;