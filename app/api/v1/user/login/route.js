import connection from "@/utils/database";
import User from "@/models/user";
import bcrypt from 'bcrypt';

export const POST = async (req) => {
    const { email, password } = await req.json();
    
    try {
        await connection();  // Connect to the database

        // Find the user by email
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return new Response("Email or password is incorrect!", { status: 401 });
        }

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            return new Response(
                JSON.stringify({ userID: user._id }),  // Return the user's ID
                { status: 200 }
            );
        } else {
            return new Response("Email or password is incorrect!", { status: 401 });
        }
        
    } catch (error) {
        console.error("Error logging in user:", error);
        return new Response("An error occurred while processing your request", { status: 500 });
    }
};
