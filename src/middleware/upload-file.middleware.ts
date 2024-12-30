import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { extension as mimeExtension } from 'mime-types';
import { MiddlewareInterface } from './middleware-interface.js';
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_UPLOAD_DIR = 'uploads/avatars';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(DEFAULT_UPLOAD_DIR)) {
      fs.mkdirSync(DEFAULT_UPLOAD_DIR, { recursive: true });
    }
    cb(null, DEFAULT_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueName = nanoid();
    let ext = mimeExtension(file.mimetype);

    if (!ext) {
      ext = path.extname(file.originalname).replace('.', '');
    }

    cb(null, `${uniqueName}.${ext}`);
  }
});

const upload = multer({ storage });

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private fieldName: string
  ) {}

  public execute(req: Request, res: Response, next: NextFunction): void {
    upload.single(this.fieldName)(req, res, (err: unknown) => {
      if (err) {
        return res.status(400).json({ error: (err as Error).message });
      }
      return next();
    });
  }
}
