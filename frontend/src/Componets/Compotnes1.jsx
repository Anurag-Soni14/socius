import React from 'react'
import user_image from '../assets/user_image.jpeg'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Componets1 = () => {
  return (
    <div className=''>
      <div className="flex flex-wrap gap-6 border-2 border-black rounded-xl w-96  p-3 ">
        <img src={user_image} className=' w-16 border border-black rounded-full ' alt="" />
        <div className="">
          <h1>_drashan_123</h1>
          <h1>darshan dhameliya</h1>
        </div>
        <Box sx={{ '& button': { m: 1 } }}>
          <Button variant="contained" size="medium">
            Medium
          </Button>
        </Box>
      </div>
    </div>
  )
}

export default Componets1
