declare module '*.svg'
declare module '*.png'
declare module '*.jpg'

declare type HTMLElementEvent<T extends HTMLElement> = React.SyntheticEvent<T> & {
  target: EventTarget & T;   
  currentTarget: EventTarget & T;
}