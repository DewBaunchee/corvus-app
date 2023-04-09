export const isPresent = (value: unknown) => value !== undefined && value !== null;

export const isBlank = (value: unknown) => value === undefined || value === null;
