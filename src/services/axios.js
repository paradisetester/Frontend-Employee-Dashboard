import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'https://backend-s299.onrender.com/api'; // Ensure the base URL is correct

// Create an axios instance with default headers
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to request headers if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Standardized error handler
const handleError = (error) => {
  if (error.response) {
    console.error('Backend error:', error.response.data);
    throw error.response.data;
  } else if (error.request) {
    console.error('No response from backend:', error.request);
    throw { error: 'No response from backend' };
  } else {
    console.error('Error setting up request:', error.message);
    throw { error: error.message };
  }
};

// Utility functions for API calls (GET, POST, PUT, DELETE)
const api = {
  /** 🧑‍💼 Employee Management **/
  addEmployee: async (employeeData) => {
    try {
      const response = await axiosInstance.post('/auth/register', employeeData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await axiosInstance.put(`/auth/update-profile/${employeeId}`, employeeData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  // Fetch the logged-in employee's profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/auth/get-profile');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getEmployees: async () => {
    try {
      const response = await axiosInstance.get('/auth/employees');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  deleteEmployee: async (employeeId) => {
    try {
      const response = await axiosInstance.delete(`/auth/delete-employee/${employeeId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  /** 📝 Blog Management **/
  addBlog: async (blogData) => {
    try {
      const response = await axiosInstance.post('/blogs/add-blog', blogData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Explicitly set for file uploads
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
      console.log(error, 'Error details')
    }
  },

  getBlogs: async () => {
    try {
      const response = await axiosInstance.get('/blogs/get-blogs');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getBlog: async (blogId) => {
    try {
      const response = await axiosInstance.get(`/blogs/get-blog/${blogId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  deleteBlog: async (blogId) => {
    try {
      const response = await axiosInstance.delete(`/blogs/delete-blog/${blogId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  addTest: async (testData) => {
    try {
      // Ensure testData is a FormData object before sending
      // You can remove the 'Content-Type' header if axios/your browser sets it automatically.
      const response = await axiosInstance.post('/test/upload', testData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Optional: axios can set this automatically with FormData
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
      console.log(error, 'Error details');
      // Optionally, rethrow the error or return a custom error response
      throw error;
    }
  },
  /** 📝 Category Management **/

  // Create a new category
  addCategory: async (categoryData) => {
    try {
      const response = await axiosInstance.post('/categories/add-category', categoryData);
      return response.data;
    } catch (error) {
      handleError(error);
      console.log(error, 'Error details');
    }
  },

  // Fetch all categories
  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/categories/get-categories');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get blogs for a specific category (supports pagination, sorting, etc.)
  getCategoryBlogs: async (categoryId, params) => {
    try {
      const response = await axiosInstance.get(`/categories/get-category/${categoryId}/blogs`, { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Update a category by ID
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await axiosInstance.put(`/categories/update-category/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Delete a category by ID
  deleteCategory: async (categoryId) => {
    try {
      const response = await axiosInstance.delete(`/categories/delete-category/${categoryId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  /** 📆 Leave Management **/
  applyLeave: async (leaveData) => {
    try {
      const response = await axiosInstance.post('/leaves/apply-leave', leaveData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getLeaves: async () => {
    try {
      const response = await axiosInstance.get('/leaves/all-leaves');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  myLeaves: async (id) => {
    try {
      const response = await axiosInstance.get('/leaves/my-leaves', { id });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  deleteLeave: async (id) => {
    try {
      const response = await axiosInstance.delete(`/leaves/delete-leave/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Update Leave Status API Call
  updateLeaveStatus: async (leaveId, status) => {
    try {
      const response = await axiosInstance.put(`/leaves/update-leave-status/${leaveId}`, { status });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  /** 📝 Project Management **/

  newProject: async (projectData) => {
    try {
      const response = await axiosInstance.post('/project/', projectData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getProjects: async () => {
    try {
      const response = await axiosInstance.get('/project/');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getProject: async (projectID) => {
    try {
      const response = await axiosInstance.get(`/project/${projectID}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateProject: async (projectID) => {
    try {
      const response = await axiosInstance.put(`/project/${projectID}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  deleteProject: async (projectID) => {
    try {
      const response = await axiosInstance.delete(`/project/${projectID}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  /** 📝 Task Management **/
  getTasks: async () => {
    try {
      const response = await axiosInstance.get('/task/');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getTask: async (taskId) => {
    try {
      const response = await axiosInstance.get(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  newTask: async (taskData) => {
    try {
      const response = await axiosInstance.post('/task/', taskData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await axiosInstance.put(`/task/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await axiosInstance.delete(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  myTasks: async (employeeId) => {
    try {
      const response = await axiosInstance.get(`/task/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  /** 📝 Comment Management **/
  // Add a new top-level comment
  addComment: async (blogId, content) => {
    try {
      const response = await axiosInstance.post(`/comments/add-comment/${blogId}`, { content });
      return response.data;
    } catch (error) {
      console.error('Failed to add comment:', error.response?.data || error.message);
      throw error;
    }
  },

  // Add a reply to a comment or nested reply
  addReply: async (commentId, content, parentReplyId = null) => {
    try {
      const payload = { content, parentReplyId };
      const response = await axiosInstance.post(`/comments/add-reply/${commentId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Failed to add reply:', error.response?.data || error.message);
      throw error;
    }
  },

  // Fetch all comments for a blog
  getComments: async (blogId) => {
    try {
      const response = await axiosInstance.get(`/comments/get-comments/${blogId}`);
      console.log(response, 'comments')
      return response.data;
    } catch (error) {
      console.error('Failed to fetch comments:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a comment or reply
  deleteComment: async (commentId) => {
    try {
      const response = await axiosInstance.delete(`/comments/delete-comment/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete comment:', error.response?.data || error.message);
      throw error;
    }
  },

  /** 📝 Room Management **/

  createRoom: async (chatroomData) => {
    try {
      const response = await axiosInstance.post('/chat/create', chatroomData);
      return response;
    } catch (error) {
      handleError(error);
    }
  },
  getRooms: async (userId) => {
    try {
      const response = await axiosInstance.get(`/chat/user/${userId}`);
      console.log(userId, 'User ID')
      return response.data;
    } catch (error) {
      handleError(error); // Assuming handleError is already defined in your codebase
    }
  },
  // Send a new message
  sendMessage: async (messageData) => {
    try {
      const response = await axiosInstance.post('/messages/send', messageData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },


  // Fetch messages for a specific chat room
  getMessages: async (roomId) => {
    try {
      const response = await axiosInstance.get(`/messages/${roomId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    } 
  },
  getDirectMessages: async (userID, friendID) => {
    try {
      const response = await axiosInstance.get(`/messages/direct`, {
        params: { user1: userID, user2: friendID }
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  
  
  

  // Mark a message as read
  markMessageRead: async (messageId, userId) => {
    try {
      const response = await axiosInstance.put(`/messages/mark-read/${messageId}`, { userId });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  /** 📝 Page Management **/

  newaboutusPage: async (formData) => {
    try {
      const response = await axiosInstance.post('aboutus/add-aboutus', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Explicitly set for file uploads
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getAboutUsPage: async () => {
    try {
      const response = await axiosInstance.get('/aboutus/get-aboutus');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateAboutUsPage: async (id, formData) => {
    try {
      const response = await axiosInstance.put(`aboutus/update-aboutus/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  newhomePage: async (formData) => {
    try {
      const response = await axiosInstance.post('home/add-home', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Explicitly set for file uploads
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  gethomePage: async () => {
    try {
      const response = await axiosInstance.get('/home/get-home');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateHomePage: async (id, formData) => {
    try {
      const response = await axiosInstance.put(`home/update-home/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getFooter: async () => {
    try {
      const response = await axiosInstance.get('/footer/get-footer');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  newFooter: async (formData) => {
    try {
      const response = await axiosInstance.post('/footer/add-footer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateFooter: async (id, formData) => {
    try {
      const response = await axiosInstance.put(`footer/update-footer/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },


 /** 📝 Contact Form Management **/

 newEntry: async (formData) => {
  try {
    const response = await axiosInstance.post('/contactform/add-entry', formData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
},
getEntries: async () => {
  try {
    const response = await axiosInstance.get('/contactform/get-entries');
    return response.data;
  } catch (error) {
    handleError(error);
  }
},
  // Delete a comment or reply
  deleteEntry: async (entryID) => {
    try {
      const response = await axiosInstance.delete(`/contactform/delete-entry/${entryID}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete comment:', error.response?.data || error.message);
      throw error;
    }
  },

  /** 📝 Friend Requests Management **/

  // Send a friend request
  sendRequest: async (requestData) => {
    try {
      const response = await axiosInstance.post('/friendrequests/send/', requestData);
      return response;
    } catch (error) {
      handleError(error);
    }
  },
  // Get all friend requests for a user
  getRequests: async (userId) => {
    try {
      const response = await axiosInstance.get(`/friendrequests/${userId}`);
      console.log(userId, 'User ID')
      return response.data;
    } catch (error) {
      handleError(error); // Assuming handleError is already defined in your codebase
    }
  },
  // Get all sent friend requests for a user with rejected and pending status
  getSentRequests: async (userId) => {
    try {
      const response = await axiosInstance.get(`/friendrequests/sent/${userId}`);
      console.log(userId, 'User ID')
      return response.data;
    } catch (error) {
      handleError(error); // Assuming handleError is already defined in your codebase
    }
  },
  // Accept a Request
  acceptRequest: async (requestID) => {
    try {
      const response = await axiosInstance.put(`/friendrequests/accept/${requestID}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Reject a Request
  rejectRequest: async (requestID) => {
    try {
      const response = await axiosInstance.put(`/friendrequests/reject/${requestID}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
// Get all sent friend requests (all statuses)
getSentRequestsAll: async (userId) => {
  try {
    const response = await axiosInstance.get(`/friendrequests/sent/all/${userId}`);
    console.log(userId, 'User ID');
    return response.data;
  } catch (error) {
    handleError(error);
  }
},

  // Add a friend to a user's friend list
  addFriend: async (requestData) => {
    try {
      const response = await axiosInstance.post('/friendlist/add/', requestData);
      return response;
    } catch (error) {
      handleError(error);
    }
  },

  // Remove a friend from a user's friend list
  removeFriend: async (requestData) => {
    try {
      // For DELETE requests with a request body, pass the data inside the options object
      const response = await axiosInstance.delete('/friendlist/remove/', { data: requestData });
      return response;
    } catch (error) {
      handleError(error);
    }
  },

  // Get a user's friend list by their ID
  getFriendList: async (userId) => {
    try {
      const response = await axiosInstance.get(`/friendlist/${userId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

};

export default api;
