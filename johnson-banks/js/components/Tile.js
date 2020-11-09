var h = require('hyperscript');
var PREFIXED_TRANSFORM = require('detectcss').prefixed('transform');
var DPR = 1;

var Tile = () => {
    
    var tile = {
        
        id: null,
        
        width: 0,
        
        height: 0,
        
        url: null,
        
        thumbnailSrcs: null,
        
        isSVG: false,
        
        element: null,
        
        title: null,
        
        captionTop: null,
        
        captionBottom: null,
        
        thumbnail: null,
        
        init: container => {
            
            tile.title = h('h2.tile__title');
            
            tile.captionTop = h('span.tile__caption-top');
            tile.captionBottom = h('span.tile__caption-bottom');
            tile.thumbnail = h('div.tile__thumbnail');
        
            tile.element = h('div',
                tile.title,
                tile.captionTop,
                tile.captionBottom,
                tile.thumbnail
            );
        
            tile.width = 0;
            tile.height = 0;
            tile.thumbnailSrcs = null;
        
            container.appendChild( tile.element );
                
        },
        
        setArticle: ( article, id, stripIndex ) => {
            
            tile.element.style.display = 'block';
            
            tile.id = tile.element.id = id;
            
            tile.url = article.url || '';
            
            tile.element.className = [
                'tile',
                'tile_entry-' + article.type || 'empty',
                'tile_row-' + stripIndex,
                // 'tile_headline-' + article.headlineColor || 'black'
            ].join(' ');
            
            tile.element.style.backgroundColor = article.color;
            tile.element.style.color = article.headlineColor || 'black';
            
            if ( article.thumbnailStyle === 'centered' ) {
                
                tile.thumbnail.classList.add('tile__thumbnail-logo');
                
            } else {
                
                tile.thumbnail.classList.remove('tile__thumbnail-logo');
                
            }
            
            tile.title.innerHTML = article.title || '';
            tile.captionBottom.innerText = article.captionBottom || '';
            tile.captionTop.innerText = article.captionTop || '';
            
            tile.thumbnailSrcs = article.thumbnail;
            
            if ( tile.thumbnailSrcs ) {
                tile.selectThumbnail();
            } else {
                tile.thumbnail.style.backgroundImage = 'none';
            }
            
        },
        
        setSize: ( w, h ) => {
            
            tile.width = w;
            tile.height = h;
            
            tile.element.style.width = w + 1 + 'px';
            tile.element.style.height = h + 1 + 'px';
            
            if ( tile.thumbnailSrcs ) tile.selectThumbnail();
            
        },
        
        setPosition: ( x, y ) => {
            
            tile.element.style[ PREFIXED_TRANSFORM ] = `translate3d( ${x}px, ${y}px, 0 )`;
            
        },
        
        selectThumbnail: () => {
            
            var w = tile.width * DPR;
            var h = tile.height * DPR;
            
            var src, last;
            
            for ( var i = 0; i < tile.thumbnailSrcs.length; i++ ) {
                
                src = tile.thumbnailSrcs[ i ];
                
                if ( src.w < w || src.h < h ) {
                    
                    src = last || src;
                    
                    break;
                    
                }
                
                last = src;
                
            }
            
            tile.thumbnail.style.backgroundImage = `url(${ src.url })`;
            
        },
        
        hide: () => {
            
            tile.element.style.display = 'none';
            
        }
                
    }
    
    return tile;
    
}

module.exports = Tile