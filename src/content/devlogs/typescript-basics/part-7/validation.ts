
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

test('Existe la función safeUpperCase', () => {
    // @ts-ignore
    if (typeof safeUpperCase !== 'function') {
        throw new Error("No has definido la función 'safeUpperCase'");
    }
});

test('Convierte strings a mayúsculas', () => {
    // @ts-ignore
    expect(safeUpperCase("typescript")).toBe("TYPESCRIPT");
});

test('Lanza error si NO es string', () => {
    expect(() => {
        // @ts-ignore
         safeUpperCase(123);
    }).toThrow("No es texto");
    
     expect(() => {
        // @ts-ignore
         safeUpperCase({});
    }).toThrow("No es texto");
});


if (passed > 0 && failed === 0) {
    console.log("¡Perfecto! 🛡️ Has manejado 'unknown' de forma segura.");
    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
} else {
    console.log(`Resultados: ${passed} pasados, ${failed} fallados.`);
}
