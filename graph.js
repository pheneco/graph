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
            SAMPLES         = options.samples       || 3,
            SAMPLE_SIZE     = options.sampleSize    || 0.5,
            PADDING         = options.padding       || 0,
            PADDING_LEFT    = options.paddingLeft   || PADDING,
            PADDING_TOP     = options.paddingTop    || PADDING,
            ORIGIN          = {
                x:1-(AXIS_RANGE_X[1]/(AXIS_RANGE_X[1]-AXIS_RANGE_X[0])),
                y:1-(AXIS_RANGE_Y[1]/(AXIS_RANGE_Y[1]-AXIS_RANGE_Y[0]))
            };
        //	Calculate Positions
        var width  = ctx.canvas.width -(2*PADDING_LEFT),
            height = ctx.canvas.height-(2*PADDING_TOP),
            left   = PADDING_LEFT+0.5,
            top    = PADDING_TOP +0.5;
            scaleY = y=>(-1*y*(height/LABEL_RANGE_Y))+top+~~(height*ORIGIN.y),
            scaleX = x=>(x*(width/LABEL_RANGE_X))+left+~~(width*ORIGIN.x),
            invY   = y=>(((height*ORIGIN.y-y-top))*(LABEL_RANGE_Y/height)),
            invX   = x=>(((width*ORIGIN.x-x-left))*(LABEL_RANGE_X/width));
        //  based on
        //  https://gist.github.com/biovisualize/5400576
        //  http://blog.hvidtfeldts.net/index.php/ ...
        //  ... 2011/07/plotting-high-frequency-functions-using-a-gpu/
        var img  = ctx.getImageData(0,0,width,height),
            buf  = new ArrayBuffer(img.data.length),
            buf8 = new Uint8ClampedArray(buf),
            data = new Uint32Array(buf);
        for(let y=0;y<height;++y)
            for(let x=0;x<width;++x){
                let count  = 0,
                    samples = 0;
            	for(let i=0;i<SAMPLES;i++)
            		for(let j=0;j<SAMPLES;j++){
            			if (i*i+j*j>SAMPLES**2) continue;
            			samples++;
            			let val = f(invX(x+i*SAMPLE_SIZE))-invY(y+j*SAMPLE_SIZE);
            			count += val>0?1:-1;
            		}
                let a = (Math.abs(count)/(SAMPLES**2))*255;
                //let a = count>0?255:0;
                if(!(x%100)&&!(y%100))console.log(a)
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
        ctx.moveTo(left+~~(width*ORIGIN.x),top-0.5);
        ctx.lineTo(left+~~(width*ORIGIN.x),top+height);
        ctx.stroke();
        //  x-axis
        ctx.beginPath();
        ctx.moveTo(left-0.5,  top+~~(height*ORIGIN.y));
        ctx.lineTo(left+width,top+~~(height*ORIGIN.y));
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
            let x = ~~((width/TICK_COUNT_X)*i)+left+~~(width*ORIGIN.x);
            ctx.moveTo(x,0.5+top+~~(height*ORIGIN.y));
            ctx.lineTo(x,0.5+top+~~(height*ORIGIN.y)+(
                i%EXTEND_RATE_X==0?EXTEND_LENGTH:TICK_LENGTH
            ));
            ctx.stroke();
            //	Write label
            if((i%LABEL_RATE_X==0||TICK_COUNT_X<LABEL_RATE_X)&&i!=0)
                ctx.fillText(
                    (~~((i/TICK_COUNT_X)*LABEL_RANGE_X*(10**ROUNDING)))
                        /(10**ROUNDING),
                    x,top+(height*ORIGIN.y)+EXTEND_LENGTH+1);
        };
        for(let i=0;i<=TICK_COUNT_X*(1-ORIGIN.x);i++) xTick(i);
        for(let i=0;i>=-1*TICK_COUNT_X*ORIGIN.x; i--) xTick(i);
        //	Draw y-axis Ticks
        ctx.textAlign		= "right";
        ctx.textBaseline	= "middle";
        var yTick = i=>{
            // Draw tick
            ctx.beginPath();
            let y = ~~((height/TICK_COUNT_Y)*i)+top+~~(height*ORIGIN.y);
            ctx.moveTo(0.5+left+~~(width*ORIGIN.x),y);
            ctx.lineTo(0.5+left+~~(width*ORIGIN.x)-(
                i%EXTEND_RATE_Y==0?EXTEND_LENGTH:TICK_LENGTH
            ),y);
            ctx.stroke();
            //	Write label
            if((i%LABEL_RATE_Y==0||TICK_COUNT_Y<LABEL_RATE_Y)&&i!=0)
                ctx.fillText(
                    (~~((-1*i/TICK_COUNT_Y)*LABEL_RANGE_Y*(10**ROUNDING)))
                        /(10**ROUNDING),
                    left+(width*ORIGIN.x)-EXTEND_LENGTH-1,y);
        }
        for(let i=0;i<=TICK_COUNT_Y*(1-ORIGIN.y);i++) yTick(i);
        for(let i=0;i>=-1*TICK_COUNT_Y*ORIGIN.y; i--) yTick(i);
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
        ["g0.1.0.0013","Jul 13, 2018","Removed transparency in rendering"]
    ]
});
