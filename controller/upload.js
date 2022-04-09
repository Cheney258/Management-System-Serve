const multer = require('multer')
const fs = require('fs')
const path = require('path');
const moment = require('moment');

const upload = multer({
	storage: multer.diskStorage({
		//设置文件存储位置
		destination: function (req, file, cb) {
            // console.log(file)
			let date = new Date();
			let year = date.getFullYear();
			let month = (date.getMonth() + 1).toString().padStart(2, '0');
			let day = date.getDate();
			// 设置存储路径，由于我的静态资源目录是设置的 public，所以设置在 public 文件下
      // console.log(file.fieldname)
			let dir = file.fieldname
			
			//判断目录是否存在，没有则创建
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, {
					recursive: true
				});
			}
			cb(null, dir);
		},
		//设置文件名称
		filename(req, file, cb) {
			// 重命名文件名，防止重复
			let fileName = file.fieldname + '-' + moment(Date.now()).format('YYYYMMDDHHmmss') + '-' + file.originalname
			cb(null, fileName);
		}
	})
});




module.exports=  upload;
