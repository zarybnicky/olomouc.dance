var h = require('hyperscript');
var PREFIXED_TRANSFORM = require('detectcss').prefixed('transform');

var ProjectTitle = require('./ProjectTitle');
var ProjectSection = require('./ProjectSection');
var Search = require('./Search');
var Filters = require('./Filters');

var ITEMS = [{
    url: '/',
    active: ['home'],
    label: 'Home'
}, {
    url: '/work',
    active: ['work', 'project'],
    label: 'Work'
}, {
    url: '/thoughts',
    active: ['thoughts'],
    label: 'Thoughts'
}, {
    url: '/news',
    active: ['news'],
    label: 'News'
}, {
    url: '/about',
    active: ['about'],
    label: 'About'
}, {
    url: '/contact',
    active: ['contact'],
    label: 'Contact'
}, {
    url: '/sign-up',
    active: ['sign-up'],
    label: 'Sign Up'
}];

var Nav = {
    
    element: null,
    
    topBarElement: null,
    
    bottomBarElement: null,
    
    toggleElement: null,
    
    topArticleId: undefined,
    
    init: state => {
        
        ProjectTitle.init( state );
        
        ProjectSection.init( state, state.scrollToSection );
        
        ProjectSection.element.classList.add('nav__item_project-section');
        
        Search.init( state );
        
        Nav.topBarElement = h('.nav__bar.nav__bar_top',
        
            h('ul.main-menu',
            
                ITEMS.map( item => {
                    
                    return h('li',
                        {
                            className: 'main-menu__link ' + item.active.map( routeName => {
                                return 'main-menu__link_active-' + routeName
                            }).join(' ')
                        },
                        h('a', { href : item.url }, item.label )
                    )
                    
                }),
                
                h('li.main-menu__link',
                    Search.element
                )
                
            )
        )
        
        Filters.init( state );
        
        Nav.bottomBarElement = h('.nav__bar.nav__bar_bottom');
        
        Nav.toggleElement = h( 'a.nav__toggle', 'Menu' );
        
        Nav.toggleElement.addEventListener( 'click', state.toggleNav );
        
        Nav.element = h('nav.nav',
            Nav.toggleElement,
            Nav.bottomBarElement,
            Nav.topBarElement
        );
        
        document.body.appendChild( Nav.element );
        
    },
    
    addItem: element => {
        
        if ( element.parentNode ) return;
        
        element.style.opacity = 0;
        
        Nav.bottomBarElement.appendChild( element );
        
        setTimeout(() => {
            
            element.style.opacity = '';
            
        }, 200);
        
    },
    
    removeItem: element => {
        
        element.style.opacity = 0;
        
        if ( !element.parentNode ) return;
        
        setTimeout(() => {
            
            Nav.bottomBarElement.removeChild( element );
            
        }, 200);
        
    },
    
    options: state => {
        
        if ( state.options.sections ) {
            
            Nav.addItem( ProjectTitle.element );
            Nav.addItem( ProjectSection.element );
            
        } else {
            
            Nav.removeItem( ProjectTitle.element );
            Nav.removeItem( ProjectSection.element );
            
        }
        
        if ( state.options.filters ) {
            
            Filters.options( state );
            
            Nav.addItem( Filters.element );
            
        } else {
            
            Nav.removeItem( Filters.element );
            
        }
        
    },
    
    createFilters: state => {
        
        return [];
        
    },
    
    layout: state => {
        
        var topHeight = state.nav.topHeight[ state.breakpoint ];
        var bottomHeight = state.nav.bottomHeight[ state.breakpoint ];
        var dropdownHeight = state.nav.dropdownHeight;
        
        var { visibility, bottomVisibility } = state.nav;
        
        var offset = topHeight * visibility;
        
        Nav.element.style[ PREFIXED_TRANSFORM ] = `translate3d(0, ${ offset }px, 0)`;
        
        var bottomOffset = bottomHeight * bottomVisibility * visibility;
        
        Nav.bottomBarElement.style[ PREFIXED_TRANSFORM ] = `translate3d(0, ${ bottomOffset }px, 0)`;
        
        Nav.bottomBarElement.style.height = bottomHeight + dropdownHeight + 'px';
        
    },
    
    render: state => {
        
        var scrollTop = state.scrollTop;
        
        var topArticle = state.getTopArticle();
        
        if ( !topArticle ) return;
        
        if ( state.options.sections ) {
        
            ProjectTitle.set( topArticle.captionTop );
            
            ProjectSection.setProject( topArticle );
            
            for ( var i = topArticle.sectionOffsets.length - 1; i >= 0; i-- ) {
                
                var o = topArticle.sectionOffsets[ i ];
                
                if ( topArticle.offset + o.offset <= scrollTop ) {
                    
                    ProjectSection.set( i );
                    
                    break;
                    
                }
                
            }
        
        }
        
        var toggleColor = 'black';
        
        if ( state.nav.bottomVisibility === 0 || state.nav.visibility === 0 ) {
            
            if ( state.options.sections ) {
                
                for ( var i = topArticle.colorOffsets.length - 1; i >= 0; i-- ) {
                    
                    var o = topArticle.colorOffsets[ i ];
                    
                    if ( topArticle.offset + o.offset <= scrollTop ) {
                        
                        toggleColor = o.color;
                        
                        break;
                        
                    }
                    
                }
                
            } else {
                
                toggleColor = topArticle.headlineColor;
                
            }
            
        }
        
        Nav.toggleElement.style.color = toggleColor;
        
    },
    
    transitionOut: ( state, nextRoute ) => {
        
        if ( nextRoute !== 'Search' ) Search.clear();
        
        Nav.element.classList.add('nav_transition');
        
    },
    
    transitionIn: state => {
        
        Nav.element.classList.remove('nav_transition');
        
    },
    
    closeDropdowns: ( state, except ) => {
        
        ProjectSection.closeDropdowns( state, except );
        
        Filters.closeDropdowns( state, except );
        
    }
    
}

module.exports = Nav