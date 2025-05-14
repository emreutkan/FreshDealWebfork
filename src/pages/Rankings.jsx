import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserRankingsThunk } from '@src/redux/thunks/userThunks';

const Rankings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { rankings, rankingsLoading, userId } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserRankingsThunk());
        console.log("Rankings in component:", rankings);
    }, [dispatch]);

    const handleBack = () => {
        navigate(-1);
    };

    const hasRankings = Array.isArray(rankings) && rankings.length > 0;

    const getMedalIcon = (rank) => {
        switch (rank) {
            case 1:
                return { icon: 'bi-trophy-fill', color: '#FFD700' };
            case 2:
                return { icon: 'bi-trophy-fill', color: '#C0C0C0' };
            case 3:
                return { icon: 'bi-trophy-fill', color: '#CD7F32' };
            default:
                return { icon: 'bi-trophy', color: '#50703C' };
        }
    };

    return (
        <div className="rankings-container">
            <div className="rankings-header">
                <button className="back-button" onClick={handleBack}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <h1 className="header-title">Leaderboard</h1>
                <div className="placeholder"></div>
            </div>

            <div className="content-container">
                <div className="info-card">
                    <i className="bi bi-trophy-fill"></i>
                    <span className="info-text">Earn rewards by purchasing discounted items</span>
                </div>

                <div className="list-header">
                    <div className="rank-header-text">Rank</div>
                    <div className="user-header-text">User</div>
                    <div className="savings-header-text">Savings</div>
                </div>

                {rankingsLoading ? (
                    <div className="loading-container">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="loading-text">Loading rankings...</p>
                    </div>
                ) : (
                    hasRankings ? (
                        <div className="rankings-list">
                            {rankings.map(item => {
                                const isCurrentUser = item.user_id === userId;
                                const { icon, color } = getMedalIcon(item.rank);

                                return (
                                    <div
                                        key={item.user_id}
                                        className={`rank-item ${isCurrentUser ? 'current-user-item' : ''}`}
                                    >
                                        <div className="rank-number-container">
                                            <i className={icon} style={{ color }}></i>
                                            <span className="rank-number">#{item.rank}</span>
                                        </div>

                                        <div className="user-info">
                                            <span className="user-name">{item.user_name}</span>
                                            {isCurrentUser && (
                                                <span className="current-user">(You)</span>
                                            )}
                                        </div>

                                        <div className="discount-container">
                                            <span className="discount-amount">{Math.abs(item.total_discount).toFixed(2)} TL</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-container">
                            <i className="bi bi-trophy" style={{ fontSize: '64px', color: '#ccc' }}></i>
                            <p className="empty-text">No rankings available</p>
                        </div>
                    )
                )}
            </div>

            <style jsx>{`
                .rankings-container {
                    min-height: 100vh;
                    background-color: #FFFFFF;
                    display: flex;
                    flex-direction: column;
                }
                
                .rankings-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px;
                    background-color: #FFFFFF;
                    border-bottom: 1px solid #F3F4F6;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                
                .back-button {
                    padding: 8px;
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #333;
                    cursor: pointer;
                }
                
                .header-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                }
                
                .placeholder {
                    width: 40px;
                }
                
                .content-container {
                    flex: 1;
                    padding: 16px;
                    background-color: #FFFFFF;
                    max-width: 800px;
                    margin: 0 auto;
                    width: 100%;
                }
                
                .info-card {
                    display: flex;
                    align-items: center;
                    background-color: #F0F9EB;
                    padding: 16px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                }
                
                .info-card i {
                    font-size: 24px;
                    color: #50703C;
                }
                
                .info-text {
                    flex: 1;
                    margin-left: 12px;
                    font-size: 14px;
                    color: #50703C;
                    font-weight: 500;
                }
                
                .list-header {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #E5E7EB;
                    margin-bottom: 12px;
                }
                
                .rank-header-text {
                    flex: 1;
                    font-size: 14px;
                    font-weight: 600;
                    color: #6B7280;
                    text-align: left;
                }
                
                .user-header-text {
                    flex: 2;
                    font-size: 14px;
                    font-weight: 600;
                    color: #6B7280;
                }
                
                .savings-header-text {
                    flex: 1;
                    font-size: 14px;
                    font-weight: 600;
                    color: #6B7280;
                    text-align: right;
                }
                
                .loading-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 50px 0;
                }
                
                .loading-text {
                    margin-top: 16px;
                    color: #6B7280;
                }
                
                .rankings-list {
                    padding-bottom: 16px;
                }
                
                .rank-item {
                    display: flex;
                    align-items: center;
                    background-color: white;
                    padding: 16px;
                    border-radius: 12px;
                    margin-bottom: 10px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .rank-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                
                .current-user-item {
                    background-color: #F0F9EB;
                    border: 1px solid #50703C;
                }
                
                .rank-number-container {
                    flex: 1;
                    display: flex;
                    align-items: center;
                }
                
                .rank-number-container i {
                    font-size: 24px;
                    margin-right: 4px;
                }
                
                .rank-number {
                    font-size: 16px;
                    font-weight: 600;
                    color: #374151;
                }
                
                .user-info {
                    flex: 2;
                    display: flex;
                    align-items: center;
                }
                
                .user-name {
                    font-size: 16px;
                    font-weight: 500;
                    color: #111827;
                }
                
                .current-user {
                    font-size: 14px;
                    color: #50703C;
                    margin-left: 8px;
                    font-style: italic;
                }
                
                .discount-container {
                    flex: 1;
                    text-align: right;
                }
                
                .discount-amount {
                    font-size: 16px;
                    font-weight: 600;
                    color: #50703C;
                }
                
                .empty-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding-top: 40px;
                }
                
                .empty-text {
                    margin-top: 16px;
                    font-size: 18px;
                    color: #6B7280;
                }
                
                @media (max-width: 576px) {
                    .header-title {
                        font-size: 18px;
                    }
                    
                    .rank-item {
                        padding: 12px;
                    }
                    
                    .user-name, .rank-number, .discount-amount {
                        font-size: 14px;
                    }
                    
                    .current-user {
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Rankings;