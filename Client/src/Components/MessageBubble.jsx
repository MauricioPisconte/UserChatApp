function MessageBubble({ msg, isOwnMessage }) {
    return (
      <div className={`message-bubble ${isOwnMessage ? 'own' : 'other'}`}>
        <div className="message-user">{msg.user}</div>
        <div className="message-text">{msg.content}</div>
      </div>
    );
  }
  
  export default MessageBubble;
  