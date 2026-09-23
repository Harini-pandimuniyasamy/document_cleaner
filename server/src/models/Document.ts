import mongoose, { Document as MongooseDoc, Schema, Types } from 'mongoose';

export interface IDocumentModel extends MongooseDoc {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  originalFileName: string;
  originalFilePath: string;
  originalFileType: string;
  originalFileSize: number;
  originalExtension?: string;
  originalGridFsId?: Types.ObjectId;
  cleanedFileName: string;
  cleanedFilePath: string;
  cleanedFileType: string;
  cleanedFileSize: number;
  cleanedPdfFileName?: string;
  cleanedPdfPath?: string;
  cleanedPdfSize?: number;
  cleanedPdfGridFsId?: Types.ObjectId;
  cleanedDocxFileName?: string;
  cleanedDocxPath?: string;
  cleanedDocxSize?: number;
  cleanedDocxGridFsId?: Types.ObjectId;
  cleanedTxtFileName?: string;
  cleanedTxtPath?: string;
  cleanedTxtSize?: number;
  cleanedTxtGridFsId?: Types.ObjectId;
  status: 'uploaded' | 'processing' | 'completed' | 'cleaned' | 'failed';
  ocrStatus?: 'pending' | 'completed' | 'skipped' | 'failed';
  cleaningStatus?: 'pending' | 'completed' | 'failed';
  errorMessage?: string;
  inputType: 'file' | 'text';
  fileType: string;
  fileSize: number;
  originalText?: string;
  cleanedText?: string;
  options?: string[];
  metrics?: {
    artifactsRemoved: number;
    spacesFixed: number;
    lineBreaksFixed: number;
    ocrCorrectionsCount: number;
    readabilityScoreBefore: number;
    readabilityScoreAfter: number;
  };
  previewInfo?: {
    pageCount: number;
    originalSnippet: string;
    cleanedSnippet: string;
  };
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  formattedSize?: string;
}

const documentSchema = new Schema<IDocumentModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },
    originalFilePath: {
      type: String,
      required: true,
    },
    originalFileType: {
      type: String,
      required: true,
      default: 'application/octet-stream',
    },
    originalFileSize: {
      type: Number,
      required: true,
      default: 0,
    },
    originalExtension: {
      type: String,
      default: '',
    },
    originalGridFsId: {
      type: Schema.Types.ObjectId,
      ref: 'document_files.files',
    },
    cleanedFileName: {
      type: String,
      default: '',
      trim: true,
    },
    cleanedFilePath: {
      type: String,
      default: '',
    },
    cleanedFileType: {
      type: String,
      default: 'application/octet-stream',
    },
    cleanedFileSize: {
      type: Number,
      default: 0,
    },
    cleanedPdfFileName: {
      type: String,
      default: '',
    },
    cleanedPdfPath: {
      type: String,
      default: '',
    },
    cleanedPdfSize: {
      type: Number,
      default: 0,
    },
    cleanedPdfGridFsId: {
      type: Schema.Types.ObjectId,
      ref: 'document_files.files',
    },
    cleanedDocxFileName: {
      type: String,
      default: '',
    },
    cleanedDocxPath: {
      type: String,
      default: '',
    },
    cleanedDocxSize: {
      type: Number,
      default: 0,
    },
    cleanedDocxGridFsId: {
      type: Schema.Types.ObjectId,
      ref: 'document_files.files',
    },
    cleanedTxtFileName: {
      type: String,
      default: '',
    },
    cleanedTxtPath: {
      type: String,
      default: '',
    },
    cleanedTxtSize: {
      type: Number,
      default: 0,
    },
    cleanedTxtGridFsId: {
      type: Schema.Types.ObjectId,
      ref: 'document_files.files',
    },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'completed', 'cleaned', 'failed'],
      default: 'uploaded',
      required: true,
      index: true,
    },
    ocrStatus: {
      type: String,
      enum: ['pending', 'completed', 'skipped', 'failed'],
      default: 'completed',
    },
    cleaningStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: 'application/octet-stream',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    inputType: {
      type: String,
      enum: ['file', 'text'],
      default: 'file',
      required: true,
    },
    originalText: {
      type: String,
      default: '',
    },
    cleanedText: {
      type: String,
      default: '',
    },
    options: {
      type: [String],
      default: [],
    },
    metrics: {
      artifactsRemoved: { type: Number, default: 0 },
      spacesFixed: { type: Number, default: 0 },
      lineBreaksFixed: { type: Number, default: 0 },
      ocrCorrectionsCount: { type: Number, default: 0 },
      readabilityScoreBefore: { type: Number, default: 60 },
      readabilityScoreAfter: { type: Number, default: 99 },
    },
    previewInfo: {
      pageCount: { type: Number, default: 1 },
      originalSnippet: { type: String, default: '' },
      cleanedSnippet: { type: String, default: '' },
    },
    processingStartedAt: {
      type: Date,
      default: Date.now,
    },
    processingCompletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'documents',
  }
);

// Virtual for formatted size
documentSchema.virtual('formattedSize').get(function () {
  const size = this.cleanedFileSize || this.originalFileSize || this.fileSize || 0;
  const sizeInKb = size / 1024;
  return sizeInKb >= 1024
    ? `${(sizeInKb / 1024).toFixed(2)} MB`
    : `${Math.round(sizeInKb)} KB`;
});

// Auto-sync backward compatibility fields before saving
documentSchema.pre('save', async function (this: any) {
  if (!this.fileType && this.originalFileType) {
    this.fileType = this.originalFileType;
  }
  if (!this.fileSize && this.originalFileSize) {
    this.fileSize = this.originalFileSize;
  }
  if (this.status === 'completed' || this.status === 'cleaned') {
    // keep compatible
    if (!this.fileSize && this.cleanedFileSize) {
      this.fileSize = this.cleanedFileSize;
    }
  }
});

documentSchema.set('toJSON', { virtuals: true });
documentSchema.set('toObject', { virtuals: true });

export const Document = (mongoose.models.Document as mongoose.Model<IDocumentModel>) || mongoose.model<IDocumentModel>('Document', documentSchema);
export default Document;
