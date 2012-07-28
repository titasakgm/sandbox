Ext.require([
  'Ext.container.Viewport',
  'Ext.window.MessageBox',
  'GeoExt.panel.Map',
  'GeoExt.Action',
  // Add Popup
  'GeoExt.window.Popup'
]);

Ext.application({
  name: 'ActionExample',
  launch: function(){

    // Add Popup
    var popup;
    var toolbarItems = [];
    
    var map = new OpenLayers.Map({});
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    var wms1 = new OpenLayers.Layer.WMS(
      "OpenLayers WMS",
      "http://vmap0.tiles.osgeo.org/wms/vmap0?",
      {layers: 'basic'}
    );

    wms2 = new OpenLayers.Layer.WMS(
      "Global Imagery",
      "http://maps.opengeo.org/geowebcache/service/wms",
      {layers: "bluemarble"}
    );
    
    var vector = new OpenLayers.Layer.Vector("vector");

    // create popup on "featureselected"
    vector.events.on({
      featureselected: function(e) {
        createPopupInput(e.feature);
      }
    });

        // define "createPopup" function
    var form_input = "<input type='text' />";
            
    function createPopupInput(feature) {
      popup = Ext.create('GeoExt.window.Popup', {
          title: 'Input Data',
          location: feature,
          width:200,
          html: form_input,
          maximizable: true,
          collapsible: true,
          anchorPosition: 'auto'
      });
      // unselect feature when the popup
      // is closed
      popup.on({
          close: function() {
              if(OpenLayers.Util.indexOf(vector.selectedFeatures,
                  this.feature) > -1) {
                selectCtrl.unselect(this.feature);
              }
          }
      });
      popup.show();
    }
    
    map.addLayers([wms1, vector]);
        
    var ctrl, action, actions = {};
        
    // ZoomToMaxExtent control, a "button" control
    action = Ext.create('GeoExt.Action', {
        control: new OpenLayers.Control.ZoomToMaxExtent(),
        map: map,
        text: "max extent",
        tooltip: "zoom to max extent"
    });
    actions["max_extent"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));
    toolbarItems.push("-");
        
    // Navigation control and DrawFeature controls
    // in the same toggle group
    action = Ext.create('GeoExt.Action', {
        text: "nav",
        control: new OpenLayers.Control.Navigation(),
        map: map,
        // button options
        toggleGroup: "draw",
        allowDepress: false,
        pressed: true,
        tooltip: "navigate",
        // check item options
        group: "draw",
        checked: true
    });
    actions["nav"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));
        
    action = Ext.create('GeoExt.Action', {
      text: "Point",
      control: new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Point),
      map: map,
      // button options
      toggleGroup: "draw",
      allowDepress: false,
      tooltip: "draw point",
      // check item options
      group: "draw"
    });
    actions["draw_point"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));

    action = Ext.create('GeoExt.Action', {
      text: "Modify",
      control: new OpenLayers.Control.ModifyFeature(vector),
      map: map,
      // button options
      toggleGroup: "draw",
      allowDepress: false,
      tooltip: "Modify Feature",
      // check item options
      group: "draw"
    });
    actions["modify_feat"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));

    toolbarItems.push("|");

    // create select feature + input control
    action = Ext.create('GeoExt.Action', {
      text: "Input",
      control: new OpenLayers.Control.SelectFeature(vector),
      map: map,
      // button options
      toggleGroup: "draw",
      allowDepress: false,
      tooltip: "Input Data",
      // check item options
      group: "draw"
    });
    actions["input_popup"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));
    
    toolbarItems.push("->");
    
    // Reuse the GeoExt.Action objects created above
    // as menu items
    toolbarItems.push({
      text: "menu",
      menu: Ext.create('Ext.menu.Menu', {
        items: [
          // ZoomToMaxExtent
          Ext.create('Ext.button.Button', actions["max_extent"]),
          // Nav
          Ext.create('Ext.menu.CheckItem', actions["nav"]),
          // Draw point
          Ext.create('Ext.menu.CheckItem', actions["draw_point"]),
          // Modify Feature
          Ext.create('Ext.menu.CheckItem', actions["modify_feat"]),
          // Input Popup for data entry
          Ext.create('Ext.menu.CheckItem', actions["modify_feat"])
        ]
      })
    });
        
    var mappanel = Ext.create('GeoExt.panel.Map', {
      title: 'GeoExt.Action',
      map: map,
      extent: '97.25,5.50,105.75,20.5',
      dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: toolbarItems
      }]
    });
        
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [mappanel]
    });
  }
});