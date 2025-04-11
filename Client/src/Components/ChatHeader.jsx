function ChatHeader({ user }) {
    return (
      <div className="chat-header">
        <div className="header-bar">
          <h2>Usuario: <strong>{user}</strong></h2>
        </div>
      </div>
    );
  }
  
  export default ChatHeader;
  