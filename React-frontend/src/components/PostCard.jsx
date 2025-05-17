import { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Card, CardHeader, CardContent, CardActions, Avatar,
  Typography, IconButton, Button, Box, Chip,
  Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, ImageList, ImageListItem,
  Fade, Tooltip, Divider
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from 'react-query';
import { AuthContext } from '../contexts/AuthContext';
import { postApi } from '../services/api';
import { getFullImageUrl } from '../utils/imageUtils';

export default function PostCard({ post }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [selectedMedia, setSelectedMedia] = useState(null);
  
  const isOwner = currentUser?.id === post.userId;
  const isLiked = post.likedBy?.includes(currentUser?.id);
  const isSaved = post.savedBy?.includes(currentUser?.id);
  const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;

  const isVideo = (url) => {
    return url && url.match(/\.(mp4|webm|ogg)$/i);
  };

  const likeMutation = useMutation(
    () => isLiked ? postApi.unlikePost(post.id) : postApi.likePost(post.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userPosts']);
        queryClient.invalidateQueries(['explorePosts']);
        queryClient.invalidateQueries(['feed']);
        queryClient.invalidateQueries(['post', post.id]);
      }
    }
  );

  const saveMutation = useMutation(
    () => isSaved ? postApi.unsavePost(post.id) : postApi.savePost(post.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userPosts']);
        queryClient.invalidateQueries(['savedPosts']);
      }
    }
  );

  const deleteMutation = useMutation(
    () => postApi.deletePost(post.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userPosts']);
        queryClient.invalidateQueries(['explorePosts']);
        queryClient.invalidateQueries(['feed']);
        setConfirmDelete(false);
      }
    }
  );

  const updateMutation = useMutation(
    (content) => postApi.updatePost(post.id, { 
      content,
      mediaUrls: post.mediaUrls, // Preserve the existing media URLs
      skillCategory: post.skillCategory // Preserve the skill category
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userPosts']);
        queryClient.invalidateQueries(['explorePosts']);
        queryClient.invalidateQueries(['feed']);
        queryClient.invalidateQueries(['post', post.id]);
        setEditMode(false);
      }
    }
  );

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    setEditedContent(post.content);
    setEditMode(true);
    handleMenuClose();
  };

  const handleSaveEdit = () => {
    if (editedContent.trim() !== '') {
      updateMutation.mutate(editedContent);
    }
  };
  
  const API_BASE_URL = 'http://localhost:4000';
  
  const handleDeleteClick = () => {
    setConfirmDelete(true);
    handleMenuClose();
  };

  const handleLike = () => {
    if (currentUser) {
      likeMutation.mutate();
    }
  };

  const handleSave = () => {
    if (currentUser) {
      saveMutation.mutate();
    }
  };
  
  const handleMediaClick = (url) => {
    setSelectedMedia(url);
  };

  const handleProfileClick = () => {
    if (post.userId) {
      navigate(`/profile/${post.userId}`);
    }
  };

  const renderMedia = (url) => {
    const fullUrl = getFullImageUrl(url);
    if (isVideo(url)) {
      return (
        <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <video
            src={fullUrl}
            style={{ 
              width: '80%',
              maxWidth: '600px',
              borderRadius: 8,
              cursor: 'pointer',
              objectFit: 'contain'
            }}
            onClick={() => handleMediaClick(fullUrl)}
          />
          <PlayArrowIcon 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              fontSize: 48,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              padding: '8px'
            }} 
          />
        </Box>
      );
    }
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <img
          src={fullUrl}
          alt="Post media"
          style={{ 
            width: '80%',
            maxWidth: '600px',
            borderRadius: 8,
            cursor: 'pointer',
            objectFit: 'contain'
          }}
          onClick={() => handleMediaClick(fullUrl)}
        />
      </Box>
    );
  };

  return (
    <Fade in={true} timeout={500}>
      <Card 
        elevation={1} 
        sx={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          overflow: 'visible',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <CardHeader
          avatar={
            <Avatar 
              src={getFullImageUrl(post.userProfilePicture)} 
              alt={post.userName || "User"}
              onClick={handleProfileClick}
              sx={{ 
                cursor: 'pointer',
                width: 48,
                height: 48,
                border: '2px solid #fff',
                boxShadow: '0 2px 8px rgba(106, 27, 154, 0.2)',
                transition: 'transform 0.2s ease',
                '&:hover': { 
                  transform: 'scale(1.1)'
                }
              }}
            />
          }
          action={
            isOwner && (
              <IconButton 
                onClick={handleMenuOpen} 
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
                }}
              >
                <MoreVertIcon />
              </IconButton>
            )
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography 
                variant="subtitle1"
                component="span"
                onClick={handleProfileClick}
                sx={{ 
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'text.primary', 
                  transition: 'color 0.2s ease',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {post.userName || "Unknown User"}
              </Typography>
              {post.username && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  component="span"
                  sx={{ ml: 1 }}
                >
                  @{post.username}
                </Typography>
              )}
            </Box>
          }
          subheader={
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                mt: 0.5
              }}
            >
              {format(new Date(post.createdAt), 'MMM d, yyyy • h:mm a')}
            </Typography>
          }
        />
        
        <CardContent sx={{ pt: 0, px: { xs: 2, sm: 3 } }}>
          {editMode ? (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              />
              
              {/* Display existing media during edit mode but make it clear it can't be changed */}
              {hasMedia && (
                <Box sx={{ my: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Media cannot be changed during edit
                  </Typography>
                  {post.mediaUrls.length === 1 ? (
                    renderMedia(post.mediaUrls[0])
                  ) : (
                    <ImageList 
                      cols={post.mediaUrls.length > 3 ? 2 : post.mediaUrls.length} 
                      gap={8}
                      sx={{ mb: 0, width: '80%', maxWidth: '600px', margin: '0 auto' }}
                    >
                      {post.mediaUrls.map((url, index) => (
                        <ImageListItem key={index}>
                          {renderMedia(url)}
                        </ImageListItem>
                      ))}
                    </ImageList>
                  )}
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <Button 
                  onClick={() => setEditMode(false)}
                  sx={{ borderRadius: 6 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSaveEdit}
                  disabled={updateMutation.isLoading}
                  sx={{ borderRadius: 6 }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography 
              variant="body1" 
              component="div" 
              sx={{ 
                mb: 2, 
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
                color: 'text.primary'
              }}
            >
              {post.content}
            </Typography>
          )}
          
          {hasMedia && !editMode && (
            <Box sx={{ my: 3, borderRadius: 3, overflow: 'hidden' }}>
              {post.mediaUrls.length === 1 ? (
                renderMedia(post.mediaUrls[0])
              ) : (
                <ImageList 
                  cols={post.mediaUrls.length > 3 ? 2 : post.mediaUrls.length} 
                  gap={8}
                  sx={{ 
                    mb: 0, 
                    width: '100%', 
                    maxWidth: '600px', 
                    margin: '0 auto',
                    overflow: 'visible'
                  }}
                >
                  {post.mediaUrls.map((url, index) => (
                    <ImageListItem 
                      key={index} 
                      sx={{ 
                        overflow: 'hidden', 
                        borderRadius: 3, 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      {renderMedia(url)}
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Box>
          )}
          
          {post.skillCategory && !editMode && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {post.skillCategory.split(',').map(skill => {
                const trimmedSkill = skill.trim();
                return trimmedSkill ? (
                  <Chip 
                    key={trimmedSkill} 
                    label={trimmedSkill} 
                    size="small" 
                    component={RouterLink}
                    to={`/explore?skill=${encodeURIComponent(trimmedSkill)}`}
                    clickable
                    sx={{ 
                      textDecoration: 'none', 
                      borderRadius: 8,
                      backgroundColor: 'rgba(106, 27, 154, 0.08)',
                      color: 'primary.dark',
                      fontWeight: 500,
                      '&:hover': { 
                        backgroundColor: 'rgba(106, 27, 154, 0.15)',
                      }
                    }}
                  />
                ) : null;
              }).filter(Boolean)}
            </Box>
          )}
        </CardContent>
        
        <Divider sx={{ mx: 2, opacity: 0.7 }} />
        
        <CardActions sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={isLiked ? "Unlike" : "Like"}>
              <IconButton 
                onClick={handleLike}
                disabled={!currentUser || likeMutation.isLoading}
                color={isLiked ? "error" : "default"}
                sx={{ 
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.15)' }
                }}
                size="small"
              >
                {isLiked ? 
                  <FavoriteIcon sx={{ color: '#f50057' }} /> : 
                  <FavoriteBorderIcon />
                }
              </IconButton>
            </Tooltip>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ ml: 0.5, minWidth: 16 }}
            >
              {post.likesCount || 0}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1.5 }}>
            <Tooltip title="Comments">
              <IconButton 
                component={RouterLink}
                to={`/posts/${post.id}`}
                sx={{ 
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.15)' }
                }}
                size="small"
              >
                <CommentIcon />
              </IconButton>
            </Tooltip>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ ml: 0.5, minWidth: 16 }}
            >
              {post.commentsCount || 0}
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Tooltip title={isSaved ? "Unsave" : "Save"}>
            <IconButton 
              onClick={handleSave}
              disabled={!currentUser || saveMutation.isLoading}
              sx={{ 
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.15)' }
              }}
              size="small"
            >
              {isSaved ? 
                <BookmarkIcon sx={{ color: 'primary.main' }} /> : 
                <BookmarkBorderIcon />
              }
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Share">
            <IconButton
              sx={{ 
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.15)' }
              }}
              size="small"
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </CardActions>

        <Dialog 
          open={Boolean(selectedMedia)} 
          onClose={() => setSelectedMedia(null)}
          maxWidth="lg"
          PaperProps={{
            sx: { 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            {selectedMedia && isVideo(selectedMedia) ? (
              <video 
                src={selectedMedia}
                controls
                autoPlay
                style={{ 
                  width: '100%',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                  backgroundColor: '#000'
                }}
              />
            ) : (
              <img 
                src={selectedMedia} 
                alt="Full size media" 
                style={{ 
                  width: '100%',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                  backgroundColor: '#f7f7f7'
                }} 
              />
            )}
          </DialogContent>
        </Dialog>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: { borderRadius: 2, minWidth: 150 }
          }}
        >
          <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
            <EditIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ py: 1.5 }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
            <Typography color="error">Delete</Typography>
          </MenuItem>
        </Menu>

        <Dialog 
          open={confirmDelete} 
          onClose={() => setConfirmDelete(false)}
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete this post? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button 
              onClick={() => setConfirmDelete(false)}
              sx={{ borderRadius: 6 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => deleteMutation.mutate()} 
              color="error" 
              variant="contained"
              disabled={deleteMutation.isLoading}
              sx={{ borderRadius: 6 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Fade>
  );
}
