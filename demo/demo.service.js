const MyRESTService = require("../index.js");

const DemoService = function () {
	return new MyRESTService({
		args: {
			a: null, //string not mandatory
			b: true, //string mandatory
			c: false, //string not mandatory
			d: "number", //number not mandatory
			e: { //number mandatory
				type: "number",
				mandatory: true,
				decimalPrecision: 2
			}
		},
		fn: (service, request, response) => {
			service.success({
				data: service.args
			});
		}
	});
};

module.exports = DemoService;
