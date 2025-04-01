import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import api from '../services/axios';
import EnhancedAnalyticsCard from './Home Page Cards/AnalyticsCard';
import NotificationsCard from './Home Page Cards/NotificationsCard';
import EmployeesCard from './Home Page Cards/EmployeesCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Static layout:
  // Analytics card on the left (8/12 columns) and 
  // Notifications and Employees cards stacked on the right (each 4/12 columns)
  const layout = [
    { i: 'analytics', x: 0, y: 0, w: 8, h: 13 },
    { i: 'notifications', x: 8, y: 0, w: 4, h: 3 },
    { i: 'employees', x: 8, y: 5, w: 4, h: 3 },
  ];

  // Fetch employees.
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.getEmployees();
        setEmployees(response);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch notifications and show welcome toast.
  useEffect(() => {
    toast.info('Welcome to the Employee Dashboard!');
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error('Error fetching notifications:', err));
  }, []);

  return (
    <div className="p-4">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        draggableHandle=".drag-handle"
      >
        <div key="analytics" className="p-2">
          <EnhancedAnalyticsCard />
        </div>
        <div key="notifications" className="p-2">
          <NotificationsCard notifications={notifications} />
        </div>
        <div key="employees" className="p-2">
          <EmployeesCard employees={employees} link="/some-link" />
        </div>
      </GridLayout>
      <ToastContainer />
    </div>
  );
};

export default EmployeeDashboard;
