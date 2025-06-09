import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@src/redux/slices/userSlice';
import { updateEmailThunk, updatePasswordThunk, updateUsernameThunk, getUserRankThunk } from '@src/redux/thunks/userThunks';
import { fetchUserAchievementsThunk } from '@src/redux/thunks/achievementThunks';

const Account = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const scrollY = useRef(0);

    const {
        name_surname,
        email,
        phoneNumber,
        loading,
        token,
        achievements = [],
        loading: achievementsLoading,
        rank,
        totalDiscount,
        rankLoading,
        userId
    } = useSelector((state) => state.user);

    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState({
        name_surname,
        email,
        phoneNumber,
    });
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setEditedValues({
            name_surname,
            email,
            phoneNumber,
        });
    }, [name_surname, email, phoneNumber]);

    useEffect(() => {
        dispatch(fetchUserAchievementsThunk());
        dispatch(getUserRankThunk(userId));
    }, [dispatch, userId]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        Promise.all([
            dispatch(fetchUserAchievementsThunk()),
            dispatch(getUserRankThunk(userId))
        ])
            .finally(() => {
                setTimeout(() => {
                    setRefreshing(false);
                }, 300);
            });
    }, [dispatch, userId]);

    const handleScroll = useCallback(() => {
        const currentScrollPos = window.pageYOffset;
        scrollY.current = currentScrollPos;

        // Add sticky header logic if needed
        const header = document.querySelector('.account-sticky-header');
        if (header) {
            if (currentScrollPos > 100) {
                header.classList.add('visible');
            } else {
                header.classList.remove('visible');
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch(logout());
            navigate('/login');
        }
    };

    const handleCancel = () => {
        setEditedValues({name_surname, email, phoneNumber});
        setIsEditing(false);
    };

    const handlePasswordReset = () => {
        const oldPassword = prompt('Enter your current password');
        if (oldPassword) {
            const newPassword = prompt('Enter your new password');
            if (newPassword) {
                dispatch(updatePasswordThunk({
                    old_password: oldPassword,
                    new_password: newPassword,
                }))
                    .then((resultAction) => {
                        if (updatePasswordThunk.fulfilled.match(resultAction)) {
                            alert('Password updated successfully');
                        } else {
                            alert(resultAction.payload || 'Failed to update password');
                        }
                    })
                    .catch(() => {
                        alert('Failed to update password');
                    });
            }
        }
    };

    const handleEditInfo = async () => {
        if (isEditing) {
            if (window.confirm('Do you want to save these changes?')) {
                const updates = [];
                if (editedValues.name_surname !== name_surname) {
                    updates.push(dispatch(updateUsernameThunk({username: editedValues.name_surname})));
                }
                if (editedValues.email !== email) {
                    updates.push(dispatch(updateEmailThunk({old_email: email, new_email: editedValues.email})));
                }
                if (updates.length > 0) {
                    try {
                        const results = await Promise.all(updates);
                        const hasErrors = results.some((result) => result.type.endsWith('/rejected'));
                        if (!hasErrors) {
                            alert('Profile updated successfully');
                            setIsEditing(false);
                        } else {
                            alert('Some updates failed. Please try again.');
                        }
                    } catch (error) {
                        alert('Failed to update profile');
                    }
                } else {
                    setIsEditing(false);
                }
            } else {
                handleCancel();
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleViewAchievements = () => {
        navigate('/achievements');
    };

    const handleDebugToken = () => {
        if (token) {
            console.log('[DEBUG][2025-04-06 20:08:58][emreutkan] AccountScreen: User Token:', token);
            alert('Token has been logged to console');
        } else {
            console.log('[DEBUG][2025-04-06 20:08:58][emreutkan] AccountScreen: No token found');
            alert('No token found');
        }
    };

    // ProfileSection Component
    const ProfileSection = () => {
        const getInitials = (name) => {
            if (!name) return "?";
            const parts = name.split(' ');
            if (parts.length >= 2) {
                return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        };

        return (
            <div className={`profile-section ${isEditing ? 'editing' : ''}`}>
                <div className="profile-header">
                    <div className={`avatar-container ${isEditing ? 'spin' : ''}`}>
                        <div className="avatar-gradient">
                            <span className="avatar-text">{getInitials(name_surname)}</span>
                        </div>
                    </div>

                    <div className="name-container">
                        {isEditing ? (
                            <div className="edit-container">
                                <i className="bi bi-pencil"></i>
                                <input
                                    type="text"
                                    className="name-input"
                                    value={editedValues.name_surname}
                                    onChange={(e) => setEditedValues(prev => ({...prev, name_surname: e.target.value}))}
                                    placeholder="Full Name"
                                />
                            </div>
                        ) : (
                            <div>
                                <span className="name-label">ACCOUNT NAME</span>
                                <h2 className="name">{name_surname}</h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // RankingCard Component
    const RankingCard = () => {
        const getRankMedalColor = () => {
            if (rank <= 3) return '#FFD700'; // Gold
            if (rank <= 10) return '#C0C0C0'; // Silver
            if (rank <= 20) return '#CD7F32'; // Bronze
            return '#50703C'; // Default green
        };

        return (
            <div className="ranking-card">
                <div className="ranking-header">
                    <div className="title-container">
                        <i className="bi bi-trophy"></i>
                        <h3 className="title">Your Ranking</h3>
                    </div>
                    <button className="view-all-button" onClick={() => navigate('/rankings')}>
                        <span>View All</span>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>

                {rankLoading ? (
                    <div className="loading-container">
                        <div className="spinner-border spinner-border-sm text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="ranking-content">
                        <div className="rank-section">
                            <div className="medal-container" style={{borderColor: getRankMedalColor()}}>
                                <i className="bi bi-award" style={{color: getRankMedalColor()}}></i>
                            </div>
                            <div className="rank-text-container">
                                <span className="rank-label">Current Rank</span>
                                <span className="rank-text">#{rank}</span>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="savings-section">
                            <div className="savings-icon-container">
                                <i className="bi bi-wallet2"></i>
                            </div>
                            <div>
                                <span className="savings-label">Total Savings</span>
                                <span className="savings-text">{Math.abs(totalDiscount).toFixed(2)} TL</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // AchievementsSection Component
    const AchievementsSection = () => {
        const ACHIEVEMENT_ICONS = {
            'FIRST_PURCHASE': 'trophy',
            'PURCHASE_COUNT': 'basket',
            'WEEKLY_PURCHASE': 'calendar-week',
            'STREAK': 'fire',
            'BIG_SPENDER': 'cash-coin',
            'ECO_WARRIOR': 'tree',
            'DEFAULT': 'award',
        };

        const sortedAchievements = [...(achievements || [])].sort((a, b) => {
            const aUnlocked = !!a.earned_at;
            const bUnlocked = !!b.earned_at;

            if (aUnlocked && !bUnlocked) return -1;
            if (!aUnlocked && bUnlocked) return 1;
            return 0;
        });

        console.log("[DEBUG][2025-04-06 20:02:59][emreutkan] AchievementsSection: Sorted achievements - Unlocked count:",
            sortedAchievements.filter(a => !!a.earned_at).length);

        const unlockedCount = sortedAchievements.filter(a => !!a.earned_at).length;

        const AchievementItem = ({ achievement, index }) => {
            const iconName = ACHIEVEMENT_ICONS[achievement.achievement_type] || ACHIEVEMENT_ICONS.DEFAULT;
            const isUnlocked = !!achievement.earned_at;

            return (
                <div
                    className={`achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}`}
                    style={{animationDelay: `${index * 150}ms`}}
                >
                    <div className="badge-gradient">
                        <div className={`badge-icon-container ${isUnlocked ? 'unlocked' : 'locked'}`}>
                            <i className={`bi bi-${iconName}`}></i>
                        </div>

                        <span className={`achievement-name ${isUnlocked ? 'unlocked' : 'locked'}`}>
                            {achievement.name}
                        </span>

                        {achievement.threshold && !isUnlocked && (
                            <span className="threshold-text">
                                Goal: {achievement.threshold}
                            </span>
                        )}

                        {isUnlocked && (
                            <div className="unlocked-badge">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Earned</span>
                            </div>
                        )}

                        {!isUnlocked && (
                            <div className="locked-icon-wrapper">
                                <i className="bi bi-lock"></i>
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        return (
            <div className="achievements-section">
                <div className="section-header">
                    <div className="header-left-section">
                        <i className="bi bi-award"></i>
                        <h3 className="section-title">Achievements</h3>

                        <div className="achievement-count-container">
                            <span className="achievement-count">
                                {unlockedCount}/{achievements.length}
                            </span>
                        </div>
                    </div>

                    <button
                        className="view-all-button"
                        onClick={handleViewAchievements}
                    >
                        <span>View All</span>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>

                <div className="achievements-scroll">
                    {sortedAchievements.map((achievement, index) => (
                        <AchievementItem
                            key={achievement.id}
                            achievement={achievement}
                            index={index}
                        />
                    ))}

                    {sortedAchievements.length === 0 && (
                        <div className="empty-state-container">
                            <i className="bi bi-award"></i>
                            <span>No achievements yet</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // InfoCards Component
    const InfoCards = () => {
        return (
            <div className={`info-cards ${isEditing ? 'editing' : ''}`}>
                <div className="section-header">
                    <i className="bi bi-info-circle"></i>
                    <h3 className="section-title">Contact Information</h3>
                </div>

                <div className="card">
                    <div className="card-icon">
                        <i className="bi bi-envelope"></i>
                    </div>
                    <div className="card-content">
                        <span className="card-label">Email Address</span>
                        {isEditing ? (
                            <input
                                type="email"
                                className="card-input"
                                value={editedValues.email}
                                onChange={(e) => setEditedValues({...editedValues, email: e.target.value})}
                                placeholder="Enter your email"
                            />
                        ) : (
                            <span className="card-value">{email || 'No email provided'}</span>
                        )}
                    </div>
                </div>

                <div className="card last-card">
                    <div className="card-icon">
                        <i className="bi bi-telephone"></i>
                    </div>
                    <div className="card-content">
                        <span className="card-label">Phone Number</span>
                        <span className="card-value">{phoneNumber || 'No phone number provided'}</span>
                    </div>
                </div>
            </div>
        );
    };

    // OrdersSection Component
    const OrdersSection = () => {
        return (
            <div className="order-section">
                <div className="section-header">
                    <i className="bi bi-receipt"></i>
                    <h3 className="section-title">Your Orders</h3>
                </div>

                <div
                    className="order-item"
                    onClick={() => navigate('/orders', { state: { status: 'active' } })}
                >
                    <div className="item-content">
                        <div className="icon-container">
                            <i className="bi bi-clock-history"></i>
                        </div>
                        <div className="text-content">
                            <h4 className="item-title">Order History</h4>
                            <span className="item-subtitle">View active and previous orders</span>
                        </div>
                    </div>
                    <i className="bi bi-chevron-right"></i>
                </div>
            </div>
        );
    };

    // ActionsSection Component
    const ActionsSection = () => {
        const ActionButton = ({ icon, label, color = "#50703C", onPress, destructive, isActive }) => {
            return (
                <button
                    className={`action-item ${destructive ? 'destructive' : ''} ${isActive ? 'active' : ''}`}
                    onClick={onPress}
                    style={{
                        '--action-color': color
                    }}
                >
                    <div
                        className={`action-icon-container ${isActive ? 'active' : ''}`}
                        style={{
                            backgroundColor: isActive ? `${color}30` : `${color}10`
                        }}
                    >
                        <i className={`bi bi-${icon}`} style={{ color }}></i>
                    </div>
                    <span className={`action-text ${destructive ? 'destructive' : ''} ${isActive ? 'active' : ''}`}>
                        {isActive && label.includes("Edit") ? "Save Profile" : label}
                    </span>
                    <i
                        className="bi bi-chevron-right"
                        style={{ color: destructive ? "#D32F2F" : isActive ? color : "#CCCCCC" }}
                    ></i>
                </button>
            );
        };

        return (
            <div className="actions-section">
                <div className="section-header">
                    <i className="bi bi-gear"></i>
                    <h3 className="section-title">Account Settings</h3>
                </div>

                <ActionButton
                    icon="person"
                    label="Edit Profile"
                    onPress={handleEditInfo}
                    isActive={isEditing}
                />

                <ActionButton
                    icon="lock"
                    label="Change Password"
                    onPress={handlePasswordReset}
                />

                <ActionButton
                    icon="bug"
                    label="Debug Token"
                    color="#4285F4"
                    onPress={handleDebugToken}
                />

                <ActionButton
                    icon="box-arrow-right"
                    label="Logout"
                    color="#D32F2F"
                    onPress={handleLogout}
                    destructive
                />
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="account-main-container">
            <div className="account-sticky-header">
                <div className="container">
                    <h2>Account</h2>
                </div>
            </div>

            <div className="container">
                <div className="account-content">
                    <div className="refresh-indicator">
                        {refreshing && (
                            <div className="spinner-border spinner-border-sm text-success" role="status">
                                <span className="visually-hidden">Refreshing...</span>
                            </div>
                        )}
                    </div>

                    <ProfileSection />

                    <RankingCard />

                    {achievementsLoading ? (
                        <div className="loading-section">
                            <div className="spinner-border spinner-border-sm text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <span className="loading-text">Loading achievements...</span>
                        </div>
                    ) : (
                        <AchievementsSection />
                    )}

                    <InfoCards />
                    <OrdersSection />
                    <ActionsSection />
                </div>
            </div>

            <style>{`
                .account-main-container {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                    padding-bottom: 40px;
                    padding-top: 20px;
                }

                .account-sticky-header {
                    position: fixed;
                    top: -70px;
                    left: 0;
                    right: 0;
                    background-color: #fff;
                    z-index: 999;
                    padding: 15px 0;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: top 0.3s;
                }

                .account-sticky-header.visible {
                    top: 0;
                }

                .account-sticky-header h2 {
                    margin: 0;
                    font-weight: 600;
                    font-size: 22px;
                }

                .refresh-indicator {
                    display: flex;
                    justify-content: center;
                    padding-top: 10px;
                    padding-bottom: 10px;
                }

                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                }

                .loading-section {
                    height: 150px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 16px;
                    background-color: white;
                    border-radius: 16px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .loading-text {
                    margin-top: 8px;
                    color: #666;
                }

                .account-content {
                    max-width: 800px;
                    margin: 0 auto;
                }

                /* Profile Section Styles */
                .profile-section {
                    margin-bottom: 24px;
                    transition: transform 0.3s;
                }

                .profile-section.editing {
                    transform: scale(1.01);
                }

                .profile-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .avatar-container {
                    width: 80px;
                    height: 80px;
                    border-radius: 40px;
                    margin-right: 20px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                    transition: transform 0.3s;
                }

                .avatar-container.spin {
                    animation: spin 0.5s ease;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .avatar-gradient {
                    width: 100%;
                    height: 100%;
                    border-radius: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #50703C 0%, #3d5a2c 100%);
                }

                .profile-section.editing .avatar-gradient {
                    background: linear-gradient(135deg, #50703C 0%, #7fa25c 100%);
                }

                .avatar-text {
                    color: white;
                    font-size: 28px;
                    font-weight: 600;
                }

                .name-container {
                    flex: 1;
                }

                .name-label {
                    font-size: 12px;
                    color: #777;
                    margin-bottom: 4px;
                    letter-spacing: 0.5px;
                    display: block;
                }

                .name {
                    font-size: 24px;
                    font-weight: 600;
                    color: #333;
                    margin: 0;
                }

                .edit-container {
                    display: flex;
                    align-items: center;
                    border-bottom: 2px solid #50703C;
                    padding-bottom: 6px;
                }

                .edit-container i {
                    margin-right: 8px;
                    color: #50703C;
                }

                .name-input {
                    flex: 1;
                    font-size: 20px;
                    font-weight: 500;
                    color: #333;
                    padding: 0;
                    border: none;
                    background: transparent;
                    outline: none;
                }

                /* Ranking Card Styles */
                .ranking-card {
                    background: linear-gradient(135deg, rgba(80, 112, 60, 0.05) 0%, rgba(80, 112, 60, 0.15) 100%);
                    border-radius: 16px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                }

                .ranking-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                }

                .title-container {
                    display: flex;
                    align-items: center;
                }

                .title-container i {
                    font-size: 20px;
                    color: #50703C;
                }

                .title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin: 0 0 0 8px;
                }

                .view-all-button {
                    display: flex;
                    align-items: center;
                    background-color: rgba(80, 112, 60, 0.1);
                    padding: 6px 12px;
                    border-radius: 20px;
                    border: none;
                    color: #50703C;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                }

                .view-all-button span {
                    margin-right: 4px;
                }

                .ranking-content {
                    padding: 0 20px 20px;
                }

                .rank-section {
                    display: flex;
                    align-items: center;
                    margin-top: 8px;
                }

                .medal-container {
                    width: 60px;
                    height: 60px;
                    border-radius: 30px;
                    background-color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 2px solid;
                    margin-right: 16px;
                }

                .medal-container i {
                    font-size: 32px;
                }

                .rank-text-container {
                    flex: 1;
                }

                .rank-label {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 4px;
                    display: block;
                }

                .rank-text {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333;
                    display: block;
                }

                .divider {
                    height: 1px;
                    background-color: rgba(0,0,0,0.08);
                    margin: 16px 0;
                }

                .savings-section {
                    display: flex;
                    align-items: center;
                }

                .savings-icon-container {
                    width: 42px;
                    height: 42px;
                    border-radius: 21px;
                    background-color: rgba(80, 112, 60, 0.15);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 16px;
                }

                .savings-icon-container i {
                    font-size: 20px;
                    color: #50703C;
                }

                .savings-label {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 4px;
                    display: block;
                }

                .savings-text {
                    font-size: 20px;
                    font-weight: 600;
                    color: #50703C;
                    display: block;
                }

                /* Achievements Section Styles */
                .achievements-section {
                    background-color: white;
                    border-radius: 16px;
                    padding: 16px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .section-header i {
                    font-size: 20px;
                    color: #50703C;
                }

                .section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin: 0 0 0 8px;
                }

                .header-left-section {
                    display: flex;
                    align-items: center;
                    flex: 1;
                }

                .achievement-count-container {
                    background-color: #f0f0f0;
                    border-radius: 12px;
                    padding: 2px 8px;
                    margin-left: 10px;
                }

                .achievement-count {
                    color: #666;
                    font-size: 12px;
                    font-weight: 500;
                }

                .achievements-scroll {
                    display: flex;
                    overflow-x: auto;
                    padding-bottom: 12px;
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }

                .achievements-scroll::-webkit-scrollbar {
                    display: none;
                }

                .achievement-badge {
                    width: 130px;
                    min-width: 130px;
                    height: 160px;
                    margin-right: 12px;
                    border-radius: 16px;
                    overflow: hidden;
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

                .badge-gradient {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    position: relative;
                    background: linear-gradient(135deg, rgba(80, 112, 60, 0.05) 0%, rgba(80, 112, 60, 0.15) 100%);
                }

                .achievement-badge.locked .badge-gradient {
                    background: linear-gradient(135deg, rgba(200, 200, 200, 0.05) 0%, rgba(200, 200, 200, 0.15) 100%);
                }

                .badge-icon-container {
                    width: 60px;
                    height: 60px;
                    border-radius: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .badge-icon-container.unlocked {
                    background-color: rgba(80, 112, 60, 0.15);
                    border: 1px solid rgba(80, 112, 60, 0.3);
                }

                .badge-icon-container.locked {
                    background-color: rgba(0, 0, 0, 0.05);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                }

                .badge-icon-container i {
                    font-size: 26px;
                }

                .badge-icon-container.unlocked i {
                    color: #50703C;
                }

                .badge-icon-container.locked i {
                    color: #aaaaaa;
                }

                .achievement-name {
                    font-size: 14px;
                    text-align: center;
                    font-weight: 600;
                    margin-bottom: 6px;
                }

                .achievement-name.unlocked {
                    color: #333;
                }

                .achievement-name.locked {
                    color: #999;
                }

                .threshold-text {
                    font-size: 12px;
                    color: #777;
                    text-align: center;
                }

                .unlocked-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    display: flex;
                    align-items: center;
                    background-color: rgba(80, 112, 60, 0.15);
                    border-radius: 12px;
                    padding: 4px 8px;
                }

                .unlocked-badge i {
                    font-size: 10px;
                    color: #50703C;
                    margin-right: 2px;
                }

                .unlocked-badge span {
                    font-size: 10px;
                    color: #50703C;
                    font-weight: 500;
                }

                .locked-icon-wrapper {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    color: #aaaaaa;
                    font-size: 14px;
                }

                .empty-state-container {
                    width: 200px;
                    height: 160px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .empty-state-container i {
                    font-size: 36px;
                    color: #CCCCCC;
                    margin-bottom: 12px;
                }

                .empty-state-container span {
                    font-size: 14px;
                    color: #999;
                }

                /* Info Cards Styles */
                .info-cards {
                    background-color: white;
                    border-radius: 16px;
                    padding: 16px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    transition: transform 0.3s;
                }

                .info-cards.editing {
                    transform: scale(1.01);
                }

                .card {
                    display: flex;
                    align-items: center;
                    padding: 14px 0;
                    border-bottom: 1px solid #f0f0f0;
                }

                .last-card {
                    border-bottom: none;
                }

                .card-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 21px;
                    background-color: rgba(80, 112, 60, 0.1);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 16px;
                }

                .card-icon i {
                    font-size: 20px;
                    color: #50703C;
                }

                .card-content {
                    flex: 1;
                }

                .card-label {
                    font-size: 12px;
                    color: #777;
                    margin-bottom: 4px;
                    display: block;
                }

                .card-value {
                    font-size: 16px;
                    color: #333;
                    font-weight: 500;
                }

                .card-input {
                    width: 100%;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 8px;
                    background-color: #f9f9f9;
                    font-size: 16px;
                    outline: none;
                }

                /* Orders Section Styles */
                .order-section {
                    background-color: white;
                    border-radius: 16px;
                    padding: 16px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    transition: transform 0.3s;
                }

                .order-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 0;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .order-item:hover {
                    transform: translateY(-2px);
                }

                .order-item:active {
                    transform: scale(0.98);
                }

                .item-content {
                    display: flex;
                    align-items: center;
                    flex: 1;
                }

                .icon-container {
                    width: 42px;
                    height: 42px;
                    border-radius: 21px;
                    background-color: rgba(80, 112, 60, 0.1);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 16px;
                }

                .icon-container i {
                    font-size: 20px;
                    color: #50703C;
                }

                .text-content {
                    flex: 1;
                }

                .item-title {
                    font-size: 16px;
                    color: #333;
                    font-weight: 500;
                    margin: 0 0 4px 0;
                }

                .item-subtitle {
                    font-size: 12px;
                    color: #777;
                }

                .order-item i.bi-chevron-right {
                    font-size: 20px;
                    color: #50703C;
                }

                /* Actions Section Styles */
                .actions-section {
                    background-color: white;
                    border-radius: 16px;
                    padding: 16px;
                    margin-bottom: 16px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .action-item {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding: 14px 0;
                    border: none;
                    background: transparent;
                    border-bottom: 1px solid #f0f0f0;
                    text-align: left;
                    cursor: pointer;
                    transition: transform 0.2s, background-color 0.2s;
                    outline: none;
                }

                .action-item:hover {
                    background-color: rgba(0, 0, 0, 0.02);
                }

                .action-item:active {
                    transform: scale(0.99);
                }

                .action-item.destructive {
                    border-bottom: none;
                }

                .action-item.active {
                    background-color: rgba(80, 112, 60, 0.05);
                    border-radius: 12px;
                    margin: 4px 0;
                    padding: 14px 8px;
                }

                .action-icon-container {
                    width: 42px;
                    height: 42px;
                    border-radius: 21px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 14px;
                }

                .action-text {
                    flex: 1;
                    font-size: 16px;
                    color: #333;
                    font-weight: 500;
                }

                .action-text.destructive {
                    color: #D32F2F;
                }

                .action-text.active {
                    color: #50703C;
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .account-main-container {
                        padding-top: 10px;
                    }

                    .account-content {
                        padding: 0 15px;
                    }

                    .profile-header {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .avatar-container {
                        margin-right: 0;
                        margin-bottom: 16px;
                    }

                    .name-container {
                        width: 100%;
                        text-align: center;
                    }

                    .achievements-scroll {
                        padding-bottom: 8px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Account;