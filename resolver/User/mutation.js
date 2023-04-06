const User = mongoose.model("User");
import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as yup from "yup";
import { JWT_SECRET } from "./config.js";

const userMutation = {
    mutation : {
        signupUser: async (_, { userNew }) => {
            const user = await User.findOne({ email: userNew.email });
            if (user) {
              throw new Error("User already exists with that email");
            }
            if (
              !userNew.firstName ||
              !userNew.lastName ||
              !userNew.email ||
              !userNew.password
            ) {
              throw new ApolloError("All Fields Are Required");
            }
      
            const emailExpression =
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
            const isValidName = userNew.firstName.length;
      
            if (isValidName < 3 || isValidName > 30) {
              throw new ApolloError("your Name must be at least 3 character");
            }
      
            const isValidLname = userNew.lastName.length;
      
            if (isValidLname < 3 || isValidLname > 30) {
              throw new ApolloError("your Last Name must be at least 3 character");
            }
      
            const isValidEmail = emailExpression.test(
              String(userNew.email).toLowerCase()
            );
            if (!isValidEmail) throw new ApolloError("email not in proper format");
      
            const isValidpass = userNew.password.length;
            if (isValidpass < 5 || isValidpass > 30) {
              throw new ApolloError("your password must be at least 5 character");
            }
            const hashedPassword = await bcrypt.hash(userNew.password, 12);
      
            const newUser = new User({
              ...userNew,
              password: hashedPassword,
            });
            return await newUser.save();
          },
      
          signinUser: async (_, { userSignin }) => {
            console.log("called");
            const user = await User.findOne({ email: userSignin.email });
            if (!user) {
              throw new Error("User dosent exists with that email");
            }
      
            if (!userSignin.email || !userSignin.password) {
              throw new ApolloError("All Field are Required");
            }
      
            const doMatch = await bcrypt.compare(userSignin.password, user.password);
            if (!doMatch) {
              throw new Error("email or password in invalid");
            }
            const token = jwt.sign({ userId: user._id }, JWT_SECRET);
            return { token, firstname: user.firstName };
          },
    },
}

export default userMutation;
