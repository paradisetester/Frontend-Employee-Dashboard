// Menu.js
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRole, logout } from '../services/authService';

const Menu = ({ mobileMenuOpen, toggleMobileMenu }) => {
  const [role, setRole] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fetchedRole = getRole();
    setRole(fetchedRole);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    }, 200);
  };

  // Menu configuration
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
              { path: '/add-aboutus', label: 'About Us' },
              { path: '/add-home', label: 'Home Page' },
              { path: '/add-footer', label: 'Footer' },
            ],
          },
        ]
      : []),
  ];

  const activeGroupObj = menuGroups.find((group) => group.title === activeGroup);

  // Sidebar content shared between mobile and desktop
  const sidebarContent = (
    <>
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
      {!isCollapsed && (
        <h2 className="text-2xl font-semibold text-center mb-6">
          Dashboard Menu
        </h2>
      )}
      <div className="space-y-2 overflow-y-auto" style={{ height: 'calc(100% - 160px)' }}>
        {menuGroups.map((group, index) => (
          <div
            key={index}
            className="group-container"
            onMouseEnter={
              isCollapsed ? () => handleMouseEnter(group.title) : undefined
            }
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
                        className="block p-2 text-sm hover:bg-gray-700 rounded"
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
      <button
        onClick={handleLogout}
        className="w-full p-2 bg-red-600 hover:bg-red-700 rounded text-white mt-4 flex items-center justify-center transition-transform duration-200 transform hover:scale-105"
      >
        <i className="fas fa-sign-out-alt mr-2"></i>
        {!isCollapsed && <span>Logout</span>}
      </button>
    </>
  );

  // Define sidebar classes based on collapsed state
  const sidebarClass = `bg-gray-800 text-white p-4 fixed top-0 h-full transition-all duration-300 z-40 ${
    isCollapsed ? 'w-20' : 'w-64'
  }`;

  // For mobile: render as overlay with a backdrop when mobileMenuOpen is true
  if (windowWidth < 768) {
    return mobileMenuOpen ? (
      <div className="md:hidden">
        <div className={sidebarClass}>
          {/* Mobile close button */}
          <button
            onClick={toggleMobileMenu}
            className="mb-4 p-2 bg-gray-700 hover:bg-gray-600 rounded w-full flex items-center justify-center"
          >
            <i className="fas fa-times"></i>
          </button>
          {sidebarContent}
        </div>
        {/* Backdrop */}
        <div
          onClick={toggleMobileMenu}
          className="fixed inset-0 bg-black opacity-50 z-30"
        ></div>
      </div>
    ) : null;
  }

  // For desktop: render sidebar permanently
  return <div className={sidebarClass}>{sidebarContent}</div>;
};

export default Menu;
//test