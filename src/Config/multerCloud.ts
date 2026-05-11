import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { BadRequestError } from '@Middlewares/narrowDownErrors';

import cloudinary from './cloudinary.config';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'school_docs';
    let resource_type= 'auto';
    const limitFileSize = 10 * 1024 * 1024; // 5MB

    if (file.mimetype.includes('image')) folder = 'school_images';
    
    if (file.mimetype.includes('pdf')){
      folder = 'school_pdfs';
      resource_type = 'raw';
    }
    
    if(file.size>limitFileSize){
      throw new BadRequestError('File size limit is 5MB');
    };

    return {
      folder,
      // public_id: `${Date.now()}-${file.originalname.toLowerCase().replace(/\s+/g, '_')}`,
      resource_type, //allows PDF, image, video
    };
  },
});

export const uploadCloud = multer({ storage });
