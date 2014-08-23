(function (width, version) {
	// Configuration constants
	var config = {
		width: 400,																					// Canvas width/height
		version: 'V1.0',
		errorPrecision: 5,																	// Decimal precision for display
		quantity: 10000,
		inside: 0,																					// Pixel count inside circle
		total: 0																						// Pixel count total
	};
	config.half = config.width >> 1;											// Half canvas size

	// These functions are called once when the page loads
	// Draw the circle inscribed inside the canvas square area
	function drawCircle(context) {
		context.beginPath();
		context.arc(config.half, config.half, config.half, 0, 2*Math.PI);
		context.stroke();
	}

	// Create the pixel image object
	function createPixelImageData(context) {
		var id = context.createImageData(1, 1);
		var d = id.data;
		d[3] = 255;
		return id;
	}

	// Draw config.quantity pixels on canvas
	function drawPixels() {
		for (var i = 0; i<config.quantity; i++) {
			var coord = drawPixel(config.context, config.id, selectPixel(config.width));
			if (insideCircle(coord)) {
				config.inside++;
			}
			config.total++;
		}
		$('.hide-on-start').show();		
	}

	// Draw a dot on the canvas
	// width: width of canvas (x and y since it's a square)
	function selectPixel(width) {
		var x = Math.floor(Math.random() * width);
		var y = Math.floor(Math.random() * width);
		return {x: x, y: y};
	}

	// Draw the pixel on the page
	// context: canvas context
	// id: pixel image data
	// coord: coordinate to place pixel (.x, .y)
	function drawPixel(context, id, coord) {
		context.putImageData(id, coord.x, coord.y);		
		return coord;
	}

	// Is the coordinate inside the circle?
	function insideCircle(coord) {
		var _x = coord.x - config.half;
		var _y = coord.y - config.half;
		var dx = _x*_x + _y*_y;
		return (dx <= config.half * config.half);
	}

	// Compute the estimate of pi using the ratio of pixels inside and 
	// the total number of pixels
	function computeEstimate(inside, total) {
		config.estimate = config.inside / config.total * 4;
		config.error = ((config.estimate - Math.PI) / Math.PI * 100.0).toFixed(5);
	}

	// Update all the display fields
	function updateDisplay() {
		$('#insideCount').text(config.inside);
		$('#totalCount').text(config.total);
		$('#estimate').text((config.estimate).toFixed(config.errorPrecision));
		$('#error').text(((config.estimate - Math.PI) / Math.PI * 100.0).toFixed(config.errorPrecision));
	}

	$(document).ready(function () {
		config.canvas = document.getElementById('canvas');	// Canvas object
		config.context = config.canvas.getContext('2d');		// Context to canvas object
		config.fillStyle = '#000000';												// Black fill
		config.strokeStyle = "#FF0000";											// Red line (for circle)
		config.lineWidth = 3;																// Line width
		config.context.fillStyle = config.fillStyle;				// Set context values
		config.context.strokeStyle = config.strokeStyle;
		config.context.lineWidth = config.lineWidth;

		config.id = createPixelImageData(config.context);		// Create pixel object
		drawCircle(config.context);													// Draw the circle

		// Display static values
		$('#actual').text(Math.PI.toFixed(config.errorPrecision));
		$('.version').text(config.version);
		$('.qty').text(config.quantity);

		// Button click handler
		$('button').click(function () {
			drawPixels();
			computeEstimate();
			updateDisplay();
		});
	});

})();