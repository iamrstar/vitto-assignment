import React, { useState, useEffect } from 'react';
import { getApplications, updateApplicationStatus, getSummary } from '../utils/api';
import { Search, Filter, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

const DashboardPage = () => {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsData, summaryData] = await Promise.all([
        getApplications(statusFilter),
        getSummary()
      ]);
      setApplications(appsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      // Update local state without reload
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
      // Refresh summary
      const newSummary = await getSummary();
      setSummary(newSummary);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  // status badge css class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  const getLanguageBadgeColor = (lang) => {
    const colors = {
      Hindi: '#e8f5e9',
      Tamil: '#fff3e0',
      Telugu: '#e3f2fd',
      Marathi: '#f3e5f5',
      English: '#f5f5f5'
    };
    return colors[lang] || '#f5f5f5';
  };

  const filteredApplications = applications.filter(app => {
    if(!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return app.name.toLowerCase().includes(query) || app.mobile.includes(query);
  });

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Operations Dashboard</h1>
        <button className="btn-icon" onClick={fetchData} title="Refresh Data">
          <RefreshCw size={20} className={loading ? 'spinning' : ''} />
        </button>
      </div>

      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Applications</h3>
            <p className="stat-value">{summary.totalApps}</p>
          </div>
          <div className="stat-card">
            <h3>Total Amount Requested</h3>
            <p className="stat-value">₹ {summary.totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-value text-warning">{summary.statusCounts.pending || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Approved</h3>
            <p className="stat-value text-success">{summary.statusCounts.approved || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Rejected</h3>
            <p className="stat-value text-danger">{summary.statusCounts.rejected || 0}</p>
          </div>
        </div>
      )}

      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or mobile..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <Filter size={18} className="filter-icon" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">Loading applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="empty-state">No applications found.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Applicant</th>
                <th>Amount (₹)</th>
                <th>Purpose</th>
                <th>Language</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td>{new Date(app.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div className="fw-500">{app.name}</div>
                    <div className="text-sm text-gray">{app.mobile}</div>
                  </td>
                  <td className="fw-600">{parseFloat(app.amount).toLocaleString('en-IN')}</td>
                  <td><div className="truncate-text" title={app.purpose}>{app.purpose}</div></td>
                  <td>
                    <span 
                      className="lang-badge" 
                      style={{ backgroundColor: getLanguageBadgeColor(app.language) }}
                    >
                      {app.language}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {app.status === 'pending' ? (
                      <div className="action-buttons">
                        <button 
                          className="btn-action success" 
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          className="btn-action danger" 
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
