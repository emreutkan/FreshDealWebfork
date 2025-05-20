import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getRestaurantCommentAnalysisThunk,
    getRestaurantCommentsThunk
} from '../redux/thunks/restaurantThunks';

// Component for displaying badges in comments
const BadgeItem = ({ badge }) => {
    const badgeColor = badge.is_positive ? '#50703C' : '#D32F2F';
    const backgroundColor = badge.is_positive ? '#F0F9EB' : '#FFEBEE';
    const iconName = badge.is_positive ? "check-circle" : "cancel";

    const formatBadgeName = (name) => {
        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="badge" style={{ backgroundColor }}>
            <i className={`bi bi-${iconName}`} style={{ color: badgeColor, marginRight: '4px', fontSize: '14px' }}></i>
            <span style={{ color: badgeColor, fontWeight: '500', fontSize: '12px' }}>
        {formatBadgeName(badge.name)}
      </span>
        </div>
    );
};

// Component for a single comment card
const CommentCard = ({ comment }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className={`comment-card ${comment.should_highlight ? 'highlighted-comment' : ''}`}>
            {comment.should_highlight && (
                <div className="highlight-badge">
                    <i className="bi bi-star"></i> Notable Comment
                </div>
            )}
            <div className="comment-header">
                <div className="user-info">
                    <div className="avatar-container">
                        <i className="bi bi-person"></i>
                    </div>
                    <span className="user-name">User {comment.user_id}</span>
                </div>
                <span className="comment-date">{formatDate(comment.timestamp)}</span>
            </div>

            <div className="rating-container">
                {[...Array(5)].map((_, index) => (
                    <i
                        key={index}
                        className={`bi bi-star${index < comment.rating ? '-fill' : ''}`}
                        style={{ color: '#FFD700', marginRight: '2px', fontSize: '16px' }}
                    ></i>
                ))}
                <span className="rating-text">{comment.rating.toFixed(1)}</span>
            </div>

            <p className="comment-text">{comment.comment}</p>

            {comment.badges && comment.badges.length > 0 && (
                <div className="badges-container">
                    {comment.badges.map((badge, index) => (
                        <BadgeItem key={`${comment.id}-badge-${index}`} badge={badge} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Component for displaying comment analysis sections
const CommentAnalysisCard = ({ aspectType, aspects, title, iconName }) => {
    if (!aspects || aspects.length === 0) return null;

    return (
        <div className={`analysis-card ${aspectType === 'good' ? 'good-aspects-card' : 'bad-aspects-card'}`}>
            <div className="aspects-header">
                <i
                    className={`bi bi-${iconName}`}
                    style={{
                        fontSize: '24px',
                        color: aspectType === 'good' ? '#50703C' : '#D32F2F'
                    }}
                ></i>
                <h3 className={`aspects-title ${aspectType === 'good' ? 'good-title' : 'bad-title'}`}>
                    {title}
                </h3>
            </div>
            <div className="aspects-list">
                {aspects.map((aspect, index) => (
                    <div key={index} className="aspect-item">
                        <i
                            className={`bi bi-${aspectType === 'good' ? 'check-circle' : 'exclamation-circle'}`}
                            style={{
                                fontSize: '16px',
                                color: aspectType === 'good' ? '#50703C' : '#D32F2F',
                                marginRight: '12px',
                                marginTop: '2px'
                            }}
                        ></i>
                        <span className="aspect-text">{aspect}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main restaurant comments component
const RestaurantComments = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [refreshing, setRefreshing] = useState(false);
    const [showAnalysisDetails, setShowAnalysisDetails] = useState(false);

    const restaurant = useSelector((state) => state.restaurant.selectedRestaurant);
    const {
        commentAnalysis,
        commentAnalysisLoading,
        commentAnalysisError,
        comments,
        commentsLoading
    } = useSelector((state) => state.restaurant);

    useEffect(() => {
        if (id) {
            dispatch(getRestaurantCommentsThunk(id));
            dispatch(getRestaurantCommentAnalysisThunk(id));
        }
    }, [id, dispatch]);

    const onRefresh = () => {
        setRefreshing(true);

        if (id) {
            Promise.all([
                dispatch(getRestaurantCommentsThunk(id)),
                dispatch(getRestaurantCommentAnalysisThunk(id))
            ]).finally(() => setRefreshing(false));
        } else {
            setRefreshing(false);
        }
    };

    const toggleAnalysisDetails = () => {
        setShowAnalysisDetails(!showAnalysisDetails);
    };

    const renderAnalysisSummary = () => {
        if (commentAnalysisLoading) {
            return (
                <div className="analysis-loading">
                    <div className="spinner-border spinner-border-sm text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="analysis-loading-text">Analyzing reviews...</span>
                </div>
            );
        }

        if (commentAnalysisError) {
            return (
                <button
                    className="analysis-error"
                    onClick={() => {
                        if (id) {
                            dispatch(getRestaurantCommentAnalysisThunk(id));
                        }
                    }}
                >
                    <i className="bi bi-arrow-repeat" style={{ color: '#D32F2F', fontSize: '20px' }}></i>
                    <span className="analysis-error-text">Error loading analysis. Click to retry.</span>
                </button>
            );
        }

        if (!commentAnalysis || commentAnalysis.comment_count === 0) {
            return (
                <div className="analysis-unavailable">
                    <i className="bi bi-graph-down" style={{ color: '#757575', fontSize: '22px' }}></i>
                    <span className="analysis-unavailable-text">
            Not enough reviews for analysis
          </span>
                </div>
            );
        }

        return (
            <button
                className="analysis-summary"
                onClick={toggleAnalysisDetails}
            >
                <div className="analysis-summary-gradient">
                    <div className="analysis-summary-content">
                        <div className="analysis-summary-icon-container">
                            <i className="bi bi-graph-up" style={{ fontSize: '24px', color: '#50703C' }}></i>
                        </div>
                        <div className="analysis-summary-text-container">
                            <h3 className="analysis-summary-title">AI Review Analysis</h3>
                            <p className="analysis-summary-subtitle">
                                Based on {commentAnalysis.comment_count} reviews
                            </p>
                        </div>
                        <i
                            className={`bi bi-chevron-${showAnalysisDetails ? "up" : "down"}`}
                            style={{ fontSize: '24px', color: '#50703C' }}
                        ></i>
                    </div>
                </div>
            </button>
        );
    };

    // First sort by highlighted comments, then by date
    const sortedComments = [...(comments || [])].sort((a, b) => {
        if (a.should_highlight && !b.should_highlight) return -1;
        if (!a.should_highlight && b.should_highlight) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return (
        <div className="restaurant-comments-container">
            <div className="comments-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <i className="bi bi-arrow-left"></i>
                </button>
                <h1 className="header-title">{restaurant.restaurantName} Reviews</h1>
                <div className="header-right"></div>
            </div>

            <div className="rating-overview-container">
                <div className="rating-overview">
                    <div className="rating-main">
            <span className="rating-number">
              {(restaurant?.rating ?? 0).toFixed(1)}
            </span>
                        <div className="stars-container">
                            {[...Array(5)].map((_, index) => (
                                <i
                                    key={index}
                                    className={`bi bi-star${index < (restaurant?.rating ?? 0) ? "-fill" : ""}`}
                                    style={{ color: '#FFD700', fontSize: '22px', marginRight: '4px' }}
                                ></i>
                            ))}
                        </div>
                        <span className="rating-count">
              ({restaurant?.ratingCount ?? 0} reviews)
            </span>
                    </div>
                </div>
            </div>

            {renderAnalysisSummary()}

            {showAnalysisDetails && commentAnalysis && (
                <div className="analysis-details-container">
                    <CommentAnalysisCard
                        aspectType="good"
                        aspects={commentAnalysis.good_aspects}
                        title="What customers like"
                        iconName="hand-thumbs-up"
                    />
                    <CommentAnalysisCard
                        aspectType="bad"
                        aspects={commentAnalysis.bad_aspects}
                        title="Areas for improvement"
                        iconName="hand-thumbs-down"
                    />
                </div>
            )}

            <div className="comments-list-container">
                {refreshing || commentsLoading ? (
                    <div className="comments-loading">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Loading comments...</span>
                    </div>
                ) : sortedComments && sortedComments.length > 0 ? (
                    <div className="comments-list">
                        {sortedComments.map(comment => (
                            <CommentCard key={comment.id} comment={comment} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-container">
                        <div className="empty-icon-container">
                            <i className="bi bi-chat-square-text" style={{ fontSize: '48px', color: '#CCCCCC' }}></i>
                        </div>
                        <h3 className="empty-title">No Reviews Yet</h3>
                        <p className="empty-text">Be the first to leave a review for this restaurant</p>
                    </div>
                )}
            </div>

            {/* Refresh button at the bottom */}
            <button className="refresh-button" onClick={onRefresh} disabled={refreshing || commentsLoading}>
                <i className="bi bi-arrow-repeat"></i> Refresh
            </button>

            <style jsx>{`
                .restaurant-comments-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 16px 32px;
                    background-color: #FFFFFF;
                }

                .comments-header {
                    display: flex;
                    align-items: center;
                    padding: 16px 0;
                    border-bottom: 1px solid #F3F4F6;
                    position: sticky;
                    top: 0;
                    background-color: #FFFFFF;
                    z-index: 10;
                }

                .back-button {
                    width: 40px;
                    height: 40px;
                    border: none;
                    background-color: #f5f5f5;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 18px;
                    color: #333;
                    margin-right: 16px;
                    transition: background-color 0.2s;
                }

                .back-button:hover {
                    background-color: #e0e0e0;
                }

                .header-title {
                    flex: 1;
                    text-align: center;
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                    padding-right: 56px;
                }

                .header-right {
                    width: 40px;
                }

                .rating-overview-container {
                    margin-bottom: 16px;
                }

                .rating-overview {
                    padding: 16px;
                    border-bottom-left-radius: 24px;
                    border-bottom-right-radius: 24px;
                    background: linear-gradient(135deg, #50703C, #3E5A2E);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .rating-main {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    padding: 24px 16px;
                    border-radius: 12px;
                    background-color: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .rating-number {
                    font-size: 32px;
                    font-weight: 700;
                    color: #FFFFFF;
                }

                .stars-container {
                    display: flex;
                    align-items: center;
                    margin: 0 8px;
                }

                .rating-count {
                    color: #FFFFFF;
                    font-size: 15px;
                    opacity: 0.9;
                }

                /* Analysis Summary */
                .analysis-summary {
                    width: 100%;
                    margin-bottom: 16px;
                    border-radius: 12px;
                    border: none;
                    background: none;
                    padding: 0;
                    cursor: pointer;
                    overflow: hidden;
                    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .analysis-summary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                }

                .analysis-summary-gradient {
                    background: linear-gradient(to right, #F0F9EB, #E8F5E9);
                    border-radius: 12px;
                }

                .analysis-summary-content {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                }

                .analysis-summary-icon-container {
                    width: 48px;
                    height: 48px;
                    border-radius: 24px;
                    background-color: #FFFFFF;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .analysis-summary-text-container {
                    flex: 1;
                    margin-left: 16px;
                    text-align: left;
                }

                .analysis-summary-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin: 0 0 4px;
                }

                .analysis-summary-subtitle {
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                }

                /* Analysis States */
                .analysis-loading, .analysis-error, .analysis-unavailable {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    margin-bottom: 16px;
                    border-radius: 12px;
                    background-color: #F9FAFB;
                }

                .analysis-loading-text, .analysis-unavailable-text {
                    margin-left: 8px;
                    color: #666;
                }

                .analysis-error {
                    background-color: #FEF2F2;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                }

                .analysis-error:hover {
                    background-color: #fee2e2;
                }

                .analysis-error-text {
                    margin-left: 8px;
                    color: #D32F2F;
                }

                /* Analysis Details */
                .analysis-details-container {
                    padding: 0 0 16px;
                }

                .analysis-card {
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 16px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .good-aspects-card {
                    background-color: #F0F9EB;
                    border-left: 4px solid #50703C;
                }

                .bad-aspects-card {
                    background-color: #FFEBEE;
                    border-left: 4px solid #DC2626;
                }

                .aspects-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .aspects-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin: 0 0 0 12px;
                }

                .good-title {
                    color: #50703C;
                }

                .bad-title {
                    color: #DC2626;
                }

                .aspects-list {
                    padding-left: 8px;
                }

                .aspect-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 12px;
                }

                .aspect-text {
                    flex: 1;
                    font-size: 15px;
                    line-height: 1.4;
                    color: #374151;
                }

                /* Comments Section */
                .comments-list-container {
                    padding: 16px 0;
                }

                .comments-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    gap: 16px;
                    color: #666;
                }

                .comments-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .comment-card {
                    background-color: #FFFFFF;
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
                    border: 1px solid #F3F4F6;
                    position: relative;
                }

                .highlighted-comment {
                    border: 1px solid #50703C;
                    background-color: #FBFDF8;
                    box-shadow: 0 4px 12px rgba(80, 112, 60, 0.08);
                }

                .highlight-badge {
                    position: absolute;
                    top: -10px;
                    right: 20px;
                    background-color: #50703C;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .comment-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                }

                .avatar-container {
                    width: 36px;
                    height: 36px;
                    border-radius: 18px;
                    background-color: #50703C;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 10px;
                    color: white;
                }

                .user-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #111827;
                }

                .comment-date {
                    color: #6B7280;
                    font-size: 14px;
                }

                .rating-container {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    background-color: #F9FAFB;
                    padding: 6px 10px;
                    border-radius: 8px;
                    align-self: flex-start;
                    display: inline-flex;
                }

                .rating-text {
                    margin-left: 8px;
                    color: #4B5563;
                    font-size: 14px;
                    font-weight: 500;
                }

                .comment-text {
                    color: #374151;
                    font-size: 15px;
                    line-height: 1.5;
                    margin-bottom: 16px;
                }

                .badges-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .badge {
                    display: flex;
                    align-items: center;
                    padding: 6px 12px;
                    border-radius: 20px;
                }

                /* Empty State */
                .empty-container {
                    padding: 48px 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }

                .empty-icon-container {
                    width: 80px;
                    height: 80px;
                    border-radius: 40px;
                    background-color: #F9FAFB;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .empty-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 8px;
                }

                .empty-text {
                    color: #6B7280;
                    text-align: center;
                    font-size: 15px;
                    line-height: 1.4;
                }

                /* Refresh Button */
                .refresh-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background-color: #50703C;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    margin: 16px auto;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }

                .refresh-button:hover {
                    background-color: #3E5A2E;
                }

                .refresh-button:disabled {
                    background-color: #9CA3AF;
                    cursor: not-allowed;
                }

                /* Responsive Adjustments */
                @media (max-width: 768px) {
                    .rating-main {
                        flex-direction: column;
                        gap: 8px;
                        padding: 16px;
                    }

                    .header-title {
                        font-size: 20px;
                        padding-right: 40px;
                    }

                    .comment-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .comment-date {
                        margin-top: 8px;
                        margin-left: 46px;
                    }
                }
            `}</style>
        </div>
    );
};

export default RestaurantComments;