import React from 'react';
import { Clock, Reply } from 'lucide-react';

const ChatMessage = ({ message, userId, onReply, onReaction }) => {
    const isOwnMessage = message.sender === userId;

    return (
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} mb-4`}>
            {message.replies.length > 0 && (
                <div className="mx-4 mb-1 text-sm text-gray-500 bg-gray-100 p-2 rounded">
                    {message.replies.map((replyId, index) => (
                        <div key={index}>
                            ↪ {replyId}
                        </div>
                    ))}
                </div>
            )}
            <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-lg ${isOwnMessage ? 'bg-blue-200 text-gray-800' : 'bg-white text-gray-800 border border-gray-300'}`}>
                    {message.content}
                </div>
                <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <button onClick={() => onReply(message)} className="text-gray-500 hover:text-blue-500">
                        <Reply className="w-3 h-3" />
                    </button>
                    <div className="flex space-x-1">
                        {message.reactions?.map((reaction, index) => (
                            <span key={index} className="text-xs bg-pink-100 px-2 py-1 rounded-full">
                                {reaction.emoji} {reaction.count}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;