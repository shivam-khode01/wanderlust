mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: coordinates,     // Use actual coordinates
    zoom: 9
});


const marker=new mapboxgl.Marker({color:'red'})
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
                "<p>excat location after booking !</p>"
            )
    )
    .setLngLat(coordinates)  // Place marker at actual location
    .addTo(map);
