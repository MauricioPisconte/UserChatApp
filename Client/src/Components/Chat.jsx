import { useEffect, useState, useRef } from 'react';
import { useMutation, useQuery, useSubscription, gql } from '@apollo/client';
import '../../Styles/Chat.css';
import NicknameInput from './NicknameInput';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';

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

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (queryData?.messages) {
      setMessages(queryData.messages);
    }
  }, [queryData]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!nicknameSet) {
    return (
      <NicknameInput
        user={user}
        setUser={setUser}
        setNicknameSet={setNicknameSet}
      />
    );
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <ChatHeader user={user} />
        <MessageList messages={messages} user={user} messagesEndRef={messagesEndRef} />
        <ChatInput content={content} setContent={setContent} handleSend={handleSend} />
      </div>
    </div>
  );
}

export default Chat;
