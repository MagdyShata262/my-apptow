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
import {
  ToastComponent,
  type ToastPosition,
  type ToastType,
} from '../../shared/components/toast/toast';

export interface ToastOptions {
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
}

export interface ToastRef {
  close(): void;
}

interface ToastInstance {
  ref: ComponentRef<ToastComponent>;
  host: HTMLElement;
  container: HTMLElement;
  timeoutId: ReturnType<typeof setTimeout>;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly document = inject(DOCUMENT);
  private readonly containers = new Map<ToastPosition, HTMLElement>();
  private readonly instances = new Set<ToastInstance>();

  show(message: string, options: ToastOptions = {}): ToastRef {
    const type = options.type ?? 'info';
    const position = options.position ?? 'top-right';
    const duration = options.duration ?? 3000;
    const container = this.getContainer(position);
    const host = this.document.createElement('div');
    let ref!: ComponentRef<ToastComponent>;
    let instance!: ToastInstance;

    ref = createComponent(ToastComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: host,
      bindings: [
        inputBinding('message', () => message),
        inputBinding('type', () => type),
        outputBinding('closed', () => this.destroyToast(instance)),
      ],
    });

    this.appRef.attachView(ref.hostView);
    container.appendChild(host);
    ref.changeDetectorRef.detectChanges();

    const timeoutId = setTimeout(() => this.destroyToast(instance), duration);
    instance = { ref, host, container, timeoutId };
    this.instances.add(instance);

    ref.onDestroy(() => clearTimeout(timeoutId));

    return {
      close: () => this.destroyToast(instance),
    };
  }

  dismissAll(): void {
    [...this.instances].forEach((instance) => this.destroyToast(instance));
  }

  private getContainer(position: ToastPosition): HTMLElement {
    const existingContainer = this.containers.get(position);
    if (existingContainer) {
      return existingContainer;
    }

    const container = this.document.createElement('div');
    container.className = `toast-container toast-container--${position}`;
    container.setAttribute('aria-label', 'الإشعارات');
    this.document.body.appendChild(container);
    this.containers.set(position, container);

    return container;
  }

  private destroyToast(instance: ToastInstance): void {
    if (!this.instances.has(instance)) {
      return;
    }

    this.instances.delete(instance);
    instance.host.remove();
    this.appRef.detachView(instance.ref.hostView);
    instance.ref.destroy();

    if (!instance.container.childElementCount) {
      instance.container.remove();
      const position = this.getPositionFromContainer(instance.container);
      if (position) {
        this.containers.delete(position);
      }
    }
  }

  private getPositionFromContainer(container: HTMLElement): ToastPosition | undefined {
    for (const [position, currentContainer] of this.containers) {
      if (currentContainer === container) {
        return position;
      }
    }

    return undefined;
  }
}
