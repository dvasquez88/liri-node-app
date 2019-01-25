const request = require('request');
const fs = require('fs');
const Spotify = require('node-spotify-api');

const dotenv = require("dotenv").config();
const keys = require("./keys.js");

const moment = require('moment');
moment().format();

const spotify = new Spotify(keys.spotify);

const command = process.argv[2];
const input = process.argv[3];


function concertIt(bandQuery) {

    var queryUrl = "https://rest.bandsintown.com/artists/" + bandQuery + "/events?app_id=codingbootcamp";
    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        // if request is successful
        if (!error && response.statusCode === 200) {

            var concertData = JSON.parse(body);

            var concertDT = concertData[0].datetime
            var momentDT = moment().format('L');


            // console.log(concertData);
            // for (i = 0; i < movieData.length && i < 5; i++) {
            console.log("===============================");
            console.log("Venue Name : " + concertData[0].venue.name +
                "\nVenue Location: " + concertData[0].venue.city + "," + concertData[0].venue.country +
                //  * Date of the Event (use moment to format this as "MM/DD/YYYY")
                "\nDate of the Event: " + momentDT +
                "\n===============================");

        };
    });
}
//     spotify-this-song
function spotifyIt(musicSearch) {

    //  if no song is provided then it will default to "The Sign" by Ace of Base.
    if (musicSearch === undefined || null) {
        musicSearch = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: musicSearch }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        else {
            for (i = 0; i < data.tracks.items.length && i < 5; i++) {

                var musicQuery = data.tracks.items[i];
                // console.log("===============================");
                // * Artist(s)
                console.log("Artist: " + musicQuery.artists[0].name +
                    // song name
                    "\nSong Name: " + musicQuery.name +
                    // preview link
                    "\nLink to Song: " + musicQuery.preview_url +
                    // album 
                    "\nAlbum Name: " + musicQuery.album.name +
                    "\n===============================");
            }
        };
    });
}

// movie-this
function movieIt(movieQuery) {

    // defaulting to Mr. Nobody
    if (movieQuery === undefined || null) {
        movieQuery = "Mr.Nobody";
    }

    // omdb query
    var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var movieData = JSON.parse(body);

            // for (i = 0; i < movieData.length && i < 5; i++) {
            console.log("===============================");              
            console.log("Movie Title: " + movieData.Title +
                // release year
                "\nYear: " + movieData.Year +
                // imdb rating
                "\nIMDB Rating: " + movieData.imdbRating +
                // rotten tomatoes rating
                "\nRotten Tomatoes Rating: " + movieData.Ratings[1].Value +
                // country of production
                "\nCountry: " + movieData.Country +
                // language of movie
                "\nLanguage: " + movieData.Language +
                // plot
                "\nPlot: " + movieData.Plot +
                // actors
                "\nActors: " + movieData.Actors +
                "\n===============================");
            // };
        };
    });
}

// switch cases
var ask = function (commands, funData) {
    switch (commands) {
        case "concert-this":
            concertIt(funData);
            break;
        case "movie-this":
            movieIt(funData);
            break;
        case 'spotify-this-song':
            spotifyIt(funData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("Invalid Input");
    }
};

// reads text from random.txt file, command is ran
var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) throw err;
        var randomText = data.split(",");

        if (randomText.length == 2) {
            ask(randomText[0], randomText[1]);
        }
        else if (randomText.length == 1) {
            ask(randomText[0]);
        }
    });
}
// asigns args to ask for switch case
ask(command, input);