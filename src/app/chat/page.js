"use client";

import React, { useState } from 'react';
import GroupList from "@/components/chat/GroupList";
import ChatArea from '@/components/chat/ChatArea';
import { MessageCircle } from 'lucide-react';

const PetCareChat = () => {
    const [groups, setGroups] = useState([
        { _id: '1', name: 'Cats', image: '/api/placeholder/48/48', unread: 3 },
        { _id: '2', name: 'Dogs', image: '/api/placeholder/48/48', unread: 0 },
        { _id: '3', name: 'Birds', image: '/api/placeholder/48/48', unread: 1 },
        { _id: '4', name: 'Rabbits', image: '/api/placeholder/48/48', unread: 0 },
        { _id: '5', name: 'Hamsters', image: '/api/placeholder/48/48', unread: 2 },
    ]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(   null);
    const [loading, setLoading] = useState(false);

    const handleReply = (message) => {
        setReplyingTo(message);
        document.querySelector('input[type="text"]').focus();
    };

    const handleReaction = (messageId, emoji) => {
        setMessages(prev => prev.map(msg => {
        if (msg._id === messageId) {
            const reactions = msg.reactions || [];
            const existingReaction = reactions.find(r => r.emoji === emoji);
            if (existingReaction) {
            existingReaction.count += 1;
            return { ...msg, reactions };
            }
            return { ...msg, reactions: [...reactions, { emoji, count: 1 }] };
        }
        return msg;
        }));
    };

    const handleSendMessage = async () => {
        if (messageContent.trim() && selectedGroupId) {
        const newMessage = {
            _id: messages.length + 1,
            content: messageContent,
            sender: 'user',
            timestamp: new Date(),
            replyTo: replyingTo,
            reactions: []
        };
        setMessages(prev => [...prev, newMessage]);
        setMessageContent('');
        setReplyingTo(null);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
        <GroupList groups={groups} selectedGroupId={selectedGroupId} setSelectedGroupId={setSelectedGroupId} />
        {selectedGroupId ? (
            <ChatArea 
            selectedGroupId={selectedGroupId} 
            groups={groups} 
            messages={messages} 
            handleReply={handleReply} 
            handleReaction={handleReaction} 
            handleSendMessage={handleSendMessage}
            messageContent={messageContent}
            setMessageContent={setMessageContent}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            loading={loading}
            />
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600">
            <MessageCircle className="w-16 h-16" />
            <h2 className="ml-4 text-2xl font-semibold">Select a group to start chatting</h2>
            </div>
        )}
        </div>
    );
};

export default PetCareChat;
