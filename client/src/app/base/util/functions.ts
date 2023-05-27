export const isPresent = (value: unknown) => value !== undefined && value !== null;

export const isBlank = (value: unknown) => value === undefined || value === null;

export const toObject = <T, K extends string | number>(array: T[], keyAccessor: (item: T) => K): {
    [key: number | string]: T
} => {
    const object: { [key: number | string]: T } = {};
    array.forEach(item => {
        object[keyAccessor(item)] = item;
    });
    return object;
};
