class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }

  addNode(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
    } else {
      this.addNodeRecursive(this.root, newNode);
    }
  }

  addNodeRecursive(node, newNode) {
    if (newNode.value.nome < node.value.nome) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.addNodeRecursive(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.addNodeRecursive(node.right, newNode);
      }
    }
  }

  searchNode(node, value) {
    if (node === null || node.value.nome === value) {
      return node;
    }

    if (value < node.value.nome) {
      return this.searchNode(node.left, value);
    }

    return this.searchNode(node.right, value);
  }

  search(value) {
    return this.searchNode(this.root, value);
  }
}

module.exports = {
  BinaryTree,
  Node
};
