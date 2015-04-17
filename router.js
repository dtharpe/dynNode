var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var commonHeaders = {'Content-Type': 'text/html'};
var querystring = require("querystring");

var home = function(request, response){
	if(request.url === '/'){
		if(request.method.toLowerCase() === 'get'){
			response.writeHead(200, commonHeaders);
			renderer.view("header", {}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		}
		else{
			request.on("data", function(post_body){
				var query = querystring.parse(post_body.toString());
				response.writeHead(303, {"Location": "/" + query.username} );
				response.end();
			});

		}
	}
};

var user = function(request, response){
	var username = request.url.replace("/", "");
	if(username.length > 0){
		response.writeHead(200, commonHeaders);
		renderer.view("header", {}, response);

		var studentProfile = new Profile(username);
		
		studentProfile.on("end", function(prof_json){
			var values = {
				avatarURL: prof_json.gravatar_url,
				username: prof_json.profile_name,
				badges: prof_json.badges.length,
				javascriptPoints: prof_json.points.JavaScript
			};
			renderer.view("profile", values, response);
			renderer.view("footer", {}, response);
			response.end();
		});
		
		studentProfile.on("error", function(error){
			renderer.view("search", {}, response); 
			renderer.view("footer", {}, response);
			response.end();
		});
		
		
	}
};


module.exports.home = home;
module.exports.user = user;
