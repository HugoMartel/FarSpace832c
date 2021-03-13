import { DocumentMock } from './document.mock';

export class WindowMock extends Window {
  public document = new DocumentMock();
}
