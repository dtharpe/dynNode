var fs = require("fs");

var mergeValues = function(values, content){
	for (var key in values){
		content = content.replace("{{" + key + "}}", values[key]);
	}
	return content;
};

var view = function(templateName, values, response){
	var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: "utf8"});
	fileContents = mergeValues(values, fileContents);
	response.write(fileContents);
};

module.exports.view = view;