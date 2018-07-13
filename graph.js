/**
 *  Graphene Math Graphing Library
 *  @author Una Ada (Trewbot) <trewbot@phene.co>
 */

//  Check for Graphene namespace
if(typeof Graphene !== 'object') {
	var Graphene = new(function () {
		this.url = 'http://gra.phene.co';
	})(),
		_g = Graphene;
}

_g.g = (_g.graph = {
    render(ctx, f, options){
        const
            AXIS_WIDTH      = options.axisWidth     || 1,
            AXIS_COLOR      = options.axisColor     || "#333",
            TICK_LENGTH		= options.tickLength    || 10,
            TICK_WIDTH      = options.tickWidth     || AXIS_WIDTH,
            TICK_COLOR      = options.tickColor     || AXIS_COLOR,
            EXTEND_LENGTH	= options.extendLength  || 13,
            EXTEND_RATE		= options.extendRate    || 5,
            LABEL_RATE		= options.labelRate     || 10,
            LABEL_FONT      = options.labelFont     || "13pt 'Roboto'",
            LABEL_COLOR     = options.labelColor    || TICK_COLOR,
            PADDING         = options.padding       || 0,
            PADDING_LEFT    = options.paddingLeft   || PADDING,
            PADDING_TOP     = options.paddingTop    || PADDING,
            ORIGIN          = options.origin        || {x:0.5,y:0.5};
        function loadAxes(ctx, ticks=[100,4], labelMax=[100,1]){
            //	Calculate Positions
                var width	= ctx.canvas.width  - (2*PADDING_LEFT),
                    height  = ctx.canvas.height - (2*PADDING_TOP),
                    left	= PADDING_LEFT + 0.5,
                    top     = PADDING_TOP  + 0.5;
            //	Draw Axes
            ctx.lineWidth       = AXIS_WIDTH;
            ctx.strokeStyle     = AXIS_COLOR;
            //  y-axis
            ctx.beginPath();
            ctx.moveTo(left + (width*ORIGIN.x), top - 0.5);
            ctx.lineTo(left + (width*ORIGIN.x), top + height);
            ctx.stroke();
            //  x-axis
            ctx.beginPath();
            ctx.moveTo(left - 0.5,   top + (height*ORIGIN.y));
            ctx.lineTo(left + width, top + (height*ORIGIN.y));
            ctx.stroke();
            ctx.lineWidth       = TICK_WIDTH;
            ctx.strokeStyle     = TICK_COLOR;
            ctx.font 			= LABEL_FONT;
            ctx.textAlign		= "center";
            ctx.textBaseline	= "top";
            ctx.fillStyle		= LABEL_COLOR;
            //	Draw x-axis ticks
            for(let i = 0; i <= ticks[0]; i++){
                //  Draw tick
                ctx.beginPath();
                let x = ~~((width / ticks[0]) * i) + left;
                ctx.moveTo(x, 0.5 + top + (height*ORIGIN.y));
                ctx.lineTo(x, 0.5 + top + (height*ORIGIN.y) + (
                    i % EXTEND_RATE == 0 ? EXTEND_LENGTH : TICK_LENGTH
                ));
                ctx.stroke();
                //	Write labels
                if(i % LABEL_RATE == 0 || ticks[0] < LABEL_RATE)
                    ctx.fillText((i / ticks[0]) * labelMax[0], x,
                        top + (height*ORIGIN.y) + EXTEND_LENGTH + 1);
            }
            ctx.textAlign		= "right";
            ctx.textBaseline	= "middle";
            //	Draw y-axis Ticks
            for(let i = 0; i <= ticks[1]; i++){
                ctx.beginPath();
                let y = ~~((height / ticks[1]) * i) + top;
                ctx.moveTo(0.5 + left + (width*ORIGIN.x), y);
                ctx.lineTo(0.5 + left + (width*ORIGIN.x) - (
                    i % EXTEND_RATE == 0 ? EXTEND_LENGTH : TICK_LENGTH
                ), y);
                ctx.stroke();
                //	Write Tick Labels
                if(i % LABEL_RATE == 0 || ticks[1] < LABEL_RATE)
                    ctx.fillText(
                        ~~(((ticks[1]-i)/ticks[1])*labelMax[1]*1e4)/100+"%",
                        left + (width*ORIGIN.x) - EXTEND_LENGTH - 1, y);
            }
            return {
                "height" : height,
                "left"   : left,
                "top"    : top,
                "width"  : width
            };
        }
        loadAxes(ctx);
        console.log(ctx);
    },
    changes: [
        ["g0.1.0.0001","Jul 12, 2018","Initial"],
        ["g0.1.0.0002","Jul 13, 2018","Shifted axes to origin point."]
    ]
});
