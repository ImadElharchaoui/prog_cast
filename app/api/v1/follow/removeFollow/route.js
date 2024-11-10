import connection from "@/utils/database";
import User from "@/models/user";

export async function POST(req) {
  try {
    const { userID, podcasterName } = await req.json(); // Extract data from JSON body
    await connection(); // Connect to the database

    // Find the user to unfollow by their username
    const personToUnfollow = await User.findOne({ username: podcasterName });
    if (!personToUnfollow) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Update the follower's `substo` array by removing the podcaster's ID if it's present
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { $pull: { substo: personToUnfollow._id } }, // Remove from substo if present
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: 'Follower not found' }), { status: 404 });
    }

    // Decrement the `totalSubs` count of the person being unfollowed
    await User.findByIdAndUpdate(personToUnfollow._id, { $inc: { totalSubs: -1 } });

    return new Response(JSON.stringify({ message: 'Unfollowed successfully', isFollowing: false }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "An error occurred while processing your request" }), { status: 500 });
  }
}
