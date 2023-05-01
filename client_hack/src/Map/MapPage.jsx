/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
// import {
//   ComposableMap,
//   Geographies,
//   Sphere,
//   Geography,
//   ZoomableGroup,
// } from 'react-simple-maps';

// eslint-disable-next-line import/no-extraneous-dependencies
import Globe from 'react-globe.gl';
import { Typography, Button, Grid } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ScreenGrid from '../components/ScreenGrid';
import CountryInfo from './CountryInfo';

import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import geoPath from './topography.json';

import geoData from './geoData.json';

// export default function MapChart() {
//   return (
//     <ComposableMap>
//       <Geographies geography={geoPath}>
//         {({ geographies }) =>
//           geographies.map((geo) => {
//             return <Geography key={geo.rsmKey} geography={geo} />;
//           })
//         }
//       </Geographies>
//     </ComposableMap>
//   );
// }

const mapStyles = {
  width: '90%',
  height: 'auto',
};

function MapPage2() {
  return (
    // <div>
    //   <ComposableMap
    //     width={980}
    //     height={551}
    //     projection="geoOrthographic"
    //     style={{
    //       width: '100%',
    //       height: 'auto',
    //     }}
    //   >
    //     <Sphere stroke="#FF5533" strokeWidth={2} />
    //     <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json">
    //       {({ geographies }) => {
    //         return geographies.map((geo) => {
    //           // console.log(`here${JSON.stringify(geo)}`);
    //           // console.log(<Geography key={geo.rsmKey} geography={geo} />);
    //           return (
    //             <Geography
    //               key={geo.rsmKey}
    //               geography={geo}
    //               onClick={() => alert('click')}
    //             />
    //           );
    //         });
    //       }}
    //     </Geographies>
    //   </ComposableMap>
    // </div>
    // <div>
    //   <ComposableMap
    //     width={500}
    //     height={500}
    //     projection="geoOrthographic"
    //     projectionConfig={{ scale: 220 }}
    //     style={mapStyles}
    //   >
    //     <ZoomableGlobe>
    //       <circle
    //         cx={250}
    //         cy={250}
    //         r={220}
    //         fill="transparent"
    //         stroke="#CFD8DC"
    //       />
    //       <Geographies
    //         disableOptimization
    //         geography="https://unpkg.com/world-atlas@1.1.4/world/110m.json"
    //       >
    //         {({ geographies }) =>
    //           geographies.map((geo) => (
    //             <Geography
    //               key={geo.rsmKey}
    //               geography={geo}
    //               projection="geoOrthographic"
    //               style={{
    //                 default: { fill: '#CFD8DC' },
    //               }}
    //             />
    //           ))
    //         }
    //       </Geographies>
    //     </ZoomableGlobe>
    //   </ComposableMap>
    // </div>
    <div />
  );
}

// Using MUI create a functional component which has a field where you can input a date range

function MapPage() {
  const [hoverD, setHoverD] = useState();
  const countries = geoData;
  const [startValue, startOnChange] = useState(new Date());
  const [endValue, endOnChange] = useState(new Date());

  // const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

  // GDP per capita (avoiding countries with small pop)
  // const getVal = (feat) =>
  //   feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  // const maxVal = useMemo(
  //   () => Math.max(...countries.features.map(getVal)),
  //   [countries],
  // );
  // colorScale.domain([0, maxVal]);

  return (
    <>
      <Typography variant="h3">Map</Typography>
      <ScreenGrid>
        <Grid item>
        <div class="datepickers-flex-container" 
          style={{
            display: "flex",
            margin: "10px",
            justifyContent: "center"
          }}
        >
          <div style={{
            margin: "10px"
          }}>
            <DatePicker class="start-datepicker" minDate={new Date("2021-02-04")} maxDate={new Date("2022-07-14")} name={"Start Date"} onChange={startOnChange} value={startValue} />
          </div>
          <div style={{
            margin: "10px"
          }}>
            <DatePicker class="end-datepicker" minDate={new Date("2021-02-04")} maxDate={new Date("2022-07-14")} onChange={endOnChange} value={endValue} />
          </div>
        </div>
          <div>
            <Globe
              width="80%"
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              lineHoverPrecision={0}
              polygonsData={countries.features.filter(
                (d) => d.properties.ISO_A2 !== 'AQ',
              )}
              polygonAltitude={(d) => (d === hoverD ? 0.12 : 0.01)}
              polygonCapColor={(d) =>
                d === hoverD ? 'green' : 'rgba(0,0,0,0.5)'
              }
              polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
              polygonStrokeColor={() => '#111'}
              polygonLabel={({ properties: d }) => `
      <b>${d.ADMIN}</b>
    `}
              onPolygonHover={setHoverD}
              polygonsTransitionDuration={300}
              onPolygonClick={(p, e, c) => alert(`${p.properties.ADMIN}`)}
            />
          </div>
        </Grid>
        <Grid item>
          <CountryInfo />
        </Grid>
      </ScreenGrid>
    </>
  );
}

export default MapPage;
