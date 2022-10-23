
# Week 9 - (more) Data-driven styling and Interactivity in Mapbox

**Today we will cover**
- More data-driven styling
- Zoom-driven styling
- Pop-ups  

Before we get started, I should mention that almost all the data we are using has been shared with us by [Josh Rotbert](http://www.joshrotbert.com/), courtsey of Linda Shi and the [Adaptive Land Lab](https://labs.aap.cornell.edu/adaptive-land-lab). Thanks guys for gathering and joining some of the data we're about to use!

# 0. Start with code from last week

Let's all start off with the same starting `index.html` code below. There are some pieces I've added in for you that you will connect / fill out.
 Make sure to add in your Mapbox API token!


```html
<!-- This is to indicate we have an HTML document -->
<!DOCTYPE html>

<!-- All our code goes within this tag-->
<html>

<!-- All the metadata and packages/tools we'll use go in here-->
<head>

<!-- The charset attribute specifies the character encoding for the HTML document.-->
<meta charset='utf-8' />

<!-- The title of your page, which will appear in the browser tab -->
<title>NYC Housing Flood Risk</title>

<!-- The size of the viewport vs the rendered page -->
<meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />

<!-- We are going to call the Mapbox GL javascript library, which will allow us to use its functionality -->
<script src='https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js'></script>

<!-- Alongside this, we are going to bring in the Mapbox GL stylesheet -->
<link href='https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css' rel='stylesheet' />

<link href='style.css' rel='stylesheet' />

<!-- This allows us to bring in new fonts -->
<link href='https://fonts.googleapis.com/css2?family=Montserrat&display=swap' rel='stylesheet'>
</head>

<!-- The body contains the actual content of a page -->
<body>

<!-- The 'div' tag delineates a 'division' or section of the HTML page.-->
  <div id='map'></div>
	<div class='map-overlay'>
  	<div class='map-overlay-inner'>
  	<h2>Public and Affordable Housing Flood Risk</h2>
    <p>In the fall of 2012, New York City was hit with hurricane that left tens of thousands of public housing residents <a href = 'https://www1.nyc.gov/site/nycha/about/press/pr-2012/nycha-has-restored-power-to-buildings-affected-by-hurricane-sandy.page'>without power for days or even weeks]</a>. New York City Housing Authority public housing developments were affected. <a href='https://furmancenter.org/files/publications/SandysEffectsOnHousingInNYC.pdf'>24,000 government-subsidized apartments and 40,000 rent-stabilized apartments were also affected</a>.</p>

    <p>With rising sea levels from climate change and the <a href='https://www.nytimes.com/2017/04/18/magazine/when-rising-seas-transform-risk-into-certainty.html'>promise</a> of more flooding, which areas and <i>who</i> will likely be most affected? How is affordable housing construction responding to this? </p>

      <div id='menu'>
          <!-- <h3>Housing Type</h3> -->
          <label class='check-container'>
              Affordable Housing Types
              <input id='affHousing' type='checkbox' name='viz-toggle' checked='checked'>
          </label>
          <label class='check-container'>Co-Op
              <span class="legend-key" style='background:#CCC'></span>
          </label>
          <label class='check-container'>Shelter
              <span class="legend-key" style='background:#CCC'></span>
          </label>
          <label class='check-container'>HPD subsized
              <span class="legend-key" style='background:#CCC'></span>
          </label>
          <label class='check-container'>Mobile Home
              <span class="legend-key" style='background:#CCC'></span>
          </label>
          <label class='check-container'>Public Housing
              <span class="legend-key" style='background:#CCC'></span>
          </label>
          <label class='check-container'>Single-Residency Housing
              <span class="legend-key" style='background:#CCC'></span>
          </label>
          <label class='check-container'>Other
              <span class="legend-key" style='background:#CCC'></span>
          </label>

      <br>
          <!-- <h3>Race and Socioeconomic Status</h3> -->
          <label class='check-container'>
              +300 People Below Poverty Line
              <input id='povertyLevel' type='checkbox' name='viz-toggle' checked='checked'>
          </label>
          <h3>Flood Risk Zones</h3>
          <label class='check-container'>
              2012 Sandy Inundation Zone
              <input id='floodZones' type='checkbox' name='viz-toggle' checked='checked'>
          </label>
          <br>
          <b>Predicted Floodplains</b>
          <label class='check-container'>
              In 2020 (1 in 100 year flood)
              <input id='f20_100' type='checkbox' name='viz-toggle' checked='checked'>
          </label>
          <label class='check-container'>
              In 2020 (1 in 500 year)
              <input id='f20_500' type='checkbox' name='viz-toggle' checked='checked'>
          </label>
          <label class='check-container'>
              In 2050 (1 in 100 year)
              <input id='f50_100' type='checkbox' name='viz-toggle' checked='checked'>
          </label>
          <label class='check-container'>
              In 2050 (1 in 500 year)
              <input id='f50_500' type='checkbox' name='viz-toggle' checked='checked'>
          </label>
          <label class='check-container'>
              In 2100 (1 in 100 year)
              <input id='f100_100' type='checkbox' name='viz-toggle' checked='checked'>
          </label>
          <label class='check-container'>
              In 2100 (1 in 500 year)
              <input id='f100_500' type='checkbox' name='viz-toggle' checked='checked'>
          </label>

        <!-- <label class='check-container'>
            NYCHA Buildings
            <input id='nychaBuildings' type='checkbox' name='viz-toggle' checked='checked'>
        </label> -->

      </div>

  	</div>


	</div>
  <script>
  // You'll be inserting your JS code to initialize your map here
  mapboxgl.accessToken = 'YOUR-MAPBOX-TOKEN';
  const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/iamwfx/cl9519asg003414pl56w7ov95', // replace this with your style URL
    center: [-73.935242, 40.730610], // The convention for coordinates is  typically [long, lat]
    zoom: 13,
    // maxZoom: 22,
    minZoom: 12
  });

    map.on('load',function(){
      // Give your layer's source a nickname you'll remember easily.
      map.addSource('sandyLayer',{
        'type':'vector',
        'url': 'mapbox://iamwfx.bpjzmy2b'
      });

      map.addSource('censusLayer',{
        'type':'vector',
        'url': 'mapbox://iamwfx.6nowkujs'
      });

      map.addSource('nychaLayer',{
        'type':'vector',
        'url': 'mapbox://iamwfx.28ut4nij'
      });

      // Flood plains
      map.addSource('FutureFloodplains_2020_100yr',{
        'type':'vector',
        'url': 'mapbox://iamwfx.bbchggzx'
      });

      map.addSource('FutureFloodplains_2020_500yr',{
        'type':'vector',
        'url': 'mapbox://iamwfx.05ogder8'
      });

      map.addSource('FutureFloodplains_2050_100yr',{
        'type':'vector',
        'url': 'mapbox://iamwfx.crrx4301'
      });

      map.addSource('FutureFloodplains_2050_500yr',{
        'type':'vector',
        'url': 'mapbox://iamwfx.4ydk0450'
      });
      map.addSource('FutureFloodplains_2100_100yr',{
        'type':'vector',
        'url': 'mapbox://iamwfx.dxjuiivg'
      });

      map.addSource('FutureFloodplains_2100_500yr',{
        'type':'vector',
        'url': 'mapbox://iamwfx.8thgevrt'
      });


      map.addLayer({
        'id':'povertyLevel',
        'type':'fill',
        'source':'censusLayer',
        'source-layer':'nyc_blck_grp_2020_wcensus_dro-4db43i',
        'paint':{
        'fill-color':'#f5ef42',
          'fill-opacity':
           [
          'step',
            ['get','AMR5E002'],
            0,300,.8
            // .3,.9

            ]
          }
        });

      //
      // map.addLayer({
      //   'id':'nychaBuildings',
      //   'type':'fill',
      //   'source':'nychaLayer',
      //   'source-layer':'Map_of_NYCHA_Developments-7i6vok',
      //   'paint':{
      //     'fill-color':'red',
      //     'fill-opacity': 0.5
      //   }
      // });


      map.addLayer({
        'id':'floodZones',
        'type':'fill',
        'source':'sandyLayer',
        'source-layer':'Sandy_Inundation_Zone-4qcajo',
        'paint':{
          'fill-color':'#00158f',
          'fill-opacity': 0.3,
        }
      });

      map.addLayer({
        'id':'f20_100',
        'type':'fill',
        'source':'FutureFloodplains_2020_100yr',
        'source-layer':'FutureFloodplains_2020_100yr-du18hr',
        'paint':{
          'fill-color':'#00158f',
          'fill-opacity': 0.3
        }
      });
      map.addLayer({
        'id':'f20_500',
        'type':'fill',
        'source':'FutureFloodplains_2020_500yr',
        'source-layer':'FutureFloodplains_2020_500yr-0x77x0',
        'paint':{
          'fill-color':'#00158f',
          'fill-opacity': 0.3
        }
      });
      map.addLayer({
        'id':'f50_100',
        'type':'fill',
        'source':'FutureFloodplains_2050_100yr',
        'source-layer':'FutureFloodplains_2050_100yr-6nepei',
        'paint':{
          'fill-color':'#00158f',
          'fill-opacity': 0.3
        }
      });
      map.addLayer({
        'id':'f50_500',
        'type':'fill',
        'source':'FutureFloodplains_2050_500yr',
        'source-layer':'FutureFloodplains_2050_500yr-a4444h',
        'paint':{
          'fill-color':'#00158f',
          'fill-opacity': 0.3
        }
      });
      map.addLayer({
        'id':'f100_100',
        'type':'fill',
        'source':'FutureFloodplains_2100_100yr',
        'source-layer':'FutureFloodplains_2100_100yr-cqwfrw',
        'paint':{
          'fill-color':'#00158f',
          'fill-opacity': 0.3
        }
      });
      map.addLayer({
        'id':'f100_500',
        'type':'fill',
        'source':'FutureFloodplains_2100_500yr',
        'source-layer':'FutureFloodplains_2100_500yr-27ghpw',
        'paint':{
          'fill-color':'#00158f',
          'fill-opacity': 0.3
        }
      });

  // Explicitly set the visibility of each to be on or off.
  // There are probably easier ways to do this../
    map.setLayoutProperty('floodZones',"visibility", "visible");
    map.setLayoutProperty('povertyLevel',"visibility", "visible");
    // map.setLayoutProperty('nychaBuildings',"visibility", "visible");
    map.setLayoutProperty('f20_100',"visibility", "visible");
    map.setLayoutProperty('f20_500',"visibility", "visible");
    map.setLayoutProperty('f50_100',"visibility", "visible");
    map.setLayoutProperty('f50_500',"visibility", "visible");
    map.setLayoutProperty('f100_100',"visibility", "visible");
    map.setLayoutProperty('f100_500',"visibility", "visible");

    map.setLayoutProperty('affHousing',"visibility", "visible");

    var layerList = document.getElementById("menu");
    var checkboxes = layerList.getElementsByTagName("input");


    function switchLayer(layer) {
      var clickedLayersLabel = layer.target.id; // get the label of the layer cluster
      var clickedLayers = eval(clickedLayersLabel); // create the variable from the label using the eval function

      var visibility = map.getLayoutProperty(clickedLayersLabel, "visibility"); // check whether the cluster of layers is visible by checking the first entry
      if (visibility === "visible") {
        map.setLayoutProperty(clickedLayersLabel, "visibility", "none")
      } else {
        map.setLayoutProperty(clickedLayersLabel, "visibility", "visible")
      }
    }

    for (var i = 0; i < checkboxes.length; i++) {
      // layerLabel  = checkboxes[i].id;
      checkboxes[i].onclick = switchLayer;
    }

  });

    // Within a script, you comment using two backslashes.
    </script>
</body>

</html>


```

And here's your new `style.css` with some styling added for our legend:
```css
body { margin: 0; padding: 0; }
#map { position: absolute; top: 0; bottom: 0; width: 100%; }
.map-overlay {
font-family: 'Montserrat', sans-serif;
/*font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;*/
position: fixed;
width: 20%;
border-radius: 3px;
background-color: #fff;
ba
/* height: 80%; */
top: 0;
left: 0;
margin: 10px;
}

.map-overlay-inner {
padding: 30px;
margin-bottom: 10px;
/* width: 20%;
height:100%; */
}

.map-overlay h2 {
line-height: 24px;
display: block;
margin: 0 0 10px;
}
.mapboxgl-popup {
max-width: 400px;
font: 12px/20px 'Montserrat Neue',sans-serif;
}

.check-container {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
#legend {
  padding: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 18px;
  height: 150px;
  margin-bottom: 40px;
  width: 100px;
}

.legend-key {
  display: inline-block;
  border-radius: 20%;
  width: 10px;
  height: 10px;
  margin-right: 5px;
}


```
Your page should look like this. (Whoops, I took this screenshot when there was a typp: 2080->2100):

<p align='center'>
<img src="../Images/mapbox_lab9_start.png" width="1000">
</p>

No, we don't have the affordable housing types, but we're about to add it in.

## 1.1 (more) Data-driven styling: Categorical maps
Add in the following parcel data layers:

#### Parcels of affordable housing
- Source Layer: `PLUTO_HOUS_TYPE_MASTER_Featu-7b5u7f`
- url: `mapbox://iamwfx.ab4g098q`


View the data in Mapbox studio [here](https://studio.mapbox.com/tilesets/iamwfx.ab4g098q/#10.23/40.7219/-73.8063) and see what columns are available.


Notice that there is a column called `hous_type`. It has the following possible categories:
- `coop`: co-op buildings
- `homeless`: homeless shelters,
- `hpd_sub`: subsidized housing (though remind me to as Josh which type of subsized housing these are, HCV? LIHTC? MIH?),
- `mob_home`: mobile home,
- `pub_hou`: public housing,
- `sro`: single resident occupancy


Create a categorical map that changes the **line color**, based on the housing type.
- Add this housing dataset as a layer
- **This time, instead of the `type:fill`, make it a `type:line`**.
  - Hint: instead of `fill-color` and `fill-opacity`, you be using `line-color`, and `line-opacity`.
- Set,`'line-width': 2`
- Instead of coloring the layer by numerical value, use the `match` function (see documentation [here](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#match)) to assign colors to categories.
- Make sure to leave a color for row values that are *not available*, just in case.
- Connect it to the `affHousing` check box.
- Make sure to update the colors you picked in the legend in the text box.
If you're looking for a color scheme picker, you can try [Coolors](https://coolors.co/), or any of the other pickers I mentioned in week 3's lab, or just pick your own.

<p align='center'>
<img src="../Images/mapbox_lab9_affhousing.png" width="1000">
</p>

## 1.2 Zoom-driven styling
Often times, we may want information from a map to appear differently at different scales. For instance, we may want more or different details to appear on a map when we zoom in.

In the same way that we can change the style of our layers based on data, we can change the appearance of layers based on the zoom-level.

Let's make our `line-width` be dependent on our zoom level. Here, we are going to go back to the `interpolate` expression:
```js
['interpolate',['linear'],['zoom'], 13, 2, 18, 10]
```
What does this expression mean? It says that
- We want a do a linear widening of our lines.
- Instead of ['get',OURVAR], we can now just call `['zoom']` directly.
- At 13 the line width will be 2, but between zoom levels 13 and 18, there a transition between zoom level 2 and 10.

If you zoom into your map, you should see that the lines appear thicker, like this:
<p align='center'>
<img src="../Images/mapbox_lab9_linewidth.png" width="1000">
</p>

## 1.3 Displaying information on mouse hover
One function that might be helpful is displaying the information that is associated with each geometry. Here, we are going to learn how to display information for one layer as a pop-up.

We are going to work with our `map` object and give it an action when the mouse "enters" a geometry and when it "leaves" the geometry.

- To do this, we are first going to create a Mapbox GL-specific object called `popup` after all of our other code in the `map.on('load',function(){...all of our code so far...;})` object.
```js
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
  });
```

You won't see any changes on your website because we haven't given this object anything to show yet. Next, we are going to use the
```js
map.on('mouseenter','yourLayerId',function(e){})
```
function, which takes the **event object** `e` from our mouse pointer moving into a geometry on `yourLayerId` layer and does whatever we define within the `{}`.

One tricky thing is that some of our columns are empty. If you go to the mapbox studio [link for this layer](https://studio.mapbox.com/tilesets/iamwfx.ab4g098q/#17.47/40.712953/-73.981081) and click on some of the parcels, you might see something like this:

<p align='center'>
<img src="../Images/mapbox_lab9_emptycols.png" width="1000">
</p>

We are going to do a small transformation where empty values will return a `No` string and when do we have data, instead of displaying `in2050_100` or something we will display `Yes`.

Here, I want to show the following variables:
 - The address `Address`
 - Whether the lot is in the predicted flood risk zones `P_2050_1`, `P_2050_5`, `P_2100_1`, `P_2100_5` (they don't have the data for 2020)
 - The lot ID `BBL`
 - And the city council district `Council`



Inside our `map.on('mouseenter',function(e){...})` function, we are going to do the following:
 1. Get the coordinates of the geometry you are entering and assign it to variable.
 ```js
   const coordinates = e.features[0].geometry.coordinates.slice();
 ```

 2. Get the table values we want to use display and assign them to variables.
```js
  // Here's that function that does the transformation
  function emptyToYesNo(val){
    if (val == null || val == undefined){
      return "No"} else {return "Yes"};
  }
  const Address = e.features[0].properties.Address;
  const BBL = e.features[0].properties.BBL;
  const Council = e.features[0].properties.Council;
  const P_2050_1 =emptyToYesNo(e.features[0].properties.P_2050_1); // We apply this function to our value.
  /// THERE ARE THREE MORE VARIABLES MISSING!
  /// FILL IN THE REST
```  

 3. Turn these variables into a short bit of HTML
```js
  var description = '<h4> ' +Address+'<br>'+
                    'BBL: '+BBL+'<br>'+
                    'City Council District: '+Council+ '</h4>'+
                    '<p> In 2050 1 in 100yr Floodplain?: '+ P_2050_1 + '<br>' + 'In 2050 1 in 500yr Floodplain?: '+P_2050_5 +'<br>'+
                    'In 2100 1 in 100yr Floodplain?: '+P_2100_1 +'<br>'+
                    'In 2100 1 in 500yr Floodplain?: '+P_2100_5 +'</p>'
```
 4. Set the pop-up to appear over the geometry, insert the HTML, and add the map.
 ```js
 popup.setLngLat(coordinates[0][0]).setHTML(description).addTo(map);
 });
```


Finally, when your mouse moves out of the geometry, you want to close the popup:
```js
map.on('mouseleave', 'affHousing', function() {
map.getCanvas().style.cursor = '';
popup.remove();
});
```

# 2. In-Class Exercise
Just finish 1.1, 1.2, and 1.3 and push it to Github.

#### Extra credit: Pitch and bearings
We did not talk about pitch and bearings! When creating your `map` object, try adding a pitch and bearing:
```js
const map = new mapboxgl.Map({...
    pitch: INSERTNUMBER,
    bearing: INSERTNUMBER,
    ...
  })
```
Extra credit is if you can create button that will "fly" you into a particular neighborhood to around zoom 16, while changing the pitch and bearing from your original map. Hint: look through Mapbox's excellent tutorials. 
