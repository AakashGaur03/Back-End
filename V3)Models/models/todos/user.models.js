import mongoose from 'mongoose';

// new mongoose.Schema({}) Way to create a new Schema {} beacuse it takes object
// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   isActive: Boolean,
// });
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // required: [true, 'Password is Required'], // Now when password is  not there the custom message is shown
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);

// { timestamps:true} It add two fields automatically that is createAt and updatedAt

// mongoose.model('User', userSchema);
// Here is the name of schema in mongoose 'User'
// and
// userSchema is the Schema that 'User' is based on
