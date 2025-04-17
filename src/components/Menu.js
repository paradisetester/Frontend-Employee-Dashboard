import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getRole, logout } from '../services/authService';

const Menu = () => {
  const [role, setRole] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchedRole = getRole();
    setRole(fetchedRole);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Timer-based handlers to keep flyout open
  const handleMouseEnter = (groupTitle) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActiveGroup(groupTitle);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setActiveGroup(null);
    }, 200); // Delay before closing the flyout
  };

  // Menu configuration with corrected icons
  const menuGroups = [
    {
      title: 'Blogs',
      icon: 'fas fa-newspaper',
      items: [
        { path: '/blogs', label: 'View Blogs' },
        ...(role === 'HR' || role === 'admin' || role === 'manager'
          ? [
              { path: '/add-blog', label: 'Add Blog' },
              { path: '/add-category', label: 'Add Category' },
              { path: '/test', label: 'Test' },
            ]
          : []),
      ],
    },
    {
      title: 'Leave Management',
      icon: 'fas fa-calendar-alt',
      items: [
        { path: '/apply-leave', label: 'Apply for Leave' },
        { path: '/leave-status', label: 'Leave Status' },
        ...(role === 'HR' || role === 'admin' || role === 'manager'
          ? [{ path: '/leave-list', label: 'View Leave Requests' }]
          : []),
      ],
    },
    {
      title: 'Profile',
      icon: 'fas fa-user',
      items: [{ path: '/update-profile', label: 'Update Profile' }],
    },
    {
      title: 'Friends & Chat',
      icon: 'fas fa-user-friends',
      items: [
        { path: '/send-request', label: 'Send Request' },
        { path: '/friend-requests', label: 'Friend Requests' },
        { path: '/friends', label: 'Friends' },
        { path: '/chat', label: 'Chat' },
      ],
    },
    {
      title: 'Projects & Tasks',
      icon: 'fas fa-tasks',
      items: [
        { path: '/project-list', label: 'Project List' },
        { path: '/my-tasks', label: 'My Tasks' },
        ...(role === 'HR' || role === 'admin' || role === 'manager'
          ? [{ path: '/task-list', label: 'Task List' }]
          : []),
      ],
    },
    {
      title: 'Chat Rooms',
      icon: 'fas fa-comments',
      items: [
        { path: '/chatroom-list', label: 'Chat Room List' },
        { path: '/create-room', label: 'Create Room' },
      ],
    },
    ...(role === 'HR' || role === 'admin' || role === 'manager'
      ? [
          {
            title: 'Employee Management',
            icon: 'fas fa-user-tie',
            items: [
              { path: '/add-employee', label: 'Add Employee' },
              { path: '/employee-list', label: 'View Employee List' },
            ],
          },
        ]
      : []),
    ...(role === 'HR' || role === 'admin' || role === 'manager'
      ? [
          {
            title: 'Page Management',
            icon: 'fas fa-file-alt',
            items: [
              { path: '/add-home', label: 'Home Page' },
              { path: '/add-aboutus', label: 'About Us' },
              { path: '/add-footer', label: 'Footer' },
              { path: '/entries', label: 'Contact Form Entries' },
            ],
          },
        ]
      : []),
  ];

  // Adjust main content margin based on menu state
  const mainContentMarginLeft = () => {
    if (!isCollapsed) return '16rem'; // expanded sidebar (w-64)
    if (isCollapsed && activeGroup) return '17rem'; // collapsed + flyout open
    return '5rem'; // collapsed with no flyout
  };

  // Utility function to check active link
  const isActiveLink = (path) => location.pathname === path;

  return (
    <div className="">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white p-4 fixed left-0 top-0 h-full transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } z-40`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => {
            if (!isCollapsed) setActiveGroup(null);
            setIsCollapsed(!isCollapsed);
          }}
          className="mb-4 p-2 bg-gray-700 hover:bg-gray-600 rounded w-full flex items-center justify-center"
          title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
          <i className={`fas fa-${isCollapsed ? 'arrow-right' : 'arrow-left'}`}></i>
        </button>

        {/* Dashboard Title (only in expanded mode) */}
        {!isCollapsed && (
          <h2 className="text-2xl font-semibold text-center mb-6">
            Dashboard Menu
          </h2>
        )}

        <div className="space-y-2 overflow-y-auto h-[calc(100%-160px)]">
          {menuGroups.map((group, index) => (
            <div
              key={index}
              className="group-container relative"
              onMouseEnter={isCollapsed ? () => handleMouseEnter(group.title) : undefined}
              onMouseLeave={isCollapsed ? handleMouseLeave : undefined}
              onClick={
                !isCollapsed
                  ? () =>
                      setActiveGroup(activeGroup === group.title ? null : group.title)
                  : () => {}
              }
            >
              <div
                className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer transition-transform duration-200 transform hover:scale-105"
                title={isCollapsed ? group.title : ''}
              >
                <i className={`${group.icon} w-5 mr-3 text-center`}></i>
                {!isCollapsed && <span>{group.title}</span>}
              </div>
              {/* Inline submenu for expanded mode */}
              {!isCollapsed && (
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    activeGroup === group.title ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul className="pl-8 py-1">
                    {group.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          to={item.path}
                          className={`block p-2 text-sm rounded hover:bg-gray-700 transition-colors ${
                            isActiveLink(item.path)
                              ? 'bg-blue-500 text-white'
                              : ''
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full p-2 bg-red-600 hover:bg-red-700 rounded text-white mt-4 flex items-center justify-center transition-transform duration-200 transform hover:scale-105"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Flyout Submenu for Collapsed Mode */}
      {isCollapsed && activeGroup && (
        <div
          className="bg-gray-800 text-white p-4 fixed top-0 left-20 h-full w-48 transition-all duration-300 z-50"
          onMouseEnter={() => handleMouseEnter(activeGroup)}
          onMouseLeave={handleMouseLeave}
        >
          <h2 className="text-lg font-semibold mb-4">{activeGroup}</h2>
          <ul>
            {menuGroups
              .find((group) => group.title === activeGroup)
              ?.items.map((item, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={item.path}
                    className={`block p-2 text-sm rounded hover:bg-gray-700 transition-colors ${
                      isActiveLink(item.path)
                        ? 'bg-blue-500 text-white'
                        : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300"
        style={{ marginLeft: mainContentMarginLeft() }}
      >
        {/* Layout content renders here */}
      </div>
    </div>
  );
};

export default Menu;
