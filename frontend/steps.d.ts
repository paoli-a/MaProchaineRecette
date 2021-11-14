/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types='codeceptjs' />
type steps_file = typeof import("./steps_file.js");

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
  }
  interface Methods extends Playwright {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
