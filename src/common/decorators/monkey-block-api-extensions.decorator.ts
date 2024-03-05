import { BlockDefProperties } from '@inf-monkeys/vines';
import { ApiExtension } from '@nestjs/swagger';

export function MonkeyBlockName(name: string): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    ApiExtension('x-monkey-block-name', name)(target, key, descriptor);
  };
}

export function MonkeyBlockIcon(icon: string): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    ApiExtension('x-monkey-block-icon', icon)(target, key, descriptor);
  };
}

export function MonkeyBlockCategories(categories: string[]): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    ApiExtension('x-monkey-block-categories', categories)(
      target,
      key,
      descriptor,
    );
  };
}

export function MonkeyBlockInput(input: BlockDefProperties[]): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    ApiExtension('x-monkey-block-input', input)(target, key, descriptor);
  };
}

export function MonkeyBlockOutput(
  output: BlockDefProperties[],
): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    ApiExtension('x-monkey-block-output', output)(target, key, descriptor);
  };
}
