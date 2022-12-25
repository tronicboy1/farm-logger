import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appCloseOnEsc]',
})
export class CloseOnEscDirective {
  @Output('modal-closed') modalClosed = new EventEmitter<void>();
  get nativeElement() {
    if (!(this.el.nativeElement instanceof HTMLElement)) throw TypeError();
    return this.el.nativeElement as HTMLElement;
  }

  constructor(private el: ElementRef) {}

  @HostListener('keydown.esc')
  handleKeyDown() {
    this.modalClosed.emit();
    this.nativeElement.dispatchEvent(new Event('modal-closed', { bubbles: true }));
  }
}
