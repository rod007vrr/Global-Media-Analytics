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

/************ SCHEMA  *************

create table netflix_rank
(
   show_title       varchar(255) not null,
   country          varchar(255) not null,
   movie_chart_week date         not null,
   movie_chart_rank int          null,
   total_weeks      int          null,
   primary key (show_title, movie_chart_week, country)
);


create table netflix_category
(
   show_title varchar(255) not null
       primary key,
   category   varchar(255) null,
   constraint netflix_category_ibfk_1
       foreign key (show_title) references netflix_rank (show_title)
);


create table spotify_artist
(
   artist_individual varchar(255) not null
       primary key,
   artist_id         varchar(255) null,
   artist_img        varchar(255) null
);


create table spotify_songs
(
   uri          varchar(255) not null
       primary key,
   artist_names varchar(255) null,
   artists_num  int          null,
   track_name   varchar(255) null,
   release_date varchar(255) null,
   album_cover  varchar(255) null,
   danceability int          null,
   energy       int          null,
   song_key     int          null,
   valence      int          null,
   tempo        int          null,
   duration     int          null
);


create table spotify_ranks
(
   uri             varchar(255) not null,
   country         varchar(255) not null,
   song_chart_week varchar(255) not null,
   song_chart_rank int          null,
   peak_rank       int          null,
   previous_rank   int          null,
   weeks_on_chart  int          null,
   primary key (uri, country, song_chart_week),
   constraint spotify_ranks_ibfk_1
       foreign key (uri) references spotify_songs (uri)
);

**************************/

// Route 1:
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
*********************/

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
    req.query.artist_individual == "undefined"
      ? ""
      : req.query.artist_individual;
  // aggregate on country and more
  connection.query(
    `
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
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

/* 

Create table with country1, country2, and similarity score
similarity score is determined as such:
  - if a song is in top10 for country 1 at the same time as country2, then 3 points (2 points initially and 1 point for same artist)
  - if a song is in top10 for country 1 at a different time as country2 and no overlap, then 1 point
  - if 50% of songs in country 1 have the same genre as country2 during the same week, then 1 point
  - if the same artist has a song in top10 for both countries, then 1 point
*/
/* SUBOPTIMAL VERSION */
const country_similarity = async function (req, res) {
  connection.query(
    `
  WITH same_song_same_week AS (
    SELECT s1.country as country1, s2.country as country2, COUNT(*) as same_song_same_week
    FROM spotify_ranks r1 JOIN spotify_ranks r2 
    ON r1.uri = r2.uri AND r1.country > r2.country AND r1.song_chart_week = r2.song_chart_week
    GROUP BY r1.country, r2.country
  ),
  same_song_diff_week AS (
    SELECT s1.country as country1, s2.country as country2, COUNT(*) as same_song_diff_week
    FROM spotify_ranks r1 JOIN spotify_ranks r2
    ON r1.uri = r2.uri AND r1.country > r2.country AND r1.song_chart_week NOT IN (
      SELECT song_chart_week FROM spotify_ranks WHERE country = r2.country AND uri = r2.uri)
    GROUP BY r1.country, r2.country
  ),
  artist_count AS (
    (
      SELECT COUNT(*) as same_artist
      FROM (SELECT s1.artist_names AS artists_1, s1.uri AS uri_1, s2.artist_names AS artists_2, s2.uri AS uri_2
        FROM spotify_songs s1 JOIN spotify_songs s2 ON s1.uri > s2.uri) song_pairs
      WHERE (
        SELECT artist_individual FROM spotify_artist WHERE s1.artist_names LIKE CONCAT('%', artist_individual, '%')) s1_artists
      WHERE s1_artists.artist_individual IN (SELECT artist_individual FROM spotify_artist WHERE s2.artist_names LIKE CONCAT('%', artist_individual, '%')))
    )
  ,
  same_artist AS (
    SELECT s1.country as country1, s2.country as country2, COUNT(*) as same_artist
    FROM spotify_songs s1 JOIN  
    spotify_songs s2
    ON s1.uri <> s2.uri AND ()
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

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
