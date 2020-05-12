import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import MapboxCircle from 'mapbox-gl-circle'

export default class AddressViewer {
  constructor({ locations, latitude, longitude, locationId, radius }, element) {
    this.locations = locations
    this.locationId = locationId
    this.latitude = latitude
    this.longitude = longitude
    this.radius = radius

    let map = new mapboxgl.Map({
      container: element || 'map',
      style:
        'https://map.nanolink.com/c/4593e76d-178c-4aef-bbcf-1bcfb3c33e9d/styles/nanomap/style.json?key=SdzrAjaKxxPZt6mcvg6B',
      center: [this.longitude, this.latitude],
      bounds: this.locations ? this.getBounds(this.locations) : null,
      zoom: 5,
      maxZoom: 20
    })

    this.map = map

    this.map.on('load', () => {
      if (this.radius) {
        this.circle = new MapboxCircle({ lat: this.latitude, lng: this.longitude }, radius, {
          fillColor: '#66ac00',
          strokeWeight: 0.5,
          strokeOpacity: 0.2,
          fillOpacity: 0.1,
          minRadius: 0
        }).addTo(this.map)
      }

      if (this.locations != undefined) this.setOtherLocations()
      else this.setLocation(latitude, longitude, radius)

      this.map.easeTo({
        zoom: 14,
        center: [this.longitude, this.latitude]
      })
    })
  }

  setOtherLocations() {
    this.map.addSource('locations', {
      type: 'geojson',
      data: this.locations
    })

    this.map.addLayer({
      id: 'location',
      type: 'circle',
      filter: ['==', 'id', this.locationId],
      source: 'locations',
      paint: {
        'circle-radius': 10,
        'circle-color': '#6aa641'
      }
    })

    this.map.addLayer({
      id: 'otherLocations',
      type: 'circle',
      filter: ['!=', 'id', this.locationId],
      source: 'locations',
      paint: {
        'circle-radius': 7,
        'circle-color': '#3887be'
      }
    })
  }

  getBounds(data) {
    var bounds = new mapboxgl.LngLatBounds()
    if (!data.features.length) {
      return [
        [-89, -89],
        [89, 89]
      ]
    }
    data.features.forEach(function(feature) {
      bounds.extend(feature.geometry.coordinates)
    })
    return bounds
  }
  setLocation(lat, lon, radius) {
    this.canvas = this.map.getCanvasContainer()

    if (this.geojson) {
      this.geojson.features[0].geometry.coordinates = [lon, lat]
      this.map.getSource('point').setData(this.geojson)
      this.circle.setCenter({ lat, lng: lon })
      this.circle.setRadius(radius)
    } else {
      this.geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat]
            }
          }
        ]
      }

      this.map.addSource('point', {
        type: 'geojson',
        data: this.geojson
      })

      this.map.addLayer({
        id: 'penis',
        type: 'circle',
        source: 'point',
        paint: {
          'circle-radius': 10,
          'circle-color': '#6aa641'
        }
      })
    }
  }
}
