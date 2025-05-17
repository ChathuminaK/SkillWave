import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactQueryDevtools } from 'react-query/devtools';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ExplorePage from './pages/ExploreSkillsPage';
import PostPage from './pages/PostPage';
import LearningPlanPage from './pages/LearningPlanPage';
import CreateLearningPlanPage from './pages/CreateLearningPlanPage';
import SavedPostsPage from './pages/SavedPostsPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Layout from './components/Layout';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      light: '#aa52d9',
      main: '#7b1fa2',
      dark: '#4a0072',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ff6090',
      main: '#ff1a66',
      dark: '#c60055',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#1a1a2b',
      secondary: '#4f4f6f'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.25px',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.5px',
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '10px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#c5c5c5',
          borderRadius: '10px',
          '&:hover': {
            background: '#7b1fa2',
          },
        },
        'html': {
          scrollBehavior: 'smooth',
        },
        '*, *::before, *::after': {
          transition: 'all 0.1s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 20px',
          boxShadow: 'none',
          fontWeight: 600,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 15px rgba(123, 31, 162, 0.2)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
            boxShadow: '0 3px 6px rgba(123, 31, 162, 0.1)',
          },
        },
        contained: {
          boxShadow: '0 4px 10px rgba(123, 31, 162, 0.15)',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.07)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(123, 31, 162, 0.15)',
            },
            '&:hover': {
              boxShadow: '0 0 0 1px rgba(123, 31, 162, 0.1)',
            },
          },
          '& .MuiInputLabel-root': {
            transition: 'color 0.2s ease-in-out',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease',
          fontWeight: 500,
          '&:hover': {
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.07)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.09)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12)',
          border: '2px solid #ffffff',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(123, 31, 162, 0.04)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s',
          fontWeight: 500,
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          position: 'relative',
          '&:hover': {
            textDecoration: 'none',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 15px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          <Route path="profile/:userId" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="edit-profile" element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="explore" element={<ExplorePage />} />
          
          <Route path="posts/:postId" element={<PostPage />} />
          
          <Route path="learning-plans/:planId" element={<LearningPlanPage />} />
          
          <Route path="learning-plans/create" element={
            <ProtectedRoute>
              <CreateLearningPlanPage />
            </ProtectedRoute>
          } />
          
          <Route path="learning-plans/edit/:planId" element={
            <ProtectedRoute>
              <CreateLearningPlanPage />
            </ProtectedRoute>
          } />
          
          <Route path="saved-posts" element={
            <ProtectedRoute>
              <SavedPostsPage />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  );
}

export default App;
