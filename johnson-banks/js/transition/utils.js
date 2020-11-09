var Color = require('tinycolor2');

// Boxes to points, in order:
// 0 1
// 2 3

var clamp = ( x, min, max ) => Math.min( Math.max( x, min ), max );

var utils = {
    
    createBoxes: state => {
    
        var boxes = [];
        
        var vw = state.viewport.w;
        var vh = state.viewport.h;
        
        var left = state.options.feedWidth[ state.breakpoint ] * vw;
        var top = state.navHeight;
        
        state.tiles.forEach( strip => {
            
            var { w, h } = strip;
            
            strip.tiles.forEach( tile => {
                
                var article = tile.article;
                
                var color = Color( article ? article.color : 'black' )
                
                boxes.push({
                    x: ( left + tile.x ) / vw,
                    y: ( top + tile.y ) / vh,
                    w: w / vw,
                    h: h / vh,
                    color,
                    id: tile.id
                })
                
            })
            
        })
        
        if ( left ) {
            
            // Feed
            
            var scrollTop = state.scrollTop;
            var scrollBottom = scrollTop + ( state.viewport.h - top );
            
            for ( var i = 0; i < state.articles.length; i++ ) {
                
                var article = state.articles[ i ];
                
                if (
                    article.offset < scrollBottom &&
                    article.offset + article.height > scrollTop
                ) {
                    
                    boxes.unshift({
                        x: 0,
                        y: ( top / vh ) + ( article.offset - scrollTop ) / vh,
                        w: left / vw,
                        h: article.height / vh,
                        color: Color( article.color ),
                        id: 0
                    })
                    
                    break;
                    
                }
                
            }
            
        }
        
        boxes = boxes.map( box => utils.clampBox( box, state.navHeight / vh ) );
        
        return boxes;
        
    },
    
    clampBox: ( box, top ) => {
        
        var xyrb = utils.xyrb( box );
        
        xyrb.x = clamp( xyrb.x, 0, 1 );
        xyrb.y = clamp( xyrb.y, top, 1 );
        xyrb.r = clamp( xyrb.r, 0, 1 );
        xyrb.b = clamp( xyrb.b, 0, 1 );
        
        return Object.assign( box, utils.xywh( xyrb ) );
        
    },
    
    xyrb: xywh => {
        
        var { x, y, w, h } = xywh;
        
        var r = x + w;
        var b = y + h;
        
        return { x, y, r, b };
        
    },
    
    xywh: xyrb => {
        
        var { x, y, r, b } = xyrb;
        
        var w = r - x;
        var h = b - y;
        
        return { x, y, w, h };
        
    },
    
    toPoints: box => {
        
        var { x, y, r, b } = utils.xyrb( box );

        return [
            [ x, y ],
            [ r, y ],
            [ x, b ],
            [ r, b ]
        ]
        
    },
    
    toBox: points => {
        
        var x = points[ 0 ][ 0 ];
        var y = points[ 0 ][ 1 ];
        var r = points[ 3 ][ 0 ];
        var b = points[ 3 ][ 1 ];
        
        var w = r - x;
        var h = b - y;
        
        return { x, y, w, h };
        
    },
    
    mapBoxes: ( boxes, fn ) => {
        
        return boxes.map( box => {
            
            var pts = utils.toPoints( box );
            
            pts = pts.map( fn );
            
            var xywh = utils.toBox( pts );
            
            return Object.assign( {}, box, xywh );
            
        })
        
    }
    
}

module.exports = utils;