Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'GeoExt.tree.Panel',
    'Ext.tree.plugin.TreeViewDragDrop',
    'GeoExt.panel.Map',
    'GeoExt.tree.OverlayLayerContainer',
    'GeoExt.tree.BaseLayerContainer',
    'GeoExt.data.LayerTreeModel',
    'GeoExt.tree.View',
    'GeoExt.tree.Column'
]);

var mapPanel, tree;
var controls = [
                new OpenLayers.Control.PanZoomBar(),
                new OpenLayers.Control.MousePosition(),
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.ScaleLine({geodesic: true}),
            ];
var gcs = new OpenLayers.Projection("EPSG:4326");
var merc = new OpenLayers.Projection("EPSG:900913");
var thai = new OpenLayers.LonLat(100, 13);
thai.transform(gcs,merc);

var toolbarItems = [], action;
action = Ext.create('GeoExt.Action',{
  iconCls: 'zoomfull',
  handler: function(){
    mapPanel.map.setCenter(thai, 5);
  },
  tooltip: 'Zoom to Thailand'
});
toolbarItems.push(Ext.create('Ext.button.Button', action));

Ext.application({
  name: 'Tree',
  launch: function() {
    mapPanel = Ext.create('GeoExt.panel.Map', {
      border: true,
      region: "center",
      map: {allOverlays: false, controls: controls},
      center: [100, 13],
      zoom: 5,
      layers: [
        new OpenLayers.Layer.WMS("Global Imagery",
          "http://maps.opengeo.org/geowebcache/service/wms", {
            layers: "bluemarble",
            format: "image/png8"
          }, {
            buffer: 0,
            visibility: false
          }
        )
        
        ,new OpenLayers.Layer.WMS("gis_province",
          "http://127.0.0.1/cgi-bin/mapserv?", {
            map: '/ms601/map/wms-thai.map',
            layers: "gis_province",
            format: "image/png"
          }, {
            buffer: 0,
            visibility: false,
            isBaseLayer: false,
            singleTile: true
          }
        )
      ],
      dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: toolbarItems
      }]
    });

    
    var store = Ext.create('Ext.data.TreeStore', {
      model: 'GeoExt.data.LayerTreeModel',
      root: {
        expanded: true,
        children: [
          {
            plugins: ['gx_baselayercontainer'],
            expanded: true,
            text: "Base Maps"
          }, {
            plugins: ['gx_overlaylayercontainer'],
            expanded: true
          }
        ]
      }
    });
      
    var layer;

    tree = Ext.create('GeoExt.tree.Panel', {
      border: true,
      region: "west",
      title: "Layers",
      width: 200,
      split: true,
      collapsible: true,
      collapseMode: "mini",
      autoScroll: true,
      store: store,
      rootVisible: false,
      lines: false,
      tbar: [{
        text: "remove",
        handler: function() {
          layer = mapPanel.map.layers[2];
          mapPanel.map.removeLayer(layer);
        }
      }, {
        text: "add",
        handler: function() {
          mapPanel.map.addLayer(layer);
        }
      }]
    });
  
    Ext.create('Ext.Viewport', {
      layout: "fit",
      hideBorders: true,
      items: {
        layout: "border",
        deferredRender: false,
        items: [ mapPanel, tree ]
      }
    });
  }
});
