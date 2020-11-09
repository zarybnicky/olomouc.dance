var Color = require('tinycolor2');

var tween = require('../lib/tween');

var canvas = document.createElement( 'canvas' );
var ctx = canvas.getContext( '2d' );
var DPR = window.devicePixelRatio || 1;

document.body.appendChild( canvas );

var lerp = ( x1, x2, alpha ) => {
    
    return x1 + ( x2 - x1 ) * alpha;
    
}

var lerpColors = ( c1, c2, alpha ) => {
    
    return Color.mix( c1, c2, alpha * 100 );
    
}

var renderer = {
    
    setSize: ( viewport ) => {
        
        canvas.width = viewport.w * DPR;
        canvas.height = viewport.h * DPR;
        
    },
    
    drawBox: ( x, y, w, h, color ) => {
        
        ctx.fillStyle = color.toRgbString();
        
        ctx.fillRect(
            x * canvas.width,
            y * canvas.height,
            w * canvas.width,
            h * canvas.height
        );
        
    },
    
    drawBoxes: boxes => {
    
        boxes.forEach( box => {
            
            renderer.drawBox( box.x, box.y, box.w, box.h, box.color );
            
        })
        
    },
    
    clear: () => ctx.clearRect( 0, 0, canvas.width, canvas.height ),
    
    animate: ( boxes1, boxes2, duration ) => {
        
        var sameColors = boxes1.every( ( box1, i ) => {
            
            var box2 = boxes2[ i ];
            
            return Color.equals( box1.color, box2.color );
            
        })
        
        return tween( duration, 'quartInOut', progress => {
            
            renderer.clear();
            
            for ( var i = 0; i < boxes1.length; i++ ) {
                
                var b1 = boxes1[ i ];
                var b2 = boxes2[ i ];
                
                if ( !b1 || !b2 ) continue;
                
                renderer.drawBox(
                    lerp( b1.x, b2.x, progress ),
                    lerp( b1.y, b2.y, progress ),
                    lerp( b1.w, b2.w, progress ),
                    lerp( b1.h, b2.h, progress ),
                    sameColors
                        ? b1.color
                        : lerpColors( b1.color, b2.color, progress )
                )
                
            }
            
        }).then( () => {
            
            return boxes2;
            
        })
        
    }
    
}

module.exports = renderer;