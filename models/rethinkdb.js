var model = module.exports,
    r = require('rethinkdb');

model.setup = function () {
    console.log("[127.0.0.1 %s] Setting up RethinkDB...", new Date().toISOString());
    // does the notes table exist? if not, create it
    r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
        if(err) throw err;
        r.db('test').table('notes').run(conn, function(err, cursor) {
	    if(err) createNotesTable(conn);
	    r.db('test').table('counter').run(conn, function(err, cursor) {
                if(err) createCounterTable(conn);
            });
        });
    });
}

model.name = "RethinkDB Server Model";

function createNotesTable(conn) {
    r.db('test').tableCreate('notes').run(conn, function(err, result) {
        if (err) throw err;
    });
}

function createCounterTable(conn) {
    r.db('test').tableCreate('counter').run(conn, function(err, result) {
        if (err) throw err;
	r.db('test').table('counter').insert({id: 'counter', count: 0}).run(conn, function(err, result) {
	    if(err) throw err;
        });
    });
}

model.getNotes = function (done) {
    r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
	if(err) throw err;
	r.db('test').table('notes').run(conn, function(err, cursor) {
	    cursor.toArray(function(err, results) {
                if (err) throw err;
                done(!err, results);
            });
        });
    });
}

model.saveNote = function (note, done) {
    r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
        if(err) throw err;
        r.db('test').table('notes').insert(note).run(conn, function(err, results) {
            done(!err, 0);
        });
    });
}

model.updateNote = function (note, done) {
    r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
        if(err) throw err;
        r.db('test').table('notes').get(note.id).update(note).run(conn, function(err, results) {
            done(!err, 0);
        });
    });
}

model.getNoteByID = function (id, done) {
    r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
        if(err) throw err;
        r.db('test').table('notes').get(id).run(conn, function(err, cursor) {
            cursor.toArray(function(err, results) {
                if (err) throw err;
                done(!err, results);
            });
        });
    });
}

model.getNewId = function (done) {
     r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
        if(err) throw err;
        r.db('test').table('counter').get("counter").update({count: r.row("count").add(1)}, {returnChanges: true}).run(conn, function(err, result) {
            done(!err, result.changes[0].new_val.count);
        });
    });
}

model.deleteNoteByID = function (id, done) {
    r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
        if(err) throw err;
        r.db('test').table('notes').get(id).delete().run(conn, function(err, res) {
            if (err) throw err;
            done(!err, 0);
        });
    });
}
