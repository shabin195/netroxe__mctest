import React, { useState } from 'react';
import { IconButton, Tooltip, TextField, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const ChildTree = () => {

    return (
        <div>
  
         
<TextField/>

<Tooltip title="Add" arrow>
<IconButton>
          <AddIcon />
        </IconButton>
        </Tooltip>


<Tooltip title="Edit" arrow>
<IconButton>
          <EditIcon />
        </IconButton>
        </Tooltip>


        <Tooltip title="Delete" arrow>
<IconButton>
          <DeleteIcon />
        </IconButton>
        </Tooltip>


        <Button>Add Childs</Button>
        </div>
      );

}
export default ChildTree;