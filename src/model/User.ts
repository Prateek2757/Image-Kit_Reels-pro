import mongoose, { Schema ,Document } from "mongoose";
import bcrypt from "bcryptjs"

export interface User extends Document {
  email: string;
  password: string;
  userId:string,
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema<User> = new Schema(
    {
  email: {
    type: String,
    required:true,
    unique : true,
    match : [/.+\@.+\..+/, "please Use a vaild email"],
  },
  password : {
    type : String,
    required : true
  },
},{timestamps:true}
);

UserSchema.pre("save" , async function (next){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password , 10)
  }
  next()
} )

const User =mongoose.models.User || mongoose.model<User>("User", UserSchema)

export default User;