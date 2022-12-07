import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { bufferTime, bufferWhen, filter, fromEvent, interval, map, Subscription, tap } from "rxjs";
import { globalStyles } from "./shared";

export const tagName = "base-tooltip";

@customElement(tagName)
export class BaseTooltip extends LitElement {
  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        height: 35px;
        width: 35px;
        position: relative;
        display: inline-block;
      }
      svg {
        height: 100%;
        width: auto;
        fill: black;
      }
      @media (prefers-color-scheme: dark) {
        svg {
          fill: white;
        }
      }
      #content {
        visibility: hidden;
        width: 80vw;
        max-width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        margin: auto;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;
        top: 20%;
        left: 0;
        right: 0;
        position: fixed;
        z-index: 999;
      }
      :host([show]) #content {
        visibility: visible;
      }
      #overlay {
        opacity: 0;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
      }
    `,
  ];

  @property({ reflect: true, type: Boolean })
  show = false;

  private subscription = new Subscription();

  connectedCallback() {
    super.connectedCallback();
    const clicks$ = fromEvent(this, "click");

    this.subscription.add(
      clicks$
        .pipe(
          bufferTime(600),
          filter((events) => events.length > 0),
          map((events) => events.length > 1),
        )
        .subscribe((isDoubleClick: boolean) => (this.show = isDoubleClick)),
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.subscription.unsubscribe();
  }

  render() {
    return html`
      ${this.show ? html`<div id="overlay"></div>` : ""}
      <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0,0,48,48">
        <path
          d="M24.2 35.65q.8 0 1.35-.55t.55-1.35q0-.8-.55-1.35t-1.35-.55q-.8 0-1.35.55t-.55 1.35q0 .8.55 1.35t1.35.55Zm-1.75-7.3h2.95q0-1.3.325-2.375T27.75 23.5q1.55-1.3 2.2-2.55.65-1.25.65-2.75 0-2.65-1.725-4.25t-4.575-1.6q-2.45 0-4.325 1.225T17.25 16.95l2.65 1q.55-1.4 1.65-2.175 1.1-.775 2.6-.775 1.7 0 2.75.925t1.05 2.375q0 1.1-.65 2.075-.65.975-1.9 2.025-1.5 1.3-2.225 2.575-.725 1.275-.725 3.375ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z"
        />
      </svg>
      <p id="content"><slot></slot></p>
    `;
  }
}
