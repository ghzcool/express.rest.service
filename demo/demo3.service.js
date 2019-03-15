const MyRESTService = require("../index.js");
const DemoDatabase = require("./demo.database.js");

const Demo3Service = function () {
	return new MyRESTService({
		args: {
			firstName: true,
			lastName: true
		},
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
					DemoDatabase.insert({
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
