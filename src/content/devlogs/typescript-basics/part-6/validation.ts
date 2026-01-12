
// --- Mini Test Runner (No vitest needed) ---
let passed = 0;
let failed = 0;

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
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

test('procesarInput devuelve strings (MAYÚSCULAS)', () => {
    // @ts-ignore
    if (typeof procesarInput !== 'function') {
        throw new Error("La función 'procesarInput' no existe.");
    }
    // @ts-ignore
    const result = procesarInput("hola");
    expect(result).toBe("HOLA");
});

test('procesarInput devuelve números (2 decimales)', () => {
    // @ts-ignore
    const result = procesarInput(10.5678);
    expect(result).toBe("10.57");
});

test('procesarInput NO debe alterar otros números', () => {
    // @ts-ignore
    const result = procesarInput(5);
    expect(result).toBe("5.00");
});

if (passed > 0 && failed === 0) {
    console.log("¡Felicidades! 🎉 Has completado el ejercicio.");
    // Trigger global success callback if available
    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
} else {
    console.log(`Resultados: ${passed} pasados, ${failed} fallados.`);
}
