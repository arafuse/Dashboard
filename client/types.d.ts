declare module '*.svg'
declare module '*.png'
declare module '*.jpg'

declare module 'page-metadata-parser'
declare module 'scrape-twitter'

declare type HTMLElementEvent<T extends HTMLElement> = React.SyntheticEvent<T> & {
  target: EventTarget & T;   
  currentTarget: EventTarget & T;
}