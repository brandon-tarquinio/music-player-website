console.log("Loading main.js");
queryAllArtists();
window.onload = function() {
  queryAllArtists();
}

function queryAllArtists() {
  console.log("Going to query all artists");
  // Where we will attach the artist list to. 
  var artistPanelDiv = document.getElementById("artist-panel-div");
  var artistPanelList = document.getElementById("artist-list");
   
  getMusicRequest(
    artistPanelDiv,
    '', '', '',
    function(json) {
      var artistList = json.Artists;

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

    }
  ); 
}

function getMusicRequest(errorDiv,
                         artist, album, song,
                         successHandler) {
  var request = new XMLHttpRequest();
  var url = `/getMusic/?artist=${artist}&album=${album}&song=${song}`;
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      successHandler(JSON.parse(request.responseText));
    } else {
      // We reached our target server, but it returned an error
      var testAddPar = document.createElement("p");
      var testAddText = document.createTextNode('Error getting ${url} from server');
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

function clearList(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

function queryAlbumsForArtist(artist) {
  var albumPanelDiv = document.getElementById("album-panel-div");
  var albumPanelList = document.getElementById("album-list");
  // Clear previous albums and song list
  clearList(albumPanelList);
  clearList(document.getElementById("song-list"));

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

}

function querySongsForAlbum(artist, album) {
  var songPanelDiv = document.getElementById("song-panel-div");
  var songPanelList = document.getElementById("song-list");
  // Clear previous album's songs
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
        testAddPar.onclick = function () {
          playSong(artist, album, song); 
        };
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

function playSong(artist, album, song) {
  var musicPlayer = document.getElementById("music-player");

  console.log("Going to play song " + song + " from " + album + " by " + artist);
  
  //audioObj = new Audio('/getSong/?artist='+artist+'&album='+album+'&song='+song); 
  //audioObj.addEventListener('loadeddata', () => {
  //  let duration = audioObj.duration;
  //});
  musicPlayer.setAttribute("src", '/getMusic/?artist='+artist+'&album='+album+'&song='+song);
  musicPlayer.addEventListener('canplay', () => {
    console.log("Can Play Song!");
    musicPlayer.play();
  });
  musicPlayer.addEventListener('play', () => {
    console.log("I'm playing");
  });
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
