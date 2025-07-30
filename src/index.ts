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
  // Instantiate a Resonate runtime (in-memory, no server needed)
  // const resonate = Resonate.local();

  // Instantiate a Resonate runtime (connecting to https://localhost:8001 and https://localhost:8002)
  const resonate = Resonate.remote({});

  const convenientWrapper = resonate.register("fibonacci", fibonacci);

  // Start the computation, start locally
  const h = await convenientWrapper.beginRun("fibonacci.10", 10);

  // STILL MISSING
  // Start the computation, start remotely
  // const h = await convenientWrapper.beginRpc("fibonacci.10", 10);

  // Alternatively
  // const h = await resonate.beginRun("fibonacci.10", "fibonacci", 10);
  // STILL MISSING
  // const h = await resonate.beginRpc("fibonacci.10", "fibonacci", 10);

  // Await the result
  console.log("got", await h.result);
}

main().catch(console.error);
