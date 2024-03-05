import { BlockDefProperties } from '@inf-monkeys/vines';
import { ApiExtension } from '@nestjs/swagger';

export function MonkeyToolName(name: string): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    ApiExtension('x-monkey-tool-name', name)(target, key, descriptor);
  };
}

export function MonkeyToolIcon(icon: string): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    ApiExtension('x-monkey-tool-icon', icon)(target, key, descriptor);
  };
}

export function MonkeyToolCategories(categories: string[]): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    ApiExtension('x-monkey-tool-categories', categories)(
      target,
      key,
      descriptor,
    );
  };
}

export function MonkeyToolInput(input: BlockDefProperties[]): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    ApiExtension('x-monkey-tool-input', input)(target, key, descriptor);
  };
}

export function MonkeyToolOutput(
  output: BlockDefProperties[],
): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    ApiExtension('x-monkey-tool-output', output)(target, key, descriptor);
  };
}
