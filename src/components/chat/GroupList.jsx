import React, { useEffect } from 'react';

const GroupList = ({ groups, selectedGroupId, setSelectedGroupId }) => (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-pink-100">
            <h2 className="text-xl font-semibold text-gray-800">Community Chat</h2>
            <p className="text-gray-600 text-sm mt-2">Bergabunglah dengan komunitas pecinta hewan, berbagi pengalaman, dan dapatkan saran dari sesama pemilik.</p>
        </div>
        <div className="overflow-y-auto flex-1">
            {groups.map((group) => (
                <div
                    key={group._id}
                    onClick={() => setSelectedGroupId(group._id)}
                    className={`flex items-center p-4 cursor-pointer border-b border-gray-100 
                        ${selectedGroupId === group._id ? 'bg-pink-200 text-white' : 'text-gray-900'} 
                        hover:bg-pink-50 hover:text-gray-800`}
                >
                    <div className="relative">
                        <img src={group.image} alt={group.name} className="w-12 h-12 rounded-full object-cover" />
                        {group.unread > 0 && (
                            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {group.unread}
                            </span>
                        )}
                    </div>
                    <div className="ml-4 flex-1">
                        <h3 className={`text-sm font-medium ${selectedGroupId === group._id ? 'text-white' : 'text-gray-900'}`}>
                            {group.name}
                        </h3>
                        <p className={`text-xs ${selectedGroupId === group._id ? 'text-pink-100' : 'text-gray-500'}`}>Click to start chat</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default GroupList;