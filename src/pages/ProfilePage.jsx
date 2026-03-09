import { useState } from 'react';
import LogoutButton from '../components/Logout';
import '../pages/ProfilePage.css';
import { countries } from '../data/countries';

function ProfilePage() {
  const [fullName, setFullName] = useState('');
  const [nationality, setNationality] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [photoUrl, setPhotoUrl] = useState(''); //to display pic
  const [uploading, setUploading] = useState(false);

  // Upload of pic in Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'profile_unsigned'); // preset Cloudinary

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dlsfa7b0k/image/upload',
        {
          method: 'POST',
          body: formData,
        },
      );
      const data = await res.json();
      setPhotoUrl(data.secure_url); // fetch img url
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  //! to save profile => only console.log for now
  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = { fullName, nationality, age, gender, country };
    console.log('Profile saved:', profileData);
    alert('Profile saved!');
  };

  return (
    <div className="profile-page">
      <h1>My Account</h1>
      <div className="personal-info">
        {/* PIC */}
        <div className="profile-picture">
          {photoUrl ? (
            <>
              <img src={photoUrl} alt="Profile" className="profile-img" />
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
                <button type="button" onClick={() => setPhotoUrl('')}>
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

        {/* FORM */}
        <div className="infos">
          <form onSubmit={handleSubmit} className="profile-form">
            <label>
              Full Name:
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>

            <label>
              Nationality:
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                list="country-list"
                placeholder="I am from..."
                required
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
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0"
                required
              />
            </label>

            <label>
              Gender:
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Country of Residence:
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                list="country-list"
                placeholder="I live in..."
                required
              />
            </label>

            <button type="submit">Save</button>
          </form>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}

export default ProfilePage;
