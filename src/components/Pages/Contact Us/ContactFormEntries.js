import React, { useEffect, useState } from 'react';
import api from '../../../services/axios';
import { ClipLoader } from 'react-spinners';

const ContactEntriesList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all entries from the API
  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEntries();
      setEntries(data);
    } catch (err) {
      setError(err.response?.data.error || 'Failed to fetch entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Handle deletion of an entry
  const handleDelete = async (id) => {
    try {
      await api.deleteEntry(id);
      // Update local state after deletion
      setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
    } catch (err) {
      alert(err.response?.data.error || 'Failed to delete entry.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Form Entries</h1>
      {entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Message</th>
              <th className="py-2 px-4 border">Submitted At</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id} className="text-center">
                <td className="py-2 px-4 border">{entry.name}</td>
                <td className="py-2 px-4 border">{entry.email}</td>
                <td className="py-2 px-4 border">{entry.message}</td>
                <td className="py-2 px-4 border">{new Date(entry.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactEntriesList;
