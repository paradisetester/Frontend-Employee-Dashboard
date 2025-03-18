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

// Register the necessary Chart.js components
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
  const pendingLeaves = leaves.filter(leave => leave.status === 'pending');
  // Assuming projects with status "Planned" are the ones to display
  const plannedProjects = projects.filter(project => project.status === 'Planned');

  // Utility: group items by creation date (formatted as locale date string)
  const groupByDate = (items) => {
    return items.reduce((acc, item) => {
      // Ensure createdAt exists; if not, skip the item.
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
          'rgba(75,192,192,0.6)',
          'rgba(255,159,64,0.6)',
          'rgba(153,102,255,0.6)',
        ],
      },
    ],
  };

  const overviewOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Dashboard Overview' },
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
  const drillLabels = Object.keys(groupedData).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const drillCounts = drillLabels.map(date => groupedData[date].length);
  const drilldownData = {
    labels: drillLabels,
    datasets: [
      {
        label: 'Count',
        data: drillCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const drilldownOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Drilldown: ${selectedCategory}` },
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
    <div className="bg-white shadow rounded p-4 h-full">
      <div className="drag-handle cursor-move mb-2 text-gray-700 font-bold">
        Analytics
      </div>
      {mode === 'overview' && (
        <>
          <div className="mb-4">
            <p>Total Employees: {employees.length}</p>
            <p>Pending Leaves: {pendingLeaves.length}</p>
            <p>Planned Projects: {plannedProjects.length}</p>
          </div>
          <Bar data={overviewData} options={overviewOptions} />
        </>
      )}
      {mode === 'drilldown' && (
        <>
          <button onClick={backToOverview} className="mb-2 text-blue-500 underline">
            Back to Overview
          </button>
          <Bar data={drilldownData} options={drilldownOptions} />
        </>
      )}
      {mode === 'details' && (
        <>
          <button onClick={backToDrilldown} className="mb-2 text-blue-500 underline">
            Back to Drilldown
          </button>
          <div className="mt-4">
            <h3 className="font-bold mb-2">
              Details for {selectedCategory} on {selectedDate}
            </h3>
            <ul className="list-disc pl-5">
              {selectedCategory === 'employees' &&
                detailsItems.map((item, index) => (
                  <li key={index}>{item.name} (Created on {new Date(item.createdAt).toLocaleDateString()})</li>
                ))}
              {selectedCategory === 'leaves' &&
                detailsItems.map((item, index) => (
                  <li key={index}>Leave by: {item.name} (Applied on {new Date(item.createdAt).toLocaleDateString()})</li>
                ))}
              {selectedCategory === 'projects' &&
                detailsItems.map((item, index) => (
                  <li key={index}>Project: {item.name} (Created on {new Date(item.createdAt).toLocaleDateString()})</li>
                ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedAnalyticsCard;
