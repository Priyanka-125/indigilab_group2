
const express = require("express");
const fs = require('fs');
const axios = require('axios');
const bodyParser = require("body-parser");
const multer  = require('multer');
const maxSize = 1 * 1000 * 1000;
const app = express();
const ejs=require('ejs');
const pdf = require('pdf-poppler');
const FormData = require('form-data');
const patth = require('path')
const JSZip = require('jszip');
const zip = new JSZip();
var images=[]
let coun=0
var data =0;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(patth.join(__dirname, 'partial')))

const path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      //cb(null, file.fieldname + "-" + Date.now()+".pdf")
      cb(null, file.fieldname + ".pdf")

    }
  }) 
  var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){

        // Set the filetypes, it is optional
        var filetypes = /pdf/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } 

        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      }

// mypic is the name of file attribute
}).single("mypdf");
app.post("/uploadProfilePicture",function (req, res, next) {

    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req,res,function(err) {

        if(err) {

            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {

            // SUCCESS, image successfully uploaded
            res.redirect("/converttoimage");
          // const re = axios.post('http://localhost:3000/converttoimage', data);
        }
    })

})


//
app.get("/",(req,res)=>{
  Swal('Hello world!');
  //swal("Hello world!");
 res.sendFile(__dirname + "/partial/index.html");


 //fs.rmdir("./sample.zip");
})
app.get("/converttoimage",  (req, res) => {
  const filedest='./../../converted_images';
  fs.access(filedest, (error) => {

    // To check if the given directory
    // already exists or not
    if (error) {
      // If current directory does not exist
      // then create it
      fs.mkdir(filedest, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("New Directory created successfully !!");
      }
      });
    } else {
      console.log("Given Directory already exists !!");
    }
    });
  
    let file = "uploads/mypdf.pdf"
    console.log(file);

    let opts = {
      format: 'jpeg',
      out_dir: './../../converted_images',
      out_prefix: './'+ Date.now(),
      page: null
    }
    pdf.convert(file, opts)
      .then(res => {
        console.log('Successfully converted');
        
      })
      .catch(error => {
        console.error(error);
      })
      
      //res.redirect("/userdownload");
     // swal("Good job!", "Your Pdf is converted!", "success");
      res.redirect("/success.html");
      //const re = axios.post('http://localhost:3000/userdownload', data);
});
app.get("/success.html",(req,res)=>{
  
  res.sendFile(__dirname+"partial\success.html");
  setInterval(res.redirect("/"), 3000);
})
app.post("/final",(req,res)=>{
  
 res.redirect("/");
})
// app.get("/userdownload",(req,res)=>{
//   function added(v){
//   images.push(v);
// }
// fs.readdir(__dirname + "/destination", function (err, files) {
//     coun=files.length;
//      files.forEach(file => {
//        const str="./destination/" + file;
//        added(str);

//     })
// });
// if(images.length==0 ){
//   res.redirect("/userdownload");
//   //const re = axios.post('http://localhost:3000/userdownload', data);
// }
// else{
// console.log(images);
// try{
//     const img = zip.folder("destination");

//     for (const image of images) {
//         const imageData = fs.readFileSync(image);
//         img.file(image, imageData);
//     }

//     zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
//         .pipe(fs.createWriteStream('sample.zip'))
//         .on('finish', function () {
//             console.log("sample.zip written.");
//         });

// } catch (err) {
//     console.error(err)
// }


// images=[];
// console.log("conversion completed");
// res.redirect("/images");

// }
// })

// app.get("/user.html",(req,res)=>{
//   res.sendFile(__dirname +"/user.html");
// })
// app.get("/images",(req,res)=>{
 
  
// var folder = './destination/';
   
// fs.readdir(folder, (err, files) => {
//   if (err) throw err;
  
//   for (const file of files) {
//       console.log(file + ' : File Deleted Successfully.');
//       fs.unlinkSync(folder+file);
//   }
  
// });
// fs.unlinkSync("./uploads/mypdf.pdf");
// res.redirect("/user.html");
// //res.redirect("/");

// })
app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
