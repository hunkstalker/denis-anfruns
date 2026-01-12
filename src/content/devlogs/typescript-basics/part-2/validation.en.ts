declare const onSuccess: () => void;

// If the user's code runs up to here, it means TypeScript hasn't failed.
// So we can consider it valid directly.
console.log("✅ Great! Now it works correctly. 🎉");
onSuccess();

export {};
