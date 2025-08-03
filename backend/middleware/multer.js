import multer from "multer"   ;    // multer is a middleware for handling multipart/form-data, used for file uploads.

// diskStorage means the files will be stored on the server’s disk (local storage).
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname)
 // callback(null, file.originalname) sets the uploaded file's name to its original name (file.originalname).       
    }
});

const upload = multer({ storage: storage })

export default upload

// I have to check what will happen if we are 2 iamge with same name  -> might be a fault over here  


/* 

multer.diskStorage({}) is a function that allows customization of how and where files should be stored.
The filename function determines the name of the uploaded file:
It takes req (request object), file (the uploaded file), and callback as parameters.
The callback function is used to set the filename.
callback(null, file.originalname) ensures that the uploaded file keeps its original name instead of being renamed.

*/


/* 

one more important thing -> 
   
When you're using a file upload middleware like Multer in an Express app, it automatically saves the file to a specific path on the server's filesystem (usually in a temporary directory).

Here's how the req.file object is structured and how you can get the path of the file.

see more in adminController.js

*/

