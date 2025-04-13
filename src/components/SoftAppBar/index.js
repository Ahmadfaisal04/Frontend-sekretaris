'use client'

import { forwardRef } from 'react'
import { AppBar } from '@mui/material'

const SoftAppBar = forwardRef(({ children, ...rest }, ref) => (
  <AppBar
    ref={ref}
    {...rest}
  >
    {children}
  </AppBar>
))

SoftAppBar.displayName = 'SoftAppBar'

export default SoftAppBar 