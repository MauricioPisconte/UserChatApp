import { useEffect, useState } from 'react';
import { useMutation, useQuery, useSubscription, gql } from '@apollo/client';

const GET_MESSAGES = gql`
  query {
    messages {
      id
      user
      content
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation($user: String!, $content: String!) {
    sendMessage(user: $user, content: $content) {
      id
      user
      content
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription {
    messageAdded {
      id
      user
      content
    }
  }
`;

function Chat() {
  const [user, setUser] = useState('');
  const [content, setContent] = useState('');
  const [nicknameSet, setNicknameSet] = useState(false);
  const [messages, setMessages] = useState([]);

  const { data: queryData } = useQuery(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const { data: subData } = useSubscription(MESSAGE_SUBSCRIPTION);

  // Cargar mensajes iniciales
  useEffect(() => {
    if (queryData?.messages) {
      setMessages(queryData.messages);
    }
  }, [queryData]);

  // Mensaje para la suscripcion
  useEffect(() => {
    if (subData?.messageAdded) {
      setMessages((prev) => [...prev, subData.messageAdded]);
    }
  }, [subData]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await sendMessage({
      variables: { user, content },
    });
    setContent('');
  };

  if (!nicknameSet) {
    return (
      <div style={{ padding: '2rem' }}>
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

  return (
    //Estilo temporal, tengo que agregarle su real css xd
    <div style={{ padding: '2rem' }}>
      <h2>Chat como <strong>{user}</strong></h2>
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.user}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe un mensaje"
          style={{ width: '70%' }}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Chat;
