import connection from "@/utils/database";
import User from "@/models/user";

// Extract username from URL parameters
export const GET = async (req, { params }) => {
    const { username } = params;
    try {
        await connection();
        
        // Find the user by username
        const profileData = await User.findOne({ username: username }).lean(); // Lean for plain JS object
        
        if (!profileData) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(profileData), { status: 200 });
    } catch (error) {
        console.error("Database error:", error);
        return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
    }
};
