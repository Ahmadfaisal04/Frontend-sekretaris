'use client'

import { forwardRef } from 'react'
import { List } from '@mui/material'

const SoftList = forwardRef(({ children, ...rest }, ref) => (
  <List
    ref={ref}
    {...rest}
  >
    {children}
  </List>
))

SoftList.displayName = 'SoftList'

export default SoftList 