export interface IUser {
  authorid: string;
  authorNick: string;
  authorsAvatarUrl: string;
  flickr: string;
  twitter: string;
  instagram: string;
  steam: string;
  othersocials: string[];
}

export interface IUsers {
  [key: string]: IUser;
}

export interface IShot {
  gameName: string;
  shotUrl: string;
  height: number;
  width: number;
  thumbnailUrl: string;
  author: string;
  date: string;
  score: number;
  ID: number;
  epochTime: number;
  spoiler: boolean;
  colorName: string;
}
