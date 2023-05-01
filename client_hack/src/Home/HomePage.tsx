import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import PrimaryButton from '../components/buttons/PrimaryButton';
import NavBar from '../components/navbar';

function HomePage() {
  const message = `Welcome to Worldwide Media!`;
  return (
    <ScreenGrid>
      <Typography variant="h1" style={{ margin: '40px' }}>
        {message}
      </Typography>
      <Typography variant="h6" style={{ margin: '10px' }}>
        This is a website of exploration - you can find statistics about media
        all over the world. Click down below to get started...
      </Typography>
      <Grid item container justifyContent="center" style={{ margin: '10px' }}>
        <PrimaryButton style={{ backgroundColor: '#1db954' }} href="/map">
          Click Me
        </PrimaryButton>
      </Grid>
    </ScreenGrid>
  );
}

export default HomePage;
