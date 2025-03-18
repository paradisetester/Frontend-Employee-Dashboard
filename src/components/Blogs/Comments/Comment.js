import React, { useState } from 'react';

/** 📝 Individual Comment Component */
const Comment = ({ comment, handleDeleteComment, handleAddReply, parentId }) => {
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  /** ➕ Add Reply */
  const handleAddReplyClick = async () => {
    if (!replyContent.trim()) return;
    setLoading(true);

    try {
      await handleAddReply(comment._id, replyContent, parentId);
      setReplyContent('');
      setShowReplyInput(false);
    } catch (err) {
      console.error('Failed to add reply:', err);
      alert('Failed to add reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <div>
        <p className="text-gray-800">{comment.content}</p>
        <p className="text-sm text-gray-500">
          By {comment.user?.name || 'Anonymous'} on {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Reply Button */}
      {!showReplyInput && (
        <button
          onClick={() => setShowReplyInput(true)}
          className="text-blue-600 hover:text-blue-700 mt-2"
        >
          Reply
        </button>
      )}

      {/* Reply Input */}
      {showReplyInput && (
        <div className="flex items-center space-x-4 mt-2">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddReplyClick}
            className={`px-4 py-2 text-white rounded-md ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Reply'}
          </button>
        </div>
      )}

      {/* Render Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-4 border-l-2 border-gray-300 pl-4">
          <h4 className="text-sm font-semibold mb-2">Replies:</h4>
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              handleDeleteComment={handleDeleteComment}
              handleAddReply={handleAddReply}
              parentId={comment._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
