var Select = require('./Select');

var ProjectSection = Object.assign( Select( 'projectSection' ), {
    
    projectID: undefined,
    
    setProject: ( article ) => {
        
        if ( article.sectionOffsets.length && article.id !== ProjectSection.projectID ) {
            
            ProjectSection.projectID = article.id;
            ProjectSection.setOptions( article.sectionOffsets.map( o => o.name ) );
            
        }
        
    }
    
});

module.exports = ProjectSection;