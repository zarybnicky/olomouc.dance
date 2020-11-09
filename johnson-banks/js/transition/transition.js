var Color = require('tinycolor2');
var cloneDeep = require('lodash/cloneDeep');

var renderer = require('./renderer');

var { createBoxes } = require('./utils');

var magnify = require('./magnify');
var squeezeBoxes = require('./squeeze');
var title = require('./title');

var wait = delay => new Promise( resolve => setTimeout( resolve, delay ) );

var bigTitle = ( boxes, state ) => {
    
    var animateTitle = title( state, 1800, 350 );
    
    return wait( 750 ).then( () => Promise.all([
        
        animateTitle(),
        
        magnifyIn( boxes, boxes[ 0 ], 1800 )
        
    ]));
    
}

var fadeInColor = ( boxes, duration ) => {
    
    var color = boxes[ 0 ].color;
    
    var box = { x: 0, y: 0, w: 1, h: 1, color };
    var whiteBox = Object.assign( {}, box, { color: Color('white') } );
    
    return renderer.animate( [ whiteBox ], [ box ], duration );
    
}

var magnifyIn = ( boxes, target, duration ) => {
    
    return renderer.animate( magnify( boxes, target ), boxes, duration );
    
}

var magnifyOut = ( boxes, target, duration ) => {
    
    return renderer.animate( boxes, magnify( boxes, target ), duration );
    
}

var magnifyClickedOut = ( boxes, state, duration ) => () => {
    
    var id = state.clickedTile;
    
    return magnifyOut( boxes, boxes.find( box => box.id === id ), duration )
    
}

var magnifyInFirst = duration => boxes => {
    
    if ( boxes.length === 1 ) return Promise.resolve();
    
    return magnifyIn( boxes, boxes[ 0 ], duration );
    
}

var squeeze = ( boxes1, duration ) => boxes2 => {
    
    var from = boxes1.concat( squeezeBoxes( boxes2, 1 ) );
    var to = squeezeBoxes( boxes1, 0 ).concat( boxes2 );
    
    return renderer.animate( from, to, duration );
    
}

module.exports = ( prevState, nextRoute ) => {
    
    var prevRoute = prevState.route.name;
    
    var prevBoxes = createBoxes( prevState );
    
    renderer.setSize( prevState.viewport );
    
    var transitionOut, transitionIn;
    
    var routeIs = ( prev, next ) => prevRoute === prev && nextRoute === next;
    
    var bothRoutesAre = what => routeIs( what, what );
    
    if ( routeIs( '', 'Home' ) ) {
        
        transitionIn = bigTitle;
        
    } else if ( prevRoute === '' ) {
        
        transitionIn = nextBoxes => fadeInColor( nextBoxes, 150 ).then( () => magnifyInFirst( 1200 )( nextBoxes ) );
        
    } else if (
        
        prevState.clickedTile !== false && (
            prevRoute === 'Home' ||
            prevRoute === 'Search' ||
            routeIs( 'Work', 'Project' ) ||
            bothRoutesAre( 'Project' ) ||
            bothRoutesAre( 'Thoughts' ) ||
            bothRoutesAre( 'News' ) ||
            bothRoutesAre( 'About' )
        )
        
    ) {
        
        transitionOut = magnifyClickedOut( prevBoxes, prevState, 600 );
        
        transitionIn = magnifyInFirst( 600 );
        
    } else {
        
        transitionIn = squeeze( prevBoxes, 600 );
        
    }
    
    return {
        
        begin: () => renderer.drawBoxes( prevBoxes ),
        
        out: transitionOut || ( () => wait( 0 ) ),
        
        in: nextState => transitionIn( createBoxes( nextState ), nextState ),
        
        clear: renderer.clear
        
    }
    
}

// var findTransition = 

// module.exports = {
    
//     out: ( state, fromRoute, fromParams, toRoute, toParams ) => {
        
//         var prevBoxes = createBoxes( prevState );
        
//         if ( state.clickedTile === false ) {
            
//             return squeeze( prevBoxes, nextBoxes );
            
//         } else {
            
//             state.clickedTile = false;
            
//         }
        
//         return wait( 0 );
        
//     },
    
//     in: ( state, fromRoute, fromParams, toRoute, toParams ) => {
        
//         return wait( 0 );
        
//     }
    
// }

// // module.exports = ( state, toRoute, toParams ) => {
    
// //     var prevState = cloneDeep( state );
    
// //     var fromRoute = prevState.route.name;
// //     var fromParams = prevState.route.name;
    
// //     var prevBoxes = createBoxes( prevState );
    
// //     renderer.setSize( prevState.viewport );
    
// //     renderer.drawBoxes( prevBoxes );
    
// //     return nextState => {
        
// //         var nextBoxes = createBoxes( nextState );
        
// //         var prevRoute = prevState.route.name;
// //         var nextRoute = nextState.route.name;
        
// //         return transitions.find( transition => {
            
// //             var { from, to } = transition;
            
// //             var matchesPrev = from === prevRoute || from === '*';
// //             var matchesNext = to === nextRoute || to === '*';
            
// //             return matchesPrev && matchesNext;
            
// //         }).transition( prevState, nextState, prevBoxes, nextBoxes );
        
        
        
// //         if ( !prevRoute.name ) {
            
// //             if ( nextRoute.name === 'home' ) {
                
                
                
// //             } else {
                
// //                 return magnify( null, null, nextBoxes, nextBoxes[ 0 ], 1000 );
                
// //             }
            
// //         } else if ( prevRoute.name )
        
        
// //         return squeeze( prevBoxes, nextBoxes );
        
// //     }
    
// // }