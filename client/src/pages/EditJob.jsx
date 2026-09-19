import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import Spinner from '../components/Spinner';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/api/jobs/${id}`);

      setFormData({
        title: data.title || '',
        company: data.company || '',
        description: data.description || '',
        requirements: data.requirements || '',
        location: data.location || '',
        jobType: data.jobType || 'full-time',
        salaryMin: data.salary?.min || '',
        salaryMax: data.salary?.max || '',
        skills: data.skills?.join(', ') || '',
        applicationDeadline: data.applicationDeadline
          ? data.applicationDeadline.split('T')[0]
          : '',
      });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load job details'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const skillsArray = formData.skills
        ? formData.skills
            .split(',')
            .map((skill) => skill.trim())
            .filter((skill) => skill)
        : [];

      await api.put(`/api/jobs/${id}`, {
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

      setSuccess('Job updated successfully!');

      setTimeout(() => {
        navigate('/employer/dashboard');
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update job'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Job
        </h1>

        <p className="text-gray-500 mb-8">
          Update your job posting details
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Company */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary
              </label>

              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary
              </label>

              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, MongoDB"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-500 mt-1">
              Separate skills with commas
            </p>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline
            </label>

            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;