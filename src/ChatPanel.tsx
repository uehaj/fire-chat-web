import React, { useState, useEffect } from 'react';

import { MessageList, Input, Button, ChatList } from 'react-chat-elements';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import 'react-chat-elements/dist/main.css';

import firebase from 'firebase/app';

type Text = {
  id: string;
  text: string;
  position: 'left' | 'right' | 'center';
  type: 'text';
  createdAt: any;
};

type Room = {
  name: string;
  id: string;
};

function ChatPage(props: any) {
  const [rooms] = useCollectionData<Room>(
    firebase.firestore().collection('rooms'),
    { idField: 'id' }
  );
  const [currentRoomId, setCurrentRoomId] = useState<string>('?');
  if (currentRoomId === '?' && rooms && rooms[0]) {
    setCurrentRoomId(rooms[0].id);
  }
  const [messages] = useCollectionData<Text>(
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
      .add({
        text: message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ border: '1px solid' }}>
          <ul>
            {rooms?.map((room) => (
              <li
                key={room.id}
                onClick={() => {
                  setCurrentRoomId(room.id);
                }}>
                {room.name}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ border: '1px solid' }}>
          <MessageList
            className="chat-list"
            toBottomHeight={'100%'}
            lockable={true}
            dataSource={messages
              ?.slice()
              .sort(
                (a, b) => a.createdAt.nanoseconds - b.createdAt.nanoseconds
              )}
          />
          <div style={{ display: 'flex' }}>
            <Input
              onChange={(e: any) => setText(e.target.value)}
              placeholder="Type here..."
            />
            <Button
              onClick={(e: any) => sendMessage(text)}
              text={'click me!'}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
