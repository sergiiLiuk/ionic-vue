import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'

export default class MapBox {
  constructor(data) {
    this.data = data
    this.ready = false

    // mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsc3ZhbmUiLCJhIjoiY2plNzZzb3RiMDkwdjJ3bXpyNTA4ZGc4dyJ9.m8wVa-i4jVuNxmLiu6uWrA'
    let map = new mapboxgl.Map({
      container: 'map',
      style:
        'https://map.nanolink.com/c/4593e76d-178c-4aef-bbcf-1bcfb3c33e9d/styles/nanomap/style.json?key=SdzrAjaKxxPZt6mcvg6B',
      maxZoom: 20
    })

    this.map = map

    map.on('load', async () => {
      map.addSource('assets', {
        type: 'geojson',
        data: this.data,
        cluster: true,
        clusterMaxZoom: 21,
        clusterRadius: 30
      })

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'assets',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 20,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      })

      map.addLayer({
        id: 'asset-count',
        type: 'symbol',
        source: 'assets',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial'],
          'text-size': 12
        }
      })

      map.addLayer({
        id: 'unclustered-point-bg',
        type: 'circle',
        source: 'assets',
        filter: ['!has', 'point_count'],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      })

      this.setBounds()

      this.ready = true
    })
  }

  update(data) {
    this.data = data
    this.map.getSource('assets').setData(data)
    this.setBounds()
  }

  getBounds() {
    var bounds = new mapboxgl.LngLatBounds()

    if (!this.data.features.length)
      return [
        [-89, -89],
        [89, 89]
      ]

    this.data.features.forEach(function(feature) {
      bounds.extend(feature.geometry.coordinates)
    })

    return bounds
  }

  setBounds() {
    this.map.fitBounds(this.getBounds(), {
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      duration: 500
    })
  }
}
