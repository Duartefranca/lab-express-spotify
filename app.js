require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});



spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("index");
});



app.get("/artist-search", (req, res) => {
  let { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items[0].images[0].url);

      res.render("artist-search-results", {result: data.body});
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res) => {
    let { id } = req.params;
  
    spotifyApi
      .getArtistAlbums(id)
      .then((data) => {
        console.log("The received data from the API: ", data.body.items[0].url);
  
        res.render("albums", {result: data.body});
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  });

  app.get("/tracks/:id", (req, res) => {
    let { id } = req.params;
  
    spotifyApi
    .getAlbumTracks(id)
      .then((data) => {
        console.log("The received data from the API: ", data.body.items[0].url);
  
        res.render("tracks", {result: data.body});
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  });



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
