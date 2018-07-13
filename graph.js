/**
 *  Graphene Math Graphing Library
 *  @author Una Ada (Trewbot) <trewbot@phene.co>
 */

//  Check for Graphene namespace
if(typeof Graphene!=='object'){
	var Graphene = new(function(){
		this.url = 'http://gra.phene.co';
	})(),
		_g = Graphene;
}

_g.g = (_g.graph = {
    render(ctx,f,options){
        const
            AXIS_WIDTH      = options.axisWidth     || 1,
            AXIS_COLOR      = options.axisColor     || "#333",
            AXIS_RANGE_X    = options.axisRangeX    || [-50,50],
            AXIS_RANGE_Y    = options.axisRangeY    || [-20,20],
            TICK_LENGTH		= options.tickLength    || 10,
            TICK_WIDTH      = options.tickWidth     || AXIS_WIDTH,
            TICK_COLOR      = options.tickColor     || AXIS_COLOR,
            TICK_COUNT_X    = options.tickCountX    || 100,
            TICK_COUNT_Y    = options.tickCountY    || 40,
            EXTEND_LENGTH	= options.extendLength  || 13,
            EXTEND_RATE		= options.extendRate    || 5,
            EXTEND_RATE_X   = options.extendRateX   || EXTEND_RATE,
            EXTEND_RATE_Y   = options.extendRateY   || EXTEND_RATE,
            LABEL_RATE		= options.labelRate     || 10,
            LABEL_RATE_X    = options.labelRateX    || LABEL_RATE,
            LABEL_RATE_Y	= options.labelRateY    || LABEL_RATE,
            LABEL_FONT      = options.labelFont     || "13pt sans-serif",
            LABEL_COLOR     = options.labelColor    || TICK_COLOR,
            LABEL_RANGE_X   = AXIS_RANGE_X[0]-AXIS_RANGE_X[1],
            LABEL_RANGE_Y   = AXIS_RANGE_Y[0]-AXIS_RANGE_Y[1],
            ROUNDING        = options.labelRounding || 2,
            FUNC_WIDTH      = options.width         || 2,
            FUNC_COLOR      = options.color         || "#f00",
            PADDING         = options.padding       || 0,
            PADDING_LEFT    = options.paddingLeft   || PADDING,
            PADDING_TOP     = options.paddingTop    || PADDING;
        var SAMPLES         = options.samples       || 6,
            SAMPLE_SIZE     = options.sampleSize    || 0.3,
            origin          = {
                x:1-(AXIS_RANGE_X[1]/(AXIS_RANGE_X[1]-AXIS_RANGE_X[0])),
                y:1-(AXIS_RANGE_Y[1]/(AXIS_RANGE_Y[1]-AXIS_RANGE_Y[0]))
            };
        function draw(origin){
            //	Calculate Positions
            var width  = ctx.canvas.width -(2*PADDING_LEFT),
                height = ctx.canvas.height-(2*PADDING_TOP),
                left   = PADDING_LEFT+0.5,
                top    = PADDING_TOP +0.5;
                scaleY = y=>height*((-y/LABEL_RANGE_Y)+origin.y)+top,
                scaleX = x=>width*((x/LABEL_RANGE_X)+origin.x)+left,
                invY   = y=>(origin.y-(y-top)/height)*LABEL_RANGE_Y,
                invX   = x=>(origin.x-(x-left)/width)*LABEL_RANGE_X;
            //  based on
            //  https://gist.github.com/biovisualize/5400576
            //  http://blog.hvidtfeldts.net/index.php/ ...
            //  ... 2011/07/plotting-high-frequency-functions-using-a-gpu/
            var img  = ctx.getImageData(0,0,width,height),
                buf  = new ArrayBuffer(img.data.length),
                buf8 = new Uint8ClampedArray(buf),
                data = new Uint32Array(buf),
                samsq = SAMPLES**2;
            for(let y=0;y<height;++y)
            for(let x=0;x<width;++x){
                let count = 0,
                    hs = SAMPLES/2;
            	for(let i=-hs;i<hs;++i)
        		for(let j=-hs;j<hs;++j){
        			let v = f(invX(x+i*SAMPLE_SIZE))-invY(y+j*SAMPLE_SIZE);
        			count+= v>0?1:-1;
        		}
                let a = (Math.abs(count)/samsq)*255;
                //let a = count>0?255:0;
                data[y*width+x] =
                    (255<<24)|// alpha
                    (a  <<16)|// blue
                    (a  << 8)|// green
                    (255<< 0);// red
            }
            img.data.set(buf8);
            ctx.putImageData(img,PADDING_LEFT,PADDING_TOP);
            //	Draw Axes
            ctx.lineWidth       = AXIS_WIDTH;
            ctx.strokeStyle     = AXIS_COLOR;
            //  y-axis
            ctx.beginPath();
            ctx.moveTo(left+~~(width*origin.x),top-0.5);
            ctx.lineTo(left+~~(width*origin.x),top+height);
            ctx.stroke();
            //  x-axis
            ctx.beginPath();
            ctx.moveTo(left-0.5,  top+~~(height*origin.y));
            ctx.lineTo(left+width,top+~~(height*origin.y));
            ctx.stroke();
            ctx.lineWidth       = TICK_WIDTH;
            ctx.strokeStyle     = TICK_COLOR;
            ctx.font 			= LABEL_FONT;
            ctx.textAlign		= "center";
            ctx.textBaseline	= "top";
            ctx.fillStyle		= LABEL_COLOR;
            //	Draw x-axis Ticks
            var xTick = i=>{
                //  Draw tick
                ctx.beginPath();
                let x = ~~((width/TICK_COUNT_X)*i)+left+~~(width*origin.x);
                ctx.moveTo(x,0.5+top+~~(height*origin.y));
                ctx.lineTo(x,0.5+top+~~(height*origin.y)+(
                    i%EXTEND_RATE_X==0?EXTEND_LENGTH:TICK_LENGTH
                ));
                ctx.stroke();
                //	Write label
                if((i%LABEL_RATE_X==0||TICK_COUNT_X<LABEL_RATE_X)&&i!=0)
                    ctx.fillText(
                        (~~((i/TICK_COUNT_X)*LABEL_RANGE_X*(10**ROUNDING)))
                            /(10**ROUNDING),
                        x,top+(height*origin.y)+EXTEND_LENGTH+1);
            };
            for(let i=0;i<=TICK_COUNT_X*(1-origin.x);i++) xTick(i);
            for(let i=0;i>=-1*TICK_COUNT_X*origin.x; i--) xTick(i);
            //	Draw y-axis Ticks
            ctx.textAlign		= "right";
            ctx.textBaseline	= "middle";
            var yTick = i=>{
                // Draw tick
                ctx.beginPath();
                let y = ~~((height/TICK_COUNT_Y)*i)+top+~~(height*origin.y);
                ctx.moveTo(0.5+left+~~(width*origin.x),y);
                ctx.lineTo(0.5+left+~~(width*origin.x)-(
                    i%EXTEND_RATE_Y==0?EXTEND_LENGTH:TICK_LENGTH
                ),y);
                ctx.stroke();
                //	Write label
                if((i%LABEL_RATE_Y==0||TICK_COUNT_Y<LABEL_RATE_Y)&&i!=0)
                    ctx.fillText(
                        (~~((-1*i/TICK_COUNT_Y)*LABEL_RANGE_Y*(10**ROUNDING)))
                            /(10**ROUNDING),
                        left+(width*origin.x)-EXTEND_LENGTH-1,y);
            }
            for(let i=0;i<=TICK_COUNT_Y*(1-origin.y);i++) yTick(i);
            for(let i=0;i>=-1*TICK_COUNT_Y*origin.y; i--) yTick(i);
        }
        window.graph_drag_active = false;
        window.graph_drag_origin = origin;
        ctx.canvas.addEventListener("mousedown",e=>{
            window.graph_drag_position = {x:e.pageX,y:e.pageY};
            window.graph_drag_active = true;
            window.graph_drag_temp = [SAMPLES,SAMPLE_SIZE];
            SAMPLES = 2;
            SAMPLE_SIZE = 1;
        });
        ctx.canvas.addEventListener("mousemove",e=>{
            if(graph_drag_active){
                var rect = ctx.canvas.getBoundingClientRect(),
                    dx = (e.pageX - graph_drag_position.x)/rect.width,
                    dy = (e.pageY - graph_drag_position.y)/rect.height;
                draw({
                    x:graph_drag_origin.x + dx,
                    y:graph_drag_origin.y + dy
                });
            }
        });
        ctx.canvas.addEventListener("mouseup",e=>{
            if(graph_drag_active){
                var rect = ctx.canvas.getBoundingClientRect(),
                    dx = (e.pageX - graph_drag_position.x)/rect.width,
                    dy = (e.pageY - graph_drag_position.y)/rect.height;
                window.graph_drag_origin = {
                    x:graph_drag_origin.x + dx,
                    y:graph_drag_origin.y + dy
                };
                SAMPLES = graph_drag_temp[0];
                SAMPLE_SIZE = graph_drag_temp[1];
                draw(graph_drag_origin);
                window.graph_drag_active = false;
            }
        });
        draw(origin);
        return ctx;
    },
changes: [
    ["g0.1.0.0001","Jul 12, 2018","Initial"],
    ["g0.1.0.0002","Jul 13, 2018","Shifted axes to origin point."],
    ["g0.1.0.0003","Jul 13, 2018","Set ticks to start at axes"],
    ["g0.1.0.0004","Jul 13, 2018","Fixed non-centered axis ticks"],
    ["g0.1.0.0005","Jul 13, 2018","Replaced origin opt with axis range"],
    ["g0.1.0.0006","Jul 13, 2018","Fixed axis range rendering"],
    ["g0.1.0.0007","Jul 13, 2018","Cleanup"],
    ["g0.1.0.0008","Jul 13, 2018","Cleanup"],
    ["g0.1.0.0009","Jul 13, 2018","Added function rendering"],
    ["g0.1.0.0010","Jul 13, 2018","Added label rounding"],
    ["g0.1.0.0011","Jul 13, 2018","Added separate x- and y-axis options"],
    ["g0.1.0.0012","Jul 13, 2018","Changed function rending to pixel based"],
    ["g0.1.0.0013","Jul 13, 2018","Removed transparency in rendering"],
    ["g0.1.0.0014","Jul 13, 2018","Adjusted default sampling"],
    ["g0.1.0.0015","Jul 13, 2018","Added mouse dragging"],
    ["g0.1.0.0016","Jul 13, 2018","Cleanup/optimization"]
]
});
