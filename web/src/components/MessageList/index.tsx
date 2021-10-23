import styles from './styles.module.scss';
import logoImg from '../../assets/logo.svg';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import io from 'socket.io-client' 

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const messageQueue: Message[] = [];

const socket = io("http://localhost:4000")

socket.on('new_message', (new_message: Message) => {
  messageQueue.push(new_message)
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const  timer = setInterval(() => {
      if (messageQueue.length > 0) {
        setMessages(prevState => [
          messageQueue[0],
          messages[0],
          messages[1],
        ].filter(Boolean))
        messageQueue.shift()
      }
    }, 3000)
  }, [])

  useEffect(() => {
    api.get<Message[]>("messages/last3").then(response => {
      setMessages(response.data)
    })
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <embed src={logoImg} />
      <ul className={styles.messageList}>
        {messages.map(message => {
          return (
          <li key={message.id} className={styles.message}>
            <p className={styles.messageContent}>
              {message.text}
            </p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name}/>
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        )})}
        <li className={styles.message}>
          <p className={styles.messageContent}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum commodi explicabo iste quia autem obcaecati excepturi tempore, suscipit temporibus molestias accusantium eaque hic inventore ipsam sequi error debitis amet? Tempore?
          </p>
          <div className={styles.messageUser}>
            <div className={styles.userImage}>
              <img src="https://github.com/victorfelipeoliveirarosa.png" alt="Victor"/>
            </div>
            <span>Victor</span>
          </div>
        </li>
      </ul>
    </div>
  )
}
