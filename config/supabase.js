import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseBucket = process.env.SUPABASE_BUCKET;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function supabaseUpload(file, userId) {
    if (!file) throw new Error('No file provided');
    const filename = `${Date.now()}-${file.originalname}`;
    const objectPath = `${userId}/${filename}`;
    if (!objectPath) throw new Error('Invalid object path');

    const { data, error } = await supabase
        .storage
        .from(supabaseBucket)
        .upload(objectPath, file.buffer, { contentType: file.mimetype });

    if (error) {
        console.log('Supabase storage error:', error);
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

    console.log(data);

    return data;
}