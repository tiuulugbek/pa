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
import { diskStorage } from 'multer';
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
  filename: (_req, file, cb) => {
    const safeExtension = allowedMimeTypes.get(file.mimetype);
    if (!safeExtension) {
      cb(new BadRequestException('Unsupported file type'), '');
      return;
    }
    cb(null, `${randomUUID()}${safeExtension}`);
  },
});

const multerOptions = {
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const expectedExtension = allowedMimeTypes.get(file.mimetype);
    const suppliedExtension = extname(file.originalname).toLowerCase();
    if (!expectedExtension || (file.mimetype !== 'image/jpeg' && suppliedExtension !== expectedExtension)) {
      callback(new BadRequestException('Unsupported file type or extension'), false);
      return;
    }
    if (file.mimetype === 'image/jpeg' && !['.jpg', '.jpeg'].includes(suppliedExtension)) {
      callback(new BadRequestException('Unsupported JPEG extension'), false);
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
