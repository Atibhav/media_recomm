import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userAPI } from '../../services/api';

function UserProfile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({
    language: {
      primary: 'en',
      subtitle: 'en'
    },
    contentFilters: {
      maxRating: 'R',
      excludedGenres: [],
      adultContent: false
    },
    genrePreferences: {
      liked: [],
      disliked: []
    }
  });

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getPreferences(user.id);
        setPreferences(response.data);
      } catch (err) {
        setError('Failed to fetch user preferences');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPreferences();
  }, [user.id]);

  const handleLanguageChange = async (type, value) => {
    try {
      const newLanguagePrefs = {
        ...preferences.language,
        [type]: value
      };
      
      await userAPI.updateLanguage(user.id, newLanguagePrefs);
      setPreferences(prev => ({
        ...prev,
        language: newLanguagePrefs
      }));
    } catch (err) {
      console.error('Error updating language preferences:', err);
    }
  };

  const handleContentFilterChange = async (type, value) => {
    try {
      const newFilters = {
        ...preferences.contentFilters,
        [type]: value
      };
      
      await userAPI.updateFilters(user.id, newFilters);
      setPreferences(prev => ({
        ...prev,
        contentFilters: newFilters
      }));
    } catch (err) {
      console.error('Error updating content filters:', err);
    }
  };

  if (isLoading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-profile">
      <h1>Profile Settings</h1>
      
      <section className="preferences-section">
        <h2>Language Preferences</h2>
        <div className="preference-group">
          <label>
            Primary Language
            <select
              value={preferences.language.primary}
              onChange={(e) => handleLanguageChange('primary', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              {/* Add more languages as needed */}
            </select>
          </label>
        </div>
      </section>

      <section className="preferences-section">
        <h2>Content Filters</h2>
        <div className="preference-group">
          <label>
            Maximum Rating
            <select
              value={preferences.contentFilters.maxRating}
              onChange={(e) => handleContentFilterChange('maxRating', e.target.value)}
            >
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
            </select>
          </label>
        </div>

        <div className="preference-group">
          <label>
            <input
              type="checkbox"
              checked={preferences.contentFilters.adultContent}
              onChange={(e) => handleContentFilterChange('adultContent', e.target.checked)}
            />
            Show Adult Content
          </label>
        </div>
      </section>
    </div>
  );
}

export default UserProfile;