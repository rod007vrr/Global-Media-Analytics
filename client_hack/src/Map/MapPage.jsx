/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';

// Globe Source: https://github.com/vasturiano/react-globe.gl
import Globe from 'react-globe.gl';
import { Typography, Grid } from '@mui/material';
import DatePicker from 'react-date-picker';
import ScreenGrid from '../components/ScreenGrid';
import CountryInfo from './CountryInfo';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

// raw data used to create svgs for globe
import geoData from './geoData.json';
import { useData } from '../util/api';

function MapPage() {
  // State to capture which svg is being hovered and clicked on as specified by Globe API
  const [hoverD, setHoverD] = useState();
  const [clickD, setClickD] = useState();

  const countries = geoData;
  const [startValue, startOnChange] = useState(new Date('2021-02-04'));
  const [endValue, endOnChange] = useState(new Date());

  // For each country, determine if we have data on it or not
  // TODO: replace with call to database - use the datahook

  const fetchedCountries = useData(`countries_in_db`) || { data: [] };
  const listCountriesDict = fetchedCountries.data;
  const countriesWithData = listCountriesDict.map((obj) => obj.country);
  // resolve any name conflicts between the frontend and backend
  function resolveName(name) {
    if (name === 'United States of America') return 'United States';
    return name;
  }

  // Determine if a country has data
  function isCountryWithData(country) {
    return countriesWithData.includes(resolveName(country));
  }

  // Function which will be called when a country is hovered over
  // has three call possible outpus: onMatch, onFail, and onMiddle
  // onMatch is return when the country is hovered over and is a country with data
  // onMiddle is returned when the country is hovered over and is not a country with data
  // onFail is returned when the country is not hovered over
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

  // Handle click - if the country has data, set the clickD state to the country
  function clickFunction(currPoly) {
    if (currPoly && isCountryWithData(currPoly.properties.ADMIN)) {
      setClickD(currPoly);
    }
  }

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
        {clickD ? (
          <div
            style={{
              position: 'relative',
              right: '25px',
              // top: '5%',
              left: '-500px',
              height: '50%',
            }}
          >
            <CountryInfo
              countryName={
                clickD && clickD.properties
                  ? resolveName(clickD.properties.ADMIN)
                  : null
              }
              backFunction={() => setClickD(null)}
              // convert time to seconds as stored in backend
              startWeek={startValue ? startValue.getTime() / 1000 : 0}
              endWeek={
                endValue ? endValue.getTime() / 1000 : Number.MAX_SAFE_INTEGER
              }
            />
          </div>
        ) : null}
      </ScreenGrid>
    </>
  );
}

export default MapPage;
