import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
    unique: [true, 'Username already exists!'],
    match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, 
            "Username invalid, it should contain 8-20 alphanumeric characters and be unique!"]
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },
  image: {
    type: String,  
  },
  totalSubs: {
    type: Number,  
    default: 0
  },
  mypodcast:[{
    type: Schema.Types.ObjectId,
    ref:'Podcast' // Arrat of ObjectIds referring to uploaded podcasts
  }],
  substo: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User'  // Array of ObjectIds referring to the users this user is subscribed to
  }],
  savedpodcasts: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Podcast'  // Array of ObjectIds referring to saved podcasts
  }]
});

const User = models.User || model("User", UserSchema);

export default User;
