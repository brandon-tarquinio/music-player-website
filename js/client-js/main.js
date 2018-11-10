window.onload = function() {
  queryAllArtists();
}

function queryAllArtists() {
  // Where we will attach the artist list to. 
  var artistPanelDiv = document.getElementById("artist-panel-div");
  var artistPanelList = document.getElementById("artist-list");
  
  // Get list of artists
  //var artistList = $.getJSON("./getAllArtists");
  var request = new XMLHttpRequest();
  request.open('GET', '/getMusic/', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var artistList = JSON.parse(request.responseText).Artists;

      // For each artist add li
      artistList.forEach( function(artist) {
        var testAddPar = document.createElement("LI");
        testAddPar.onclick = function () {
          queryAlbumsForArtist(artist);
        };
        var testAddText = document.createTextNode(artist);
        testAddPar.appendChild(testAddText);
        artistPanelList.appendChild(testAddPar);
      });
    } else {
      // We reached our target server, but it returned an error
      var testAddPar = document.createElement("p");
      testAddPar.setAttribute
      var testAddText = document.createTextNode("Error getting artist from server");
      testAddPar.appendChild(testAddText);
      artistPanelDiv.appendChild(testAddPar);
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    var testAddPar = document.createElement("p");
    var testAddText = document.createTextNode("Could not connect to server");
    testAddPar.appendChild(testAddText);
    artistPanelDiv.appendChild(testAddPar);
  };

  request.send();
}

function getMusicRequest(errorDiv,
                         artist, album, song,
                         successHandler) {
  var request = new XMLHttpRequest();
  request.open('GET', `/getMusic/?artist=${artist}&album=${album}&song=${song}`, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      successHandler(JSON.parse(request.responseText));
    } else {
      // We reached our target server, but it returned an error
      var testAddPar = document.createElement("p");
      var testAddText = document.createTextNode("Error getting music from server");
      testAddPar.appendChild(testAddText);
      errorDiv.appendChild(testAddPar);
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    var testAddPar = document.createElement("p");
    var testAddText = document.createTextNode("Could not connect to server");
    testAddPar.appendChild(testAddText);
    errorPanelDiv.appendChild(testAddPar);
  };

  request.send();
}

function queryAlbumsForArtist(artist) {
  var albumPanelDiv = document.getElementById("album-panel-div");
  var albumPanelList = document.getElementById("album-list");
  // Clear previous albums
  while (albumPanelList.firstChild) {
    albumPanelList.removeChild(albumPanelList.firstChild);
  }

  getMusicRequest(
    albumPanelDiv,
    artist, '', '',
    function(json) {
      var albumList = json.Albums;
      console.log(albumList);
      
      // For each artist add li
      albumList.forEach( function(album) {
        var testAddPar = document.createElement("LI");
        testAddPar.onclick = function () {
          querySongsForAlbum(artist, album); 
        };
        var testAddText = document.createTextNode(album);
        testAddPar.appendChild(testAddText);
        albumPanelList.appendChild(testAddPar);
      });
    }
  ); 

  artist = "Tool";
}

function querySongsForAlbum(artist, album) {
  var songPanelDiv = document.getElementById("song-panel-div");
  var songPanelList = document.getElementById("song-list");
  // Clear previous albums
  while (songPanelList.firstChild) {
    songPanelList.removeChild(songPanelList.firstChild);
  }

  var request = new XMLHttpRequest();
  request.open('GET', '/getMusic/?artist='+artist+'&album='+album, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var songList = JSON.parse(request.responseText).Songs;
      console.log(songList);
      
      // For each artist add li
      songList.forEach( function(song) {
        var testAddPar = document.createElement("LI");
        /*
        testAddPar.onclick = function () {
          querySongsForAlbum(artist, album); 
        };
        */
        var testAddText = document.createTextNode(song);
        testAddPar.appendChild(testAddText);
        songPanelList.appendChild(testAddPar);
      });
    } else {
      // We reached our target server, but it returned an error
      var testAddPar = document.createElement("p");
      var testAddText = document.createTextNode("Error getting songs from server");
      testAddPar.appendChild(testAddText);
      albumPanelDiv.appendChild(testAddPar);
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    var testAddPar = document.createElement("p");
    var testAddText = document.createTextNode("Could not connect to server");
    testAddPar.appendChild(testAddText);
    artistPanelDiv.appendChild(testAddPar);
  };

  request.send();
}


/*
const url = './';  
$(document).ready(() => {
  /*
  $('.do-artist-search-button').click( () => {
    $.getJSON(url + 'getArtists/')
  });
  $($.getJSON(url + "getAllArtists").forEach

});
  */
