import { Schema, model, models } from 'mongoose';

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // References the User who liked
    required: true,
  },
  type: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // References the User who made the comment
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PodcastSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  audioFile: {
    type: String,  // URL to the audio file
    required: true,
  },

  programmingFiles: [{ 
    type: String,  // URLs to associated programming files
  }],

  image: {
    type: String,  // URL to the podcast cover image
  },

  categories: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Category'  // References to Category documents
  }],

  podcaster: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // References the User (podcaster)
    required: true,
  },

  likes: [LikeSchema],  // Array of embedded Like documents
  comments: [CommentSchema],  // Array of embedded Comment documents
  createdAt: {
    type: Date,
    default: Date.now,
  },

  views: {
    type: Number,
    default: 0
  }
});

const Podcast = models.Podcast || model("Podcast", PodcastSchema);

export default Podcast;
