/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types='codeceptjs' />
type steps_file = typeof import("./steps_file.js");

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
  }
  interface Methods extends Playwright {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    have: (objectName: string, data?: Record<string, any>) => void;
    sendDeleteRequest: (path: string) => void;
    runDjangoCommand: (command: string) => void;
  }
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
