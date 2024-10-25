import React, { useState } from 'react';
import './Tree.css';

const TreeNode = ({ node, level, updateNode, deleteNode, addNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', pincode: '' });

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    setFormData({ name: node.name, pincode: node.pincode });
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteNode(node.id);
  };

  const handleSave = () => {
    updateNode(node.id, formData.name, formData.pincode);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAdd = () => {
    addNode(node.id, formData.name, formData.pincode);
    setFormData({ name: '', pincode: '' });
    setIsAdding(false);
  };

  return (
    <div className={`tree-node ${level === 0 ? 'parent' : 'child'}`} style={{ paddingLeft: level * 20 }}>
      <div className="node-label" onClick={handleToggle}>
        {isExpanded ? '▼' : '▶'} {node.serialNumber} - {node.name} (Pincode: {node.pincode})
        <button onClick={handleEdit} className="action-button">Edit</button>
        <button onClick={handleDelete} className="action-button">Delete</button>
        <button onClick={() => setIsAdding(!isAdding)} className="action-button">
          {isAdding ? 'Cancel' : 'Add'}
        </button>
      </div>

      {isEditing && (
        <div className="edit-form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}

      {isAdding && (
        <div className="edit-form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="New Name"
          />
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="New Pincode"
          />
          <button onClick={handleAdd}>Add</button>
          <button onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      )}

      {isExpanded && node.districts && (
        <div>
          {node.districts.map((district) => (
            <TreeNode
              key={district.id}
              node={district}
              level={level + 1}
              updateNode={updateNode}
              deleteNode={deleteNode}
              addNode={addNode}
            />
          ))}
        </div>
      )}

      {isExpanded && node.towns && (
        <div>
          {node.towns.map((town) => (
            <TreeNode
              key={town.id}
              node={town}
              level={level + 1}
              updateNode={updateNode}
              deleteNode={deleteNode}
              addNode={addNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Tree = ({ data, updateNode, deleteNode, addNode }) => {
  return (
    <div className="tree-container">     
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          updateNode={updateNode}
          deleteNode={deleteNode}
          addNode={addNode}
        />
      ))}
    </div>
  );
};

export default Tree;
