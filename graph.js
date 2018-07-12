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
        // TODO: Entire Library
    },
    changes: [
        ["g0.1.0.0001","Jul 12, 2018","Initial"]
    ]
});
