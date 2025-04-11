import MessageBubble from './MessageBubble';

function MessageList({ messages, user, messagesEndRef }) {
  return (
    <div className="message-list">
      {messages.map((msg) => {
        const isOwnMessage = msg.user === user;
        return (
          <MessageBubble key={msg.id} msg={msg} isOwnMessage={isOwnMessage} />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
