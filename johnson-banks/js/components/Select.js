var h = require('hyperscript');

var PREFIXED_TRANSFORM = require('detectcss').prefixed('transform');

var ITEM_HEIGHT = 24;

var Select = name => {
    
    var select = {
        
        element: null,
        
        options: [],
        
        selected: 0,
        
        isOpen: false,
        
        height: 0,
        
        init: ( state, onChange ) => {
            
            select.element = h('ul.nav__item.nav__item_dropdown');
            
            select.element.addEventListener( 'click', e => {
                
                if ( !select.isOpen ) {
                    
                    select.open();
                    
                    state.openDropdown( name, ( select.options.length - 1 ) * ITEM_HEIGHT );
                    
                } else {
                    
                    var id = Number( e.target.id );
                    
                    onChange( id, select.options[ id ], state );
                    
                    state.closeDropdowns();
                    
                }
                
            })
            
        },
        
        setOptions: ( newOptions, selection = 0 ) => {
            
            var prevElements = select.options;
            
            prevElements.forEach( el => {
                
                el.style.opacity = 0;
                
            });
            
            select.options = newOptions.map( (label, i) => {
                    
                var li = h( 'li', { id: i, opacity: 0 }, label );
                
                select.element.appendChild( li );
                
                return li;
                
            })
            
            setTimeout(() => {
                
                prevElements.forEach( el => {
                        
                    select.element.removeChild( el );
                    
                })
                
                select.options.forEach( el => {
                    
                    el.style.opacity = '';
                    
                })
                
                select.set( selection );
                
            }, 200 );
            
        },
        
        render: () => {
            
            select.options.forEach( ( el, i ) => {
                
                if ( i === select.selected ) {
                    
                    el.classList.add( 'selected' );
                    
                } else {
                    
                    el.classList.remove( 'selected' );
                    
                }
                
            })
            
            var y;
            
            if ( select.isOpen ) {
                
                y = 0;
                
                select.element.classList.add( 'nav__item_dropdown_open' );
                
            } else {
                
                y = -select.selected * ITEM_HEIGHT;
                
                select.element.classList.remove( 'nav__item_dropdown_open' );
                
            }
            
            select.element.style[ PREFIXED_TRANSFORM ] = `translate3d(0, ${ y }px, 0)`;
            
        },
        
        open: () => {
            
            select.isOpen = true;
            
            select.render();
            
        },
        
        close: () => {
            
            select.isOpen = false;
            
            select.render();
            
        },
        
        closeDropdowns: ( state, except ) => {
            
            if ( except === name ) return;
            
            select.close();
            
        },
        
        set: i => {
            
            select.selected = i;
            
            select.render();
            
        }
        
    }
    
    return select;
    
}

module.exports = Select;