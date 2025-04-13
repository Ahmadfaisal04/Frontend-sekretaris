'use client'

import { forwardRef } from 'react'
import { Toolbar } from '@mui/material'

const SoftToolbar = forwardRef(({ children, ...rest }, ref) => (
  <Toolbar
    ref={ref}
    {...rest}
  >
    {children}
  </Toolbar>
))

SoftToolbar.displayName = 'SoftToolbar'

export default SoftToolbar 