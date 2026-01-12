
// --- Mini Test Runner ---
let passed = 0;
let failed = 0;

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected '${expected}' but got '${actual}'`);
      }
    },
    toThrow: (expectedMsg?: string) => {
      try {
        actual();
        throw new Error("Expected function to throw, but it didn't");
      } catch (err: any) {
        if (expectedMsg && !err.message.includes(expectedMsg)) {
           throw new Error(`Expected error containing '${expectedMsg}' but got '${err.message}'`);
        }
      }
    }
  };
}

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`❌ ${name}: ${err.message}`);
    failed++;
  }
}

// --- Validation Logic ---

test('Function safeUpperCase exists', () => {
    // @ts-ignore
    if (typeof safeUpperCase !== 'function') {
        throw new Error("You have not defined the function 'safeUpperCase'");
    }
});

test('Converts strings to UPPERCASE', () => {
    // @ts-ignore
    expect(safeUpperCase("typescript")).toBe("TYPESCRIPT");
});

test('Throws error if NOT string', () => {
    expect(() => {
        // @ts-ignore
         safeUpperCase(123);
    }).toThrow("Not text");
    
     expect(() => {
        // @ts-ignore
         safeUpperCase({});
    }).toThrow("Not text");
});


if (passed > 0 && failed === 0) {
    console.log("Perfect! 🛡️ You have handled 'unknown' safely.");
    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
} else {
    console.log(`Results: ${passed} passed, ${failed} failed.`);
}
