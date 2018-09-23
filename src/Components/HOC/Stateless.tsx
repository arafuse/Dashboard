import * as React from 'react';

export class StatelessComponent<P> extends React.Component<P> {
  propHandlers: any;
  [index: string]: any;
}

export const statelessComponent = <P extends any>(
  propHandlers?: { [index: string]: Function },
  lifeCycleHooks?: { [index: string]: Function }
) =>
  (Component: React.StatelessComponent<P>) => class extends StatelessComponent<P> {
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
        preparedHandlers[key] = typeof handler !== 'function' ? handler : (...args: Array<any>) => {
          const result = handler(...args);
          if (typeof result === 'function') {
            const props = Object.assign({}, this.props, this.propHandlers);
            return result(props, this.state);
          } else {
            return result;
          }
        };
      });
      return preparedHandlers;
    }

    setLifeCycleHooks(lifeCycleHooks: { [index: string]: Function }) {
      Object.keys(lifeCycleHooks).forEach(
        (functionName) => {
          if (functionName !== 'constructor') {
            this[functionName] = () => {
              lifeCycleHooks[functionName](this.props);
            };
          }
        },
      );
      if (lifeCycleHooks.constructor) {
        lifeCycleHooks.constructor(this.props);
      }
    }

    render() {
      // Can't use spread operator here, https://github.com/Microsoft/TypeScript/issues/10727.
      const props = this.propHandlers ? Object.assign({}, this.props, this.propHandlers) : this.props;
      return <Component {...Object.assign({}, props)} />;
    }
  };
