import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import EnhancedAnalyticsCard from './Home Page Cards/AnalyticsCard';
import NotificationsCard from './Home Page Cards/NotificationsCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeDashboard = () => {
  // Initial grid layout: two cards side by side.
  const [layout, setLayout] = useState([
    { i: 'analytics', x: 0, y: 0, w: 6, h: 8 },
    { i: 'notifications', x: 6, y: 0, w: 6, h: 8 }
  ]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Example: show a toast notification on page load
    toast.info('Welcome to the Employee Dashboard!');

    // Fetch notifications from your backend API (modify endpoint as needed)
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));
  }, []);

  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
    // Optionally: persist the new layout in localStorage or backend
  };

  return (
    <div className="p-4">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle" // optional: restrict drag handle
      >
        <div key="analytics" className="p-2">
          <EnhancedAnalyticsCard />
        </div>
        <div key="notifications" className="p-2">
          <NotificationsCard notifications={notifications} />
        </div>
      </GridLayout>
      {/* Toast container to render react-toastify notifications */}
      <ToastContainer />
    </div>
  );
};

export default EmployeeDashboard;
