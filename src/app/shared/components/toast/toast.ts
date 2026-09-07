import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-box" role="status" aria-live="polite">
      <span>{{ message() }}</span>
      <button type="button" aria-label="إغلاق الرسالة" (click)="closed.emit()">
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  `,
  styles: `
    .toast-box {
      position: fixed;
      top: 20px;
      inset-inline-end: 20px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: min(420px, calc(100vw - 40px));
      padding: 12px 20px;
      color: #fff;
      background: #333;
      border-radius: 8px;
    }

    button {
      padding: 0;
      color: inherit;
      font-size: 1.1rem;
      line-height: 1;
      background: transparent;
      border: 0;
      cursor: pointer;
    }

    button:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly message = input.required<string>();
  readonly closed = output<void>();
}
