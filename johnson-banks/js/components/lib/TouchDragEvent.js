module.exports = ( element, fn ) => {
    
    var last;
    
    var normalize = e => {
        
        var touch = e.touches[ 0 ];
        
        return [ touch.clientX, touch.clientY ];
        
    };
    
    var last;
    
    var onStart = e => {
        
        last = normalize( e );
        
        element.removeEventListener( 'touchdown', onStart );
        element.addEventListener( 'touchmove', onMove );
        element.addEventListener( 'touchend', onEnd );
        
    }
    
    var onMove = e => {
        
        var [ x, y ] = normalize( e );
        
        var dx = x - last[ 0 ];
        var dy = y - last[ 1 ];
        
        fn({
            x, y, dx, dy,
            target: e.target
        })
        
        last = [ x, y ];
        
    }
    
    var onEnd = e => {
        
        element.removeEventListener( 'touchmove', onMove );
        element.removeEventListener( 'touchend', onEnd );
        element.addEventListener( 'touchstart', onStart );
        
    }
    
    element.addEventListener( 'touchstart', onStart );
    
    var unbind = () => {
        
        element.removeEventListener( 'touchstart', onStart );
        element.removeEventListener( 'touchmove', onMove );
        element.removeEventListener( 'touchend', onEnd );
        
    }
    
    return unbind;
    
}