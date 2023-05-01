/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';

// Source: https://github.com/vasturiano/react-globe.gl
// eslint-disable-next-line import/no-extraneous-dependencies
import Globe from 'react-globe.gl';
import { Typography, Grid } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import DatePicker from 'react-date-picker';
import ScreenGrid from '../components/ScreenGrid';
import CountryInfo from './CountryInfo';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-date-picker/dist/DatePicker.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-calendar/dist/Calendar.css';

import geoPath from './topography.json';

import geoData from './geoData.json';

// Using MUI create a functional component which has a field where you can input a date range

function MapPage() {
  // State to capture hovering and clicking as specified by Globe API
  const [hoverD, setHoverD] = useState();
  const [clickD, setClickD] = useState();

  const countries = geoData;
  const [startValue, startOnChange] = useState(new Date());
  const [endValue, endOnChange] = useState(new Date());

  // For each country, determine if we have data on it or not

  // TODO: replace with call to database - use the datahook
  const countriesWithData = [
    'United States of America',
    'Canada',
    'Argentina',
    'Brazil',
    'Mexico',
    'France',
    'Spain',
    'United Kingdom',
  ];

  function isCountryWithData(country) {
    return countriesWithData.includes(country);
  }

  // Hover Function
  function hoverFunction(currPoly, onMatch, onFail, onMiddle) {
    if (
      currPoly &&
      currPoly === hoverD &&
      isCountryWithData(currPoly.properties.ADMIN)
    ) {
      return onMatch;
    }
    if (onMiddle && currPoly && currPoly === hoverD) {
      return onMiddle;
    }
    return onFail;
  }

  // Handle click
  function clickFunction(currPoly) {
    if (currPoly && isCountryWithData(currPoly.properties.ADMIN)) {
      setClickD(currPoly);
    }
  }

  // function printer(d) {
  //   console.log('hoverD: ', JSON.stringify(d));
  //   return d === hoverD ? 0.12 : 0.01;
  // }

  return (
    <>
      <Typography
        variant="h3"
        textAlign="center"
        style={{ margin: '50px 30px auto 10px' }}
        gutterBottom
      >
        Explore Countries
      </Typography>
      <ScreenGrid>
        <Grid item>
          <div
            className="datepickers-flex-container"
            style={{
              display: 'flex',
              margin: '10px 10px 30px 10px',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                margin: '20px',
              }}
            >
              Start Date:{' '}
              <DatePicker
                class="start-datepicker"
                minDate={new Date('2021-02-04')}
                maxDate={new Date('2022-07-14')}
                name="Start Date"
                onChange={startOnChange}
                value={startValue}
              />
            </div>
            <div
              style={{
                margin: '20px',
              }}
            >
              End Date:{' '}
              <DatePicker
                class="end-datepicker"
                minDate={new Date('2021-02-04')}
                maxDate={new Date('2022-07-14')}
                onChange={endOnChange}
                value={endValue}
              />
            </div>
          </div>
          <div>
            <Globe
              // width={1000}
              height={800}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              lineHoverPrecision={0}
              polygonsData={countries.features.filter(
                (d) => d.properties.ISO_A2 !== 'AQ',
              )}
              polygonAltitude={(d) => hoverFunction(d, 0.12, 0.01)}
              polygonCapColor={(d) =>
                hoverFunction(
                  d,
                  'rgba(178,222,39,0.8)',
                  'rgba(0,0,0,0.5)',
                  'rgba(201,242,155,0.2)',
                )
              }
              polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
              polygonStrokeColor={() => '#111'}
              polygonLabel={({ properties: d }) => `
      <b>${d.ADMIN}</b>
    `}
              onPolygonHover={setHoverD}
              polygonsTransitionDuration={300}
              onPolygonClick={(poly, _event, _coords) => clickFunction(poly)}
            />
          </div>
        </Grid>
        <Grid item>
          {clickD ? (
            <div
              style={{
                position: 'relative',
                right: '25px',
                top: '25%',
                left: '-500px',
                height: '50%',
              }}
            >
              <CountryInfo
                countryName={
                  clickD && clickD.properties ? clickD.properties.ADMIN : null
                }
                backFunction={() => setClickD(null)}
                startWeek={startValue.getTime() / 1000}
                endWeek={endValue.getTime() / 1000}
              />
            </div>
          ) : null}
        </Grid>
      </ScreenGrid>
    </>
  );
}

export default MapPage;
