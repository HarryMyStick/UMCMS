import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { urlBackend } from '../global';

interface Message {
    name: string;
    text: string;
}

interface ChatProps {
    isOpen: boolean;
    onClose: () => void;
    contribution_id: string;
    userId: string;
    role: string;
}

const Chat: React.FC<ChatProps> = ({ isOpen, onClose, contribution_id, userId, role }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState('');
    const [articleTitle, setArticleTitle] = useState('');

    useEffect(() => {
        getUsername();
        getArticleTitle();
        const newSocket = io(urlBackend);
        setSocket(newSocket);
        console.log("set socket success");
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;
    
        const handleFetchMessageLoop = () => {
            if (isOpen && socket) {
                handleFetchMessage();
            }
        };
    
        if (isOpen) {
            handleJoinRoom();
            intervalId = setInterval(handleFetchMessageLoop, 2000);
        }
    
        return () => {
            if (intervalId) {
                clearInterval(intervalId); 
            }
        };
    }, [isOpen, socket]);

    const handleFetchMessage = () => {
        if (socket) {
            socket.emit('getAllMessages');
            socket.on('messages', (messages: Message[]) => {
                setMessages(messages || []);
                console.log(messages);
            });
        }else{
            console.log("missing");
        }
    }

    const handleJoinRoom = () => {
        if (socket) {
            socket.emit('join', { room: contribution_id });
            console.log("call join room");
            handleFetchMessage();
        }
    }

    const handleLeaveRoom = () => {
        if (socket) {
            socket.emit('leave', { room: contribution_id });
        }
    }

    const getUsername = async () => {
        try {
            const response = await fetch(`${urlBackend}/profile/getProfileByUserId/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.first_name + " " + data.last_name);
            } else {
                console.log("Error fetching profile data.");
                return;
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    const getArticleTitle = async () => {
        try {
            const response = await fetch(`${urlBackend}/contribution/getContributionByContributionId/${contribution_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                const data = await response.json();
                setArticleTitle(data.article_title);
            } else {
                console.log("Error fetching contribution data.");
                return;
            }
        } catch (error) {
            console.error("Error fetching contribution data:", error);
        }
    };

    const sendMessageToRoom = () => {
        if (!socket || !messageInput.trim()) return;
        socket.emit('createMessage', { name: username, text: messageInput });
        handleFetchMessage();
        setMessageInput('');
    };

    return (
        <div>
            {isOpen ? (
                <div className="fixed bottom-7 right-7 w-[25rem] h-[25rem] bg-gray-500 border border-gray-500 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4 text-white">
                        {role === "Student" ? (
                            <div>
                                <h1 className="text-lg font-semibold">Chat with your Marketing Coordinator</h1>
                                <h1 className="text-lg font-semibold">Room: {articleTitle}</h1>
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-lg font-semibold">Chat with your Student</h1>
                                <h1 className="text-lg font-semibold">Room: {articleTitle}</h1>
                            </div>
                        )}
                        <button onClick={() => {
                            onClose();
                            handleLeaveRoom();
                        }} className="w-8 h-8 bg-white text-black rounded-full">X</button>
                    </div>
                    <div className="h-60 overflow-y-auto bg-white border border-gray-300 rounded-md mb-4 p-2">
                        {messages.map((message, index) => (
                            <div key={index}>
                                <strong>{message.name}: </strong>
                                <span>{message.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Enter message"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            className="flex-grow px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        <button onClick={sendMessageToRoom} className="px-4 py-2 bg-white text-black rounded-md ml-2">Send</button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
export default Chat;