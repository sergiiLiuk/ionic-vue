import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import MapboxCircle from 'mapbox-gl-circle'
import Timeout from 'await-timeout'
import store from '@/store'

export default class MapBox {
  constructor(data, token, updateCircle, mapReady, showDetails, mapMoved) {
    this.data = data
    this.token = token
    this.updateCircle = updateCircle
    this.mapReady = mapReady
    this.showDetails = showDetails
    this.mapMoved = mapMoved

    // mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsc3ZhbmUiLCJhIjoiY2plNzZzb3RiMDkwdjJ3bXpyNTA4ZGc4dyJ9.m8wVa-i4jVuNxmLiu6uWrA'
    let map = new mapboxgl.Map({
      container: 'map',
      // style: 'mapbox://styles/mapbox/light-v9',
      style:
        'https://map.nanolink.com/c/4593e76d-178c-4aef-bbcf-1bcfb3c33e9d/styles/nanomap/style.json?key=SdzrAjaKxxPZt6mcvg6B',
      bounds: this.getBounds(this.data),
      maxZoom: 20,
      preserveDrawingBuffer: true
    })

    this.map = map

    map.on('load', async () => {
      await this.loadIcon('tool_marker')
      await this.loadIcon('cluster_marker')

      map.addSource('assets', {
        type: 'geojson',
        data: this.data,
        cluster: true,
        clusterMaxZoom: 21,
        clusterRadius: 30
      })

      map.addLayer({
        id: 'clusters',
        type: 'symbol',
        source: 'assets',
        filter: ['has', 'point_count'],
        layout: {
          'icon-image': 'cluster_marker',
          'icon-size': 1,
          'icon-allow-overlap': true,
          'icon-anchor': 'bottom'
        }
      })

      map.addLayer({
        id: 'asset-count',
        type: 'symbol',
        source: 'assets',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          // 'text-font': ['DIN Offc Pro Medium', 'Arial'],
          'text-size': 12,
          'text-offset': [-0.05, -1.9],
          'text-allow-overlap': true
        }
      })

      map.addLayer({
        id: 'unclustered-point-bg',
        type: 'symbol',
        source: 'assets',
        filter: ['!has', 'point_count'],
        layout: {
          'icon-image': 'tool_marker',
          'icon-size': 1,
          'icon-allow-overlap': true,
          'icon-anchor': 'bottom'
        }
      })

      map.on('click', 'clusters', function(e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        var clusterId = features[0].properties.cluster_id
        map.getSource('assets').getClusterExpansionZoom(clusterId, function(err, zoom) {
          if (err) {
            return
          }

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom >= 18 ? zoom - 2 : zoom
          })
        })
      })
      map.on('mouseenter', 'clusters', function() {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'clusters', function() {
        map.getCanvas().style.cursor = ''
      })

      map.on('mouseenter', 'unclustered-point-bg', function() {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'unclustered-point-bg', function() {
        map.getCanvas().style.cursor = ''
      })
      map.on('click', 'unclustered-point-bg', e => {})

      this.setBounds(this.data)
      // this.updateLayers()
      map.on('moveend', this.updateLayers.bind(this))
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

  setBounds(data) {
    let bounds = this.getBounds(data)
    this.map.fitBounds(bounds, {
      padding: { top: 60, bottom: 10, left: 30, right: 30 }
    })
  }

  addCircle() {
    // let center = this.map.getZoom()

    let circle = new MapboxCircle(this.map.getCenter(), 30000, {
      editable: true,
      fillColor: '#66ac00'
    }).addTo(this.map)

    this.updateCircle(circle.getCenter(), circle.getRadius())

    circle.on('centerchanged', c => {
      this.updateCircle(c.getCenter(), c.getRadius())
    })
    circle.on('radiuschanged', c => {
      this.updateCircle(c.getCenter(), c.getRadius())
    })

    this.circle = circle
  }

  removeCircle() {
    this.circle.remove()
  }

  async updateLayers() {
    await Timeout.set(500)
    let features = this.map.queryRenderedFeatures({ layers: ['unclustered-point-bg'] })
    for (let feature of features) {
      try {
        await this.loadImage(feature.properties.id)
        this.map.triggerRepaint()
      } catch (e) {}
    }

    if (this.mapReady) this.mapReady()

    this.mapMoved(this.map.getBounds(this.data))
  }

  loadIcon(name) {
    return new Promise((resolve, reject) => {
      this.map.loadImage('/' + name + '.png', (err, image) => {
        if (err) reject(err)
        else {
          this.map.addImage(name, image)
          resolve(image)
        }
      })
    })
  }

  loadImage(id) {
    let url =
      store.state.server +
      '/bin/getimage' +
      '?id=' +
      id +
      '&token=' +
      this.token +
      '&radius=32&scale=32x32'
    // If image is already loaded, dont load again
    if (this.map.hasImage(id)) return
    // Otherwise load image from server, and wrap in promise
    return new Promise((resolve, reject) => {
      this.map.loadImage(url, (err, image) => {
        if (err) reject(err)
        else {
          // Check again if image is already loaded, as it might have been inserted from another asset while downloading
          if (!this.map.hasImage(id)) {
            this.map.addImage(id, image)
            // Add a layer for each image
            this.map.addLayer({
              id: id,
              type: 'symbol',
              source: 'assets',
              filter: ['==', 'id', id],
              layout: {
                'icon-image': id,
                'icon-size': 0.8,
                'icon-allow-overlap': true,
                'icon-offset': [0, -28]
              }
            })
          }
          resolve(image)
        }
      })
    })
  }

  async updateSource(data) {
    let source = this.map.getSource('assets')
    if (source) {
      // console.log('data', data.features.length)
      source.setData(data)

      // setTimeout(this.setBounds.bind(this), 1000)
      this.setBounds(data)
    }
  }
}
