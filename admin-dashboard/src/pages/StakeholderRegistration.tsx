import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Building, Briefcase, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useStakeholderAuth } from '../hooks/useStakeholderAuth';

const StakeholderRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'editor' as const,
    department: '',
    position: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerStakeholder } = useStakeholderAuth();

  const governmentDepartments = [
    'Ministry of Gender, Children and Social Protection',
    'Ghana School Feeding Programme',
    'Ministry of Education',
    'Ministry of Health',
    'Ministry of Finance',
    'Regional Education Office',
    'District Education Office',
    'Partner Organization'
  ];

  const stakeholderRoles = [
    { value: 'admin', label: 'System Administrator', description: 'Full system access and user management' },
    { value: 'editor', label: 'Content Editor', description: 'Create, edit, and publish content' },
    { value: 'coordinator', label: 'Event Coordinator', description: 'Manage events and calendar' },
    { value: 'content_creator', label: 'Content Creator', description: 'Create and upload content' },
    { value: 'event_manager', label: 'Event Manager', description: 'Schedule and manage events' },
    { value: 'program_officer', label: 'Program Officer', description: 'Manage programs and partners' },
    { value: 'viewer', label: 'Viewer', description: 'View analytics and reports only' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password should be at least 6 characters');
        setLoading(false);
        return;
      }
      if (!formData.department) {
        setError('Please select a department');
        setLoading(false);
        return;
      }
      if (!formData.position) {
        setError('Please enter your position');
        setLoading(false);
        return;
      }

      const result = await registerStakeholder(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.department,
        formData.position
      );

      if (!result.success) {
        setError(result.error || 'Registration failed');
      } else {
        setSuccess('Stakeholder account created successfully! You can now log in.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'editor',
          department: '',
          position: '',
          phone: ''
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghana-neutral-50 via-white to-ghana-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-xl p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-ghana-primary rounded-full mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Stakeholder Registration</h1>
            <p className="text-gray-600">Create your GSFP admin account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary focus:border-transparent"
                    placeholder="your.email@gsfp.gov.gh"
                  />
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary focus:border-transparent"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary focus:border-transparent"
              >
                {stakeholderRoles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Department and Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary focus:border-transparent"
                  >
                    <option value="">Select department</option>
                    {governmentDepartments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary focus:border-transparent"
                    placeholder="Your position title"
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary focus:border-transparent"
                  placeholder="+233 XXX XXX XXXX"
                />
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                    <p className="mt-2 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Registration Successful</h3>
                    <p className="mt-2 text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ghana-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-ghana-primary-dark focus:outline-none focus:ring-2 focus:ring-ghana-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Stakeholder Account'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/admin/login" className="text-ghana-primary hover:text-ghana-primary-dark font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StakeholderRegistration;
