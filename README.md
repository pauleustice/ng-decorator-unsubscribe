# Description

A simple Typescript Decorator for Angular components in order to easily handle unsubscriptions on component destruction.

# Usage

## 1. Install the package

Terminal:
```
> npm i ng-handle-subscriptions --save
```

## 2. Decorate your component

Add the @HandleSubscriptions decorator to your component and ensure you add the class property `addSubscriptions`.

```
import { FnAddSubs, HandleSubscriptions } from 'ng-handle-subscriptions';

@HandleSubscriptions
@Component({
  selector: 'app-example-component',
  template: '',
})
export class ExampleComponent implements OnDestroy {
  addSubscriptions: FnAddSubs;
  
  constructor () {}
}
```

## 2. Easily add subscriptions

Add subscriptions via an array of objects which match the `SubscriberConfig` type. This is just a `key: value` pairing of the observable and observer (both required) and the two usual optional callbacks that you're used to passing to `Observable.subscribe()`: `error` and `complete`.

```
ngOnInit () {
  this.addSubscriptions([{
    observable: this.observables[0],
    observer: v => console.log(v),
  }, {
    observable: this.observables[1],
    observer: v => console.log(v),
    error: e => console.log(e),
    complete: () => console.info('complete')
  }]);
}
```

## 3. Automatic unsubscriptions

The decorator handles the rest; no need to remember to unsubscribe from your observables within an `onDestroy`, or add repetitive `takeUntil`s to each subscription.

# Other info

In case you're wondering why the need for `addSubscriptions: FnAddSubs;`, this is due to the nature of a dynamically generated class constructor: Typescript has a hard time type-checking the class and can't know that the component has a method called `addSubscriptions` on its prototype, unlike using prototypical inheritance.

So, a small concession was made: it was necessary to add the class property 'addSubscriptions' to each component; it's then assigned by the decorator function. It's then typed to ensure that the `SubscriberConfig` is adhered to when calling `addSubscriptions()`.
