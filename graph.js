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
            TICK_LENGTH		= 10,
            EXTEND_LENGTH	= 13,
            EXTEND_RATE		= 5,
            LABEL_RATE		= 10;
        function loadAxes(ctx, ticks=[100,4], labelMax=[100,1]){
            //	Calculate Positions
            var width	= 500 * ~~((window.innerWidth - 60) / 500),
                height  = 300,
                left	= ~~((window.innerWidth - width) / 2) + 30.5,
                top     = ~~(window.innerHeight / 2) - 170 + 0.5;

            //	Draw Axes
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#333";
            ctx.beginPath();
            ctx.moveTo(left, top - 0.5);
            ctx.lineTo(left, top + height);
            ctx.lineTo(left + width + 0.5, top + height);
            ctx.stroke();

            ctx.font 			= "13pt 'Roboto'";
            ctx.textAlign		= "center";
            ctx.textBaseline	= "top";
            ctx.fillStyle		= "#333";

            //	Draw x-axis Ticks
            for(let i = 0; i <= ticks[0]; i++){
                ctx.beginPath();
                let x = ~~((width / ticks[0]) * i) + left;
                ctx.moveTo(x, 0.5 + top + height);
                ctx.lineTo(x, 0.5 + top + height + (
                    i % EXTEND_RATE == 0 ? EXTEND_LENGTH : TICK_LENGTH
                ));
                ctx.stroke();

                //	Write Tick Labels
                if(i % LABEL_RATE == 0 || ticks[0] < LABEL_RATE)
                    ctx.fillText((i / ticks[0]) * labelMax[0], x,
                        top + height + EXTEND_LENGTH + 1);
            }

            ctx.textAlign		= "right";
            ctx.textBaseline	= "middle";

            //	Draw y-axis Ticks
            for(let i = 0; i <= ticks[1]; i++){
                ctx.beginPath();
                let y = ~~((height / ticks[1]) * i) + top;
                ctx.moveTo(0.5 + left, y);
                ctx.lineTo(0.5 + left - (
                    i % EXTEND_RATE == 0 ? EXTEND_LENGTH : TICK_LENGTH
                ), y);
                ctx.stroke();

                //	Write Tick Labels
                if(i % LABEL_RATE == 0 || ticks[1] < LABEL_RATE)
                    ctx.fillText(
                        ~~(((ticks[1]-i)/ticks[1])*labelMax[1]*1e4)/100+"%",
                        left - EXTEND_LENGTH - 1, y);
            }
            return {
                "height" : height,
                "left"   : left,
                "top"    : top,
                "width"  : width
            };
        }
        loadAxes(ctx);
    },
    changes: [
        ["g0.1.0.0001","Jul 12, 2018","Initial"]
    ]
});
