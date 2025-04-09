import express from "express";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";
import { AuthTypeDefs } from "./graphql/auth/auth.schema";
import { AuthResolver } from "./graphql/auth/auth.resolver";
import { UserTypeDefs } from "./graphql/users/user.schema";
import { UserResolver } from "./graphql/users/user.resolver";

const server = new ApolloServer({
  schema: buildSubgraphSchema([
    {
      typeDefs: AuthTypeDefs,
      resolvers: AuthResolver,
    },
    {
      typeDefs: UserTypeDefs,
      resolvers: UserResolver,
    },
  ]),
});

await server.start();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req, res }) => ({ req, res }),
  })
);

app.get("/", (req, res) => {
  res.send("Auth subgraph is running");
});

const PORT = 4001;

app.listen(PORT, () => {
  console.log(`User's subgraph is running on port ${PORT}`);
});
