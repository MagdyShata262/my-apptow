import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });

    service = TestBed.inject(ToastService);
    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    document.body
      .querySelectorAll<HTMLButtonElement>('.toast-box button')
      .forEach((button) => button.click());
  });

  it('should create a toast with the supplied message', () => {
    service.show('تم الحفظ بنجاح');

    expect(document.body.textContent).toContain('تم الحفظ بنجاح');
  });

  it('should remove the toast when it is closed', () => {
    service.show('رسالة مؤقتة');

    const closeButton = document.body.querySelector<HTMLButtonElement>('.toast-box button');
    closeButton?.click();

    expect(document.body.querySelector('.toast-box')).toBeNull();
  });
});
