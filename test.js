const chai = require('chai');
const expect = chai.expect;

const jsonFixer = require('./jsonFixer');

describe('JSON Fixer', () => {
  describe('Case 1', () => {
    it('should fix', () => {
      const inp = `{"key1":{"key2":"value1","key3":"value2"},"anotherkey":"va`;
      const out = `{"key1":{"key2":"value1","key3":"value2"},"anotherkey":"va"}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 2', () => {
    it('should fix', () => {
      const inp = `{"key1":{"key2":"value1","key3":"value2"},"anoth`;
      const out = `{"key1":{"key2":"value1","key3":"value2"},"anoth":"VALUE"}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 3', () => {
    it('should fix', () => {
      const inp = `{"a":"b","c":"d","e`;
      const out = `{"a":"b","c":"d","e":"VALUE"}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 4', () => {
    it('should fix', () => {
      const inp = `{"a":"b","c":{"a":{"a":{"a":"b`;
      const out = `{"a":"b","c":{"a":{"a":{"a":"b"}}}}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 5', () => {
    it('should fix', () => {
      const inp = `{"key1":{"key2":"val`;
      const out = `{"key1":{"key2":"val"}}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 6', () => {
    it('should fix', () => {
      const inp = `{"key1":{"key2":"value1","key3":`;
      const out = `{"key1":{"key2":"value1","key3":"VALUE"}}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 7', () => {
    it('should fix', () => {
      const inp = `{"key1":{"key2":"value1","key3":"value2"},"key4":{"key5":"val`;
      const out = `{"key1":{"key2":"value1","key3":"value2"},"key4":{"key5":"val"}}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 8', () => {
    it('should fix', () => {
      const inp = `{"key1":{`;
      const out = `{"key1":{"UNKNOWN_KEY":"VALUE"}}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 9', () => {
    it('should fix', () => {
      const inp = `{"key1":`;
      const out = `{"key1":"VALUE"}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 10', () => {
    it('should fix', () => {
      const inp = `{"a":{"b":{"c{{":"test"},"d{":"a"}`;
      const out = `{"a":{"b":{"c{{":"test"},"d{":"a"}}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 11', () => {
    it('should fix', () => {
      const inp = `{"a":"b"}`;
      const out = `{"a":"b"}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
  describe('Case 12', () => {
    it('should fix', () => {
      const inp = `{"a":{"b":{"c":"}}"`;
      const out = `{"a":{"b":{"c":"}}"}}}`;
      expect(jsonFixer.fixJson(inp)).to.equal(out);
    })
  })
});