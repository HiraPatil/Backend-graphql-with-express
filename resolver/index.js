import { userQueries, userMutation } from "./User";

const resolvers = {
  Query: {
    ...userQueries,
  },

  Mutation: {
    ...userMutation,
  },
};

export default resolvers;
