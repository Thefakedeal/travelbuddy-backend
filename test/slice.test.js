const assert = require('assert')
const {slice,remove} = require('../src/helpers/objects')


describe('Slice',()=>{
    it('Only Returns the object with alloted keys [name, age]',()=>{
        const object = {name: "tom", age:12, sex: 'M'};
        const expectedSlice = {name: "tom", age:12,}
        assert.deepStrictEqual(slice(object,['name','age']),expectedSlice);
    })
})

describe('Slice',()=>{
    it(' returns empty object',()=>{
        const object = {name: "tom", age:12, sex: 'M'};
        assert.deepStrictEqual(slice(object),{});
    })
})

describe('Slice',()=>{
    it(' returns the whole object',()=>{
        const object = {name: "tom", age:12, sex: 'M'};
        assert.deepStrictEqual(slice(object,Object.keys(object)),object);
    })
})

describe('Remove',()=>{
    it('strips the object with alloted keys [sex]',()=>{
        const object = {name: "tom", age:12, sex: 'M'};
        const expectedSlice = {name: "tom", age:12,}
        assert.deepStrictEqual(remove(object,['sex']),expectedSlice);
    })
})

describe('Remove',()=>{
    it(' returns the empty object',()=>{
        const object = {name: "tom", age:12, sex: 'M'};
        assert.deepStrictEqual(remove(object,Object.keys(object)),{});
    })
})
describe('Remove',()=>{
    it(' returns the actual object',()=>{
        const object = {name: "tom", age:12, sex: 'M'};
        assert.deepStrictEqual(remove(object),object);
    })
})