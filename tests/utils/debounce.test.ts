import { debounce } from "../../src";

describe("utils - debounce", () =>
{
    it("should debounce a function", (done) =>
    {
        let callCount = 0;

        const debounced = debounce(() => { ++callCount; }, 30);
        _call(debounced);

        expect(callCount).toEqual(0);
        setTimeout(() =>
        {
            expect(callCount).toEqual(1);
            done();
        }, 200);
    });

    it("should call `func` in the next tick when `delay` is `0`", (done) =>
    {
        let callCount = 0;

        const debounced = debounce(() => { ++callCount; }, 0);
        _call(debounced);

        expect(callCount).toEqual(0);
        setTimeout(() =>
        {
            expect(callCount).toEqual(1);
            done();
        }, 16);
    });
});

function _call(func: Function, count = 3)
{
    for (let i = 0; i < count; i++)
    {
        func();
    }
}
