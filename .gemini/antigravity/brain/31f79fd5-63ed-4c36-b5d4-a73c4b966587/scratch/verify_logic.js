
function validateName(name) {
  if (typeof name !== 'string' || name.trim() === '') {
    return { status: 400, message: 'Name is required' };
  }
  return { status: 200, name: name.trim() };
}

const testCases = [
  { name: 'Valid Project', expected: { status: 200, name: 'Valid Project' } },
  { name: '  Trimmed Project  ', expected: { status: 200, name: 'Trimmed Project' } },
  { name: '', expected: { status: 400, message: 'Name is required' } },
  { name: '   ', expected: { status: 400, message: 'Name is required' } },
  { name: null, expected: { status: 400, message: 'Name is required' } },
  { name: undefined, expected: { status: 400, message: 'Name is required' } },
  { name: 123, expected: { status: 400, message: 'Name is required' } },
  { name: {}, expected: { status: 400, message: 'Name is required' } },
];

let allPassed = true;
testCases.forEach((tc, i) => {
  const result = validateName(tc.name);
  const passed = result.status === tc.expected.status && (result.name === tc.expected.name || result.message === tc.expected.message);
  console.log(`Test Case ${i + 1}: ${JSON.stringify(tc.name)} -> ${JSON.stringify(result)} [${passed ? 'PASS' : 'FAIL'}]`);
  if (!passed) allPassed = false;
});

if (allPassed) {
  console.log('\nAll validation logic tests passed!');
} else {
  console.log('\nSome tests failed.');
  process.exit(1);
}
