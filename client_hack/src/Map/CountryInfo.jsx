/* eslint-disable react/jsx-filename-extension */
// Create a React Component with that takes in a country name and displays the following country's data as three columns: top 10 songs, top 10 netflix shows, top 10 netflix movies, assume this info is passed in a an array of strings a parameter to the component

import React, { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import ScreenGrid from '../components/ScreenGrid';
import { useData } from '../util/api';

// sample data

function CountryInfo({ countryName, backFunction, startWeek, endWeek }) {
  // TODO: double check category and endpoints here
  const songParams = new URLSearchParams({
    country: countryName,
    startWeek: startWeek || 0,
    endWeek: endWeek || Number.MAX_SAFE_INTEGER,
  });
  const fetchedSongs = useData(`top_songs?${songParams}`);

  // const showParams = URLSearchParams({
  //   country: countryName,
  //   startWeek: startWeek || 0,
  //   endWeek: endWeek || Number.MAX_SAFE_INTEGER,
  //   category: 'tv',
  // });
  // const fetchedShows = useData(`/shows/?${showParams}`);

  const movieParams = URLSearchParams({
    country: countryName,
    startWeek: startWeek || 0,
    endWeek: endWeek || Number.MAX_SAFE_INTEGER,
    category: 'movie',
  });

  // const fetchedMovies = useData(`/movies/?${movieParams}`);

  const fetchedMovies = true;
  const fetchedShows = true;

  /* const songs = [
    'song1',
    'song2',
    'song3',
    'song4',
    'song5',
    'song6',
    'song7',
    'song8',
    'song9',
    'song10',
  ]; */

  const shows = [
    'show1',
    'show2',
    'show3',
    'show4',
    'show5',
    'show6',
    'show7',
    'show8',
    'show9',
    'show10',
  ];

  const movies = [
    'movie1',
    'movie2',
    'movie3',
    'movie4',
    'movie5',
    'movie6',
    'movie7',
    'movie8',
    'movie9',
    'movie10',
  ];
  if (!fetchedSongs || !fetchedShows || !fetchedMovies) {
    console.log('loading');
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }

  const songs = fetchedSongs.data || [];

  return (
    <div
      style={{
        height: '100%',
        width: '400px',
        paddingTop: '25px',
        paddingLeft: '12.5px',
        paddingRight: '12.5px',
        marginBottom: '25px',
        backgroundColor: 'white',
        borderRadius: '25px',
      }}
    >
      <Button variant="contained" onClick={backFunction}>
        Back
      </Button>
      <Typography variant="h6">{countryName}</Typography>
      <ScreenGrid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h7">Top 10 Songs</Typography>
          {songs.map((song, i) => (
            <div>
              <Typography variant="h8">
                {i + 1}. {song}
              </Typography>
              <br />
            </div>
          ))}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h7">Top 10 Shows</Typography>
          {shows.map((show, i) => (
            <div>
              <Typography variant="h8">
                {i + 1}. {show}
              </Typography>
              <br />
            </div>
          ))}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h7">Top 10 Movies</Typography>
          {movies.map((movie, i) => (
            <div>
              <Typography variant="h8">
                {i + 1}. {movie}
              </Typography>
              <br />
            </div>
          ))}
        </Grid>
        {/* <Grid item xs={12}>
          <Button variant="contained" component={Link} to="/">
            Back
          </Button>
        </Grid> */}
      </ScreenGrid>
    </div>
  );
}

export default CountryInfo;
