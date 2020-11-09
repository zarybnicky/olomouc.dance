var View = require('./View')

module.exports = View( 'Project', {
    
    feedWidth: [ 1, 5/6, 5/6, 3/4, 2/3 ],
    
    tileRatio: [ 1, 5/6, 5/6, 3/4, 3/4 ],
    
    tileColumns: [ 0, 2, 3, 3, 3 ],
    
    tileInitialSize: [ 1/2, 1/2, 1/2, 1/2, 1/2 ],
    
    templates: true,
    
    horizontal: false,
    
    sections: true,
    
    filters: false
    
})