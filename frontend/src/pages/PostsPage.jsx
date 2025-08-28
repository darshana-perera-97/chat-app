import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, XMarkIcon, UserIcon, EyeSlashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    text: '',
    author: '',
    isAnonymous: false
  });
  const [draggedPost, setDraggedPost] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('chatAppPosts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      // Filter out expired posts
      const currentTime = new Date().getTime();
      const validPosts = parsedPosts.filter(post => {
        const postTime = new Date(post.timestamp).getTime();
        return (currentTime - postTime) < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      });
      setPosts(validPosts);
      // Update localStorage with filtered posts
      localStorage.setItem('chatAppPosts', JSON.stringify(validPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('chatAppPosts', JSON.stringify(posts));
  }, [posts]);

  // Clean up expired posts every hour
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const validPosts = posts.filter(post => {
        const postTime = new Date(post.timestamp).getTime();
        return (currentTime - postTime) < 24 * 60 * 60 * 1000;
      });
      if (validPosts.length !== posts.length) {
        setPosts(validPosts);
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [posts]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showCreateModal) {
        setShowCreateModal(false);
      }
    };

    if (showCreateModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showCreateModal]);

  const handleCreatePost = () => {
    if (newPost.text.trim()) {
      const post = {
        id: Date.now().toString(),
        text: newPost.text.trim(),
        author: newPost.isAnonymous ? 'Anonymous' : (newPost.author.trim() || 'Anonymous'),
        isAnonymous: newPost.isAnonymous,
        timestamp: new Date().toISOString(),
        position: { x: Math.random() * 100, y: Math.random() * 100 }
      };
      setPosts(prev => [...prev, post]);
      setNewPost({ text: '', author: '', isAnonymous: false });
      setShowCreateModal(false);
    }
  };

  const handleMouseDown = (e, post) => {
    if (e.target.closest('.post-content')) return; // Don't drag when clicking on text
    setDraggedPost(post);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTouchStart = (e, post) => {
    if (e.target.closest('.post-content')) return; // Don't drag when touching text
    setDraggedPost(post);
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!draggedPost || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;
    
    // Constrain to canvas boundaries
    const maxX = canvasRect.width - 300; // Post width
    const maxY = canvasRect.height - 200; // Post height
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    setPosts(prev => prev.map(post => 
      post.id === draggedPost.id 
        ? { ...post, position: { x: constrainedX, y: constrainedY } }
        : post
    ));
  };

  const handleTouchMove = (e) => {
    if (!draggedPost || !canvasRef.current) return;
    e.preventDefault(); // Prevent scrolling while dragging
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newX = touch.clientX - canvasRect.left - dragOffset.x;
    const newY = touch.clientY - canvasRect.top - dragOffset.y;
    
    // Constrain to canvas boundaries
    const maxX = canvasRect.width - 300; // Post width
    const maxY = canvasRect.height - 200; // Post height
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    setPosts(prev => prev.map(post => 
      post.id === draggedPost.id 
        ? { ...post, position: { x: constrainedX, y: constrainedY } }
        : post
    ));
  };

  const handleMouseUp = () => {
    setDraggedPost(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleTouchEnd = () => {
    setDraggedPost(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowCreateModal(false);
    }
  };

  const deletePost = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const getTimeRemaining = (timestamp) => {
    const currentTime = new Date().getTime();
    const postTime = new Date(timestamp).getTime();
    const timeLeft = 24 * 60 * 60 * 1000 - (currentTime - postTime);
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m left`;
  };

  return (
    <div className="container-fluid h-100 p-0">
      {/* Header */}
      <div className="bg-white border-bottom p-3" style={{ borderColor: '#e9edef' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0 fw-bold" style={{ color: '#00a884' }}>Posts</h1>
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">
              {posts.length} active posts
            </small>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        ref={canvasRef}
        className="position-relative w-100 h-100"
        style={{ 
          minHeight: 'calc(100vh - 80px)',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          overflow: 'hidden'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Posts */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="position-absolute post-card"
            style={{
              left: `${post.position.x}px`,
              top: `${post.position.y}px`,
              width: '300px',
              cursor: draggedPost?.id === post.id ? 'grabbing' : 'grab',
              zIndex: draggedPost?.id === post.id ? 1000 : 1
            }}
            onMouseDown={(e) => handleMouseDown(e, post)}
            onTouchStart={(e) => handleTouchStart(e, post)}
          >
            <div className="card shadow-sm border-0" style={{ backgroundColor: '#ffffff' }}>
              <div className="card-header d-flex justify-content-between align-items-center py-2 px-3" 
                   style={{ backgroundColor: '#f8f9fa', borderColor: '#e9edef' }}>
                <div className="d-flex align-items-center gap-2">
                  {post.isAnonymous ? (
                    <EyeSlashIcon className="h-4 w-4 text-muted" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-primary" />
                  )}
                  <small className="fw-medium text-muted">
                    {post.author}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <small className="text-muted">
                    {getTimeRemaining(post.timestamp)}
                  </small>
                  <button
                    className="btn btn-sm btn-outline-danger p-1"
                    onClick={() => deletePost(post.id)}
                    style={{ fontSize: '0.75rem' }}
                    aria-label={`Delete post by ${post.author}`}
                    title="Delete post"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="card-body p-3">
                <div className="post-content">
                  <p className="mb-0 text-break" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {post.text}
                  </p>
                </div>
                <div className="mt-2">
                  <small className="text-muted">
                    {new Date(post.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="position-absolute top-50 start-50 translate-middle text-center">
            <div className="p-4">
              <DocumentTextIcon className="h-16 w-16 text-muted mb-3" />
              <h5 className="text-muted">No posts yet</h5>
              <p className="text-muted mb-0">Be the first to share something!</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        className="btn btn-primary position-fixed rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        style={{
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          zIndex: 1001
        }}
        onClick={() => setShowCreateModal(true)}
        aria-label="Create new post"
        title="Create new post"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleModalBackdropClick}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: '#00a884' }}>Create New Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Post Content</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="What's on your mind?"
                    value={newPost.text}
                    onChange={(e) => setNewPost(prev => ({ ...prev, text: e.target.value }))}
                    maxLength="500"
                    style={{ resize: 'none' }}
                  ></textarea>
                  <small className="text-muted">
                    {newPost.text.length}/500 characters
                  </small>
                </div>
                
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="anonymousCheck"
                      checked={newPost.isAnonymous}
                      onChange={(e) => setNewPost(prev => ({ 
                        ...prev, 
                        isAnonymous: e.target.checked,
                        author: e.target.checked ? '' : prev.author
                      }))}
                    />
                    <label className="form-check-label" htmlFor="anonymousCheck">
                      Post anonymously
                    </label>
                  </div>
                </div>

                {!newPost.isAnonymous && (
                  <div className="mb-3">
                    <label className="form-label fw-medium">Your Name (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name or leave blank"
                      value={newPost.author}
                      onChange={(e) => setNewPost(prev => ({ ...prev, author: e.target.value }))}
                      maxLength="50"
                    />
                  </div>
                )}

                <div className="alert alert-info mb-0" style={{ backgroundColor: '#e3f2fd', borderColor: '#90caf9' }}>
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Posts are visible to everyone and expire after 24 hours
                  </small>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreatePost}
                  disabled={!newPost.text.trim()}
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .post-card {
            width: 280px !important;
          }
          
          .modal-dialog {
            margin: 1rem;
          }
          
          .modal-content {
            margin: 0.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .post-card {
            width: 260px !important;
          }
          
          .btn-primary.position-fixed {
            bottom: 1rem !important;
            right: 1rem !important;
            width: 50px !important;
            height: 50px !important;
          }
          
          .modal-dialog {
            margin: 0.5rem;
          }
          
          .card-header {
            padding: 0.5rem !important;
          }
          
          .card-body {
            padding: 0.75rem !important;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .post-card {
            touch-action: none;
          }
          
          .post-card .card {
            transition: transform 0.2s ease;
          }
          
          .post-card:active .card {
            transform: scale(0.98);
          }
          
          /* Prevent text selection on touch devices */
          .post-card {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        }
        
        /* Smooth animations */
        .post-card {
          transition: all 0.2s ease;
        }
        
        .post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        
        /* Mobile scrollbar styling */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default PostsPage;
