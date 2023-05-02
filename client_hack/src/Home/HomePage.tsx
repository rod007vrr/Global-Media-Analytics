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
        Welcome to our Worldwide Media platform. Here you can find different
        statistics and take a look into the past of how our world consumes and
        enjoys media. You can search for specific songs that have been popular
        on Spotify worldwide, find artists’ performance across different
        countries and how they should perform in the future, as well as
        different countries’ difference and similarity in music taste. Beyond
        just music if you interact with our globe you can find mismatch scores
        between countries for both music and visual media. Peruse through the
        website to gain some insight in how and what kind of media is consumed
        throughout the world!
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
