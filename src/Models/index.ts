export interface FeedItem {
  badge: string;
  text: string;
  image: string;
}

export interface Feed {
  status: string;
  error?: string;
  items?: Array<FeedItem>;
}

export type ElementEvent<T> = React.FormEvent<T> & React.ChangeEvent<T> & {
  target: T;
  currentTarget: T;
};
