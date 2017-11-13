const MyRESTService = require("../index.js");

var Datastore = require('nedb')
  , db = new Datastore({ filename: __dirname + '/demo.db', autoload: true });
  
const Demo2Service = function () {
	return new MyRESTService({
		args: {
			limit: "int",
			start: "int"
		},
		prettyJSON: true,
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
					db.count({}, function (error, count) {
						if(error) {
							service.failure({
								status: 500,
								massage: "Error count from database",
								errors: [error]
							});
						}
						else {
							db.find({})
							.sort({lastName: 1})
							.skip(service.args.start || 0)
							.limit(service.args.limit || 10)
							.exec(function (error, docs) {
								if(error) {
									service.failure({
										status: 500,
										massage: "Error getting from database",
										errors: [error]
									});
								}
								else {
									service.success({
										items: docs,
										total: count
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

module.exports = Demo2Service;
