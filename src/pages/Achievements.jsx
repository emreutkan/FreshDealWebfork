import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAchievementsThunk } from '@src/redux/thunks/achievementThunks';

const ACHIEVEMENT_ICONS = {
    'FIRST_PURCHASE': 'bi-trophy',
    'PURCHASE_COUNT': 'bi-basket',
    'WEEKLY_PURCHASE': 'bi-calendar',
    'STREAK': 'bi-fire',
    'BIG_SPENDER': 'bi-cash',
    'ECO_WARRIOR': 'bi-leaf',
    'DEFAULT': 'bi-award',
};

const AchievementCard = ({ achievement, index }) => {
    const isUnlocked = !!achievement.earned_at;
    const iconName = ACHIEVEMENT_ICONS[achievement.achievement_type] || ACHIEVEMENT_ICONS.DEFAULT;

    return (
        <div
            className="achievement-card"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className={`card-gradient ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className={`icon-container ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <i className={iconName} style={{ color: isUnlocked ? '#50703C' : '#aaaaaa' }}></i>
                </div>

                <div className="achievement-info">
                    <div className="achievement-header">
                        <h3 className={`achievement-name ${isUnlocked ? 'unlocked' : 'locked'}`}>
                            {achievement.name}
                        </h3>

                        {isUnlocked ? (
                            <div className="unlocked-badge">
                                <i className="bi bi-check-circle"></i>
                                <span>Earned</span>
                            </div>
                        ) : (
                            <i className="bi bi-lock"></i>
                        )}
                    </div>

                    <p className={`achievement-description ${isUnlocked ? 'unlocked' : 'locked'}`}>
                        {achievement.description}
                    </p>

                    {achievement.threshold && !isUnlocked && (
                        <div className="threshold-container">
                            <span className="threshold-text">
                                Goal: {achievement.threshold}
                            </span>
                        </div>
                    )}

                    {isUnlocked && achievement.earned_at && (
                        <span className="earned-date">
                            Earned on {new Date(achievement.earned_at).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const Achievements = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [refreshing, setRefreshing] = useState(false);

    const {
        achievements = [],
        loading: achievementsLoading
    } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUserAchievementsThunk());
    }, [dispatch]);

    const sortedAchievements = [...achievements].sort((a, b) => {
        const aUnlocked = !!a.earned_at;
        const bUnlocked = !!b.earned_at;

        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0;
    });

    const unlockedCount = sortedAchievements.filter(a => !!a.earned_at).length;

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(fetchUserAchievementsThunk())
            .finally(() => {
                setTimeout(() => setRefreshing(false), 500);
            });
    };

    return (
        <div className="achievements-container">
            <div className="header">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left"></i>
                </button>
                <h1 className="header-title">Achievements</h1>
                <div className="header-right"></div>
            </div>

            <div className="container">
                <div className="stats-container">
                    <div className="stat-box">
                        <span className="stat-value">{unlockedCount}</span>
                        <span className="stat-label">Unlocked</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-box">
                        <span className="stat-value">{achievements.length - unlockedCount}</span>
                        <span className="stat-label">Locked</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-box">
                        <span className="stat-value">
                            {achievements.length > 0
                                ? Math.round((unlockedCount / achievements.length) * 100)
                                : 0}%
                        </span>
                        <span className="stat-label">Complete</span>
                    </div>
                </div>

                {achievementsLoading && achievements.length === 0 ? (
                    <div className="loading-container">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="loading-text">Loading achievements...</p>
                    </div>
                ) : (
                    <div className="achievements-list">
                        {sortedAchievements.length > 0 ? (
                            sortedAchievements.map((achievement, index) => (
                                <AchievementCard
                                    key={achievement.id}
                                    achievement={achievement}
                                    index={index}
                                />
                            ))
                        ) : (
                            <div className="empty-container">
                                <i className="bi bi-award"></i>
                                <h2 className="empty-text">No achievements found</h2>
                                <p className="empty-subtext">
                                    Complete tasks to earn achievements
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .achievements-container {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                    padding-bottom: 30px;
                }
                
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px;
                    background-color: #FFFFFF;
                    border-bottom: 1px solid #f0f0f0;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                
                .back-button {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                
                .back-button:hover {
                    background-color: rgba(0,0,0,0.05);
                }
                
                .header-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin: 0;
                }
                
                .header-right {
                    width: 40px;
                }
                
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 16px;
                }
                
                .stats-container {
                    display: flex;
                    background-color: #FFFFFF;
                    margin-top: 16px;
                    border-radius: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    padding: 16px;
                }
                
                .stat-box {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .stat-divider {
                    width: 1px;
                    background-color: #f0f0f0;
                    margin: 0 8px;
                }
                
                .stat-value {
                    font-size: 24px;
                    font-weight: 600;
                    color: #50703C;
                }
                
                .stat-label {
                    font-size: 12px;
                    color: #666;
                    margin-top: 4px;
                }
                
                .achievements-list {
                    padding: 8px 0;
                    margin-top: 16px;
                }
                
                .achievement-card {
                    margin-bottom: 16px;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    animation: fadeInUp 0.5s ease forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }
                
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .card-gradient {
                    display: flex;
                    padding: 16px;
                    align-items: center;
                    background: linear-gradient(135deg, rgba(80, 112, 60, 0.05) 0%, rgba(80, 112, 60, 0.1) 100%);
                }
                
                .card-gradient.locked {
                    background: linear-gradient(135deg, rgba(200, 200, 200, 0.05) 0%, rgba(200, 200, 200, 0.1) 100%);
                }
                
                .icon-container {
                    width: 60px;
                    height: 60px;
                    border-radius: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 16px;
                    font-size: 28px;
                }
                
                .icon-container.unlocked {
                    background-color: rgba(80, 112, 60, 0.15);
                    border: 1px solid rgba(80, 112, 60, 0.3);
                }
                
                .icon-container.locked {
                    background-color: rgba(0, 0, 0, 0.05);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                }
                
                .achievement-info {
                    flex: 1;
                }
                
                .achievement-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4px;
                }
                
                .achievement-name {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0;
                }
                
                .achievement-name.unlocked {
                    color: #333;
                }
                
                .achievement-name.locked {
                    color: #999;
                }
                
                .achievement-description {
                    font-size: 14px;
                    margin-bottom: 4px;
                    line-height: 1.4;
                }
                
                .achievement-description.unlocked {
                    color: #555;
                }
                
                .achievement-description.locked {
                    color: #999;
                }
                
                .threshold-container {
                    background-color: rgba(0, 0, 0, 0.05);
                    padding: 4px 8px;
                    border-radius: 12px;
                    display: inline-block;
                }
                
                .threshold-text {
                    font-size: 12px;
                    color: #666;
                    font-weight: 500;
                }
                
                .earned-date {
                    font-size: 12px;
                    color: #50703C;
                    display: block;
                    margin-top: 4px;
                }
                
                .unlocked-badge {
                    display: flex;
                    align-items: center;
                    background-color: rgba(80, 112, 60, 0.15);
                    border-radius: 12px;
                    padding: 4px 8px;
                }
                
                .unlocked-badge i {
                    font-size: 10px;
                    color: #50703C;
                    margin-right: 4px;
                }
                
                .unlocked-badge span {
                    font-size: 10px;
                    color: #50703C;
                    font-weight: 500;
                }
                
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 300px;
                }
                
                .loading-text {
                    margin-top: 12px;
                    color: #666;
                }
                
                .empty-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 0;
                    text-align: center;
                }
                
                .empty-container i {
                    font-size: 64px;
                    color: #CCCCCC;
                }
                
                .empty-text {
                    font-size: 18px;
                    font-weight: 600;
                    color: #666;
                    margin-top: 16px;
                }
                
                .empty-subtext {
                    font-size: 14px;
                    color: #999;
                    margin-top: 8px;
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding: 0 12px;
                    }
                    
                    .icon-container {
                        width: 50px;
                        height: 50px;
                        border-radius: 25px;
                        font-size: 22px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Achievements;