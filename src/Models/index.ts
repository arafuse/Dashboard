export interface FeedItem {
  title: string;
  badge: string;
  channel: string;
  content: string;
  image: string;
  link: string;
}

export interface Feed {
  status: string;
  error?: string;
  items: Array<FeedItem>;
}

export type ElementEvent<T> = React.FormEvent<T> & React.ChangeEvent<T> & {
  target: T;
  currentTarget: T;
};
