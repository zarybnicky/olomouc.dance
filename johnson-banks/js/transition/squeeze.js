var { mapBoxes } = require( './utils' );

module.exports = ( boxes, x ) => {
    
    return mapBoxes( boxes, point => [ x, point[ 1 ] ] );
    
}