const http = require('http');
const fs = require('fs');
const url = require('url');


console.log(process.env);
const musicPath = process.env.MUSIC_DIR;
if (musicPath) {
  console.log("MUSIC_DIR is set to: " + musicPath);
} else {
  console.log("Cannot make music server without MUSIC_DIR set");  
}

http.createServer(function (req, res) {
  //Parse request 
  const q = url.parse(req.url, true);
  const pathName = q.pathname;
  console.log(pathName); 
  
  //Handle home page request
  if (pathName == '/index.html') {
    console.log('Found index file request');
    return servePage(pathName, res);
  } else if (pathName == '/js/client-js/main.js') {
    console.log('Found main.js');
    return servePage(pathName, res); 
  //Handle song query
  } else if (pathName == '/getSong/') {
    console.log('Found getSong request');
    return serveSongRequest(q.query, res);    
  } else if (pathName == '/getMusic/') {
    console.log('Found getMusic request');
    return serveGetMusicRequest(q.query, res);
  } else {
    console.log(`Didn't understand request ${pathName}`);
  }


}).listen(8080);

const rootPath = '../../';
function servePage(pathName, res) {
  return fs.readFile(rootPath + pathName, function (err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}



function serveSongRequest(urlParsed,res) {
  const songName = urlParsed.song;
  console.log("Song requested is " + songName);

  const songPath = musicPath + "/" + urlParsed.artist + "/" + urlParsed.album + "/" + urlParsed.song;
  console.log("Song path is " + songPath);

  // Check that file exists
  try {
    stats = fs.lstatSync(songPath); // throws if path doesn't exist
  } catch (e) {
    console.log("Couldn't Find File");
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
    return;
  }

  if (stats.isFile()) {
    console.log("Its a file");
  } else {
    console.log("Its a dir");
  }

  return fs.readFile(songPath, function (err, data) {
    res.writeHead(200, {'Content-Type': 'audio/mpeg'});
    res.write(data);
    res.end();
  });
}

function getAllJsonInternal(typeString, path, res) {
  // Build string and ensure dir exists
  try {
      stats = fs.lstatSync(path); // throws if path doesn't exist
  } catch (e) {
    console.log(`Couldn't Find ${typeString}`);
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
    return;
  }
  if (!stats.isDirectory()) {
    console.log(`Couldn't Find ${typeString}`);
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
    return;
  } else {
    console.log(`Found ${typeString} Dir`);
  }

  // List all albums and return JSON
  var o = {} // empty Object
  var key = typeString;
  o[key] = []; // empty Array, which you can push() values into

  return fs.readdir(path, function (err, data) {
    data.forEach( element => {
      o[key].push(element);
    });

    res.writeHead(200, {'Content-Type': 'text/html'/*'application/json'*/});
    res.write(JSON.stringify(o));
    res.end();
  });
}

// Get all albums list
function getAllAlbumsJson(artistPath, res) {
  return getAllJsonInternal('Albums', artistPath, res);  
}

// Get all artists list
function getAllArtistsJson(res) {
  return getAllJsonInternal('Artists', musicPath, res);
}

// Get all songs list
function getAllSongsJson(albumPath, res) {
  return getAllJsonInternal('Songs', albumPath, res);
}

function serveGetMusicRequest(urlParsed,res) {
  if (urlParsed.artist) {
    console.log("artist is set");
    const artistPath = musicPath + "/" + urlParsed.artist;
    console.log(`ArtistPath is ${artistPath}`);

    if (!urlParsed.album) {
      console.log("all albums requested");
      return getAllAlbumsJson(artistPath, res);
    } else {
      console.log("Albums is set.");
      const albumPath = artistPath + "/" + urlParsed.album;
      console.log(`AlbumPath is ${albumPath}`);

      if (!urlParsed.song) {
        console.log("Song is not set so get all songs in album");
        getAllSongsJson(albumPath, res);
      } else {
        console.log("Song is set so return song file");
        serveSongRequest(urlParsed, res);
      }
    }
  } else {
    console.log('No artist specified so list all artists');  
    getAllArtistsJson(res);
  } 
}
