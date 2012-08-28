var cfg = ($.hoverintent = {
	sensitivity: 7,
	interval: 50
});




var fdg = function(jsonpath, chart, size, minsim){
    d3.json(jsonpath, function(json) {
      json.links = json.links.filter(function(d, index, array){
        //alert(d.value);
        return d.value >= minsim;
      });
        
      var w = size,
          h = size,
          fill = function(group){
            if (group == 0) return "#0064cd";
            if (group == 1) return "#c43c35";
            return "#111111";
          };
    
      var vis = d3.select(chart).append("svg")
         .attr("width", w)
         .attr("height", h);
         
      var force = d3.layout.force()
          .charge(-size/8)
          //.linkDistance(size/20)
          .linkDistance(function(link, index){return 1/link.value;})
          .linkStrength(function(link){return link.value/16+0.2;})
          .nodes(json.nodes)
          .links(json.links)
          .size([w, h])
          .start();
    
      var link = vis.selectAll("line.link")
          .data(json.links)
        .enter().append("line")
          .attr("class", "link")
          .style("stroke", "grey")
          .style("stroke-width", function(d) { return Math.sqrt(d.value)*10; })
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    
      var node = vis.selectAll("circle.node")
          .data(json.nodes)
          .enter().append("circle")
          .attr("class", "node")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r",  function(d) { return d.r/(d.strokewidth/1.5+d.r)*13*size/800; })
          .style("fill", function(d) { return d.fill; })
          .style("stroke", function(d) { 
                // Fix for 0-width problem with chrome
                if (d.strokewidth <= 1e-3) return "#EEEEEE";
                return d.stroke; 
                })
          .style("stroke-width", function(d) { 
                if (d.strokewidth == 0) return 1e-4;
                return d.strokewidth/(d.strokewidth/1.5+d.r)*8*size/800; })
          .call(force.drag)
          .on("click", function(d){ window.location.href=d.url;});
    
      node.append("title")
          .text(function(d) { return d.name; });
    
      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    
        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      });
    });
};

$.event.special.hoverintent = {
	setup: function() {
		$( this ).bind( "mouseover", jQuery.event.special.hoverintent.handler );
	},
	teardown: function() {
		$( this ).unbind( "mouseover", jQuery.event.special.hoverintent.handler );
	},
	handler: function( event ) {
		event.type = "hoverintent";
		var self = this,
			args = arguments,
			target = $( event.target ),
			cX, cY, pX, pY;
		
		function track( event ) {
			cX = event.pageX;
			cY = event.pageY;
		};
		pX = event.pageX;
		pY = event.pageY;
		function clear() {
			target
				.unbind( "mousemove", track )
				.unbind( "mouseout", arguments.callee );
			clearTimeout( timeout );
		}
		function handler() {
			if ( ( Math.abs( pX - cX ) + Math.abs( pY - cY ) ) < cfg.sensitivity ) {
				clear();
				jQuery.event.handle.apply( self, args );
			} else {
				pX = cX;
				pY = cY;
				timeout = setTimeout( handler, cfg.interval );
			}
		}
		var timeout = setTimeout( handler, cfg.interval );
		target.mousemove( track ).mouseout( clear );
		return true;
	}
};
var wait=function (){
    $('#modal-wait').modal({keyboard:true,backdrop:'static'});
    $('#modal-wait').modal('show');
};
