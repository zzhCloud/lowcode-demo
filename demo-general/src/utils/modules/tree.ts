/**
 * @Description: 遍历树并执行函数
 * @author ZZH
 * @params tree<any[]> 数据源
 * @params cbFn<any> 回调函数
 * @params childrenKey<string> 遍历子集的key
 * @date 2022/10/18
 */
export const traverseTree = (
  tree: any,
  cbFn: (data: any) => any,
  childrenKey = 'children'
) => {
  if (!Array.isArray(tree)) return false;

  const stack = [...tree];
  while (stack.length) {
    const next = stack.pop();
    if (next[childrenKey]) stack.push(...next[childrenKey]);

    cbFn(next);
  }
  return tree;
};

/**
 * @Description: 树转map
 * @author ZZH
 * @params tree<any[]> 数据源
 * @params valueKey<string> map的key字段取值
 * @params childrenKey<string> 遍历子集的key
 * @date 2022/10/18
 */
export const traverseTreeToMap = (
  tree: any,
  childrenKey = 'children',
  valueKey = 'value'
) => {
  if (!Array.isArray(tree)) return false;

  const treeMap = {};
  const stack = [...tree];
  while (stack.length) {
    const next = stack.pop();
    if (next[childrenKey]) stack.push(...next[childrenKey]);

    treeMap[next[valueKey]] = next;
  }
  return treeMap;
};
