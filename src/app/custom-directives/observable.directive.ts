import { Directive, ElementRef, EventEmitter, Output } from "@angular/core";

@Directive({
  selector: "[appObservable]",
})
export class ObservableDirective {
  private observer: IntersectionObserver;
  @Output() intersection = new EventEmitter();

  constructor(public el: ElementRef) {
    this.observer = new IntersectionObserver(this.callback, { rootMargin: "100px", threshold: 0.5, root: null });
    this.observer.observe(this.el.nativeElement);
  }

  private callback: ConstructorParameters<typeof IntersectionObserver>[0] = (entries) =>
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((_entry) => {
        this.intersection.emit();
      });
}
