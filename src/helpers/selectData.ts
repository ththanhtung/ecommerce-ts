const getSelectData = (attrs: string[]): { [k: string]: number } => {
  return Object.fromEntries(attrs.map((element) => [element, 1]));
};

const unSelectData = (attrs: string[]): { [k: string]: number } => {
  return Object.fromEntries(attrs.map((element) => [element, 0]));
};

export {
  getSelectData, 
  unSelectData
}