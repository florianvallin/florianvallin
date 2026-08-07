globalThis.DOMException ??= class DOMException extends Error {
  constructor(message = "", name = "Error") {
    super(message);
    this.name = name;
  }
};

globalThis.DOMMatrix ??= class DOMMatrix {
  constructor() {
    this.a = this.d = 1;
    this.b = this.c = this.e = this.f = 0;
  }
};

globalThis.ImageData ??= class ImageData {};
globalThis.Path2D ??= class Path2D {};

export default await import("pdfjs-dist/build/pdf.mjs");
