'use client';

import { AppBar, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box, Menu, MenuItem, Divider, Container, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'; // Ikon Surat Masuk
import SendIcon from '@mui/icons-material/Send'; // Ikon Surat Keluar
import ArchiveIcon from '@mui/icons-material/Archive'; // Ikon Arsip Surat
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSoftUIController, setMiniSidenav } from '@/context';
import { colors, shadows } from '@/styles/colors';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Menu untuk persuratan
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Surat Masuk', icon: <MarkEmailReadIcon />, path: '/suratmasuk' },
  { text: 'Surat Keluar', icon: <SendIcon />, path: '/suratkeluar' },
  { text: 'Arsip Surat', icon: <ArchiveIcon />, path: '/arsipsurat' },
];

export default function DashboardLayout({ children }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav } = controller;
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });
  const [user, setUser] = useState(null);
  const router = useRouter();
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleDrawerToggle = () => {
    setMiniSidenav(dispatch, !miniSidenav);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    handleClose();
  };

  const handleLogout = () => {
    Cookies.remove('isAuthenticated');
    localStorage.removeItem('user');
    router.push('/authentication/sign-in');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        px: 3,
        py: 2,
        minHeight: '80px !important'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/image.png"
            alt="Desa Logo"
            width={48}
            height={48}
            style={{ marginRight: '12px' }}
          />
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: darkMode ? '#fff' : colors.primary.main,
                fontSize: '1.25rem',
                lineHeight: '1.2'
              }}
            >
              Sistem Persuratan Desa
            </Typography>
            <Typography 
              variant="caption"
              sx={{
                color: darkMode ? '#fff' : colors.text.secondary,
                display: 'block'
              }}
            >
              Kelola surat masuk dan keluar dengan mudah
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Box sx={{ px: 3, mb: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? '#fff' : colors.text.secondary,
            fontWeight: 500,
            mb: 1
          }}
        >
          MENU PERSURATAN
        </Typography>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            href={item.path}
            selected={pathname === item.path}
            sx={{
              borderRadius: '12px',
              mb: 1,
              py: 1,
              color: darkMode ? '#fff' : 'inherit',
              '&.Mui-selected': {
                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#4caf50',
                color: darkMode ? '#fff' : '#fff',
                '& .MuiListItemIcon-root': {
                  color: darkMode ? '#fff' : '#fff',
                },
              },
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#4caf50',
                color: '#fff',
                '& .MuiListItemIcon-root': {
                  color: '#fff',
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: darkMode ? '#fff' : (pathname === item.path ? colors.primary.main : colors.text.secondary)
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: pathname === item.path ? 600 : 400,
                  color: darkMode ? '#fff' : 'inherit',
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      <List sx={{ px: 2, mt: 'auto' }}>
        <ListItem 
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            py: 1,
            color: darkMode ? '#fff' : colors.text.secondary,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : `${colors.primary.light}20`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: darkMode ? '#1a1a1a' : '#F8F9FA', 
      minHeight: '100vh',
      color: darkMode ? '#fff' : colors.text.primary,
    }}>
      <AppBar
        position="fixed"
        sx={{
          width: { 
            xs: '100%',
            sm: `calc(100% - ${miniSidenav ? '80px' : '280px'})`
          },
          ml: { 
            xs: 0,
            sm: miniSidenav ? '80px' : '280px'
          },
          bgcolor: darkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(6px)',
          color: darkMode ? '#fff' : colors.text.primary,
          boxShadow: 'none',
          '& .MuiIconButton-root': {
            color: darkMode ? '#fff' : colors.text.secondary,
          },
          transition: theme => theme.transitions.create(['margin', 'width', 'background-color', 'color'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: '64px !important', sm: '80px !important' },
          px: { xs: 2, sm: 3 }
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: darkMode ? '#fff' : colors.text.primary
            }}
          >
            {menuItems.find(item => item.path === pathname)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={handleClick}
              sx={{ color: 'inherit' }}
              aria-controls={open ? 'settings-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              id="settings-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'settings-button',
              }}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  minWidth: '200px',
                  boxShadow: shadows.card,
                  bgcolor: darkMode ? '#1a1a1a' : 'white',
                  color: darkMode ? '#fff' : 'inherit',
                  '& .MuiListItemIcon-root': {
                    color: darkMode ? '#fff' : 'inherit',
                  },
                }
              }}
            >
              <MenuItem onClick={toggleDarkMode}>
                <ListItemIcon>
                  {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{darkMode ? 'Light Mode' : 'Dark Mode'}</ListItemText>
              </MenuItem>
            </Menu>
            <Box 
              sx={{ 
                width: 36,
                height: 36,
                bgcolor: colors.primary.main,
                color: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={miniSidenav}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: { xs: '240px', sm: '280px' },
            bgcolor: darkMode ? '#1a1a1a' : 'white',
            borderRight: 'none',
            boxShadow: shadows.card,
            color: darkMode ? '#fff' : colors.text.primary,
            '& .MuiListItemIcon-root': {
              color: darkMode ? '#fff' : colors.text.secondary,
            },
            transition: theme => theme.transitions.create(['background-color', 'color'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: miniSidenav ? '80px' : '280px',
            bgcolor: darkMode ? '#1a1a1a' : 'white',
            borderRight: 'none',
            boxShadow: shadows.card,
            color: darkMode ? '#fff' : colors.text.primary,
            '& .MuiListItemIcon-root': {
              color: darkMode ? '#fff' : colors.text.secondary,
            },
            transition: theme => theme.transitions.create(['width', 'background-color', 'color'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 2, sm: 3 },
        mt: '80px',
        ml: { xs: 0, sm: miniSidenav ? '80px' : '280px' },
        width: { xs: '100%', sm: `calc(100% - ${miniSidenav ? '80px' : '280px'})` },
        transition: theme => theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 80px)',
      }}>
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
        
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: darkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(6px)',
            borderTop: '1px solid',
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3} alignItems="center" justifyContent="space-between">
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color={darkMode ? '#fff' : 'text.secondary'} align="left">
                  © {new Date().getFullYear()} Sistem Persuratan Desa
                </Typography>
                <Typography variant="caption" color={darkMode ? '#fff' : 'text.secondary'} display="block">
                  Desa Bonto Ujung, Kec. Tarowang, Kab. Jeneponto
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color={darkMode ? '#fff' : 'text.secondary'}>
                    Versi 1.0.0
                  </Typography>
                  <Typography variant="caption" color={darkMode ? '#fff' : 'text.secondary'}>
                    |
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color={darkMode ? '#fff' : 'text.secondary'}>
                      Dikembangkan oleh
                    </Typography>
                    <Link 
                      href="https://coconut.or.id" 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        textDecoration: 'none',
                        color: darkMode ? '#90caf9' : '#1976d2'
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        COCONUT Computer Club
                      </Typography>
                    </Link>
                    <Link 
                      href="https://www.instagram.com/coconutdotorg" 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        color: darkMode ? '#90caf9' : '#1976d2',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </Link>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}