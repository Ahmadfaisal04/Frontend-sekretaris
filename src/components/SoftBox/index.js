'use client'

import { forwardRef } from 'react'
import { Box } from '@mui/material'

const SoftBox = forwardRef(({ children, ...rest }, ref) => (
  <Box
    ref={ref}
    {...rest}
  >
    {children}
  </Box>
))

SoftBox.displayName = 'SoftBox'

export default SoftBox 