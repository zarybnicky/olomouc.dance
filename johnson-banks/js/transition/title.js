var Tile = require('../components/Tile');
var tween = require('../lib/tween');

var prefixed = require('detectcss').prefixed;

var PREFIXED_TRANSFORM = prefixed('transform');

module.exports = ( state, duration, waitAfter ) => {
    
    var tile = Tile();
    
    tile.init( document.body );
    
    tile.setSize( state.viewport.w, state.viewport.h );
    
    tile.setPosition( 0, state.navHeight );
    
    tile.setArticle( state.articles[ 0 ], 0, 1 );
    
    tile.element.style.backgroundColor = 'transparent';
    
    tile.element.style[ prefixed( 'transition') ] = `opacity ${ duration / 3 }ms`;
    
    tile.element.style.opacity = 0;
    
    var positionTransform = tile.element.style[ PREFIXED_TRANSFORM ];
    
    var titleElement = tile.element.querySelector('.tile__title');
    var fontSize = parseInt( getComputedStyle( titleElement )['font-size'] );
    
    titleElement.style.fontSize = fontSize * 2 + 'px';
    
    return () => {
        
        tile.element.style.opacity = 1;
        
        setTimeout( () => {
            
            document.body.removeChild( tile.element );
            
        }, duration + waitAfter )
        
        return tween( 1, .5, duration, 'quartInOut', scale => {
            
            var scaleTransform = `scale( ${ scale } )`;
            
            tile.element.style[ PREFIXED_TRANSFORM ] = positionTransform + ' ' + scaleTransform;
            
        })
    
    }
    
}