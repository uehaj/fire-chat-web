import React, { useState, useEffect, useRef } from 'react';

import {
  MessageList,
  Input,
  Button,
  ChatList,
  SideBar,
} from 'react-chat-elements';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import 'react-chat-elements/dist/main.css';

import firebase from 'firebase/app';

type Text = {
  id: string;
  text: string;
  position: 'left' | 'right' | 'center';
  type: 'text';
  date: Date;
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

  console.log(`rooms=${JSON.stringify(rooms)}`);
  const [currentRoomId, setCurrentRoomId] = useState<string>('?');
  if (currentRoomId === '?' && rooms && rooms[0]) {
    setCurrentRoomId(rooms[0].id);
  }
  const [fireStoreMessages] = useCollectionData(
    firebase
      .firestore()
      .collection('rooms')
      .doc(currentRoomId)
      .collection('messages'),
    {
      idField: 'id',
    }
  );

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

  const messages: Text[] | undefined = fireStoreMessages?.map((m: any) => {
    return {
      id: m.id,
      text: `${m.text}`,
      position: 'left',
      type: 'text',
      date: m.createdAt?.toDate(),
    };
  });

  const sortedMessages = messages?.sort((a, b) => {
    if (!a.date) {
      return 1;
    }
    if (!b.date) {
      return -1;
    }
    return a.date.getTime() - b.date.getTime();
  });

  const inputRef = useRef(null);

  return (
    <div className="container">
      <div className="chat-list">
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
      <div className="right-panel">
        <MessageList
          className="message-list"
          dataSource={sortedMessages}
          downButton={true}
          downButtonBadge={10}
        />
        <Input
          placeholder="Type here..."
          multiline={true}
          ref={inputRef}
          autofocus={true}
          rightButtons={
            <Button
              color="white"
              backgroundColor="black"
              text="Send"
              onClick={(e: any) => {
                sendMessage((inputRef.current as any).input.value);
                (inputRef.current as any).clear();
              }}
            />
          }
          onKeyPress={(e: any) => {
            if (e.shiftKey && e.charCode === 13) {
              return true;
            }
            if (e.charCode === 13) {
              sendMessage(e.target.value);
              e.target.value = '';
              e.preventDefault();
              return false;
            }
          }}
        />
      </div>
    </div>
  );
}

export default ChatPage;
