'use client'

import { forwardRef } from 'react'
import { Drawer } from '@mui/material'

const SoftDrawer = forwardRef(({ children, ...rest }, ref) => (
  <Drawer
    ref={ref}
    {...rest}
  >
    {children}
  </Drawer>
))

SoftDrawer.displayName = 'SoftDrawer'

export default SoftDrawer 