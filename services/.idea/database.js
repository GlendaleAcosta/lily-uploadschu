
var fs = require('fs');
var util = require('util');
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
assert = require('assert');

// Connection url
var url = 'mongodb://localhost';

var insertArt = function(info, db, callback) {

    var collection = db.collection('anime');

    // Insert some documents
    collection.insertMany([
        info
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        callback(result);
    });
};
var insertArtWrapper = function(info) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('LilyArt');

        assert.equal(null, err);
        insertArt(info, db, function() {
            client.close();
        });
    });
};

var removeOneArt = function(condition, db, callback) {

    var collection = db.collection('LilyArt');

    collection.remove(condition, function(err, results) {
        assert.equal(err, null);

        if(callback)
            callback(results);
    })

};

var removeOneArtWrapper = function(condition) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('LilyArt');

        assert.equal(null, err);

        removeOneArt(condition, db, function() {
            client.close();
        });

    });
};

exports.insertArt = insertArtWrapper;
exports.removeOneArt= removeOneArtWrapper()