import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject,
  inputBinding,
  outputBinding,
} from '@angular/core';
import { ToastComponent } from '../../shared/components/toast/toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly document = inject(DOCUMENT);

  show(message: string): void {
    const host = this.document.createElement('div');
    let ref!: ComponentRef<ToastComponent>;

    ref = createComponent(ToastComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: host,
      bindings: [
        inputBinding('message', () => message),
        outputBinding('closed', () => this.destroyToast(ref, host)),
      ],
    });

    this.appRef.attachView(ref.hostView);
    this.document.body.appendChild(host);
    ref.changeDetectorRef.detectChanges();

    const timeoutId = setTimeout(() => {
      this.destroyToast(ref, host);
    }, 3000);

    ref.onDestroy(() => clearTimeout(timeoutId));
  }

  private destroyToast(ref: ComponentRef<ToastComponent>, host: HTMLElement): void {
    if (!this.document.body.contains(host)) {
      return;
    }

    this.document.body.removeChild(host);
    this.appRef.detachView(ref.hostView);
    ref.destroy();
  }
}
