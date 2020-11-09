var View = require('./View')

module.exports = name => View( name, {
    
    feedWidth: [ 1, 1, 1, 1, 1 ],
    
    tileRatio: [ 1, 1, 1, 1, 1 ],
    
    tileColumns: [ 0, 0, 0, 0, 0 ],
    
    tileInitialSize: [ 1, 1, 1, 1, 1 ],
    
    templates: true,
    
    horizontal: false,
    
    sections: false,
    
    filters: false,
    
    static: true
    
})