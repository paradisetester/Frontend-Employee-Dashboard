// Layout.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Menu from './Menu';
import { EmployeeProvider } from './context/EmployeeContext';
import { ThemeProvider } from './context/ThemeContext';
// Import your page components
import AddBlogPage from './Blogs/Blog';
import BlogsList from './Blogs/BlogList';
import CategoriesPage from './Blogs/Category/CategoriesPage';
import ApplyLeave from './Leaves/ApplyLeave';
import LeaveRequests from './Leaves/LeaveRequests';
import LeaveStatusPage from './Leaves/LeaveStatus';
import UpdateProfile from './Employee/UpdateProfile';
import AddFriendList from './Friend Requests/SendFriendRequest';
import FriendRequests from './Friend Requests/FriendRequestList';
import ProjectList from './Projects/ProjectList';
import MyTasks from './Tasks/MyTasks';
import TaskList from './Tasks/TaskList';
import CreateRoom from './Chat/CreateRoom';
import AddEmployee from './Employee/AddEmployee';
import EmployeeList from './Employee/EmployeeList';
import AboutUsForm from './Pages/About Us/AboutUs';
import FooterForm from './Pages/Header and Footer/Footer';
import HomePageForm from './Pages/Home/HomePage';
import NotFound from './NotFound';
import ChatApp from './Chat/ChatApp';
import EmployeeDashboard from './EmployeeDashboard';
import FriendChatSystem from './Friend Requests/FriendChatSystem';
import HomePage from './Frontend/Home/HomePage';
import FriendList from './Friend Requests/FriendList';
import ContactEntriesList from './Pages/Contact Us/ContactFormEntries';
// import PrivateChatWindow from './Friend Chat System/PrivateChatWindow';

const Header = ({ toggleMobileMenu }) => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center md:pl-64">
      <div className="flex items-center">
        {/* Hamburger button only visible on mobile */}
        <button
          className="mr-4 md:hidden"
          onClick={toggleMobileMenu}
        >
          <i className="fas fa-bars text-2xl"></i>
        </button>
        <Link to="/" className="text-xl font-semibold text-gray-800 hover:underline text-left">
          Employee Dashboard
        </Link>
      </div>
      <Link to="/frontend" className="text-xl font-semibold text-gray-800 hover:underline">
        Frontend Homepage
      </Link>
    </header>
  );
};

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        {/* Sidebar: Pass mobileMenuOpen state and toggle callback */}
        <Menu 
          mobileMenuOpen={mobileMenuOpen} 
          toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} 
        />
        <div className="md:ml-64">
          <Header toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <EmployeeProvider>
            <main className="p-4">
              <Routes>
                {/* Blogs */}
                <Route path="/" element={<EmployeeDashboard />} />
                <Route path="/frontend/*" element={<HomePage />} />
                <Route path="/blogs" element={<BlogsList />} />
                <Route path="/add-blog" element={<AddBlogPage />} />
                <Route path="/add-category" element={<CategoriesPage />} />
                <Route path="/test" element={<div>Test Page</div>} />

                {/* Leave Management */}
                <Route path="/apply-leave" element={<ApplyLeave />} />
                <Route path="/leave-status" element={<LeaveStatusPage />} />
                <Route path="/leave-list" element={<LeaveRequests />} />

                {/* Profile */}
                <Route path="/update-profile" element={<UpdateProfile />} />

                {/* Friends & Chat */}
                <Route path="/send-request" element={<AddFriendList />} />
                <Route path="/friend-requests" element={<FriendRequests />} />
                <Route path="/chat" element={<FriendChatSystem />} />
                <Route path='/friends' element={<FriendList />} />

                {/* Projects & Tasks */}
                <Route path="/project-list" element={<ProjectList />} />
                <Route path="/my-tasks" element={<MyTasks />} />
                <Route path="/task-list" element={<TaskList />} />

                {/* Chat Rooms */}
                <Route path="/chatroom-list" element={<ChatApp />} />
                <Route path="/create-room" element={<CreateRoom />} />

                {/* Employee Management */}
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route path="/employee-list" element={<EmployeeList />} />

                {/* Page Management */}
                <Route path="/add-aboutus" element={<AboutUsForm />} />
                <Route path="/add-home" element={<HomePageForm />} />
                <Route path="/add-footer" element={<FooterForm />} />
                <Route path="/entries" element={<ContactEntriesList />} />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </EmployeeProvider>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
