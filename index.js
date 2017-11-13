const moment = require('moment');

/**
 * MyRESTService
 * @param	_config
 */
const MyRESTService = function (_config) {
	const _service = this;
	const defaults = {
		args: {},
		prettyJSON: false,
		fn: (service, request, response) => service.success(response),
		hasAccess: (service, request, callback) => {
			callback(true, true); //loggedIn, hasAccess
		}
	};
	const config = Object.assign(defaults, _config);
	/**
	 * roundTo
	 * @param	value
	 * @param	decimalPrecision
	 * @return	number
	 */
	const roundTo = (value, decimalPrecision) => {
		let parsed = value;
		if(!!parsed && !!decimalPrecision) {
			const multiplier = Math.pow(10, decimalPrecision);
			parsed = Math.round(parsed * multiplier) / multiplier;
		}
		return parsed;
	};
	/**
	 * parseValue
	 * @param	value
	 * @param	type
	 * @param	parameterConfig
	 * @return	object
	 */
	const parseValue = (value, type, parameterConfig) => {
		let parsed = "";
		let withError = false;
		switch(type) {
			case "int":
			case "integer":
				parsed = undefined === value ? undefined : parseInt(value, 10);
				withError = undefined === value ? false : Number.isNaN(parsed);
				break;
			case "float":
			case "double":
			case "decimal":
				parsed = undefined === value ? undefined : parseFloat(value);
				withError = undefined === value ? false : Number.isNaN(parsed);
				parsed = roundTo(parsed, parameterConfig.decimalPrecision);
				break;
			case "number":
				parsed = undefined === value ? undefined : Number(value);
				withError = undefined === value ? false : Number.isNaN(parsed);
				parsed = roundTo(parsed, parameterConfig.decimalPrecision);
				break;
			case "date":
				parsed = undefined === value ? undefined : moment(value);
				withError = undefined === value ? false : "Invalid date" === String(parsed);
				break;
			case "bool":
			case "boolean":
				parsed = undefined === value ? 
					undefined 
				: 
					(value === "false" || value === "null" || value === "0" || !value) ? 
						false 
					: 
						true;
				break;
			case "string":
				parsed = !!value ? String(value) : undefined;
				break;
			case "object":
				parsed = undefined === value ? undefined : Object.assign({}, value);
				withError = undefined === value ? false : "object" !== typeof value;
				break;
			case "array":
				parsed = undefined === value ? undefined : Object.assign([], value);
				withError = undefined === value ? false : !Array.isArray(value);
				break;
			default:
				parsed = value;
				break;				
		}
		return {parsed, withError};
	};
	/**
	 * call
	 * @param	request
	 * @param	response
	 */
	this.call = function(request, response) {
		const service = {
			args: {},
			headers: request.headers || {},
			success: (content) => _service.success(content, response),
			failure: (content) => _service.failure(content, response)
		};
		config.hasAccess(service, request, (loggedIn, hasAccess) => {
			if(!loggedIn || !hasAccess) {
				_service.failure({
					status: loggedIn ? 403 : 401,
					message: loggedIn ? "Unauthorized" : "Unauthenticated",
					errors: ["Access Prohibited"],
					headers: {
						"WWW-Authenticate": 'Token realm="Access to the system"'
					}
				}, response);
			}
			else {
				let withError = false;
				const errors = [];
				const query = request.method === "GET" ? request.query : request.body;
				const keys = Object.keys(config.args);
				for(let i = 0; i < keys.length; i++) {
					const key = keys[i];
					//mandatory
					const arg = config.args[key];
					if(arg === true || (!!arg && typeof arg === "object" && !!arg.mandatory)) {
						if(!query[key]) {
							withError = true;
							errors.push("Mandatory parameter '" + key + "' is missing");
						}
					}
					//type
					let type = "string";
					if(typeof arg === "string") {
						type = arg;
					}
					else if(!!arg && typeof arg === "object" && !!arg.type) {
						type = arg.type;
					}
					let value = parseValue(query[key], type, arg);
					if(value.withError) {
						withError = true;
						errors.push("Unable to parse parameter '" + key + "' with value '" + query[key] + "' to type '" + type + "'");
					}
					service.args[key] = value.parsed;
				}
				if(!withError) {
					config.fn(service, request, response);
				}
				else {
					_service.failure({
						status: 400,
						message: "Bad Request",
						errors
					}, response);
				}
			}
		});
	};
	/**
	 * success
	 * @param	content
	 * @param	request
	 */
	this.success = function(content, response) {
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.end(JSON.stringify(content || {}, null, config.prettyJSON ? 4 : undefined));
	};
	/**
	 * failure
	 * @param	error
	 * @param	request
	 */
	this.failure = function(error, response) {
		const data = {
			error: true,
			status: "object" === typeof error ? error.status : "500",
			errors: error.errors || [],
			message: ("object" === typeof error ? error.message : String(error)) || "Unhandled exception"
		};
		response.writeHead(
			data.status, 
			Object.assign(
				{'Content-Type': 'application/json'}, 
				"object" === typeof error ? error.headers || {} : {}
			)
		);
		response.end(JSON.stringify(data, null, config.prettyJSON ? 4 : undefined));
	};
};

module.exports = MyRESTService;