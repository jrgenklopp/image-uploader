var sidebar = require('../helpers/sidebar');
ImageModel = require('../models').Image;
var viewModel = {
	images: []
};
	

module.exports = {
	index(req,res) {
		
		ImageModel.find({}, {}, { sort: { timestamp: -1 } },
 		(err, images) => {
 			if (err) { throw err; }
 			viewModel.images = images;
 			

 			
 			just =[]
 			sidebar(viewModel, (viewModel) => {

 				

 				for(i=0;i<viewModel.images.length; i++){

 					just.push({views: viewModel.images[i].views, filename: viewModel.images[i].filename,
 						title: viewModel.images[i].title, uniqueId: viewModel.images[i]._id, })

 				}
 			just.push(viewModel.sidebar.stats)
			console.log(viewModel.sidebar.stats)
			res.render('index', {images: just, stats: viewModel.sidebar.stats});
 			});
 		});

	}
}