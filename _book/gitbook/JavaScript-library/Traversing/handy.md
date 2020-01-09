# 二叉树遍历





## 一、 介绍：

所谓二叉树的遍历，是指按照一定的顺序对二叉树的每一个节点均访问一次，且只访问一次。

![](../image/js-traversing.png)




## 二、方式

按照访问根节点的访问位置不同通常把二叉树的遍历分为三种方式：

前序遍历、中序遍历、后序遍历



## 2.1 前序遍历

首先访问根节点，然后访问根节点的左子树，在访问根节点的右子树。


遍历结果：abdefgc

```
function DLR(tree){
    console.log(tree.value);
    if(tree.left){
        DLR(tree.left);
    }
    if(tree.right){
        DLR(tree.right);
    }
}
var inorderTraversal = function (root) {
    const result = [];
    const stack = [];
    let current = root;
    while (current || stack.length > 0) {
    while (current) {
        stack.push(current);
        result.push(current.val);
        current = current.left;
    }
    current = stack.pop();
    current = current.right;
    }
    return result;
};

```



## 2.2 中序遍历

首先访问根节点的左子树，然后访问根节点，再访问根节点右子树

遍历结果: debgfac


```
function LDR(tree){
    if(tree.left){
        LDR(tree.left);
    }
    console.log(tree.data);
    if(tree.right){
        LDR(tree.right);
    }
}
var inorderTraversal = function (root) {
    const result = [];
    const stack = [];
    let current = root;
    while (current || stack.length > 0) {
    while (current) {
        stack.push(current);
        current = current.left;
    }
    current = stack.pop();
    result.push(current.data);
    current = current.right;
    }
    return result;
};
```



## 2.3 后序遍历

首先访问根节点的左子树，然后访问根节点的右子树，最后访问根节点

遍历结果：edgfbca

```
function LRD(tree){
    if(tree.left){
        LRD(tree.left);
    }
    if(tree.right){
        LRD(tree.right);
    }
    console.log(tree.value);
} 
// 取跟节点为目标节点，开始遍历
//     1.左孩子入栈 -> 直至左孩子为空的节点
//     2.栈顶节点的右节点为空或右节点被访问过 -> 节点出栈并访问他，将节点标记为已访问
//      current.right == last 用来记录右面已经访问了，可以输出中间值了
//     3.栈顶节点的右节点不为空且未被访问，以右孩子为目标节点，再依次执行1、2、3
var inorderTraversal = function (root) {
    const result = [];
    const stack = [];
    let current = root;
    while (current || stack.length > 0) {
    while (current) {
        stack.push(current);
        result.push(current.val);
        current = current.left;
    }
    current = stack[stack.length - 1];
    if (!current.right || current.right == last) {
        current = stack.pop();
        result.push(current.data);
        last = current;
        current = null; // 继续弹栈
    } else {
        current = current.right;
    }
    }
    return result;
};
```