/* eslint-disable no-template-curly-in-string */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Source: https://github.com/vasturiano/react-globe.gl
// eslint-disable-next-line import/no-extraneous-dependencies
import Globe from 'react-globe.gl';
import {
  Typography,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Slider,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// eslint-disable-next-line import/no-extraneous-dependencies
import DatePicker from 'react-date-picker';
import ScreenGrid from '../components/ScreenGrid';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-date-picker/dist/DatePicker.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-calendar/dist/Calendar.css';
// import {
//   ComposableMap,
//   Geographies,
//   Sphere,
//   Geography,
//   ZoomableGroup,
// } from 'react-simple-maps';

const config = require('../config.json');

// Using MUI create a functional component which has a field where you can input a date range

function DurationValueLabel(props) {
  return <div>props.value</div>;
}

function MapPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState([60, 660]);
  const [plays, setPlays] = useState([0, 1100000000]);
  const [danceability, setDanceability] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);

  // ADDING hyperlink using the link to spotify songs
  const navigate = useNavigate();
  const routeChange = (newPath) => {
    const path = `${newPath}`;
    navigate(path);
  };

  const columns = [
    { field: 'title', headerName: 'Title', width: 300 }, // track_name
    { field: 'artists', headerName: 'Artists' }, // artist_names
    { field: 'release_date', headerName: 'Release Date' },
    { field: 'duration', headerName: 'Duration' },
    { field: 'danceability', headerName: 'Danceability' },
    { field: 'energy', headerName: 'Energy' },
    { field: 'valence', headerName: 'Valence' },
    { field: 'tempo', headerName: 'Tempo' },
    { field: 'album_cover', headerName: 'Album Cover' }, // album cover
    { field: 'link', headerName: 'Link' }, // uri
  ];

  /*
  FIELDS THAT ARE RETURNED: 
    uri
    artist_names
    artists_num
    track_name
    release_date
    album_cover
    danceability
    energy
    valence
    tempo
    duration
   */
  const search = () => {
    console.log(
      `requested at http://${config.server_host}:${config.server_port}/songs`,
    );
    fetch(`http://${config.server_host}:${config.server_port}/songs`)
      .then((res) => res.json())
      .then((resJson) => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const songs = resJson.map((song) => ({
          id: song.id,
          title: song.track_name,
          artists: song.artist_names,
          release_date: song.release_date,
          duration: song.duration,
          danceability: song.danceability,
          energy: song.energy,
          valence: song.valence,
          tempo: song.tempo,
          song_key: song.song_key,
          album_cover: song.album_cover, // TODO: change to hyperlink as well
          link: song.uri, // TODO: change to hyperlink maybe?
        }));
        setData(songs);
      });
  };

  return (
    <Container>
      <h2>Search Songs</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Duration</p>
          <Slider
            value={duration}
            min={60}
            max={660}
            step={10}
            onChange={(e, newValue) => setDuration(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={DurationValueLabel}
          />
        </Grid>
        {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
      </Grid>
      <Button
        onClick={() => search()}
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        Search
      </Button>
      <h2>Results</h2>
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
    </Container>
  );
}

export default MapPage;
