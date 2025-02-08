import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { watchlistAPI } from '../../services/api';
import MovieCard from '../dashboard/MovieCard';
import ErrorFallback from '../error/ErrorFallback';
import SkeletonLoader from '../common/SkeletonLoader';

function WatchlistPage() {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            setLoading(true);
            const response = await watchlistAPI.getWatchlist();
            setWatchlist(response.data);
        } catch (error) {
            console.error('Failed to fetch watchlist:', error);
            setError('Failed to load watchlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWatchlist = async (movieId) => {
        try {
            await watchlistAPI.removeFromWatchlist(movieId);
            setWatchlist(prevList => prevList.filter(movie => movie.id !== movieId));
        } catch (error) {
            console.error('Failed to remove from watchlist:', error);
            setError('Failed to remove movie from watchlist');
        }
    };

    if (loading) {
        return <SkeletonLoader count={4} />;
    }

    if (error) {
        return <ErrorFallback error={{ message: error }} resetError={() => setError(null)} />;
    }

    return (
        <div className="watchlist-page">
            <h1>My Watchlist</h1>
            {watchlist.length === 0 ? (
                <div className="empty-watchlist">
                    <p>Your watchlist is empty</p>
                </div>
            ) : (
                <div className="movie-grid">
                    {watchlist.map(movie => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            onRemoveFromWatchlist={handleRemoveFromWatchlist}
                            isInWatchlist={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default WatchlistPage;