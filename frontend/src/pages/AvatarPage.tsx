import { useEffect } from "react";
import Avatar from "../features/avatar/components/Avatar";
import { useAvatarState } from "../features/avatar/hooks/useAvatarState";

const AvatarPage = () => {
  const { avatarState, transitionTo } = useAvatarState();

  useEffect(() => {
    transitionTo("idle");

    const greetTimer = setTimeout(() => transitionTo("greeting"), 2000);
    const listenTimer = setTimeout(() => transitionTo("listening"), 5000);
    const thinkTimer = setTimeout(() => transitionTo("thinking"), 8000);
    const talkTimer = setTimeout(() => transitionTo("talking"), 11000);

    return () => {
      clearTimeout(greetTimer);
      clearTimeout(listenTimer);
      clearTimeout(thinkTimer);
      clearTimeout(talkTimer);
    };
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#0a0a0a"
    }}>
      <p style={{
        color: "#00ff88",
        fontSize: "18px",
        marginBottom: "16px",
        letterSpacing: "2px",
        textTransform: "uppercase"
      }}>
        State: {avatarState}
      </p>
      <Avatar state={avatarState} />
    </div>
  );
};

export default AvatarPage;