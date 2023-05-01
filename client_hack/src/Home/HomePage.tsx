import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import PrimaryButton from '../components/buttons/PrimaryButton';
import NavBar from '../components/navbar';

function HomePage() {
  const message = `Welcome to Our Website!`;
  return (
    <ScreenGrid>
      <Typography variant="h4">{message}</Typography>
      <Typography variant="h6">
        This website does xyz and blah blah blah. Make sure to checkout the map
        to do blah - blah blah. if you want to search songs go to blah blah
        blah. if you want to get some interesting insights on the data go visit
        the blah blah blah page.
      </Typography>
      <Grid item container justifyContent="center">
        <PrimaryButton>Click Me</PrimaryButton>
      </Grid>
    </ScreenGrid>
  );
}

export default HomePage;
