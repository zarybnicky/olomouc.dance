var h = require('hyperscript');

var Search = {
    
    element: null,
    
    init: state => {
        
        Search.element = h('input.nav__search', {
            type: 'text',
            placeholder: 'Search'
        })
        
        var boundOnInput = Search.onInput.bind( null, state );
        
        Search.element.addEventListener( 'input', boundOnInput );
        Search.element.addEventListener( 'keydown', boundOnInput );
        Search.element.addEventListener( 'change', boundOnInput );
        
    },
    
    onInput: ( state, e ) => {
        
        var value = Search.element.value.trim();
        
        if ( !value ) return;
        
        if ( state.breakpoint === 0 ) {
            
            if ( e.type === 'keydown' && e.keyCode === 13 ) state.search( value );
            
        } else {
            
            state.searchDebounced( value );
            
        }
        
    },
    
    set: v => {
        
        Search.element.value = v;
        
    },
    
    clear: () => Search.set('')
    
}

module.exports = Search;