import connection from "@/utils/database";
import User from "@/models/user";

export async function POST(req, res) {
    try {
        const { userID, podcasterName } = await req.json();
        await connection();

        const personToFollow = await User.findOne({ podcasterName });
        console.log(personToFollow)
        if (!personToFollow) {
        return res.status(404).json({ message: 'User not found' });
        }

        // Find if the followerID exists in the `substo` array of the user (personToFollow)
        const isFollowing = await User.exists({
        _id: userID,
        substo: personToFollow._id
        });

        return new Response(JSON.stringify({isFollowing:Boolean(isFollowing)}))
    } catch (error) {
        console.log(error)
        return new Response("An error occurred while processing your request", {status:500})
    }
    
    
}
