var View = require('./View')

module.exports = View( 'Search', {
    
    feedWidth: [ 0, 0, 0, 0, 0 ],
    
    tileRatio: [ 1, 1, 1, 1, 1 ],
    
    tileColumns: [ 1, 1, 1, 1, 1 ],
    
    tileInitialSize: [ 1/4, 1/4, 1/4, 1/8, 1/8 ],
    
    templates: false,
    
    horizontal: true,
    
    sections: false,
    
    alwaysShowNav: true,
    
    filters: false
    
})