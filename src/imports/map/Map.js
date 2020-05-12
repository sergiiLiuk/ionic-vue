import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import mapboxgl from "mapbox-gl";
import MapboxCircle from "mapbox-gl-circle";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import Timeout from "await-timeout";
import store from "@/store";
import unflatten from "@/imports/unflatten";
import MapboxglSpiderifier from "@/imports/map/spiderifier";

export default class MapBox {
  constructor(
    data,
    token,
    updateCircle,
    showDetails,
    mapMoved,
    setPolygon,
    polygon,
    mapControls
  ) {
    this.data = data;
    this.repeatingData = data;
    this.token = token;
    this.updateCircle = updateCircle;
    this.showDetails = showDetails;
    this.mapMoved = mapMoved;
    this.setPolygon = setPolygon;
    let previousLongitude = "";
    this.polygon = polygon;
    this.zoomThreshold = 20;
    this.mapControls = mapControls;
    var map = new mapboxgl.Map({
        container: "map",
        style:
          "https://map.nanolink.com/c/4593e76d-178c-4aef-bbcf-1bcfb3c33e9d/styles/nanomap/style.json?key=SdzrAjaKxxPZt6mcvg6B",
        bounds: this.getBounds(this.data),
        zoom: 20,
        preserveDrawingBuffer: true,
      }),
      spiderifier = new MapboxglSpiderifier(map, {
        animate: true,
        customPin: true,
        animationSpeed: 200,
        onClick: function(e, marker) {},
        initializeLeg: initializeSpiderLeg,
      });

    async function initializeSpiderLeg(spiderLeg) {
      let pinElem = spiderLeg.elements.pin;
      let feature = spiderLeg.feature;
      pinElem.id = feature.id;
      pinElem.innerHTML =
        '<img src="' + feature.url + '" alt="' + feature.brand + '">';

      let popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        anchor: "bottom-left",
        offset: MapboxglSpiderifier.popupOffsetForSpiderLeg(spiderLeg),
      });

      popup
        .setHTML(
          '<a class="redirectlink" id="' +
            feature.id +
            '"> <h3>' +
            feature.brand +
            "</h3> </a> <span>" +
            feature.model +
            "</span>"
        )
        .addTo(map);

      spiderLeg.mapboxMarker.setPopup(popup);

      document.getElementById(feature.id).addEventListener("click", function() {
        showDetails(feature.id);
      });
    }

    if (this.mapControls) map.addControl(new mapboxgl.FullscreenControl());

    let draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    this.draw = draw;

    if (this.mapControls) map.addControl(draw);

    map.on("draw.create", (e) => {
      let polygon = e.features[0].geometry.coordinates[0];
      this.setPolygon(polygon);
    });

    map.on("draw.delete", (e) => {
      this.setPolygon([]);
    });

    this.map = map;

    map.on("load", async () => {
      map.addSource("assets", {
        type: "geojson",
        data: this.data,
        cluster: true,
        clusterMaxZoom: 50,
        clusterRadius: 20,
      });

      map.addLayer({
        id: "unclustered-point-bg",
        type: "circle",
        source: "assets",
        paint: {
          "circle-radius": ["case", ["==", ["get", "count"], 1], 9, 12],
          "circle-color": [
            "case",
            ["==", ["get", "count"], 1],
            "#6aa641",
            "white",
          ],
          "circle-opacity": 1,
          "circle-stroke-width": ["case", ["==", ["get", "count"], 1], 0, 3],
          "circle-stroke-color": "#6aa641",
        },
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "assets",
        filter: ["has", "point_count"],
        paint: {
          "circle-radius": 12,
          "circle-opacity": 1,
          "circle-color": "#ffffff",
          "circle-opacity": 1,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#6aa641",
        },
      });

      this.map.addLayer({
        id: "unclustered-assets-count",
        type: "symbol",
        source: "assets",
        paint: {
          "text-color": ["case", ["<", ["get", "count"], 2], "white", "black"],
        },
        layout: {
          "text-field": ["get", "count"],
          "text-size": ["case", ["<", ["get", "count"], 2], 10, 12],
          "text-allow-overlap": false,
        },
      });

      map.addLayer({
        id: "clusters-asset-count",
        type: "symbol",
        source: "assets",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count}",
          "text-size": 12,
          "text-allow-overlap": true,
        },
      });

      map.on("mousemove", mouseMove);
      map.on("click", pointClick);
      map.on("click", "clusters", function(e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        var clusterId = features[0].properties.cluster_id;

        map
          .getSource("assets")
          .getClusterExpansionZoom(clusterId, function(err, zoom) {
            if (err) {
              return;
            }
            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });
      map.on("mouseenter", "clusters", function() {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", function() {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseenter", "unclustered-point-bg", function() {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "unclustered-point-bg", function() {
        map.getCanvas().style.cursor = "";
      });
      map.on("zoom", function() {
        if (map.getZoom() < 18) {
          if (spiderifier !== undefined) spiderifier.unspiderfy();
        }
      });

      this.setBounds(this.data);
      this.setPoly(polygon);
      map.on("moveend", this.updateLayers.bind(this));
    });

    function pointClick(e) {
      let features = map.queryRenderedFeatures(e.point, {
          layers: ["unclustered-point-bg"],
        }),
        count,
        markers,
        longitude;
      if (features.length) longitude = features[0].geometry.coordinates[0];
      if (
        longitude !== previousLongitude &&
        e.originalEvent.target.parentElement.className.split(" ")[0] !==
          "spider-leg-pin"
      ) {
        spiderifier.unspiderfy();
      }
      if (!features.length || features[0].properties.hasOwnProperty("cluster"))
        return;

      count = features.length;

      markers = features.map((e, i) => {
        return {
          id: e.properties.id,
          brand: e.properties.brand,
          model: e.properties.model,
          coordinates: e.geometry.coordinates,
          url:
            store.state.server +
            "/bin/getimage" +
            "?id=" +
            e.properties.id +
            "&token=" +
            token +
            "&radius=0&scale=32x32",
        };
      });
      let coordinates = features[0].geometry.coordinates.slice();

      if (previousLongitude !== longitude || !spiderifier.isSpiderified()) {
        spiderifier.spiderfy(coordinates, markers);
        previousLongitude = longitude;
      }
    }
    function mouseMove(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["unclustered-point-bg"],
      });

      map.getCanvas().style.cursor = features.length ? "pointer" : "";
    }
  }

  getBounds(data) {
    var bounds = new mapboxgl.LngLatBounds();
    if (!data.features.length)
      return [
        [-89, -89],
        [89, 89],
      ];
    data.features.forEach(function(feature) {
      bounds.extend(feature.geometry.coordinates);
    });
    return bounds;
  }

  setBounds(data) {
    let bounds = this.getBounds(data);
    this.map.fitBounds(bounds, {
      padding: { top: 60, bottom: 10, left: 30, right: 30 },
    });
  }

  addCircle() {
    let circle = new MapboxCircle(this.map.getCenter(), 30000, {
      editable: true,
      fillColor: "#66ac00",
    }).addTo(this.map);

    this.updateCircle(circle.getCenter(), circle.getRadius());

    circle.on("centerchanged", (c) => {
      this.updateCircle(c.getCenter(), c.getRadius());
    });
    circle.on("radiuschanged", (c) => {
      this.updateCircle(c.getCenter(), c.getRadius());
    });
    this.circle = circle;
  }

  removeCircle() {
    this.circle.remove();
  }

  async updateLayers() {
    await Timeout.set(500);
    this.mapMoved(this.map.getBounds(this.data));
  }

  async updateSource(data) {
    let source = this.map.getSource("assets");
    if (source) {
      source.setData(data);
      this.setBounds(data);
    }
  }

  setPoly(data) {
    if (data) {
      let poly = unflatten(data.split(","));
      this.draw.set({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [poly],
            },
          },
        ],
      });
    } else {
      if (this.mapControls) this.draw.deleteAll();
    }
  }
}
