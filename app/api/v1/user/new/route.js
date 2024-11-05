import connection from "@/utils/database";
import User from "@/models/user";
import bcrypt from 'bcrypt';

export const POST = async (req) => {
    const { email, username, password } = await req.json();
    const defaultImage = "https://cdn.futura-sciences.com/cdn-cgi/image/width=1760,quality=60,format=auto/sources/Elon%20Musk1.jpg";

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await connection();  // Connect to the database

        // Create new user
        const newUser = new User({ 
            email: email, 
            username: username, 
            password: hashedPassword, 
            image: defaultImage 
        });

        // Save user to the database
        await newUser.save();

        // Return only userID (_id) in the response
        return new Response(
            JSON.stringify({ userID: newUser._id }),  // Send userID
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Failed to create a new user", { status: 500 });
    }
};
