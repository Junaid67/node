	var express = require('express')
	var app = express()
	var path = require('path');
 	var cheerio=require('cheerio');
	var request = require('request');
	var validUrl = require('valid-url');
	var async=require('async');
  	
	//string to save titles of pages
	var title=[];
	//counter to decide when to print data
	var count=0;
		
	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');

	//route for home page
	app.get('/', function (req, res) {
	  res.send('<h1>Home Page</h1>')
	})

	//route to get page address 
	app.get('/I/want/title',function(req,res){

	var address=[];
	address=req.query.address;
	//function to check whether the input is string or array
	async.parallel([
		function(){
	  if (typeof address === 'string' || address instanceof String){
	  		address=[];
            address.push(req.query.address);
        }
    },
		function(){
    for (var i=0;i<address.length;i++){
    if (validUrl.isUri(address[i])){
        console.log('Looks like an URI');
    } else {
    	title.push(address[i]+' ==> Not A Valid URL');
    	address.splice(i,1);
        console.log('Not a URI');
    }
	}
    },	
	//function to call get_title function on every given address
		function(){
		for(var i=0;i<address.length;i++){
  				request(address[i], function (error, response, html) {
			  var $ = cheerio.load(html);
			  console.log($('title').text());
			  title.push($('title').text());
				console.log("done");
				count+=1;//counter to count
				if(count==address.length){
				res.render('address', { titles: title });	
			}})
		}}
  //function to get titles
		])
});
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});
		// error handler
	app.use(function(err, req, res, next) {
	  // set locals, only providing error in development
	  res.locals.message = err.message;
	  res.locals.error = req.app.get('env') === 'development' ? err : {};
	  // render the error page
	  res.status(err.status || 500);
	  res.render('error');
	});
	//server listening at 3000
	app.listen(3000, function () {
	  console.log('App listening on port 3000!')
	});