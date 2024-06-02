
    /* // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com */

    /* let mapToken = mapToken;
    console.log(mapToken); */
    mapboxgl.accessToken = mapToken; 

    const map = new mapboxgl.Map({
        container: "map", // container ID
        // choose from mapbox's core styles, or make your own style with Mapbox Studio
        style: "mapbox://styles/mapbox/streets-v12", // style URL
        center: listing.geometry.coordinates, // starting position [lng, lat] coordinates
        zoom: 9, // starting zoom
});
// Create a default Marker and add it to the map.

    // console.log(coordinates);

    const marker = new mapboxgl.Marker({color: "red"})
    // .setLngLat([12.554729, 55.70651]) //this coordinates passed in Listing.geomerty.coordinates
    .setLngLat(listing.geometry.coordinates) 
    // Creating popUp
    .setPopup(new mapboxgl.Popup({offset:25})
    .setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`)
    )

    .addTo(map);