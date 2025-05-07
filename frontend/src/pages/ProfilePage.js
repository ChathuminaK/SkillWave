import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';

const ProfilePage = () => {
  const { currentUser, updateUserProfile, loading, error } = useAuth();
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    bio: '',
    profilePicture: null
  });
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        profilePicture: null
      });
      
      if (currentUser.profilePictureUrl) {
        setProfilePictureURL(currentUser.profilePictureUrl);
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, profilePicture: file });
      setProfilePictureURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateLoading(true);
      setUpdateError('');
      setUpdateSuccess(false);
      
      const formData = new FormData();
      formData.append('fullName', profileData.fullName);
      formData.append('bio', profileData.bio);
      
      if (profileData.profilePicture) {
        formData.append('profilePicture', profileData.profilePicture);
      }
      
      await updateUserProfile(formData);
      setUpdateSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (err) {
      setUpdateError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  return (
    <>
      <PageHeader 
        title="Your Profile" 
        subtitle="Manage your personal information and preferences"
      />
      
      {error && <ErrorAlert message={error} />}
      
      <div className="row">
        <div className="col-lg-4 mb-4 mb-lg-0">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="mb-4">
                {profilePictureURL ? (
                  <img 
                    src={profilePictureURL}
                    alt={profileData.fullName}
                    className="rounded-circle img-thumbnail"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: '150px', height: '150px' }}
                  >
                    <i className="bi bi-person" style={{ fontSize: '4rem', color: '#adb5bd' }}></i>
                  </div>
                )}
              </div>
              
              <h4 className="mb-0">{profileData.fullName}</h4>
              <p className="text-muted">{profileData.email}</p>
              
              <label className="btn btn-outline-primary btn-sm d-block mx-auto" style={{ maxWidth: '200px' }}>
                Change Profile Picture
                <input 
                  type="file" 
                  accept="image/*" 
                  className="d-none" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          
          <div className="card shadow-sm mt-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Account Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Account created</label>
                <p className="mb-0">{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Email verified</label>
                <p className="mb-0">
                  {currentUser?.emailVerified ? (
                    <span className="text-success">
                      <i className="bi bi-check-circle me-1"></i> Verified
                    </span>
                  ) : (
                    <span className="text-warning">
                      <i className="bi bi-exclamation-circle me-1"></i> Not verified
                    </span>
                  )}
                </p>
              </div>
              
              <div>
                <label className="form-label">Account type</label>
                <p className="mb-0">
                  {currentUser?.provider === 'local' ? 'Email/Password' : currentUser?.provider}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Edit Profile</h5>
            </div>
            <div className="card-body">
              {updateError && (
                <div className="alert alert-danger" role="alert">
                  {updateError}
                </div>
              )}
              
              {updateSuccess && (
                <div className="alert alert-success" role="alert">
                  Profile updated successfully!
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={profileData.email}
                    disabled
                  />
                  <small className="text-muted">Email cannot be changed</small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <textarea
                    className="form-control"
                    id="bio"
                    name="bio"
                    rows="4"
                    value={profileData.bio}
                    onChange={handleChange}
                    placeholder="Tell us something about yourself..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
          
          <div className="card shadow-sm mt-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Security</h5>
            </div>
            <div className="card-body">
              <p>Manage your password and account security settings</p>
              
              <button className="btn btn-outline-primary">
                Change Password
              </button>
              
              <hr className="my-4" />
              
              <h6>Account Actions</h6>
              <button className="btn btn-outline-danger">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;