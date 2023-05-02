/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LoadingButton from '../components/buttons/LoadingButton';
import { getData } from '../util/api';

// A helper button to send a request to the backend to get the similarity score
function CompareButton({ country1, country2, setSimilarity }) {
  // determine if we are currently fetching data
  const [isLoading, setLoading] = useState(false);
  // fetch data from backend
  async function handleFetch() {
    if (country1 === '' || country2 === '') {
      return;
    }
    setLoading(true);
    // TODO: replace route with actual route will have to add country1 and country 2 as queries like in MapPage
    const searchParams = new URLSearchParams({
      country1,
      country2,
    });
    const res = await getData(`country_similarity?${searchParams}`);
    // TODO: sense check if res.data is the right input here
    setSimilarity(res.data[0].score);
    setLoading(false);
  }
  if (isLoading) {
    return <LoadingButton />;
  }
  return (
    <Button
      variant="contained"
      onClick={(_e) => handleFetch()}
      style={{ backgroundColor: '#1db954' }}
    >
      Compare
    </Button>
  );
}

// A page that lets you compare two countries and get their similarity score
function SimilarityPage() {
  const [country1, setCountry1] = React.useState('');
  const [country2, setCountry2] = React.useState('');
  const [similarity, setSimilarity] = useState(null);

  // To Do - replace with call to database
  const countries = [
    'United States',
    'Canada',
    'Argentina',
    'Brazil',
    'Mexico',
    'France',
    'Spain',
    'United Kingdom',
  ];
  const handleChange = (event, setter) => {
    setter(event.target.value);
  };
  return (
    <div>
      <Typography variant="h3" textAlign="center" gutterBottom margin="30px">
        Similarity
      </Typography>
      <Typography variant="h5" textAlign="center" gutterBottom margin="10px">
        Pick two countries to compare their top charts:
      </Typography>
      <Grid
        container
        xs={12}
        justifyContent="space-around"
        // alignItems="center"
        flexDirection="row"
        margin="30px"
      >
        <Grid item>
          <Box sx={{ width: 300 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Country 1</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={country1}
                label="Country 1"
                onChange={(event) => handleChange(event, setCountry1)}
              >
                {countries.map((country) => {
                  return <MenuItem value={country}>{country}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item>
          <Box sx={{ width: 300 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Country 2</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={country2}
                label="Country 1"
                onChange={(event) => handleChange(event, setCountry2)}
              >
                {countries
                  .filter((country) => country !== country1)
                  .map((country) => {
                    return <MenuItem value={country}>{country}</MenuItem>;
                  })}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <div style={{ margin: 'auto', width: '6%' }}>
        <CompareButton
          country1={country1}
          country2={country2}
          setSimilarity={setSimilarity}
        />
      </div>
      {similarity ? (
        <Typography variant="h4" textAlign="center" margin="70px">
          Similarity Score: {similarity}
        </Typography>
      ) : null}
    </div>
  );
}

export default SimilarityPage;
