import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.fieldname === 'profile'){
            cb(null, "/uploads/profiles")
        }
        if(file.fieldname === 'product'){
            cb(null, "/uploads/products")
        }
        if(file.fieldname === 'document'){
            cb(null, "/uploads/documents")
        }
        else{
            cb(null, "/uploads/others")
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: storage})

export default upload