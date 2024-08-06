import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.fieldname === 'profile'){
            cb(null, "/uploads/profiles")
        }
        if(file.fieldname === 'product'){
            cb(null, __dirname + "../uploads/products")
        }
        if(file.fieldname === 'document'){
            cb(null, __dirname + "../uploads/documents")
        }
        else{
            cb(null, __dirname + "../uploads/others")
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}`)
    }
})

const upload = multer({storage: storage})

export default upload