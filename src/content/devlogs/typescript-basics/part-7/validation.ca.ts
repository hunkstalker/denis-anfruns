
// --- Mini Test Runner ---
let passed = 0;
let failed = 0;

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`S'esperava '${expected}' però s'ha rebut '${actual}'`);
      }
    },
    toThrow: (expectedMsg?: string) => {
      try {
        actual();
        throw new Error("S'esperava que la funció llancés un error, però no ho ha fet");
      } catch (err: any) {
        if (expectedMsg && !err.message.includes(expectedMsg)) {
           throw new Error(`S'esperava error contenint '${expectedMsg}' però s'ha rebut '${err.message}'`);
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

test('Existeix la funció safeUpperCase', () => {
    // @ts-ignore
    if (typeof safeUpperCase !== 'function') {
        throw new Error("No has definit la funció 'safeUpperCase'");
    }
});

test('Converteix strings a MAJÚSCULES', () => {
    // @ts-ignore
    expect(safeUpperCase("typescript")).toBe("TYPESCRIPT");
});

test('Llança error si NO és string', () => {
    expect(() => {
        // @ts-ignore
         safeUpperCase(123);
    }).toThrow("No és text");
    
     expect(() => {
        // @ts-ignore
         safeUpperCase({});
    }).toThrow("No és text");
});


if (passed > 0 && failed === 0) {
    console.log("Perfecte! 🛡️ Has gestionat 'unknown' de forma segura.");
    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
} else {
    console.log(`Resultats: ${passed} passats, ${failed} fallats.`);
}
