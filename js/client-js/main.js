console.log("Loading main.js");
window.onload = function() {
  queryAllArtists();
}

function queryAllArtists() {
  console.log("Going to query all artists");
  // Where we will attach the artist list to. 
  var artistPanelDiv = document.getElementById("artist-panel-div");
  var artistPanelList = document.getElementById("artist-list");

  clearList(artistPanelList);   

  getMusicRequest(
    artistPanelDiv,
    '', '', '',
    function(json) {
      var artistList = json.Artists;

      // For each artist add li
      artistList.forEach( function(artist) {
        var newListElement = createClickableLI(
          function () {
            queryAlbumsForArtist(artist);
          } 
        );

        var testAddText = document.createTextNode(artist);
        newListElement.appendChild(testAddText);
        artistPanelList.appendChild(newListElement);
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

function createClickableLI(onClickFunction) {
  var newListElement = document.createElement("LI");
  newListElement.classList.add("clickable");
  newListElement.onclick = onClickFunction; 
  return newListElement;
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
        var newListElement = createClickableLI(
          function () {
            querySongsForAlbum(artist, album); 
          } 
        );

        var testAddText = document.createTextNode(album);
        newListElement.appendChild(testAddText);
        albumPanelList.appendChild(newListElement);
      });
    }
  ); 

}

function querySongsForAlbum(artist, album) {
  var songPanelDiv = document.getElementById("song-panel-div");
  var songPanelList = document.getElementById("song-list");
  // Clear previous album's songs
  clearList(songPanelList); 

  getMusicRequest(
    songPanelDiv,
    artist, album, '',
    function(json) {
      var songList = json.Songs;
      console.log(songList);

      // For each song add li
      songList.forEach( function(song) {
        var newListElement = createClickableLI(
          function () {
            playSong(artist, album, song); 
          } 
        );

        var testAddText = document.createTextNode(song);
        newListElement.appendChild(testAddText);
        songPanelList.appendChild(newListElement);
      });
    }
  ); 
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
