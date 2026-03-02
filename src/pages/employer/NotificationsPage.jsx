import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Loader2 } from 'lucide-react';
import EmptyState from '../../components/display/EmptyState';
import { notificationAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatRelativeTime } from '../../utils/formatDate';

const NotificationsPage = () => {
  const { success, error } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const params = { isRead: filter || undefined, limit: 50 };
      const response = await notificationAPI.getAll(params);
      setNotifications(response.data?.notifications || []);
    } catch (err) {
      error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      success('All notifications marked as read');
    } catch (err) {
      error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.delete(id);
      setNotifications(notifications.filter((n) => n._id !== id));
      success('Notification deleted');
    } catch (err) {
      error('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application_received':
        return <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Bell className="w-5 h-5 text-blue-600" /></div>;
      case 'shift_reminder':
        return <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><Bell className="w-5 h-5 text-green-600" /></div>;
      default:
        return <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Bell className="w-5 h-5 text-gray-600" /></div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B3D2E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your hiring activities</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
          >
            <option value="">All</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-[#0B3D2E] text-white rounded-lg hover:bg-[#0a3528] transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState
            title="No notifications"
            description="You'll receive notifications about applications, shifts, and more here."
            icon="bell"
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''
                }`}
              >
                {getIcon(notification.type)}
                <div className="flex-1">
                  <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatRelativeTime(notification.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
