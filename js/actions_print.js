Ext.require([
  'Ext.container.Viewport',
  'Ext.window.MessageBox',
  'GeoExt.panel.Map',
  'GeoExt.Action',

  // Add print Preview + Create PDF
  'GeoExt.data.MapfishPrintProvider',
  'GeoExt.panel.PrintMap',

  // Add popup  
  'GeoExt.window.Popup',
  
  // Add Form
  'Ext.form.Panel',
  'Ext.layout.container.Column',
  'Ext.tab.Panel',
  'Ext.form.field.HtmlEditor'

]);

Ext.application({
  name: 'ActionExample',
  launch: function(){

    var thailand = new OpenLayers.Bounds(88,5,115,21);
    
    var ctrl_measure_length, ctrl_measure_area;

    // Add print Preview + Create PDF
    var printDialog, printProvider;
    
    // The PrintProvider that connects us to the print service
    printProvider = Ext.create('GeoExt.data.MapfishPrintProvider', {
      method: "GET", // "POST" recommended for production use
      capabilities: printCapabilities, // provide url instead for lazy loading
      customParams: {
        mapTitle: "GeoExt Printing Demo",
        comment: "This demo shows how to use GeoExt.PrintMapPanel"
      }
    });

    var map = new OpenLayers.Map({});
    map.maxExtent = thailand;
    map.minZoomLevel = 5;
    
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

    // Add Popup
    var popup;
    
    // Add Popup: create select feature control
    var selectCtrl = new OpenLayers.Control.SelectFeature(vector);

    // Add Popup: define "createPopup" function + Input Form

    var frm_input = Ext.create('Ext.form.Panel', {
        title: 'Inner Tabs',
        id: 'id_frm_input',
        bodyStyle:'padding:5px',
        width: 600,
        fieldDefaults: {
            labelAlign: 'top',
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%'
        },

        items: [{
            layout:'column',
            border:false,
            items:[{
                columnWidth:.5,
                border:false,
                layout: 'anchor',
                defaultType: 'textfield',
                items: [{
                    fieldLabel: 'First Name',
                    name: 'first',
                    anchor:'95%'
                }, {
                    fieldLabel: 'Company',
                    name: 'company',
                    anchor:'95%'
                }]
            },{
                columnWidth:.5,
                border:false,
                layout: 'anchor',
                defaultType: 'textfield',
                items: [{
                    fieldLabel: 'Last Name',
                    name: 'last',
                    anchor:'95%'
                },{
                    fieldLabel: 'Email',
                    name: 'email',
                    vtype:'email',
                    anchor:'95%'
                }]
            }]
        },{
            xtype:'tabpanel',
            plain:true,
            activeTab: 0,
            height:235,
            defaults:{bodyStyle:'padding:10px'},
            items:[{
                title:'Personal Details',
                defaults: {width: 230},
                defaultType: 'textfield',

                items: [{
                    fieldLabel: 'First Name',
                    name: 'first',
                    allowBlank:false,
                    value: 'Titasak'
                },{
                    fieldLabel: 'Last Name',
                    name: 'last',
                    value: 'Boonthai'
                }, {
                    fieldLabel: 'Email',
                    name: 'email',
                    vtype:'email'
                },{
                    fieldLabel: 'Location',
                    name: 'location',
                    id: 'id_location'
                }]
            },{
                title:'Phone Numbers',
                defaults: {width: 230},
                defaultType: 'textfield',

                items: [{
                    fieldLabel: 'Home',
                    name: 'home',
                    value: '(888) 555-1212'
                },{
                    fieldLabel: 'Business',
                    name: 'business'
                },{
                    fieldLabel: 'Mobile',
                    name: 'mobile'
                },{
                    fieldLabel: 'Fax',
                    name: 'fax'
                }]
            },{
                cls: 'x-plain',
                title: 'Biography',
                layout: 'fit',
                items: {
                    xtype: 'htmleditor',
                    name: 'bio2',
                    fieldLabel: 'Biography'
                }
            }]
        }],

        buttons: [{
            text: 'Save'
        },{
            text: 'Cancel'
        }]
    });

    function createPopup(feature) {
      var lon = feature.geometry.x;
      var lat = feature.geometry.y;
      var curr_loc = feature.geometry.toString();
      Ext.getCmp('id_location').setValue(curr_loc);
      
      //debugger;
      
      if (!popup) {
        popup = Ext.create('GeoExt.window.Popup', {
            title: 'My Popup',
            id: 'id_popup',
            location: feature,
            width:604,
            //html: bogusMarkup,
            items: [ frm_input ],
            maximizable: true,
            collapsible: true,
            closeAction: 'hide',
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
      }
      popup.center();
      popup.show();
    }

    // Add Popup: create popup on "featureselected"
    vector.events.on({
      featureselected: function(e) {
        var chk = Ext.getCmp('id_select_feat').pressed;
        if (chk == false)
          return false;
        else 
          createPopup(e.feature);
      }
    });
    
    // Measure Length control
    ctrl_measure_length = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
      eventListeners: {
        measure: function(evt) {
          alert("The Length was " + evt.measure + ' ' + evt.units);
        }
      }
    });
    
    map.addControl(ctrl_measure_length);
    
    var btn_measure_length = new Ext.Button({
      iconCls: 'measure_length',
      tooltip: "วัดระยะทาง",
      enableToggle: false,
      handler: function(toggled){
        if (toggled.pressed) {
          //alert('btn_length: active btn_area: deactivate');
          ctrl_measure_area.deactivate();
          ctrl_measure_length.activate();          
        } else {
          ctrl_measure_length.deactivate();
        }
      },
      toggleGroup: "grp_measure",
      pressed: false
      
    });

    ctrl_measure_area = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
      eventListeners: {
        measure: function(evt) {
          alert("The Area was " + evt.measure + ' ' + evt.units);
        }
      }
    });
    
    map.addControl(ctrl_measure_area);
    
    var btn_measure_area = new Ext.Button({
      iconCls: 'measure_area',
      tooltip: "คำนวณพื้นที่",
      enableToggle: false,
      handler: function(toggled){
        if (toggled.pressed) {
          //alert('btn_area: active btn_length: deactivate');
          ctrl_measure_length.deactivate();
          ctrl_measure_area.activate();
        } else {       
          ctrl_measure_area.deactivate();
        }
      },
      toggleGroup: "grp_measure",
      pressed: false    
    });
      
    map.addLayers([wms1, vector]);
        
    var ctrl, toolbarItems = [], action, actions = {};

    // ZoomToMaxExtent controls
    // in the same toggle group
    action = Ext.create('GeoExt.Action', {
        iconCls: 'zoomfull',
        control: new OpenLayers.Control.ZoomToMaxExtent(),
        map: map,
        toggleGroup: "draw",
        allowDepress: false,
        pressed: false,
        tooltip: "แสดงแผนที่ประเทศไทย"
    });
    actions["zoomfull"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));

    toolbarItems.push("-");
    
    // ZoomIn controls
    // in the same toggle group
    action = Ext.create('GeoExt.Action', {
        iconCls: 'zoomin',
        control: new OpenLayers.Control.ZoomIn(),
        map: map,
        toggleGroup: "draw",
        allowDepress: false,
        pressed: false,
        tooltip: "ขยายขนาดแผนที่"
    });
    actions["zoomin"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));
    
    // ZoomOut controls
    // in the same toggle group
    action = Ext.create('GeoExt.Action', {
        iconCls: 'zoomout',
        control: new OpenLayers.Control.ZoomOut(),
        map: map,
        toggleGroup: "draw",
        allowDepress: false,
        pressed: false,
        tooltip: "ย่อขนาดแผนที่"
    });
    actions["zoomout"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));
        
    toolbarItems.push("-");

    action = Ext.create('GeoExt.Action', {
      iconCls: 'draw_point',
      control: new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Point),
      map: map,
      // button options
      toggleGroup: "draw",
      allowDepress: true,
      tooltip: "Draw a point",
      // check item options
      group: "draw"
    });
    actions["draw_point"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));
    
    action = Ext.create('GeoExt.Action', {
      iconCls: 'draw_line',
      control: new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Path),
      map: map,
      // button options
      toggleGroup: "draw",
      allowDepress: true,
      tooltip: "Draw a line",
      // check item options
      group: "draw"
    });
    actions["draw_line"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));

    action = Ext.create('GeoExt.Action', {
      iconCls: 'draw_poly',
      control: new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Polygon),
      map: map,
      // button options
      toggleGroup: "draw",
      allowDepress: true,
      tooltip: "Draw a polygon",
      // check item options
      group: "draw"
    });
    actions["draw_poly"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));
    
    toolbarItems.push("-");
    
    action = Ext.create('GeoExt.Action', {
      iconCls: "modify_feat",
      control: new OpenLayers.Control.ModifyFeature(vector),
      map: map,
      // button options
      toggleGroup: "draw",
      allowDepress: true,
      tooltip: "Modify Feature",
      // check item options
      group: "draw"
    });
    actions["modify_feat"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));
    
    action = Ext.create('GeoExt.Action', {
      iconCls: "delete_feat",
      control: new OpenLayers.Control.DeleteFeature(vector),
      map: map,
      // button options
      toggleGroup: "draw",
      allowDepress: true,
      tooltip: "Delete Feature",
      // check item options
      group: "draw"
    });
    actions["delete_feat"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));

    toolbarItems.push("-");
        
    toolbarItems.push(btn_measure_length);
    toolbarItems.push(btn_measure_area);

    toolbarItems.push("-");

    action = Ext.create('GeoExt.Action', {
      iconCls: "select_feat",
      id: 'id_select_feat',
      control: selectCtrl,
      map: map,
      enableToggle: true,
      toggleGroup: "draw",
      allowDepress: true,
      tooltip: "Input Form",
    });
    actions["select_feat"] = action;
    toolbarItems.push(Ext.create('Ext.button.Button', action));    
    
    toolbarItems.push("->");
    
    // Reuse the GeoExt.Action objects created above
    // as menu items
    //toolbarItems.push({
    //  text: "menu",
    //  menu: Ext.create('Ext.menu.Menu', {
    //    items: [
    //      // ZoomToMaxExtent
    //      Ext.create('Ext.button.Button', actions["zoomfull"]),
    //      // ZoomIn
    //      Ext.create('Ext.menu.CheckItem', actions["zoomin"]),
    //      // ZoomOut
    //      Ext.create('Ext.menu.CheckItem', actions["zoomout"]),
    //      // Draw point
    //      Ext.create('Ext.menu.CheckItem', actions["draw_point"]),
    //      // Draw line
    //      Ext.create('Ext.menu.CheckItem', actions["draw_line"]),
    //      // Draw polygon
    //      Ext.create('Ext.menu.CheckItem', actions["draw_polygon"]),
    //      // Modify Feature
    //      Ext.create('Ext.menu.CheckItem', actions["modify_feat"]),
    //      // Remove Feature
    //      Ext.create('Ext.menu.CheckItem', actions["remove_feat"])        ]
    //  })
    //});

    // Add print Preview + Create PDF    
    var btn_print = new Ext.Button({
      iconCls: 'print_preview',
      handler: function(){
        // A window with the PrintMapPanel, which we can use to adjust
        // the print extent before creating the pdf.
        printDialog = Ext.create('Ext.Window', {
          title: "<font color='#FF7000'>Print Preview</font>",
          id: 'id_printDialog',
          layout: "fit",
          width: 400,
          autoHeight: true,
          items: [{
            xtype: "gx_printmappanel",
            sourceMap: mappanel,
            printProvider: printProvider
          }],
          bbar: [{
            iconCls: 'print',
            tooltip: 'Print Map',
            //handler: function(){ printDialog.items.get(0).print(); }
            //ERROR: when preesing this button --> 
            handler: function(){
              $("#id_printDialog-body").printElement({printMode:'popup'});
            }
          },'->',{
            iconCls: 'close',
            tooltip: 'Close',
            handler: function(){
              Ext.getCmp('id_printDialog').close();
            }
          }]
        });
        printDialog.center();
        printDialog.show();
      }
    });
    toolbarItems.push(btn_print);    
    
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