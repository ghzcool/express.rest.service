const MyRESTService = require("../index.js");
const DemoDatabase = require("./demo.database.js");
  
const Demo2Service = function () {
	return new MyRESTService({
		args: {
			limit: "int",
			start: "int"
		},
		prettyJSON: true,
		fn: (service, request, response) => {
			DemoDatabase.loadDatabase(function (error) {
				if(error) {
					service.failure({
						status: 500,
						massage: "Error loading database",
						errors: [error]
					});
				}
				else {
					DemoDatabase.count({}, function (error, count) {
						if(error) {
							service.failure({
								status: 500,
								massage: "Error count from database",
								errors: [error]
							});
						}
						else {
							DemoDatabase.find({})
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
