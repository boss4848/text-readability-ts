import readability from '../src';

test('textStandard', () => {
    const result = readability.textStandard('This is a test');
    expect(result).toBe("1st and 2nd grade");
});