import express from "express";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

const server = new ApolloServer({
  schema: buildSubgraphSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

await server.start();

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const auth = req.headers.authorization;
      const token = auth?.startsWith("Bearer ") ? auth.split(" ")[1] : undefined;
      return { req, res, token };
    },
  }),
);

app.get("/", (req, res) => {
  res.send("Product's subgraph is running");
});

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Product's subgraph is running on port ${PORT}`);
});
