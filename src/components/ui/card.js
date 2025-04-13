'use client'

import { Card as MuiCard, CardContent as MuiCardContent, Box, Typography, Divider } from '@mui/material'
import { shadows, gradients, colors } from '@/styles/colors'
import { styled } from '@mui/material/styles'

const CardRoot = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden'
}))

const CardHeader = styled(Box)(({ theme }) => ({
  padding: '24px',
  borderBottom: '1px solid #eee'
}))

const CardBody = styled(Box)(({ theme }) => ({
  padding: '24px'
}))

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#1a237e',
  marginBottom: '8px'
}))

const CardSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: 'rgba(0, 0, 0, 0.6)'
}))

// Komponen untuk header card
function CardHeaderComponent({ title, subtitle, action, ...props }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      mb: subtitle ? 0.5 : 2
    }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text.primary }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Box sx={{ ml: 2 }}>
          {action}
        </Box>
      )}
    </Box>
  )
}

// Komponen untuk body card
function CardBodyComponent({ children, divided, ...props }) {
  return (
    <Box 
      sx={{ 
        my: 2,
        ...(divided && {
          '& > *:not(:last-child)': {
            borderBottom: `1px solid ${colors.divider}`,
            pb: 2,
            mb: 2
          }
        }),
        ...props.sx
      }}
    >
      {children}
    </Box>
  )
}

// Komponen untuk footer card
function CardFooterComponent({ children, divider, ...props }) {
  return (
    <>
      {divider && <Divider sx={{ my: 2 }} />}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end',
        mt: divider ? 0 : 2,
        ...props.sx 
      }}>
        {children}
      </Box>
    </>
  )
}

// Komponen utama Card
function CardComponent({ children, variant = 'default', ...props }) {
  const getCardStyles = () => {
    switch (variant) {
      case 'purple-gradient':
        return {
          background: 'linear-gradient(150deg, #0284c7 0%, #0ea5e9 100%)',
          color: 'white',
          boxShadow: '0 10px 20px 0 rgba(2, 132, 199, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '400px',
          margin: '0 auto',
          maxWidth: '1000px',
          width: '100%',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 20px 40px 0 rgba(2, 132, 199, 0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
            opacity: 0.6,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 0.8,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 100%)',
            transition: 'opacity 0.3s ease',
          },
          '&:hover::after': {
            opacity: 0.7,
          }
        }
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: 'white',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.14)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'url("/card-pattern.png")',
            backgroundSize: 'cover',
            opacity: 0.1,
          },
          transform: 'translateY(0)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 25px 0 rgba(0,0,0,0.2)',
          }
        }
      case 'outlined':
        return {
          border: `1px solid ${colors.divider}`,
          background: '#ffffff',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: colors.primary.main,
            boxShadow: `0 0 0 1px ${colors.primary.main}20`,
          }
        }
      default:
        return {
          background: colors.background.card,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 18px 0 rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          }
        }
    }
  }

  return (
    <MuiCard
      sx={{
        borderRadius: '16px',
        ...getCardStyles(),
        ...props.sx
      }}
      {...props}
    >
      <MuiCardContent sx={{ 
        p: '24px !important',
        '&:last-child': { 
          pb: '24px !important' 
        }
      }}>
        {children}
      </MuiCardContent>
    </MuiCard>
  )
}

export { 
  CardHeaderComponent as CardHeader,
  CardBodyComponent as CardBody,
  CardFooterComponent as CardFooter,
  CardComponent as Card,
  CardTitle,
  CardSubtitle
}; 