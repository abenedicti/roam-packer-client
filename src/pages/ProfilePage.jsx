import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/Logout';
import '../pages/ProfilePage.css';
import { countries } from '../data/countries';
import service from '../services/service.config';
import { AuthContext } from '../context/Auth.context';
import LoadingSpinner from '../components/LoadingSpinner';

function ProfilePage() {
  const { loggedUserId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [criteria, setCriteria] = useState({
    username: '',
    nationality: '',
    age: '',
    gender: '',
    countryOfResidence: '',
    aboutMe: '',
    photoUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  //* fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!loggedUserId) return;
      try {
        const res = await service.get(`/users/${loggedUserId}`);
        setUserProfile(res.data);
        setCriteria({
          username: res.data.username || '',
          nationality: res.data.nationality || '',
          age: res.data.age || '',
          gender: res.data.gender || '',
          countryOfResidence: res.data.countryOfResidence || '',
          aboutMe: res.data.aboutMe || '',
          photoUrl: res.data.photoUrl || '',
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [loggedUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  };

  //* Upload Cloudinary and update DB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'profile_unsigned');

    try {
      const resCloud = await fetch(
        'https://api.cloudinary.com/v1_1/dlsfa7b0k/image/upload',
        { method: 'POST', body: formData },
      );
      const data = await resCloud.json();
      const photoUrl = data.secure_url;

      //* send to backend to stay in DB
      const res = await service.put(`/users/${loggedUserId}`, { photoUrl });

      //* update after backend confirmation
      setCriteria((prev) => ({ ...prev, photoUrl: res.data.photoUrl }));
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  //* save the rest of the profile
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await service.put(`/users/${loggedUserId}`, criteria);
      setEditMode(false);
      setUserProfile(res.data);
      setCriteria((prev) => ({ ...prev, photoUrl: res.data.photoUrl }));
      alert('Profile saved!');
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page auth-page">
      <h1>My Profile</h1>
      <div className="personal-info">
        <div className="profile-picture">
          {criteria.photoUrl ? (
            <>
              <img
                src={criteria.photoUrl}
                alt="Profile"
                className="profile-img"
              />
              <div className="photo-buttons">
                <label className="upload-label">
                  Change
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    setUploading(true);
                    try {
                      const res = await service.put(`/users/${loggedUserId}`, {
                        photoUrl: '',
                      });
                      setCriteria((prev) => ({
                        ...prev,
                        photoUrl: res.data.photoUrl,
                      }));
                    } catch (err) {
                      console.error('Error removing photo:', err);
                    } finally {
                      setUploading(false);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="placeholder">No photo</div>
              <label className="upload-label">
                Upload
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </label>
            </>
          )}
          {uploading && <p>Uploading...</p>}
        </div>

        <div className="infos">
          <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
            <label>
              Username:
              <input
                name="username"
                value={criteria.username}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </label>

            <label>
              Nationality:
              <input
                name="nationality"
                value={criteria.nationality}
                onChange={handleChange}
                list="country-list"
                placeholder="I am from..."
                disabled={!editMode}
              />
              <datalist id="country-list">
                {countries.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>

            <label>
              Age:
              <input
                type="number"
                name="age"
                value={criteria.age}
                onChange={handleChange}
                min="0"
                disabled={!editMode}
              />
            </label>

            <label>
              Gender:
              <select
                name="gender"
                value={criteria.gender}
                onChange={handleChange}
                disabled={!editMode}
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Country of Residence:
              <input
                name="countryOfResidence"
                value={criteria.countryOfResidence}
                onChange={handleChange}
                list="country-list"
                disabled={!editMode}
              />
            </label>

            <label>
              About Me:
              <textarea
                name="aboutMe"
                value={criteria.aboutMe}
                onChange={handleChange}
                disabled={!editMode}
              />
            </label>

            {!editMode ? (
              <button type="button" onClick={() => setEditMode(true)}>
                Edit
              </button>
            ) : (
              <button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <LoadingSpinner /> : 'Save'}
              </button>
            )}
          </form>

          <div className="btn-profile">
            <button onClick={() => navigate('/find-match')}>
              Find a Partner
            </button>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
