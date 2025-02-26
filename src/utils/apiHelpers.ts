export function buildQueryParams<T extends object>(params: T): URLSearchParams {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const value = params[key as keyof T];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) =>
          queryParams.append(
            key,
            typeof item === 'boolean'
              ? item
                ? 'true'
                : 'false'
              : item.toString(),
          ),
        );
      } else {
        queryParams.append(
          key,
          typeof value === 'boolean'
            ? value
              ? 'true'
              : 'false'
            : value.toString(),
        );
      }
    }
  });
  return queryParams;
}
