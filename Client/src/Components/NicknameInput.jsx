function NicknameInput({ user, setUser, setNicknameSet }) {
    return (
      <div className="nickname-input">
        <h2>Ingresa tu nombre:</h2>
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Tu nick"
        />
        <button onClick={() => user && setNicknameSet(true)}>Entrar</button>
      </div>
    );
  }
  
  export default NicknameInput;
  