import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../services/service.config';
import LoadingSpinner from '../components/LoadingSpinner';
import '../components/PublicProfile.css';

function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await service.get(`/users/${userId}/public`);
        console.log('Backend response:', res.data);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (!profile) return <p>User not found</p>;

  return (
    <div className="public-profile">
      {profile.photoUrl && (
        <img
          src={profile.photoUrl}
          alt={profile.username}
          className="profile-pic"
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      )}

      <h2>{profile.username ?? 'Unknown User'}</h2>
      <div className="public-profile-infos">
        <p>Age: {profile.age ?? 'N/A'}</p>
        <p>Nationality: {profile.nationality ?? 'N/A'}</p>
        <p>Gender: {profile.gender ?? 'Not provided'}</p>
        <p>
          Country of Residence: {profile.countryOfResidence ?? 'Not provided'}
        </p>
        <p>About me: {profile.aboutMe ?? 'No description yet'}</p>
      </div>
    </div>
  );
}

export default PublicProfile;
