mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtd2Z4IiwiYSI6ImNqNGFnMnIyMzEwZzgycXJ1ODdqbG14eGMifQ.3AqBqXZlcbsbEhxddAPB-g';

const map = new mapboxgl.Map({
  container: 'wenfei', // container id
  style: 'mapbox://styles/iamwfx/ckh275yks01ri19mtotvwgwak', // replace this with your style URL
  center: [-122.42285, 37.76869],
  zoom: 13,
  pitch: 30.00,
  bearing: 0.00,
  minZoom: 13

});

map.on('load', function () {
	// console.log("whatever");

	map.addSource('restaurantSource',{
        'type':'vector',
        'url': 'mapbox://iamwfx.7qrsi9jj'
      });

	map.addLayer({
        'id':'restaurantLayer',
        'type':'circle',
        'source':'restaurantSource',
        'source-layer':'Restaurant_Scores_-_LIVES_Sta-3hd45t',
        'paint':{
			'circle-opacity': 0.3,
			'circle-color':
				['step',
					['to-number', ['get', 'inspection_score']],
					'#aaaaaa',  
					45, '#440154',  // (45 - 80)
					80, '#3b528b',  // (80 - 85)
					85, '#21908d',  // (85 - 90)
					90, '#5dc963',  // (90 - 95)
					95, '#fde725'   // (95 - 100)
					]
        }
  })

	map.on('mouseenter', 'restaurantLayer', (e) => {
        // console.log(e.features[0]['properties']['business_name']);
        var name = e.features[0]['properties']['business_name'];
        var textField = document.getElementById('restText');
        textField.innerHTML = name;

    })


})