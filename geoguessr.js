let minimap;
let pano;
let lineBetween;
let mapCoords;
let markerCoords;
let coords = [];
window.gameEnded = false;
window.markerPlaced = false;
document.getElementById("next-button").style.display = "none";
document.getElementById("submit-button").style.display = "block";

if (window.markerPlaced == false) {
    document.getElementById("submit-button").style.opacity = "0.35";
    document.getElementById("submit-button").disabled = true;
}

window.points = sessionStorage.getItem("points");
if (window.points == null) {
    window.points = 0;
} else {
    window.points = parseInt(window.points);
}

window.rounds = sessionStorage.getItem("rounds");
if (window.rounds == null) {
    window.rounds = 0;
} else if (window.rounds != null && parseInt(window.rounds) != 5) {
    window.rounds = parseInt(window.rounds);
} else {
    window.rounds = 0;
    window.points = 0;
}

if (window.rounds == 5) {
    sessionStorage.setItem("rounds", 0);
    sessionStorage.setItem("points", 0);
    window.rounds = 0;
    window.points = 0;
}

if (window.rounds != 5) {
    let allPoints = window.points;
    let currentRound = window.rounds + 1;
    document.getElementById("score-value").innerHTML = allPoints;
    document.getElementById("round-value").innerHTML = currentRound;
} else {
    document.getElementById("score-value").innerHTML = "0";
    document.getElementById("round-value").innerHTML = "1";
}

console.log(window.points);
console.log(window.rounds);

function initMap() {
    score.style.display = "none";
    var selectedMap = sessionStorage.getItem("selectedMap");
    console.log(selectedMap);

    if (selectedMap == "pl") {
        window.x = 49.2 + Math.random() * 4.8;
        window.y = 14.2 + Math.random() * 9.8;
    } else if (selectedMap == "tr") {
        let tr_r = Math.round(Math.random());
        if (tr_r == 0){
            //Gdynia
            window.x = 54.479 + Math.random() * 0.068;
            window.y = 18.525 + Math.random() * 0.024;
        } else if (tr_r == 1){
            //Gdańsk
            window.x = 54.346 + Math.random() * 0.133;
            window.y = 18.606 + Math.random() * 0.049;
        }
    } else if (selectedMap == "cz") {
        window.x = 50.8 + Math.random() * 0.023;
        window.y = 19.098 + Math.random() * 0.039;
    }

    function getStreetView(position) {
        var metr = Math.random() * 1000+1000,
        location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        svs = new google.maps.StreetViewService();
        svs.getPanorama({location: location, radius: metr, source: google.maps.StreetViewSource.OUTDOOR}, showPosition);
    }
    function showPosition(svData, svStatus) {
        console.log(svStatus);
        if (svStatus == 'OK') {
            window.map_position_x = parseFloat(svData.location.latLng.lat());
            coords.push(svData.location.latLng);
            window.map_position_y = parseFloat(svData.location.latLng.lng());
            window.map_position_latLng = svData.location.latLng;
            console.log(window.map_position_x);
            console.log(window.map_position_y);
            var panoramaOptions = {
                position: svData.location.latLng,
                pov: {
                    heading: 0,
                    pitch: 0
                    },
                    zoom: -1,
                    disableDefaultUI: true,
                    showRoadLabels: false,
            };
            pano = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
            google.maps.event.addListener(pano, 'pov_changed', function() {
            var heading_degrees = pano.getPov().heading.toFixed(1);
            document.getElementById("compass_neddle").style.transform = "rotate(" + heading_degrees + "deg)";
            var compassDisc = document.getElementById("hor-compassDiscImg");
            var offset = 0;
            var totalDir = -(heading_degrees + offset);
            compassDisc.style.left =  (totalDir) - 135 +"px";
            });
        } else {
            location.reload();
        }
    }
    getStreetView({coords: {latitude: window.x, longitude: window.y}});
    /*
    pano = new google.maps.StreetViewPanorama(document.getElementById("pano"), {
        position: getStreetView({coords: {latitude: x, longitude: y}}),
        pov: {
            heading: 0,
            pitch: 0
            },
            zoom: 0,
            disableDefaultUI: true,
            showRoadLabels: false,
        });
    */

    minimap = new google.maps.Map(document.getElementById("minimap"), {
    center: { lat: 52.05, lng: 19.48 },
    disableDefaultUI: true,
    clickableIcons: false,
    zoom: 4,
    styles: [
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#dddddd" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#aaaaaa" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }],
        },
      ],  
  });
  console.log(window.map_position_x);
  console.log(window.map_position_y);

  window.userMarker = new google.maps.Marker({
    position: { lat: 0.0, lng: 0.0 },
    map: minimap,
    zIndex: 100,
    icon: {
        /*
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#00ffaa',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        outlineColor: '#ffffff',
        outlineWeight: 2,
        */
        url: "./img/jettka.png",
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 16),
    },
    title: "Wybrane miejsce",
    visible: false,
  });

  window.goalMarker = new google.maps.Marker({
    position: { lat: 0.0, lng: 0.0 },
    map: minimap,
    zIndex: 50,
    icon: {
        /*
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#ffffff',
        fillOpacity: 1,
        strokeColor: '#ff4242',
        strokeWeight: 2,
        outlineColor: '#ff4242',
        outlineWeight: 2,
        */
        url: "./img/open_pin.png",
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 24),
    },
    title: "Miejsca docelowe",
    visible: false,
    });

    const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        strokeWeight: 2,
        scale: 4,
    };

    google.maps.event.addListener(goalMarker, 'mouseover', function() {
        goalMarker.setIcon({
            url: "./img/open_pin.png",
            scaledSize: new google.maps.Size(36, 36),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(18, 27),
        });
    });

    google.maps.event.addListener(goalMarker, 'mouseout', function() {
        goalMarker.setIcon({
            url: "./img/open_pin.png",
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 24),
        });
    });

    window.line = new google.maps.Polyline({
        path: [
            { lat: 0.0, lng: 0.0 },
            { lat: 0.0, lng: 0.0 },
        ],
        strokeColor: "#222222",
        strokeOpacity: 0.0,
        icons: [
            {
              icon: lineSymbol,
              offset: "0px",
              repeat: "15px",
            },
          ],      
        map: minimap,
        visible: true,
    });

    google.maps.event.addListener(minimap, 'click', function (event) {
        displayCoordinates(event.latLng);
        });

        function displayCoordinates(pnt) {
            if (window.gameEnded == false) {
                window.marker_position_x = pnt.lat();
                window.marker_position_y = pnt.lng();
                console.log("Lat: " + window.marker_position_x + "  Lng: " + window.marker_position_y);
                console.log("Obecna lokacja: " + window.map_position_x + " " + window.map_position_y);
                window.userMarker.setPosition(pnt);
                window.markerPlaced = true;
            } else {
                console.log("Gra już zakończona");
            }
            if (window.markerPlaced == true) {
                document.getElementById("submit-button").disabled = false;
                document.getElementById("submit-button").style.opacity = 1;
            }
        window.userMarker.visible = true;
        window.map_pos = new google.maps.LatLng(window.map_position_x, window.map_position_y);
        window.marker_pos = new google.maps.LatLng(window.marker_position_x, window.marker_position_y);
    }
}

window.initMap = initMap;

function submitGuess() {
    isMinimapBigger = true;
    document.getElementById("upsize_button").style.display = "none";
    document.getElementById("downsize_button").style.display = "block";
    var selectedMap = sessionStorage.getItem("selectedMap");
    if (selectedMap == "pl") {
        selectedMapName = "Polska";
    } else if (selectedMap == "cz") {
        selectedMapName = "Częstochowa";
    } else if (selectedMap == "tr") {
        selectedMapName = "Trójmiasto";
    } else {
        selectedMapName = "Brak danych";
    }

    window.gameEnded = true;
    window.line.setPath([
        window.map_pos,
        window.marker_pos,
    ]);
    let meters = google.maps.geometry.spherical.computeLength(window.line.getPath())
    let score = document.getElementById("score");
    let final_score = 5000;
    if (meters <= 10) {
        final_score = final_score;
    } else if (meters <= 500) {
        final_score = (final_score - (meters/50)).toFixed(0);
    } else {
        final_score = (final_score - (meters/25)).toFixed(0);
    }
    if (final_score < 0) {
        final_score = 0;
    }
    if (isNaN(final_score) || isNaN(meters) && (window.rounds != 5)) {
        final_score = 0;
        score.style.display = "block";
        score.innerHTML = "Nie wybrałeś miejsca! (0 pkt.)";
    } else if (meters < 1000 && (window.rounds < 4)) {
        score.style.display = "block";
        score.innerHTML = "Twój wynik to: " + final_score + "pkt. <br> (" + meters.toFixed(0) + "m od miejsca docelowego)<br>Obecna mapa: " + selectedMapName+ "<br><button id=\"replay-button\" class=\"btn btn-success\" onclick=\"location.reload()\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"currentColor\" class=\"bi bi-arrow-repeat\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z\"/><path fill-rule=\"evenodd\" d=\"M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z\"/></svg></button><button id=\"close-score\" class=\"btn btn-danger\" onclick=\"closeScore()\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"currentColor\" class=\"bi bi-x-lg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z\"/><path fill-rule=\"evenodd\" d=\"M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z\"/></svg></button>";
    } else if (meters >= 1000 && (window.rounds < 4)) {
        score.style.display = "block";
        let kilometers = meters/1000;
        score.innerHTML = "Twój wynik to: " + final_score + "pkt. <br> (" + kilometers.toFixed(0) + "km od miejsca docelowego)<br>Obecna mapa: " + selectedMapName + "<br><button id=\"replay-button\" class=\"btn btn-success\" onclick=\"location.reload()\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"currentColor\" class=\"bi bi-arrow-repeat\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z\"/><path fill-rule=\"evenodd\" d=\"M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z\"/></svg></button><button id=\"close-score\" class=\"btn btn-danger\" onclick=\"closeScore()\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"currentColor\" class=\"bi bi-x-lg\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z\"/><path fill-rule=\"evenodd\" d=\"M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z\"/></svg></button>";
    } else if (meters < 1000 && window.rounds == 4) {
        score.style.display = "block";
        score.innerHTML = "KONIEC! <br> Twój końcowy wynik to: " + (window.points + parseInt(final_score)) + "pkt.<br>Rozegrana mapa: " + selectedMapName;
    } else if (meters >= 1000 && window.rounds == 4) {
        score.style.display = "block";
        score.innerHTML = "KONIEC! <br> Twój końcowy wynik to: " + (window.points + parseInt(final_score)) + "pkt.<br>Rozegrana mapa: " + selectedMapName;
    }
    sessionStorage.setItem("points", window.points += parseInt(final_score));
    sessionStorage.setItem("rounds", window.rounds += parseInt(1));
    if (window.rounds != 6) {
        let allPoints = window.points;
        document.getElementById("score-value").innerHTML = allPoints;
    }
    console.log(sessionStorage.getItem("points"));
    console.log(sessionStorage.getItem("rounds"));
    window.goalMarker.setPosition({ lat: window.map_position_x, lng: window.map_position_y });
    window.goalMarker.visible = true;
    console.log(window.map_pos);
    console.log(window.marker_pos);

    document.getElementById("next-button").style.display = "block";
    document.getElementById("submit-button").style.display = "none";
}

var elem = document.documentElement;

function toggleFullScreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

var isMinimapBigger = false;
document.getElementById("upsize_button").style.display = "block";
document.getElementById("downsize_button").style.display = "none";

function resizeMinimap() {
    if (isMinimapBigger == false) {
        document.getElementById("upsize_button").style.display = "none";
        document.getElementById("downsize_button").style.display = "block";
        document.getElementById("minimap").style.width = "720px";
        document.getElementById("minimap").style.height = "480px";
        document.getElementById("submit-button").style.width = "720px";
        document.getElementById("next-button").style.width = "720px";
        isMinimapBigger = true;
    } else if (isMinimapBigger == true) {
        document.getElementById("upsize_button").style.display = "block";
        document.getElementById("downsize_button").style.display = "none";
        document.getElementById("minimap").style.width = "480px";
        document.getElementById("minimap").style.height = "360px";
        document.getElementById("submit-button").style.width = "480px";
        document.getElementById("next-button").style.width = "480px";
        isMinimapBigger = false;
    }
}   

var minimapObject = document.getElementById("minimap");
minimapObject.addEventListener('mouseover',function(){
    minimapObject.style.opacity = "1";
    if (isMinimapBigger == false) {
    document.getElementById("submit-button").style.width = "480px";
    document.getElementById("next-button").style.width = "480px";
    minimapObject.style.width = "480px";
    minimapObject.style.height = "360px";
    } else if (isMinimapBigger == true) {
    document.getElementById("submit-button").style.width = "720px";
    document.getElementById("next-button").style.width = "720px";
    minimapObject.style.width = "720px";
    minimapObject.style.height = "480px";
    }
});
minimapObject.addEventListener('mouseleave',function(){
    minimapObject.style.opacity = "0.75";
    document.getElementById("submit-button").style.width = "360px";
    document.getElementById("next-button").style.width = "360px";
    minimapObject.style.width = "360px";
    minimapObject.style.height = "230px";
});

function backToStart() {
    console.log(window.map_position_x);
    console.log(window.map_position_y);
    console.log(window.map_position_latLng);
    pano.setPosition ({ lat: window.map_position_x, lng: window.map_position_y });
}

function closeScore() {
    document.getElementById("score").style.display = "none";
}

function centerPano(){
    document.getElementById("compass_neddle").style.transform = "rotate(0deg)";
    document.getElementById("hor-compassDiscImg").style.left = -135 +"px";
    pano.getPov().heading;
    pano.setPov().heading = 0;
}