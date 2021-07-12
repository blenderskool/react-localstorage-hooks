export const deserialize = <T>(data: string | null): T => data === 'undefined' ? undefined : JSON.parse(data!);

export const serialize = <T>(data: T): string => data === undefined ? 'undefined' : JSON.stringify(data);
