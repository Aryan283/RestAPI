const express = require("express");
const router = express.Router();
// it provides us with the utility to express different routes and their endpoints
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products')





const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },

    filename: function(req, file, cb){
            cb(null, new Date().toISOString() + file.originalname);
    }
});

// function to accept/reject the files that are to be uploaded (does not save it)
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png'){
        cb(null, true);  // accepts the file
    } else{
        cb(null, false); // rejects the file
    }
    
   
}

//function to upload the files
const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5 //measured in bytes so 1024 * 1024 bytes = 1 megabyte
},
  fileFilter: fileFilter

});

// / -> root
// /a -> in (a)
// . -> THIS dir path
// /a/./ -> still in /a
// /a/./b -> in /a/b
// .. -> go "up" one level   the one we're using
// /a/./b/.. -> /a/b/.. -> /a
// /a/./b/../.. -> /a/.. -> /
// /a/./b/../../c -> /c

router.get('/', ProductController.products_get_all);

router.post("/",checkAuth ,upload.single('urImage') ,ProductController.product_create_product);

router.get('/:productId', checkAuth, ProductController.orders_get_orders);
  


router.patch('/:productId', ProductController.orders_patch_orders);



router.delete('/:productId', ProductController.orders_delete_orders);

module.exports = router;


