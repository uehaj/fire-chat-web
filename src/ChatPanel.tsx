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

  return (
    <>
      <ul>
        {rooms?.map((room) => (
          <li key={room.id} onClick={() => setCurrentRoomId(room.id)}>
            {room.name}
          </li>
        ))}
      </ul>
      <ul>
        {messages?.map((message) => (
          <li>{message.content}</li>
        ))}
      </ul>
    </>
  );
}

export default ChatPage;
