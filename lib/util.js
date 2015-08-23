module.exports = {
	error : function (code, str) {
		return {
			type: 'error',
			message: str,
			code: code
		}
	}
};
