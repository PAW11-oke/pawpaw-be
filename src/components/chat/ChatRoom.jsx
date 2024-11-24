    import React, { useState } from 'react';
    import ChatMessage from './ChatMessage';

    const ChatRoom = ({ selectedGroupId, groups, messages, handleReply, handleReaction, handleSendMessage, messageContent, setMessageContent, replyingTo, setReplyingTo, loading }) => (
        <div className="flex-1 flex flex-col bg-gray-50">
            <div className="p-4 bg-pink-100">
            <div className="flex items-center">
                <img
                src={groups.find(g => g._id === selectedGroupId)?.image}
                alt="Group"
                className="w-10 h-10 rounded-full"
                />
                <h3 className="ml-3 text-lg font-medium text-gray-800">
                {groups.find(g => g._id === selectedGroupId)?.name} Support
                </h3>
            </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
                <ChatMessage 
                key={message._id} 
                message={message}
                onReply={handleReply}
                onReaction={(emoji) => handleReaction(message._id, emoji)}
                />
            ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
            {replyingTo && (
                <div className="mb-2 p-2 bg-gray-100 rounded-lg flex justify-between items-center">
                <span className="text-sm text-gray-600">
                    Replying to: {replyingTo.content}
                </span>
                <button onClick={() => setReplyingTo(null)} className="text-gray-500 hover:text-gray-700">×</button>
                </div>
            )}
            <div className="flex space-x-4">
                <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                onClick={handleSendMessage}
                disabled={!messageContent.trim() || loading}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                {loading ? 'Sending...' : 'Send'}
                </button>
            </div>
            </div>
        </div>
    );

    export default ChatRoom;