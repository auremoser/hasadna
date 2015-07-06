window.onload = function() {
    var vizjson_url = 'https://team.cartodb.com/u/aureliamoser/api/v2/viz/f1af78c8-23c7-11e5-bff0-0e9d821ea90d/viz.json'; // <-- Paste viz.json URL between quotes

       var options = {
           sql: $("#sql").text(), // here you can set sql to run on your tables
           cartocss: $("#industry").text() // here you can set css to style your choropleth
       }
       // clear sql of space and returns
       options.sql = options.sql.replace(/(\r\n|\n|\r)/gm,'').trim();


       var sublayers = [];

       // instantiate map object from Leaflet
       var mapObj = new L.Map(map, {  // <-- Replace map_id with your #id for rendering
           center: [31.5000, 34.9000], // Telaviv, IL
           zoom: 8 // zoom projection to adjust starting point zoom
       });

       // CREATE LAYER SELECTOR - AKA BUTTONS
       function createSelector(layer) {
          var cartocss = "";
          var $options = $(".layer_selector").find("li");
          $options.click(function(e) {
              var $li = $(e.target);
              var selected = $li.attr('data');

              $options.removeClass('selected');
              $li.addClass('selected');

              cartocss = $('#'+selected).text();

              layer[0].setCartoCSS(cartocss);
          });
       }

       // add basemap tiles
       L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
           attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
       }).addTo(mapObj);

       // add data tile layers here (if you have multiple layers, you can manipulate them in js here)
       cartodb.createLayer(mapObj,vizjson_url)
           .addTo(mapObj)
           .done(function(layer) {
               console.log("Map successfully created.");
               sublayers[0] = layer.getSubLayer(0);
               sublayers[1] = layer.getSubLayer(1);
               sublayers[0].set(options); // altering the SQL and CartoCSS; see above
               // sublayers[1].hide(); // hiding the municipality basic polygons
               createSelector(sublayers);
           })
           .error(function(err) {
               console.log("Map not created: " + err);
           });
    }