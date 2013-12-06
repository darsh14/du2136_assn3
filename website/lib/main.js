var _isDown, _points, _r, _g, _rc;
function onLoadEvent()
{
	_points = new Array();
	_r = new DollarRecognizer();

	var canvas = document.getElementById('myCanvas');
	_g = canvas.getContext('2d');
	_g.fillStyle = "rgb(255,255,255)";
	_g.strokeStyle = "rgb(255,255,255)";
	_g.lineWidth = 3;
	_g.font = "16px Gentilis";
	_rc = getCanvasRect(canvas); // canvas rect on page
	// _g.fillStyle = "rgb(255,255,136)";
	_g.fillStyle = "rgb(0,0,0)";
	_g.fillRect(0, 0, _rc.width, 20);

	_isDown = false;
}
function getCanvasRect(canvas)
{
	var w = canvas.width;
	var h = canvas.height;

	var cx = canvas.offsetLeft;
	var cy = canvas.offsetTop;
	while (canvas.offsetParent != null)
	{
		canvas = canvas.offsetParent;
		cx += canvas.offsetLeft;
		cy += canvas.offsetTop;
	}
	return {x: cx, y: cy, width: w, height: h};
}
function getScrollY()
{
	var scrollY = 0;
	if (typeof(document.body.parentElement) != 'undefined')
	{
		scrollY = document.body.parentElement.scrollTop; // IE
	}
	else if (typeof(window.pageYOffset) != 'undefined')
	{
		scrollY = window.pageYOffset; // FF
	}
	return scrollY;
}
//
// Mouse Events
//
function mouseDownEvent(x, y)
{
	document.onselectstart = function() { return false; } // disable drag-select
	document.onmousedown = function() { return false; } // disable drag-select
	_isDown = true;
	x -= _rc.x;
	y -= _rc.y - getScrollY();
	if (_points.length > 0)
		_g.clearRect(0, 0, _rc.width, _rc.height);
	_points.length = 1; // clear
	_points[0] = new Point(x, y);
	// drawText("Recording unistroke...");
	_g.fillRect(x - 4, y - 3, 9, 9);
}
function mouseMoveEvent(x, y)
{
	if (_isDown)
	{
		x -= _rc.x;
		y -= _rc.y - getScrollY();
		_points[_points.length] = new Point(x, y); // append
		drawConnectedPoint(_points.length - 2, _points.length - 1);
	}
}
function mouseUpEvent(x, y)
{
	document.onselectstart = function() { return true; } // enable drag-select
	document.onmousedown = function() { return true; } // enable drag-select
	if (_isDown)
	{
		_isDown = false;
		if (_points.length >= 10)
		{
			// var result = _r.Recognize(_points, document.getElementById('useProtractor').checked);
			var result = _r.Recognize(_points, true);
			//drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
			//match results

			if(result.Name == "play_pause")
			{
				if(player.paused)	
				{
					$.jGrowl("Play");
					player.play();
				}
				else
				{				
					$.jGrowl("Pause");
					player.pause();
				}
			}

			else if(result.Name == "mute")
			{
				if(player.muted)
				{
					$.jGrowl("Un-Mute");
					player.muted = false;
				}
				else
				{
					$.jGrowl("Mute");
					player.muted = true;
				}
			}
			
			else if(result.Name == "volume_down")
			{
				if(player.volume == 0)
				{
					$.jGrowl("Minimum Volume");
				}
				else
				{
					$.jGrowl("Volume Decreased");
					player.volume -= 0.1;
				}
			}	

			else if(result.Name == "volume_up")
			{
				if(player.volume == 1)
				{
					$.jGrowl("Maximum Volume");
				}
				else
				{
					$.jGrowl("Volume Increased");
					player.volume += 0.1;
				}
			}

			else if(result.Name == "seek_front")
			{
				$.jGrowl("Scrub Forward");
				player.currentTime += 10;
			}

			else if(result.Name == "seek_back")
			{
				$.jGrowl("Scrub Backward");
				player.currentTime -= 10;
				
			}

			else if(result.Name == "video_size")
			{
				console.log(player.width);
				if(player.width == 800)
				{
					$.jGrowl("Large Video Size");
					player.width = 900;
					player.height = 800;
					$("#video").css({'top':'-135px'});
				} 
				else if(player.width == 900)
				{
					$.jGrowl("Small Video Size");
					player.width = 700;
					player.height = 600;
					$("#video").css({'top':'-80px'});
				} 
				else if(player.width == 700)
				{
					$.jGrowl("Medium Video Size");
					player.width = 800;
					player.height = 700;
					$("#video").css({'top':'-100px'});
				} 
			}

			else if(result.Name == "slow")
			{
				$.jGrowl("Slow Down Playback Rate");
				player.playbackRate -= 0.1;
			}

			else if(result.Name == "fast")
			{
				$.jGrowl("Speed Up Playback Rate");
				player.playbackRate += 0.1;
			}

			else
			{
				$.jGrowl("Gesture Unrecognized. Please Try Again!");
			}

		}
		else // fewer than 10 points were inputted
		{
			drawText("Too few points made. Please try again.");
		}
	}
}
function drawText(str)
{
	_g.fillStyle = "rgb(0,0,0)";
	_g.fillRect(0, 0, _rc.width, 20);
	_g.fillStyle = "rgb(0,0,0)";
	_g.fillText(str, 1, 14);
}
function drawConnectedPoint(from, to)
{
	_g.beginPath();
	_g.moveTo(_points[from].X, _points[from].Y);
	_g.lineTo(_points[to].X, _points[to].Y);
	_g.closePath();
	_g.stroke();
}
function round(n, d) // round 'n' to 'd' decimals
{
	d = Math.pow(10, d);
	return Math.round(n * d) / d
}

$(document).ready(function () {
	var player=document.getElementById("player"); 
	onLoadEvent();
	var window_width = $(window).width()/2;
	var window_height = $(window).height()/2;
	player.width = 800;
	player.height = 600;

	$.vegas('overlay', {
	  src:'lib/vegas/overlays/02.png'
	});

	$("a#help")[0].click();

	// $('html, body').css({
	//     'overflow': 'hidden',
	//     'height': '100%'
	// });

	$("#icon_gestures img[title]").tooltip();

	$("#clear").click(function() {
		var canvas = document.getElementById('myCanvas');
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

	});

	$("div#icon_gestures img").hover(function() {
		var id=$(this).attr('id');
		console.log($("#myCanvas").position().left+" "+$("#myCanvas").position().top);

		$("div#gifs #"+id).css({'top':$("#myCanvas").position().top,'left':$("#myCanvas").position().left});
		$("div#gifs #"+id).show();

			},
	function () {
    	var id=$(this).attr('id');
		$("div#gifs #"+id).hide();
  	});

  	$("#help,#contact").hover(function() {
  		$(this).css({
  			'background-color':'#D8D8D8',
  			'border-radius':'10px',
  			'cursor':'pointer'
  		});
  	},function() {
  		$(this).css({
  			'background-color':'',
  			'border-radius':'',
  			'cursor':''
  		});
  	});
});