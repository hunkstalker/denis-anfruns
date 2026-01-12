
// --- Mini Test Runner (No vitest needed) ---
let passed = 0;
let failed = 0;

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`S'esperava ${expected} però s'ha rebut ${actual}`);
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

test('procesarInput ha de gestionar strings (MAJÚSCULES)', () => {
    // @ts-ignore
    if (typeof procesarInput !== 'function') {
        throw new Error("La funció 'procesarInput' no existeix.");
    }
    // @ts-ignore
    const result = procesarInput("hola");
    expect(result).toBe("HOLA");
});

test('procesarInput ha de gestionar números (2 decimals)', () => {
    // @ts-ignore
    const result = procesarInput(10.5678);
    expect(result).toBe("10.57");
});

test('procesarInput NO ha d\'alterar altres números', () => {
    // @ts-ignore
    const result = procesarInput(5);
    expect(result).toBe("5.00");
});

if (passed > 0 && failed === 0) {
    console.log("Felicitats! 🎉 Has completat l'exercici.");
    // Trigger global success callback if available
    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
} else {
    console.log(`Resultats: ${passed} passats, ${failed} fallats.`);
}
