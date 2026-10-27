import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';
import { AppError } from '../middleware/errorHandler.js';

export async function extractTextFromFile(
  buffer: Buffer,
  originalFilename: string
): Promise<string> {
  const ext = path.extname(originalFilename).toLowerCase();
  let extractedText = '';

  try {
    if (ext === '.pdf') {
      const data = await pdfParse(buffer);
      extractedText = data.text || '';
    } else if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || '';
    } else {
      throw new AppError('Unsupported file format for parsing.', 400, 'UNSUPPORTED_FORMAT');
    }
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error(`Failed to parse file ${originalFilename}:`, error.message);
    throw new AppError(
      'Could not extract text from the uploaded resume. Please verify the file is not corrupted or password-protected.',
      422,
      'RESUME_PARSE_FAILED'
    );
  }

  // Clean extracted text (remove excessive null chars or control characters)
  const cleaned = extractedText
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .trim();

  if (cleaned.length < 50) {
    throw new AppError(
      'The uploaded document contains insufficient readable text. Please ensure it is a text-based resume (not a scanned image).',
      422,
      'EMPTY_OR_SCANNED_RESUME'
    );
  }

  return cleaned;
}
