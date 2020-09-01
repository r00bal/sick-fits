describe('sample test 101', () => {
 it('works as expected', () => {
  expect(2).toEqual(2);
 });

 it('handles ranges just fine', () => {
  const age = 200;
  expect(age).toBeGreaterThan(100)
 })

 it('makes a list of dog name', () => {
  const dogs = ['snickers', 'hugo'];
  expect(dogs).toEqual(dogs);
  expect(dogs).toContain('snickers');
 })
})
