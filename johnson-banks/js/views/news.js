var View = require('./View')

module.exports = View( 'News', {
    
    feedWidth: [ 1, 5/6, 3/4, 2/3, 2/3 ],
    
    tileRatio: [ 1, 5/6, 3/4, 2/3, 2/3 ],
    
    tileColumns: [ 0, 2, 3, 2, 4 ],
    
    tileInitialSize: [ 1/2, 1/2, 1/2, 1/2, 1/2 ],
    
    templates: true,
    
    horizontal: false,
    
    sections: false,
    
    filters: false
    
})