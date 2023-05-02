/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { Container, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PrimaryButton from '../components/buttons/PrimaryButton';

import config from '../config.json';

function ArtistsPage() {
  const [artist, setArtist] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [survData, setSurvData] = useState([]);
  const [message, setMessage] = useState('Artists');
  const columns = [
    { field: 'title', headerName: 'Title', flex: 1, width: 100 },
    { field: 'release_date', headerName: 'Release Date', flex: 1, width: 100 },
    { field: 'country', headerName: 'Country', flex: 1, width: 100 },
    { field: 'peak_rank', headerName: 'Peak Rank', flex: 1, width: 100 },
  ];

  const survColumns = [
    { field: 'country', headerName: 'Country', flex: 1, width: 100 },
    {
      field: 'surv_score',
      headerName: 'Survivability Score',
      flex: 1,
      width: 100,
    },
    {
      field: 'top_tens',
      headerName: 'Total Top Ten Songs',
      flex: 1,
      width: 100,
    },
    {
      field: 'total_weeks',
      headerName: 'Total Number of Weeks',
      flex: 1,
      width: 100,
    },
    {
      field: 'avg_danceability',
      headerName: 'Danceability',
      flex: 1,
      width: 100,
    },
  ];

  // TODO: add for a user to be able to look which artists topped which country's
  // chart in a given week and a given country: look at artist_rankings in routes.js

  const search = () => {
    fetch(
      `http://${config.server_host}:${config.server_port}/artists?artist=${artist}`,
    )
      .then((res) => res.json())
      .then((resJson) => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const songs = resJson.map((song) => ({
          id: song.id,
          title: song.track_name,
          release_date: song.release_date,
          peak_rank: song.peak_rank,
          country: song.country,
        }));
        setData(songs);
      });
    fetch(
      `http://${config.server_host}:${config.server_port}/chart_survivability?artist_individual=${artist}`,
    )
      .then((res) => res.json())
      .then((resJson) => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const rows = resJson.map((row) => ({
          id: row.id,
          country: row.country,
          surv_score: row.avg_weeks,
          top_tens: row.top_tens,
          total_weeks: row.total_weeks,
          avg_danceability: row.avg_danceability,
        }));
        setSurvData(rows);
      });
  };

  return (
    <Container>
      <h2
        style={{
          top: '0',
          left: '0',
          width: '100%',
          margin: '30px auto auto auto',
          backgroundColor: '#191414',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {message}
      </h2>
      <div style={{ justifyContent: 'center' }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <TextField
              label="Find Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              style={{
                width: '100%',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <PrimaryButton
              onClick={() => {
                search();
                setMessage(artist);
              }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Find
            </PrimaryButton>
          </Grid>
        </Grid>
      </div>
      <div style={{}}>
        {/* TODO: change so that Song Charted By {artist} shows artist only after clicking find button */}
        <h2>Charted Songs</h2>
        {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
          autoWidth
        />
      </div>
      <div style={{}}>
        <h2>Survivability Scores By Country</h2>
        <h3>
          The table below shows the artist&apos;s chart survivability score. The
          higher the score - the longer the artist&apos;s songs stay in the
          charts.
        </h3>
        <DataGrid
          rows={survData}
          columns={survColumns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
          autoWidth
        />
      </div>
    </Container>
  );
}

export default ArtistsPage;
