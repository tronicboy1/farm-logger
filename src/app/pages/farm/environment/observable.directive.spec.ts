import { ElementRef } from "@angular/core";
import { ObservableDirective } from "./observable.directive";

describe("ObservableDirective", () => {
  it("should create an instance", () => {
    const directive = new ObservableDirective(new ElementRef(document.createElement("div")));
    expect(directive).toBeTruthy();
  });
});
