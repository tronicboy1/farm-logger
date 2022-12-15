import { noChange } from "lit";
import { AsyncDirective, directive } from "lit/async-directive.js";
import { Observable, Subscription } from "rxjs";

class ObserveDirective extends AsyncDirective {
  observable: Observable<unknown> | undefined;
  unsubscribe = new Subscription();
  // When the observable changes, unsubscribe to the old one and
  // subscribe to the new one
  render(observable: Observable<unknown>) {
    if (this.observable !== observable) {
      this.unsubscribe.unsubscribe();
      this.observable = observable;
      if (this.isConnected) {
        this.subscribe(observable);
      }
    }
    return noChange;
  }
  // Subscribes to the observable, calling the directive's asynchronous
  // setValue API each time the value changes
  subscribe(observable: Observable<unknown>) {
    this.unsubscribe = observable.subscribe({
      next: (v: unknown) => {
        this.setValue(v);
      },
      complete() {
        console.log("completed");
      },
    });
  }
  // When the directive is disconnected from the DOM, unsubscribe to ensure
  // the directive instance can be garbage collected
  disconnected() {
    this.unsubscribe.unsubscribe();
  }
  // If the subtree the directive is in was disconnected and subsequently
  // re-connected, re-subscribe to make the directive operable again
  reconnected() {
    this.subscribe(this.observable!);
  }
}
export const observe = directive(ObserveDirective);
