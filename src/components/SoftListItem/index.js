'use client'

import { forwardRef } from 'react'
import { ListItem } from '@mui/material'

const SoftListItem = forwardRef(({ children, ...rest }, ref) => (
  <ListItem
    ref={ref}
    {...rest}
  >
    {children}
  </ListItem>
))

SoftListItem.displayName = 'SoftListItem'

export default SoftListItem 