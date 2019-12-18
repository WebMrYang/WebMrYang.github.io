### 1. 判断是否是后续遍历

输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历的结果。如果是则输出Yes,否则输出No。假设输入的数组的任意两个数字都互不相同。


#### 思路

1. 后序遍历：分成三部分：最后一个节点为跟节点，第二部分为左子树的值比跟节点都小，第三部分为右子树的值比跟节点都大。

2. 先检测左子树，左侧比跟节点小的值都判定为左子树。

3. 除最后一个节点外和左子树外的其他值为右子树，右子树有一个比跟节点小，则返回false。

4. 若存在，左、右子树，递归检测左、右子树是否复合规范。


#### 代码

```
    function VerifySquenceOfBST(sequence) {
      if (sequence && sequence.length > 0) {
        var root = sequence[sequence.length - 1]
        for (var i = 0; i < sequence.length - 1; i++) {
          if (sequence[i] > root) {
            break;
          }
        }
        for (let j = i; j < sequence.length - 1; j++) {
          if (sequence[j] < root) {
            return false;
          }
        }
        var left = true;
        if (i > 0) {
          left = VerifySquenceOfBST(sequence.slice(0, i));
        }
        var right = true;
        if (i < sequence.length - 1) {
          right = VerifySquenceOfBST(sequence.slice(i, sequence.length - 1));
        }
        return left && right;
      }
    }
```





### 2. 获取最大深度

给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

说明: 叶子节点是指没有子节点的节点。

#### 思路

1. 深度优先遍历 + 分治

2. 一棵二叉树的最大深度等于左子树深度和右子树最大深度的最大值 + 1

```
    function TreeDepth(pRoot) {
      return !pRoot ? 0 : Math.max(TreeDepth(pRoot.left), TreeDepth(pRoot.right)) + 1
    }
```
