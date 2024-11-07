import connection from "@/utils/database";
import Podcast from "@/models/podcast";

export const GET = async (req, { params }) => {
  try {
    await connection(); // Connect to the database

    // Fetch the specific podcast by ID
    const podcast = await Podcast.findById(params.podcastID)
      .populate("podcaster", "username image totalSubs");

    // If the podcast is not found, return a 404 response
    if (!podcast) {
      return new Response("Podcast not found", { status: 404 });
    }

    // Respond with the podcast data
    return new Response(JSON.stringify(podcast), { status: 200 });
  } catch (error) {
    console.error("Error fetching the podcast:", error);
    return new Response("An error occurred while processing your request", { status: 500 });
  }
};
