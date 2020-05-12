import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'

export default class AddressPicker {
  constructor({ locations, currentLocation, updateLocation }) {
    this.locations = locations
    this.currentLocation = currentLocation
    this.latitude = currentLocation.features[0].geometry.coordinates[1]
    this.longitude = currentLocation.features[0].geometry.coordinates[0]
    this.updateState = updateLocation
    this.moveHandler = this.onMove.bind(this)
    this.upHandler = this.onUp.bind(this)

    // this.geojson = {
    //   type: 'FeatureCollection',
    //   features: []
    // }

    let map = new mapboxgl.Map({
      container: 'map',
      style:
        'https://map.nanolink.com/c/4593e76d-178c-4aef-bbcf-1bcfb3c33e9d/styles/nanomap/style.json?key=SdzrAjaKxxPZt6mcvg6B',
      // bounds: this.getBounds(this.locations),
      center: [this.longitude, this.latitude]
      // zoom: 5,
      // maxZoom: 20
    })

    this.map = map
    this.map.on('load', () => {
      this.setLocation(this.currentLocation)
      this.setOtherLocatons(this.locations)
    })
  }

  getBounds(data) {
    var bounds = new mapboxgl.LngLatBounds()

    if (!data.features.length)
      return [
        [-89, -89],
        [89, 89]
      ]

    data.features.forEach(function(feature) {
      bounds.extend(feature.geometry.coordinates)
    })

    return bounds
  }

  onMove(e) {
    let coords = e.lngLat

    this.canvas.style.cursor = 'grabbing'

    this.currentLocation.features[0].geometry.coordinates = [coords.lng, coords.lat]
    this.map.getSource('point').setData(this.currentLocation)
  }

  onUp(e) {
    let coords = e.lngLat

    this.updateState(coords.lat, coords.lng)
    this.canvas.style.cursor = ''

    // Unbind mouse/touch events
    this.map.off('mousemove', this.moveHandler)
    this.map.off('touchmove', this.moveHandler)
  }

  updateLocation(location) {
    const lat = location.features[0].geometry.coordinates[0]
    const lon = location.features[0].geometry.coordinates[1]

    this.currentLocation.features[0].geometry.coordinates = [lon, lat]
    this.map.getSource('point').setData(this.currentLocation)
  }

  setOtherLocatons(locations) {
    this.map.addSource('locations', {
      type: 'geojson',
      data: locations
    })

    this.map.addLayer({
      id: 'otherLocations',
      type: 'circle',
      filter: ['!=', 'id', this.currentLocation.features[0].properties.id],
      source: 'locations',
      paint: {
        'circle-radius': 7,
        'circle-color': '#3887be'
      }
    })
  }

  setLocation(location) {
    if (this.initialized) {
      this.updateLocation(location)
    } else {
      this.initialized = true
      this.canvas = this.map.getCanvasContainer()
      this.map.addSource('point', {
        type: 'geojson',
        data: location
      })

      this.map.addLayer({
        id: 'point',
        type: 'circle',
        source: 'point',
        paint: {
          'circle-radius': 10,
          'circle-color': '#6aa641'
        }
      })

      this.map.on('mouseenter', 'point', () => {
        this.canvas.style.cursor = 'move'
      })

      this.map.on('mouseleave', 'point', () => {
        this.canvas.style.cursor = ''
      })

      this.map.on('mousedown', 'point', e => {
        e.preventDefault()

        this.canvas.style.cursor = 'grab'

        this.map.on('mousemove', this.moveHandler)
        this.map.once('mouseup', this.upHandler)
      })

      this.map.on('touchstart', 'point', e => {
        if (e.points.length !== 1) return

        e.preventDefault()

        this.map.on('touchmove', this.onMove.bind(this))
        this.map.once('touchend', this.onUp.bind(this))
      })
    }

    this.map.easeTo({
      zoom: this.currentLocation.features[0].properties.id ? 14 : 3,
      center: [
        location.features[0].geometry.coordinates[0],
        location.features[0].geometry.coordinates[1]
      ]
    })
  }
}
