'use client'

import { Box, Typography } from '@mui/material'
import { Card } from '@/components/ui/card'
import { colors } from '@/styles/colors'

export function StatsCard({ title, value, icon, trend = 'up', ...props }) {
  return (
    <Card 
      variant="outlined" 
      {...props}
      sx={{
        background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
        color: 'white',
        transform: 'perspective(1000px) rotateY(0deg)',
        transformOrigin: 'center',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'perspective(1000px) rotateY(10deg) translateY(-5px)',
          boxShadow: '0 12px 25px -5px rgba(2, 132, 199, 0.4)',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box 
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            p: 1.5,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            transform: 'perspective(1000px) rotateY(0deg)',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '.MuiCard-root:hover &': {
              transform: 'perspective(1000px) rotateY(-15deg)',
              bgcolor: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          <Typography sx={{ fontSize: '1.5rem' }}>
            {icon}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
          {title}
        </Typography>
      </Box>
      <Typography 
        gutterBottom 
        sx={{ 
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="h5" 
        sx={{ 
          color: 'white',
          fontWeight: 600,
          transform: 'perspective(1000px) rotateY(0deg)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '.MuiCard-root:hover &': {
            transform: 'perspective(1000px) rotateY(5deg)',
          }
        }}
      >
        {value}
      </Typography>
    </Card>
  )
} 