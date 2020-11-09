var h = require('hyperscript');
var QueryString = require( 'query-string' );

var flatten = require('lodash/flatten');
var uniq = require('lodash/uniq');

var Select = require('./Select');

var Filters = {
    
    element: null,
    
    selects: [],
    
    init: state => {
        
        Filters.selects = [
            Select( 'filter1' ),
            Select( 'filter2' )
        ]
        
        Filters.selects[ 0 ].init( state, Filters.onChange.bind( null, 0 ) );
        
        Filters.selects[ 1 ].init( state, Filters.onChange.bind( null, 1 ) );
        
        Filters.element = h('.nav__item.nav__item_project-filters', [
            Filters.selects[ 0 ].element,
            Filters.selects[ 1 ].element
        ]);
        
    },   
    
    options: state => {
        
        var params = QueryString.parse( state.route.querystring );
        
        state.filters.forEach( ( filter, i ) => {
            
            var select = Filters.selects[ i ];
            
            var param = params[ filter.param ];
            
            var selected = 0;
            
            if ( param ) selected = filter.options.findIndex( o => o.value === param );
            
            select.setOptions( filter.options.map( o => o.name ), selected );
            
        });
        
    },
    
    onChange: ( filterIndex, selectedIndex, element, state ) => {
        
        state.onFilterChange( filterIndex, selectedIndex );
        
    },
    
    closeDropdowns: ( state, except ) => {
        
        Filters.selects.forEach( f => f.closeDropdowns( state, except ) );
        
    }
    
}

module.exports = Filters;