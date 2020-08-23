const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
var SpotifyWebApi = require("spotify-web-api-node");
const axios = require("axios");
const ejs = require("ejs");

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;

var sAPI = new SpotifyWebApi({
  clientId,
  clientSecret
});

//init app
const app = express();

app.use("/", express.static(path.join(__dirname, "public")));

// view Engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

//routes
app.get("/", (req, res) => {
  res.render("home", { count: 0, relation2: [], error: "" });
});

app.post("/", (req, res) => {
  const { artone, arttwo, token } = req.body;
  sAPI.setAccessToken(token);
  sAPI.searchArtists(arttwo, { limit: 1, offset: 0 }, function (err,data) {
    if (err) {
      console.error(err);
    } else {
      let art2id = data.body.artists.items[0].id;
      let art2 = data.body.artists.items[0];
      sAPI.searchArtists(artone, { limit: 1, offset: 0 }, function (err,data) {
        if (err) {
          console.error(err);
        } else {
          let art1id = data.body.artists.items[0].id;
          let art1 = data.body.artists.items[0];
          var artistsObj = {};
          let find = 0;
          let found = false;
          function search(id, count, relation) {
            var relation2 = relation;
            sAPI.getArtistRelatedArtists(id).then(
              function (data) {
                var artists = data.body.artists;
                var arr = [];
                artists.forEach(artist => {
                  arr.push(artist.id);
                });
                if (arr.includes(art2id)) {
                  found = true;
                  res.render("home", {
                    count: count + 1,
                    relation2: [...relation2, art2],
                    error: ""
                  });
                } else {
                  artists.forEach(artist => {
                    if (
                      !artistsObj.hasOwnProperty(artist.id) &&
                      count < 3 &&
                      !found
                    ) {
                      artistsObj[artist.id] = artist.id;
                      search(artist.id, count + 1, [...relation2, artist]);
                      find++;
                    } else {
                      if (find > 400) {
                        res.render("home", {
                          count: 0,
                          relation2: [],
                          error: "no short relations found :("
                       });
                    }
                    }
                  });
                }
              },
              function (err) {
                console.log(err);
              }
            );
          }
         var arr = [art1];
        search(art1id, 0, arr);
        }
      });
    }
  });
});

//port
const PORT = 3002;
app.listen(PORT, console.log(`Listening on port no: ${PORT}`));
