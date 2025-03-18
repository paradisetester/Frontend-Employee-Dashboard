import React from 'react';

const NotificationsCard = ({ notifications }) => {
  return (
    <div className="bg-white shadow rounded p-4 h-full overflow-auto">
      <div className="drag-handle cursor-move mb-2 text-gray-700 font-bold">
        Notifications
      </div>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((n, index) => (
            <li key={index} className="border-b py-2">
              {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsCard;
