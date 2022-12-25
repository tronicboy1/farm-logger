import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit, OnDestroy {
  private observer = new IntersectionObserver(
    (entries) => entries.filter((entry) => entry.isIntersecting).length > 0 && this.nativeElement.focus(),
  );
  private el = inject(ElementRef);
  get nativeElement() {
    if (!(this.el.nativeElement instanceof HTMLInputElement)) throw TypeError();
    return this.el.nativeElement;
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
