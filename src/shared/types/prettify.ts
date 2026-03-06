/**
 * Makes type that consists of multiple types / utility types easier to read
 * @example
 * 
  type Person = { name: string };
  type Address = { street: string };
 
  type PersonWithAddressV1 = Person & Address;
  //   ^? PersonWithAddressV1 = Person & Address
 
  type PersonWithAddressPrettified = Prettify<Person & Address>;
  //   ^? PersonWithAddressPrettified = { name: string; street: string; }
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
