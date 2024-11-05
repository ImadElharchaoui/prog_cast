// app/api/v1/user/profile/[username]/podcasts.js
import connection from "@/utils/database";
import Podcast from "@/models/podcast";
import User from "@/models/user";

export const GET = async (req, { params }) => {
  try {
    await connection(); // Connect to the database

    // Assuming username is unique and you can get the user ID from it
    const user = await User.findOne({ username: params.username });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Fetch podcasts associated with the user
    const podcasts = await Podcast.find({ podcaster: user._id });

    return new Response(JSON.stringify(podcasts), { status: 200 });
  } catch (error) {
    console.error("Error fetching user's podcasts:", error);
    return new Response("An error occurred while processing your request", { status: 500 });
  }
};
