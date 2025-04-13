import { Alert, Fade } from '@mui/material';

export default function AlertMessage({ message, severity, show }) {
  return (
    <Fade in={show}>
      <Alert severity={severity} sx={{ mb: 2 }}>
        {message}
      </Alert>
    </Fade>
  );
}