### 二叉树重建

输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。

例如输入前序遍历序列 `{1,2,4,7,3,5,6,8}` 和中序遍历序列 `{4,7,2,1,5,3,8,6}` ，则重建二叉树并返回。


#### 思路

* 前序遍历：跟节点 + 左子树前序遍历 + 右子树前序遍历
* 中序遍历：左子树中序遍历 + 跟节点 + 右字数中序遍历
* 后序遍历：左子树后序遍历 + 右子树后序遍历 + 跟节点


**具体实现**
1. 前序遍历找到根结点root
2. 找到root在中序遍历的位置 -> 左子树的长度和右子树的长度
3. 截取左子树的中序遍历、右子树的中序遍历
4. 截取左子树的前序遍历、右子树的前序遍历
5. 递归重建二叉树

```
    function rebuild(pre, vin) {
        if (pre.length === 0) {
            return null;
        }
        if (pre.length === 1) {
            return new Tree(pre[0]);
        }
        const value = pre[0];
        const index = vin.indexOf(value);
        const vinLeft = vin.slice(0, index);
        const vinRight = vin.slice(index + 1);
        const preLeft = pre.slice(1, index + 1);
        const preRight = pre.slice(index + 1);
        const node = new Tree(value);
        node.left = rebuild(preLeft, vinLeft);
        node.right = rebuild(preRight, vinRight);
        return node;
    }
```
