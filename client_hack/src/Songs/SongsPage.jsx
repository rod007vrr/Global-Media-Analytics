/* eslint-disable no-template-curly-in-string */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Source: https://github.com/vasturiano/react-globe.gl
// eslint-disable-next-line import/no-extraneous-dependencies
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

const config = require('../config.json');

// Using MUI create a functional component which has a field where you can input a date range

// function DurationValueLabel() {
//   return <div>{value}</div>;
// }

function SongPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [duration, setDuration] = useState([60, 660]);
  const [tempo, setTempo] = useState([0, 1100000000]);
  const [danceability, setDanceability] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);

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

  function formatDuration(ms) {
    const sec = ms / 1000;
    const date = new Date(0);
    date.setSeconds(sec ?? 0);
    return date.toISOString().substring(14, 19);
  }

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
      `requested at http://${config.server_host}:${config.server_port}/songs?title=${title}` +
        `&durmin=${duration[0]}&durmax=${duration[1]}` +
        `&dancemin=${danceability[0]}&dancemax=${danceability[1]}` +
        `&energymin=${energy[0]}&energymaax=${energy[1]}` +
        `&tempomin=${tempo[0]}&tempomax=${tempo[1]}` +
        `&valmin=${valence[0]}&valmax=${valence[1]}`,
    );
    fetch(
      `http://${config.server_host}:${config.server_port}/songs?` +
        `title=${title}` +
        `&artist=${artist}` +
        `&durmin=${duration[0] * 1000}&durmax=${duration[1] * 1000}` +
        `&dancemin=${danceability[0]}&dancemax=${danceability[1]}` +
        `&energymin=${energy[0]}&energymaax=${energy[1]}` +
        `&tempomin=${tempo[0]}&tempomax=${tempo[1]}` +
        `&valmin=${valence[0]}&valmax=${valence[1]}`,
    )
      .then((res) => res.json())
      .then((resJson) => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const songs = resJson.map((song) => ({
          id: song.id,
          title: song.track_name,
          artists: song.artist_names,
          release_date: song.release_date,
          duration: formatDuration(song.duration),
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
      <h2
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        Search Songs
      </h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
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
            // valueLabelFormat={DurationValueLabel}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Tempo (BPM)</p>
          <Slider
            value={tempo}
            min={0}
            max={250}
            step={1}
            onChange={(e, newValue) => setTempo(newValue)}
            valueLabelDisplay="auto"
            // valueLabelFormat={(value) => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Danceability</p>
          <Slider
            value={danceability}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, newValue) => setDanceability(newValue)}
            valueLabelDisplay="auto"
            // valueLabelFormat={(value) => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Energy</p>
          <Slider
            value={energy}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, newValue) => setEnergy(newValue)}
            valueLabelDisplay="auto"
            // valueLabelFormat={(value) => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Valence</p>
          <Slider
            value={valence}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, newValue) => setValence(newValue)}
            valueLabelDisplay="auto"
            // valueLabelFormat={(value) => <div>{value}</div>}
          />
        </Grid>
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

export default SongPage;
