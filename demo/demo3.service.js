const MyRESTService = require("../index.js");

var Datastore = require('nedb')
  , db = new Datastore({ filename: __dirname + '/demo.db', autoload: true });

const Demo3Service = function () {
	return new MyRESTService({
		args: {
			firstName: true,
			lastName: true
		},
		fn: (service, request, response) => {
			db.loadDatabase(function (error) {
				if(error) {
					service.failure({
						status: 500,
						massage: "Error loading database",
						errors: [error]
					});
				}
				else {
					db.insert({
						firstName: service.args.firstName,
						lastName: service.args.lastName
					}, (error, newDoc) => {
						if(error) {
							service.failure({
								status: 500,
								massage: "Error inserting into database",
								errors: [error]
							});
						}
						else {
							service.success({
								data: newDoc
							});
						}
					});
				}
			});
		}
	});
};

module.exports = Demo3Service;
