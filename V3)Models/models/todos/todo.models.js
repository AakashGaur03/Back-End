import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subTodos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTodo',
      },
    ],
    // subTodos is array of subTodo
  },
  { timestamps: true }
);

export const Todo = mongoose.model('Todo', todoSchema);

// type:mongoose.Schema.Types.ObjectId
// When mongoose see the type as mongoose.Schema.Types.ObjectId
// Then it understands that we are giving it a reference of different model
// in ref  the name of model is given that we are referncing to mongoose.model('User', userSchema);  Here it is User
