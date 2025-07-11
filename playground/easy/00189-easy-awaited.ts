/*
  189 - Awaited
  -------
  by Maciej Sikora (@maciejsikora) #easy #promise #built-in

  ### Question

  If we have a type which is a wrapped type like Promise, how can we get the type which is inside the wrapped type?

  For example: if we have `Promise<ExampleType>` how to get ExampleType?

  ```ts
  type ExampleType = Promise<string>

  type Result = MyAwaited<ExampleType> // string
  ```

  > This question is ported from the [original article](https://dev.to/macsikora/advanced-typescript-exercises-question-1-45k4) by [@maciejsikora](https://github.com/maciejsikora)

  > View on GitHub: https://tsch.js.org/189
*/

/* _____________ Your Code Here _____________ */

/**
 * 1. Awaited<T>는 다음과 같이 타입 선언이 되어 있다.
 * type MyAwaited<T> = T extends null | undefined ? T : // special case for `null | undefined` when not in `--strictNullChecks` mode
 *   T extends object & { then(onfulfilled: infer F, ...args: infer _): any } ? // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
 *     F extends ((value: infer V, ...args: infer _) => any) ? // if the argument to `then` is callable, extracts the first argument
 *       Awaited<V> : // recursively unwrap the value
 *       never : // the argument to `then` was not callable
 *     T // non-object or non-thenable
 *
 *  2. 따라서 재귀적으로 다음과 같이 정의할 수 있다.
 * type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U extends PromiseLike<any> ? MyAwaited<U> : U : never
 *
 *  3. 하지만 Promise가 아닌 경우에 타입 에러가 발생하지 않음.
 * MyAwaited<number> // 타입 에러 발생하지 않음
 *
 *  4. Promise만 허용하려면 다음과 같이 타입을 엄격하게 지정할 수 있다.
 * type MyAwaited<T extends PromiseLike<any>> =
 *   T extends PromiseLike<infer V>
 *     ? V extends PromiseLike<any>
 *       ? MyAwaited<V>
 *       : V
 *     : never
 */

type MyAwaited<T extends PromiseLike<any>> =
  T extends PromiseLike<infer V>
    ? V extends PromiseLike<any>
      ? MyAwaited<V>
      : V
    : never

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type X = Promise<string>
type Y = Promise<{ field: number }>
type Z = Promise<Promise<string | number>>
type Z1 = Promise<Promise<Promise<string | boolean>>>
type T = { then: (onfulfilled: (arg: number) => any) => any }

type cases = [
  Expect<Equal<MyAwaited<X>, string>>,
  Expect<Equal<MyAwaited<Y>, { field: number }>>,
  Expect<Equal<MyAwaited<Z>, string | number>>,
  Expect<Equal<MyAwaited<Z1>, string | boolean>>,
  Expect<Equal<MyAwaited<T>, number>>,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/189/answer
  > View solutions: https://tsch.js.org/189/solutions
  > More Challenges: https://tsch.js.org
*/
