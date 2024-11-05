import connection from "@/utils/database";
import User from "@/models/user";

export const GET = async (req, { params }) => {
  try {
    await connection();  // Connect to the database

    // Use findOne to search by username
    const user = await User.findOne({ username: params.username });

    if (!user) {
      return new Response("Error: User not found", { status: 404 }); // Return 404 if user is not found
    }

    return new Response(
      JSON.stringify(user), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response("An error occurred while processing your request", { status: 500 });
  }
};
