import React, { useState, useEffect } from 'react';
import api from '../../services/axios'; // Adjust the path based on your file structure
import mongoose from 'mongoose';

const CreateRoom = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('chatroom');
  const [members, setMembers] = useState([]);
  const [project, setProject] = useState(null);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);

  useEffect(() => {
    // Fetch employees and projects for dropdowns
    const fetchData = async () => {
      try {
        const employees = await api.getEmployees();
        console.log(employees, 'emp');
        const projects = await api.getProjects();
        console.log('Employees:', employees);
        console.log('Projects:', projects);

        setAvailableEmployees(employees); // Default to empty array if undefined
        setAvailableProjects(projects);  // Default to empty array if undefined
      } catch (error) {
        console.error('Error fetching data:', error.response || error.message);
      }
    };

    fetchData();
  }, []);

  const handleCreateRoom = async () => {
    if (!name || !type) {
      alert('Name and Type are required fields.');
      return;
    }

    // Check if members contain valid ObjectId(s)
    const validMembers = members.filter(memberId => mongoose.Types.ObjectId.isValid(memberId));

    if (validMembers.length === 0) {
      alert('Please select at least one valid member.');
      return;
    }

    const chatroomData = {
      name,
      type,
      members: validMembers, // Only valid members (ObjectIds)
      createdBy: 'currentUser._id', // This should be replaced with the actual current user's ID
      project: type === 'project' ? project : null, // Only set project if type is 'project'
    };

    console.log('Chatroom Data:', chatroomData);

    try {
      const newRoom = await api.createRoom(chatroomData); // Assuming api.createRoom handles the POST request
      alert('Chatroom created successfully!');
      // Reset form fields
      setName('');
      setType('chatroom');
      setMembers([]);
      setProject(null);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create the room. Please try again.');
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create a Chatroom</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chatroom Name
        </label>
        <input
          type="text"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          placeholder="Enter chatroom name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="private">Private</option>
          <option value="project">Project</option>
          <option value="chatroom">Chatroom</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Members
        </label>
        <select
          multiple
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          value={members}
          onChange={(e) =>
            setMembers(Array.from(e.target.selectedOptions, (option) => option.value))
          }
        >
          {availableEmployees.length > 0 ? (
            availableEmployees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name} from {employee.department} Department
              </option>
            ))
          ) : (
            <option disabled>No employees available</option>
          )}
        </select>

        <small className="text-gray-500">Hold CTRL/Command to select multiple members</small>
      </div>

      {type === 'project' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project
          </label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          >
            <option value="">Select a project</option>
            {availableProjects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
        onClick={handleCreateRoom}
      >
        Create Room
      </button>
    </div>
  );
};

export default CreateRoom;
