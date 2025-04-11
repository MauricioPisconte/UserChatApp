function ChatInput({ content, setContent, handleSend }) {
    return (
      <form onSubmit={handleSend}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe un mensaje"
          className="chat-input"
        />
        <button type="submit">Enviar</button>
      </form>
    );
  }
  
  export default ChatInput;
  