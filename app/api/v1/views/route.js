import connection from "@/utils/database";
import Podcast from "@/models/podcast";

export async function POST(req) {
  try {
    const { PodcastID } = await req.json(); // Extract data from JSON body
    await connection(); // Connect to the database

   
     await Podcast.findByIdAndUpdate(
      PodcastID,
      { $inc: { views: 1 } }) // Add to substo only if not present
     
   
    return new Response(JSON.stringify({ message: 'views successfully'}), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "An error occurred while processing your request" }), { status: 500 });
  }
}
