import { Box, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { colors } from '@/styles/colors'

export default function SearchHistory({ placeholder = "Cari history...", value = "", onChange }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        bgcolor: 'white',
        borderRadius: '12px',
        px: 2,
        py: 1.5,
        width: '100%',
        maxWidth: '320px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid',
        borderColor: 'divider',
        '&:focus-within': {
          borderColor: '#1a237e',
          boxShadow: '0 0 0 2px rgba(26, 35, 126, 0.1)'
        }
      }}
    >
      <SearchIcon sx={{ color: colors.text.secondary, mr: 1 }} />
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fullWidth
        sx={{ 
          color: colors.text.primary,
          '& input': {
            p: 0
          }
        }}
      />
    </Box>
  )
} 