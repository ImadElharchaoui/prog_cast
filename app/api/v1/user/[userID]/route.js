import connection from "@/utils/database";
import User from "@/models/user";


export const GET = async (req, {params}) => {
    
    
    try {
        await connection();  // Connect to the database

       
        const user = await User.findById( params.userID ).populate("substo", "username");
        
        if (!user) {
            return new Response("Error user is not found", { status: 401 });
        }


       
        return new Response(
            JSON.stringify(user), 
            { status: 200 }
        );
        
        
    } catch (error) {
        console.error("Error logging in user:", error);
        return new Response("An error occurred while processing your request", { status: 500 });
    }
};
