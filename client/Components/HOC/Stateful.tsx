import * as React from 'react';

export interface ComponentMethods<P, S> {
  setState<K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
    callback?: () => void
  ): void;
  forceUpdate(callBack?: () => void): void;
}

export const statefulComponent = <P, S>(
  initialState: S,
  propHandlers?: { [index: string]: any },
  lifeCycleHooks?: { [index: string]: Function }
) =>
  (Component: React.StatelessComponent<P>) => class extends React.Component<P, S> {
    propHandlers: any;
    componentMethods: any;
    [index: string]: any;

    constructor(props: P) {
      super(props);
      this.displayName = Component.name;
      this.state = initialState || {} as S;
      this.componentMethods = {
        setState: this.setState.bind(this),
        forceUpdate: this.forceUpdate.bind(this)
      };
      this.propHandlers = this.getPropHandlers(propHandlers || {});
      this.setLifeCycleHooks(lifeCycleHooks || {});
    }

    getPropHandlers(propHandlers: { [index: string]: Function }) {
      const preparedHandlers: { [index: string]: Function } = {};
      Object.keys(propHandlers).forEach(key => {
        const handler = propHandlers[key];
        preparedHandlers[key] = (...args: Array<any>) => {
          const result = handler(...args);
          if (typeof result === 'function') {
            const props = Object.assign({}, { self: this }, this.props, this.propHandlers, this.componentMethods);
            return result(props, this.state);
          } else {
            return result;
          }
        };
      });
      return preparedHandlers;
    }

    setLifeCycleHooks(lifeCycleHooks: { [index: string]: Function }) {
      Object.keys(lifeCycleHooks).forEach((functionName) => {
        if (functionName !== 'initialize') {
          const hook = lifeCycleHooks[functionName];
          this[functionName] = hook(Object.assign({}, { self: this }, this.props, this.propHandlers));
        }
      });
      if (lifeCycleHooks.initialize) {
        lifeCycleHooks.initialize(Object.assign({}, { self: this }, this.props, this.propHandlers));
      }
    }

    render() {
      const props = this.propHandlers ? Object.assign({}, { self: this }, this.props, this.propHandlers) : this.props;
      return <Component {...Object.assign({}, props, this.componentMethods, { state: this.state })} />;
    }
  };
