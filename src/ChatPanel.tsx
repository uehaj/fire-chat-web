import React, { useState } from 'react';

import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebase from 'firebase/app';

function ChatPage(props: any) {
  const [rooms, roomsLoading, roomsError] = useCollectionData<{
    name: string;
    id: string;
  }>(firebase.firestore().collection('rooms'), { idField: 'id' });
  const [currentRoomId, setCurrentRoomId] = useState<string>('room1');
  const [messages, messageLoading, messageError] = useCollectionData<{
    content: string;
    id: string;
  }>(
    firebase
      .firestore()
      .collection('rooms')
      .doc(currentRoomId)
      .collection('messages'),
    {
      idField: 'id',
    }
  );
  const [text, setText] = useState('');

  function sendMessage(message: string) {
    firebase
      .firestore()
      .collection('rooms')
      .doc(currentRoomId)
      .collection('messages')
      .add({ content: message });
  }

  return (
    <>
      <ul>
        {rooms?.map((room) => (
          <li
            key={room.id}
            onClick={() => {
              setText('');
              setCurrentRoomId(room.id);
            }}>
            {room.name}
          </li>
        ))}
      </ul>
      <ul style={{ border: 'solid 1px' }}>
        {messages?.map((message) => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
      <form
        onSubmit={(event) => {
          sendMessage(text);
          setText('');
          event.preventDefault();
        }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}></input>
        <button type="submit">send</button>
      </form>
    </>
  );
}

export default ChatPage;
