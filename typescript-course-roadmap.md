
# TypeScript Mini-Course Roadmap

Goal: Move from basic inference to advanced types (`keyof`, `typeof`, `infer`, Generics).

## Completed
1. **Part 1: La Inferencia trabaja por ti**
   - Inference basics
   - `const` vs `let`
   - When to annotate

2. **Part 2: Tipos Literales y Uniones**
   - Literal types
   - Union types (`|`)
   - Type narrowing (basic)

## Planned

3. **Part 3: Objetos e Interfaces**
   - `type` vs `interface`
   - Optional properties (`?`)
   - Readonly properties
   - Extends (Intro)

4. **Part 4: Arrays y Tuplas** (vs Objetos)
    - `string[]` vs `Array<string>`
    - Tuplas `[string, number]` - ¿Por qué usarlas?

5. **Part 5: El operador `typeof` y `keyof`** (The real magic starts here)
   - Deriving types from values (`typeof`)
   - Getting keys from types (`keyof`)
   - Combination: `keyof typeof`

6. **Part 6: Generics (Lo básico)**
   - Making types reusable
   - `<T>` syntax
   - Practical example: `State<T>`

7. **Part 7: Generics Intermedio - Constraints & Defaults**
   - Restringiendo Generics con `extends` (`<T extends object>`)
   - Valores por defecto (`<T = string>`)
   - `keyof` en Generics

8. **Part 8: Mezclando Conceptos (Generics + Interfaces)**
   - El tema confuso: Generics en Interfaces vs Tipos
   - "Pass-through" generics (prop drill de tipos)
   - Tipando respuestas de API (Datawrapper pattern)

9. **Part 9: Utility Types**
   - Partial, Pick, Omit
   - Creating your own utility types (Intro to Mapped Types)

10. **Part 10: Advanced Inference (`infer` keyword)**
    - Conditional types
    - `ReturnType<T>` implementation

11. **Part 11: La traca final - Patterns Reales**
    - Sobrecarga de funciones (Function Overloads)
    - Builder Pattern con tipos
    - Creando una mini-librería type-safe
