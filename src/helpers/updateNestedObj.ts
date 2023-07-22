export const updateNestedObj = (obj: any): any => {
  let final: any = {};

  Object.keys(obj).map((k) => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const result = updateNestedObj(obj[k]);
      Object.keys(result).forEach((a) => {
        final[`${k}.${a}`] = result[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};
