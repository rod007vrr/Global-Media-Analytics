const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1:
// const author = async function (req, res) {
//   // checks the value of type the request parameters
//   // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
//   if (req.params.type === "name") {
//     // res.send returns data back to the requester via an HTTP response
//     res.send(`Created by ${name}`);
//   } else if (null) {
//     // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
//   } else {
//     // we can also send back an HTTP status code to indicate an improper request
//     res
//       .status(400)
//       .send(
//         `'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`
//       );
//   }
// };
/* endpoint: /songs
method: GET
description: returns all songs in the database that match the query parameters
query parameters:
dancemin: minimum dancebility (0.0 - 1.0)
dancemax: maximum dancebility (0.0 - 1.0)
energymin: minimum energy (0.0 - 1.0)
energymax: maximum energy (0.0 - 1.0)
valmin: maximum valence (0.0 - 1.0)
valmax: minimum valence (0.0 - 1.0)
keymin: song key (0 - 11)
keymax: song key (0 - 11)
tempomin: minimum tempo (0.0 - 1.0)
tempomax: maximum tempo (0.0 - 1.0)
durmin: minimum duration (in seconds)
durmax: maximum duration (in seconds)
release_date: release date of song
num_weeks: number of weeks on the billboard charts
countries: countries of billboard charts or global
date_start: start date of billboard charts
date_end: end date of billboard charts
artist: artist name
album: album name
song: song name
returns: array of song objects
song object:
{
  uri: song_link and unique identifier,
  arist_names: names of artist - comma separated
  album_name: name of album,
  track_name: name of song,
  release_date: release date of song,
  danceability: danceability of song,
  energy: energy of song,
  song_key: key of song,
  valence: valence of song,
  tempo: tempo of song,
  duration: duration of song,
}
status: 200 on success and 500 on error
*/
const search_songs = async function (req, res) {
  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  // we can also send back an HTTP status code to indicate an improper request
  const date_start =
    req.query.date_start == "undefined" ? -1 : req.query.date_start;
  const date_end = req.query.date_end == "undefined" ? -1 : req.query.date_end;
  const country = req.query.country == "undefined" ? -1 : req.query.country;
  const num_weeks =
    req.query.num_weeks == "undefined" ? -1 : req.query.num_weeks;
  const dancemin = req.query.dancemin == "undefined" ? -1 : req.query.dancemin;
  const dancemax = req.query.dancemax == "undefined" ? -1 : req.query.dancemax;
  const energymin =
    req.query.energymin == "undefined" ? -1 : req.query.energymin;
  const energymax =
    req.query.energymax == "undefined" ? -1 : req.query.energymax;
  const valmin = req.query.valmin == "undefined" ? -1 : req.query.valmin;
  const valmax = req.query.valmax == "undefined" ? -1 : req.query.valmax;
  const keymin = req.query.keymin == "undefined" ? -1 : req.query.keymin;
  const keymax = req.query.keymax == "undefined" ? -1 : req.query.keymax;
  const tempomin = req.query.tempomin == "undefined" ? -1 : req.query.tempomin;
  const tempomax = req.query.tempomax == "undefined" ? -1 : req.query.tempomax;
  const durmin = req.query.durmin == "undefined" ? -1 : req.query.durmin;
  const durmax = req.query.durmax == "undefined" ? -1 : req.query.durmax;
  const release_date =
    req.query.release_date == "undefined"
      ? "undefined"
      : req.query.release_date;
  const artist =
    req.query.artist == "undefined" ? "undefined" : req.query.artist;
  const album = req.query.album == "undefined" ? "undefined" : req.query.album;
  const song = req.query.song == "undefined" ? "undefined" : req.query.song;

  connection.query(
    `
    WITH numWeeks AS (
      SELECT uri, COUNT(*) AS num_weeks
      FROM spotify_ranks
      WHERE (${date_start} = -1 OR song_chart_week >= ${date_start})
      AND (${date_end} = -1 OR song_chart_week <= ${date_end})
      AND ("${country}" = "undefined" OR "${country}" = 'Global' OR country IN (${country}))
      GROUP BY uri
      HAVING (${num_weeks} = -1 OR COUNT(*) >= ${num_weeks})
    )
    SELECT *
    FROM spotify_songs s
    JOIN numWeeks r ON s.uri = r.uri
    WHERE (${dancemin}= -1 OR s.danceability >= ${dancemin})
    AND (${dancemax}= -1" OR s.danceability <= ${dancemax})
    AND (${energymin}= -1 OR s.energy >= ${energymin})
    AND (${energymax}= -1 OR s.energy <= ${energymax})
    AND (${valmin}= -1 OR s.valence >= ${valmin})
    AND (${valmax}= -1 OR s.valence <= ${valmax})
    AND (${keymin}= -1 OR s.song_key >= ${key_min})
    AND (${keymax}= -1 OR s.song_key <= ${key_max})
    AND (${tempomin}= -1 OR s.tempo >= ${tempomin})
    AND (${tempomax}= -1 OR s.tempo <= ${tempomax})
    AND (${durmin}= -1 OR s.duration >= ${durmin})
    AND (${durmax}= -1 OR s.duration <= ${durmax})
    AND (${release_date}= -1 OR s.release_date = ${release_date})
    AND "(${artist}" = "undefined" OR s.artist_names LIKE '%${artist}%')
    AND "(${album}" = "undefined" OR s.album_name LIKE '%${album}%')
    AND "(${song}" = "undefined" OR s.track_name LIKE '%${song}%')
      `,
    (err, data) => {
      if (err) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        // res.json({});
        res.sendStatus(500);
      } else {
        // Here, we return results of the query as an object, keeping only relevant data
        // being song_id and title which you will add. In this case, there is only one song
        // so we just directly access the first element of the query results array (data)
        // TODO (TASK 3): also return the song title in the response
        const parsed_data = JSON.parse(JSON.stringify(data));
        console.log(parsed_data);
        res.status(200).send(parsed_data);
      }
    }
  );
};


/*
method: GET
description: for a given artist, compares their chart survivability across all countries that they have top charting songs
query parameters:
  artist: the name of the artist
returns: array of objects corresponding to different countrys' survivabilities
status: 200 on success and 500 on error
*/
const chart_survivability = async function (req, res) {
  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  // we can also send back an HTTP status code to indicate an improper request
  const artist =
    req.query.artist_individual == "undefined" ? "" : req.query.artist_individual;

  connection.query(`
  WITH top_ten AS (
    SELECT country, COUNT(DISTINCT track_name) as top_tens
    FROM spotify_songs s JOIN spotify_ranks sr on s.uri = sr.uri
    WHERE s.artist_names LIKE '%${artist}%' AND sr.peak_rank <= 10
    GROUP BY country
    ORDER BY top_tens
    ), weeks AS (
    SELECT country, SUM(weeks_on_chart) as total_weeks, AVG(weeks_on_chart) as avg_weeks
    FROM spotify_songs s JOIN spotify_ranks r ON s.uri = r.uri
    WHERE s.artist_names LIKE '%${artist}%'
    GROUP BY country
    ) SELECT tt.country, top_tens, total_weeks, avg_weeks
    FROM top_ten tt JOIN weeks w ON tt.country = w.country
    WHERE tt.country <> 'Global'
    ORDER BY top_tens DESC, total_weeks DESC, avg_weeks DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.status(200).send(data);
    }
  });
}

const test_connection = async function (req, res) {
  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  // we can also send back an HTTP status code to indicate an improper request
  connection.query(
    `
    SELECT *
    FROM spotify_songs s
      `,
    (err, data) => {
      if (err || data.length === 0) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.json({});
      } else {
        // Here, we return results of the query as an object, keeping only relevant data
        // being song_id and title which you will add. In this case, there is only one song
        // so we just directly access the first element of the query results array (data)
        // TODO (TASK 3): also return the song title in the response
        const parsed_data = JSON.parse(JSON.stringify(data));
        console.log(parsed_data);
        res.status(200).send(parsed_data);
      }
    }
  );
};

module.exports = {
  // author,
  search_songs,
  test_connection,
};
