/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { Typography, Button, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useData } from '../util/api';

/*
 * This component is a popup which displays the information for a country. It is used in MapPage.jsx
 * @param countryName The name of the country to display information for
 * @param backFunction The function to call when the back button is pressed (makes this popup disappear)
 * @param startWeek The start week of the date range to display information for
 * @param endWeek The end week of the date range to display information for
 */
function CountryInfo({ countryName, backFunction, startWeek, endWeek }) {
  // Fetch the data for the country and make sure to convert query to proper string formatting as well as make updates to ensure that the date matches with backend implementation
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

  const artistParams = new URLSearchParams({
    country: countryName,
    weekmin: startWeek - 14400 || 0,
    weekmax: endWeek - 14400 || Number.MAX_SAFE_INTEGER,
  });
  const fetchedArtists = useData(`artist_rankings?${artistParams}`);

  // If any of the data is not fetched yet, display a loading circle
  if (
    !fetchedSongs ||
    !fetchedShows ||
    !fetchedMovies ||
    !fetchedScore ||
    !fetchedArtists
  ) {
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
    // preprocessing to match  data representation
    const sum = fetchedScore.data.reduce((total, date) => total + date.diff, 0);
    const avg = sum / fetchedScore.data.length;
    mismatchScore = avg;
  }

  const songs = fetchedSongs.data || [];
  const shows = fetchedShows.data || [];
  const movies = fetchedMovies.data || [];
  const artists = fetchedArtists.data || [];

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
        overflow: 'auto',
      }}
    >
      {' '}
      <div>
        <Button variant="contained" onClick={backFunction}>
          Back
        </Button>
        <br />
        <br />
        <Typography variant="h6" gutterBottom>
          {countryName}
        </Typography>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          flexDirection="row"
          overflow="auto"
        >
          <Grid item xs={12}>
            <Typography variant="h7">Top 10 Songs</Typography>
            {songs.map((song, i) => (
              <div>
                <Typography variant="h9">
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
                <Typography variant="h9">
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
          <Grid item xs={12}>
            <Typography variant="h7">Top 10 Artists</Typography>
            {artists.map((artist, i) => (
              <div>
                <Typography variant="h8">
                  {i + 1}. {artist.artist_individual}
                </Typography>
                <br />
              </div>
            ))}
          </Grid>
        </Grid>
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
