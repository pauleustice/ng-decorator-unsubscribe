import { Observable, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

export interface SubscriberConfig {
  observable: Observable<any>;
  observer: (value: any) => void;
  error?: (value: any) => void;
  complete?: () => void;
}

export type FnAddSubs = (subs: Array<SubscriberConfig>) => void;

/**
 * Simple class decorator to allow auto tidy-up of subscriptions on component destroy
 * @param target
 * @constructor
 */
export function HandleSubscriptions<T extends {new(...args: any[]): {}}>(target: T) {
  return class extends target implements OnDestroy {
    subscriptions: Array<Subscription> = [];

    addSubscriptions(subs: Array<SubscriberConfig>) {
      this.subscriptions = [
        ...this.subscriptions,
        ...subs.map(({ observable, observer, error, complete }) => observable.subscribe(observer, error, complete))
      ];
    }

    ngOnDestroy() {
      this.subscriptions.forEach(sub => sub.unsubscribe());

      if (target.prototype.ngOnDestroy) {
        target.prototype.ngOnDestroy();
      }
    }
  };
}
