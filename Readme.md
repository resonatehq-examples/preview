# Getting Started with Resonate and the Resonate Typescript SDK

## Getting Started with the Resonate Server

The Resonate Server is the component that orchestrates workflows on Resonate Workers.

### Install the Resonate Server

```
brew install resonatehq/tp/resonate
```

# Run in Transient Mode

Ideal for development and testing.

```
resonate serve --aio-store-sqlite-path :memory:
```

This will start the Resonate Server in transient mode:
- listening on port `8001` for incoming http requests
- listening on port `8002` for outgoing Server Sent Events
- transiently storing data in memory.

> All data will be lost on shutdown.

# Run in Persistent Mode

Ideal for development, testing, and inspecting the database.

```
resonate serve
```

This will start the Resonate Server in transient mode:
- listening on port `8001` for incoming http requests
- listening on port `8002` for outgoing Server Sent Events
- persistently storing data on disk in `./resonate.db`

## Getting Started with the Resonate Typescript SDK

This is a preview of typescript SDK. The SDK is not imported as a dependency but copied into the src folder (src/dev, src/src)

### Install the Resonate Typescript SDK

```
npm install
```

# Run the example

```
ts-node src/index.ts
```

```
import { Resonate } from "./src/resonate";
import { Context } from "./src/context";

function* fibonacci(ctx: Context, n: number): Generator {
  if (n <= 1) {
    return n;
  }
  // Recursively invoke durable sub-computations
  return (
    (yield* ctx.run(fibonacci, n - 1)) + (yield* ctx.run(fibonacci, n - 2))
  );
}

async function main() {

  // Instantiate a Resonate runtime (connecting to https://localhost:8001 and https://localhost:8002)
  const resonate = Resonate.remote({});

  const convenientWrapper = resonate.register("fibonacci", fibonacci);

  // Start the computation, start locally
  const h = await convenientWrapper.beginRun("fibonacci.10", 10);

  // Await the result
  console.log("got", await h.result);
}

main().catch(console.error);
```
