import * as React from 'react';

export const statelessComponent = <P extends any>(
  propHandlers?: { [index: string]: Function },
  lifeCycleHooks?: { [index: string]: Function }
) =>
  (Component: React.StatelessComponent<P>) => class extends React.Component<P> {
    propHandlers: any;
    [index: string]: any;

    constructor(props: P) {
      super(props);
      this.displayName = Component.name;
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
            return result(Object.assign({}, { self: this }, this.props, this.propHandlers));
          } else {
            return result;
          }
        };
      });
      return preparedHandlers;
    }

    setLifeCycleHooks(lifeCycleHooks: { [index: string]: Function }) {
      Object.keys(lifeCycleHooks).forEach((functionName) => {
        if (['componentDidMount', 'componentWillUnmount'].includes(functionName)) {
          this[functionName] = () => {
            lifeCycleHooks[functionName](Object.assign({}, { self: this }, this.props, this.propHandlers));
          };
        }
        else if (functionName !== 'initialize') {
          this[functionName] = lifeCycleHooks[functionName];
        }
      });
      if (lifeCycleHooks.initialize) {
        lifeCycleHooks.initialize(Object.assign({}, { self: this }, this.props, this.propHandlers));
      }
    }

    render() {
      const props = this.propHandlers ? Object.assign({}, { self: this }, this.props, this.propHandlers) : this.props;
      return <Component {...Object.assign({}, props)} />;
    }
  };
