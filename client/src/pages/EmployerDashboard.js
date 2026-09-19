import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBriefcase,
  FaPlus,
  FaTrash,
  FaUsers,
  FaEye,
  FaToggleOn,
  FaEdit
} from 'react-icons/fa';
import Spinner from '../components/Spinner';
import api from '../utils/api';

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/jobs/employer/myjobs');
      setJobs(data);
    } catch (err) {
      setError('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      setLoadingApps(true);
      setSelectedJob(jobId);

      const { data } = await api.get(`/api/applications/job/${jobId}`);
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoadingApps(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await api.delete(`/api/jobs/${jobId}`);

      setJobs(jobs.filter((j) => j._id !== jobId));

      if (selectedJob === jobId) {
        setSelectedJob(null);
        setApplications([]);
      }
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/api/applications/${appId}/status`, { status });

      setApplications(
        applications.map((app) =>
          app._id === appId ? { ...app, status } : app
        )
      );
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800',
    };

    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employer Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your job postings and applications
          </p>
        </div>

        <Link
          to="/employer/post-job"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
        >
          <FaPlus />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Total Jobs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Total Jobs
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-1">
                {jobs.length}
              </p>
            </div>

            <FaBriefcase className="text-blue-500 text-3xl" />
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Active Jobs
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-1">
                {jobs.filter((j) => j.isActive).length}
              </p>
            </div>

            <FaToggleOn className="text-green-500 text-3xl" />
          </div>
        </div>

        {/* Selected Job */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Selected Job
              </p>

              <p className="text-sm font-bold text-gray-900 mt-1">
                {selectedJob
                  ? jobs.find((j) => j._id === selectedJob)?.title
                  : 'None'}
              </p>
            </div>

            <FaUsers className="text-purple-500 text-3xl" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Jobs List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Job Postings
          </h2>

          {jobs.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
              <FaBriefcase className="text-gray-300 text-5xl mx-auto mb-4" />

              <p className="text-gray-500">
                No jobs posted yet
              </p>

              <Link
                to="/employer/post-job"
                className="text-blue-600 font-medium mt-2 inline-block hover:underline"
              >
                Post your first job →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">

              {jobs.map((job) => (
                <div
                  key={job._id}
                  className={`bg-white rounded-xl p-5 shadow-sm border transition-all cursor-pointer ${
                    selectedJob === job._id
                      ? 'border-blue-400 ring-2 ring-blue-100'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => fetchApplications(job._id)}
                >

                  <div className="flex justify-between items-start">

                    <div className="flex-1">

                      <h3 className="font-semibold text-gray-900">
                        {job.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {job.location} • {job.jobType}
                      </p>

                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                          job.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>

                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 ml-4">

                      {/* View Applications */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchApplications(job._id);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Applications"
                      >
                        <FaUsers />
                      </button>

                      {/* Edit Job */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/employer/jobs/${job._id}/edit`);
                        }}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Job"
                      >
                        <FaEdit />
                      </button>

                      {/* Delete Job */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteJob(job._id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Job"
                      >
                        <FaTrash />
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* Applications Panel */}
        <div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Applications

            {selectedJob && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({applications.length} total)
              </span>
            )}
          </h2>

          {/* No Job Selected */}
          {!selectedJob ? (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">

              <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />

              <p className="text-gray-500">
                Click on a job to view applications
              </p>

            </div>

          ) : loadingApps ? (
            <Spinner />

          ) : applications.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">

              <p className="text-gray-500">
                No applications yet for this job
              </p>

            </div>

          ) : (
            <div className="space-y-4">

              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                >

                  <div className="flex justify-between items-start mb-3">

                    <div>
                      <p className="font-semibold text-gray-900">
                        {app.applicant?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {app.applicant?.email}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>

                  </div>

                  {/* Cover Letter */}
                  <p className="text-sm text-gray-600 mb-3">
                    {app.coverLetter}
                  </p>

                  {/* Resume */}
                  <a
                    href={`${
                      process.env.REACT_APP_API_URL ||
                      'http://localhost:5000'
                    }/${app.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline flex items-center space-x-1 mb-3"
                  >
                    <FaEye />
                    <span>View Resume</span>
                  </a>

                  {/* Application Status */}
                  <select
                    value={app.status}
                    onChange={(e) =>
                      updateStatus(app._id, e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="accepted">Accepted</option>
                  </select>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default EmployerDashboard;