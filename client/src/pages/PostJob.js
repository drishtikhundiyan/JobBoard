import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase } from 'react-icons/fa';
import api from '../utils/api';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    jobType: 'full-time',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    applicationDeadline: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const skillsArray = formData.skills
        ? formData.skills
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s)
        : [];

      await api.post('/api/jobs', {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        jobType: formData.jobType,

        salary: {
          min: formData.salaryMin
            ? Number(formData.salaryMin)
            : undefined,
          max: formData.salaryMax
            ? Number(formData.salaryMax)
            : undefined,
        },

        skills: skillsArray,

        applicationDeadline:
          formData.applicationDeadline || undefined,
      });

      navigate('/employer/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to post job'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <FaBriefcase className="text-blue-600 text-2xl" />

          <h1 className="text-2xl font-bold text-gray-900">
            Post a New Job
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="e.g. Senior React Developer"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="e.g. TechNova Solutions"
            />
          </div>

          {/* Location + Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="e.g. New Delhi, India"
              />
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Minimum Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary ($)
              </label>

              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="e.g. 50000"
              />
            </div>

            {/* Maximum Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary ($)
              </label>

              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="e.g. 80000"
              />
            </div>

          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="Describe the role, responsibilities..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements *
            </label>

            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="List the required qualifications..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="e.g. React, Node.js, MongoDB (comma separated)"
            />
          </div>

          {/* Application Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline
            </label>

            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50"
          >
            {loading ? 'Posting Job...' : 'Post Job'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default PostJob;