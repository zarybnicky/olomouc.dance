var state = require('../state');
var api = require('../api');
var createTransition = require('../transition/transition');
var cloneDeep = require('lodash/cloneDeep');

module.exports = ( name, options ) => {
    
    options = Object.assign( {}, options );
    
    return ( ctx, next ) => {
        
        if ( !state.initialized ) {
            
            state.init();
            
        } else {
            
            /* global ga */
            
            ga( 'set', 'page', ctx.canonicalPath );
            ga( 'send', 'pageview' );
            
        }
        
        var transition;
        
        Promise.all([
            
            api( ctx.pathname, ctx.querystring, 0, state.maxVisibleTiles( options ) ),
            
            state.beforeTransitionOut( options )
                .then( () => {
                    
                    transition = createTransition( cloneDeep( state ), name );
                    
                    transition.begin();
                    
                    return state.transitionOut( name );
                    
                }).then( () => transition.out() )
            
        ])
        
        .then( resolved => {
            
            var articles = resolved[ 0 ].articles;
            
            var filters = resolved[ 0 ].meta.filters;
            
            state.setRoute({
                name,
                path: ctx.pathname,
                querystring: ctx.querystring
            }, options, articles, filters );
            
            return transition.in( state );
            
        })
        
        .then( state.transitionIn )
        
        .then( () => transition.clear() )
        
    }
    
}