function Person(name, foods) {
 this.name = name;
 this.foods = foods;

}

Person.prototype.fetchFavFoods = function () {

 return new Promise((resolve, reject) => {
  setTimeout(() => resolve(this.foods), 2000);
 })
}



describe('mocking learning', () => {
 it('mocks a reg function', () => {
  const featchDogs = jest.fn();
  featchDogs('snickers');
  expect(featchDogs).toHaveBeenCalled();
  expect(featchDogs).toHaveBeenLastCalledWith('snickers')
  featchDogs('hugo');
  expect(featchDogs).toHaveBeenCalledTimes(2);
 });

 it('can create a person', () => {
  const me = new Person('Wes', ['pizza', 'burgs']);
  expect(me.name).toBe('Wes');
 });

 it('can fetch foods', async () => {
  const me = new Person('Wes', ['pizza', 'burgs']);
  // mock the favFoods function
  me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'ramen']);
  const favFoods = await me.fetchFavFoods();
  // console.log(favFoods);
  expect(favFoods).toContain('ramen');
 });
});
