/*
* Layer style
*/
// we want opaque external graphics and non-opaque internal graphics
var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
layer_style.fillOpacity = 0.2;
layer_style.graphicOpacity = 1;
layer_style.strokeWidth = 2;

/*
* Blue style
*/
var style_blue = OpenLayers.Util.extend({}, layer_style);
style_blue.strokeColor = "#0099FF";
style_blue.fillColor = "#33FFCC";
style_blue.strokeWidth = 2;
style_blue.pointRadius = 6;
  
/*
* Green style
*/
var style_green = {
  strokeColor: "#006633",
  fillColor: "#CCFFCC",
  strokeWidth: 3,
  pointRadius: 6,
  pointerEvents: "visiblePainted"
};

/*
* Orange style
*/
var style_orange = {
  strokeColor: "#EEA013",
  fillColor: "#F3CC90",
  strokeWidth: 3,
  pointRadius: 6,
  pointerEvents: "visiblePainted"
};


/*
* Mark style
*/
var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
// each of the three lines below means the same, if only one of
// them is active: the image will have a size of 24px, and the
// aspect ratio will be kept
// style_mark.pointRadius = 12;
// style_mark.graphicHeight = 24; 
// style_mark.graphicWidth = 24;

// if graphicWidth and graphicHeight are both set, the aspect ratio
// of the image will be ignored
style_mark.graphicWidth = 24;
style_mark.graphicHeight = 20;
style_mark.graphicXOffset = -(style_mark.graphicWidth/2);  // this is the default value
style_mark.graphicYOffset = -style_mark.graphicHeight;
style_mark.externalGraphic = "../img/marker.png";

//var vectorLayer = new OpenLayers.Layer.Vector("Simple Geometry", {style: layer_style});


