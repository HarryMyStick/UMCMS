import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { urlBackend } from '../global';

interface Message {
    name: string;
    text: string;
}

const Chat: React.FC<{ userId: string; role: string }> = ({ userId, role }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const newSocket = io(urlBackend);
        setSocket(newSocket);

        getUsername();
        getFacultyName();

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            if (roomName) {
                newSocket.emit('join', { room: roomName });
                console.log(`Joined room: ${roomName}`);
            }
            newSocket.on('messages', (messages: Message[]) => {
                setMessages(messages || []); // Assuming the server sends back an array of messages
                console.log(messages);
            });

            newSocket.on('typing', ({ name, isTyping }: { name: string; isTyping: boolean }) => {
                // Handle typing indicator here
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                    console.log('Disconnected from socket server');
                }
            };
        });
    }, [roomName]);

    const handleFetchMessage = () => {
        if (roomName && socket) {
            socket.emit('getAllMessages');
            socket.on('messages', (messages: Message[]) => {
                setMessages(messages || []);
                console.log(messages);
            });
        }
    }

    const handleJoinRoom = () => {
        if (socket) {
            console.log("called");
            socket.emit('join', { room: roomName });
            handleFetchMessage();
        }
    }
    const getFacultyName = async () => {
        try {

            const response = await fetch(`${urlBackend}/users/getFacultyByUserId/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRoomName(data.faculty_name);
                handleJoinRoom();
            } else {
                console.log("Error fetching faculty data.");
                return;
            }
        } catch (error) {
            console.error("Error fetching faculty data:", error);
        }
    };
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
                console.log("Error fetching faculty data.");
                return;
            }
        } catch (error) {
            console.error("Error fetching faculty data:", error);
        }
    };

    const toggleChat = (status: string) => {
        if (status === 'open') {
            handleFetchMessage();
            setOpen(true);
        } else {
            setOpen(false);
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
            {open ? (
                <div className="fixed bottom-8 right-8 w-96 h-96 bg-sky-500 border border-gray-500 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4 text-white">
                        {role === "Student" ? (
                            <h1 className="text-lg font-semibold">Chat with your Marketing Coordinator</h1>
                        ) : (
                            <h1 className="text-lg font-semibold">Chat with your Student</h1>
                        )}
                        <button onClick={() => toggleChat('close')} className="w-8 h-8 bg-white text-black rounded-full">X</button>
                    </div>
                    <div className="h-60 overflow-y-auto bg-white border border-gray-300 rounded-md mb-4 p-2">
                        {messages.map((message, index) => (
                            <div key={index}>
                                <strong>{message.name}: </strong>
                                <span>{message.text}</span>
                            </div>
                        ))}
                    </div>
                    {/* Input section */}
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
            ) : (
                <div className="fixed bottom-8 right-8">
                    <button onClick={() => toggleChat('open')} className="w-12 h-12 text-white rounded-full">
                        <svg
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="60px"
                            height="40px"
                            viewBox="0 0 122.88 86.411"
                            enable-background="new 0 0 122.88 86.411"
                        >
                            <g>
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M83.298,8.182h25.469c7.763,0,14.113,6.351,14.113,14.113v24.907c0,7.761-6.352,14.113-14.113,14.113H97.802c1.569,6.206,3.469,11.781,9.272,16.929c-11.098-2.838-19.664-8.576-25.952-16.929h-1.895c-0.737,0-1.509-0.058-2.303-0.168c4.193-3.396,7.106-7.659,7.106-12.275V38.493c0.926,0.644,2.051,1.021,3.264,1.021c3.164,0,5.73-2.566,5.73-5.729s-2.566-5.729-5.73-5.729c-1.213,0-2.338,0.377-3.264,1.02V13.535C84.031,11.683,83.774,9.888,83.298,8.182L83.298,8.182z M57.055,28.881c-3.201,0-5.796,2.596-5.796,5.796s2.596,5.796,5.796,5.796c3.2,0,5.796-2.596,5.796-5.796S60.255,28.881,57.055,28.881L57.055,28.881z M21.488,28.881c-3.201,0-5.796,2.596-5.796,5.796s2.596,5.796,5.796,5.796s5.796-2.596,5.796-5.796S24.689,28.881,21.488,28.881L21.488,28.881z M39.271,28.881c-3.201,0-5.796,2.596-5.796,5.796s2.595,5.796,5.796,5.796s5.796-2.596,5.796-5.796S42.472,28.881,39.271,28.881L39.271,28.881z M59,3.572H19.542c-8.785,0-15.971,7.187-15.971,15.971v28.184c0,8.783,7.188,15.971,15.971,15.971h12.407c-1.775,7.022-3.924,13.332-10.493,19.156c12.558-3.211,22.252-9.704,29.367-19.156h2.145c8.783,0,22.002-7.187,22.002-15.971V19.542C74.971,10.759,67.784,3.572,59,3.572L59,3.572z M19.542,0H59h0.005v0.014c5.386,0.002,10.27,2.193,13.8,5.724l-0.008,0.007c3.536,3.539,5.731,8.422,5.732,13.796h0.014v0.002h-0.014v28.184h0.014v0.003h-0.014c-0.002,5.746-3.994,10.752-9.312,14.248c-4.952,3.256-11.205,5.277-16.247,5.277v0.015h-0.002v-0.015h-0.404c-3.562,4.436-7.696,8.225-12.43,11.333c-5.235,3.438-11.157,6.028-17.799,7.727l-0.003-0.012c-1.25,0.315-2.628-0.06-3.541-1.091c-1.302-1.472-1.165-3.721,0.307-5.023c2.896-2.567,4.816-5.239,6.207-8.041c0.774-1.559,1.398-3.188,1.939-4.878h-7.702h-0.005v-0.015c-5.384-0.001-10.269-2.193-13.799-5.723c-3.531-3.531-5.724-8.417-5.725-13.804H0v-0.002h0.014V19.542H0v-0.005h0.014c0.015-5.279,2.126-10.076,5.541-13.59c0.062-0.073,0.127-0.145,0.196-0.214c3.531-3.531,8.417-5.724,13.804-5.725V0H19.542L19.542,0z M105.57,28.056c-3.163,0-5.729,2.566-5.729,5.729s2.566,5.729,5.729,5.729c3.164,0,5.73-2.566,5.73-5.729S108.734,28.056,105.57,28.056L105.57,28.056z"
                                />
                            </g>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};
export default Chat;