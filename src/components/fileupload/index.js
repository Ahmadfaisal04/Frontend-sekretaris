import { Box, Typography, IconButton } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

export default function FileUpload({ label, name, onChange, accept }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <input
        accept={accept}
        type="file"
        name={name}
        onChange={onChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <IconButton component="span">
          <DescriptionIcon />
        </IconButton>
      </label>
    </Box>
  );
}