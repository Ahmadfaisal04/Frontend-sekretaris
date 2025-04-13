'use client'

import { forwardRef } from 'react'
import { Button } from '@mui/material'

const SoftButton = forwardRef(({ children, ...rest }, ref) => (
  <Button
    ref={ref}
    {...rest}
  >
    {children}
  </Button>
))

SoftButton.displayName = 'SoftButton'

export default SoftButton 