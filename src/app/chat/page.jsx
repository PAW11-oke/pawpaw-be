"use client";
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

export default function ChatPage() {
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize Socket.IO connection
    useEffect(() => {
        socket = io({ path: "/api/socket" }); // Connect to Socket.IO server
        return () => {
            socket.disconnect(); // Disconnect when component unmounts
        };
    }, []);

    // Fetch groups on component mount
    useEffect(() => {
        setLoading(true);
        fetch('/api/chat/group')
            .then(res => res.json())
            .then(data => {
                setGroups(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch groups');
                setLoading(false);
                console.error(err);
            });
    }, []);

    // Listen for messages when joining a group
    useEffect(() => {
        if (selectedGroupId) {
            setLoading(true);
            fetch(`/api/chat/group/${selectedGroupId}/message`)
                .then(res => res.json())
                .then(data => {
                    setMessages(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Failed to fetch messages');
                    setLoading(false);
                    console.error(err);
                });

            // Join selected group and set up listener
            socket.emit('joinGroup', selectedGroupId);
            socket.on('newMessage', (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            return () => {
                socket.emit('leaveGroup', selectedGroupId);
                socket.off('newMessage');
            };
        }
    }, [selectedGroupId]);

    const handleGroupSelect = (groupId) => {
        setSelectedGroupId(groupId);
        setMessages([]);
        setError(null);
    };

    const handleMessageSend = async () => {
        if (messageContent.trim() && selectedGroupId) {
            const newMessage = {
                content: messageContent,
                groupId: selectedGroupId,
            };

            setLoading(true);
            try {
                const response = await fetch(`/api/chat/group/${selectedGroupId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newMessage),
                });

                if (response.ok) {
                    const savedMessage = await response.json();
                    setMessages((prevMessages) => [...prevMessages, savedMessage]);
                    setMessageContent('');
                    setError(null);

                    // Emit new message to the server
                    socket.emit('sendMessage', savedMessage);
                } else {
                    setError('Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                setError('An error occurred while sending the message');
            } finally {
                setLoading(false);
            }
        } else {
            setError('Message content cannot be empty or no group selected');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-6">
            <div className="group-selection flex gap-4 mb-4 overflow-x-auto">
                {loading && !groups.length ? (
                    <p className="text-gray-500">Loading groups...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    groups.map(group => (
                        <button
                            key={group._id}
                            onClick={() => handleGroupSelect(group._id)}
                            className={`group-button py-2 px-4 rounded ${
                                selectedGroupId === group._id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            } hover:bg-blue-400`}
                        >
                            {group.name}
                        </button>
                    ))
                )}
            </div>

            {selectedGroupId && (
                <div className="chatroom flex flex-col flex-grow bg-white rounded shadow-md p-4 mb-4">
                    <h2 className="text-xl font-semibold mb-4">Chatroom: {groups.find(group => group._id === selectedGroupId)?.name}</h2>
                    <div className="flex flex-col-reverse flex-grow overflow-y-auto border-t border-gray-300 pt-4">
                        {loading ? (
                            <p className="text-gray-500">Loading messages...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            messages.map((message) => (
                                <div key={message._id} className="message mb-2">
                                    <div className="bg-gray-200 p-3 rounded-lg max-w-xs mx-auto text-gray-800">
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {selectedGroupId && (
                <div className="message-input flex gap-2">
                    <input
                        type="text"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow p-3 border rounded-lg"
                    />
                    <button
                        onClick={handleMessageSend}
                        disabled={loading}
                        className={`py-3 px-6 rounded-lg ${
                            loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                        } text-white font-semibold`}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            )}
        </div>
    );
}
