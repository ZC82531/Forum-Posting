import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './PostDetails.css'; // Import the CSS file for styling

const supabaseUrl = 'https://ckplyvdardrkczaslasz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrcGx5dmRhcmRya2N6YXNsYXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxNDc4MzQsImV4cCI6MjAyOTcyMzgzNH0.DV34OiSEbVmHBXRpaVJFASc53MYuQ_zsLfqAAojf8zE';

const supabase = createClient(supabaseUrl, supabaseKey);

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commenterName, setCommenterName] = useState('');
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                // Fetch post details
                const { data: postData, error: postError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (postError) {
                    throw postError;
                }
                setPost(postData);

                // Fetch comments for the post
                const { data: commentsData, error: commentsError } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('post_id', id);
                if (commentsError) {
                    throw commentsError;
                }
                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchPostAndComments();
    }, [id]);

    const handleUpdatePost = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        try {
            // Update post in the database
            const { data: updatedPostData, error: updateError } = await supabase
                .from('posts')
                .update({ title: editedTitle, content: editedContent })
                .eq('id', id);
    
            if (updateError) {
                throw updateError;
            }
    
            // Update local state with the updated post
            setPost((prevPost) => ({ ...prevPost, title: editedTitle, content: editedContent }));
    
            // Exit edit mode
            setEditMode(false);
        } catch (error) {
            console.error('Error updating post:', error.message);
        }
    };
    

    const handleUpvote = async () => {
        try {
            // Fetch current post data
            const { data: currentPostData, error: fetchError } = await supabase
                .from('posts')
                .select('upvotes_count')
                .eq('id', id)
                .single();
    
            if (fetchError) {
                throw fetchError;
            }
    
            // Calculate new upvote count
            const newUpvotesCount = currentPostData.upvotes_count + 1;
    
            // Update upvote count in the database
            const { data: updatedPostData, error: updateError } = await supabase
                .from('posts')
                .update({ upvotes_count: newUpvotesCount })
                .eq('id', id);
    
            if (updateError) {
                throw updateError;
            }
    
            // Update local state with the new upvote count
            setPost((prevPost) => ({ ...prevPost, upvotes_count: newUpvotesCount }));
        } catch (error) {
            console.error('Error updating upvote count:', error.message);
        }
    };
    
    

    const handleCommentSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
      
        try {
            // Add comment to the database
            const { data: commentData, error: commentError } = await supabase
                .from('comments')
                .insert([
                    {
                        post_id: id,
                        name: commenterName,
                        comment_text: newComment
                    }
                ]);
            if (commentError) {
                throw commentError;
            }
      
            // Update comments state with new comment
            setComments((prevComments) => [...prevComments, commentData[0]]);
      
            // Clear form fields after successful comment addition
            setNewComment('');
            setCommenterName('');
        } catch (error) {
            console.error('Error adding comment:', error.message);
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            // Delete comment from the database
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId);
            if (error) {
                throw error;
            }
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId)
            );
        } catch (error) {
            console.error('Error deleting comment:', error.message);
        }
    };

    const handlePostDelete = async () => {
        try {
            // Fetch comment IDs associated with the post
            const { data: commentIds, error: commentIdsError } = await supabase
                .from('comments')
                .select('id')
                .eq('post_id', id);
            if (commentIdsError) {
                throw commentIdsError;
            }
    
            // Delete comments associated with the post
            await supabase
                .from('comments')
                .delete()
                .eq('post_id', id);
    
            // Delete the post itself
            await supabase
                .from('posts')
                .delete()
                .eq('id', id);
    
            // Redirect to home page
            window.location.href = '/'; // This immediately routes back to the homepage
        } catch (error) {
            console.error('Error deleting post:', error.message);
        }
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
        setEditedTitle(post.title);
        setEditedContent(post.content);
    };

    const renderComments = () => {
        return (
            <div className="comments-section">
                <h2 className="comments-title">Comments</h2>
                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    <div>
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment-box">
                                <p><strong>{comment.name}</strong>: {comment.comment_text}</p>
                                <button onClick={() => handleCommentDelete(comment.id)} className="delete-comment-btn">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="post-details">
            {/* Post details */}
            {editMode ? (
                <form onSubmit={handleUpdatePost} className="edit-post-form">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="edit-post-title"
                    />
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="edit-post-content"
                    ></textarea>
                    <button type="submit" className="update-post-btn">Update</button>
                    <button type="button" onClick={handleEditToggle} className="cancel-edit-btn">Cancel</button>
                </form>
            ) : (
                <>
                    <h1 className="post-title">{post?.title}</h1>
                    <p className="post-content">{post?.content}</p>
                    <p className="upvotes">Upvotes: {post?.upvotes_count}</p>
                    <p className="order">Order: {post && post.order_utf8 ? new Date(post.order_utf8).toLocaleString() : ''}</p>
                    <button onClick={handleEditToggle} className="edit-post-btn">Edit Post</button>
                    {/* Upvote button */}
                    <button onClick={handleUpvote} className="upvote-btn">Upvote</button>
                    {renderComments()}
                </>
            )}
    
            {/* Comment form */}
            {!editMode && (
                <div className="add-comment-section">
                    <div onClick={() => setShowCommentForm(!showCommentForm)} className="add-comment-btn">
                        Add Comment
                    </div>
                    {showCommentForm && (
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <input
                                type="text"
                                value={commenterName}
                                onChange={(e) => setCommenterName(e.target.value)}
                                placeholder="Your Name"
                                className="commenter-name-input"
                            />
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Type your comment..."
                                className="comment-textarea"
                            ></textarea>
                            <button type="submit" className="post-comment-btn">Post</button>
                        </form>
                    )}
                </div>
            )}
    
            {/* Delete post button */}
            <button onClick={handlePostDelete} className="delete-post-btn">
                Delete Post
            </button>
        </div>
    );
    
};

export default PostDetails;
