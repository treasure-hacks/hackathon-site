mapboxgl.accessToken = 'pk.eyJ1Ijoic292aW5pbjQ4IiwiYSI6ImNrdHp0MG83eDNncDMycG8zdTk4bzNtMTkifQ.29HdXDPxiJKo5xU4-B1edw'
const map = new mapboxgl.Map({
  container: 'map',
  minZoom: window.innerHeight / 750,
  zoom: window.innerHeight / 650,
  style: 'mapbox://styles/mapbox/dark-v10'
})
map.addControl(new mapboxgl.NavigationControl());

// Fetch the location markers for the map
const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:5600/forms/location-markers')
xhr.onreadystatechange = function() {
  if (xhr.readyState !== 4) return
  if (xhr.status !== 200) return console.error(new Error('Unable to load data'))
  const markers = JSON.parse(xhr.responseText)
  markers.items.forEach(m => {
    // const svg = document.createElement('svg')
    // svg.style.width = svg.style.height = '100px'
    // svg.setAttribute('width', 100)
    // svg.setAttribute('height', 100)
    // svg.innerHTML = `<circle cx="50" cy="50" r="5" fill="red" /><circle cx="50" cy="50" r="5" fill="red" class="ring" />`
    const container = document.createElement('div')
    container.classList.add('marker-container')
    container.title = m.location || 'Approximate Participant School Location'
    const img = document.createElement('img')
    img.width = img.width = 48
    img.src = 'marker.png'
    container.appendChild(img)
    new mapboxgl.Marker(container).setLngLat([ m.lng, m.lat]).addTo(map);
    // new google.maps.Marker({
    //   position: { lat: m.lat, lng: m.lng },
    //   map,
    //   title: "Approximate Participant School Location",
    //   icon: {
    //     path: 'M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10Z',
    //     fillColor: "transparent",
    //     fillOpacity: 0.92,
    //     strokeWeight: 0,
    //     rotation: 0,
    //     scale: 1,
    //     anchor: new google.maps.Point(5, 5)
    //   }
    // });
  })
}
xhr.send()

// function initMap() {
//   const myLatLng = { lat: 0, lng: 0 };
//   const map = new google.maps.Map(document.getElementById("map"), {
//     minZoom: window.innerHeight / 400,
//     zoom: window.innerHeight / 383,
//     center: myLatLng,
//     // mapId: '86ca340ae117e983'
//   });
// }

