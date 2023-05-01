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

// TODO: Create a function to convert a week in the format 'YYYY-MM-DD' to milliseconds
/**
 * QUERY 1:
 * GET ROUTE - retrieves all songs that were created by a specified
 *             number of artists
 * @param req needs to contain:
 * - num - number of artists
 */
const get_songs_by_num_artists = async function (req, res) {
  const num_artists = req.query.num;

  connection.query(
    `
    SELECT artist_names, track_name FROM spotify_songs WHERE artists_num = ${num_artists};
      `,
    (err, data) => {
      if (err) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.sendStatus(500);
      } else {
        // JSONify the data and return
        const parsed_data = JSON.parse(JSON.stringify(data));
        console.log(parsed_data);
        res.status(200).send(parsed_data);
      }
    }
  );
};

/**
 * QUERY 2:
 * GET ROUTE - retrieves the track information made
 * @param req needs to contain:
 * - name - the name of the track
 */

const get_track = async function (req, res) {
  const track_name = req.query.name;

  connection.query(
    `
    SELECT track_name, artist_names, album_cover, danceability, energy, song_key, valence, tempo, duration
    FROM spotify_songs S
    WHERE S.track_name = ${track_name};
      `,
    (err, data) => {
      if (err) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.sendStatus(500);
      } else {
        // JSONify the data and return
        const parsed_data = JSON.parse(JSON.stringify(data));
        console.log(parsed_data);
        res.status(200).send(parsed_data);
      }
    }
  );
};

/**
 * QUERY 3:
 * GET ROUTE - retrieves all songs in top 200 for one country
 *             in one particular week, ordered by ranking
 * @param req needs to contain:
 * - country - the country queried
 * - week - the week queried
 */

const get_top_songs = async function (req, res) {
  const week = req.query.week;
  const country = req.query.country;

  connection.query(
    `
    SELECT track_name, artist_names, country, song_chart_week, song_chart_rank
    FROM spotify_songs S JOIN spotify_ranks R ON S.uri = R.uri
    WHERE R.country = ${country} AND R.song_chart_week = ${week}
    ORDER BY song_chart_rank;
      `,
    (err, data) => {
      if (err) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.sendStatus(500);
      } else {
        // JSONify the data and return
        const parsed_data = JSON.parse(JSON.stringify(data));
        console.log(parsed_data);
        res.status(200).send(parsed_data);
      }
    }
  );
};

/**
 * QUERY 4:
 * GET ROUTE - retrieves top ten movies/shows for a particular
 *             country in a category for one week
 * @param req needs to contain:
 * - country - the country queried
 * - week - the week queried
 * - category - the category queried
 */
const get_top_ten_media = async function (req, res) {
  const week = req.query.week;
  const country = req.query.country;
  const category = req.query.category;

  connection.query(
    `
    SELECT R.show_title, R.country, R.week, R.weekly_rank
    FROM netflix_ranks R JOIN netflix_category C ON R.show_title = C.show_title
    WHERE R.week = ${week} AND R.weekly_rank < 11 AND 
          C.category = ${category} AND R.country = ${country}
    ORDER BY weekly_rank;
      `,
    (err, data) => {
      if (err) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.sendStatus(500);
      } else {
        // JSONify the data and return
        const parsed_data = JSON.parse(JSON.stringify(data));
        console.log(parsed_data);
        res.status(200).send(parsed_data);
      }
    }
  );
};

/**
 * QUERY 5:
 * GET ROUTE - retrieves top {num} movies/shows for each week of a
 *             given year in a given category
 * @param req needs to contain:
 * - year - the year queried
 * - week - the category queried
 * - num - the upper boundary of top media wwe want to retrieve (i.e. if we want top 5, num = 5)
 */
const get_yearly_top_media = async function (req, res) {
  /* Maybe add a country condition? */
  const year = req.query.year;
  const category = req.query.category;
  const num = req.query.num;

  /* TODO: add a function to convert year to a range of weeks in milliseconds
          E.g. input_year = 2022 -> start_week = 1641013200, end_week = 1672462800
          so query: week >= start_week AND week <= end_week
  */

  // For now use 2022:
  const start_week = 1641013200;
  const end_week = 1672462800;

  connection.query(
    `
    SELECT R.show_title, R.country, R.week
    FROM netflix_ranks R JOIN netflix_category C ON R.show_title = C.show_title
    WHERE R.week >= ${start_week} AND R.week <= ${end_week} AND 
          C.category = ${category} AND R.weekly_rank < ${num + 1}
    ORDER BY country;
      `,
    (err, data) => {
      if (err) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.sendStatus(500);
      } else {
        // JSONify the data and return
        const parsed_data = JSON.parse(JSON.stringify(data));
        console.log(parsed_data);
        res.status(200).send(parsed_data);
      }
    }
  );
};

/**
 * QUERY 6:
 * GET ROUTE - gets a country’s top media ranked within the given rank range for one week
 * @param req needs to contain:
 * - country - the country queried
 * - week - the week queried
 * - low - lower boundary for the ranks we want to retrieve
 * - high - upper boundary for the rank we want to retrieve
 */
const get_media_rank_range = async function (req, res) {
  const country = req.query.country;
  const week = req.query.week;
  const low = req.query.low;
  const high = req.query.high;

  connection.query(
    `
    SELECT R.show_title, R.country, R.week, R.weekly_rank, C.category
    FROM netflix_ranks R JOIN netflix_category C ON R.show_title = C.show_title
    WHERE R.week = ${week} AND R.weekly_rank >= ${low} AND 
          R.weekly_rank <=  ${high} AND R.country = ${country}
    ORDER BY category, weekly_rank; 
      `,
    (err, data) => {
      if (err) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.sendStatus(500);
      } else {
        // JSONify the data and return
        const parsed_data = JSON.parse(JSON.stringify(data));
        console.log(parsed_data);
        res.status(200).send(parsed_data);
      }
    }
  );
};

/**
 * GET ROUTE - retrieves any songs that meed the specified criteria
 * @param req needs to contain:
 * - date_start - the start date of the range of dates we want to search
 * - date_end - the end date of the range of dates we want to search
 * - country - the country we want to search
 * - num_weeks - the number of weeks we want to search
 * - dancemin - the minimum danceability score we want to search
 * - dancemax - the maximum danceability score we want to search
 * - energymin - the minimum energy score we want to search
 * - energymax - the maximum energy score we want to search
 * - valemin - the minimum valence score we want to search
 * - valmax - the maximum valence score we want to search
 * - tempomin - the minimum tempo score we want to search
 * - tempomax - the maximum tempo score we want to search
 * - durmin - the minimum duration score we want to search
 * - durmax - the maximum duration score we want to search
 * - release_date - the release date of the song we want to search
 * - artist - the artist of the song we want to search
 * - song - the song we want to search
 * - album - the album of the song we want to search
 */
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
  connection.query(
    `
    SELECT tt.country, top_tens, total_weeks, avg_weeks, avg_danceability
    FROM (SELECT *, COUNT(DISTINCT s.uri) as top_tens
    FROM spotify_songs s
        JOIN spotify_multiple sm ON s.artist_names = sm.artist_names
        JOIN spotify_ranks sr ON s.uri = sr.uri
        JOIN spotify_artist sa ON sa.artist_id = sm.artist_id
    WHERE artist_individual = 'Ariana Grande' AND sr.peak_rank <= 10
    GROUP BY country
    ORDER BY top_tens DESC) tt
    JOIN (SELECT *, SUM(weeks_on_chart) as total_weeks, AVG(weeks_on_chart) as avg_weeks,
                                            AVG(danceability) as avg_danceability
    FROM spotify_songs s
        JOIN spotify_multiple sm ON s.artist_names = sm.artist_names
        JOIN spotify_ranks sr ON s.uri = sr.uri
        JOIN spotify_artist sa ON sa.artist_id = sm.artist_id
    WHERE sa.artist_individual = 'Ariana Grande'
    GROUP BY country
    ORDER BY total_weeks DESC) w ON tt.country = w.country
    ORDER BY avg_weeks DESC, top_tens DESC
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
method: GET
description: for two given countries, we determine a total "similarity score" calculates as follows:
- if a song is in the top 10 for both countries at the same time, they get 3 points for that song
- if a song is in the top 10 for both countries at different times, they get 2 points for that song
- if an artist has at least one song in the top 10 for both countries, they get 1 point for that artist
query parameters:
  country1: name of the first country
  country2: name of the second country
returns: an integer corresponding exactly to the similarity score. The closer to 1000 the value is the more similar country's music taste is
status: 200 on success and 500 on error
*/
const country_similarity = async function (req, res) {
  const country1 = req.query.country2 == "undefined" ? "": req.query.country1;
  const country2 = req.query.country2 == "undefined" ? "": req.query.country2;

  connection.query(
    `
    WITH same_song_same_week AS (
      SELECT sr1.country as country1, sr2.country as country2, COUNT(DISTINCT sr1.uri) as num_shared_top_tens
      FROM spotify_ranks sr1 JOIN spotify_ranks sr2 ON sr1.song_chart_week = sr2.song_chart_week AND sr1.uri = sr2.uri
      WHERE sr1.country = '${country1}' AND sr2.country = '${country2}' AND sr1.song_chart_rank <= 10 AND sr2.song_chart_rank <= 10
      GROUP BY country1, country2
  ), same_song_different_week AS (
      SELECT sr1.country as country1, sr2.country as country2, COUNT(DISTINCT sr1.uri) as num_shared_top_tens
      FROM spotify_ranks sr1 JOIN spotify_ranks sr2 ON sr1.song_chart_week <> sr2.song_chart_week AND sr1.uri = sr2.uri
      WHERE sr1.country = '${country1}' AND sr2.country = '${country2}' AND sr1.song_chart_rank <= 10 AND sr2.song_chart_rank <= 10
      GROUP BY country1, country2
  ), artists_with_top_tens_shared AS (
      SELECT COUNT(*) as num
      FROM (SELECT artist_individual
      FROM spotify_ranks sr JOIN spotify_songs s on sr.uri = s.uri JOIN spotify_multiple sm ON sm.artist_names = s.artist_names
          JOIN spotify_artist sa ON sa.artist_id = sm.artist_id
      WHERE sr.peak_rank <= 10 AND sr.country = '${country1}'
      GROUP BY artist_individual) c1
      WHERE artist_individual IN (SELECT artist_individual
          FROM spotify_ranks sr JOIN spotify_songs s on sr.uri = s.uri JOIN spotify_multiple sm ON sm.artist_names = s.artist_names
      JOIN spotify_artist sa ON sa.artist_id = sm.artist_id
      WHERE sr.peak_rank <= 10 AND sr.country = '${country2}'
      GROUP BY artist_individual)
  )
      SELECT (3 * same_week.num_shared_top_tens + 2 * same_song_different_week.num_shared_top_tens + artists_with_top_tens_shared.num) as score
      FROM same_song_same_week same_week, same_song_different_week, artists_with_top_tens_shared
    `
  );
};
/**
 * GET ROUTE - retrieves artist rankings for a given week in a given country
 * @param req needs to contain:
 * - week - the end range of the weeks to get from
 * - weekmin - the start range of the weeks to get from
 * - country - the country to get rankings from
 */
const artist_rankings = async function (req, res) {
  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  // we can also send back an HTTP status code to indicate an improper request
  const weekmin = req.query.week == "undefined" ? -1 : req.query.weekmin;
  const weekmax = req.query.week == "undefined" ? -1 : req.query.weekmax;
  const country = req.query.country == "undefined" ? -1 : req.query.country;

  connection.query(
    `
    SELECT artist_individual,
    song_chart_week,
    country,
    Sum(pscore) AS value
FROM   (SELECT artist_individual,
            uri
     FROM   spotify_songs ss
            JOIN (SELECT artist_names,
                         artist_individual
                  FROM   spotify_multiple
                         JOIN spotify_artist sa
                           ON sa.artist_id = spotify_multiple.artist_id) sm
              ON ss.artist_names = sm.artist_names) songs_with_indiv_artist
    JOIN (SELECT uri,
                 song_chart_week,
                 country,
                 ( 200 - peak_rank ) + Log(weeks_on_chart) +
                 CASE
                   WHEN 0 <
                 peak_rank - song_chart_rank THEN 0
                   ELSE peak_rank - song_chart_rank
                 END AS pscore
          FROM   spotify_ranks
          WHERE  song_chart_week >= ${weekmin}$
                 AND song_chart_week <= ${weekmax}$
                 AND country = "${country}$") power
      ON power.uri = songs_with_indiv_artist.uri
GROUP  BY artist_individual,
       song_chart_week,
       country;
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

/**
 * GET ROUTE - retrieves show rankings for a given date range in a given country
 * @param req needs to contain:
 * - start - the week in which to get rankings from
 * - end - the week in which to get rankings from
 * - country - the country to get rankings from
 */
const netflix_rankings = async function (req, res) {
  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  // we can also send back an HTTP status code to indicate an improper request
  const start = req.query.start == "undefined" ? -1 : req.query.start;
  const end = req.query.end == "undefined" ? -1 : req.query.end;
  const country = req.query.country == "undefined" ? -1 : req.query.country;

  connection.query(
    `
    SELECT show_title, max(cumulative_weeks) * avg(weekly_rank) + min(weekly_rank) as power
    FROM netflix_ranks
    where week >= ${start}$ and week <= ${end}$
        and country = "${country}$"
    GROUP BY show_title
    ORDER BY power DESC;
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

/**
 * GET ROUTE - retrieves list of countries in db
 */
const countries_in_database = async function (req, res) {
  connection.query(
    `SELECT country
    FROM netflix_ranks
    UNION
    SELECT country
    FROM spotify_ranks;`,
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

/**
 * GET ROUTE - retrieves show rankings for a given date range in a given country
 * @param req needs to contain:
 * - country - the country to get information from
 */
const movie_diff_country = async function (req, res) {
  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  // we can also send back an HTTP status code to indicate an improper request
  const country = req.query.country == "undefined" ? -1 : req.query.country;

  connection.query(
    `
    SET @audience_rank = 0;
WITH reviewedFilmsInGlobal AS (
    SELECT title, audience_score, genre, week, weekly_rank
    FROM netflix_ratings r JOIN netflix_ranks gr ON r.title = gr.show_title
    WHERE audience_score > 0 and country = "Bahamas" and title in (select netflix_global_ranks.show_title as title
                                                                   from netflix_global_ranks)
    ORDER BY audience_score DESC
),
with_rank as (
    SELECT title, @audience_rank := @audience_rank + 1 as audience_rank, audience_score, week, weekly_rank
    FROM reviewedFilmsInGlobal
),
diff as (
    select *, ABS(audience_rank-weekly_rank) as diff
    from with_rank
    )
select week, avg(diff)
from diff
group by week;
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
  get_songs_by_num_artists,
  get_track,
  get_top_songs,
  get_top_ten_media,
  get_yearly_top_media,
  get_media_rank_range,
  artist_rankings,
  netflix_rankings,
  countries_in_database,
  chart_survivability,
  country_similarity,
  movie_diff_country,
};

// COMMENTS

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
