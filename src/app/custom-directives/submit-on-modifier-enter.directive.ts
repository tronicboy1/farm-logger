import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appSubmitOnModifierEnter]",
})
export class SubmitOnModifierEnterDirective {
  constructor(private elementRef: ElementRef<HTMLFormElement>) {
    if (!(this.elementRef.nativeElement instanceof HTMLFormElement)) throw TypeError("Must be used with form element.");
  }

  @HostListener("window:keydown.meta.enter", ["$event"])
  handleMetaEnterKeyDown(event: Event) {
    event.stopPropagation();
    const form = this.elementRef.nativeElement;
    const isValid = form.checkValidity();
    if (isValid) {
      const submitEvent = new Event("submit");
      form.dispatchEvent(submitEvent);
    }
  }
}
