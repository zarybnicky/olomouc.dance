require('./lib/detectIE');
require('./lib/shim');
require('./lib/detectTouch');

var page = require('page');

var api = require('./api');
var state = require('./state');

var Nav = require('./components/Nav');
var Feed = require('./components/Feed');
var Grid = require('./components/Grid');

state.registerComponent( Nav );
state.registerComponent( Feed );
state.registerComponent( Grid );

var views = {'Static': require('./views/Static.js'),'View': require('./views/View.js'),'about': require('./views/about.js'),'contact': require('./views/contact.js'),'home': require('./views/home.js'),'news': require('./views/news.js'),'project': require('./views/project.js'),'search': require('./views/search.js'),'thoughts': require('./views/thoughts.js'),'work': require('./views/work.js')};

var redirectToFirstSlug = path => {
    
    return ( ctx, next ) => {
        
        return api( path, ctx.querystring, 0, 1 )
            .then( response => {
                
                var slug = response.articles[ 0 ].slug;
                
                page.redirect( ctx.path + '/' + slug );
                
            })
        
    }
    
}

page( '/', views.home );

page( '/work', views.work );
page( '/work/:slug', views.project );

page( '/thoughts', redirectToFirstSlug( '/thoughts' ) );
page( '/thoughts/:slug', views.thoughts );

page( '/news', redirectToFirstSlug( '/news' ) );
page( '/news/:slug', views.news );

page( '/about', redirectToFirstSlug( '/about' ) );
page( '/about/:slug', views.about );

page( '/contact', views.Static('Contact') );
page( '/sign-up', views.Static('Sign Up') );
page( '/cookie-policy', views.Static('Cookie Policy') );

page( '/search/:query', views.search );

page( '*', '/' );

page();