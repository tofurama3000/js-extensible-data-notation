import { Edn } from './index';

const input =
  '([{:id 1, :img "https://get.pxhere.com/photo/hand-people-girl-woman-white-female-finger-clothing-outerwear-shirt-denim-sweater-collar-caucasian-posing-textile-neck-pocket-royalty-free-poses-hey-sleeve-t-shirt-elearning-fashion-accessory-607479.jpg", :firstName "Raul", :lastName "Heaney", :name "Raul Heaney", :email "heaney.raul@klockobergstrom.info", :permissionGroup {:id 3, :name "Sales Rep"}, :enabled true}])\n';

describe('Parse Test', () => {
  it('Parses just fine', () => {
    const response = Edn.parse(input);
    expect(response[0][0][0].get(Edn.types.keyword('enabled'))).toBe(true);
  });
});
