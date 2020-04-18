/**
 * Error on bootstrap the application. See at file `main.ts`
 */
export class BootstrapError extends Error {

  constructor(public readonly name: string, message: string) {
    super(message);
  }
}
