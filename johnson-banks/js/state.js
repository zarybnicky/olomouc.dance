var EventEmitter = require( 'events' );
var xhr = require( 'xhr' );
var page = require( 'page' );
var debounce = require('lodash/debounce');
var tween = require( './lib/tween' );
var api = require('./api');
var isTouch = require('./lib/detectTouch');

var wait = delay => new Promise( r => setTimeout( r, delay ) );

var BREAKPOINTS = [ 736, 768, 1024, 1600, Infinity ];

var titleElement = document.getElementsByTagName('title')[0];

var getViewport = () => {
    
    var w = Math.min( window.innerWidth, document.documentElement.clientWidth );
    var h = window.innerHeight;
    // var h = Math.min( window.innerHeight, document.documentElement.clientHeight );
    
    return { w, h };
    
};

var getBreakpoint = ww => {
    
    return BREAKPOINTS.findIndex( w => w >= ww );
    
};

var emitter = new EventEmitter();

var state = {
    
    initialized: false,
    
    articles: [],
    
    filters: [],
    
    tiles: [],
    
    clickedTile: false,
    
    route: {
        
        name: '',
        
        path: null,
        
        querystring: null
        
    },
    
    options: {
        
        feedWidth: [ 0, 0, 0, 0, 0 ],
        
        tileRatio: [ 0, 0, 0, 0, 0 ],
        
        tileColumns: [ 0, 0, 0, 0, 0 ],
        
        templates: false,
        
        horizontal: false,
        
        sections: false,
        
        hasTitle: false
        
    },
    
    nav: {
        
        visibility: 0,
        
        topHeight: [ 288, 56, 56, 56, 56 ],
        
        bottomVisibility: 0,
        
        bottomHeight: [ 0, 56, 56, 56, 56 ],
        
        open: false,
        
        bottomOpen: false,
        
        dropdownHeight: 0
        
    },
    
    breakpoint: -1,
    
    viewport: { w: 0, h: 0 },
    
    navHeight: 0,
    
    scrollTop: 0,
    
    tileOffset: undefined,
    
    transitioning: true,
    
    init: () => {
        
        window.addEventListener( 'resize', state.onResize );
        // window.addEventListener( 'scroll', state.onScroll );
        
        state.viewport = getViewport();
        
        state.breakpoint = getBreakpoint( state.viewport.w );
        
        emitter.emit( 'init', state );
        
        state.initialized = true;
        
    },
    
    onResize: () => {
        
        state.viewport = getViewport();
        
        var prevBreakpoint = state.breakpoint;
        
        state.breakpoint = getBreakpoint( state.viewport.w );
        
        if ( state.breakpoint !== prevBreakpoint ) {
            
            state.createTiles();
            
            emitter.emit( 'options', state );
            
        }
        
        state.layout();
        
        state.render();
        
    },
    
    onScroll: () => {
        
        state.setScroll( window.pageYOffset );
        
    },
    
    setScroll: y => {
        
        state.scrollTop = y;
        
        if ( state.breakpoint === 0 ) state.closeNav();
        
        if ( window.innerHeight !== state.viewport.h ) {
            
            state.viewport = getViewport();
            
            state.layout();
            
        }
        
        state.render( true );

        
    },
    
    animateScroll: to => {
        
        return tween( state.scrollTop, to, 350, y => scrollTo( 0, y ) );
        
    },
    
    scrollToSection: i => {
        
        var article = state.getTopArticle();
        
        if ( article ) {
            
            var offset = article.sectionOffsets[ i ].offset;
            
            return state.animateScroll( article.offset + offset );
            
        }
        
    },
    
    setRoute: ( route, options, initialArticles, filters ) => {
        
        state.clickedTile = false;
        
        state.route = route;
        
        state.scrollTop = 0;
        
        state.setTitle( route.name );
        
        document.body.className = document.body.className.split(' ').filter( cls => {
            
            return cls.indexOf('route') === -1;
            
        }).join(' ') + ' route_' + route.name.toLowerCase();
        
        state.articles = [];
        
        state.updateArticles( initialArticles, 0, initialArticles.length );
        
        state.filters = filters;
        
        state.setOptions( options );
        
        if ( state.options.templates ) state.loadNextTemplate();
        
        state.layout();
        
        state.render();
        
        state.setScroll(0);
        
    },
    
    replaceURL: url => {
        
        /* global history */
        /* global location */
        /* global ga */
        
        if ( url === location.pathname ) return;
        
        history.pushState( { path: url }, titleElement.innerText, url );
        
        ga('set', 'page', url);
        ga('send', 'pageview');
        
    },
    
    setTitle: title => {
        
        if ( title ) {
            
            title = title + ' | Johnson Banks';
            
        } else {
            
            title = 'Johnson Banks';
            
        }
        
        titleElement.innerText = title;
        
    },
    
    setOptions: options => {
        
        state.options = options;
        
        if ( options.horizontal && isTouch ) {
            
            document.body.style.overflow = 'hidden';
            window.removeEventListener( 'scroll', state.onScroll );
            
        } else {
            
            document.body.style.overflow = 'scroll';
            window.addEventListener( 'scroll', state.onScroll );
            
        }
        
        state.createTiles();
        
        emitter.emit( 'options', state );
        
    },
    
    updateArticles: ( articles, offset, limit ) => {
        
        var yOffset = 0;
        
        if ( state.articles.length ) {
            
            var last = state.articles[ state.articles.length - 1 ];
            
            yOffset = last.offset + last.height;
            
        }
        
        for ( var i = 0; i < limit; i++ ) {
            
            state.articles[ i + offset ] = Object.assign( {
                
                template: false,
                loading: false,
                height: 0,
                offset: yOffset,
                colorOffsets: [],
                sectionOffsets: []
                
            }, articles[ i ] );
            
        }
        
    },
    
    layout: () => {
        
        state.updateTileSizes();
        
        emitter.emit( 'layout', state );
        
    },
    
    render: ( lazy ) => {
        
        var offset = state.getTileOffset();
        
        if ( !lazy || offset !== state.tileOffset ) {
            
            state.tileOffset = offset;
            state.updateTilePositions();
            
        }
        
        emitter.emit( 'render', state );
        
    },
    
    registerComponent: component => {
        
        [
            'init',
            'options',
            'articles',
            'layout',
            'render',
            'transitionOut',
            'transitionIn',
            'closeDropdowns'
        ].forEach( event => {
            
            if ( component[ event ] ) emitter.on( event, component[ event ] );
            
        });
        
    },
    
    getTopArticle: () => {
        
        for ( var i = state.articles.length - 1; i >= 0; i-- ) {
                
            var article = state.articles[ i ];
            
            if ( article.offset <= state.scrollTop ) {
                
                if ( !article.loading ) return article;
                
                return false;
                
            }
            
        }
        
    },
    
    setArticleHeight: ( i, height ) => {
        
        var article = state.articles[ i ];
        
        article.height = height;
        
        var top = article.offset + article.height;
        
        i++;
        
        for ( ; i < state.articles.length; i++ ) {
            
            article = state.articles[ i ];
            
            article.offset = top;
            
            top += article.height;
            
        }
        
    },
    
    maxVisibleTiles: options => {
        
        options = options || state.options;
        
        var initialSize = options.tileInitialSize[ state.breakpoint ];
        var columns = options.tileColumns[ state.breakpoint ];
        
        var count = 1;
        
        var tiles = 1 / initialSize;
        
        for ( var i = 0; i < columns; i++ ) {
            
            count += tiles;
            tiles *= 2;
            
        }
        
        return count;
        
    },
    
    loadingMore: false,
    
    loadMoreArticles: () => {
        
        if ( state.options.static || state.loadingMore ) return;
        
        state.loadingMore = true;
        
        var offset = state.articles.length;
        var limit = state.maxVisibleTiles();
        
        api( state.route.path, state.route.querystring, offset, limit )
            .then( response => {
                state.loadingMore = false;
                state.updateArticles( response.articles, offset, response.articles.length );
                state.layout();
                state.render();
            });
        
    },
    
    loadNextTemplate: () => {
        
        var next = state.articles.find( a => a.templateUrl && !a.template );
        
        if ( next === undefined ) return;
        
        next.loading = true;
        
        xhr( next.templateUrl, ( error, response ) => {
            
            next.template = response.body;
            
            next.loading = false;
            
            state.render();
            
        });
        
    },
    
    createTiles: () => {
        
        var columns = state.options.tileColumns[ state.breakpoint ];
        
        state.tiles = [];
        
        var count = 1 / state.options.tileInitialSize[ state.breakpoint ];
        
        for ( var i = 0; i < columns; i++ ) {
            
            var strip = { w: 0, h: 0, tiles: [] };
            
            for ( var j = 0; j <= count; j++ ) {
                
                strip.tiles.push( { x: 0, y: 0, article: null, id: 0 } );
                
            }
            
            state.tiles.push( strip );
            
            count *= 2;
            
        }
        
    },
    
    updateTileSizes: () => {
        
        var ratio = state.options.tileRatio[ state.breakpoint ];
        
        var w = ratio;
        var h = state.options.tileInitialSize[ state.breakpoint ];
        var x = 0;
        
        var vw = state.viewport.w;
        var vh = state.viewport.h;
        
        var horizontal = state.options.horizontal;
        
        var gridWidth = ( 1 - state.options.feedWidth[ state.breakpoint ] ) * vw;
        var gridHeight = vh - state.navHeight;
        
        if ( horizontal ) {
            
            var tmp = gridHeight;
            gridHeight = gridWidth;
            gridWidth = tmp;
        
        }
        
        var positionProp = horizontal ? 'y' : 'x';
        
        state.tiles.forEach( ( strip, i ) => {
            
            strip[ horizontal ? 'h' : 'w' ] = w * gridWidth;
            strip[ horizontal ? 'w' : 'h' ] = h * gridHeight;
            
            strip.tiles.forEach( tile => {
                
                tile[ positionProp ] = x * gridWidth;
                
            });
            
            h /= 2;
            x += w;
            w = 1 - x;
            
            if ( i < state.tiles.length - 2 ) {
                
                w *= ratio;
                
            }
            
        });
        
    },
    
    getTileOffset: () => {
        
        var scrollTop = state.scrollTop;
        var scrollHeight = state.viewport.h - ( state.options.horizontal ? 0 : state.navHeight );
        
        if ( state.options.templates ) {
            
            var scrollBottom = scrollTop + scrollHeight;
            
            var top = 0;
            var offset = 0;
            
            for ( var i = 0; i < state.articles.length; i++ ) {
                
                if ( top <= scrollTop ) {
                    
                    offset++;
                    
                } else if ( top < scrollBottom ) {
                    
                    offset += 1 - ( ( top - scrollTop ) / scrollHeight );
                    
                } else {
                    
                    break;
                    
                }
                
                top += state.articles[ i ].height;
                
            }
            
        } else {
            
            offset = scrollTop / scrollHeight;
            
        }
        
        return offset;
        
    },
    
    updateTilePositions: () => {
        
        var idx = Math.floor( state.tileOffset );
        
        var horizontal = state.options.horizontal;
        
        var initialSize = state.options.tileInitialSize[ state.breakpoint ];
        
        var gridHeight = horizontal
            ? state.viewport.w * ( 1 - state.options.feedWidth[ state.breakpoint ] )
            : state.viewport.h - state.navHeight;
        
        var y = ( idx - state.tileOffset ) * gridHeight * initialSize;
        
        state.tiles.forEach( ( strip, stripIndex ) => {
            
            strip.tiles.forEach( tile => {
                
                tile[ horizontal ? 'x' : 'y' ] = y;
                
                tile.article = state.articles[ idx ] || null;
                tile.id = stripIndex + '_' + idx;
                
                y += strip[ horizontal ? 'w' : 'h' ];
                
                idx++;
                
            });
            
            y = ( y - gridHeight - strip[ horizontal ? 'w' : 'h' ] ) / 2;
            
            idx--;
            
        });
        
        if ( idx >= state.articles.length ) state.loadMoreArticles();
        
    },
    
    animateNav: ( prop, from, to ) => {
        
        var duration = 175;
        
        return tween( from, to, duration, 'cubicInOut', x => {
            
            state.nav[ prop ] = x;
            
            state.updateNavHeight();
            
            state.layout();
            
            state.render();
            
        });
        
    },
    
    closeNav: () => {
        
        if ( state.nav.open ) {
            
            state.nav.open = false;
            
            return Promise.all([
                state.animateNav( 'visibility', 1, 0 ),
                state.closeDropdowns()
            ]);
            
        }
        
        return Promise.resolve();
        
    },
    
    openNav: () => {
        
        if ( !state.nav.open ) {
            
            state.nav.open = true;
            
            return state.animateNav( 'visibility', 0, 1 );
            
        }
        
        return Promise.resolve();
        
    },
    
    closeBottomNav: () => {
        
        if ( state.nav.bottomOpen ) {
            
            state.nav.bottomOpen = false;
            
            return Promise.all([
                state.animateNav( 'bottomVisibility', 1, 0 ),
                state.closeDropdowns()
            ]);
            
        }
        
        return Promise.resolve();
        
    },
    
    openBottomNav: () => {
        
        if ( state.nav.visibility === 0 ) {
            
            state.nav.bottomVisibility = 1;
            
            state.nav.bottomOpen = true;
            
            return Promise.resolve();
            
        }
        
        if ( !state.nav.bottomOpen ) {
            
            state.nav.bottomOpen = true;
            
            return state.animateNav( 'bottomVisibility', 0, 1 );
            
        }
        
        return Promise.resolve();
        
    },
    
    toggleNav: () => state.nav.open ? state.closeNav() : state.openNav(),
    
    openDropdown: ( name, height ) => {
        
        emitter.emit( 'closeDropdowns', state, name );
        
        return state.animateNav( 'dropdownHeight', state.nav.dropdownHeight, height );
        
    },
    
    closeDropdowns: except => {
        
        if ( state.nav.dropdownHeight === 0 ) return Promise.resolve();
        
        emitter.emit( 'closeDropdowns', state );
        
        return state.animateNav( 'dropdownHeight', state.nav.dropdownHeight, 0 );
        
    },
    
    updateNavHeight: () => {
        
        var topHeight = state.nav.topHeight[ state.breakpoint ];
        var bottomHeight = state.nav.bottomHeight[ state.breakpoint ] + state.nav.dropdownHeight;
        
        var { visibility, bottomVisibility } = state.nav;
        
        var totalHeight = ( topHeight + bottomHeight * bottomVisibility ) * visibility;
        
        state.navHeight = totalHeight;
        
    },
    
    onClick: element => {
        
        var id = element.id;
        
        var tile;
        
        state.tiles.find( strip => {
            
            return strip.tiles.find( otherTile => {
                
                if ( otherTile.id === id ) {
                    
                    tile = otherTile;
                    return true;
                    
                }
                
            });
            
        });
        
        state.clickedTile = tile.id;
        
        page( tile.article.url );
        
    },
    
    onFilterChange: ( filterIndex, selectedIndex ) => {
        
        /* global location */
        
        var options = state.filters[ filterIndex ].options;
        
        var querystring = options[ selectedIndex ].query;
        
        page( location.pathname + '?' + querystring );
        
    },
    
    beforeTransitionOut: nextOptions => {
        
        var promises = [];
        
        if ( state.nav.dropdownHeight > 0 ) {
            
            promises.push( state.closeDropdowns() );
            
        }
        
        if ( state.breakpoint === 0 ) {
            
            promises.push( state.closeNav() );
            
        }
        
        if ( !nextOptions.sections && !nextOptions.filters ) {
            
            promises.push( state.closeBottomNav() );
            
        }
        
        return Promise.all( promises );
        
    },
    
    transitionOut: nextRoute => {
        
        emitter.emit( 'transitionOut', state, nextRoute );
        
        return wait( state.articles.length ? 350 : 0 );
        
    },
    
    transitionIn: () => {
        
        emitter.emit( 'transitionIn' );
        
        var useBottomNav = state.options.sections || state.options.filters;
        
        var navPromises = [
            useBottomNav && state.openBottomNav,
            state.options.alwaysShowNav && state.openNav
        ].filter( x => !!x );
        
        return wait( 350 ).then( () => Promise.all( navPromises.map( x => x() ) ) );
        
    },
    
    search: query => {
        
        page( '/search/' + query );
        
    },
    
    searchDebounced: debounce( x => state.search( x ), 500 )
    
};

module.exports = state;