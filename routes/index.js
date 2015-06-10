var notesController = require('../controllers/notes');

module.exports = function (app) {
    app.get('/', function (req, res) {
        app.get("model").getNotes(function (success, result) {
            res.render('index', {
                notes: result
            });
        });
    });

    app.get('/notes', function (req, res) {
        notesController.getNotes(req, res, app.get("model"));
    });

    app.get('/note/:id', function (req, res) {
        notesController.getNote(req, res, app.get("model"));
    });

    app.post('/notes', function (req, res) {
        notesController.createNote(req, res, app.get("model"));
    });

    app.post('/note/:id', function (req, res) {
        notesController.updateNote(req, res, app.get("model"));
    });

    app.delete('/note/:id', function (req, res) {
        notesController.deleteNote(req, res, app.get("model"));
    });
};

//      API:
//
//      GET     /               Homepage
//      GET     /notes          All notes in JSON
//      POST    /notes          Create new note
//      GET     /note/:id       Get note in JSON by ID
//      POST    /note/:id       Update note position
//      DELETE  /note/:id       Delete note
//
