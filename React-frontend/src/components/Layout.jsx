import { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Container, Button, Avatar,
  IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, useMediaQuery, useTheme, Badge, Menu, MenuItem, Tooltip,
  Popover, Paper, ListItemAvatar, Typography as MuiTypography
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Explore as ExploreIcon,
  Bookmark as BookmarkIcon,
  AccountCircle as AccountIcon,
  Notifications as NotificationsIcon,
  Create as CreateIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Comment as CommentIcon,
  Favorite as LikeIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useQuery, useQueryClient } from 'react-query';
import { AuthContext } from '../contexts/AuthContext';
import { getFullImageUrl } from '../utils/imageUtils';
import { notificationApi } from '../services/api';
import { format } from 'date-fns';

export default function Layout() {
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
    queryClient.invalidateQueries(['notifications']);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = async () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const { data: unreadCount } = useQuery(
    ['unreadNotifications'], 
    () => notificationApi.getUnreadCount(),
    { 
      enabled: isAuthenticated,
      refetchInterval: 30000,
    }
  );

  const { data: notifications } = useQuery(
    ['notifications'],
    () => notificationApi.getNotifications(),
    {
      enabled: isAuthenticated && Boolean(notificationsAnchor),
      onSuccess: () => {
        queryClient.invalidateQueries(['unreadNotifications']);
      }
    }
  );

  const handleNotificationClick = async (notification) => {
    await notificationApi.markAsRead(notification.id);
    queryClient.invalidateQueries(['notifications']);
    queryClient.invalidateQueries(['unreadNotifications']);
    handleNotificationsClose();
    switch(notification.type) {
      case 'COMMENT':
      case 'LIKE':
        navigate(`/posts/${notification.entityId}`);
        break;
      case 'FOLLOW':
        navigate(`/profile/${notification.senderId}`);
        break;
      case 'LEARNING_UPDATE':
        navigate(`/learning-progress/${notification.entityId}`);
        break;
      default:
        navigate('/');
    }
  };

  const handleMarkAllAsRead = async () => {
    await notificationApi.markAllAsRead();
    queryClient.invalidateQueries(['notifications']);
    queryClient.invalidateQueries(['unreadNotifications']);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon />, auth: true },
    { name: 'Explore', path: '/explore', icon: <ExploreIcon />, auth: false },
    { name: 'Saved Posts', path: '/saved-posts', icon: <BookmarkIcon />, auth: true },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div">
          SkillShare
        </Typography>
      </Box>
      <Divider />
      <Divider />
      <List>
        {isAuthenticated ? (
          <>
            <ListItem button onClick={() => navigate(`/profile/${currentUser.id}`)}>
              <ListItemIcon><AccountIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button onClick={() => navigate('/login')}>
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button onClick={() => navigate('/register')}>
              <ListItemIcon><RegisterIcon /></ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'COMMENT':
        return <CommentIcon color="primary" />;
      case 'LIKE':
        return <LikeIcon color="error" />;
      case 'FOLLOW':
        return <PersonIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}
            onClick={() => navigate('/')}
          >
            SkillWave
          </Typography>
          
          {isAuthenticated ? (
            <>
              <Tooltip title="Create Post">
                <IconButton 
                  onClick={() => navigate('/create-post')}
                  sx={{ 
                    mr: 1,
                    backgroundColor: 'rgba(106, 27, 154, 0.1)',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(106, 27, 154, 0.2)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CreateIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Notifications">
                <IconButton 
                  sx={{ 
                    mr: 1,
                    backgroundColor: 'rgba(106, 27, 154, 0.1)',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(106, 27, 154, 0.2)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                  onClick={handleNotificationsOpen}
                >
                  <Badge 
                    badgeContent={unreadCount?.data || 0} 
                    color="error"
                    sx={{ 
                      '& .MuiBadge-badge': {
                        backgroundColor: '#f50057',
                        color: 'white',
                        boxShadow: '0 0 0 2px #fff'
                      }
                    }}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Popover
                open={Boolean(notificationsAnchor)}
                anchorEl={notificationsAnchor}
                onClose={handleNotificationsClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  elevation: 4,
                  sx: { borderRadius: 2, width: { xs: '100%', sm: 360 }, maxWidth: '95vw' }
                }}
              >
                <Paper sx={{ width: '100%', maxHeight: 400, overflow: 'auto' }}>
                  <Box sx={{ 
                    p: 2,
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'background.paper',
                    zIndex: 1
                  }}>
                    <Typography variant="h6" fontWeight="bold">Notifications</Typography>
                    <Button 
                      size="small" 
                      onClick={handleMarkAllAsRead}
                      sx={{ textTransform: 'none', fontWeight: 500 }}
                    >
                      Mark All as Read
                    </Button>
                  </Box>
                  <List sx={{ py: 0 }}>
                    {notifications?.data?.content?.length > 0 ? (
                      notifications.data.content.map((notification) => (
                        <ListItem 
                          key={notification.id}
                          button 
                          onClick={() => handleNotificationClick(notification)}
                          sx={{
                            transition: 'background-color 0.2s ease',
                            bgcolor: notification.read ? 'transparent' : 'rgba(106, 27, 154, 0.05)',
                            borderLeft: notification.read ? 'none' : '3px solid',
                            borderLeftColor: 'primary.main',
                            '&:hover': {
                              bgcolor: 'rgba(106, 27, 154, 0.1)'
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              bgcolor: notification.read ? 'action.selected' : 'primary.light',
                            }}>
                              {getNotificationIcon(notification.type)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={notification.content}
                            secondary={format(new Date(notification.createdAt), 'MMM d, yyyy • h:mm a')}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText 
                          primary="No notifications"
                          primaryTypographyProps={{ 
                            color: 'text.secondary', 
                            align: 'center',
                            py: 3
                          }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Popover>
              
              <Tooltip title="Profile">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  edge="end"
                  sx={{
                    ml: 0.5,
                    border: '2px solid',
                    borderColor: 'primary.light',
                    p: 0.25,
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <Avatar 
                    alt={currentUser?.name}
                    src={getFullImageUrl(currentUser.profilePicture) || '/default-avatar.png'}                    
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 3,
                  sx: { minWidth: 200, mt: 1.5, borderRadius: 2 }
                }}
              >
                <Box sx={{ py: 1, px: 2, mb: 1 }}>
                  <Typography variant="subtitle2" noWrap>{currentUser?.name}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>@{currentUser?.username}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => {
                  handleProfileMenuClose();
                  navigate(`/profile/${currentUser.id}`);
                }} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <AccountIcon fontSize="small" />
                  </ListItemIcon>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => {
                  handleProfileMenuClose();
                  navigate('/edit-profile');
                }} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <CreateIcon fontSize="small" />
                  </ListItemIcon>
                  Edit Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                  </ListItemIcon>
                  <Typography color="error">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box>
              <Button 
                color="primary" 
                onClick={() => navigate('/login')}
                sx={{ 
                  mr: 1,
                  fontWeight: 500,
                  borderRadius: 6,
                  px: 2.5
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/register')}
                sx={{
                  fontWeight: 500,
                  borderRadius: 6,
                  px: 2.5,
                  background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
                  boxShadow: '0 4px 10px rgba(106, 27, 154, 0.3)'
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 280, borderRadius: '0 16px 16px 0' },
        }}
      >
        {drawer}
      </Drawer>

      <Container component="main" sx={{ py: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          py: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 'auto',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} SkillWave - Connect, Learn, Grow
          </Typography>
        </Container>
      </Box>
    </>
  );
}
