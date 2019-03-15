const Datastore = require('nedb');
const db = new Datastore({ filename: __dirname + '/demo.db', autoload: true });

const loadDatabase = function(callback) {
	db.loadDatabase(callback);
};
const insert = function(data, callback) {
	db.insert(data, callback);
};
const count = function(data, callback) {
	db.count(data, callback);
};
const find = function(data) {
	return db.find(data);
};

module.exports = {loadDatabase, insert, count, find};
