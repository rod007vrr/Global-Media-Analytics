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
const author = async function (req, res) {
  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === "name") {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (null) {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res
      .status(400)
      .send(
        `'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`
      );
  }
};

module.exports = {
  author,
};
