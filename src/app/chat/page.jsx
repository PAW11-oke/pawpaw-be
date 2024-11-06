"use client";

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

export default function ChatPage() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null); // Menyimpan grup yang dipilih
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Fetch grup saat pertama kali di-mount
    useEffect(() => {
        const fetchGroups = async () => {
            const response = await fetch('/api/chat/group');
            const data = await response.json();
            setGroups(data);
        };

        fetchGroups();
    }, []);

    // Koneksi ke socket.io server saat halaman di-mount
    useEffect(() => {
        socket = io(process.env.NEXTAUTH_URL); // Koneksi ke server Socket.IO

        socket.on('connect', () => {
            console.log('Connected to socket:', socket.id);
        });

        // Menerima pesan dari server
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Bersihkan socket saat komponen di-unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    // Pilih grup untuk bergabung
    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
        socket.emit('joinGroup', group._id); // Emit event untuk bergabung ke grup tertentu
    };

    // Mengirim pesan ke server
    const sendMessage = () => {
        if (!newMessage.trim()) return; // Cegah pesan kosong

        const messageData = {
            groupId: selectedGroup._id,
            content: newMessage,
            userId: 'userId', // Ganti dengan userId sebenarnya
            createdAt: new Date(),
        };

        socket.emit('sendMessage', messageData);
        setNewMessage(''); // Reset input setelah pesan terkirim
    };

    return (
        <div className="chat-page">
            {!selectedGroup ? (
                // Jika belum ada grup yang dipilih, tampilkan daftar grup
                <div className="group-selection">
                    <h2>Select a Group</h2>
                    <ul>
                        {groups.map((group) => (
                            <li key={group._id}>
                                <button onClick={() => handleGroupSelect(group)}>
                                    {group.groupName} ({group.petType})
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                // Jika sudah ada grup yang dipilih, tampilkan chat room
                <div className="chat-room">
                    <h2>Chatting in {selectedGroup.groupName}</h2>
                    <div className="messages-container" style={{ overflowY: 'scroll', height: '400px', border: '1px solid #ccc', marginBottom: '10px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                                <p><strong>User {msg.userId}: </strong>{msg.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="input-container">
                        <input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            style={{ marginRight: '10px', width: '70%' }}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}
