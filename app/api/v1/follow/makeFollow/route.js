import connection from "@/utils/database";
import User from "@/models/user";

export async function POST(req) {
  try {
    const { userID, podcasterName } = await req.json(); // Extract data from JSON body
    await connection(); // Connect to the database

    // Find the user to follow by their username
    const personToFollow = await User.findOne({ username: podcasterName });
    if (!personToFollow) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Update the follower's `substo` array, adding the podcaster's ID if it's not already there
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { $addToSet: { substo: personToFollow._id } }, // Add to substo only if not present
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: 'Follower not found' }), { status: 404 });
    }

    // Increment the `totalSubs` count of the person being followed
    await User.findByIdAndUpdate(personToFollow._id, { $inc: { totalSubs: 1 } });

    return new Response(JSON.stringify({ message: 'Followed successfully', isFollowing: true }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "An error occurred while processing your request" }), { status: 500 });
  }
}
