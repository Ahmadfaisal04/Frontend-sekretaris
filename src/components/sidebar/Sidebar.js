import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)`
  width: ${drawerWidth}px;
  flex-shrink: 0;
  
  & .MuiDrawer-paper {
    width: ${drawerWidth}px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #1a237e 0%, #0d47a1 100%);
    color: white;
    border-right: none;
  }
`;

const Header = styled(Box)`
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderText = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const StyledListItem = styled(ListItem)`
  margin: 4px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);

  &:hover {
    background: #4caf50;
    transform: none;
    box-shadow: none;
    color: #fff;
  }

  &.active {
    background: #4caf50;
    color: #fff;
    
    .MuiListItemIcon-root {
      color: #fff;
    }
    
    .MuiTypography-root {
      font-weight: 600;
      color: #fff;
    }
  }

  .MuiListItemIcon-root {
    color: inherit;
    min-width: 40px;
    transition: color 0.2s ease;
  }

  .MuiTypography-root {
    color: inherit;
    transition: color 0.2s ease;
  }
`;

const menuItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { title: 'Surat Masuk', icon: <TrendingUpIcon />, path: '/pemasukan' },
  { title: 'Surat Keluar', icon: <TrendingDownIcon />, path: '/pengeluaran' },
  { title: 'Laporan Keuangan', icon: <AssessmentIcon />, path: '/laporan' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <StyledDrawer variant="permanent">
      <Header>
        <Image
          src="/image.png"
          alt="Logo"
          width={60}
          height={60}
          style={{ borderRadius: '50%' }}
        />
        <HeaderText>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.1rem',
              lineHeight: 1.2,
              mb: 0.5
            }}
          >
            Desa Bonto Ujung
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.8rem',
              fontWeight: 500,
              mb: 1
            }}
          >
            Kec. Tarowang, Kab. Jeneponto
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              pt: 1
            }}
          >
            MENU BENDAHARA
          </Typography>
        </HeaderText>
      </Header>

      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <StyledListItem
            key={item.title}
            button
            onClick={() => handleNavigation(item.path)}
            className={pathname === item.path ? 'active' : ''}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                sx: {
                  fontSize: '0.95rem',
                  fontWeight: pathname === item.path ? 600 : 400
                }
              }}
            />
          </StyledListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', mb: 2 }}>
        <StyledListItem
          button
          onClick={() => router.push('/authentication/sign-in')}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }
          }}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: 'inherit' }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              sx: { fontSize: '0.95rem' }
            }}
          />
        </StyledListItem>
      </Box>
    </StyledDrawer>
  );
} 