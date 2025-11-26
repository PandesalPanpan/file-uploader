import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseBucket = process.env.SUPABASE_BUCKET;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function supabaseUpload(file, userId) {
    if (!file) throw new Error('No file provided');
    const safeBase = sanitizeFilename(file.originalname);
    const filename = `${Date.now()}-${safeBase}`;
    const objectPath = `${userId}/${filename}`;
    if (!objectPath) throw new Error('Invalid object path');
    const { data, error } = await supabase
        .storage
        .from(supabaseBucket)
        .upload(objectPath, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) {
        console.error('Supabase storage error:', error);
        throw error;
    }
    return data;
}

export async function supabaseDelete(filePath) {
    const { data, error } = await supabase
        .storage
        .from(process.env.SUPABASE_BUCKET)
        .remove([filePath])

    if (error) {
        console.error("Error deleting file: ", error);
        throw error;
    }

    return data;
}

function sanitizeFilename(name) {
  if (!name) return `${Date.now()}`;
  // replace characters that commonly cause "Invalid key" errors
  // allow letters, numbers, dot, dash, underscore, parentheses; convert spaces to _
  const cleaned = name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9.\-_\(\)]/g, '_')
    // limit length so keys don't get overly long
    .slice(0, 200);
  return cleaned;
}
