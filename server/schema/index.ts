import { makeExecutableSchema } from "@graphql-tools/schema";
import { IShot, IUser } from "@types";
import { readFileSync } from "fs";

const typeDefinitions = /* GraphQL */ `
  type User {
    authorid: String
    authorNick: String
    authorsAvatarUrl: String
    flickr: String
    twitter: String
    instagram: String
    steam: String
    othersocials: [String]
    shots: [Shot]
  }

  type Shot {
    gameName: String
    shotUrl: String
    height: String
    width: String
    thumbnailUrl: String
    author: String
    date: String
    score: String
    ID: String
    epochTime: String
    spoiler: Boolean
    colorName: String
    user: User
  }

  type Query {
    user(id: String): [User]
    shots(id: String, page: [Int]): [Shot]
  }
`;

const authordb: {
  _default: {
    [key: string]: IUser;
  };
} = JSON.parse(readFileSync("authorsdb.json", { encoding: "utf-8" }));

const shotsdb: {
  _default: {
    [key: string]: IShot;
  };
} = JSON.parse(readFileSync("shotsdb.json", { encoding: "utf-8" }));

const resolvers = {
  Query: {
    user: (parent: undefined, { id }: { id: string }) => {
      if (id) {
        return Object.values(authordb._default).filter(
          ({ authorid }) => authorid === id,
        );
      } else {
        return Object.values(authordb._default);
      }
    },
    shots: (
      parent: undefined,
      { id, page = [] }: { id: string; page: number[] },
    ) => {
      let filteredShots: IShot[] = Object.values(shotsdb._default).sort(
        (a, b) => b.epochTime - a.epochTime,
      );

      if (id) {
        filteredShots = [shotsdb._default[id]];
      }

      if (page.length >= 1) {
        filteredShots = filteredShots.slice(page[0], page[1]);
      }

      return filteredShots;
    },
  },
  Shot: {
    user: (shot: IShot) =>
      Object.values(authordb._default).find(
        (author) => author.authorid === shot.author,
      ),
  },
  User: {
    shots: (user: IUser) =>
      Object.values(shotsdb._default).filter(
        (shot) => shot.author === user.authorid,
      ),
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});
