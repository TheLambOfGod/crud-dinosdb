const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
//TODO: remove fs and use sequelize instead
const db = require('./models');
const methodOverride = require('method-override');
const port = 8001;

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/', function( req, res) {
    res.render('index');
});

//GET /dinosaurs - index route - gets ALL dinos
app.get('/dinosaurs', function(req, res) {
    db.dinosaur.findAll().then(function(dinosaurs) {
    // TODO:remove file system stuff and use sequelize functions
    res.render('dinos/index.ejs', {dinosaurs});
});
});

//GET /dinosaurs/new - serve up our NEW dino form
app.get('/dinosaurs/new', function(req, res) {
    res.render('dinos/new');
});


//GET /dinosaurs/:id/edit - serve up our NEW dino form
app.get('/dinosaurs/:id/edit', function(req, res) {
    db.dinosaur.findByPk(parseInt(req.params.id))
        .then(function(dinosaur) {
            res.render('dinos/edit', {dinosaur: dinosaur})
        });
    });


//GET /dinosaurs/:id - show route - gets ONE dino
app.get('/dinosaurs/:id', function(req, res) {
    //the below can be swapped with findByPk, but here for demonstration
    db.dinosaur.findOne({
        where: {id: parseInt(req.params.id)}
    })
        .then(function(dinosaur) {
            res.render('dinos/show', {dino: dinosaur});
        });

});

//POST /dinosaurs
app.post('/dinosaurs', function(req, res) {
    db.dinosaur.create({
        type: req.body.dinosaurType,
        name: req.body.dinosaurName
    })
        .then(function(data) {
            res.redirect('/dinosaurs');
        });
});

app.delete('/dinosaurs/:id', function(req, res) {
    db.dinosaur.destroy({
        where: {id: parseInt(req.params.id)}
      }).then(function(data) {
        res.redirect('/dinosaurs');
      });
});

app.put('/dinosaurs/:id', function(req, res) {
    db.dinosaur.update({
        name: req.body.dinosaurName,
        type: req.body.dinosaurType
    }, {
        where: {id: parseInt(req.params.id)}
    }).then(function(dino) {
       res.redirect("/dinosaurs/" + req.params.id);

    });
});




app.listen(port, function() {
    console.log("We are listening on port: 💩 " + port);
});



