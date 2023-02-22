//on instancie la carte et on la centre sur Paris en dézoomant assez pour voir toute la France
var map = L.map('map').setView([48.86, 2.33], 6);

//on récupère la carte de openstreetmap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// Ces icônes ne sont pas libres de droits mais le projet étant scolaire je les ai tout de même utilisés, je suis conscient qu'il ne faut pas faire cela en entreprise !
var sunIcon = L.icon({
    iconUrl: './assets/img/sun.png',
    iconSize:     [32, 32], // size of the icon
});
var rainIcon = L.icon({
    iconUrl: './assets/img/rain.png',
    iconSize:     [32, 32], // size of the icon
});

var cloudIcon = L.icon({
    iconUrl: './assets/img/cloud.png',
    iconSize:     [32, 32], // size of the icon
});
var fogIcon = L.icon({
    iconUrl: './assets/img/foggy.png',
    iconSize:     [32, 32], // size of the icon
});

var freezingIcon = L.icon({
    iconUrl: './assets/img/freezing.png',
    iconSize:     [32, 32], // size of the icon
});
var snowIcon = L.icon({
    iconUrl: './assets/img/snow.png',
    iconSize:     [32, 32], // size of the icon
});

function addUsers(){
    //on conserve les différents markers pour en avoir dix constamment sur la carte
    let users = [];
    //on déclare la fonction dans un intervalle qui va boucler toutes les secondes
    const oneSecondInterval = setInterval(() => {
        //on get un utilisateur aléatoire avec la méthode fetch
        fetch("https://randomuser.me/api/?nat=fr").then(function(response) {
            return response.json();
        }).then(function(data) {
            //on récupère l'identité de l'utilisateur ainsi que sa ville
            let name = (data.results[0].name.first).concat(" ",data.results[0].name.last);
            let city = data.results[0].location.city;
         
            //on cherche les coordonnées gps de l'utilisateur grâce à l'api de open-meteo
            fetch("https://geocoding-api.open-meteo.com/v1/search?name="+city).then(function(response) {
                return response.json();
            }).then(function(data){
                indexData = 0;
                while(data.results[indexData].country_code != "FR"){
                    indexData++;
                }
                lat = data.results[indexData].latitude;
                lon = data.results[indexData].longitude;
                newLoc = [lat,lon];
                //on récupère les données météorologiques à partir des coordonnéees de l'utilisateur
                fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current_weather=true").then(function(response){
                    return response.json();
                }).then(function(dataWeather){
                    temperature = dataWeather.current_weather.temperature;
                    tempcolor = "black";
                    //couleur de la température dépendant de sa valeur
                    if(temperature > 30){
                        tempcolor = "red";
                    } else if(temperature > 24){
                        tempcolor = "orange"
                    } else if(temperature > 16){
                        tempcolor = "yellow"
                    } else if(temperature > 9){
                        tempcolor = "blue"
                    } else if(temperature > 0){
                        tempcolor = "#33F0FF" //bleu clair
                    } else {
                        tempcolor = "#B3F5FA" //bleu glace
                    }

                    code = dataWeather.current_weather.weathercode;
                    if (users.length >= 10) {
                        map.removeLayer(users.shift()); //si le tableau contient 10 utilisateurs on supprime le plus ancien (FIFO)
                    }
                    let icon = sunIcon;
                    //source du code WMO : https://open-meteo.com/en/docs
                    switch(code){
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            //clear sky
                            icon = sunIcon;
                            break;
                        case 45:
                        case 48:
                            //fog
                            icon = fogIcon;
                            break;
                        case 51:
                        case 53:
                        case 55:
                            //drizzle -> pluie fine
                            icon = rainIcon;
                            break;
                        case 56:
                        case 57:
                            //freezing drizzle -> pluie fine verglassée
                            icon = freezingIcon;
                            break;
                        case 61:
                        case 63:
                        case 65:
                            //rain
                            icon = rainIcon;
                            break;
                        case 66:
                        case 67:
                            //freezing rain
                            icon = freezingIcon;
                            break;
                        case 71:
                        case 73:
                        case 75:
                            //snow fall
                            icon = snowIcon;
                            break;
                        case 77:
                            //snow grains
                            icon = snowIcon;
                            break;
                        case 80:
                        case 81:
                        case 82:
                            //rain showers
                            icon = rainIcon;
                            break;
                        case 85:
                        case 86:
                            //snow showers
                            icon = snowIcon;
                            break;
                        default:
                            icon = sunIcon;
                            break;
                    }
                    //on ajoute le marker du nouvel utilisateur et on lui passe un popup permettant d'afficher la ville, le nom de l'utilisateur et la température
                    const newUserLocation = L.marker(newLoc, {icon:icon}).addTo(map)
                                                .bindPopup(`<div class="divcity"><span class="city"><h3>${city}</h3></span></div> <div class="divname">${name}</div> <div class="divtemperature"><span id="temp" style="color:${tempcolor}">${temperature}°C</span></div>`, { autoClose: true, autoPan: false }, { className: 'marketStyle' });
                    //on ajoute le nouveau marker au tableau
                    users.push(newUserLocation);

                }).catch(function(err) {
                    console.log('Fetch Error :-S', err);
                });
        }).catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
        }) 
    }, 1000); //boucle toutes les secondes pour permettre un service continu
}

addUsers(); //appelle la fonction quand le script est chargé par la page HTML