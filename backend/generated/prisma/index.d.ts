
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Persona
 * 
 */
export type Persona = $Result.DefaultSelection<Prisma.$PersonaPayload>
/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>
/**
 * Model Rol
 * 
 */
export type Rol = $Result.DefaultSelection<Prisma.$RolPayload>
/**
 * Model UsuarioRol
 * 
 */
export type UsuarioRol = $Result.DefaultSelection<Prisma.$UsuarioRolPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Personas
 * const personas = await prisma.persona.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Personas
   * const personas = await prisma.persona.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.persona`: Exposes CRUD operations for the **Persona** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Personas
    * const personas = await prisma.persona.findMany()
    * ```
    */
  get persona(): Prisma.PersonaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rol`: Exposes CRUD operations for the **Rol** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rols
    * const rols = await prisma.rol.findMany()
    * ```
    */
  get rol(): Prisma.RolDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usuarioRol`: Exposes CRUD operations for the **UsuarioRol** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsuarioRols
    * const usuarioRols = await prisma.usuarioRol.findMany()
    * ```
    */
  get usuarioRol(): Prisma.UsuarioRolDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.15.0
   * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Persona: 'Persona',
    Usuario: 'Usuario',
    Rol: 'Rol',
    UsuarioRol: 'UsuarioRol'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "persona" | "usuario" | "rol" | "usuarioRol"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Persona: {
        payload: Prisma.$PersonaPayload<ExtArgs>
        fields: Prisma.PersonaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PersonaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PersonaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          findFirst: {
            args: Prisma.PersonaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PersonaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          findMany: {
            args: Prisma.PersonaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>[]
          }
          create: {
            args: Prisma.PersonaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          createMany: {
            args: Prisma.PersonaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PersonaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>[]
          }
          delete: {
            args: Prisma.PersonaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          update: {
            args: Prisma.PersonaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          deleteMany: {
            args: Prisma.PersonaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PersonaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PersonaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>[]
          }
          upsert: {
            args: Prisma.PersonaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          aggregate: {
            args: Prisma.PersonaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePersona>
          }
          groupBy: {
            args: Prisma.PersonaGroupByArgs<ExtArgs>
            result: $Utils.Optional<PersonaGroupByOutputType>[]
          }
          count: {
            args: Prisma.PersonaCountArgs<ExtArgs>
            result: $Utils.Optional<PersonaCountAggregateOutputType> | number
          }
        }
      }
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsuarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
      Rol: {
        payload: Prisma.$RolPayload<ExtArgs>
        fields: Prisma.RolFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RolFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RolFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          findFirst: {
            args: Prisma.RolFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RolFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          findMany: {
            args: Prisma.RolFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>[]
          }
          create: {
            args: Prisma.RolCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          createMany: {
            args: Prisma.RolCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RolCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>[]
          }
          delete: {
            args: Prisma.RolDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          update: {
            args: Prisma.RolUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          deleteMany: {
            args: Prisma.RolDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RolUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RolUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>[]
          }
          upsert: {
            args: Prisma.RolUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolPayload>
          }
          aggregate: {
            args: Prisma.RolAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRol>
          }
          groupBy: {
            args: Prisma.RolGroupByArgs<ExtArgs>
            result: $Utils.Optional<RolGroupByOutputType>[]
          }
          count: {
            args: Prisma.RolCountArgs<ExtArgs>
            result: $Utils.Optional<RolCountAggregateOutputType> | number
          }
        }
      }
      UsuarioRol: {
        payload: Prisma.$UsuarioRolPayload<ExtArgs>
        fields: Prisma.UsuarioRolFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioRolFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioRolFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload>
          }
          findFirst: {
            args: Prisma.UsuarioRolFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioRolFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload>
          }
          findMany: {
            args: Prisma.UsuarioRolFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload>[]
          }
          create: {
            args: Prisma.UsuarioRolCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload>
          }
          createMany: {
            args: Prisma.UsuarioRolCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioRolCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload>[]
          }
          delete: {
            args: Prisma.UsuarioRolDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload>
          }
          update: {
            args: Prisma.UsuarioRolUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioRolDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioRolUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsuarioRolUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload>[]
          }
          upsert: {
            args: Prisma.UsuarioRolUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioRolPayload>
          }
          aggregate: {
            args: Prisma.UsuarioRolAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuarioRol>
          }
          groupBy: {
            args: Prisma.UsuarioRolGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioRolGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioRolCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioRolCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    persona?: PersonaOmit
    usuario?: UsuarioOmit
    rol?: RolOmit
    usuarioRol?: UsuarioRolOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UsuarioCountOutputType
   */

  export type UsuarioCountOutputType = {
    roles: number
  }

  export type UsuarioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roles?: boolean | UsuarioCountOutputTypeCountRolesArgs
  }

  // Custom InputTypes
  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioCountOutputType
     */
    select?: UsuarioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioRolWhereInput
  }


  /**
   * Count Type RolCountOutputType
   */

  export type RolCountOutputType = {
    usuarios: number
  }

  export type RolCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | RolCountOutputTypeCountUsuariosArgs
  }

  // Custom InputTypes
  /**
   * RolCountOutputType without action
   */
  export type RolCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolCountOutputType
     */
    select?: RolCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RolCountOutputType without action
   */
  export type RolCountOutputTypeCountUsuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioRolWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Persona
   */

  export type AggregatePersona = {
    _count: PersonaCountAggregateOutputType | null
    _avg: PersonaAvgAggregateOutputType | null
    _sum: PersonaSumAggregateOutputType | null
    _min: PersonaMinAggregateOutputType | null
    _max: PersonaMaxAggregateOutputType | null
  }

  export type PersonaAvgAggregateOutputType = {
    idPersona: number | null
  }

  export type PersonaSumAggregateOutputType = {
    idPersona: bigint | null
  }

  export type PersonaMinAggregateOutputType = {
    idPersona: bigint | null
    nombres: string | null
    apellidos: string | null
    correo: string | null
    celular: string | null
    activo: boolean | null
    createdAt: Date | null
  }

  export type PersonaMaxAggregateOutputType = {
    idPersona: bigint | null
    nombres: string | null
    apellidos: string | null
    correo: string | null
    celular: string | null
    activo: boolean | null
    createdAt: Date | null
  }

  export type PersonaCountAggregateOutputType = {
    idPersona: number
    nombres: number
    apellidos: number
    correo: number
    celular: number
    activo: number
    createdAt: number
    _all: number
  }


  export type PersonaAvgAggregateInputType = {
    idPersona?: true
  }

  export type PersonaSumAggregateInputType = {
    idPersona?: true
  }

  export type PersonaMinAggregateInputType = {
    idPersona?: true
    nombres?: true
    apellidos?: true
    correo?: true
    celular?: true
    activo?: true
    createdAt?: true
  }

  export type PersonaMaxAggregateInputType = {
    idPersona?: true
    nombres?: true
    apellidos?: true
    correo?: true
    celular?: true
    activo?: true
    createdAt?: true
  }

  export type PersonaCountAggregateInputType = {
    idPersona?: true
    nombres?: true
    apellidos?: true
    correo?: true
    celular?: true
    activo?: true
    createdAt?: true
    _all?: true
  }

  export type PersonaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Persona to aggregate.
     */
    where?: PersonaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personas to fetch.
     */
    orderBy?: PersonaOrderByWithRelationInput | PersonaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PersonaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Personas
    **/
    _count?: true | PersonaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PersonaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PersonaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PersonaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PersonaMaxAggregateInputType
  }

  export type GetPersonaAggregateType<T extends PersonaAggregateArgs> = {
        [P in keyof T & keyof AggregatePersona]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePersona[P]>
      : GetScalarType<T[P], AggregatePersona[P]>
  }




  export type PersonaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersonaWhereInput
    orderBy?: PersonaOrderByWithAggregationInput | PersonaOrderByWithAggregationInput[]
    by: PersonaScalarFieldEnum[] | PersonaScalarFieldEnum
    having?: PersonaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PersonaCountAggregateInputType | true
    _avg?: PersonaAvgAggregateInputType
    _sum?: PersonaSumAggregateInputType
    _min?: PersonaMinAggregateInputType
    _max?: PersonaMaxAggregateInputType
  }

  export type PersonaGroupByOutputType = {
    idPersona: bigint
    nombres: string
    apellidos: string
    correo: string
    celular: string
    activo: boolean
    createdAt: Date
    _count: PersonaCountAggregateOutputType | null
    _avg: PersonaAvgAggregateOutputType | null
    _sum: PersonaSumAggregateOutputType | null
    _min: PersonaMinAggregateOutputType | null
    _max: PersonaMaxAggregateOutputType | null
  }

  type GetPersonaGroupByPayload<T extends PersonaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PersonaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PersonaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PersonaGroupByOutputType[P]>
            : GetScalarType<T[P], PersonaGroupByOutputType[P]>
        }
      >
    >


  export type PersonaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idPersona?: boolean
    nombres?: boolean
    apellidos?: boolean
    correo?: boolean
    celular?: boolean
    activo?: boolean
    createdAt?: boolean
    usuario?: boolean | Persona$usuarioArgs<ExtArgs>
  }, ExtArgs["result"]["persona"]>

  export type PersonaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idPersona?: boolean
    nombres?: boolean
    apellidos?: boolean
    correo?: boolean
    celular?: boolean
    activo?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["persona"]>

  export type PersonaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idPersona?: boolean
    nombres?: boolean
    apellidos?: boolean
    correo?: boolean
    celular?: boolean
    activo?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["persona"]>

  export type PersonaSelectScalar = {
    idPersona?: boolean
    nombres?: boolean
    apellidos?: boolean
    correo?: boolean
    celular?: boolean
    activo?: boolean
    createdAt?: boolean
  }

  export type PersonaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idPersona" | "nombres" | "apellidos" | "correo" | "celular" | "activo" | "createdAt", ExtArgs["result"]["persona"]>
  export type PersonaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | Persona$usuarioArgs<ExtArgs>
  }
  export type PersonaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PersonaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PersonaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Persona"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      idPersona: bigint
      nombres: string
      apellidos: string
      correo: string
      celular: string
      activo: boolean
      createdAt: Date
    }, ExtArgs["result"]["persona"]>
    composites: {}
  }

  type PersonaGetPayload<S extends boolean | null | undefined | PersonaDefaultArgs> = $Result.GetResult<Prisma.$PersonaPayload, S>

  type PersonaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PersonaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PersonaCountAggregateInputType | true
    }

  export interface PersonaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Persona'], meta: { name: 'Persona' } }
    /**
     * Find zero or one Persona that matches the filter.
     * @param {PersonaFindUniqueArgs} args - Arguments to find a Persona
     * @example
     * // Get one Persona
     * const persona = await prisma.persona.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PersonaFindUniqueArgs>(args: SelectSubset<T, PersonaFindUniqueArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Persona that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PersonaFindUniqueOrThrowArgs} args - Arguments to find a Persona
     * @example
     * // Get one Persona
     * const persona = await prisma.persona.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PersonaFindUniqueOrThrowArgs>(args: SelectSubset<T, PersonaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Persona that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaFindFirstArgs} args - Arguments to find a Persona
     * @example
     * // Get one Persona
     * const persona = await prisma.persona.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PersonaFindFirstArgs>(args?: SelectSubset<T, PersonaFindFirstArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Persona that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaFindFirstOrThrowArgs} args - Arguments to find a Persona
     * @example
     * // Get one Persona
     * const persona = await prisma.persona.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PersonaFindFirstOrThrowArgs>(args?: SelectSubset<T, PersonaFindFirstOrThrowArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Personas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Personas
     * const personas = await prisma.persona.findMany()
     * 
     * // Get first 10 Personas
     * const personas = await prisma.persona.findMany({ take: 10 })
     * 
     * // Only select the `idPersona`
     * const personaWithIdPersonaOnly = await prisma.persona.findMany({ select: { idPersona: true } })
     * 
     */
    findMany<T extends PersonaFindManyArgs>(args?: SelectSubset<T, PersonaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Persona.
     * @param {PersonaCreateArgs} args - Arguments to create a Persona.
     * @example
     * // Create one Persona
     * const Persona = await prisma.persona.create({
     *   data: {
     *     // ... data to create a Persona
     *   }
     * })
     * 
     */
    create<T extends PersonaCreateArgs>(args: SelectSubset<T, PersonaCreateArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Personas.
     * @param {PersonaCreateManyArgs} args - Arguments to create many Personas.
     * @example
     * // Create many Personas
     * const persona = await prisma.persona.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PersonaCreateManyArgs>(args?: SelectSubset<T, PersonaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Personas and returns the data saved in the database.
     * @param {PersonaCreateManyAndReturnArgs} args - Arguments to create many Personas.
     * @example
     * // Create many Personas
     * const persona = await prisma.persona.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Personas and only return the `idPersona`
     * const personaWithIdPersonaOnly = await prisma.persona.createManyAndReturn({
     *   select: { idPersona: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PersonaCreateManyAndReturnArgs>(args?: SelectSubset<T, PersonaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Persona.
     * @param {PersonaDeleteArgs} args - Arguments to delete one Persona.
     * @example
     * // Delete one Persona
     * const Persona = await prisma.persona.delete({
     *   where: {
     *     // ... filter to delete one Persona
     *   }
     * })
     * 
     */
    delete<T extends PersonaDeleteArgs>(args: SelectSubset<T, PersonaDeleteArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Persona.
     * @param {PersonaUpdateArgs} args - Arguments to update one Persona.
     * @example
     * // Update one Persona
     * const persona = await prisma.persona.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PersonaUpdateArgs>(args: SelectSubset<T, PersonaUpdateArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Personas.
     * @param {PersonaDeleteManyArgs} args - Arguments to filter Personas to delete.
     * @example
     * // Delete a few Personas
     * const { count } = await prisma.persona.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PersonaDeleteManyArgs>(args?: SelectSubset<T, PersonaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Personas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Personas
     * const persona = await prisma.persona.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PersonaUpdateManyArgs>(args: SelectSubset<T, PersonaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Personas and returns the data updated in the database.
     * @param {PersonaUpdateManyAndReturnArgs} args - Arguments to update many Personas.
     * @example
     * // Update many Personas
     * const persona = await prisma.persona.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Personas and only return the `idPersona`
     * const personaWithIdPersonaOnly = await prisma.persona.updateManyAndReturn({
     *   select: { idPersona: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PersonaUpdateManyAndReturnArgs>(args: SelectSubset<T, PersonaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Persona.
     * @param {PersonaUpsertArgs} args - Arguments to update or create a Persona.
     * @example
     * // Update or create a Persona
     * const persona = await prisma.persona.upsert({
     *   create: {
     *     // ... data to create a Persona
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Persona we want to update
     *   }
     * })
     */
    upsert<T extends PersonaUpsertArgs>(args: SelectSubset<T, PersonaUpsertArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Personas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaCountArgs} args - Arguments to filter Personas to count.
     * @example
     * // Count the number of Personas
     * const count = await prisma.persona.count({
     *   where: {
     *     // ... the filter for the Personas we want to count
     *   }
     * })
    **/
    count<T extends PersonaCountArgs>(
      args?: Subset<T, PersonaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PersonaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Persona.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PersonaAggregateArgs>(args: Subset<T, PersonaAggregateArgs>): Prisma.PrismaPromise<GetPersonaAggregateType<T>>

    /**
     * Group by Persona.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PersonaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PersonaGroupByArgs['orderBy'] }
        : { orderBy?: PersonaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PersonaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPersonaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Persona model
   */
  readonly fields: PersonaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Persona.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PersonaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends Persona$usuarioArgs<ExtArgs> = {}>(args?: Subset<T, Persona$usuarioArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Persona model
   */
  interface PersonaFieldRefs {
    readonly idPersona: FieldRef<"Persona", 'BigInt'>
    readonly nombres: FieldRef<"Persona", 'String'>
    readonly apellidos: FieldRef<"Persona", 'String'>
    readonly correo: FieldRef<"Persona", 'String'>
    readonly celular: FieldRef<"Persona", 'String'>
    readonly activo: FieldRef<"Persona", 'Boolean'>
    readonly createdAt: FieldRef<"Persona", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Persona findUnique
   */
  export type PersonaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter, which Persona to fetch.
     */
    where: PersonaWhereUniqueInput
  }

  /**
   * Persona findUniqueOrThrow
   */
  export type PersonaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter, which Persona to fetch.
     */
    where: PersonaWhereUniqueInput
  }

  /**
   * Persona findFirst
   */
  export type PersonaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter, which Persona to fetch.
     */
    where?: PersonaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personas to fetch.
     */
    orderBy?: PersonaOrderByWithRelationInput | PersonaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Personas.
     */
    cursor?: PersonaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Personas.
     */
    distinct?: PersonaScalarFieldEnum | PersonaScalarFieldEnum[]
  }

  /**
   * Persona findFirstOrThrow
   */
  export type PersonaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter, which Persona to fetch.
     */
    where?: PersonaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personas to fetch.
     */
    orderBy?: PersonaOrderByWithRelationInput | PersonaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Personas.
     */
    cursor?: PersonaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Personas.
     */
    distinct?: PersonaScalarFieldEnum | PersonaScalarFieldEnum[]
  }

  /**
   * Persona findMany
   */
  export type PersonaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter, which Personas to fetch.
     */
    where?: PersonaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personas to fetch.
     */
    orderBy?: PersonaOrderByWithRelationInput | PersonaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Personas.
     */
    cursor?: PersonaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personas.
     */
    skip?: number
    distinct?: PersonaScalarFieldEnum | PersonaScalarFieldEnum[]
  }

  /**
   * Persona create
   */
  export type PersonaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * The data needed to create a Persona.
     */
    data: XOR<PersonaCreateInput, PersonaUncheckedCreateInput>
  }

  /**
   * Persona createMany
   */
  export type PersonaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Personas.
     */
    data: PersonaCreateManyInput | PersonaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Persona createManyAndReturn
   */
  export type PersonaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * The data used to create many Personas.
     */
    data: PersonaCreateManyInput | PersonaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Persona update
   */
  export type PersonaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * The data needed to update a Persona.
     */
    data: XOR<PersonaUpdateInput, PersonaUncheckedUpdateInput>
    /**
     * Choose, which Persona to update.
     */
    where: PersonaWhereUniqueInput
  }

  /**
   * Persona updateMany
   */
  export type PersonaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Personas.
     */
    data: XOR<PersonaUpdateManyMutationInput, PersonaUncheckedUpdateManyInput>
    /**
     * Filter which Personas to update
     */
    where?: PersonaWhereInput
    /**
     * Limit how many Personas to update.
     */
    limit?: number
  }

  /**
   * Persona updateManyAndReturn
   */
  export type PersonaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * The data used to update Personas.
     */
    data: XOR<PersonaUpdateManyMutationInput, PersonaUncheckedUpdateManyInput>
    /**
     * Filter which Personas to update
     */
    where?: PersonaWhereInput
    /**
     * Limit how many Personas to update.
     */
    limit?: number
  }

  /**
   * Persona upsert
   */
  export type PersonaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * The filter to search for the Persona to update in case it exists.
     */
    where: PersonaWhereUniqueInput
    /**
     * In case the Persona found by the `where` argument doesn't exist, create a new Persona with this data.
     */
    create: XOR<PersonaCreateInput, PersonaUncheckedCreateInput>
    /**
     * In case the Persona was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PersonaUpdateInput, PersonaUncheckedUpdateInput>
  }

  /**
   * Persona delete
   */
  export type PersonaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter which Persona to delete.
     */
    where: PersonaWhereUniqueInput
  }

  /**
   * Persona deleteMany
   */
  export type PersonaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Personas to delete
     */
    where?: PersonaWhereInput
    /**
     * Limit how many Personas to delete.
     */
    limit?: number
  }

  /**
   * Persona.usuario
   */
  export type Persona$usuarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    where?: UsuarioWhereInput
  }

  /**
   * Persona without action
   */
  export type PersonaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persona
     */
    omit?: PersonaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
  }


  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioAvgAggregateOutputType = {
    idUsuario: number | null
    personaId: number | null
  }

  export type UsuarioSumAggregateOutputType = {
    idUsuario: bigint | null
    personaId: bigint | null
  }

  export type UsuarioMinAggregateOutputType = {
    idUsuario: bigint | null
    personaId: bigint | null
    username: string | null
    passwordHash: string | null
    ultimoLogin: Date | null
    activo: boolean | null
    createdAt: Date | null
  }

  export type UsuarioMaxAggregateOutputType = {
    idUsuario: bigint | null
    personaId: bigint | null
    username: string | null
    passwordHash: string | null
    ultimoLogin: Date | null
    activo: boolean | null
    createdAt: Date | null
  }

  export type UsuarioCountAggregateOutputType = {
    idUsuario: number
    personaId: number
    username: number
    passwordHash: number
    ultimoLogin: number
    activo: number
    createdAt: number
    _all: number
  }


  export type UsuarioAvgAggregateInputType = {
    idUsuario?: true
    personaId?: true
  }

  export type UsuarioSumAggregateInputType = {
    idUsuario?: true
    personaId?: true
  }

  export type UsuarioMinAggregateInputType = {
    idUsuario?: true
    personaId?: true
    username?: true
    passwordHash?: true
    ultimoLogin?: true
    activo?: true
    createdAt?: true
  }

  export type UsuarioMaxAggregateInputType = {
    idUsuario?: true
    personaId?: true
    username?: true
    passwordHash?: true
    ultimoLogin?: true
    activo?: true
    createdAt?: true
  }

  export type UsuarioCountAggregateInputType = {
    idUsuario?: true
    personaId?: true
    username?: true
    passwordHash?: true
    ultimoLogin?: true
    activo?: true
    createdAt?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _avg?: UsuarioAvgAggregateInputType
    _sum?: UsuarioSumAggregateInputType
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    idUsuario: bigint
    personaId: bigint
    username: string
    passwordHash: string
    ultimoLogin: Date | null
    activo: boolean
    createdAt: Date
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idUsuario?: boolean
    personaId?: boolean
    username?: boolean
    passwordHash?: boolean
    ultimoLogin?: boolean
    activo?: boolean
    createdAt?: boolean
    persona?: boolean | PersonaDefaultArgs<ExtArgs>
    roles?: boolean | Usuario$rolesArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idUsuario?: boolean
    personaId?: boolean
    username?: boolean
    passwordHash?: boolean
    ultimoLogin?: boolean
    activo?: boolean
    createdAt?: boolean
    persona?: boolean | PersonaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idUsuario?: boolean
    personaId?: boolean
    username?: boolean
    passwordHash?: boolean
    ultimoLogin?: boolean
    activo?: boolean
    createdAt?: boolean
    persona?: boolean | PersonaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectScalar = {
    idUsuario?: boolean
    personaId?: boolean
    username?: boolean
    passwordHash?: boolean
    ultimoLogin?: boolean
    activo?: boolean
    createdAt?: boolean
  }

  export type UsuarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idUsuario" | "personaId" | "username" | "passwordHash" | "ultimoLogin" | "activo" | "createdAt", ExtArgs["result"]["usuario"]>
  export type UsuarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    persona?: boolean | PersonaDefaultArgs<ExtArgs>
    roles?: boolean | Usuario$rolesArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UsuarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    persona?: boolean | PersonaDefaultArgs<ExtArgs>
  }
  export type UsuarioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    persona?: boolean | PersonaDefaultArgs<ExtArgs>
  }

  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {
      persona: Prisma.$PersonaPayload<ExtArgs>
      roles: Prisma.$UsuarioRolPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idUsuario: bigint
      personaId: bigint
      username: string
      passwordHash: string
      ultimoLogin: Date | null
      activo: boolean
      createdAt: Date
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `idUsuario`
     * const usuarioWithIdUsuarioOnly = await prisma.usuario.findMany({ select: { idUsuario: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `idUsuario`
     * const usuarioWithIdUsuarioOnly = await prisma.usuario.createManyAndReturn({
     *   select: { idUsuario: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios and returns the data updated in the database.
     * @param {UsuarioUpdateManyAndReturnArgs} args - Arguments to update many Usuarios.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Usuarios and only return the `idUsuario`
     * const usuarioWithIdUsuarioOnly = await prisma.usuario.updateManyAndReturn({
     *   select: { idUsuario: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsuarioUpdateManyAndReturnArgs>(args: SelectSubset<T, UsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    persona<T extends PersonaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PersonaDefaultArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    roles<T extends Usuario$rolesArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$rolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */
  interface UsuarioFieldRefs {
    readonly idUsuario: FieldRef<"Usuario", 'BigInt'>
    readonly personaId: FieldRef<"Usuario", 'BigInt'>
    readonly username: FieldRef<"Usuario", 'String'>
    readonly passwordHash: FieldRef<"Usuario", 'String'>
    readonly ultimoLogin: FieldRef<"Usuario", 'DateTime'>
    readonly activo: FieldRef<"Usuario", 'Boolean'>
    readonly createdAt: FieldRef<"Usuario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario updateManyAndReturn
   */
  export type UsuarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to delete.
     */
    limit?: number
  }

  /**
   * Usuario.roles
   */
  export type Usuario$rolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    where?: UsuarioRolWhereInput
    orderBy?: UsuarioRolOrderByWithRelationInput | UsuarioRolOrderByWithRelationInput[]
    cursor?: UsuarioRolWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsuarioRolScalarFieldEnum | UsuarioRolScalarFieldEnum[]
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
  }


  /**
   * Model Rol
   */

  export type AggregateRol = {
    _count: RolCountAggregateOutputType | null
    _avg: RolAvgAggregateOutputType | null
    _sum: RolSumAggregateOutputType | null
    _min: RolMinAggregateOutputType | null
    _max: RolMaxAggregateOutputType | null
  }

  export type RolAvgAggregateOutputType = {
    idRol: number | null
  }

  export type RolSumAggregateOutputType = {
    idRol: bigint | null
  }

  export type RolMinAggregateOutputType = {
    idRol: bigint | null
    nombre: string | null
    descripcion: string | null
  }

  export type RolMaxAggregateOutputType = {
    idRol: bigint | null
    nombre: string | null
    descripcion: string | null
  }

  export type RolCountAggregateOutputType = {
    idRol: number
    nombre: number
    descripcion: number
    _all: number
  }


  export type RolAvgAggregateInputType = {
    idRol?: true
  }

  export type RolSumAggregateInputType = {
    idRol?: true
  }

  export type RolMinAggregateInputType = {
    idRol?: true
    nombre?: true
    descripcion?: true
  }

  export type RolMaxAggregateInputType = {
    idRol?: true
    nombre?: true
    descripcion?: true
  }

  export type RolCountAggregateInputType = {
    idRol?: true
    nombre?: true
    descripcion?: true
    _all?: true
  }

  export type RolAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rol to aggregate.
     */
    where?: RolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rols to fetch.
     */
    orderBy?: RolOrderByWithRelationInput | RolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rols
    **/
    _count?: true | RolCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RolAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RolSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RolMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RolMaxAggregateInputType
  }

  export type GetRolAggregateType<T extends RolAggregateArgs> = {
        [P in keyof T & keyof AggregateRol]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRol[P]>
      : GetScalarType<T[P], AggregateRol[P]>
  }




  export type RolGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolWhereInput
    orderBy?: RolOrderByWithAggregationInput | RolOrderByWithAggregationInput[]
    by: RolScalarFieldEnum[] | RolScalarFieldEnum
    having?: RolScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RolCountAggregateInputType | true
    _avg?: RolAvgAggregateInputType
    _sum?: RolSumAggregateInputType
    _min?: RolMinAggregateInputType
    _max?: RolMaxAggregateInputType
  }

  export type RolGroupByOutputType = {
    idRol: bigint
    nombre: string
    descripcion: string | null
    _count: RolCountAggregateOutputType | null
    _avg: RolAvgAggregateOutputType | null
    _sum: RolSumAggregateOutputType | null
    _min: RolMinAggregateOutputType | null
    _max: RolMaxAggregateOutputType | null
  }

  type GetRolGroupByPayload<T extends RolGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RolGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RolGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RolGroupByOutputType[P]>
            : GetScalarType<T[P], RolGroupByOutputType[P]>
        }
      >
    >


  export type RolSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idRol?: boolean
    nombre?: boolean
    descripcion?: boolean
    usuarios?: boolean | Rol$usuariosArgs<ExtArgs>
    _count?: boolean | RolCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rol"]>

  export type RolSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idRol?: boolean
    nombre?: boolean
    descripcion?: boolean
  }, ExtArgs["result"]["rol"]>

  export type RolSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idRol?: boolean
    nombre?: boolean
    descripcion?: boolean
  }, ExtArgs["result"]["rol"]>

  export type RolSelectScalar = {
    idRol?: boolean
    nombre?: boolean
    descripcion?: boolean
  }

  export type RolOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idRol" | "nombre" | "descripcion", ExtArgs["result"]["rol"]>
  export type RolInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | Rol$usuariosArgs<ExtArgs>
    _count?: boolean | RolCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RolIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RolIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rol"
    objects: {
      usuarios: Prisma.$UsuarioRolPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idRol: bigint
      nombre: string
      descripcion: string | null
    }, ExtArgs["result"]["rol"]>
    composites: {}
  }

  type RolGetPayload<S extends boolean | null | undefined | RolDefaultArgs> = $Result.GetResult<Prisma.$RolPayload, S>

  type RolCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RolFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RolCountAggregateInputType | true
    }

  export interface RolDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rol'], meta: { name: 'Rol' } }
    /**
     * Find zero or one Rol that matches the filter.
     * @param {RolFindUniqueArgs} args - Arguments to find a Rol
     * @example
     * // Get one Rol
     * const rol = await prisma.rol.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RolFindUniqueArgs>(args: SelectSubset<T, RolFindUniqueArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Rol that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RolFindUniqueOrThrowArgs} args - Arguments to find a Rol
     * @example
     * // Get one Rol
     * const rol = await prisma.rol.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RolFindUniqueOrThrowArgs>(args: SelectSubset<T, RolFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rol that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolFindFirstArgs} args - Arguments to find a Rol
     * @example
     * // Get one Rol
     * const rol = await prisma.rol.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RolFindFirstArgs>(args?: SelectSubset<T, RolFindFirstArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rol that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolFindFirstOrThrowArgs} args - Arguments to find a Rol
     * @example
     * // Get one Rol
     * const rol = await prisma.rol.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RolFindFirstOrThrowArgs>(args?: SelectSubset<T, RolFindFirstOrThrowArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rols that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rols
     * const rols = await prisma.rol.findMany()
     * 
     * // Get first 10 Rols
     * const rols = await prisma.rol.findMany({ take: 10 })
     * 
     * // Only select the `idRol`
     * const rolWithIdRolOnly = await prisma.rol.findMany({ select: { idRol: true } })
     * 
     */
    findMany<T extends RolFindManyArgs>(args?: SelectSubset<T, RolFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Rol.
     * @param {RolCreateArgs} args - Arguments to create a Rol.
     * @example
     * // Create one Rol
     * const Rol = await prisma.rol.create({
     *   data: {
     *     // ... data to create a Rol
     *   }
     * })
     * 
     */
    create<T extends RolCreateArgs>(args: SelectSubset<T, RolCreateArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rols.
     * @param {RolCreateManyArgs} args - Arguments to create many Rols.
     * @example
     * // Create many Rols
     * const rol = await prisma.rol.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RolCreateManyArgs>(args?: SelectSubset<T, RolCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rols and returns the data saved in the database.
     * @param {RolCreateManyAndReturnArgs} args - Arguments to create many Rols.
     * @example
     * // Create many Rols
     * const rol = await prisma.rol.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rols and only return the `idRol`
     * const rolWithIdRolOnly = await prisma.rol.createManyAndReturn({
     *   select: { idRol: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RolCreateManyAndReturnArgs>(args?: SelectSubset<T, RolCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Rol.
     * @param {RolDeleteArgs} args - Arguments to delete one Rol.
     * @example
     * // Delete one Rol
     * const Rol = await prisma.rol.delete({
     *   where: {
     *     // ... filter to delete one Rol
     *   }
     * })
     * 
     */
    delete<T extends RolDeleteArgs>(args: SelectSubset<T, RolDeleteArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Rol.
     * @param {RolUpdateArgs} args - Arguments to update one Rol.
     * @example
     * // Update one Rol
     * const rol = await prisma.rol.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RolUpdateArgs>(args: SelectSubset<T, RolUpdateArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rols.
     * @param {RolDeleteManyArgs} args - Arguments to filter Rols to delete.
     * @example
     * // Delete a few Rols
     * const { count } = await prisma.rol.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RolDeleteManyArgs>(args?: SelectSubset<T, RolDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rols
     * const rol = await prisma.rol.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RolUpdateManyArgs>(args: SelectSubset<T, RolUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rols and returns the data updated in the database.
     * @param {RolUpdateManyAndReturnArgs} args - Arguments to update many Rols.
     * @example
     * // Update many Rols
     * const rol = await prisma.rol.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Rols and only return the `idRol`
     * const rolWithIdRolOnly = await prisma.rol.updateManyAndReturn({
     *   select: { idRol: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RolUpdateManyAndReturnArgs>(args: SelectSubset<T, RolUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Rol.
     * @param {RolUpsertArgs} args - Arguments to update or create a Rol.
     * @example
     * // Update or create a Rol
     * const rol = await prisma.rol.upsert({
     *   create: {
     *     // ... data to create a Rol
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rol we want to update
     *   }
     * })
     */
    upsert<T extends RolUpsertArgs>(args: SelectSubset<T, RolUpsertArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Rols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolCountArgs} args - Arguments to filter Rols to count.
     * @example
     * // Count the number of Rols
     * const count = await prisma.rol.count({
     *   where: {
     *     // ... the filter for the Rols we want to count
     *   }
     * })
    **/
    count<T extends RolCountArgs>(
      args?: Subset<T, RolCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RolCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RolAggregateArgs>(args: Subset<T, RolAggregateArgs>): Prisma.PrismaPromise<GetRolAggregateType<T>>

    /**
     * Group by Rol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RolGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RolGroupByArgs['orderBy'] }
        : { orderBy?: RolGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RolGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rol model
   */
  readonly fields: RolFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rol.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RolClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuarios<T extends Rol$usuariosArgs<ExtArgs> = {}>(args?: Subset<T, Rol$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rol model
   */
  interface RolFieldRefs {
    readonly idRol: FieldRef<"Rol", 'BigInt'>
    readonly nombre: FieldRef<"Rol", 'String'>
    readonly descripcion: FieldRef<"Rol", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Rol findUnique
   */
  export type RolFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter, which Rol to fetch.
     */
    where: RolWhereUniqueInput
  }

  /**
   * Rol findUniqueOrThrow
   */
  export type RolFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter, which Rol to fetch.
     */
    where: RolWhereUniqueInput
  }

  /**
   * Rol findFirst
   */
  export type RolFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter, which Rol to fetch.
     */
    where?: RolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rols to fetch.
     */
    orderBy?: RolOrderByWithRelationInput | RolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rols.
     */
    cursor?: RolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rols.
     */
    distinct?: RolScalarFieldEnum | RolScalarFieldEnum[]
  }

  /**
   * Rol findFirstOrThrow
   */
  export type RolFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter, which Rol to fetch.
     */
    where?: RolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rols to fetch.
     */
    orderBy?: RolOrderByWithRelationInput | RolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rols.
     */
    cursor?: RolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rols.
     */
    distinct?: RolScalarFieldEnum | RolScalarFieldEnum[]
  }

  /**
   * Rol findMany
   */
  export type RolFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter, which Rols to fetch.
     */
    where?: RolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rols to fetch.
     */
    orderBy?: RolOrderByWithRelationInput | RolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rols.
     */
    cursor?: RolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rols.
     */
    skip?: number
    distinct?: RolScalarFieldEnum | RolScalarFieldEnum[]
  }

  /**
   * Rol create
   */
  export type RolCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * The data needed to create a Rol.
     */
    data: XOR<RolCreateInput, RolUncheckedCreateInput>
  }

  /**
   * Rol createMany
   */
  export type RolCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rols.
     */
    data: RolCreateManyInput | RolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rol createManyAndReturn
   */
  export type RolCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * The data used to create many Rols.
     */
    data: RolCreateManyInput | RolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rol update
   */
  export type RolUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * The data needed to update a Rol.
     */
    data: XOR<RolUpdateInput, RolUncheckedUpdateInput>
    /**
     * Choose, which Rol to update.
     */
    where: RolWhereUniqueInput
  }

  /**
   * Rol updateMany
   */
  export type RolUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rols.
     */
    data: XOR<RolUpdateManyMutationInput, RolUncheckedUpdateManyInput>
    /**
     * Filter which Rols to update
     */
    where?: RolWhereInput
    /**
     * Limit how many Rols to update.
     */
    limit?: number
  }

  /**
   * Rol updateManyAndReturn
   */
  export type RolUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * The data used to update Rols.
     */
    data: XOR<RolUpdateManyMutationInput, RolUncheckedUpdateManyInput>
    /**
     * Filter which Rols to update
     */
    where?: RolWhereInput
    /**
     * Limit how many Rols to update.
     */
    limit?: number
  }

  /**
   * Rol upsert
   */
  export type RolUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * The filter to search for the Rol to update in case it exists.
     */
    where: RolWhereUniqueInput
    /**
     * In case the Rol found by the `where` argument doesn't exist, create a new Rol with this data.
     */
    create: XOR<RolCreateInput, RolUncheckedCreateInput>
    /**
     * In case the Rol was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RolUpdateInput, RolUncheckedUpdateInput>
  }

  /**
   * Rol delete
   */
  export type RolDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
    /**
     * Filter which Rol to delete.
     */
    where: RolWhereUniqueInput
  }

  /**
   * Rol deleteMany
   */
  export type RolDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rols to delete
     */
    where?: RolWhereInput
    /**
     * Limit how many Rols to delete.
     */
    limit?: number
  }

  /**
   * Rol.usuarios
   */
  export type Rol$usuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    where?: UsuarioRolWhereInput
    orderBy?: UsuarioRolOrderByWithRelationInput | UsuarioRolOrderByWithRelationInput[]
    cursor?: UsuarioRolWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsuarioRolScalarFieldEnum | UsuarioRolScalarFieldEnum[]
  }

  /**
   * Rol without action
   */
  export type RolDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rol
     */
    select?: RolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rol
     */
    omit?: RolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolInclude<ExtArgs> | null
  }


  /**
   * Model UsuarioRol
   */

  export type AggregateUsuarioRol = {
    _count: UsuarioRolCountAggregateOutputType | null
    _avg: UsuarioRolAvgAggregateOutputType | null
    _sum: UsuarioRolSumAggregateOutputType | null
    _min: UsuarioRolMinAggregateOutputType | null
    _max: UsuarioRolMaxAggregateOutputType | null
  }

  export type UsuarioRolAvgAggregateOutputType = {
    usuarioId: number | null
    rolId: number | null
  }

  export type UsuarioRolSumAggregateOutputType = {
    usuarioId: bigint | null
    rolId: bigint | null
  }

  export type UsuarioRolMinAggregateOutputType = {
    usuarioId: bigint | null
    rolId: bigint | null
  }

  export type UsuarioRolMaxAggregateOutputType = {
    usuarioId: bigint | null
    rolId: bigint | null
  }

  export type UsuarioRolCountAggregateOutputType = {
    usuarioId: number
    rolId: number
    _all: number
  }


  export type UsuarioRolAvgAggregateInputType = {
    usuarioId?: true
    rolId?: true
  }

  export type UsuarioRolSumAggregateInputType = {
    usuarioId?: true
    rolId?: true
  }

  export type UsuarioRolMinAggregateInputType = {
    usuarioId?: true
    rolId?: true
  }

  export type UsuarioRolMaxAggregateInputType = {
    usuarioId?: true
    rolId?: true
  }

  export type UsuarioRolCountAggregateInputType = {
    usuarioId?: true
    rolId?: true
    _all?: true
  }

  export type UsuarioRolAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsuarioRol to aggregate.
     */
    where?: UsuarioRolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsuarioRols to fetch.
     */
    orderBy?: UsuarioRolOrderByWithRelationInput | UsuarioRolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioRolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsuarioRols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsuarioRols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsuarioRols
    **/
    _count?: true | UsuarioRolCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioRolAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioRolSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioRolMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioRolMaxAggregateInputType
  }

  export type GetUsuarioRolAggregateType<T extends UsuarioRolAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuarioRol]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuarioRol[P]>
      : GetScalarType<T[P], AggregateUsuarioRol[P]>
  }




  export type UsuarioRolGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioRolWhereInput
    orderBy?: UsuarioRolOrderByWithAggregationInput | UsuarioRolOrderByWithAggregationInput[]
    by: UsuarioRolScalarFieldEnum[] | UsuarioRolScalarFieldEnum
    having?: UsuarioRolScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioRolCountAggregateInputType | true
    _avg?: UsuarioRolAvgAggregateInputType
    _sum?: UsuarioRolSumAggregateInputType
    _min?: UsuarioRolMinAggregateInputType
    _max?: UsuarioRolMaxAggregateInputType
  }

  export type UsuarioRolGroupByOutputType = {
    usuarioId: bigint
    rolId: bigint
    _count: UsuarioRolCountAggregateOutputType | null
    _avg: UsuarioRolAvgAggregateOutputType | null
    _sum: UsuarioRolSumAggregateOutputType | null
    _min: UsuarioRolMinAggregateOutputType | null
    _max: UsuarioRolMaxAggregateOutputType | null
  }

  type GetUsuarioRolGroupByPayload<T extends UsuarioRolGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioRolGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioRolGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioRolGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioRolGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioRolSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    usuarioId?: boolean
    rolId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    rol?: boolean | RolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuarioRol"]>

  export type UsuarioRolSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    usuarioId?: boolean
    rolId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    rol?: boolean | RolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuarioRol"]>

  export type UsuarioRolSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    usuarioId?: boolean
    rolId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    rol?: boolean | RolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuarioRol"]>

  export type UsuarioRolSelectScalar = {
    usuarioId?: boolean
    rolId?: boolean
  }

  export type UsuarioRolOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"usuarioId" | "rolId", ExtArgs["result"]["usuarioRol"]>
  export type UsuarioRolInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    rol?: boolean | RolDefaultArgs<ExtArgs>
  }
  export type UsuarioRolIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    rol?: boolean | RolDefaultArgs<ExtArgs>
  }
  export type UsuarioRolIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    rol?: boolean | RolDefaultArgs<ExtArgs>
  }

  export type $UsuarioRolPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UsuarioRol"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs>
      rol: Prisma.$RolPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      usuarioId: bigint
      rolId: bigint
    }, ExtArgs["result"]["usuarioRol"]>
    composites: {}
  }

  type UsuarioRolGetPayload<S extends boolean | null | undefined | UsuarioRolDefaultArgs> = $Result.GetResult<Prisma.$UsuarioRolPayload, S>

  type UsuarioRolCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsuarioRolFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioRolCountAggregateInputType | true
    }

  export interface UsuarioRolDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UsuarioRol'], meta: { name: 'UsuarioRol' } }
    /**
     * Find zero or one UsuarioRol that matches the filter.
     * @param {UsuarioRolFindUniqueArgs} args - Arguments to find a UsuarioRol
     * @example
     * // Get one UsuarioRol
     * const usuarioRol = await prisma.usuarioRol.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioRolFindUniqueArgs>(args: SelectSubset<T, UsuarioRolFindUniqueArgs<ExtArgs>>): Prisma__UsuarioRolClient<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UsuarioRol that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioRolFindUniqueOrThrowArgs} args - Arguments to find a UsuarioRol
     * @example
     * // Get one UsuarioRol
     * const usuarioRol = await prisma.usuarioRol.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioRolFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioRolFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioRolClient<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsuarioRol that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioRolFindFirstArgs} args - Arguments to find a UsuarioRol
     * @example
     * // Get one UsuarioRol
     * const usuarioRol = await prisma.usuarioRol.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioRolFindFirstArgs>(args?: SelectSubset<T, UsuarioRolFindFirstArgs<ExtArgs>>): Prisma__UsuarioRolClient<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsuarioRol that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioRolFindFirstOrThrowArgs} args - Arguments to find a UsuarioRol
     * @example
     * // Get one UsuarioRol
     * const usuarioRol = await prisma.usuarioRol.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioRolFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioRolFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioRolClient<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UsuarioRols that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioRolFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsuarioRols
     * const usuarioRols = await prisma.usuarioRol.findMany()
     * 
     * // Get first 10 UsuarioRols
     * const usuarioRols = await prisma.usuarioRol.findMany({ take: 10 })
     * 
     * // Only select the `usuarioId`
     * const usuarioRolWithUsuarioIdOnly = await prisma.usuarioRol.findMany({ select: { usuarioId: true } })
     * 
     */
    findMany<T extends UsuarioRolFindManyArgs>(args?: SelectSubset<T, UsuarioRolFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UsuarioRol.
     * @param {UsuarioRolCreateArgs} args - Arguments to create a UsuarioRol.
     * @example
     * // Create one UsuarioRol
     * const UsuarioRol = await prisma.usuarioRol.create({
     *   data: {
     *     // ... data to create a UsuarioRol
     *   }
     * })
     * 
     */
    create<T extends UsuarioRolCreateArgs>(args: SelectSubset<T, UsuarioRolCreateArgs<ExtArgs>>): Prisma__UsuarioRolClient<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UsuarioRols.
     * @param {UsuarioRolCreateManyArgs} args - Arguments to create many UsuarioRols.
     * @example
     * // Create many UsuarioRols
     * const usuarioRol = await prisma.usuarioRol.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioRolCreateManyArgs>(args?: SelectSubset<T, UsuarioRolCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UsuarioRols and returns the data saved in the database.
     * @param {UsuarioRolCreateManyAndReturnArgs} args - Arguments to create many UsuarioRols.
     * @example
     * // Create many UsuarioRols
     * const usuarioRol = await prisma.usuarioRol.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UsuarioRols and only return the `usuarioId`
     * const usuarioRolWithUsuarioIdOnly = await prisma.usuarioRol.createManyAndReturn({
     *   select: { usuarioId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioRolCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioRolCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UsuarioRol.
     * @param {UsuarioRolDeleteArgs} args - Arguments to delete one UsuarioRol.
     * @example
     * // Delete one UsuarioRol
     * const UsuarioRol = await prisma.usuarioRol.delete({
     *   where: {
     *     // ... filter to delete one UsuarioRol
     *   }
     * })
     * 
     */
    delete<T extends UsuarioRolDeleteArgs>(args: SelectSubset<T, UsuarioRolDeleteArgs<ExtArgs>>): Prisma__UsuarioRolClient<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UsuarioRol.
     * @param {UsuarioRolUpdateArgs} args - Arguments to update one UsuarioRol.
     * @example
     * // Update one UsuarioRol
     * const usuarioRol = await prisma.usuarioRol.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioRolUpdateArgs>(args: SelectSubset<T, UsuarioRolUpdateArgs<ExtArgs>>): Prisma__UsuarioRolClient<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UsuarioRols.
     * @param {UsuarioRolDeleteManyArgs} args - Arguments to filter UsuarioRols to delete.
     * @example
     * // Delete a few UsuarioRols
     * const { count } = await prisma.usuarioRol.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioRolDeleteManyArgs>(args?: SelectSubset<T, UsuarioRolDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsuarioRols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioRolUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsuarioRols
     * const usuarioRol = await prisma.usuarioRol.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioRolUpdateManyArgs>(args: SelectSubset<T, UsuarioRolUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsuarioRols and returns the data updated in the database.
     * @param {UsuarioRolUpdateManyAndReturnArgs} args - Arguments to update many UsuarioRols.
     * @example
     * // Update many UsuarioRols
     * const usuarioRol = await prisma.usuarioRol.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UsuarioRols and only return the `usuarioId`
     * const usuarioRolWithUsuarioIdOnly = await prisma.usuarioRol.updateManyAndReturn({
     *   select: { usuarioId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsuarioRolUpdateManyAndReturnArgs>(args: SelectSubset<T, UsuarioRolUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UsuarioRol.
     * @param {UsuarioRolUpsertArgs} args - Arguments to update or create a UsuarioRol.
     * @example
     * // Update or create a UsuarioRol
     * const usuarioRol = await prisma.usuarioRol.upsert({
     *   create: {
     *     // ... data to create a UsuarioRol
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsuarioRol we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioRolUpsertArgs>(args: SelectSubset<T, UsuarioRolUpsertArgs<ExtArgs>>): Prisma__UsuarioRolClient<$Result.GetResult<Prisma.$UsuarioRolPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UsuarioRols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioRolCountArgs} args - Arguments to filter UsuarioRols to count.
     * @example
     * // Count the number of UsuarioRols
     * const count = await prisma.usuarioRol.count({
     *   where: {
     *     // ... the filter for the UsuarioRols we want to count
     *   }
     * })
    **/
    count<T extends UsuarioRolCountArgs>(
      args?: Subset<T, UsuarioRolCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioRolCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsuarioRol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioRolAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioRolAggregateArgs>(args: Subset<T, UsuarioRolAggregateArgs>): Prisma.PrismaPromise<GetUsuarioRolAggregateType<T>>

    /**
     * Group by UsuarioRol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioRolGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioRolGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioRolGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioRolGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioRolGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioRolGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UsuarioRol model
   */
  readonly fields: UsuarioRolFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UsuarioRol.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioRolClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    rol<T extends RolDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RolDefaultArgs<ExtArgs>>): Prisma__RolClient<$Result.GetResult<Prisma.$RolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UsuarioRol model
   */
  interface UsuarioRolFieldRefs {
    readonly usuarioId: FieldRef<"UsuarioRol", 'BigInt'>
    readonly rolId: FieldRef<"UsuarioRol", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * UsuarioRol findUnique
   */
  export type UsuarioRolFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    /**
     * Filter, which UsuarioRol to fetch.
     */
    where: UsuarioRolWhereUniqueInput
  }

  /**
   * UsuarioRol findUniqueOrThrow
   */
  export type UsuarioRolFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    /**
     * Filter, which UsuarioRol to fetch.
     */
    where: UsuarioRolWhereUniqueInput
  }

  /**
   * UsuarioRol findFirst
   */
  export type UsuarioRolFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    /**
     * Filter, which UsuarioRol to fetch.
     */
    where?: UsuarioRolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsuarioRols to fetch.
     */
    orderBy?: UsuarioRolOrderByWithRelationInput | UsuarioRolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsuarioRols.
     */
    cursor?: UsuarioRolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsuarioRols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsuarioRols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsuarioRols.
     */
    distinct?: UsuarioRolScalarFieldEnum | UsuarioRolScalarFieldEnum[]
  }

  /**
   * UsuarioRol findFirstOrThrow
   */
  export type UsuarioRolFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    /**
     * Filter, which UsuarioRol to fetch.
     */
    where?: UsuarioRolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsuarioRols to fetch.
     */
    orderBy?: UsuarioRolOrderByWithRelationInput | UsuarioRolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsuarioRols.
     */
    cursor?: UsuarioRolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsuarioRols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsuarioRols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsuarioRols.
     */
    distinct?: UsuarioRolScalarFieldEnum | UsuarioRolScalarFieldEnum[]
  }

  /**
   * UsuarioRol findMany
   */
  export type UsuarioRolFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    /**
     * Filter, which UsuarioRols to fetch.
     */
    where?: UsuarioRolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsuarioRols to fetch.
     */
    orderBy?: UsuarioRolOrderByWithRelationInput | UsuarioRolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsuarioRols.
     */
    cursor?: UsuarioRolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsuarioRols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsuarioRols.
     */
    skip?: number
    distinct?: UsuarioRolScalarFieldEnum | UsuarioRolScalarFieldEnum[]
  }

  /**
   * UsuarioRol create
   */
  export type UsuarioRolCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    /**
     * The data needed to create a UsuarioRol.
     */
    data: XOR<UsuarioRolCreateInput, UsuarioRolUncheckedCreateInput>
  }

  /**
   * UsuarioRol createMany
   */
  export type UsuarioRolCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UsuarioRols.
     */
    data: UsuarioRolCreateManyInput | UsuarioRolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsuarioRol createManyAndReturn
   */
  export type UsuarioRolCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * The data used to create many UsuarioRols.
     */
    data: UsuarioRolCreateManyInput | UsuarioRolCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsuarioRol update
   */
  export type UsuarioRolUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    /**
     * The data needed to update a UsuarioRol.
     */
    data: XOR<UsuarioRolUpdateInput, UsuarioRolUncheckedUpdateInput>
    /**
     * Choose, which UsuarioRol to update.
     */
    where: UsuarioRolWhereUniqueInput
  }

  /**
   * UsuarioRol updateMany
   */
  export type UsuarioRolUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UsuarioRols.
     */
    data: XOR<UsuarioRolUpdateManyMutationInput, UsuarioRolUncheckedUpdateManyInput>
    /**
     * Filter which UsuarioRols to update
     */
    where?: UsuarioRolWhereInput
    /**
     * Limit how many UsuarioRols to update.
     */
    limit?: number
  }

  /**
   * UsuarioRol updateManyAndReturn
   */
  export type UsuarioRolUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * The data used to update UsuarioRols.
     */
    data: XOR<UsuarioRolUpdateManyMutationInput, UsuarioRolUncheckedUpdateManyInput>
    /**
     * Filter which UsuarioRols to update
     */
    where?: UsuarioRolWhereInput
    /**
     * Limit how many UsuarioRols to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsuarioRol upsert
   */
  export type UsuarioRolUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    /**
     * The filter to search for the UsuarioRol to update in case it exists.
     */
    where: UsuarioRolWhereUniqueInput
    /**
     * In case the UsuarioRol found by the `where` argument doesn't exist, create a new UsuarioRol with this data.
     */
    create: XOR<UsuarioRolCreateInput, UsuarioRolUncheckedCreateInput>
    /**
     * In case the UsuarioRol was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioRolUpdateInput, UsuarioRolUncheckedUpdateInput>
  }

  /**
   * UsuarioRol delete
   */
  export type UsuarioRolDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
    /**
     * Filter which UsuarioRol to delete.
     */
    where: UsuarioRolWhereUniqueInput
  }

  /**
   * UsuarioRol deleteMany
   */
  export type UsuarioRolDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsuarioRols to delete
     */
    where?: UsuarioRolWhereInput
    /**
     * Limit how many UsuarioRols to delete.
     */
    limit?: number
  }

  /**
   * UsuarioRol without action
   */
  export type UsuarioRolDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioRol
     */
    select?: UsuarioRolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsuarioRol
     */
    omit?: UsuarioRolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioRolInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PersonaScalarFieldEnum: {
    idPersona: 'idPersona',
    nombres: 'nombres',
    apellidos: 'apellidos',
    correo: 'correo',
    celular: 'celular',
    activo: 'activo',
    createdAt: 'createdAt'
  };

  export type PersonaScalarFieldEnum = (typeof PersonaScalarFieldEnum)[keyof typeof PersonaScalarFieldEnum]


  export const UsuarioScalarFieldEnum: {
    idUsuario: 'idUsuario',
    personaId: 'personaId',
    username: 'username',
    passwordHash: 'passwordHash',
    ultimoLogin: 'ultimoLogin',
    activo: 'activo',
    createdAt: 'createdAt'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const RolScalarFieldEnum: {
    idRol: 'idRol',
    nombre: 'nombre',
    descripcion: 'descripcion'
  };

  export type RolScalarFieldEnum = (typeof RolScalarFieldEnum)[keyof typeof RolScalarFieldEnum]


  export const UsuarioRolScalarFieldEnum: {
    usuarioId: 'usuarioId',
    rolId: 'rolId'
  };

  export type UsuarioRolScalarFieldEnum = (typeof UsuarioRolScalarFieldEnum)[keyof typeof UsuarioRolScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PersonaWhereInput = {
    AND?: PersonaWhereInput | PersonaWhereInput[]
    OR?: PersonaWhereInput[]
    NOT?: PersonaWhereInput | PersonaWhereInput[]
    idPersona?: BigIntFilter<"Persona"> | bigint | number
    nombres?: StringFilter<"Persona"> | string
    apellidos?: StringFilter<"Persona"> | string
    correo?: StringFilter<"Persona"> | string
    celular?: StringFilter<"Persona"> | string
    activo?: BoolFilter<"Persona"> | boolean
    createdAt?: DateTimeFilter<"Persona"> | Date | string
    usuario?: XOR<UsuarioNullableScalarRelationFilter, UsuarioWhereInput> | null
  }

  export type PersonaOrderByWithRelationInput = {
    idPersona?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    correo?: SortOrder
    celular?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    usuario?: UsuarioOrderByWithRelationInput
  }

  export type PersonaWhereUniqueInput = Prisma.AtLeast<{
    idPersona?: bigint | number
    correo?: string
    AND?: PersonaWhereInput | PersonaWhereInput[]
    OR?: PersonaWhereInput[]
    NOT?: PersonaWhereInput | PersonaWhereInput[]
    nombres?: StringFilter<"Persona"> | string
    apellidos?: StringFilter<"Persona"> | string
    celular?: StringFilter<"Persona"> | string
    activo?: BoolFilter<"Persona"> | boolean
    createdAt?: DateTimeFilter<"Persona"> | Date | string
    usuario?: XOR<UsuarioNullableScalarRelationFilter, UsuarioWhereInput> | null
  }, "idPersona" | "correo">

  export type PersonaOrderByWithAggregationInput = {
    idPersona?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    correo?: SortOrder
    celular?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    _count?: PersonaCountOrderByAggregateInput
    _avg?: PersonaAvgOrderByAggregateInput
    _max?: PersonaMaxOrderByAggregateInput
    _min?: PersonaMinOrderByAggregateInput
    _sum?: PersonaSumOrderByAggregateInput
  }

  export type PersonaScalarWhereWithAggregatesInput = {
    AND?: PersonaScalarWhereWithAggregatesInput | PersonaScalarWhereWithAggregatesInput[]
    OR?: PersonaScalarWhereWithAggregatesInput[]
    NOT?: PersonaScalarWhereWithAggregatesInput | PersonaScalarWhereWithAggregatesInput[]
    idPersona?: BigIntWithAggregatesFilter<"Persona"> | bigint | number
    nombres?: StringWithAggregatesFilter<"Persona"> | string
    apellidos?: StringWithAggregatesFilter<"Persona"> | string
    correo?: StringWithAggregatesFilter<"Persona"> | string
    celular?: StringWithAggregatesFilter<"Persona"> | string
    activo?: BoolWithAggregatesFilter<"Persona"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Persona"> | Date | string
  }

  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    idUsuario?: BigIntFilter<"Usuario"> | bigint | number
    personaId?: BigIntFilter<"Usuario"> | bigint | number
    username?: StringFilter<"Usuario"> | string
    passwordHash?: StringFilter<"Usuario"> | string
    ultimoLogin?: DateTimeNullableFilter<"Usuario"> | Date | string | null
    activo?: BoolFilter<"Usuario"> | boolean
    createdAt?: DateTimeFilter<"Usuario"> | Date | string
    persona?: XOR<PersonaScalarRelationFilter, PersonaWhereInput>
    roles?: UsuarioRolListRelationFilter
  }

  export type UsuarioOrderByWithRelationInput = {
    idUsuario?: SortOrder
    personaId?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    ultimoLogin?: SortOrderInput | SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    persona?: PersonaOrderByWithRelationInput
    roles?: UsuarioRolOrderByRelationAggregateInput
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    idUsuario?: bigint | number
    personaId?: bigint | number
    username?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    passwordHash?: StringFilter<"Usuario"> | string
    ultimoLogin?: DateTimeNullableFilter<"Usuario"> | Date | string | null
    activo?: BoolFilter<"Usuario"> | boolean
    createdAt?: DateTimeFilter<"Usuario"> | Date | string
    persona?: XOR<PersonaScalarRelationFilter, PersonaWhereInput>
    roles?: UsuarioRolListRelationFilter
  }, "idUsuario" | "personaId" | "username">

  export type UsuarioOrderByWithAggregationInput = {
    idUsuario?: SortOrder
    personaId?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    ultimoLogin?: SortOrderInput | SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _avg?: UsuarioAvgOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
    _sum?: UsuarioSumOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    idUsuario?: BigIntWithAggregatesFilter<"Usuario"> | bigint | number
    personaId?: BigIntWithAggregatesFilter<"Usuario"> | bigint | number
    username?: StringWithAggregatesFilter<"Usuario"> | string
    passwordHash?: StringWithAggregatesFilter<"Usuario"> | string
    ultimoLogin?: DateTimeNullableWithAggregatesFilter<"Usuario"> | Date | string | null
    activo?: BoolWithAggregatesFilter<"Usuario"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
  }

  export type RolWhereInput = {
    AND?: RolWhereInput | RolWhereInput[]
    OR?: RolWhereInput[]
    NOT?: RolWhereInput | RolWhereInput[]
    idRol?: BigIntFilter<"Rol"> | bigint | number
    nombre?: StringFilter<"Rol"> | string
    descripcion?: StringNullableFilter<"Rol"> | string | null
    usuarios?: UsuarioRolListRelationFilter
  }

  export type RolOrderByWithRelationInput = {
    idRol?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    usuarios?: UsuarioRolOrderByRelationAggregateInput
  }

  export type RolWhereUniqueInput = Prisma.AtLeast<{
    idRol?: bigint | number
    nombre?: string
    AND?: RolWhereInput | RolWhereInput[]
    OR?: RolWhereInput[]
    NOT?: RolWhereInput | RolWhereInput[]
    descripcion?: StringNullableFilter<"Rol"> | string | null
    usuarios?: UsuarioRolListRelationFilter
  }, "idRol" | "nombre">

  export type RolOrderByWithAggregationInput = {
    idRol?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    _count?: RolCountOrderByAggregateInput
    _avg?: RolAvgOrderByAggregateInput
    _max?: RolMaxOrderByAggregateInput
    _min?: RolMinOrderByAggregateInput
    _sum?: RolSumOrderByAggregateInput
  }

  export type RolScalarWhereWithAggregatesInput = {
    AND?: RolScalarWhereWithAggregatesInput | RolScalarWhereWithAggregatesInput[]
    OR?: RolScalarWhereWithAggregatesInput[]
    NOT?: RolScalarWhereWithAggregatesInput | RolScalarWhereWithAggregatesInput[]
    idRol?: BigIntWithAggregatesFilter<"Rol"> | bigint | number
    nombre?: StringWithAggregatesFilter<"Rol"> | string
    descripcion?: StringNullableWithAggregatesFilter<"Rol"> | string | null
  }

  export type UsuarioRolWhereInput = {
    AND?: UsuarioRolWhereInput | UsuarioRolWhereInput[]
    OR?: UsuarioRolWhereInput[]
    NOT?: UsuarioRolWhereInput | UsuarioRolWhereInput[]
    usuarioId?: BigIntFilter<"UsuarioRol"> | bigint | number
    rolId?: BigIntFilter<"UsuarioRol"> | bigint | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    rol?: XOR<RolScalarRelationFilter, RolWhereInput>
  }

  export type UsuarioRolOrderByWithRelationInput = {
    usuarioId?: SortOrder
    rolId?: SortOrder
    usuario?: UsuarioOrderByWithRelationInput
    rol?: RolOrderByWithRelationInput
  }

  export type UsuarioRolWhereUniqueInput = Prisma.AtLeast<{
    usuarioId_rolId?: UsuarioRolUsuarioIdRolIdCompoundUniqueInput
    AND?: UsuarioRolWhereInput | UsuarioRolWhereInput[]
    OR?: UsuarioRolWhereInput[]
    NOT?: UsuarioRolWhereInput | UsuarioRolWhereInput[]
    usuarioId?: BigIntFilter<"UsuarioRol"> | bigint | number
    rolId?: BigIntFilter<"UsuarioRol"> | bigint | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    rol?: XOR<RolScalarRelationFilter, RolWhereInput>
  }, "usuarioId_rolId">

  export type UsuarioRolOrderByWithAggregationInput = {
    usuarioId?: SortOrder
    rolId?: SortOrder
    _count?: UsuarioRolCountOrderByAggregateInput
    _avg?: UsuarioRolAvgOrderByAggregateInput
    _max?: UsuarioRolMaxOrderByAggregateInput
    _min?: UsuarioRolMinOrderByAggregateInput
    _sum?: UsuarioRolSumOrderByAggregateInput
  }

  export type UsuarioRolScalarWhereWithAggregatesInput = {
    AND?: UsuarioRolScalarWhereWithAggregatesInput | UsuarioRolScalarWhereWithAggregatesInput[]
    OR?: UsuarioRolScalarWhereWithAggregatesInput[]
    NOT?: UsuarioRolScalarWhereWithAggregatesInput | UsuarioRolScalarWhereWithAggregatesInput[]
    usuarioId?: BigIntWithAggregatesFilter<"UsuarioRol"> | bigint | number
    rolId?: BigIntWithAggregatesFilter<"UsuarioRol"> | bigint | number
  }

  export type PersonaCreateInput = {
    idPersona?: bigint | number
    nombres: string
    apellidos: string
    correo: string
    celular: string
    activo?: boolean
    createdAt?: Date | string
    usuario?: UsuarioCreateNestedOneWithoutPersonaInput
  }

  export type PersonaUncheckedCreateInput = {
    idPersona?: bigint | number
    nombres: string
    apellidos: string
    correo: string
    celular: string
    activo?: boolean
    createdAt?: Date | string
    usuario?: UsuarioUncheckedCreateNestedOneWithoutPersonaInput
  }

  export type PersonaUpdateInput = {
    idPersona?: BigIntFieldUpdateOperationsInput | bigint | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    celular?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneWithoutPersonaNestedInput
  }

  export type PersonaUncheckedUpdateInput = {
    idPersona?: BigIntFieldUpdateOperationsInput | bigint | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    celular?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUncheckedUpdateOneWithoutPersonaNestedInput
  }

  export type PersonaCreateManyInput = {
    idPersona?: bigint | number
    nombres: string
    apellidos: string
    correo: string
    celular: string
    activo?: boolean
    createdAt?: Date | string
  }

  export type PersonaUpdateManyMutationInput = {
    idPersona?: BigIntFieldUpdateOperationsInput | bigint | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    celular?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonaUncheckedUpdateManyInput = {
    idPersona?: BigIntFieldUpdateOperationsInput | bigint | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    celular?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioCreateInput = {
    idUsuario?: bigint | number
    username: string
    passwordHash: string
    ultimoLogin?: Date | string | null
    activo?: boolean
    createdAt?: Date | string
    persona: PersonaCreateNestedOneWithoutUsuarioInput
    roles?: UsuarioRolCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateInput = {
    idUsuario?: bigint | number
    personaId: bigint | number
    username: string
    passwordHash: string
    ultimoLogin?: Date | string | null
    activo?: boolean
    createdAt?: Date | string
    roles?: UsuarioRolUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUpdateInput = {
    idUsuario?: BigIntFieldUpdateOperationsInput | bigint | number
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    ultimoLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    persona?: PersonaUpdateOneRequiredWithoutUsuarioNestedInput
    roles?: UsuarioRolUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateInput = {
    idUsuario?: BigIntFieldUpdateOperationsInput | bigint | number
    personaId?: BigIntFieldUpdateOperationsInput | bigint | number
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    ultimoLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roles?: UsuarioRolUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioCreateManyInput = {
    idUsuario?: bigint | number
    personaId: bigint | number
    username: string
    passwordHash: string
    ultimoLogin?: Date | string | null
    activo?: boolean
    createdAt?: Date | string
  }

  export type UsuarioUpdateManyMutationInput = {
    idUsuario?: BigIntFieldUpdateOperationsInput | bigint | number
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    ultimoLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateManyInput = {
    idUsuario?: BigIntFieldUpdateOperationsInput | bigint | number
    personaId?: BigIntFieldUpdateOperationsInput | bigint | number
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    ultimoLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RolCreateInput = {
    idRol?: bigint | number
    nombre: string
    descripcion?: string | null
    usuarios?: UsuarioRolCreateNestedManyWithoutRolInput
  }

  export type RolUncheckedCreateInput = {
    idRol?: bigint | number
    nombre: string
    descripcion?: string | null
    usuarios?: UsuarioRolUncheckedCreateNestedManyWithoutRolInput
  }

  export type RolUpdateInput = {
    idRol?: BigIntFieldUpdateOperationsInput | bigint | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    usuarios?: UsuarioRolUpdateManyWithoutRolNestedInput
  }

  export type RolUncheckedUpdateInput = {
    idRol?: BigIntFieldUpdateOperationsInput | bigint | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    usuarios?: UsuarioRolUncheckedUpdateManyWithoutRolNestedInput
  }

  export type RolCreateManyInput = {
    idRol?: bigint | number
    nombre: string
    descripcion?: string | null
  }

  export type RolUpdateManyMutationInput = {
    idRol?: BigIntFieldUpdateOperationsInput | bigint | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RolUncheckedUpdateManyInput = {
    idRol?: BigIntFieldUpdateOperationsInput | bigint | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UsuarioRolCreateInput = {
    usuario: UsuarioCreateNestedOneWithoutRolesInput
    rol: RolCreateNestedOneWithoutUsuariosInput
  }

  export type UsuarioRolUncheckedCreateInput = {
    usuarioId: bigint | number
    rolId: bigint | number
  }

  export type UsuarioRolUpdateInput = {
    usuario?: UsuarioUpdateOneRequiredWithoutRolesNestedInput
    rol?: RolUpdateOneRequiredWithoutUsuariosNestedInput
  }

  export type UsuarioRolUncheckedUpdateInput = {
    usuarioId?: BigIntFieldUpdateOperationsInput | bigint | number
    rolId?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type UsuarioRolCreateManyInput = {
    usuarioId: bigint | number
    rolId: bigint | number
  }

  export type UsuarioRolUpdateManyMutationInput = {

  }

  export type UsuarioRolUncheckedUpdateManyInput = {
    usuarioId?: BigIntFieldUpdateOperationsInput | bigint | number
    rolId?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UsuarioNullableScalarRelationFilter = {
    is?: UsuarioWhereInput | null
    isNot?: UsuarioWhereInput | null
  }

  export type PersonaCountOrderByAggregateInput = {
    idPersona?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    correo?: SortOrder
    celular?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
  }

  export type PersonaAvgOrderByAggregateInput = {
    idPersona?: SortOrder
  }

  export type PersonaMaxOrderByAggregateInput = {
    idPersona?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    correo?: SortOrder
    celular?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
  }

  export type PersonaMinOrderByAggregateInput = {
    idPersona?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    correo?: SortOrder
    celular?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
  }

  export type PersonaSumOrderByAggregateInput = {
    idPersona?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PersonaScalarRelationFilter = {
    is?: PersonaWhereInput
    isNot?: PersonaWhereInput
  }

  export type UsuarioRolListRelationFilter = {
    every?: UsuarioRolWhereInput
    some?: UsuarioRolWhereInput
    none?: UsuarioRolWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UsuarioRolOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsuarioCountOrderByAggregateInput = {
    idUsuario?: SortOrder
    personaId?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    ultimoLogin?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
  }

  export type UsuarioAvgOrderByAggregateInput = {
    idUsuario?: SortOrder
    personaId?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    idUsuario?: SortOrder
    personaId?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    ultimoLogin?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    idUsuario?: SortOrder
    personaId?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    ultimoLogin?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
  }

  export type UsuarioSumOrderByAggregateInput = {
    idUsuario?: SortOrder
    personaId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type RolCountOrderByAggregateInput = {
    idRol?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
  }

  export type RolAvgOrderByAggregateInput = {
    idRol?: SortOrder
  }

  export type RolMaxOrderByAggregateInput = {
    idRol?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
  }

  export type RolMinOrderByAggregateInput = {
    idRol?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
  }

  export type RolSumOrderByAggregateInput = {
    idRol?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UsuarioScalarRelationFilter = {
    is?: UsuarioWhereInput
    isNot?: UsuarioWhereInput
  }

  export type RolScalarRelationFilter = {
    is?: RolWhereInput
    isNot?: RolWhereInput
  }

  export type UsuarioRolUsuarioIdRolIdCompoundUniqueInput = {
    usuarioId: bigint | number
    rolId: bigint | number
  }

  export type UsuarioRolCountOrderByAggregateInput = {
    usuarioId?: SortOrder
    rolId?: SortOrder
  }

  export type UsuarioRolAvgOrderByAggregateInput = {
    usuarioId?: SortOrder
    rolId?: SortOrder
  }

  export type UsuarioRolMaxOrderByAggregateInput = {
    usuarioId?: SortOrder
    rolId?: SortOrder
  }

  export type UsuarioRolMinOrderByAggregateInput = {
    usuarioId?: SortOrder
    rolId?: SortOrder
  }

  export type UsuarioRolSumOrderByAggregateInput = {
    usuarioId?: SortOrder
    rolId?: SortOrder
  }

  export type UsuarioCreateNestedOneWithoutPersonaInput = {
    create?: XOR<UsuarioCreateWithoutPersonaInput, UsuarioUncheckedCreateWithoutPersonaInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutPersonaInput
    connect?: UsuarioWhereUniqueInput
  }

  export type UsuarioUncheckedCreateNestedOneWithoutPersonaInput = {
    create?: XOR<UsuarioCreateWithoutPersonaInput, UsuarioUncheckedCreateWithoutPersonaInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutPersonaInput
    connect?: UsuarioWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UsuarioUpdateOneWithoutPersonaNestedInput = {
    create?: XOR<UsuarioCreateWithoutPersonaInput, UsuarioUncheckedCreateWithoutPersonaInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutPersonaInput
    upsert?: UsuarioUpsertWithoutPersonaInput
    disconnect?: UsuarioWhereInput | boolean
    delete?: UsuarioWhereInput | boolean
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutPersonaInput, UsuarioUpdateWithoutPersonaInput>, UsuarioUncheckedUpdateWithoutPersonaInput>
  }

  export type UsuarioUncheckedUpdateOneWithoutPersonaNestedInput = {
    create?: XOR<UsuarioCreateWithoutPersonaInput, UsuarioUncheckedCreateWithoutPersonaInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutPersonaInput
    upsert?: UsuarioUpsertWithoutPersonaInput
    disconnect?: UsuarioWhereInput | boolean
    delete?: UsuarioWhereInput | boolean
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutPersonaInput, UsuarioUpdateWithoutPersonaInput>, UsuarioUncheckedUpdateWithoutPersonaInput>
  }

  export type PersonaCreateNestedOneWithoutUsuarioInput = {
    create?: XOR<PersonaCreateWithoutUsuarioInput, PersonaUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: PersonaCreateOrConnectWithoutUsuarioInput
    connect?: PersonaWhereUniqueInput
  }

  export type UsuarioRolCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<UsuarioRolCreateWithoutUsuarioInput, UsuarioRolUncheckedCreateWithoutUsuarioInput> | UsuarioRolCreateWithoutUsuarioInput[] | UsuarioRolUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: UsuarioRolCreateOrConnectWithoutUsuarioInput | UsuarioRolCreateOrConnectWithoutUsuarioInput[]
    createMany?: UsuarioRolCreateManyUsuarioInputEnvelope
    connect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
  }

  export type UsuarioRolUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<UsuarioRolCreateWithoutUsuarioInput, UsuarioRolUncheckedCreateWithoutUsuarioInput> | UsuarioRolCreateWithoutUsuarioInput[] | UsuarioRolUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: UsuarioRolCreateOrConnectWithoutUsuarioInput | UsuarioRolCreateOrConnectWithoutUsuarioInput[]
    createMany?: UsuarioRolCreateManyUsuarioInputEnvelope
    connect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type PersonaUpdateOneRequiredWithoutUsuarioNestedInput = {
    create?: XOR<PersonaCreateWithoutUsuarioInput, PersonaUncheckedCreateWithoutUsuarioInput>
    connectOrCreate?: PersonaCreateOrConnectWithoutUsuarioInput
    upsert?: PersonaUpsertWithoutUsuarioInput
    connect?: PersonaWhereUniqueInput
    update?: XOR<XOR<PersonaUpdateToOneWithWhereWithoutUsuarioInput, PersonaUpdateWithoutUsuarioInput>, PersonaUncheckedUpdateWithoutUsuarioInput>
  }

  export type UsuarioRolUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<UsuarioRolCreateWithoutUsuarioInput, UsuarioRolUncheckedCreateWithoutUsuarioInput> | UsuarioRolCreateWithoutUsuarioInput[] | UsuarioRolUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: UsuarioRolCreateOrConnectWithoutUsuarioInput | UsuarioRolCreateOrConnectWithoutUsuarioInput[]
    upsert?: UsuarioRolUpsertWithWhereUniqueWithoutUsuarioInput | UsuarioRolUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: UsuarioRolCreateManyUsuarioInputEnvelope
    set?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    disconnect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    delete?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    connect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    update?: UsuarioRolUpdateWithWhereUniqueWithoutUsuarioInput | UsuarioRolUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: UsuarioRolUpdateManyWithWhereWithoutUsuarioInput | UsuarioRolUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: UsuarioRolScalarWhereInput | UsuarioRolScalarWhereInput[]
  }

  export type UsuarioRolUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<UsuarioRolCreateWithoutUsuarioInput, UsuarioRolUncheckedCreateWithoutUsuarioInput> | UsuarioRolCreateWithoutUsuarioInput[] | UsuarioRolUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: UsuarioRolCreateOrConnectWithoutUsuarioInput | UsuarioRolCreateOrConnectWithoutUsuarioInput[]
    upsert?: UsuarioRolUpsertWithWhereUniqueWithoutUsuarioInput | UsuarioRolUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: UsuarioRolCreateManyUsuarioInputEnvelope
    set?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    disconnect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    delete?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    connect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    update?: UsuarioRolUpdateWithWhereUniqueWithoutUsuarioInput | UsuarioRolUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: UsuarioRolUpdateManyWithWhereWithoutUsuarioInput | UsuarioRolUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: UsuarioRolScalarWhereInput | UsuarioRolScalarWhereInput[]
  }

  export type UsuarioRolCreateNestedManyWithoutRolInput = {
    create?: XOR<UsuarioRolCreateWithoutRolInput, UsuarioRolUncheckedCreateWithoutRolInput> | UsuarioRolCreateWithoutRolInput[] | UsuarioRolUncheckedCreateWithoutRolInput[]
    connectOrCreate?: UsuarioRolCreateOrConnectWithoutRolInput | UsuarioRolCreateOrConnectWithoutRolInput[]
    createMany?: UsuarioRolCreateManyRolInputEnvelope
    connect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
  }

  export type UsuarioRolUncheckedCreateNestedManyWithoutRolInput = {
    create?: XOR<UsuarioRolCreateWithoutRolInput, UsuarioRolUncheckedCreateWithoutRolInput> | UsuarioRolCreateWithoutRolInput[] | UsuarioRolUncheckedCreateWithoutRolInput[]
    connectOrCreate?: UsuarioRolCreateOrConnectWithoutRolInput | UsuarioRolCreateOrConnectWithoutRolInput[]
    createMany?: UsuarioRolCreateManyRolInputEnvelope
    connect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UsuarioRolUpdateManyWithoutRolNestedInput = {
    create?: XOR<UsuarioRolCreateWithoutRolInput, UsuarioRolUncheckedCreateWithoutRolInput> | UsuarioRolCreateWithoutRolInput[] | UsuarioRolUncheckedCreateWithoutRolInput[]
    connectOrCreate?: UsuarioRolCreateOrConnectWithoutRolInput | UsuarioRolCreateOrConnectWithoutRolInput[]
    upsert?: UsuarioRolUpsertWithWhereUniqueWithoutRolInput | UsuarioRolUpsertWithWhereUniqueWithoutRolInput[]
    createMany?: UsuarioRolCreateManyRolInputEnvelope
    set?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    disconnect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    delete?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    connect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    update?: UsuarioRolUpdateWithWhereUniqueWithoutRolInput | UsuarioRolUpdateWithWhereUniqueWithoutRolInput[]
    updateMany?: UsuarioRolUpdateManyWithWhereWithoutRolInput | UsuarioRolUpdateManyWithWhereWithoutRolInput[]
    deleteMany?: UsuarioRolScalarWhereInput | UsuarioRolScalarWhereInput[]
  }

  export type UsuarioRolUncheckedUpdateManyWithoutRolNestedInput = {
    create?: XOR<UsuarioRolCreateWithoutRolInput, UsuarioRolUncheckedCreateWithoutRolInput> | UsuarioRolCreateWithoutRolInput[] | UsuarioRolUncheckedCreateWithoutRolInput[]
    connectOrCreate?: UsuarioRolCreateOrConnectWithoutRolInput | UsuarioRolCreateOrConnectWithoutRolInput[]
    upsert?: UsuarioRolUpsertWithWhereUniqueWithoutRolInput | UsuarioRolUpsertWithWhereUniqueWithoutRolInput[]
    createMany?: UsuarioRolCreateManyRolInputEnvelope
    set?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    disconnect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    delete?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    connect?: UsuarioRolWhereUniqueInput | UsuarioRolWhereUniqueInput[]
    update?: UsuarioRolUpdateWithWhereUniqueWithoutRolInput | UsuarioRolUpdateWithWhereUniqueWithoutRolInput[]
    updateMany?: UsuarioRolUpdateManyWithWhereWithoutRolInput | UsuarioRolUpdateManyWithWhereWithoutRolInput[]
    deleteMany?: UsuarioRolScalarWhereInput | UsuarioRolScalarWhereInput[]
  }

  export type UsuarioCreateNestedOneWithoutRolesInput = {
    create?: XOR<UsuarioCreateWithoutRolesInput, UsuarioUncheckedCreateWithoutRolesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutRolesInput
    connect?: UsuarioWhereUniqueInput
  }

  export type RolCreateNestedOneWithoutUsuariosInput = {
    create?: XOR<RolCreateWithoutUsuariosInput, RolUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: RolCreateOrConnectWithoutUsuariosInput
    connect?: RolWhereUniqueInput
  }

  export type UsuarioUpdateOneRequiredWithoutRolesNestedInput = {
    create?: XOR<UsuarioCreateWithoutRolesInput, UsuarioUncheckedCreateWithoutRolesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutRolesInput
    upsert?: UsuarioUpsertWithoutRolesInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutRolesInput, UsuarioUpdateWithoutRolesInput>, UsuarioUncheckedUpdateWithoutRolesInput>
  }

  export type RolUpdateOneRequiredWithoutUsuariosNestedInput = {
    create?: XOR<RolCreateWithoutUsuariosInput, RolUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: RolCreateOrConnectWithoutUsuariosInput
    upsert?: RolUpsertWithoutUsuariosInput
    connect?: RolWhereUniqueInput
    update?: XOR<XOR<RolUpdateToOneWithWhereWithoutUsuariosInput, RolUpdateWithoutUsuariosInput>, RolUncheckedUpdateWithoutUsuariosInput>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UsuarioCreateWithoutPersonaInput = {
    idUsuario?: bigint | number
    username: string
    passwordHash: string
    ultimoLogin?: Date | string | null
    activo?: boolean
    createdAt?: Date | string
    roles?: UsuarioRolCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutPersonaInput = {
    idUsuario?: bigint | number
    username: string
    passwordHash: string
    ultimoLogin?: Date | string | null
    activo?: boolean
    createdAt?: Date | string
    roles?: UsuarioRolUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutPersonaInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutPersonaInput, UsuarioUncheckedCreateWithoutPersonaInput>
  }

  export type UsuarioUpsertWithoutPersonaInput = {
    update: XOR<UsuarioUpdateWithoutPersonaInput, UsuarioUncheckedUpdateWithoutPersonaInput>
    create: XOR<UsuarioCreateWithoutPersonaInput, UsuarioUncheckedCreateWithoutPersonaInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutPersonaInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutPersonaInput, UsuarioUncheckedUpdateWithoutPersonaInput>
  }

  export type UsuarioUpdateWithoutPersonaInput = {
    idUsuario?: BigIntFieldUpdateOperationsInput | bigint | number
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    ultimoLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roles?: UsuarioRolUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutPersonaInput = {
    idUsuario?: BigIntFieldUpdateOperationsInput | bigint | number
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    ultimoLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roles?: UsuarioRolUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type PersonaCreateWithoutUsuarioInput = {
    idPersona?: bigint | number
    nombres: string
    apellidos: string
    correo: string
    celular: string
    activo?: boolean
    createdAt?: Date | string
  }

  export type PersonaUncheckedCreateWithoutUsuarioInput = {
    idPersona?: bigint | number
    nombres: string
    apellidos: string
    correo: string
    celular: string
    activo?: boolean
    createdAt?: Date | string
  }

  export type PersonaCreateOrConnectWithoutUsuarioInput = {
    where: PersonaWhereUniqueInput
    create: XOR<PersonaCreateWithoutUsuarioInput, PersonaUncheckedCreateWithoutUsuarioInput>
  }

  export type UsuarioRolCreateWithoutUsuarioInput = {
    rol: RolCreateNestedOneWithoutUsuariosInput
  }

  export type UsuarioRolUncheckedCreateWithoutUsuarioInput = {
    rolId: bigint | number
  }

  export type UsuarioRolCreateOrConnectWithoutUsuarioInput = {
    where: UsuarioRolWhereUniqueInput
    create: XOR<UsuarioRolCreateWithoutUsuarioInput, UsuarioRolUncheckedCreateWithoutUsuarioInput>
  }

  export type UsuarioRolCreateManyUsuarioInputEnvelope = {
    data: UsuarioRolCreateManyUsuarioInput | UsuarioRolCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type PersonaUpsertWithoutUsuarioInput = {
    update: XOR<PersonaUpdateWithoutUsuarioInput, PersonaUncheckedUpdateWithoutUsuarioInput>
    create: XOR<PersonaCreateWithoutUsuarioInput, PersonaUncheckedCreateWithoutUsuarioInput>
    where?: PersonaWhereInput
  }

  export type PersonaUpdateToOneWithWhereWithoutUsuarioInput = {
    where?: PersonaWhereInput
    data: XOR<PersonaUpdateWithoutUsuarioInput, PersonaUncheckedUpdateWithoutUsuarioInput>
  }

  export type PersonaUpdateWithoutUsuarioInput = {
    idPersona?: BigIntFieldUpdateOperationsInput | bigint | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    celular?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonaUncheckedUpdateWithoutUsuarioInput = {
    idPersona?: BigIntFieldUpdateOperationsInput | bigint | number
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    correo?: StringFieldUpdateOperationsInput | string
    celular?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioRolUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: UsuarioRolWhereUniqueInput
    update: XOR<UsuarioRolUpdateWithoutUsuarioInput, UsuarioRolUncheckedUpdateWithoutUsuarioInput>
    create: XOR<UsuarioRolCreateWithoutUsuarioInput, UsuarioRolUncheckedCreateWithoutUsuarioInput>
  }

  export type UsuarioRolUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: UsuarioRolWhereUniqueInput
    data: XOR<UsuarioRolUpdateWithoutUsuarioInput, UsuarioRolUncheckedUpdateWithoutUsuarioInput>
  }

  export type UsuarioRolUpdateManyWithWhereWithoutUsuarioInput = {
    where: UsuarioRolScalarWhereInput
    data: XOR<UsuarioRolUpdateManyMutationInput, UsuarioRolUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type UsuarioRolScalarWhereInput = {
    AND?: UsuarioRolScalarWhereInput | UsuarioRolScalarWhereInput[]
    OR?: UsuarioRolScalarWhereInput[]
    NOT?: UsuarioRolScalarWhereInput | UsuarioRolScalarWhereInput[]
    usuarioId?: BigIntFilter<"UsuarioRol"> | bigint | number
    rolId?: BigIntFilter<"UsuarioRol"> | bigint | number
  }

  export type UsuarioRolCreateWithoutRolInput = {
    usuario: UsuarioCreateNestedOneWithoutRolesInput
  }

  export type UsuarioRolUncheckedCreateWithoutRolInput = {
    usuarioId: bigint | number
  }

  export type UsuarioRolCreateOrConnectWithoutRolInput = {
    where: UsuarioRolWhereUniqueInput
    create: XOR<UsuarioRolCreateWithoutRolInput, UsuarioRolUncheckedCreateWithoutRolInput>
  }

  export type UsuarioRolCreateManyRolInputEnvelope = {
    data: UsuarioRolCreateManyRolInput | UsuarioRolCreateManyRolInput[]
    skipDuplicates?: boolean
  }

  export type UsuarioRolUpsertWithWhereUniqueWithoutRolInput = {
    where: UsuarioRolWhereUniqueInput
    update: XOR<UsuarioRolUpdateWithoutRolInput, UsuarioRolUncheckedUpdateWithoutRolInput>
    create: XOR<UsuarioRolCreateWithoutRolInput, UsuarioRolUncheckedCreateWithoutRolInput>
  }

  export type UsuarioRolUpdateWithWhereUniqueWithoutRolInput = {
    where: UsuarioRolWhereUniqueInput
    data: XOR<UsuarioRolUpdateWithoutRolInput, UsuarioRolUncheckedUpdateWithoutRolInput>
  }

  export type UsuarioRolUpdateManyWithWhereWithoutRolInput = {
    where: UsuarioRolScalarWhereInput
    data: XOR<UsuarioRolUpdateManyMutationInput, UsuarioRolUncheckedUpdateManyWithoutRolInput>
  }

  export type UsuarioCreateWithoutRolesInput = {
    idUsuario?: bigint | number
    username: string
    passwordHash: string
    ultimoLogin?: Date | string | null
    activo?: boolean
    createdAt?: Date | string
    persona: PersonaCreateNestedOneWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutRolesInput = {
    idUsuario?: bigint | number
    personaId: bigint | number
    username: string
    passwordHash: string
    ultimoLogin?: Date | string | null
    activo?: boolean
    createdAt?: Date | string
  }

  export type UsuarioCreateOrConnectWithoutRolesInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutRolesInput, UsuarioUncheckedCreateWithoutRolesInput>
  }

  export type RolCreateWithoutUsuariosInput = {
    idRol?: bigint | number
    nombre: string
    descripcion?: string | null
  }

  export type RolUncheckedCreateWithoutUsuariosInput = {
    idRol?: bigint | number
    nombre: string
    descripcion?: string | null
  }

  export type RolCreateOrConnectWithoutUsuariosInput = {
    where: RolWhereUniqueInput
    create: XOR<RolCreateWithoutUsuariosInput, RolUncheckedCreateWithoutUsuariosInput>
  }

  export type UsuarioUpsertWithoutRolesInput = {
    update: XOR<UsuarioUpdateWithoutRolesInput, UsuarioUncheckedUpdateWithoutRolesInput>
    create: XOR<UsuarioCreateWithoutRolesInput, UsuarioUncheckedCreateWithoutRolesInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutRolesInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutRolesInput, UsuarioUncheckedUpdateWithoutRolesInput>
  }

  export type UsuarioUpdateWithoutRolesInput = {
    idUsuario?: BigIntFieldUpdateOperationsInput | bigint | number
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    ultimoLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    persona?: PersonaUpdateOneRequiredWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutRolesInput = {
    idUsuario?: BigIntFieldUpdateOperationsInput | bigint | number
    personaId?: BigIntFieldUpdateOperationsInput | bigint | number
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    ultimoLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RolUpsertWithoutUsuariosInput = {
    update: XOR<RolUpdateWithoutUsuariosInput, RolUncheckedUpdateWithoutUsuariosInput>
    create: XOR<RolCreateWithoutUsuariosInput, RolUncheckedCreateWithoutUsuariosInput>
    where?: RolWhereInput
  }

  export type RolUpdateToOneWithWhereWithoutUsuariosInput = {
    where?: RolWhereInput
    data: XOR<RolUpdateWithoutUsuariosInput, RolUncheckedUpdateWithoutUsuariosInput>
  }

  export type RolUpdateWithoutUsuariosInput = {
    idRol?: BigIntFieldUpdateOperationsInput | bigint | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RolUncheckedUpdateWithoutUsuariosInput = {
    idRol?: BigIntFieldUpdateOperationsInput | bigint | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UsuarioRolCreateManyUsuarioInput = {
    rolId: bigint | number
  }

  export type UsuarioRolUpdateWithoutUsuarioInput = {
    rol?: RolUpdateOneRequiredWithoutUsuariosNestedInput
  }

  export type UsuarioRolUncheckedUpdateWithoutUsuarioInput = {
    rolId?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type UsuarioRolUncheckedUpdateManyWithoutUsuarioInput = {
    rolId?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type UsuarioRolCreateManyRolInput = {
    usuarioId: bigint | number
  }

  export type UsuarioRolUpdateWithoutRolInput = {
    usuario?: UsuarioUpdateOneRequiredWithoutRolesNestedInput
  }

  export type UsuarioRolUncheckedUpdateWithoutRolInput = {
    usuarioId?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type UsuarioRolUncheckedUpdateManyWithoutRolInput = {
    usuarioId?: BigIntFieldUpdateOperationsInput | bigint | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}