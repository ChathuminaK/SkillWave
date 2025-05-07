import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { PostService } from '../services/post.service';

// Create the context
const PostContext = createContext();

// Custom hook to use the context
export const usePostContext = () => useContext(PostContext);

// Context provider component
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Mock user ID - in a real app, this would come from authentication
  const userId = 'user123';
  
  // Fetch posts with current filters
  const fetchPosts = useCallback(async (page = 0, replace = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PostService.getPosts(
        page,
        10,
        selectedCategory === 'all' ? null : selectedCategory,
        sortBy,
        sortDirection
      );
      
      setPosts(prev => replace ? response.posts : [...prev, ...response.posts]);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalItems);
      setCurrentPage(response.currentPage);
      setHasMore(page < response.totalPages - 1);
      
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, sortDirection]);
  
  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await PostService.getCategories();
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Set a default list of categories if API fails
      setCategories([
        'Programming', 'Data Science', 'Design', 'Mathematics',
        'Science', 'Languages', 'Business', 'Arts', 'Health'
      ]);
    }
  }, []);
  
  // Initialize data
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  useEffect(() => {
    fetchPosts(0, true);
  }, [fetchPosts, selectedCategory, sortBy, sortDirection]);
  
  // Change category
  const changeCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };
  
  // Change sorting
  const changeSorting = (newSortBy, newDirection = 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
    setCurrentPage(0);
  };
  
  // Load more posts
  const loadMorePosts = () => {
    if (!loading && hasMore) {
      fetchPosts(currentPage + 1, false);
    }
  };
  
  // Delete a post
  const deletePost = async (id) => {
    try {
      await PostService.deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
      setTotalElements(prev => prev - 1);
      return true;
    } catch (err) {
      setError('Failed to delete post. Please try again.');
      console.error(err);
      return false;
    }
  };
  
  // Like a post
  const likePost = async (id) => {
    try {
      const updatedPost = await PostService.likePost(id, userId);
      
      setPosts(posts.map(post => 
        post.id === id 
          ? { ...post, likesCount: updatedPost.likesCount, likedBy: updatedPost.likedBy } 
          : post
      ));
      
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  
  // Unlike a post
  const unlikePost = async (id) => {
    try {
      const updatedPost = await PostService.unlikePost(id, userId);
      
      setPosts(posts.map(post => 
        post.id === id 
          ? { ...post, likesCount: updatedPost.likesCount, likedBy: updatedPost.likedBy } 
          : post
      ));
      
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  
  // Get a single post by ID
  const getPostById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const post = await PostService.getPostById(id);
      return post;
    } catch (err) {
      setError('Failed to load post. It might have been deleted or does not exist.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Context value
  const contextValue = {
    posts,
    categories,
    selectedCategory,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    hasMore,
    sortBy,
    sortDirection,
    fetchPosts,
    fetchCategories,
    changeCategory,
    changeSorting,
    loadMorePosts,
    deletePost,
    likePost,
    unlikePost,
    getPostById,
    userId // For demo purposes
  };
  
  return (
    <PostContext.Provider value={contextValue}>
      {children}
    </PostContext.Provider>
  );
};