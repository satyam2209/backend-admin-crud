const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const notesRoutes = require('./routes/notes');
const adminRoutes = require('./routes/admin');

// set the default template engine is ejs
app.set('view engine', 'ejs');
// set the template engines files in views folder
app.set('views', 'views');


// this is for passing data of form to request body
app.use(bodyParser.urlencoded({extended: false}));
// configure middleware for directly use of public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(notesRoutes);
// the only routes whose prefix is /admin and also by default add /admin
app.use('/admin', adminRoutes);

app.use('/', (req, res, next) => {
    res.render('404', {
        pageTitle: 'Page not found',
        path: '',
    });
});

app.listen(4000);