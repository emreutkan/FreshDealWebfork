import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

// This would normally be imported from Redux store, but for this implementation
// I'll include mock functions and state handling
const fetchPunishmentHistory = (restaurantId) => {
    return {
        type: 'punishment/fetchHistory',
        payload: restaurantId
    };
};

const clearPunishmentHistory = () => {
    return {
        type: 'punishment/clearHistory'
    };
};

const PunishmentHistorySection = ({ restaurantId }) => {
    const dispatch = useDispatch();

    // This would be connected to real Redux state
    // For now using a simple mock state
    const punishmentHistory = useSelector((state) =>
        state.restaurant?.selectedRestaurant?.punishmentHistory || []
    );
    const loading = useSelector((state) => state.restaurant?.punishmentHistoryLoading || false);
    const error = useSelector((state) => state.restaurant?.punishmentHistoryError || null);

    useEffect(() => {
        dispatch(fetchPunishmentHistory(restaurantId));

        return () => {
            dispatch(clearPunishmentHistory());
        };
    }, [dispatch, restaurantId]);

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
        } catch(e) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading punishment history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="alert alert-danger">
                    <p className="mb-2">Error: {error}</p>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => dispatch(fetchPunishmentHistory(restaurantId))}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="punishment-history-section">
            <h4 className="section-title">Punishment History</h4>

            {punishmentHistory && punishmentHistory.length > 0 ? (
                <div className="punishment-list">
                    {punishmentHistory.map((item) => {
                        if (item.is_reverted) return null;

                        return (
                            <div key={item.id} className="punishment-item">
                                <div className="punishment-header">
                                    <h5 className="punishment-type">{item.type}</h5>
                                </div>
                                <p className="reason-text">{item.reason}</p>
                                <div className="punishment-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Duration:</span>
                                        <span className="detail-value">{item.duration_days} days</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Start Date:</span>
                                        <span className="detail-value">{formatDate(item.start_date)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">End Date:</span>
                                        <span className="detail-value">{formatDate(item.end_date)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <p className="empty-text">No punishment history found</p>
                </div>
            )}

            <style>{`
                .punishment-history-section {
                    margin-top: 1.5rem;
                    padding: 1rem;
                }
                
                .section-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                
                .punishment-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .punishment-item {
                    background-color: #fff;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: 1px solid #e0e0e0;
                }
                
                .punishment-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .punishment-type {
                    font-weight: 600;
                    font-size: 1rem;
                    color: #333;
                    margin: 0;
                }
                
                .reason-text {
                    font-size: 1rem;
                    margin-bottom: 1rem;
                    color: #333;
                }
                
                .punishment-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .detail-row {
                    display: flex;
                }
                
                .detail-label {
                    font-weight: 500;
                    color: #666;
                    width: 100px;
                    flex-shrink: 0;
                }
                
                .detail-value {
                    color: #333;
                }
                
                .empty-state {
                    padding: 2rem;
                    text-align: center;
                    background-color: #f8f8f8;
                    border-radius: 0.5rem;
                }
                
                .empty-text {
                    color: #888;
                    font-size: 1rem;
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

export default PunishmentHistorySection;
