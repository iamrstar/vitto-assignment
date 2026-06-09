import React, { useState } from 'react';
import { submitApplication } from '../utils/api';
import { CheckCircle2, AlertCircle, Smartphone, Activity, Briefcase, Cpu } from 'lucide-react';

const ApplyPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    amount: '',
    purpose: '',
    language: 'Hindi'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // validation
    if (!formData.name || !formData.mobile || !formData.amount || !formData.purpose) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const result = await submitApplication({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setSuccess(`Application submitted successfully! Reference: ${result.id}`);
      setFormData({
        name: '',
        mobile: '',
        amount: '',
        purpose: '',
        language: 'Hindi'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="form-wrapper">
        <div className="split-left">
          <div className="info-header">
            <h2>Fill the form to apply for a business loan</h2>
          </div>
          
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <Smartphone size={18} />
              </div>
              <div className="feature-text">
                Instantly apply for a business loan—no heavy paperwork needed, just submit basic information for a quick result.
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <Activity size={18} />
              </div>
              <div className="feature-text">
                Your business profile is assessed, reflecting past financial behavior and repayment history.
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <Briefcase size={18} />
              </div>
              <div className="feature-text">
                Business revenue, operational history, and related factors are considered in the application review.
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <Cpu size={18} />
              </div>
              <div className="feature-text">
                Our AI system, along with experts, processes your application to finalize your approved loan amount.
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle2 size={18} />
              </div>
              <div className="feature-text">
                Once approved, complete the final steps to receive funds in your bank account and boost your business growth.
              </div>
            </div>
          </div>
        </div>

        <div className="split-right">
          <div className="form-header">
            <h3 className="fw-600">Enter the below details:</h3>
          </div>

          {/* Inline success message removed in favor of modal popup */}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="application-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Loan Amount (₹) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount needed"
              min="1000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Loan Purpose *</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Why do you need this loan?"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="language">Preferred Language *</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
            >
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Marathi">Marathi</option>
              <option value="English">English</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
        </div>
      </div>
      {success && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">
              <CheckCircle2 size={64} />
            </div>
            <h3 className="modal-title">Application Submitted!</h3>
            <p className="modal-text">{success}</p>
            <button className="btn-primary" onClick={() => setSuccess(null)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyPage;
