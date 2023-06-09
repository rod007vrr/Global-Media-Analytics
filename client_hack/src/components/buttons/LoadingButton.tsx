import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * A disabled button that displays a loading indicator. To be used to prevent users from making multiple requests before first request is finished.
 */
function LoadingButton() {
  return (
    <Button variant="outlined" disabled size="small" sx={{ minWidth: '100px' }}>
      <CircularProgress size={20} />
    </Button>
  );
}

export default LoadingButton;
