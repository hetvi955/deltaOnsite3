const express = require("express");
const path = require("path");
const axios = require("axios");
const ejs = require("ejs");
const SpotifyWebApi = require("spotify-web-api-node");


const client_id = process.env.ClientID;
const client_secret = process.env.ClientSecret;

var spotifyApi = new SpotifyWebApi({
    client_id,
    client_secret
});
//app init
const app = express();

//view eng
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

//routes
app.get("/", (req, res) => {
  res.render('home',
  { error: "",count: 0, relatn: [] });
});

app.post("/", (req, res) => {
  const { Artist1, Artist2, token } = req.body;
  spotifyApi.setAccessToken(token);
  //@example
  //searchArtists('David Bowie', { limit : 5, offset : 1 }).then(...)
  //offset means the searchartists will chekc from 1 till limit
  spotifyApi.searchArtists(Artist2, { limit : 2, offset : 0},(err,doc)=> {
    if (err) {
      console.error(err);
    } else {
      spotifyApi.searchArtists(Artist1,(err,doc)=>{
        if (err) {
          console.error(err);
        } else {
    //The base-62 identifier that you can find at the end of the Spotify URI (see above) for an artist, track, album, playlist, etc. Unlike a Spotify URI,
    // a Spotify ID does not clearly identify the type of resource; that information is provided elsewhere in the call.
          var ar1Id = doc.body.artists.items[0].id;
          var artist1 = doc.body.artists.items[0];
          var ar2Id = doc.body.artists.items[0].id;
          var artist2 = doc.body.artists.items[0];
          var artistsObj = {};
          var find = 0;
          var found=false;
  
    //Get related artists.
//@param artistId — The artist's ID.
//@param callback — Optional callback method to be called instead of the promise.
//@example
//getArtistRelatedArtists('0oSGxfWSnnOXhD2fKuz2Gy').then(...)
    function search(id, count,  relatn) {
              spotifyApi.getArtistRelatedArtists(id).then(
              (doc)=> {
                var artists = doc.body.artists;
                var arr2 = [];
                artists.forEach(artist => {
                  arr2.push(artist.id);
            });
            if (arr2.includes(ar2Id)) {
                    res.render('home', {
                    count:count+1,
                    relatn: [...relatn, artist2],
                    error: '',
                    found:true
                });
             } else {
                  artists.forEach(artist => {
                    if (!artistsObj.hasOwnProperty(artist.id) &&
                      count <= 5 && !found) {
                      find++;
                      artistsObj[artist.id] = artist.id;
                      search(artist.id, count + 1, [...relatn, artist]);

              } else if(find >= 200){
                res.render('home', {
                count: 0,
                relatn: [],
                error: "we could not find a relation"
              });
                }
                });
              }
              },
            );
          }
//call to search
var arr = [artist1];
search(ar1Id, count=0, arr);
        }
    });
    }
  });
});

app.listen(3000, console.log('serverr up on port 3000'));
