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
    resolvedGameName: String
  }

  type Query {
    user(id: String): [User]
    shots(id: String, page: [Int]): [Shot]
    games: [String]
  }
`;

const shotsJson = JSON.parse(
  readFileSync("shotsdb.json", { encoding: "utf-8" }),
);
const gameDictJson = JSON.parse(
  readFileSync("game-dict.json", { encoding: "utf-8" }),
);

const authordb: {
  _default: {
    [key: string]: IUser;
  };
} = JSON.parse(readFileSync("authorsdb.json", { encoding: "utf-8" }));

const shotsdb: {
  _default: {
    [key: string]: IShot;
  };
} = {
  _default: Object.keys(shotsJson._default).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        ...shotsJson._default[key],
        resolvedGameName: gameDictJson[shotsJson._default[key].gameName],
      } as IShot,
    };
  }, {}),
};

const gamesdb = [
  ...new Set(Object.values(shotsdb._default).map((shot) => shot.gameName)),
].sort((a, b) => {
  if (a.toLowerCase() < b.toLowerCase()) {
    return -1;
  }
  if (a.toLowerCase() > b.toLowerCase()) {
    return 1;
  }
  return 0;
});

const cleanGamesdb = [
  ...new Set(
    Object.values(shotsdb._default).map((shot) => shot.resolvedGameName),
  ),
]
  .sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    return 0;
  })
  .filter((game) => !!game);

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
    games: () => cleanGamesdb,
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
