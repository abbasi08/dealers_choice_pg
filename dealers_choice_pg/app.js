const { client, syncAndSeed } = require("./db");

const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 1337;

app.get("/", async (req, res, next) => {
  try {
    const response = await client.query("SELECT * FROM city;");
    const cities = response.rows;
    res.send(`
          <html> 
            <head> </head>
              <body>
                  <h1>Where My Sisters Live</h1>
                  <h2>Cities:</h2>
                  <ul>${cities
                    .map(
                      (city) => `
                      <li> <a href='/cities/${city.id}'>
                      ${city.name}
                      </a></li>
                  `
                    )
                    .join("")}</ul>
                </body>
          </html>`);
  } catch (error) {
    console.log(error);
  }
});

app.get("/cities/:id", async (req, res, next) => {
  try {
    const promises = [
      client.query("SELECT * FROM city WHERE id=$1;", [req.params.id]),
      client.query("SELECT * FROM sisters WHERE city_id=$1;", [req.params.id]),
    ];
    const responses = await Promise.all(promises);
    const city = responses[0].rows[0];
    const sisters = responses[1].rows;

    res.send(`
          <html> 
            <head> </head>
              <body>
                  <h1>Where My Sisters Live</h1>
                  <h3><a href='/'>Back to All Cities</a> </h3>
                  <h2>${city.name}</h2>
                  <ul>
                  ${sisters
                    .map(
                      (sister) => `
                    <li>${sister.name}</li>
                    `
                    )
                    .join("")}
                  </ul>
                </body>
          </html>`);
  } catch (error) {
    console.log(error);
  }
});

const setUp = async () => {
  try {
    await client.connect();
    await syncAndSeed();
    console.log("Connected to database");
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

setUp();
