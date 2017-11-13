const MyRESTService = require("../index.js");

const Demo3Service = function () {
	return new MyRESTService({
		args: {
			id: {
				type: "number",
				mandatory: true
			}
		},
		fn: (service, request, response) => {
			service.success({
				data: {
					removed: true
				}
			});
		}
	});
};

module.exports = Demo3Service;
