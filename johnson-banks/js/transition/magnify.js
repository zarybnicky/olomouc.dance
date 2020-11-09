var renderer = require('./renderer');
var { toPoints, mapBoxes } = require('./utils');

var mapValue = ( value, oldMin, oldMax, newMin, newMax ) => {
    
    var mapped = newMin + (newMax - newMin) * (value - oldMin) / (oldMax - oldMin);
    
    return Math.max( Math.min( mapped, newMax ), newMin );
    
}

module.exports = ( boxes, target ) => {
    
    var top = Math.min( ...boxes.map( box => box.y ) );
    
    var targetPoints = toPoints( target );
    
    var targetX = targetPoints[ 0 ][ 0 ];
    var targetY = targetPoints[ 0 ][ 1 ];
    var targetR = targetPoints[ 3 ][ 0 ];
    var targetB = targetPoints[ 3 ][ 1 ];
    
    return mapBoxes( boxes, point => {
        
        var [ x, y ] = point;
        
        return [
            mapValue( x, targetX, targetR, 0, 1 ),
            mapValue( y, targetY, targetB, top, 1 ),
        ]
        
    })
    
}

// module.exports = ( boxes1, target1, boxes2, target2, duration ) => {
    
//     if ( !boxes1 ) {
        
//         return renderer.animate( magnifyBoxes( boxes2, target2 ), boxes2, duration );
        
//     } else {
        
//         return renderer.sequence( [
//             [ boxes1, magnifyBoxes( boxes1, target1 ) ],
//             [ magnifyBoxes( boxes2, target2 ), boxes2 ],
//         ], duration )
        
//     }
    
// }


// // module.exports = ( boxes, id ) => {
    
// //     var target = boxes.find( box => box.id === id );
    
// //     var magnified = boxes.map( box => {
        
// //         var x, r, y, b;
        
// //         if( box.id === id ) {
            
// //             // Clicked, fill the screen
// //             x = y = 0;
// //             r = b = 1;
            
// //         } else if( box.y === target.y ){
            
// //             // Same strip, fill it
// //             y = 0;
// //             b = 1;
            
// //             if( box.x <= target.x ) {
                
// //                 // Shrink off to the left
// //                 x = r = 0;
                
// //             } else {
                
// //                 // Or right
// //                 x = r = 1;
                
// //             }
            
// //         } else {
            
// //             // Different strips
            
// //             if( box.y <= target.y ) {
                
// //                 y = b = 0;
                
// //             } else {
                
// //                 y = b = 1;
                
// //             }
            
// //             var boxR = box.x + box.w;
// //             var targetR = target.x + target.w;
            
// //             if( box.x <= target.x ){
// //                 x = 0;
// //             } else if( box.x >= targetR ){
// //                 x = 1;
// //             } else {
// //                 x = (box.x - Math.max(target.x, 0) ) / Math.min( target.w, 1 );
// //             }
            
// //             if( boxR <= target.x) {
// //                 r = 0;
// //             } else if( boxR >= targetR ){
// //                 r = 1;
// //             } else {
// //                 r = ( boxR - Math.max( target.x, 0 ) ) / Math.min( target.w, 1 );
// //             }
            
// //         }
        
// //         var w = r - x;
// //         var h = b - y;
        
// //         return {
// //             x, y, w, h,
// //             color: box.color,
// //             id: box.id
// //         }
        
// //     })
    
// // }