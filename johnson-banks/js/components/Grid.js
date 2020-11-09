var h = require( 'hyperscript' );

var Tile = require('./Tile');

var isTouch = require('../lib/detectTouch');

var drag = require('./lib/TouchDragEvent');

var Grid = {
    
    element: null,
    
    tiles: [],
    
    offset: undefined,
    
    init: state => {
        
        Grid.element = h('.grid');
        
        document.body.appendChild( Grid.element );
        
        Grid.element.addEventListener( 'click', e => state.onClick( e.target ) );
        
        if ( isTouch ) drag( Grid.element, Grid.onDrag.bind( null, state ) );
        
    },
    
    options: state => {
        
        if ( state.options.horizontal ) {
            
            Grid.element.className = 'grid grid_horizontal';
            
        } else {
            
            Grid.element.className = 'grid grid_vertical';
            
        }
        
        Grid.tiles.forEach( strip => strip.forEach( tile => {
            
            Grid.element.removeChild( tile.element );
            
        }));
        
        Grid.tiles = state.tiles.map( ( strip, stripIndex ) => {
            
            return strip.tiles.map( tile => {
                
                var t = Tile();
                
                t.init( Grid.element );
                
                return t;
                
            })
            
        });
        
    },
    
    layout: state => {
        
        var feedWidth = state.options.feedWidth[ state.breakpoint ];
        
        var feedWidthPx = feedWidth * state.viewport.w;
        var gridWidthPx = state.viewport.w - feedWidth;
        var gridHeightPx = state.viewport.h - state.navHeight;
        
        Grid.element.style.top = state.navHeight + 'px';
        Grid.element.style.left = feedWidthPx + 'px';
        Grid.element.style.width = gridWidthPx + 'px';
        Grid.element.style.height = gridHeightPx + 'px';
        
        if ( gridWidthPx === 0 ) return;
        
        state.tiles.forEach( ( strip, i ) => {
            
            Grid.tiles[ i ].forEach( tile => tile.setSize( strip.w, strip.h ));
            
        })
        
    },
    
    render: state => {
        
        state.tiles.forEach( ( strip, stripIndex ) => {
            
            var elements = Grid.tiles[ stripIndex ];
            
            var newTiles = [];
            var oldElements = [];
            
            elements.forEach( (el, i) => {
                
                var tile = strip.tiles.find( tile => tile.id === el.id );
                
                if ( tile ) {
                    
                    el.setPosition( tile.x, tile.y )
                    
                } else {
                    
                    oldElements.push( el );
                    
                }
                
            });
            
            strip.tiles.forEach( tile => {
                
                var el = elements.find( el => el.id === tile.id );
                
                if ( !el && tile.article !== null ) newTiles.push( tile );
                
            })
            
            oldElements.forEach( ( el, i ) => {
                
                if ( newTiles.length ) {
                    
                    var tile = newTiles.pop();
                    
                    el.setArticle( tile.article, tile.id, stripIndex + 1 );
                    
                    // re-appending clears :hover
                    
                    Grid.element.appendChild( el.element );
                    
                    el.setPosition( tile.x, tile.y );
                    
                } else {
                    
                    el.hide();
                    
                }
                
            })
            
        })
        
    },
    
    transitionOut: () => {
        
        Grid.element.style.opacity = 0;
        Grid.element.style.pointerEvents = 'none';
        
    },
    
    transitionIn: () => {
        
        Grid.element.style.opacity = 1;
        Grid.element.style.pointerEvents = 'visible';
        
    },
    
    onDrag: ( state, e ) => {
        
        if ( !state.options.horizontal ) return;
        
        var rowStart = 1 / state.options.tileInitialSize[ state.breakpoint ];
        var rowOffset = Number( e.target.id.split('_')[ 0 ] );
        var row = rowStart + rowOffset;
        var perRow = Math.pow( 2, row - 1 );
        
        var dx = ( e.dx / state.viewport.w ) * perRow * state.viewport.h
        
        var st = state.scrollTop - dx;
        
        var max = state.articles.length * state.viewport.h;
        
        st = Math.max( Math.min( st, max ), 0 );
        
        state.setScroll( st );
        
    }
    
}

module.exports = Grid;