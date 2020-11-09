var h = require( 'hyperscript' );
var ResizeSensor = require('./lib/ResizeSensor');

var Feed = {
    
    element: null,
    
    articleElements: [],
    
    topArticle: null,
    
    spacerElement: null,
    
    sensors: [],
    
    init: state => {
        
        Feed.element = h('.feed');
        
        document.body.appendChild( Feed.element );
        
    },
    
    options: state => {
        
        if ( Feed.spacerElement ) {
            
            Feed.element.removeChild( Feed.spacerElement );
            
            Feed.spacerElement = null;
            
        }
        
        Feed.articleElements.forEach( el => {
            
            Feed.element.removeChild( el );
            
        });
        
        Feed.articleElements = [];
        
        Feed.sensors.forEach( sensor => sensor.detach() );
        
        Feed.sensors = [];
        
        if ( !state.options.templates ) {
            
            Feed.spacerElement = h('.spacer');
            
            Feed.element.style.marginTop = 0;
            
            Feed.element.appendChild( Feed.spacerElement );
            
        } else {
            
            Feed.appendItem( state );
            
            state.loadNextTemplate();
            
            Feed.spacerElement = null;
            
        }
        
    },
    
    layout: state => {
        
        var w = state.options.feedWidth[ state.breakpoint ] * state.viewport.w;
        
        Feed.element.style.width = w + 'px';
        
        var scrollHeight = state.viewport.h - ( state.options.horizontal ? 0 : state.navHeight );
        
        if ( state.options.templates ) {
            
            Feed.element.style.marginTop = state.navHeight + 'px';
            
            Feed.articleElements.forEach( ( el, i ) => {
                
                if ( !state.articles[ i ].template ) {
                    
                    el.style.height = scrollHeight + 'px';
                    
                    state.setArticleHeight( i, scrollHeight );
                    
                }
                
            })
            
        } else {
            
            Feed.spacerElement.style.height = scrollHeight * state.articles.length + 'px';
            
            for ( var i = 0; i < state.articles.length; i++ ) {
                
                state.setArticleHeight( i, scrollHeight );
                
            }
            
        }
        
    },
    
    render: state => {
        
        if ( !state.options.templates ) return;
        
        var { scrollTop, articles } = state;
        
        var scrollHeight = state.viewport.h - state.navHeight;
        var threshold = scrollTop + scrollHeight * 2;
        
        for ( var i = 0; i < articles.length; i++ ) {
            
            var article = state.articles[ i ];
            
            if ( article.loading ) {
                
                if ( !Feed.articleElements[ i ] ) {
                    
                    Feed.appendItem( state );
                    
                }
                
                break;
                
            } else if ( article.template ) {
                
                if ( !Feed.articleElements[ i ] ) {
                    
                    Feed.appendItem( state );
                    
                }
                
                if ( Feed.articleElements[ i ].innerHTML === '' ) {
                    
                    Feed.insertTemplate( state, i );
                    
                }
                
            } else if ( article.offset < threshold ) {
                
                state.loadNextTemplate();
                
                break;
                
            }

            
        }
        
        var topArticle = state.getTopArticle();
        
        if ( topArticle && ( !Feed.topArticle || Feed.topArticle.id !== topArticle.id ) ) {
            
            Feed.topArticle = topArticle;
            
            state.setTitle( topArticle.shortTitle );
            
            state.replaceURL( topArticle.url );
            
        }
        
    },
    
    appendItem: state => {
        
        var i = Feed.articleElements.length;
        
        var article = state.articles[ i ];
        
        var height = state.viewport.h - state.navHeight;
        
        var el = h('div',
            {
                className: [
                    'article',
                    'article_' + article.type,
                    'article_headline-' + article.headlineColor || 'black'
                ].join(' '),
                style: {
                    'background-color': article.color,
                    height: height + 'px'
                }
            }
        );
        
        Feed.articleElements.push( el );
        
        Feed.element.appendChild( el );
        
        state.setArticleHeight( i, height );
        
    },
    
    onArticleSizeChange: ( state, i ) => {
        
        var el = Feed.articleElements[ i ];
        var article = state.articles[ i ];
        
        if ( state.options.sections ) {
            
            var h2s = [].slice.call( el.querySelectorAll('h2') );
            
            article.sectionOffsets = h2s.map( ( h2, sectionIndex ) => {
                
                return {
                    name: h2.innerText,
                    offset: h2.offsetTop
                }
                
            })
            
            article.sectionOffsets.unshift({
                name: 'Introduction',
                offset: 0
            });
            
            var masthead = el.querySelector('.masthead');
            
            article.colorOffsets = [{
                offset: 0,
                color: article.headlineColor
            },{
                offset: masthead.clientHeight,
                color: 'black'
            }];
            
        }
        
        state.setArticleHeight( i, Math.max( el.clientHeight, state.viewport.h ) );
        
    },
    
    insertTemplate: ( state, i ) => {
        
        var el = Feed.articleElements[ i ];
        
        el.style.height = 'auto';
        
        el.innerHTML = state.articles[ i ].template;
        
        Feed.sensors.push( new ResizeSensor( el, () => {
            
            Feed.onArticleSizeChange( state, i );
            
            state.render();
            
        }))
        
        Feed.onArticleSizeChange( state, i );

    },
    
    transitionOut: () => {
        
        Feed.element.style.opacity = 0;
        
    },
    
    transitionIn: () => {
        
        Feed.element.style.opacity = 1;
        
    }
    
}

module.exports = Feed;