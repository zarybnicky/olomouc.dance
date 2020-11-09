var h = require('hyperscript');

var ProjectTitle = {
    
    element: null,
    
    span: null,
    
    init: state => {
        
        ProjectTitle.element = h('.nav__item.nav__item_project-title');
        
    },
    
    set: text => {
        
        if ( ProjectTitle.span && ProjectTitle.span.innerText === text ) return;
        
        if ( ProjectTitle.span ) {
            
            var oldSpan = ProjectTitle.span;
            
            oldSpan.style.opacity = 0;
            
            setTimeout(() => {
                
                ProjectTitle.element.removeChild( oldSpan );
                
            }, 200)
            
        }
        
        var newSpan = h('span', { style: { opacity: "0" } }, text );
        
        ProjectTitle.element.appendChild( newSpan );
        
        setTimeout(() => {
            
            newSpan.style.opacity = 1;
            
        }, 200 );
        
        ProjectTitle.span = newSpan;
        
    }
    
}

module.exports = ProjectTitle;