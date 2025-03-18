import React, { useState, useEffect } from 'react';
import api from '../../../services/axios';
import { FaTrashAlt, FaReply, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getRole } from '../../../services/authService';

/** 📝 Individual Comment Component */
const Comment = ({ comment, handleDeleteComment, handleAddReply, parentId }) => {
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [role, setRole] = useState('');

  // Decode token to retrieve user details
  useEffect(() => {
    const fetchedRole = getRole();
    setRole(fetchedRole);
  }, []);
  /** ➕ Add Reply */
  const handleAddReplyClick = async () => {
    if (!replyContent.trim()) return;
    setLoading(true);
    try {
      await handleAddReply(comment._id, replyContent);
      setReplyContent('');
      setShowReplyInput(false);
    } catch (err) {
      console.error('Failed to add reply:', err);
      alert('Failed to add reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /** 🗑️ Delete Comment */
  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await handleDeleteComment(comment._id);
    }
  };

  return (
    <motion.div
      className="p-4 bg-white rounded-lg shadow-md transition-all hover:shadow-xl mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        <p className="text-lg text-gray-800">{comment.content}</p>
        <p className="text-sm text-gray-500 mt-1">
          By {comment.user?.name || 'Anonymous'} on {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 mt-2">
        {!parentId && (
          <>{role === 'admin' && (
            <button
              onClick={handleDeleteClick}
              className="flex items-center text-red-600 hover:text-red-700 text-sm"
            >
              <FaTrashAlt className="mr-1" /> Delete
            </button>)}
            {!showReplyInput && (
              <button
                onClick={() => setShowReplyInput(true)}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
              >
                <FaReply className="mr-1" /> Reply
              </button>
            )}
          </>
        )}
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="flex items-center space-x-4 mt-4">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddReplyClick}
            className={`px-4 py-2 text-white rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Reply'}
          </button>
        </div>
      )}

      {/* Toggle Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center text-blue-600 hover:text-blue-700 mt-2 text-sm"
        >
          {showReplies ? (
            <>
              <FaChevronUp className="mr-1" /> Hide Replies
            </>
          ) : (
            <>
              <FaChevronDown className="mr-1" /> View Replies
            </>
          )}
        </button>
      )}

      {/* Nested Replies */}
      <AnimatePresence>
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <motion.div
            className="ml-6 mt-4 border-l-2 border-gray-300 pl-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {comment.replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                handleDeleteComment={handleDeleteComment}
                handleAddReply={handleAddReply}
                parentId={comment._id} // Mark as child
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/** 📋 Comments List Component */
const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** 📥 Fetch Comments */
  useEffect(() => {
    const fetchComments = async () => {
      setError(null);
      try {
        const data = await api.getComments(blogId);
        setComments(data); // Backend should return nested comments
      } catch (err) {
        setError('Failed to load comments. Please try again later.');
      }
    };

    fetchComments();
  }, [blogId]);

  /** ➕ Add a New Comment */
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const addedComment = await api.addComment(blogId, newComment);
      setComments((prev) => [addedComment.comment, ...prev]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /** 🗑️ Delete a Comment (with recursion for nested comments) */
  const handleDeleteComment = async (commentId) => {
    setError(null);
    try {
      await api.deleteComment(commentId);
      // Helper to remove comment recursively from nested structure
      const removeComment = (commentsArray, id) => {
        return commentsArray
          .filter((comment) => comment._id !== id)
          .map((comment) => ({
            ...comment,
            replies: comment.replies ? removeComment(comment.replies, id) : [],
          }));
      };
      setComments((prev) => removeComment(prev, commentId));
    } catch (err) {
      setError('Failed to delete comment. Please try again.');
    }
  };

  /** 📝 Add Reply to a Comment */
  const handleAddReply = async (parentCommentId, replyContent) => {
    try {
      const addedReply = await api.addReply(parentCommentId, replyContent);
      // Helper to insert reply into the nested comments structure
      const addReplyToComment = (commentsArray, parentId, reply) => {
        return commentsArray.map((comment) => {
          if (comment._id === parentId) {
            return {
              ...comment,
              replies: [reply, ...(comment.replies || [])],
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies, parentId, reply),
            };
          }
          return comment;
        });
      };
      setComments((prev) => addReplyToComment(prev, parentCommentId, addedReply.reply));
    } catch (err) {
      console.error('Failed to add reply:', err);
      alert('Failed to add reply. Please try again.');
    }
  };

  return (
    <div className="mt-12 max-w-3xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
      <h3 className="text-3xl font-semibold mb-6">Comments</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Render Comments */}
      <div className="space-y-6 mb-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              handleDeleteComment={handleDeleteComment}
              handleAddReply={handleAddReply}
            />
          ))
        ) : (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Add New Comment */}
      <div className="flex items-center space-x-4 mt-8">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleAddComment}
          className={`px-4 py-2 text-white rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Comment'}
        </button>
      </div>
    </div>
  );
};

export default Comments;
