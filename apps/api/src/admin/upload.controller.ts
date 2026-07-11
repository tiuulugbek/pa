import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { diskStorage, type Options as MulterOptions } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const uploadDirectory = join(process.cwd(), 'uploads');
mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['application/pdf', '.pdf'],
]);

const storage = diskStorage({
  destination: uploadDirectory,
  filename: (_req, file, callback) => {
    const safeExtension = allowedMimeTypes.get(file.mimetype);
    if (!safeExtension) {
      callback(new BadRequestException('Unsupported file type'), '');
      return;
    }
    callback(null, `${randomUUID()}${safeExtension}`);
  },
});

const multerOptions: MulterOptions = {
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
  fileFilter: (_req, file, callback) => {
    const expectedExtension = allowedMimeTypes.get(file.mimetype);
    const suppliedExtension = extname(file.originalname).toLowerCase();

    if (!expectedExtension) {
      callback(new BadRequestException('Unsupported file type'));
      return;
    }

    if (file.mimetype === 'image/jpeg') {
      if (!['.jpg', '.jpeg'].includes(suppliedExtension)) {
        callback(new BadRequestException('Unsupported JPEG extension'));
        return;
      }
    } else if (suppliedExtension !== expectedExtension) {
      callback(new BadRequestException('Unsupported file extension'));
      return;
    }

    callback(null, true);
  },
};

interface UploadedFileMeta {
  filename: string;
}

@Controller('admin/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadOne(@UploadedFile() file?: UploadedFileMeta) {
    if (!file) throw new BadRequestException('File is required');
    return { url: `/uploads/${file.filename}` };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  uploadMany(@UploadedFiles() files?: UploadedFileMeta[]) {
    if (!files?.length) throw new BadRequestException('At least one file is required');
    return { urls: files.map((file) => `/uploads/${file.filename}`) };
  }
}
