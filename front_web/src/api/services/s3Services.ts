import axios from 'axios';

const BASE_URL = 'http://localhost:8082';

export const uploadImageToS3 = async (file: File, token: string): Promise<string> => {
  // Generar key única (por ejemplo por usuario + timestamp)
  const uniqueKey = `publicaciones/${Date.now()}-${file.name}`;

  // 1️⃣ Pide la URL prefirmada
  const presignedRes = await axios.post(
    `${BASE_URL}/s3/files/presigned-upload`,
    null,
    {
      params: { fileName: uniqueKey },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const uploadUrl = presignedRes.data;

  // 2️⃣ Sube el archivo directamente a S3
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  // 3️⃣ Devuelve la key (para guardarla en la publicación)
  return uniqueKey;
};
