var View = require('./View')

module.exports = View( 'Home', {
    
    feedWidth: [ 0, 0, 0, 0, 0 ],
    
    tileRatio: [ 1/2, 1/2, 1/2, 1/2, 1/2 ],
    
    tileColumns: [ 4, 5, 5, 5, 5 ],
    
    tileInitialSize: [ 1/2, 1/2, 1/2, 1/2, 1/2 ],
    
    templates: false,
    
    horizontal: true,
    
    sections: false,
    
    filters: false
    
})