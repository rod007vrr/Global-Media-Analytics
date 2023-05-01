const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get("/songs", routes.search_songs);
app.get("/test", routes.test_connection);
app.get("/getsongsnumartists", routes.get_songs_by_num_artists);
app.get("/get_track", routes.get_track);
app.get("/top_songs", routes.get_top_songs);
app.get("/top_ten_media", routes.get_top_ten_media);
app.get("/yearly_top_media", routes.get_yearly_top_media);
app.get("/get_media_rank_range", routes.get_media_rank_range);
app.get("/artist_rankings", routes.artist_rankings);
app.get("/netflix_rankings", routes.netflix_rankings);
app.get("/countries_in_db", routes.countries_in_database);
app.get("/chart_survivability", routes.chart_survivability);
app.get("/country_similarity", routes.country_similarity);
app.get("/movie_diff_country", routes.movie_diff_country);

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
