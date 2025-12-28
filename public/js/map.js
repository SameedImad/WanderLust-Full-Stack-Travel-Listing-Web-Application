// //  for map on web page
// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     center: sample.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
//     zoom: 9 // starting zoom
// });

// // const marker1 = new mapboxgl.Marker({ color: 'red'})
// //     .setLngLat(sample.geometry.coordinates)
// //     .setPopup(new mapboxgl.Popup({offset: 25})
// //     .setHTML(`<h5>${sample.title}</h5><p>Exact location will be provided after booking</p>`)
// //     .setMaxWidth("300px"))
// //     .addTo(map);

// map.on("load", () => {
//   map.loadImage(
//     "/images/home-marker.png", // your icon
//     (error, image) => {
//       if (error) throw error;

//       // Add icon to map
//       map.addImage("home-icon", image);

//       // Add source
//       map.addSource("listing-point", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: {
//             type: "Point",
//             coordinates:sample.geometry.coordinates // [lng, lat]
//           }
//         }
//       });

//       // Add layer
//       map.addLayer({
//         id: "listing-layer",
//         type: "symbol",
//         source: "listing-point",
//         layout: {
//           "icon-image": "home-icon",
//           "icon-size": 1,
//           "icon-allow-overlap": true
//         }
//       });
//     }
//   );
// });



mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: sample.geometry.coordinates, // [lng, lat]
    zoom: 9
});

map.on("load", () => {
    map.loadImage("/images/home-marker.png", (error, image) => {
        if (error) throw error;

        // Add custom icon
        map.addImage("home-icon", image);

        // GeoJSON source
        map.addSource("listing-point", {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {
                    title: sample.location || "New York"
                },
                geometry: {
                    type: "Point",
                    coordinates: sample.geometry.coordinates
                }
            }
        });

        // Layer with BOLD text
        map.addLayer({
            id: "listing-layer",
            type: "symbol",
            source: "listing-point",
            layout: {
                "icon-image": "home-icon",
                "icon-size": 1,
                "icon-allow-overlap": true,

                // TEXT
                "text-field": ["get", "title"],
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"], // 👈 BOLD
                "text-size": 14,
                "text-offset": [0, 1.3],
                "text-anchor": "top"
            },
            paint: {
                "text-color": "#000",
                "text-halo-color": "#fff",
                "text-halo-width": 2
            }
        });
    });
});


map.on("click", "listing-layer", (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const title = e.features[0].properties.title;

    new mapboxgl.Popup({ offset: 25 })
        .setLngLat(coordinates)
        .setHTML(`
            <h5 style="margin:0;font-weight:600">${title}</h5>
            <p style="margin:0;font-size:13px;">
              Exact location will be provided after booking
            </p>
        `)
        .addTo(map);
});

// Cursor pointer
map.on("mouseenter", "listing-layer", () => {
    map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "listing-layer", () => {
    map.getCanvas().style.cursor = "";
});

