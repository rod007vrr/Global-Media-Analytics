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
app.get("/test", routes.test_connection);
app.get("/songs", routes.search_songs);
app.get("/songs_by_num_artists", routes.get_songs_by_num_artists);
app.get("/track", routes.get_track);
app.get("/top_songs", routes.get_top_songs);
app.get("/top_ten", routes.get_top_ten_media);
app.get("/yearly_top", routes.get_yearly_top_media);
app.get("/rank_range", routes.get_media_rank_range);


app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
