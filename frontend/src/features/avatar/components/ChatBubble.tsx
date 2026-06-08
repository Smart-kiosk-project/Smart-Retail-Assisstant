interface ChatBubbleProps {
  message: string
  isVisible: boolean
}

const ChatBubble = ({ message, isVisible }: ChatBubbleProps) => {
  if (!isVisible || !message) return null

  return (
    <div className="chat-bubble">
      <p>{message}</p>
    </div>
  )
}

export default ChatBubble