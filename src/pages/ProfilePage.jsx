import LogoutButton from '../components/Logout';

function ProfilePage() {
  return (
    <div>
      <h1>Mon Profil</h1>
      <p>Page privée : l’utilisateur doit être connecté pour accéder ici</p>
      <LogoutButton />
    </div>
  );
}

export default ProfilePage;
