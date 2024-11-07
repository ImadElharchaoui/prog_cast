// pages/api/files/content.js
import fs from 'fs';


export const GET = async (req, { params }) => {
  const filePath = params.filePath;

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return new Response(JSON.stringify({ content }), {status:200});
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify(error), {status:500});
  }
}
