import { afterEach, describe, expect, it } from "vitest";
import { isDemoMode } from "./runtime";

const original = process.env.DEMO_MODE;

afterEach(() => {
  if (original === undefined) delete process.env.DEMO_MODE;
  else process.env.DEMO_MODE = original;
});

describe("runtime mode isolation", () => {
  it("does not enable fixtures by default", () => {
    delete process.env.DEMO_MODE;
    expect(isDemoMode()).toBe(false);
  });

  it("requires the explicit true value", () => {
    process.env.DEMO_MODE = "TRUE";
    expect(isDemoMode()).toBe(false);
    process.env.DEMO_MODE = "true";
    expect(isDemoMode()).toBe(true);
  });
});
