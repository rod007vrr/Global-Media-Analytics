/* eslint-disable react/jsx-filename-extension */
// Create a React Component with that takes in a country name and displays the following country's data as three columns: top 10 songs, top 10 netflix shows, top 10 netflix movies, assume this info is passed in a an array of strings a parameter to the component

import React, { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import ScreenGrid from '../components/ScreenGrid';
import { useData } from '../util/api';

function CountryInfo({ countryName, backFunction, startWeek, endWeek }) {
  // TODO: double check category and endpoints here
  const songParams = new URLSearchParams({
    country: countryName,
    startWeek: startWeek - 14400 || 0,
    endWeek: endWeek - 14400 || Number.MAX_SAFE_INTEGER,
  });
  const fetchedSongs = useData(`top_songs?${songParams}`);

  const showParams = new URLSearchParams({
    country: countryName,
    startWeek: startWeek - 14400 || 0,
    endWeek: endWeek - 14400 || Number.MAX_SAFE_INTEGER,
    category: 'TV',
  });
  const fetchedShows = useData(`top_ten_media?${showParams}`);
  const movieParams = new URLSearchParams({
    country: countryName,
    startWeek: startWeek - 14400 || 0,
    endWeek: endWeek - 14400 || Number.MAX_SAFE_INTEGER,
    category: 'Films',
  });
  const fetchedMovies = useData(`top_ten_media?${movieParams}`);

  const scoreParams = new URLSearchParams({
    country: countryName,
    startWeek: startWeek - 14400 || 0,
    endWeek: endWeek - 14400 || Number.MAX_SAFE_INTEGER,
  });
  const fetchedScore = useData(`movie_diff_country?${scoreParams}`);
  if (!fetchedSongs || !fetchedShows || !fetchedMovies || !fetchedScore) {
    console.log('loading');
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }

  let mismatchScore = 0;
  if (!fetchedScore.data) {
    mismatchScore = 0;
  } else {
    const sum = fetchedScore.data.reduce((total, date) => total + date.diff, 0);
    const avg = sum / fetchedScore.data.length;
    mismatchScore = avg;
  }

  const songs = fetchedSongs.data || [];
  const shows = fetchedShows.data || [];
  const movies = fetchedMovies.data || [];

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
      {' '}
      <div
        style={{
          height: '85%',
        }}
      >
        <Button variant="contained" onClick={backFunction}>
          Back
        </Button>
        <br />
        <br />
        <Typography variant="h6" gutterBottom>
          {countryName}
        </Typography>
        <ScreenGrid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h7">Top 10 Songs</Typography>
            {songs.map((song, i) => (
              <div>
                <Typography variant="h8">
                  {i + 1}. {song.track_name}
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
                  {i + 1}. {show.show_title}
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
                  {i + 1}. {movie.show_title}
                </Typography>
                <br />
              </div>
            ))}
          </Grid>
        </ScreenGrid>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h7" align="center" inline>
          Mismatch Score:
        </Typography>
        <br />
        <Typography variant="h7" align="center" inline>
          {mismatchScore}
        </Typography>
      </div>
    </div>
  );
}

export default CountryInfo;
