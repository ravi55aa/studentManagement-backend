import { CloudinaryStorage } 
    from "multer-storage-cloudinary";
import multer 
    from "multer";
import cloudinary 
    from "./cloudinary.config";




const storage = new CloudinaryStorage({
    
    cloudinary,
    params: async (req, file) => {
        let folder = "school_docs";

        
        if (file.mimetype.includes("image")) folder = "school_images";
        if (file.mimetype.includes("pdf")) folder = "school_pdfs";

        return {
        folder,
        public_id: `${Date.now()}-${file.originalname
                                                .toLowerCase()
                                                    .replace(/\s+/g, "_")}`,
        resource_type: "auto", //allows PDF, image, video
        };
    },
});
export const uploadCloud=multer({storage});








