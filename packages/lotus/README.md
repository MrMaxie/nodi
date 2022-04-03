# Nodi - Lotus

## `Type`

Have to check if given (unknown at this point) value fits described type along with optional checking shape of such value.

**Examples:**

```ts
// simple type
const string = () =>
    type('string', value => typeof value === 'string');

// usage:
string().assert(''); // => OK!
string().assert(10); // => throws UnknownAssertError
```

```ts
// shape-forced type
const string = () =>
    type('string', value =>
        typeof value === 'string'
        && value.length > 3
    );

// usage:
string().assert('aaaa'); // => OK!
string().assert('aa');   // => throws UnknownAssertError
string().assert(15);     // => throws UnknownAssertError
```

```ts
// argument-based type
const string = (minLength: number) =>
    type('string', value =>
        typeof value === 'string'
        && value.length >= minLength
    );

// usage:
string(4).assert('aaaa'); // => OK!
string(2).assert('aa');   // => OK!
string(4).assert('aaa');  // => throws UnknownAssertError
string(0).assert('');     // => OK!
```

```ts
// readable reasons of errors
const string = (minLength: number) => {
    // declare errors:
    const NonString = InternalError('non_string');
    const InvalidLength = ExternalError<{
        current: number;
        min: number;
    }>('invalid_length_string');

    // declare type with
    return type('string', [
        NonString,
        InvalidLength,
    ], value => {
        if (typeof value !== 'string') {
            throw new NonString();
        }

        if (value.length >= minLength) {
            throw new InvalidLength({
                current: value.length,
                min: minLength,
            });
        }

        return true;
    });
};

// usage:
string(5).assert('aaaa');
/*
=> throws ExternalError{
    code: 'invalid_length_string'
    data: { current: 4, min: 5 }
}
*/
string(Infinity).assert('aa');
/*
=> throws ExternalError{
    code: 'invalid_length_string'
    data: { current: 2, min: Infinity }
}
*/
string(1).assert(1);
/*
=> throws InternalError{
    code: 'non_string'
}
*/
string(0).assert('');
// => OK!
```