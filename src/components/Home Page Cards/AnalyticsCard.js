import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../../services/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnhancedAnalyticsCard = () => {
  // Data states
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [projects, setProjects] = useState([]);

  // Drilldown state
  const [mode, setMode] = useState('overview'); // "overview", "drilldown", "details"
  const [selectedCategory, setSelectedCategory] = useState(null); // "employees", "leaves", "projects"
  const [groupedData, setGroupedData] = useState({}); // keyed by date string
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseEmployees = await api.getEmployees();
      const responseProjects = await api.getProjects();
      const responseLeaves = await api.getLeaves();
      setEmployees(responseEmployees);
      setProjects(responseProjects);
      setLeaves(responseLeaves);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Assuming "pending" is the required status for leaves
  const pendingLeaves = leaves.filter((leave) => leave.status === 'pending');
  // Assuming projects with status "Planned" are the ones to display
  const plannedProjects = projects.filter((project) => project.status === 'Planned');

  // Utility: group items by creation date (formatted as locale date string)
  const groupByDate = (items) => {
    return items.reduce((acc, item) => {
      if (!item.createdAt) return acc;
      const date = new Date(item.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };

  // OVERVIEW: Chart data for aggregated counts
  const overviewData = {
    labels: ['Employees', 'Pending Leaves', 'Planned Projects'],
    datasets: [
      {
        label: 'Count',
        data: [employees.length, pendingLeaves.length, plannedProjects.length],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',  // Green
          'rgba(255, 152, 0, 0.8)',   // Orange
          'rgba(63, 81, 181, 0.8)',   // Indigo
        ],
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const overviewOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: { font: { size: 14 } }
      },
      title: { 
        display: true, 
        text: 'Dashboard Overview', 
        font: { size: 18 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: 12 } },
      },
      x: {
        ticks: { font: { size: 12 } },
      },
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        // Determine category based on index
        const category = index === 0 ? 'employees' : index === 1 ? 'leaves' : 'projects';
        setSelectedCategory(category);
        let items = [];
        if (category === 'employees') items = employees;
        else if (category === 'leaves') items = pendingLeaves;
        else if (category === 'projects') items = plannedProjects;
        // Group items by creation date
        const grouped = groupByDate(items);
        setGroupedData(grouped);
        setMode('drilldown');
      }
    },
  };

  // DRILLDOWN: Create chart data from groupedData
  const drillLabels = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
  const drillCounts = drillLabels.map((date) => groupedData[date].length);
  const drilldownData = {
    labels: drillLabels,
    datasets: [
      {
        label: 'Count',
        data: drillCounts,
        backgroundColor: 'rgba(33, 150, 243, 0.8)', // Blue
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const drilldownOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: { font: { size: 14 } }
      },
      title: { 
        display: true, 
        text: `Drilldown: ${selectedCategory}`, 
        font: { size: 18 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: 12 } },
      },
      x: {
        ticks: { font: { size: 12 } },
      },
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        const date = drillLabels[index];
        setSelectedDate(date);
        setMode('details');
      }
    },
  };

  // DETAILS: List of items for the selected date in the selected category
  const detailsItems = selectedDate && groupedData[selectedDate] ? groupedData[selectedDate] : [];

  // Back button handlers
  const backToOverview = () => {
    setMode('overview');
    setSelectedCategory(null);
    setGroupedData({});
    setSelectedDate(null);
  };

  const backToDrilldown = () => {
    setMode('drilldown');
    setSelectedDate(null);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-2 h-full transition-all duration-300 hover:shadow-xl">
      <div className="drag-handle cursor-move text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
        📊 Analytics
      </div>
      
      {mode === 'overview' && (
        <div style={{ height: '300px' }} className="mb-6">
          <div className="mb-4 text-gray-700">
            <p className="mb-1">👥 <span className="font-semibold">{employees.length}</span> Employees</p>
            <p className="mb-1">⏳ <span className="font-semibold">{pendingLeaves.length}</span> Pending Leaves</p>
            <p>🚀 <span className="font-semibold">{plannedProjects.length}</span> Planned Projects</p>
          </div>
          <Bar data={overviewData} options={overviewOptions} />
        </div>
      )}

      {mode === 'drilldown' && (
        <div style={{ height: '300px' }}>
          <button
            onClick={backToOverview}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🔙 Back to Overview
          </button>
          <Bar data={drilldownData} options={drilldownOptions} />
        </div>
      )}

      {mode === 'details' && (
        <div>
          <button
            onClick={backToDrilldown}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🔙 Back to Drilldown
          </button>
          <h3 className="font-bold text-gray-800 text-lg mb-3">
            Details for <span className="text-blue-600">{selectedCategory}</span> on <span className="text-red-500">{selectedDate}</span>
          </h3>
          <ul className="space-y-2">
            {selectedCategory === 'employees' &&
              detailsItems.map((item, index) => (
                <li key={index} className="p-3 bg-gray-100 rounded-md border border-gray-200 shadow-sm hover:bg-gray-200 transition">
                  <span className="font-semibold">{item.name}</span> — Created on {new Date(item.createdAt).toLocaleDateString()}
                </li>
              ))}
            {selectedCategory === 'leaves' &&
              detailsItems.map((item, index) => (
                <li key={index} className="p-3 bg-gray-100 rounded-md border border-gray-200 shadow-sm hover:bg-gray-200 transition">
                  Leave by: <span className="font-semibold">{item.name}</span> — Applied on {new Date(item.createdAt).toLocaleDateString()}
                </li>
              ))}
            {selectedCategory === 'projects' &&
              detailsItems.map((item, index) => (
                <li key={index} className="p-3 bg-gray-100 rounded-md border border-gray-200 shadow-sm hover:bg-gray-200 transition">
                  Project: <span className="font-semibold">{item.name}</span> — Created on {new Date(item.createdAt).toLocaleDateString()}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EnhancedAnalyticsCard;
