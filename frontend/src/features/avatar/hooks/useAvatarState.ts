import { useState } from "react";
import type { AvatarState } from "../types";

export const useAvatarState = () => {
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");

  const transitionTo = (state: AvatarState) => {
    setAvatarState(state);
  };

  return { avatarState, transitionTo };
};