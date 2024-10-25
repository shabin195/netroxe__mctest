import React, { useState } from 'react';
import Tree from './components/Tree';

const App = () => {
  const [data, setData] = useState([
    {
      id: 1,
      serialNumber: '1',
      name: 'City A',
      pincode: '123456',
      districts: [
        {
          id: 2,
          serialNumber: '1.1',
          name: 'District A1',
          pincode: '123457',
          towns: [
            {
              id: 5,
              serialNumber: '1.1.1',
              name: 'Town A1',
              pincode: '123458',
            },
          ],
        },
      ],
      towns: [],
    },
    {
      id: 3,
      serialNumber: '2',
      name: 'City B',
      pincode: '654321',
      districts: [],
      towns: [],
    },
  ]);

  const [newParent, setNewParent] = useState({ name: '', pincode: '' });
  const [isAddingParent, setIsAddingParent] = useState(false);

  // Function to get the next serial number for cities
  const getNextSerialNumber = (parentSerial, existingNodes) => {
    const filteredNodes = existingNodes.filter(node => node.serialNumber.startsWith(parentSerial));
    const existingSerials = filteredNodes.map(node => parseFloat(node.serialNumber.split('.').pop()));
    const nextNumber = existingSerials.length > 0 ? Math.max(...existingSerials) + 1 : 1;
    return parentSerial + (parentSerial ? '.' : '') + nextNumber;
  };

  const updateNode = (id, name, pincode) => {
    const updatedData = data.map((node) => {
      if (node.id === id) {
        return { ...node, name, pincode };
      }
      const updatedDistricts = node.districts.map((district) => {
        if (district.id === id) {
          return { ...district, name, pincode };
        }
        const updatedTowns = district.towns.map((town) => {
          if (town.id === id) {
            return { ...town, name, pincode };
          }
          return town;
        });
        return { ...district, towns: updatedTowns };
      });
      return { ...node, districts: updatedDistricts };
    });
    setData(updatedData);
  };

  const deleteNode = (id) => {
    const updatedData = data.map((node) => {
      const filteredDistricts = node.districts.filter((district) => district.id !== id);
      if (filteredDistricts.length !== node.districts.length) {
        return { ...node, districts: filteredDistricts };
      }

      const updatedDistricts = node.districts.map((district) => {
        const filteredTowns = district.towns.filter((town) => town.id !== id);
        return { ...district, towns: filteredTowns };
      });

      return { ...node, districts: updatedDistricts };
    });
    setData(updatedData);
  };

  const addNode = (parentId, name, pincode) => {
    const parentNode = data.find(node => node.id === parentId);
    const newNode = {
      id: Date.now(), // Unique ID generation
      serialNumber: '', // To be set later
      name,
      pincode,
      districts: [],
      towns: [],
    };

    const updatedData = data.map((node) => {
      if (node.id === parentId) {
        newNode.serialNumber = getNextSerialNumber(node.serialNumber, node.districts);
        return { ...node, districts: [...node.districts, newNode] };
      }

      // Check in existing districts and towns
      const updatedDistricts = node.districts.map((district) => {
        if (district.id === parentId) {
          newNode.serialNumber = getNextSerialNumber(district.serialNumber, district.towns);
          return { ...district, towns: [...district.towns, newNode] };
        }
        return district;
      });

      return { ...node, districts: updatedDistricts };
    });

    setData(updatedData);
  };

  const handleAddParent = () => {
    const newParentNode = {
      id: Date.now(),
      serialNumber: getNextSerialNumber('', data), // Get next serial number for a new city
      name: newParent.name,
      pincode: newParent.pincode,
      districts: [],
      towns: [],
    };
    setData([...data, newParentNode]);
    setNewParent({ name: '', pincode: '' });
    setIsAddingParent(false);
  };

  return (
    <div>
      <h1>City -> District -> Town Management</h1>
      <button onClick={() => setIsAddingParent(!isAddingParent)}>
        {isAddingParent ? 'Cancel Add City' : 'Add New City'}
      </button>
      {isAddingParent && (
        <div className="edit-form">
          <input
            type="text"
            value={newParent.name}
            onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
            placeholder="City Name"
          />
          <input
            type="text"
            value={newParent.pincode}
            onChange={(e) => setNewParent({ ...newParent, pincode: e.target.value })}
            placeholder="Pincode"
          />
          <button onClick={handleAddParent}>Add City</button>
        </div>
      )}
      <Tree data={data} updateNode={updateNode} deleteNode={deleteNode} addNode={addNode} />
    </div>
  );
};

export default App;