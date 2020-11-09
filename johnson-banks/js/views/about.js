var View = require('./View')

module.exports = View( 'About', {
    
    feedWidth: [ 1, 5/6, 3/4, 2/3, 1/2 ],
    
    tileRatio: [ 1, 5/6, 3/4, 2/3, 1/2 ],
    
    tileColumns: [ 0, 2, 3, 3, 4 ],
    
    tileInitialSize: [ 1/2, 1/2, 1/2, 1/2, 1/2 ],
    
    templates: true,
    
    horizontal: false,
    
    sections: false,
    
    filters: false
    
})