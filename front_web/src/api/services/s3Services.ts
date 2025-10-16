import axios from 'axios';
import {UrlPerfil} from '../types/UserTypes'
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

  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  return uniqueKey;
};

export const obtenerUrlImagen = async (token: string, key: string): Promise<UrlPerfil> => {
  const response = await axios.post(
    `${BASE_URL}/s3/download/presigned`,
    { urlkey: key }, // 👈 el cuerpo que espera tu backend
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};


// http://localhost:8082/s3/download/presigned
