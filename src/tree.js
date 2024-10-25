// import React, { useState } from 'react';
// import Button from '@mui/material/Button';
// import ChildTree from './ChildTree';
// import { TreeView, TreeItem } from '@mui/lab';

// const Tree = () => {
//   const [getDataFinal, setDataFinal] = useState([
//     {
//       id: '1', // Changed to string
//       label: "Parent 1",
//       children: [
//         {
//           id: '2', // Changed to string
//           label: "Child 1-1",
//           children: [
//             { id: '3', label: "Child 1-1-1" }, // Changed to string
//             { id: '4', label: "Child 1-1-2" }  // Changed to string
//           ]
//         },
//         { id: '5', label: "Child 1-2" } // Changed to string
//       ]
//     },
//     {
//       id: '6', // Changed to string
//       label: "Parent 2",
//       children: [
//         { id: '7', label: "Child 2-1" }, // Changed to string
//         { id: '8', label: "Child 2-2" }  // Changed to string
//       ]
//     }
//   ]);
//   const [getName, setName] = useState("");
//   const [getEdit, setEdit] = useState(null);
//   const [getNameEdit, setNameEdit] = useState("");

//   const renderTree = (nodes) => (
//     <TreeItem 
//     key={nodes.id} 
//     nodeId={nodes.id} 
//     label={nodes.label}>
//       {Array.isArray(nodes.children)
//         ? nodes.children.map((node) => renderTree(node))
//         : null}
//     </TreeItem>
//   );
//   return (
//     <div>
//       <h1>Group Management</h1>
//       <Button variant="contained" color="primary">Add Primary Group</Button>
// <div>
//       {/* <TreeView defaultCollapseIcon={<span>-</span>} defaultExpandIcon={<span>+</span>}> */}
//       <TreeView>
//         {getDataFinal.map((node) => renderTree(node))}

//       </TreeView>
//       </div>
//       <div>
//       </div>
//       <ChildTree />
//     </div>
//   );
// };

// export default Tree;

import React, { useState } from "react";

// import { TreeView, TreeItem } from '@mui/x-tree-view';

import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'; // Adjust based on the new API




import { Button, TextField, IconButton } from "@mui/material";
import { Add, Delete, Edit, Save } from "@mui/icons-material";

const Tree = () => {
  const [treeData, setTreeData] = useState([
    {
      id: "1",
      name: "Parent 1",
      children: [{ id: "2", name: "Child 1", children: [] }],
    },
  ]);
  const [newNodeName, setNewNodeName] = useState("");
  const [editingNode, setEditingNode] = useState(null);
  const [editNodeName, setEditNodeName] = useState("");

  console.log("---------1----treeData---------",treeData)
  // Function to generate unique node IDs
  const generateId = () => `${Math.random().toString(36).substr(2, 9)}`;

  // Function to recursively find and update the tree
  const updateTree = (nodes, id, callback) => {
    return nodes.map((node) => {
      if (node.id === id) {
        return callback(node);
      } else if (node.children) {
        return { ...node, children: updateTree(node.children, id, callback) };
      }
      return node;
    });
  };

  // Function to add a node to the parent
  const addNode = (parentId) => {
    if (!newNodeName) return alert("Node name can't be empty");
    const newNode = { id: generateId(), name: newNodeName, children: [] };
    setTreeData((prevTree) =>
      updateTree(prevTree, parentId, (parent) => ({
        ...parent,
        children: [...parent.children, newNode],
      }))
    );
    setNewNodeName("");
  };

  // Function to edit a node
  const handleEdit = (node) => {
    setEditingNode(node.id);
    setEditNodeName(node.name);
  };

  // Function to save the edited node name
  const saveEdit = (nodeId) => {
    setTreeData((prevTree) =>
      updateTree(prevTree, nodeId, (node) => ({
        ...node,
        name: editNodeName,
      }))
    );
    setEditingNode(null);
    setEditNodeName("");
  };

  // Function to delete a node
  const deleteNode = (nodeId) => {
    const removeNode = (nodes, id) =>
      nodes.filter((node) => node.id !== id).map((node) => ({
        ...node,
        children: removeNode(node.children || [], id),
      }));

    setTreeData((prevTree) => removeNode(prevTree, nodeId));
  };

  // Submit button to convert tree to JSON
  const handleSubmit = () => {
    console.log(JSON.stringify(treeData, null, 2));
  };

  // Recursive function to render tree items
  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        editingNode === nodes.id ? (
          <div>
            <TextField
              size="small"
              value={editNodeName}
              onChange={(e) => setEditNodeName(e.target.value)}
            />
            <IconButton onClick={() => saveEdit(nodes.id)}>
              <Save />
            </IconButton>
          </div>
        ) : (
          <div>
            {nodes.name}
            <IconButton onClick={() => handleEdit(nodes)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => deleteNode(nodes.id)}>
              <Delete />
            </IconButton>
          </div>
        )
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((childNode) => renderTree(childNode))
        : null}
    </TreeItem>
  );

  return (
    <div>

      
      <SimpleTreeView>
        {treeData.map((data) => renderTree(data))}
      </SimpleTreeView>

      <div>
        <TextField
          label="New Node Name"
          value={newNodeName}
          onChange={(e) => setNewNodeName(e.target.value)}
        />
        <Button
          onClick={() => addNode("1")} // Adds to Parent with ID "1"
          variant="contained"
          startIcon={<Add />}
        >
          Add Node to Parent 1
        </Button>
      </div>

      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default Tree;
