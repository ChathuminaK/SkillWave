import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Box, Typography, Button, Paper, 
  CircularProgress, TextField, Avatar, IconButton,
  Fade, Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Explore as ExploreIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { AuthContext } from '../contexts/AuthContext';
import { postApi, userApi } from '../services/api';
import PostCard from '../components/PostCard';
import SuggestedUserCard from '../components/SuggestedUserCard';
import TrendingSkillsCard from '../components/TrendingSkillsCard';
import CreatePostDialog from '../components/CreatePostDialog';
import { getFullImageUrl } from '../utils/imageUtils';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: feedData, isLoading: feedLoading } = useQuery(
    ['feed', activeTab],
    () => activeTab === 0 
      ? postApi.getFeed() 
      : postApi.getExploreFeed(),
    {
      enabled: isAuthenticated,
      staleTime: 60000,
    }
  );

  const { data: suggestedUsersData } = useQuery(
    ['suggestedUsers'],
    () => userApi.getSuggestedUsers(),
    {
      enabled: isAuthenticated,
      staleTime: 300000,
    }
  );

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const posts = feedData?.data?.content || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Sidebar - Navigation */}
        <Grid item xs={12} md={2}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2.5, 
              position: 'sticky', 
              top: 20,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: (theme) => 
                theme.palette.mode === 'dark' 
                  ? 'rgba(30, 30, 35, 0.7)' 
                  : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              backgroundImage: (theme) => 
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
                  : 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button 
                startIcon={<ExploreIcon />}
                sx={{ 
                  justifyContent: 'flex-start',
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: activeTab === 0 ? 600 : 400,
                  color: activeTab === 0 ? 'primary.main' : 'text.primary',
                  backgroundColor: activeTab === 0 ? 'action.selected' : 'transparent',
                  boxShadow: activeTab === 0 ? '0 2px 8px rgba(106, 27, 154, 0.15)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: activeTab === 0 ? 'action.selected' : 'action.hover',
                    transform: 'translateX(4px)'
                  }
                }}
                onClick={() => handleTabChange(0)}
              >
                Feed
              </Button>
              <Button 
                startIcon={<TrendingUpIcon />}
                sx={{ 
                  justifyContent: 'flex-start',
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: activeTab === 1 ? 600 : 400,
                  color: activeTab === 1 ? 'primary.main' : 'text.primary',
                  backgroundColor: activeTab === 1 ? 'action.selected' : 'transparent',
                  boxShadow: activeTab === 1 ? '0 2px 8px rgba(106, 27, 154, 0.15)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: activeTab === 1 ? 'action.selected' : 'action.hover',
                    transform: 'translateX(4px)'
                  }
                }}
                onClick={() => handleTabChange(1)}
              >
                Discover
              </Button>
              <Button 
                startIcon={<GroupIcon />}
                sx={{ 
                  justifyContent: 'flex-start',
                  borderRadius: 3,
                  py: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateX(4px)'
                  }
                }}
                onClick={() => navigate('/explore')}
              >
                Network
              </Button>
            </Box>
            
            {isAuthenticated && (
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  sx={{ 
                    mt: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
                    boxShadow: '0 4px 12px rgba(106, 27, 154, 0.25)',
                    '&:hover': {
                      boxShadow: '0 6px 18px rgba(106, 27, 154, 0.3)',
                    }
                  }}
                  onClick={() => setCreatePostOpen(true)}
                >
                  Create Post
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={7}>
          {/* Search and Create Post */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: (theme) => 
                theme.palette.mode === 'dark' 
                  ? 'rgba(30, 30, 35, 0.7)' 
                  : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              backgroundImage: (theme) => 
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
                  : 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar 
                src={getFullImageUrl(currentUser?.profilePicture) || '/default-avatar.png'}
                sx={{ 
                  width: 48, 
                  height: 48, 
                  cursor: 'pointer',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 10px rgba(106, 27, 154, 0.2)',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
                onClick={() => navigate(`/profile/${currentUser?.id}`)}
              />
              <TextField
                fullWidth
                placeholder="What's on your mind?"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 10,
                    backgroundColor: (theme) => 
                      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '1px'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    }
                  }
                }}
                onClick={() => setCreatePostOpen(true)}
                InputProps={{
                  sx: { py: 1.5, px: 2 }
                }}
              />
              <Tooltip title="Create post">
                <IconButton
                  color="primary"
                  sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    width: 48,
                    height: 48,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(106, 27, 154, 0.25)',
                    '&:hover': { 
                      backgroundColor: 'primary.dark',
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 16px rgba(106, 27, 154, 0.3)'
                    }
                  }}
                  onClick={() => setCreatePostOpen(true)}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>

          {/* Feed Content */}
          {feedLoading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center', 
              py: 8 
            }}>
              <CircularProgress 
                size={60} 
                thickness={4}
                sx={{ 
                  color: 'primary.main',
                  mb: 3
                }} 
              />
              <Typography variant="h6" color="text.secondary" fontWeight={500}>
                Loading your feed...
              </Typography>
            </Box>
          ) : posts.length === 0 ? (
            <Fade in={true} timeout={500}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 5, 
                  textAlign: 'center', 
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'rgba(30, 30, 35, 0.7)' 
                      : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  backgroundImage: (theme) => 
                    theme.palette.mode === 'dark'
                      ? 'radial-gradient(at 30% 20%, rgba(155, 39, 176, 0.15) 0px, transparent 50%)'
                      : 'radial-gradient(at 30% 20%, rgba(155, 39, 176, 0.05) 0px, transparent 50%)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                  <Box sx={{ mb: 3 }}>
                    {activeTab === 0 ? 
                      <img src="/empty-feed.svg" alt="Empty feed" width={180} height={180} /> : 
                      <img src="/explore.svg" alt="Explore" width={180} height={180} />
                    }
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {activeTab === 0 ? "Your feed is empty" : "No posts to discover"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {activeTab === 0 
                      ? "Follow more people or create your first post to get started" 
                      : "Explore trending topics or try searching for something different"}
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    disableElevation
                    sx={{ 
                      borderRadius: 10, 
                      px: 4, 
                      py: 1.5,
                      mt: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
                      boxShadow: '0 4px 12px rgba(106, 27, 154, 0.25)',
                      '&:hover': {
                        boxShadow: '0 6px 18px rgba(106, 27, 154, 0.3)',
                      }
                    }}
                    onClick={() => activeTab === 0 ? setCreatePostOpen(true) : navigate('/explore')}
                  >
                    {activeTab === 0 ? "Create Post" : "Explore"}
                  </Button>
                </Box>
              </Paper>
            </Fade>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {posts.map((post, index) => (
                <Fade key={post.id} in={true} timeout={300 + index * 100}>
                  <Box>
                    <PostCard post={post} />
                  </Box>
                </Fade>
              ))}
            </Box>
          )}
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={3}>
          <Box sx={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Search */}
            <Paper
              elevation={0}
              sx={{
                p: 0.5,
                borderRadius: 10,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'rgba(30, 30, 35, 0.7)' 
                    : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                backgroundImage: (theme) => 
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
                    : 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <TextField
                fullWidth
                placeholder="Search"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  sx: {
                    borderRadius: 10,
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    }
                  }
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Paper>

            {/* Trending Skills */}
            <TrendingSkillsCard 
              sx={{ 
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'rgba(30, 30, 35, 0.7)' 
                    : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                backgroundImage: (theme) => 
                  theme.palette.mode === 'dark'
                    ? 'radial-gradient(at 70% 20%, rgba(106, 27, 154, 0.15) 0px, transparent 50%)'
                    : 'radial-gradient(at 70% 20%, rgba(106, 27, 154, 0.05) 0px, transparent 50%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }} 
            />

            {/* Suggested Users */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'rgba(30, 30, 35, 0.7)' 
                    : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                backgroundImage: (theme) => 
                  theme.palette.mode === 'dark'
                    ? 'radial-gradient(at 100% 80%, rgba(106, 27, 154, 0.15) 0px, transparent 50%)'
                    : 'radial-gradient(at 100% 80%, rgba(106, 27, 154, 0.05) 0px, transparent 50%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Suggested Connections
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title="Find more people">
                  <IconButton 
                    size="small" 
                    onClick={() => navigate('/explore')}
                    sx={{
                      color: 'primary.main',
                      backgroundColor: 'action.selected',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <ExploreIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {suggestedUsersData?.data?.slice(0, 5).map((user, index) => (
                  <Fade key={user.id} in={true} timeout={300 + index * 100}>
                    <Box>
                      <SuggestedUserCard user={user} />
                    </Box>
                  </Fade>
                ))}
                {!suggestedUsersData?.data?.length && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 3, 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <img src="/no-suggestions.svg" alt="No suggestions" width={80} height={80} />
                    <Typography variant="body2" color="text.secondary">
                      No suggestions available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Footer Links */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              justifyContent: 'center',
              pt: 2,
              opacity: 0.7
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  cursor: 'pointer', 
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' } 
                }}
              >
                About
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  cursor: 'pointer', 
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' } 
                }}
              >
                Privacy
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  cursor: 'pointer', 
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' } 
                }}
              >
                Terms
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  cursor: 'pointer', 
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' } 
                }}
              >
                Help
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <CreatePostDialog 
        open={createPostOpen} 
        onClose={() => setCreatePostOpen(false)} 
      />
    </Container>
  );
}