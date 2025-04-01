import React from 'react';
import { Link } from 'react-router-dom';

const EmployeesCard = ({ employees, link }) => {
  return (
    <div className="bg-white shadow rounded p-4 h-full overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-700 font-bold">Notifications</div>
        <Link to='/employee-list' className="text-blue-500 hover:underline">
          →
        </Link>
      </div>
      <p>{employees.length} employee{employees.length !== 1 && 's'}</p>
    </div>
  );
};

export default EmployeesCard;
