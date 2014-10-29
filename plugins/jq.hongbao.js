(function($){
	$.fn.redbay = function(options){
			var _this			= $(this);
			var $flake 			= $('<div class="redbayfall" />').css({'position': 'absolute', 'top': '-50px'}),
				boxHeight 	= _this.height(),
				boxWidth	= _this.width(),
				defaults		= {
									newOn		: 2000,		//红包出现的频率
									speed		:5,			//红包下落的速度
									isStop		:false
								},
				options			= $.extend({}, defaults, options);
			var interval		= setInterval(roll= function(){
				var startPositionLeft 	= Math.random() * boxWidth-80,
					endPositionTop		= boxHeight - 40,
					transformangle		= 30*(1-Math.random()*2),
					durationFall		= boxHeight * options.speed + Math.random() * 3000;
				$flake.clone().appendTo(_this).css({
							left: startPositionLeft,
							transform:'rotate('+transformangle+'deg)'
						}).animate({
							top: endPositionTop,
							opacity: 0.6
						},durationFall,'linear',function(){
							$(this).remove()
						});
					
			}, options.newOn);
			function stop(){
				clearInterval(interval);
			}
			function redbaycontinue(){
				interval=setInterval(roll,options.newOn);
			}
			return {redbaystop:stop,redbaycontinue:redbaycontinue}

	};
	
})(jQuery);