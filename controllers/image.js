const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
Models = require('../models');
var sidebar = require('../helpers/sidebar');
var md5 = require('MD5');


module.exports= {

	index: (req, res)=> {

		var viewModel = {
			image: {},
			comments: []
 		};


		Models.Image.findOne({
 			filename: { $regex: req.params.image_id }
 			},(err, image) => {
 			
 			if (err) { throw err; }

 			if (image) {
 				image.views = image.views + 1;
				viewModel.image = image;
				image.save(); 

				Models.Comment.find({ image_id: image._id }, {}, {sort: {'timestamp': 1}},(err, comments) => {
 					viewModel.comments = comments;
 					sidebar(viewModel, (viewModel) => {
 						

 						

 						title = viewModel.image.title;
 						description = viewModel.image.description;
 						filename = viewModel.image.filename;
 						uniqueId = viewModel.image._id;
 						likes = viewModel.image.likes;
 						views = viewModel.image.views;
 						timestamp = viewModel.image.timestamp;

 						just = []
 						for(i=0; i<viewModel.comments.length; i++){
 							just.push({email:viewModel.comments[i].email,
 										name: viewModel.comments[i].name,
 										comment: viewModel.comments[i].comment,
 										timestamp: viewModel.comments[i].timestamp,
 										 })
 						}
 					
 						res.render('image', {title,description,filename,uniqueId,likes,views,timestamp, stats: viewModel.sidebar.stats,
 							comments: just});
 				});
 			});

 			} else {
 		res.redirect('/');
 		}
 	});


	},

	create(req,res,next){

		
		var form = new formidable.IncomingForm();

		form.parse(req, (err, fields, files) => {
			//console.log(fields)
			//res.send(files)

			let possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
			imgUrl = '';

			for(let i=0; i < 6; i+=1) {
 				imgUrl += possible.charAt(Math.floor(Math.random() *
				possible.length));
			}



			const tempPath = files.file.path,
			ext = path.extname(files.file.name).toLowerCase(),
			targetPath = path.resolve(`./public/upload/${imgUrl}${ ext}`);

			console.log(tempPath, ext, targetPath)

			var bool = false;
			if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext ==='.gif'){
				bool = true;
			}

			if (bool == false){
				fs.unlink(tempPath, () => {
 					if (err) throw err;
 					res.json(500, { error: 'Only image files are allowed.' });
 				});
			}

			else {

				console.log('in accepted')
 				fs.rename(tempPath, targetPath, (err) => {
 					if (err) throw err;
 						var newImg = new Models.Image({
 					title: fields.title,
 					filename: imgUrl + ext,
 					description: fields.description
 				});

 				newImg.save((err, image) => {
 					res.redirect(`/images/${image.uniqueId}`);
 				});
 					});
				}
			
		})


	},

	like (req, res) {
 		Models.Image.findOne({filename: {$regex: req.params.image_id}}, function(err, image){
			if(!err && image){
				image.likes = image.likes + 1;
				image.save(function(err, image){
					if(err){
						res.json(err);
					} else{
						res.json({likes: image.likes});
					}
				});
			}
		});
 	},

 	comment(req, res) {
 		Models.Image.findOne({filename: {$regex: req.params.image_id}}, function(err, image){
			if(!err && image){
				console.log('here in comment')
				var form = new formidable.IncomingForm();

				form.parse(req, (err, fields, files)=> {
					
					var newComment = new Models.Comment({
						email: fields.email,
						name: fields.name,
						comment: fields.comment
					});

					newComment.gravatar = md5(newComment.email);
					newComment.image_id = image._id;
					newComment.save(function(err, comment){
					if(err){
						throw err;
					}
				})
				
					res.redirect('/images/' + req.params.image_id );
				});
			} else{
				res.redirect('/');
			}
		});
 	} 
}