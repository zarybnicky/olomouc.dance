var isTouch = require('has-touch');

document.body.classList.add( isTouch ? 'touch' : 'no-touch' );

module.exports = isTouch;