var xhr = require( 'xhr' );
var QueryString = require( 'query-string' );
var ROOT = 'http://johnsonbanks.webfactional.com/api';

var cache = {};

module.exports = ( path, querystring, offset, limit ) => {
    
    var query = Object.assign( { offset, limit }, QueryString.parse( querystring ) );
    
    querystring = QueryString.stringify( query );
    
    var url = ROOT + path + '?' + querystring;
    
    return new Promise( resolve => {
        
        xhr({
            
            url,
            json: true
            
        }, ( error, response ) => {
            
            if ( !error ) resolve( response.body );
            
        })

        
    })
    
}

// var xhr = require( 'xhr' );
// var queryString = require( 'query-string' );

// var ROOT = 'http://johnsonbanks.webfactional.com/api';

// class Articles extends Array {
    
//     constructor ( url ) {
        
//         super();
        
//         var [ path, query ] = url.split('?');
        
//         this.url = ROOT + path;
//         this.query = query ? queryString.parse( query ) : {};
        
//         this.loading = false;
        
//     }
    
//     load ( offset, limit ) {
        
//         this.loading = true;
        
//         var query = Object.assign( { offset, limit }, this.query );
        
//         return new Promise( resolve => {
            
//             xhr({
                
//                 url: this.url + '?' + queryString.stringify( query ),
//                 json: true
                
//             }, ( error, response ) => {
                
//                 var { articles, meta } = response.body;
                
//                 articles.forEach( ( article, i ) => {
                    
//                     this[ i + offset ] = article;
                    
//                 })
                
//                 this.loading = false;
                
//                 resolve( this );
                
//             })
            
//         })
        
//     }
    
// }

// var cache = {};

// module.exports = url => {
    
//     if ( cache[ url ] ) return cache[ url ];
    
//     var articles = cache[ url ] = new Articles( url );
    
//     return articles;
    
// }

// // var xhr = require( 'xhr' );

// // var ROOT = 'http://johnsonbanks.webfactional.com/api';

// // var cache = {};

// // module.exports = ( path, params = {} ) => {
    
// //     var key = path + JSON.stringify( params );
    
// //     if ( cache[ key ] ) return Promise.resolve( cache[ key ] );
    
// //     return new Promise( resolve => {
        
// //         xhr({
// //             url: ROOT + path + '/0',
// //             json: true,
// //         }, ( error, response ) => {
            
// //             var data = response.body.articles;
            
// //             if ( params.slug ) {
                
// //                 var idx = data.findIndex( article => {
                    
// //                     return article.slug === params.slug;
                    
// //                 });
                
// //                 data = data.slice( idx ).concat( data.slice( 0, idx ) );
                
// //             }
            
// //             cache[ key ] = data;
            
// //             resolve( data );
            
// //         });
        
// //     })
    
// // }